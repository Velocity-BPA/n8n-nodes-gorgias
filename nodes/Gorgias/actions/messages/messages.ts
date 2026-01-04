/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties, IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { gorgiasApiRequest, gorgiasApiRequestAllItems } from '../../transport/gorgiasApi';
import { MESSAGE_TYPES, TICKET_CHANNELS, MESSAGE_SENDER_TYPES } from '../../constants/constants';

export const messageOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['message'],
      },
    },
    options: [
      { name: 'Create', value: 'create', description: 'Create a message in a ticket', action: 'Create message' },
      { name: 'Create Internal Note', value: 'createInternalNote', description: 'Create an internal note', action: 'Create internal note' },
      { name: 'Delete', value: 'delete', description: 'Delete a message', action: 'Delete message' },
      { name: 'Get', value: 'get', description: 'Get a message by ID', action: 'Get message' },
      { name: 'Get Many', value: 'getAll', description: 'Get many messages', action: 'Get many messages' },
      { name: 'Send', value: 'send', description: 'Send an outbound message', action: 'Send message' },
      { name: 'Update', value: 'update', description: 'Update a message', action: 'Update message' },
    ],
    default: 'getAll',
  },
];

export const messageFields: INodeProperties[] = [
  // Message ID
  {
    displayName: 'Message ID',
    name: 'messageId',
    type: 'number',
    required: true,
    default: 0,
    displayOptions: {
      show: {
        resource: ['message'],
        operation: ['get', 'update', 'delete'],
      },
    },
    description: 'The ID of the message',
  },
  // Ticket ID for create, send, createInternalNote
  {
    displayName: 'Ticket ID',
    name: 'ticketId',
    type: 'number',
    required: true,
    default: 0,
    displayOptions: {
      show: {
        resource: ['message'],
        operation: ['create', 'send', 'createInternalNote'],
      },
    },
    description: 'The ID of the ticket to add the message to',
  },
  // Body text for create messages
  {
    displayName: 'Body (HTML)',
    name: 'bodyHtml',
    type: 'string',
    typeOptions: {
      rows: 4,
    },
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['message'],
        operation: ['create', 'send', 'createInternalNote'],
      },
    },
    description: 'The HTML body of the message',
  },
  // Channel for create
  {
    displayName: 'Channel',
    name: 'channel',
    type: 'options',
    options: TICKET_CHANNELS.map((c) => ({ name: c.name, value: c.value })),
    required: true,
    default: 'email',
    displayOptions: {
      show: {
        resource: ['message'],
        operation: ['create', 'send'],
      },
    },
    description: 'The channel for the message',
  },
  // Sender type
  {
    displayName: 'Sender Type',
    name: 'senderType',
    type: 'options',
    options: MESSAGE_SENDER_TYPES.map((s) => ({ name: s.name, value: s.value })),
    required: true,
    default: 'user',
    displayOptions: {
      show: {
        resource: ['message'],
        operation: ['create'],
      },
    },
    description: 'The type of sender for the message',
  },
  // Return All
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    default: false,
    displayOptions: {
      show: {
        resource: ['message'],
        operation: ['getAll'],
      },
    },
    description: 'Whether to return all results or only up to a given limit',
  },
  {
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    typeOptions: {
      minValue: 1,
      maxValue: 100,
    },
    default: 50,
    displayOptions: {
      show: {
        resource: ['message'],
        operation: ['getAll'],
        returnAll: [false],
      },
    },
    description: 'Max number of results to return',
  },
  // Update fields
  {
    displayName: 'Update Fields',
    name: 'updateFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['message'],
        operation: ['update'],
      },
    },
    options: [
      {
        displayName: 'Body (HTML)',
        name: 'body_html',
        type: 'string',
        typeOptions: {
          rows: 4,
        },
        default: '',
        description: 'The HTML body of the message',
      },
      {
        displayName: 'Body (Text)',
        name: 'body_text',
        type: 'string',
        typeOptions: {
          rows: 4,
        },
        default: '',
        description: 'The plain text body of the message',
      },
    ],
  },
  // Additional fields for create
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['message'],
        operation: ['create', 'send'],
      },
    },
    options: [
      {
        displayName: 'Body (Text)',
        name: 'body_text',
        type: 'string',
        typeOptions: {
          rows: 4,
        },
        default: '',
        description: 'The plain text body of the message',
      },
      {
        displayName: 'From Email',
        name: 'from_email',
        type: 'string',
        default: '',
        description: 'The sender email address',
      },
      {
        displayName: 'To Email',
        name: 'to_email',
        type: 'string',
        default: '',
        description: 'The recipient email address',
      },
      {
        displayName: 'Subject',
        name: 'subject',
        type: 'string',
        default: '',
        description: 'The subject of the message',
      },
      {
        displayName: 'Public',
        name: 'public',
        type: 'boolean',
        default: true,
        description: 'Whether the message is visible to customers',
      },
    ],
  },
  // Filters for getAll
  {
    displayName: 'Filters',
    name: 'filters',
    type: 'collection',
    placeholder: 'Add Filter',
    default: {},
    displayOptions: {
      show: {
        resource: ['message'],
        operation: ['getAll'],
      },
    },
    options: [
      {
        displayName: 'Ticket ID',
        name: 'ticket_id',
        type: 'number',
        default: 0,
        description: 'Filter by ticket ID',
      },
      {
        displayName: 'Message Type',
        name: 'message_type',
        type: 'options',
        options: MESSAGE_TYPES.map((m) => ({ name: m.name, value: m.value })),
        default: '',
        description: 'Filter by message type',
      },
      {
        displayName: 'Channel',
        name: 'channel',
        type: 'options',
        options: TICKET_CHANNELS.map((c) => ({ name: c.name, value: c.value })),
        default: '',
        description: 'Filter by channel',
      },
      {
        displayName: 'Created After',
        name: 'created_datetime__gte',
        type: 'dateTime',
        default: '',
        description: 'Filter messages created after this date',
      },
      {
        displayName: 'Created Before',
        name: 'created_datetime__lte',
        type: 'dateTime',
        default: '',
        description: 'Filter messages created before this date',
      },
      {
        displayName: 'Order By',
        name: 'order_by',
        type: 'options',
        options: [
          { name: 'Created (Newest First)', value: 'created_datetime:desc' },
          { name: 'Created (Oldest First)', value: 'created_datetime:asc' },
        ],
        default: 'created_datetime:desc',
        description: 'Sort order for messages',
      },
    ],
  },
];

export async function executeMessageOperations(
  this: IExecuteFunctions,
  operation: string,
  i: number,
): Promise<IDataObject | IDataObject[]> {
  let responseData: IDataObject | IDataObject[] = {};

  if (operation === 'getAll') {
    const returnAll = this.getNodeParameter('returnAll', i) as boolean;
    const filters = this.getNodeParameter('filters', i, {}) as IDataObject;
    const query: IDataObject = {};

    for (const [key, value] of Object.entries(filters)) {
      if (value !== undefined && value !== '' && value !== 0) {
        query[key] = value;
      }
    }

    if (returnAll) {
      responseData = await gorgiasApiRequestAllItems.call(this, 'GET', '/messages', {}, query);
    } else {
      const limit = this.getNodeParameter('limit', i) as number;
      query.limit = limit;
      const response = await gorgiasApiRequest.call(this, 'GET', '/messages', {}, query);
      responseData = (response.data as IDataObject[]) || [];
    }
  } else if (operation === 'get') {
    const messageId = this.getNodeParameter('messageId', i) as number;
    responseData = await gorgiasApiRequest.call(this, 'GET', `/messages/${messageId}`);
  } else if (operation === 'create') {
    const ticketId = this.getNodeParameter('ticketId', i) as number;
    const bodyHtml = this.getNodeParameter('bodyHtml', i) as string;
    const channel = this.getNodeParameter('channel', i) as string;
    const senderType = this.getNodeParameter('senderType', i) as string;
    const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;

    const requestBody: IDataObject = {
      ticket_id: ticketId,
      channel,
      via: 'api',
      body_html: bodyHtml,
      sender: {
        type: senderType,
      },
      source: {
        type: channel,
      },
    };

    if (additionalFields.from_email) {
      (requestBody.source as IDataObject).from = { address: additionalFields.from_email };
      delete additionalFields.from_email;
    }

    if (additionalFields.to_email) {
      (requestBody.source as IDataObject).to = [{ address: additionalFields.to_email }];
      delete additionalFields.to_email;
    }

    Object.assign(requestBody, additionalFields);
    responseData = await gorgiasApiRequest.call(this, 'POST', '/messages', requestBody);
  } else if (operation === 'createInternalNote') {
    const ticketId = this.getNodeParameter('ticketId', i) as number;
    const bodyHtml = this.getNodeParameter('bodyHtml', i) as string;

    const requestBody: IDataObject = {
      ticket_id: ticketId,
      channel: 'internal-note',
      via: 'api',
      body_html: bodyHtml,
      public: false,
      sender: {
        type: 'user',
      },
      source: {
        type: 'internal-note',
      },
    };

    responseData = await gorgiasApiRequest.call(this, 'POST', '/messages', requestBody);
  } else if (operation === 'send') {
    const ticketId = this.getNodeParameter('ticketId', i) as number;
    const bodyHtml = this.getNodeParameter('bodyHtml', i) as string;
    const channel = this.getNodeParameter('channel', i) as string;
    const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;

    const requestBody: IDataObject = {
      ticket_id: ticketId,
      channel,
      via: 'api',
      body_html: bodyHtml,
      sender: {
        type: 'user',
      },
      source: {
        type: channel,
      },
      actions: [{ type: 'send' }],
    };

    if (additionalFields.from_email) {
      (requestBody.source as IDataObject).from = { address: additionalFields.from_email };
      delete additionalFields.from_email;
    }

    if (additionalFields.to_email) {
      (requestBody.source as IDataObject).to = [{ address: additionalFields.to_email }];
      delete additionalFields.to_email;
    }

    Object.assign(requestBody, additionalFields);
    responseData = await gorgiasApiRequest.call(this, 'POST', '/messages', requestBody);
  } else if (operation === 'update') {
    const messageId = this.getNodeParameter('messageId', i) as number;
    const updateFields = this.getNodeParameter('updateFields', i, {}) as IDataObject;

    responseData = await gorgiasApiRequest.call(this, 'PUT', `/messages/${messageId}`, updateFields);
  } else if (operation === 'delete') {
    const messageId = this.getNodeParameter('messageId', i) as number;
    await gorgiasApiRequest.call(this, 'DELETE', `/messages/${messageId}`);
    responseData = { success: true, messageId };
  }

  return responseData;
}
