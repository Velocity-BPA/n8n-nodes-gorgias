/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties, IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { gorgiasApiRequest, gorgiasApiRequestAllItems } from '../../transport/gorgiasApi';

export const channelOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['channel'],
      },
    },
    options: [
      { name: 'Get', value: 'get', description: 'Get a channel by ID', action: 'Get channel' },
      { name: 'Get Many', value: 'getAll', description: 'Get many channels', action: 'Get many channels' },
      { name: 'Update', value: 'update', description: 'Update channel settings', action: 'Update channel' },
    ],
    default: 'getAll',
  },
];

export const channelFields: INodeProperties[] = [
  // Channel ID
  {
    displayName: 'Channel ID',
    name: 'channelId',
    type: 'number',
    required: true,
    default: 0,
    displayOptions: {
      show: {
        resource: ['channel'],
        operation: ['get', 'update'],
      },
    },
    description: 'The ID of the channel',
  },
  // Return All
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    default: false,
    displayOptions: {
      show: {
        resource: ['channel'],
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
        resource: ['channel'],
        operation: ['getAll'],
        returnAll: [false],
      },
    },
    description: 'Max number of results to return',
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
        resource: ['channel'],
        operation: ['getAll'],
      },
    },
    options: [
      {
        displayName: 'Type',
        name: 'type',
        type: 'options',
        options: [
          { name: 'Email', value: 'email' },
          { name: 'Chat', value: 'chat' },
          { name: 'Phone', value: 'phone' },
          { name: 'SMS', value: 'sms' },
          { name: 'Facebook', value: 'facebook' },
          { name: 'Facebook Messenger', value: 'facebook-messenger' },
          { name: 'Instagram', value: 'instagram' },
          { name: 'Instagram Comments', value: 'instagram-comments' },
          { name: 'Twitter', value: 'twitter' },
          { name: 'WhatsApp', value: 'whatsapp' },
          { name: 'API', value: 'api' },
          { name: 'Internal Note', value: 'internal-note' },
        ],
        default: '',
        description: 'Filter by channel type',
      },
      {
        displayName: 'Active',
        name: 'active',
        type: 'boolean',
        default: true,
        description: 'Filter by active status',
      },
    ],
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
        resource: ['channel'],
        operation: ['update'],
      },
    },
    options: [
      {
        displayName: 'Name',
        name: 'name',
        type: 'string',
        default: '',
        description: 'The name of the channel',
      },
      {
        displayName: 'Active',
        name: 'active',
        type: 'boolean',
        default: true,
        description: 'Whether the channel is active',
      },
      {
        displayName: 'Auto Reply Enabled',
        name: 'auto_reply_enabled',
        type: 'boolean',
        default: false,
        description: 'Whether auto reply is enabled',
      },
      {
        displayName: 'Auto Reply Message',
        name: 'auto_reply_message',
        type: 'string',
        typeOptions: {
          rows: 3,
        },
        default: '',
        description: 'The auto reply message',
      },
      {
        displayName: 'Business Hours Only',
        name: 'business_hours_only',
        type: 'boolean',
        default: false,
        description: 'Whether to only accept messages during business hours',
      },
      {
        displayName: 'Email From Name',
        name: 'from_name',
        type: 'string',
        default: '',
        description: 'The "from" name for outgoing emails',
      },
      {
        displayName: 'Email Signature',
        name: 'signature',
        type: 'string',
        typeOptions: {
          rows: 4,
        },
        default: '',
        description: 'The email signature (HTML supported)',
      },
    ],
  },
];

export async function executeChannelOperations(
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
      if (value !== undefined && value !== '') {
        query[key] = value;
      }
    }

    if (returnAll) {
      responseData = await gorgiasApiRequestAllItems.call(this, 'GET', '/channels', {}, query);
    } else {
      const limit = this.getNodeParameter('limit', i) as number;
      query.limit = limit;
      const response = await gorgiasApiRequest.call(this, 'GET', '/channels', {}, query);
      responseData = (response.data as IDataObject[]) || [];
    }
  } else if (operation === 'get') {
    const channelId = this.getNodeParameter('channelId', i) as number;
    responseData = await gorgiasApiRequest.call(this, 'GET', `/channels/${channelId}`);
  } else if (operation === 'update') {
    const channelId = this.getNodeParameter('channelId', i) as number;
    const updateFields = this.getNodeParameter('updateFields', i, {}) as IDataObject;

    responseData = await gorgiasApiRequest.call(this, 'PUT', `/channels/${channelId}`, updateFields);
  }

  return responseData;
}
