/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties, IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { gorgiasApiRequest, gorgiasApiRequestAllItems } from '../../transport/gorgiasApi';

export const tagOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['tag'],
      },
    },
    options: [
      { name: 'Create', value: 'create', description: 'Create a new tag', action: 'Create tag' },
      { name: 'Delete', value: 'delete', description: 'Delete a tag', action: 'Delete tag' },
      { name: 'Get', value: 'get', description: 'Get a tag by ID', action: 'Get tag' },
      { name: 'Get Many', value: 'getAll', description: 'Get many tags', action: 'Get many tags' },
      { name: 'Update', value: 'update', description: 'Update a tag', action: 'Update tag' },
    ],
    default: 'getAll',
  },
];

export const tagFields: INodeProperties[] = [
  // Tag ID
  {
    displayName: 'Tag ID',
    name: 'tagId',
    type: 'number',
    required: true,
    default: 0,
    displayOptions: {
      show: {
        resource: ['tag'],
        operation: ['get', 'update', 'delete'],
      },
    },
    description: 'The ID of the tag',
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
        resource: ['tag'],
        operation: ['create'],
      },
    },
    description: 'The name of the tag',
  },
  // Return All
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    default: false,
    displayOptions: {
      show: {
        resource: ['tag'],
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
        resource: ['tag'],
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
        resource: ['tag'],
        operation: ['create'],
      },
    },
    options: [
      {
        displayName: 'Description',
        name: 'description',
        type: 'string',
        default: '',
        description: 'The description of the tag',
      },
      {
        displayName: 'Color',
        name: 'decoration',
        type: 'color',
        default: '#3498db',
        description: 'The color of the tag',
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
        resource: ['tag'],
        operation: ['update'],
      },
    },
    options: [
      {
        displayName: 'Name',
        name: 'name',
        type: 'string',
        default: '',
        description: 'The name of the tag',
      },
      {
        displayName: 'Description',
        name: 'description',
        type: 'string',
        default: '',
        description: 'The description of the tag',
      },
      {
        displayName: 'Color',
        name: 'decoration',
        type: 'color',
        default: '#3498db',
        description: 'The color of the tag',
      },
    ],
  },
];

export async function executeTagOperations(
  this: IExecuteFunctions,
  operation: string,
  i: number,
): Promise<IDataObject | IDataObject[]> {
  let responseData: IDataObject | IDataObject[] = {};

  if (operation === 'getAll') {
    const returnAll = this.getNodeParameter('returnAll', i) as boolean;

    if (returnAll) {
      responseData = await gorgiasApiRequestAllItems.call(this, 'GET', '/tags');
    } else {
      const limit = this.getNodeParameter('limit', i) as number;
      const response = await gorgiasApiRequest.call(this, 'GET', '/tags', {}, { limit });
      responseData = (response.data as IDataObject[]) || [];
    }
  } else if (operation === 'get') {
    const tagId = this.getNodeParameter('tagId', i) as number;
    responseData = await gorgiasApiRequest.call(this, 'GET', `/tags/${tagId}`);
  } else if (operation === 'create') {
    const name = this.getNodeParameter('name', i) as string;
    const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;

    const requestBody: IDataObject = {
      name,
    };

    if (additionalFields.decoration) {
      requestBody.decoration = { color: additionalFields.decoration };
      delete additionalFields.decoration;
    }

    Object.assign(requestBody, additionalFields);
    responseData = await gorgiasApiRequest.call(this, 'POST', '/tags', requestBody);
  } else if (operation === 'update') {
    const tagId = this.getNodeParameter('tagId', i) as number;
    const updateFields = this.getNodeParameter('updateFields', i, {}) as IDataObject;

    if (updateFields.decoration) {
      updateFields.decoration = { color: updateFields.decoration };
    }

    responseData = await gorgiasApiRequest.call(this, 'PUT', `/tags/${tagId}`, updateFields);
  } else if (operation === 'delete') {
    const tagId = this.getNodeParameter('tagId', i) as number;
    await gorgiasApiRequest.call(this, 'DELETE', `/tags/${tagId}`);
    responseData = { success: true, tagId };
  }

  return responseData;
}
