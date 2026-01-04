/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
} from 'n8n-workflow';

// Resource operations and fields
import { ticketOperations, ticketFields, executeTicketOperations } from './actions/tickets/tickets';
import { messageOperations, messageFields, executeMessageOperations } from './actions/messages/messages';
import { customerOperations, customerFields, executeCustomerOperations } from './actions/customers/customers';
import { userOperations, userFields, executeUserOperations } from './actions/users/users';
import { teamOperations, teamFields, executeTeamOperations } from './actions/teams/teams';
import { tagOperations, tagFields, executeTagOperations } from './actions/tags/tags';
import { viewOperations, viewFields, executeViewOperations } from './actions/views/views';
import { macroOperations, macroFields, executeMacroOperations } from './actions/macros/macros';
import { ruleOperations, ruleFields, executeRuleOperations } from './actions/rules/rules';
import { integrationOperations, integrationFields, executeIntegrationOperations } from './actions/integrations/integrations';
import { widgetOperations, widgetFields, executeWidgetOperations } from './actions/widgets/widgets';
import { channelOperations, channelFields, executeChannelOperations } from './actions/channels/channels';
import { statisticsOperations, statisticsFields, executeStatisticsOperations } from './actions/statistics/statistics';
import { satisfactionOperations, satisfactionFields, executeSatisfactionOperations } from './actions/satisfaction/satisfaction';

// Emit licensing notice once on load
const LICENSING_NOTICE = `[Velocity BPA Licensing Notice]

This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).

Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.

For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.`;

let licensingNoticeEmitted = false;

export class Gorgias implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Gorgias',
    name: 'gorgias',
    icon: 'file:gorgias.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Interact with Gorgias e-commerce helpdesk API',
    defaults: {
      name: 'Gorgias',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'gorgiasApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          { name: 'Channel', value: 'channel' },
          { name: 'Customer', value: 'customer' },
          { name: 'Integration', value: 'integration' },
          { name: 'Macro', value: 'macro' },
          { name: 'Message', value: 'message' },
          { name: 'Rule', value: 'rule' },
          { name: 'Satisfaction', value: 'satisfaction' },
          { name: 'Statistics', value: 'statistics' },
          { name: 'Tag', value: 'tag' },
          { name: 'Team', value: 'team' },
          { name: 'Ticket', value: 'ticket' },
          { name: 'User', value: 'user' },
          { name: 'View', value: 'view' },
          { name: 'Widget', value: 'widget' },
        ],
        default: 'ticket',
      },
      // All operations
      ...ticketOperations,
      ...messageOperations,
      ...customerOperations,
      ...userOperations,
      ...teamOperations,
      ...tagOperations,
      ...viewOperations,
      ...macroOperations,
      ...ruleOperations,
      ...integrationOperations,
      ...widgetOperations,
      ...channelOperations,
      ...statisticsOperations,
      ...satisfactionOperations,
      // All fields
      ...ticketFields,
      ...messageFields,
      ...customerFields,
      ...userFields,
      ...teamFields,
      ...tagFields,
      ...viewFields,
      ...macroFields,
      ...ruleFields,
      ...integrationFields,
      ...widgetFields,
      ...channelFields,
      ...statisticsFields,
      ...satisfactionFields,
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    // Emit licensing notice once
    if (!licensingNoticeEmitted) {
      this.logger.warn(LICENSING_NOTICE);
      licensingNoticeEmitted = true;
    }

    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];
    const resource = this.getNodeParameter('resource', 0) as string;
    const operation = this.getNodeParameter('operation', 0) as string;

    for (let i = 0; i < items.length; i++) {
      try {
        let responseData;

        switch (resource) {
          case 'ticket':
            responseData = await executeTicketOperations.call(this, operation, i);
            break;
          case 'message':
            responseData = await executeMessageOperations.call(this, operation, i);
            break;
          case 'customer':
            responseData = await executeCustomerOperations.call(this, operation, i);
            break;
          case 'user':
            responseData = await executeUserOperations.call(this, operation, i);
            break;
          case 'team':
            responseData = await executeTeamOperations.call(this, operation, i);
            break;
          case 'tag':
            responseData = await executeTagOperations.call(this, operation, i);
            break;
          case 'view':
            responseData = await executeViewOperations.call(this, operation, i);
            break;
          case 'macro':
            responseData = await executeMacroOperations.call(this, operation, i);
            break;
          case 'rule':
            responseData = await executeRuleOperations.call(this, operation, i);
            break;
          case 'integration':
            responseData = await executeIntegrationOperations.call(this, operation, i);
            break;
          case 'widget':
            responseData = await executeWidgetOperations.call(this, operation, i);
            break;
          case 'channel':
            responseData = await executeChannelOperations.call(this, operation, i);
            break;
          case 'statistics':
            responseData = await executeStatisticsOperations.call(this, operation, i);
            break;
          case 'satisfaction':
            responseData = await executeSatisfactionOperations.call(this, operation, i);
            break;
          default:
            throw new Error(`Unknown resource: ${resource}`);
        }

        // Handle array vs single response
        if (Array.isArray(responseData)) {
          for (const item of responseData) {
            returnData.push({ json: item });
          }
        } else {
          returnData.push({ json: responseData });
        }
      } catch (error) {
        if (this.continueOnFail()) {
          returnData.push({
            json: {
              error: (error as Error).message,
            },
            pairedItem: { item: i },
          });
          continue;
        }
        throw error;
      }
    }

    return [returnData];
  }
}
