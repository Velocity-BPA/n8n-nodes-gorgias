/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties, IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { gorgiasApiRequest, gorgiasApiRequestAllItems } from '../../transport/gorgiasApi';

export const customerOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['customer'],
      },
    },
    options: [
      { name: 'Add Note', value: 'addNote', description: 'Add a note to a customer', action: 'Add note to customer' },
      { name: 'Create', value: 'create', description: 'Create a new customer', action: 'Create customer' },
      { name: 'Delete', value: 'delete', description: 'Delete a customer', action: 'Delete customer' },
      { name: 'Get', value: 'get', description: 'Get a customer by ID', action: 'Get customer' },
      { name: 'Get Many', value: 'getAll', description: 'Get many customers', action: 'Get many customers' },
      { name: 'Get Orders', value: 'getOrders', description: 'Get customer orders from integrations', action: 'Get customer orders' },
      { name: 'Get Tickets', value: 'getTickets', description: 'Get customer tickets', action: 'Get customer tickets' },
      { name: 'Merge', value: 'merge', description: 'Merge customers', action: 'Merge customers' },
      { name: 'Update', value: 'update', description: 'Update a customer', action: 'Update customer' },
    ],
    default: 'getAll',
  },
];

export const customerFields: INodeProperties[] = [
  // Customer ID
  {
    displayName: 'Customer ID',
    name: 'customerId',
    type: 'number',
    required: true,
    default: 0,
    displayOptions: {
      show: {
        resource: ['customer'],
        operation: ['get', 'update', 'delete', 'addNote', 'getTickets', 'getOrders'],
      },
    },
    description: 'The ID of the customer',
  },
  // Email for create
  {
    displayName: 'Email',
    name: 'email',
    type: 'string',
    placeholder: 'customer@example.com',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['customer'],
        operation: ['create'],
      },
    },
    description: 'The email address of the customer',
  },
  // Note text
  {
    displayName: 'Note',
    name: 'note',
    type: 'string',
    typeOptions: {
      rows: 3,
    },
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['customer'],
        operation: ['addNote'],
      },
    },
    description: 'The note to add to the customer',
  },
  // Return All
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    default: false,
    displayOptions: {
      show: {
        resource: ['customer'],
        operation: ['getAll', 'getTickets', 'getOrders'],
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
        resource: ['customer'],
        operation: ['getAll', 'getTickets', 'getOrders'],
        returnAll: [false],
      },
    },
    description: 'Max number of results to return',
  },
  // Merge fields
  {
    displayName: 'Primary Customer ID',
    name: 'primaryCustomerId',
    type: 'number',
    required: true,
    default: 0,
    displayOptions: {
      show: {
        resource: ['customer'],
        operation: ['merge'],
      },
    },
    description: 'The ID of the customer to merge into (this customer will remain)',
  },
  {
    displayName: 'Customer IDs to Merge',
    name: 'customerIdsToMerge',
    type: 'string',
    required: true,
    default: '',
    placeholder: '123, 456, 789',
    displayOptions: {
      show: {
        resource: ['customer'],
        operation: ['merge'],
      },
    },
    description: 'Comma-separated list of customer IDs to merge into the primary customer',
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
        resource: ['customer'],
        operation: ['create'],
      },
    },
    options: [
      {
        displayName: 'Name',
        name: 'name',
        type: 'string',
        default: '',
        description: 'The full name of the customer',
      },
      {
        displayName: 'First Name',
        name: 'firstname',
        type: 'string',
        default: '',
        description: 'The first name of the customer',
      },
      {
        displayName: 'Last Name',
        name: 'lastname',
        type: 'string',
        default: '',
        description: 'The last name of the customer',
      },
      {
        displayName: 'Phone Number',
        name: 'phone',
        type: 'string',
        default: '',
        description: 'The phone number of the customer',
      },
      {
        displayName: 'Language',
        name: 'language',
        type: 'string',
        default: '',
        placeholder: 'en',
        description: 'The language code for the customer',
      },
      {
        displayName: 'Timezone',
        name: 'timezone',
        type: 'string',
        default: '',
        placeholder: 'America/New_York',
        description: 'The timezone of the customer',
      },
      {
        displayName: 'External ID',
        name: 'external_id',
        type: 'string',
        default: '',
        description: 'An external ID for the customer (e.g., from your e-commerce platform)',
      },
      {
        displayName: 'Note',
        name: 'note',
        type: 'string',
        typeOptions: {
          rows: 3,
        },
        default: '',
        description: 'A note about the customer',
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
        resource: ['customer'],
        operation: ['update'],
      },
    },
    options: [
      {
        displayName: 'Email',
        name: 'email',
        type: 'string',
        default: '',
        description: 'The email address of the customer',
      },
      {
        displayName: 'Name',
        name: 'name',
        type: 'string',
        default: '',
        description: 'The full name of the customer',
      },
      {
        displayName: 'First Name',
        name: 'firstname',
        type: 'string',
        default: '',
        description: 'The first name of the customer',
      },
      {
        displayName: 'Last Name',
        name: 'lastname',
        type: 'string',
        default: '',
        description: 'The last name of the customer',
      },
      {
        displayName: 'Phone Number',
        name: 'phone',
        type: 'string',
        default: '',
        description: 'The phone number of the customer',
      },
      {
        displayName: 'Language',
        name: 'language',
        type: 'string',
        default: '',
        placeholder: 'en',
        description: 'The language code for the customer',
      },
      {
        displayName: 'Timezone',
        name: 'timezone',
        type: 'string',
        default: '',
        placeholder: 'America/New_York',
        description: 'The timezone of the customer',
      },
      {
        displayName: 'External ID',
        name: 'external_id',
        type: 'string',
        default: '',
        description: 'An external ID for the customer',
      },
      {
        displayName: 'Note',
        name: 'note',
        type: 'string',
        typeOptions: {
          rows: 3,
        },
        default: '',
        description: 'A note about the customer',
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
        resource: ['customer'],
        operation: ['getAll'],
      },
    },
    options: [
      {
        displayName: 'Email',
        name: 'email',
        type: 'string',
        default: '',
        description: 'Filter by email address',
      },
      {
        displayName: 'External ID',
        name: 'external_id',
        type: 'string',
        default: '',
        description: 'Filter by external ID',
      },
      {
        displayName: 'Created After',
        name: 'created_datetime__gte',
        type: 'dateTime',
        default: '',
        description: 'Filter customers created after this date',
      },
      {
        displayName: 'Created Before',
        name: 'created_datetime__lte',
        type: 'dateTime',
        default: '',
        description: 'Filter customers created before this date',
      },
      {
        displayName: 'Order By',
        name: 'order_by',
        type: 'options',
        options: [
          { name: 'Created (Newest First)', value: 'created_datetime:desc' },
          { name: 'Created (Oldest First)', value: 'created_datetime:asc' },
          { name: 'Name (A-Z)', value: 'name:asc' },
          { name: 'Name (Z-A)', value: 'name:desc' },
        ],
        default: 'created_datetime:desc',
        description: 'Sort order for customers',
      },
    ],
  },
];

export async function executeCustomerOperations(
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
      responseData = await gorgiasApiRequestAllItems.call(this, 'GET', '/customers', {}, query);
    } else {
      const limit = this.getNodeParameter('limit', i) as number;
      query.limit = limit;
      const response = await gorgiasApiRequest.call(this, 'GET', '/customers', {}, query);
      responseData = (response.data as IDataObject[]) || [];
    }
  } else if (operation === 'get') {
    const customerId = this.getNodeParameter('customerId', i) as number;
    responseData = await gorgiasApiRequest.call(this, 'GET', `/customers/${customerId}`);
  } else if (operation === 'create') {
    const email = this.getNodeParameter('email', i) as string;
    const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;

    const requestBody: IDataObject = {
      email,
      channels: [
        {
          type: 'email',
          address: email,
        },
      ],
      ...additionalFields,
    };

    responseData = await gorgiasApiRequest.call(this, 'POST', '/customers', requestBody);
  } else if (operation === 'update') {
    const customerId = this.getNodeParameter('customerId', i) as number;
    const updateFields = this.getNodeParameter('updateFields', i, {}) as IDataObject;

    responseData = await gorgiasApiRequest.call(
      this,
      'PUT',
      `/customers/${customerId}`,
      updateFields,
    );
  } else if (operation === 'delete') {
    const customerId = this.getNodeParameter('customerId', i) as number;
    await gorgiasApiRequest.call(this, 'DELETE', `/customers/${customerId}`);
    responseData = { success: true, customerId };
  } else if (operation === 'addNote') {
    const customerId = this.getNodeParameter('customerId', i) as number;
    const note = this.getNodeParameter('note', i) as string;

    responseData = await gorgiasApiRequest.call(this, 'PUT', `/customers/${customerId}`, {
      note,
    });
  } else if (operation === 'merge') {
    const primaryCustomerId = this.getNodeParameter('primaryCustomerId', i) as number;
    const customerIdsToMerge = this.getNodeParameter('customerIdsToMerge', i) as string;

    const customerIds = customerIdsToMerge.split(',').map((id) => parseInt(id.trim(), 10));

    responseData = await gorgiasApiRequest.call(
      this,
      'POST',
      `/customers/${primaryCustomerId}/merge`,
      {
        customer_ids: customerIds,
      },
    );
  } else if (operation === 'getTickets') {
    const customerId = this.getNodeParameter('customerId', i) as number;
    const returnAll = this.getNodeParameter('returnAll', i) as boolean;

    if (returnAll) {
      responseData = await gorgiasApiRequestAllItems.call(
        this,
        'GET',
        '/tickets',
        {},
        { customer_id: customerId },
      );
    } else {
      const limit = this.getNodeParameter('limit', i) as number;
      const response = await gorgiasApiRequest.call(
        this,
        'GET',
        '/tickets',
        {},
        { customer_id: customerId, limit },
      );
      responseData = (response.data as IDataObject[]) || [];
    }
  } else if (operation === 'getOrders') {
    const customerId = this.getNodeParameter('customerId', i) as number;
    const returnAll = this.getNodeParameter('returnAll', i) as boolean;

    if (returnAll) {
      responseData = await gorgiasApiRequestAllItems.call(
        this,
        'GET',
        `/customers/${customerId}/orders`,
      );
    } else {
      const limit = this.getNodeParameter('limit', i) as number;
      const response = await gorgiasApiRequest.call(
        this,
        'GET',
        `/customers/${customerId}/orders`,
        {},
        { limit },
      );
      responseData = (response.data as IDataObject[]) || [];
    }
  }

  return responseData;
}
