/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties, IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { gorgiasApiRequest, gorgiasApiRequestAllItems } from '../../transport/gorgiasApi';

export const viewOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['view'],
      },
    },
    options: [
      { name: 'Create', value: 'create', description: 'Create a new view', action: 'Create view' },
      { name: 'Delete', value: 'delete', description: 'Delete a view', action: 'Delete view' },
      { name: 'Get', value: 'get', description: 'Get a view by ID', action: 'Get view' },
      { name: 'Get Many', value: 'getAll', description: 'Get many views', action: 'Get many views' },
      { name: 'Get Tickets', value: 'getTickets', description: 'Get tickets in a view', action: 'Get tickets in view' },
      { name: 'Update', value: 'update', description: 'Update a view', action: 'Update view' },
    ],
    default: 'getAll',
  },
];

export const viewFields: INodeProperties[] = [
  // View ID
  {
    displayName: 'View ID',
    name: 'viewId',
    type: 'number',
    required: true,
    default: 0,
    displayOptions: {
      show: {
        resource: ['view'],
        operation: ['get', 'update', 'delete', 'getTickets'],
      },
    },
    description: 'The ID of the view',
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
        resource: ['view'],
        operation: ['create'],
      },
    },
    description: 'The name of the view',
  },
  // Return All
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    default: false,
    displayOptions: {
      show: {
        resource: ['view'],
        operation: ['getAll', 'getTickets'],
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
        resource: ['view'],
        operation: ['getAll', 'getTickets'],
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
        resource: ['view'],
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
        description: 'The description of the view',
      },
      {
        displayName: 'Shared',
        name: 'shared',
        type: 'boolean',
        default: false,
        description: 'Whether the view is shared with the team',
      },
      {
        displayName: 'Order',
        name: 'order',
        type: 'number',
        default: 0,
        description: 'The order of the view in the list',
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
        resource: ['view'],
        operation: ['update'],
      },
    },
    options: [
      {
        displayName: 'Name',
        name: 'name',
        type: 'string',
        default: '',
        description: 'The name of the view',
      },
      {
        displayName: 'Description',
        name: 'description',
        type: 'string',
        typeOptions: {
          rows: 3,
        },
        default: '',
        description: 'The description of the view',
      },
      {
        displayName: 'Shared',
        name: 'shared',
        type: 'boolean',
        default: false,
        description: 'Whether the view is shared with the team',
      },
      {
        displayName: 'Order',
        name: 'order',
        type: 'number',
        default: 0,
        description: 'The order of the view in the list',
      },
    ],
  },
];

export async function executeViewOperations(
  this: IExecuteFunctions,
  operation: string,
  i: number,
): Promise<IDataObject | IDataObject[]> {
  let responseData: IDataObject | IDataObject[] = {};

  if (operation === 'getAll') {
    const returnAll = this.getNodeParameter('returnAll', i) as boolean;

    if (returnAll) {
      responseData = await gorgiasApiRequestAllItems.call(this, 'GET', '/views');
    } else {
      const limit = this.getNodeParameter('limit', i) as number;
      const response = await gorgiasApiRequest.call(this, 'GET', '/views', {}, { limit });
      responseData = (response.data as IDataObject[]) || [];
    }
  } else if (operation === 'get') {
    const viewId = this.getNodeParameter('viewId', i) as number;
    responseData = await gorgiasApiRequest.call(this, 'GET', `/views/${viewId}`);
  } else if (operation === 'create') {
    const name = this.getNodeParameter('name', i) as string;
    const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;

    const requestBody: IDataObject = {
      name,
      ...additionalFields,
    };

    responseData = await gorgiasApiRequest.call(this, 'POST', '/views', requestBody);
  } else if (operation === 'update') {
    const viewId = this.getNodeParameter('viewId', i) as number;
    const updateFields = this.getNodeParameter('updateFields', i, {}) as IDataObject;

    responseData = await gorgiasApiRequest.call(this, 'PUT', `/views/${viewId}`, updateFields);
  } else if (operation === 'delete') {
    const viewId = this.getNodeParameter('viewId', i) as number;
    await gorgiasApiRequest.call(this, 'DELETE', `/views/${viewId}`);
    responseData = { success: true, viewId };
  } else if (operation === 'getTickets') {
    const viewId = this.getNodeParameter('viewId', i) as number;
    const returnAll = this.getNodeParameter('returnAll', i) as boolean;

    if (returnAll) {
      responseData = await gorgiasApiRequestAllItems.call(
        this,
        'GET',
        `/views/${viewId}/tickets`,
      );
    } else {
      const limit = this.getNodeParameter('limit', i) as number;
      const response = await gorgiasApiRequest.call(
        this,
        'GET',
        `/views/${viewId}/tickets`,
        {},
        { limit },
      );
      responseData = (response.data as IDataObject[]) || [];
    }
  }

  return responseData;
}
