/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties, IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { gorgiasApiRequest, gorgiasApiRequestAllItems } from '../../transport/gorgiasApi';

export const widgetOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['widget'],
      },
    },
    options: [
      { name: 'Create', value: 'create', description: 'Create a new widget', action: 'Create widget' },
      { name: 'Delete', value: 'delete', description: 'Delete a widget', action: 'Delete widget' },
      { name: 'Get', value: 'get', description: 'Get a widget by ID', action: 'Get widget' },
      { name: 'Get Many', value: 'getAll', description: 'Get many widgets', action: 'Get many widgets' },
      { name: 'Update', value: 'update', description: 'Update a widget', action: 'Update widget' },
    ],
    default: 'getAll',
  },
];

export const widgetFields: INodeProperties[] = [
  // Widget ID
  {
    displayName: 'Widget ID',
    name: 'widgetId',
    type: 'number',
    required: true,
    default: 0,
    displayOptions: {
      show: {
        resource: ['widget'],
        operation: ['get', 'update', 'delete'],
      },
    },
    description: 'The ID of the widget',
  },
  // Name for create
  {
    displayName: 'Name',
    name: 'name',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['widget'],
        operation: ['create'],
      },
    },
    description: 'The name of the widget',
  },
  // Return All
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    default: false,
    displayOptions: {
      show: {
        resource: ['widget'],
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
        resource: ['widget'],
        operation: ['getAll'],
        returnAll: [false],
      },
    },
    description: 'Max number of results to return',
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
        resource: ['widget'],
        operation: ['create'],
      },
    },
    options: [
      {
        displayName: 'Description',
        name: 'description',
        type: 'string',
        typeOptions: {
          rows: 3,
        },
        default: '',
        description: 'The description of the widget',
      },
      {
        displayName: 'Enabled',
        name: 'enabled',
        type: 'boolean',
        default: true,
        description: 'Whether the widget is enabled',
      },
      {
        displayName: 'Primary Color',
        name: 'primary_color',
        type: 'color',
        default: '#6B47DC',
        description: 'The primary color of the widget',
      },
      {
        displayName: 'Position',
        name: 'position',
        type: 'options',
        options: [
          { name: 'Bottom Right', value: 'bottom-right' },
          { name: 'Bottom Left', value: 'bottom-left' },
        ],
        default: 'bottom-right',
        description: 'The position of the widget on the page',
      },
      {
        displayName: 'Welcome Message',
        name: 'welcome_message',
        type: 'string',
        typeOptions: {
          rows: 3,
        },
        default: '',
        description: 'The welcome message displayed in the widget',
      },
      {
        displayName: 'Away Message',
        name: 'away_message',
        type: 'string',
        typeOptions: {
          rows: 3,
        },
        default: '',
        description: 'The message displayed when agents are away',
      },
      {
        displayName: 'Chat Enabled',
        name: 'chat_enabled',
        type: 'boolean',
        default: true,
        description: 'Whether chat is enabled in the widget',
      },
      {
        displayName: 'Contact Form Enabled',
        name: 'contact_form_enabled',
        type: 'boolean',
        default: true,
        description: 'Whether the contact form is enabled',
      },
      {
        displayName: 'Helpdesk Enabled',
        name: 'helpdesk_enabled',
        type: 'boolean',
        default: false,
        description: 'Whether the helpdesk/FAQ is enabled',
      },
      {
        displayName: 'Domain Whitelist',
        name: 'domain_whitelist',
        type: 'string',
        default: '',
        description: 'Comma-separated list of allowed domains',
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
        resource: ['widget'],
        operation: ['update'],
      },
    },
    options: [
      {
        displayName: 'Name',
        name: 'name',
        type: 'string',
        default: '',
        description: 'The name of the widget',
      },
      {
        displayName: 'Description',
        name: 'description',
        type: 'string',
        typeOptions: {
          rows: 3,
        },
        default: '',
        description: 'The description of the widget',
      },
      {
        displayName: 'Enabled',
        name: 'enabled',
        type: 'boolean',
        default: true,
        description: 'Whether the widget is enabled',
      },
      {
        displayName: 'Primary Color',
        name: 'primary_color',
        type: 'color',
        default: '#6B47DC',
        description: 'The primary color of the widget',
      },
      {
        displayName: 'Position',
        name: 'position',
        type: 'options',
        options: [
          { name: 'Bottom Right', value: 'bottom-right' },
          { name: 'Bottom Left', value: 'bottom-left' },
        ],
        default: 'bottom-right',
        description: 'The position of the widget',
      },
      {
        displayName: 'Welcome Message',
        name: 'welcome_message',
        type: 'string',
        typeOptions: {
          rows: 3,
        },
        default: '',
        description: 'The welcome message displayed',
      },
      {
        displayName: 'Away Message',
        name: 'away_message',
        type: 'string',
        typeOptions: {
          rows: 3,
        },
        default: '',
        description: 'The away message displayed',
      },
      {
        displayName: 'Chat Enabled',
        name: 'chat_enabled',
        type: 'boolean',
        default: true,
        description: 'Whether chat is enabled',
      },
      {
        displayName: 'Contact Form Enabled',
        name: 'contact_form_enabled',
        type: 'boolean',
        default: true,
        description: 'Whether contact form is enabled',
      },
      {
        displayName: 'Helpdesk Enabled',
        name: 'helpdesk_enabled',
        type: 'boolean',
        default: false,
        description: 'Whether helpdesk is enabled',
      },
    ],
  },
];

export async function executeWidgetOperations(
  this: IExecuteFunctions,
  operation: string,
  i: number,
): Promise<IDataObject | IDataObject[]> {
  let responseData: IDataObject | IDataObject[] = {};

  if (operation === 'getAll') {
    const returnAll = this.getNodeParameter('returnAll', i) as boolean;
    const query: IDataObject = {};

    if (returnAll) {
      responseData = await gorgiasApiRequestAllItems.call(this, 'GET', '/widgets', {}, query);
    } else {
      const limit = this.getNodeParameter('limit', i) as number;
      query.limit = limit;
      const response = await gorgiasApiRequest.call(this, 'GET', '/widgets', {}, query);
      responseData = (response.data as IDataObject[]) || [];
    }
  } else if (operation === 'get') {
    const widgetId = this.getNodeParameter('widgetId', i) as number;
    responseData = await gorgiasApiRequest.call(this, 'GET', `/widgets/${widgetId}`);
  } else if (operation === 'create') {
    const name = this.getNodeParameter('name', i) as string;
    const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;

    const requestBody: IDataObject = {
      name,
      ...additionalFields,
    };

    // Handle domain whitelist
    if (additionalFields.domain_whitelist) {
      requestBody.domain_whitelist = (additionalFields.domain_whitelist as string)
        .split(',')
        .map((d) => d.trim())
        .filter((d) => d);
    }

    responseData = await gorgiasApiRequest.call(this, 'POST', '/widgets', requestBody);
  } else if (operation === 'update') {
    const widgetId = this.getNodeParameter('widgetId', i) as number;
    const updateFields = this.getNodeParameter('updateFields', i, {}) as IDataObject;

    responseData = await gorgiasApiRequest.call(this, 'PUT', `/widgets/${widgetId}`, updateFields);
  } else if (operation === 'delete') {
    const widgetId = this.getNodeParameter('widgetId', i) as number;
    await gorgiasApiRequest.call(this, 'DELETE', `/widgets/${widgetId}`);
    responseData = { success: true, widgetId };
  }

  return responseData;
}
