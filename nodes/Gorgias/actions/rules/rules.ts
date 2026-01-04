/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties, IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { gorgiasApiRequest, gorgiasApiRequestAllItems } from '../../transport/gorgiasApi';

export const ruleOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['rule'],
      },
    },
    options: [
      { name: 'Create', value: 'create', description: 'Create a new rule', action: 'Create rule' },
      { name: 'Delete', value: 'delete', description: 'Delete a rule', action: 'Delete rule' },
      { name: 'Disable', value: 'disable', description: 'Disable a rule', action: 'Disable rule' },
      { name: 'Enable', value: 'enable', description: 'Enable a rule', action: 'Enable rule' },
      { name: 'Get', value: 'get', description: 'Get a rule by ID', action: 'Get rule' },
      { name: 'Get Many', value: 'getAll', description: 'Get many rules', action: 'Get many rules' },
      { name: 'Update', value: 'update', description: 'Update a rule', action: 'Update rule' },
    ],
    default: 'getAll',
  },
];

export const ruleFields: INodeProperties[] = [
  // Rule ID
  {
    displayName: 'Rule ID',
    name: 'ruleId',
    type: 'number',
    required: true,
    default: 0,
    displayOptions: {
      show: {
        resource: ['rule'],
        operation: ['get', 'update', 'delete', 'enable', 'disable'],
      },
    },
    description: 'The ID of the rule',
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
        resource: ['rule'],
        operation: ['create'],
      },
    },
    description: 'The name of the rule',
  },
  // Return All
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    default: false,
    displayOptions: {
      show: {
        resource: ['rule'],
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
        resource: ['rule'],
        operation: ['getAll'],
        returnAll: [false],
      },
    },
    description: 'Max number of results to return',
  },
  // Rule type for create
  {
    displayName: 'Rule Type',
    name: 'ruleType',
    type: 'options',
    required: true,
    options: [
      { name: 'Auto Assign', value: 'auto_assign' },
      { name: 'Auto Close', value: 'auto_close' },
      { name: 'Auto Reply', value: 'auto_reply' },
      { name: 'Auto Tag', value: 'auto_tag' },
      { name: 'HTTP Integration', value: 'http_integration' },
    ],
    default: 'auto_tag',
    displayOptions: {
      show: {
        resource: ['rule'],
        operation: ['create'],
      },
    },
    description: 'The type of rule to create',
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
        resource: ['rule'],
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
        description: 'The description of the rule',
      },
      {
        displayName: 'Enabled',
        name: 'enabled',
        type: 'boolean',
        default: true,
        description: 'Whether the rule is enabled',
      },
      {
        displayName: 'Order',
        name: 'order',
        type: 'number',
        default: 0,
        description: 'The order of the rule in execution',
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
        resource: ['rule'],
        operation: ['update'],
      },
    },
    options: [
      {
        displayName: 'Name',
        name: 'name',
        type: 'string',
        default: '',
        description: 'The name of the rule',
      },
      {
        displayName: 'Description',
        name: 'description',
        type: 'string',
        typeOptions: {
          rows: 3,
        },
        default: '',
        description: 'The description of the rule',
      },
      {
        displayName: 'Enabled',
        name: 'enabled',
        type: 'boolean',
        default: true,
        description: 'Whether the rule is enabled',
      },
      {
        displayName: 'Order',
        name: 'order',
        type: 'number',
        default: 0,
        description: 'The order of the rule in execution',
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
        resource: ['rule'],
        operation: ['getAll'],
      },
    },
    options: [
      {
        displayName: 'Enabled',
        name: 'enabled',
        type: 'boolean',
        default: true,
        description: 'Filter by enabled status',
      },
      {
        displayName: 'Type',
        name: 'type',
        type: 'options',
        options: [
          { name: 'Auto Assign', value: 'auto_assign' },
          { name: 'Auto Close', value: 'auto_close' },
          { name: 'Auto Reply', value: 'auto_reply' },
          { name: 'Auto Tag', value: 'auto_tag' },
          { name: 'HTTP Integration', value: 'http_integration' },
        ],
        default: '',
        description: 'Filter by rule type',
      },
    ],
  },
];

export async function executeRuleOperations(
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
      responseData = await gorgiasApiRequestAllItems.call(this, 'GET', '/rules', {}, query);
    } else {
      const limit = this.getNodeParameter('limit', i) as number;
      query.limit = limit;
      const response = await gorgiasApiRequest.call(this, 'GET', '/rules', {}, query);
      responseData = (response.data as IDataObject[]) || [];
    }
  } else if (operation === 'get') {
    const ruleId = this.getNodeParameter('ruleId', i) as number;
    responseData = await gorgiasApiRequest.call(this, 'GET', `/rules/${ruleId}`);
  } else if (operation === 'create') {
    const name = this.getNodeParameter('name', i) as string;
    const ruleType = this.getNodeParameter('ruleType', i) as string;
    const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;

    const requestBody: IDataObject = {
      name,
      type: ruleType,
      conditions: [],
      actions: [],
      ...additionalFields,
    };

    responseData = await gorgiasApiRequest.call(this, 'POST', '/rules', requestBody);
  } else if (operation === 'update') {
    const ruleId = this.getNodeParameter('ruleId', i) as number;
    const updateFields = this.getNodeParameter('updateFields', i, {}) as IDataObject;

    responseData = await gorgiasApiRequest.call(this, 'PUT', `/rules/${ruleId}`, updateFields);
  } else if (operation === 'delete') {
    const ruleId = this.getNodeParameter('ruleId', i) as number;
    await gorgiasApiRequest.call(this, 'DELETE', `/rules/${ruleId}`);
    responseData = { success: true, ruleId };
  } else if (operation === 'enable') {
    const ruleId = this.getNodeParameter('ruleId', i) as number;
    responseData = await gorgiasApiRequest.call(this, 'PUT', `/rules/${ruleId}`, {
      enabled: true,
    });
  } else if (operation === 'disable') {
    const ruleId = this.getNodeParameter('ruleId', i) as number;
    responseData = await gorgiasApiRequest.call(this, 'PUT', `/rules/${ruleId}`, {
      enabled: false,
    });
  }

  return responseData;
}
