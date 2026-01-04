/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties, IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { gorgiasApiRequest, gorgiasApiRequestAllItems } from '../../transport/gorgiasApi';
import { USER_ROLES } from '../../constants/constants';

export const userOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['user'],
      },
    },
    options: [
      { name: 'Create', value: 'create', description: 'Create a new user', action: 'Create user' },
      { name: 'Deactivate', value: 'deactivate', description: 'Deactivate a user', action: 'Deactivate user' },
      { name: 'Get', value: 'get', description: 'Get a user by ID', action: 'Get user' },
      { name: 'Get Many', value: 'getAll', description: 'Get many users', action: 'Get many users' },
      { name: 'Get Stats', value: 'getStats', description: 'Get agent statistics', action: 'Get user stats' },
      { name: 'Update', value: 'update', description: 'Update a user', action: 'Update user' },
    ],
    default: 'getAll',
  },
];

export const userFields: INodeProperties[] = [
  // User ID
  {
    displayName: 'User ID',
    name: 'userId',
    type: 'number',
    required: true,
    default: 0,
    displayOptions: {
      show: {
        resource: ['user'],
        operation: ['get', 'update', 'deactivate', 'getStats'],
      },
    },
    description: 'The ID of the user',
  },
  // Email for create
  {
    displayName: 'Email',
    name: 'email',
    type: 'string',
    placeholder: 'agent@example.com',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['user'],
        operation: ['create'],
      },
    },
    description: 'The email address of the user',
  },
  // Role for create
  {
    displayName: 'Role',
    name: 'role',
    type: 'options',
    options: USER_ROLES.map((r) => ({ name: r.name, value: r.value })),
    required: true,
    default: 'agent',
    displayOptions: {
      show: {
        resource: ['user'],
        operation: ['create'],
      },
    },
    description: 'The role of the user',
  },
  // Return All
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    default: false,
    displayOptions: {
      show: {
        resource: ['user'],
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
        resource: ['user'],
        operation: ['getAll'],
        returnAll: [false],
      },
    },
    description: 'Max number of results to return',
  },
  // Stats date range
  {
    displayName: 'Start Date',
    name: 'startDate',
    type: 'dateTime',
    default: '',
    displayOptions: {
      show: {
        resource: ['user'],
        operation: ['getStats'],
      },
    },
    description: 'Start date for statistics',
  },
  {
    displayName: 'End Date',
    name: 'endDate',
    type: 'dateTime',
    default: '',
    displayOptions: {
      show: {
        resource: ['user'],
        operation: ['getStats'],
      },
    },
    description: 'End date for statistics',
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
        resource: ['user'],
        operation: ['create'],
      },
    },
    options: [
      {
        displayName: 'First Name',
        name: 'firstname',
        type: 'string',
        default: '',
        description: 'The first name of the user',
      },
      {
        displayName: 'Last Name',
        name: 'lastname',
        type: 'string',
        default: '',
        description: 'The last name of the user',
      },
      {
        displayName: 'Bio',
        name: 'bio',
        type: 'string',
        typeOptions: {
          rows: 3,
        },
        default: '',
        description: 'The bio of the user',
      },
      {
        displayName: 'Timezone',
        name: 'timezone',
        type: 'string',
        default: '',
        placeholder: 'America/New_York',
        description: 'The timezone of the user',
      },
      {
        displayName: 'Language',
        name: 'language',
        type: 'string',
        default: '',
        placeholder: 'en',
        description: 'The language code for the user',
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
        resource: ['user'],
        operation: ['update'],
      },
    },
    options: [
      {
        displayName: 'First Name',
        name: 'firstname',
        type: 'string',
        default: '',
        description: 'The first name of the user',
      },
      {
        displayName: 'Last Name',
        name: 'lastname',
        type: 'string',
        default: '',
        description: 'The last name of the user',
      },
      {
        displayName: 'Role',
        name: 'role',
        type: 'options',
        options: USER_ROLES.map((r) => ({ name: r.name, value: r.value })),
        default: 'agent',
        description: 'The role of the user',
      },
      {
        displayName: 'Bio',
        name: 'bio',
        type: 'string',
        typeOptions: {
          rows: 3,
        },
        default: '',
        description: 'The bio of the user',
      },
      {
        displayName: 'Timezone',
        name: 'timezone',
        type: 'string',
        default: '',
        placeholder: 'America/New_York',
        description: 'The timezone of the user',
      },
      {
        displayName: 'Language',
        name: 'language',
        type: 'string',
        default: '',
        placeholder: 'en',
        description: 'The language code for the user',
      },
      {
        displayName: 'Active',
        name: 'active',
        type: 'boolean',
        default: true,
        description: 'Whether the user is active',
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
        resource: ['user'],
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
        displayName: 'Role',
        name: 'role',
        type: 'options',
        options: USER_ROLES.map((r) => ({ name: r.name, value: r.value })),
        default: '',
        description: 'Filter by role',
      },
      {
        displayName: 'Active',
        name: 'active',
        type: 'boolean',
        default: true,
        description: 'Filter by active status',
      },
      {
        displayName: 'Order By',
        name: 'order_by',
        type: 'options',
        options: [
          { name: 'Created (Newest First)', value: 'created_datetime:desc' },
          { name: 'Created (Oldest First)', value: 'created_datetime:asc' },
          { name: 'Name (A-Z)', value: 'firstname:asc' },
          { name: 'Name (Z-A)', value: 'firstname:desc' },
        ],
        default: 'created_datetime:desc',
        description: 'Sort order for users',
      },
    ],
  },
];

export async function executeUserOperations(
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
      responseData = await gorgiasApiRequestAllItems.call(this, 'GET', '/users', {}, query);
    } else {
      const limit = this.getNodeParameter('limit', i) as number;
      query.limit = limit;
      const response = await gorgiasApiRequest.call(this, 'GET', '/users', {}, query);
      responseData = (response.data as IDataObject[]) || [];
    }
  } else if (operation === 'get') {
    const userId = this.getNodeParameter('userId', i) as number;
    responseData = await gorgiasApiRequest.call(this, 'GET', `/users/${userId}`);
  } else if (operation === 'create') {
    const email = this.getNodeParameter('email', i) as string;
    const role = this.getNodeParameter('role', i) as string;
    const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;

    const requestBody: IDataObject = {
      email,
      role,
      ...additionalFields,
    };

    responseData = await gorgiasApiRequest.call(this, 'POST', '/users', requestBody);
  } else if (operation === 'update') {
    const userId = this.getNodeParameter('userId', i) as number;
    const updateFields = this.getNodeParameter('updateFields', i, {}) as IDataObject;

    responseData = await gorgiasApiRequest.call(this, 'PUT', `/users/${userId}`, updateFields);
  } else if (operation === 'deactivate') {
    const userId = this.getNodeParameter('userId', i) as number;

    responseData = await gorgiasApiRequest.call(this, 'PUT', `/users/${userId}`, {
      active: false,
    });
  } else if (operation === 'getStats') {
    const userId = this.getNodeParameter('userId', i) as number;
    const startDate = this.getNodeParameter('startDate', i, '') as string;
    const endDate = this.getNodeParameter('endDate', i, '') as string;

    const query: IDataObject = { user_id: userId };
    if (startDate) {
      query.start_datetime = startDate;
    }
    if (endDate) {
      query.end_datetime = endDate;
    }

    responseData = await gorgiasApiRequest.call(this, 'GET', '/stats/agents', {}, query);
  }

  return responseData;
}
