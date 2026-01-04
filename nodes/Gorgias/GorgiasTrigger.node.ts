/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
  IHookFunctions,
  IWebhookFunctions,
  IDataObject,
  INodeType,
  INodeTypeDescription,
  IWebhookResponseData,
} from 'n8n-workflow';

import { gorgiasApiRequest } from './transport/gorgiasApi';

// Emit licensing notice once on load
const LICENSING_NOTICE = `[Velocity BPA Licensing Notice]

This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).

Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.

For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.`;

let licensingNoticeEmitted = false;

export class GorgiasTrigger implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Gorgias Trigger',
    name: 'gorgiasTrigger',
    icon: 'file:gorgias.svg',
    group: ['trigger'],
    version: 1,
    subtitle: '={{$parameter["event"]}}',
    description: 'Handle Gorgias webhook events',
    defaults: {
      name: 'Gorgias Trigger',
    },
    inputs: [],
    outputs: ['main'],
    credentials: [
      {
        name: 'gorgiasApi',
        required: true,
      },
    ],
    webhooks: [
      {
        name: 'default',
        httpMethod: 'POST',
        responseMode: 'onReceived',
        path: 'webhook',
      },
    ],
    properties: [
      {
        displayName: 'Event',
        name: 'event',
        type: 'options',
        required: true,
        default: 'ticket-created',
        options: [
          {
            name: 'Customer Created',
            value: 'customer-created',
            description: 'Triggered when a new customer is created',
          },
          {
            name: 'Customer Updated',
            value: 'customer-updated',
            description: 'Triggered when a customer is updated',
          },
          {
            name: 'Message Created',
            value: 'message-created',
            description: 'Triggered when a new message is received',
          },
          {
            name: 'Message Sent',
            value: 'message-sent',
            description: 'Triggered when a message is sent',
          },
          {
            name: 'Satisfaction Received',
            value: 'satisfaction-received',
            description: 'Triggered when a CSAT response is received',
          },
          {
            name: 'Ticket Assigned',
            value: 'ticket-assigned',
            description: 'Triggered when a ticket is assigned',
          },
          {
            name: 'Ticket Closed',
            value: 'ticket-closed',
            description: 'Triggered when a ticket is closed',
          },
          {
            name: 'Ticket Created',
            value: 'ticket-created',
            description: 'Triggered when a new ticket is created',
          },
          {
            name: 'Ticket Opened',
            value: 'ticket-opened',
            description: 'Triggered when a ticket is reopened',
          },
          {
            name: 'Ticket Tagged',
            value: 'ticket-tagged',
            description: 'Triggered when a tag is added to a ticket',
          },
          {
            name: 'Ticket Updated',
            value: 'ticket-updated',
            description: 'Triggered when a ticket is updated',
          },
        ],
        description: 'The event type to listen for',
      },
      {
        displayName: 'Options',
        name: 'options',
        type: 'collection',
        placeholder: 'Add Option',
        default: {},
        options: [
          {
            displayName: 'Integration Name',
            name: 'integrationName',
            type: 'string',
            default: 'n8n Webhook',
            description: 'Name for the HTTP integration in Gorgias',
          },
          {
            displayName: 'Headers',
            name: 'headers',
            type: 'json',
            default: '{}',
            description: 'Custom HTTP headers to include in webhook requests (JSON format)',
          },
        ],
      },
    ],
  };

  webhookMethods = {
    default: {
      async checkExists(this: IHookFunctions): Promise<boolean> {
        const webhookUrl = this.getNodeWebhookUrl('default');
        const event = this.getNodeParameter('event') as string;

        try {
          // List existing integrations to find our webhook
          const response = await gorgiasApiRequest.call(this, 'GET', '/integrations', {}, { type: 'http' });
          const integrations = (response.data as IDataObject[]) || [];

          for (const integration of integrations) {
            if (integration.http_url === webhookUrl && integration.trigger_events) {
              const events = integration.trigger_events as string[];
              if (events.includes(event)) {
                // Store integration ID for deletion
                const webhookData = this.getWorkflowStaticData('node');
                webhookData.integrationId = integration.id;
                return true;
              }
            }
          }
        } catch {
          return false;
        }

        return false;
      },

      async create(this: IHookFunctions): Promise<boolean> {
        // Emit licensing notice
        if (!licensingNoticeEmitted) {
          this.logger.warn(LICENSING_NOTICE);
          licensingNoticeEmitted = true;
        }

        const webhookUrl = this.getNodeWebhookUrl('default');
        const event = this.getNodeParameter('event') as string;
        const options = this.getNodeParameter('options', {}) as IDataObject;

        const integrationName = (options.integrationName as string) || 'n8n Webhook';
        let headers = {};

        if (options.headers) {
          try {
            headers = JSON.parse(options.headers as string);
          } catch {
            headers = {};
          }
        }

        const requestBody: IDataObject = {
          name: integrationName,
          type: 'http',
          http_url: webhookUrl,
          http_method: 'POST',
          http_headers: headers,
          trigger_events: [event],
          enabled: true,
        };

        try {
          const response = await gorgiasApiRequest.call(this, 'POST', '/integrations', requestBody);

          // Store integration ID for later deletion
          const webhookData = this.getWorkflowStaticData('node');
          webhookData.integrationId = response.id;

          return true;
        } catch (error) {
          throw new Error(`Failed to create Gorgias HTTP integration: ${(error as Error).message}`);
        }
      },

      async delete(this: IHookFunctions): Promise<boolean> {
        const webhookData = this.getWorkflowStaticData('node');
        const integrationId = webhookData.integrationId as number;

        if (!integrationId) {
          // No integration to delete
          return true;
        }

        try {
          await gorgiasApiRequest.call(this, 'DELETE', `/integrations/${integrationId}`);
        } catch (error) {
          // Log but don't fail - integration may have been deleted manually
          this.logger.warn(`Failed to delete Gorgias integration: ${(error as Error).message}`);
        }

        delete webhookData.integrationId;
        return true;
      },
    },
  };

  async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
    const bodyData = this.getBodyData();
    const headerData = this.getHeaderData();
    const event = this.getNodeParameter('event') as string;

    // Verify this is the correct event type
    const receivedEvent = bodyData.event || (headerData['x-gorgias-event'] as string);
    
    if (receivedEvent && receivedEvent !== event) {
      // Event doesn't match, ignore
      return {
        webhookResponse: { received: true, ignored: true },
      };
    }

    // Extract relevant data based on event type
    const responseData: IDataObject = {
      event: receivedEvent || event,
      timestamp: new Date().toISOString(),
      ...bodyData,
    };

    return {
      workflowData: [
        this.helpers.returnJsonArray([responseData]),
      ],
    };
  }
}
