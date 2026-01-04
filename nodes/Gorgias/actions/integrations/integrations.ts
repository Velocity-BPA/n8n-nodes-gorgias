/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties, IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { gorgiasApiRequest, gorgiasApiRequestAllItems } from '../../transport/gorgiasApi';

export const integrationOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['integration'],
      },
    },
    options: [
      { name: 'Create', value: 'create', description: 'Create a new HTTP integration', action: 'Create integration' },
      { name: 'Delete', value: 'delete', description: 'Delete an integration', action: 'Delete integration' },
      { name: 'Get', value: 'get', description: 'Get an integration by ID', action: 'Get integration' },
      { name: 'Get Many', value: 'getAll', description: 'Get many integrations', action: 'Get many integrations' },
      { name: 'Update', value: 'update', description: 'Update an integration', action: 'Update integration' },
    ],
    default: 'getAll',
  },
];

export const integrationFields: INodeProperties[] = [
  // Integration ID
  {
    displayName: 'Integration ID',
    name: 'integrationId',
    type: 'number',
    required: true,
    default: 0,
    displayOptions: {
      show: {
        resource: ['integration'],
        operation: ['get', 'update', 'delete'],
      },
    },
    description: 'The ID of the integration',
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
        resource: ['integration'],
        operation: ['create'],
      },
    },
    description: 'The name of the integration',
  },
  // Type for create
  {
    displayName: 'Type',
    name: 'integrationType',
    type: 'options',
    required: true,
    options: [
      { name: 'HTTP', value: 'http' },
      { name: 'Shopify', value: 'shopify' },
      { name: 'BigCommerce', value: 'bigcommerce' },
      { name: 'Magento', value: 'magento' },
      { name: 'WooCommerce', value: 'woocommerce' },
      { name: 'Slack', value: 'slack' },
      { name: 'Aircall', value: 'aircall' },
      { name: 'Klaviyo', value: 'klaviyo' },
      { name: 'Attentive', value: 'attentive' },
      { name: 'Yotpo', value: 'yotpo' },
    ],
    default: 'http',
    displayOptions: {
      show: {
        resource: ['integration'],
        operation: ['create'],
      },
    },
    description: 'The type of integration',
  },
  // Return All
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    default: false,
    displayOptions: {
      show: {
        resource: ['integration'],
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
        resource: ['integration'],
        operation: ['getAll'],
        returnAll: [false],
      },
    },
    description: 'Max number of results to return',
  },
  // HTTP integration specific fields for create
  {
    displayName: 'HTTP URL',
    name: 'httpUrl',
    type: 'string',
    default: '',
    displayOptions: {
      show: {
        resource: ['integration'],
        operation: ['create'],
        integrationType: ['http'],
      },
    },
    description: 'The URL for HTTP integration webhooks',
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
        resource: ['integration'],
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
        description: 'The description of the integration',
      },
      {
        displayName: 'Enabled',
        name: 'enabled',
        type: 'boolean',
        default: true,
        description: 'Whether the integration is enabled',
      },
      {
        displayName: 'HTTP Headers',
        name: 'httpHeaders',
        type: 'json',
        default: '{}',
        description: 'Custom HTTP headers for HTTP integration (JSON format)',
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
        resource: ['integration'],
        operation: ['update'],
      },
    },
    options: [
      {
        displayName: 'Name',
        name: 'name',
        type: 'string',
        default: '',
        description: 'The name of the integration',
      },
      {
        displayName: 'Description',
        name: 'description',
        type: 'string',
        typeOptions: {
          rows: 3,
        },
        default: '',
        description: 'The description of the integration',
      },
      {
        displayName: 'Enabled',
        name: 'enabled',
        type: 'boolean',
        default: true,
        description: 'Whether the integration is enabled',
      },
      {
        displayName: 'HTTP URL',
        name: 'http_url',
        type: 'string',
        default: '',
        description: 'The URL for HTTP integration',
      },
      {
        displayName: 'HTTP Headers',
        name: 'http_headers',
        type: 'json',
        default: '{}',
        description: 'Custom HTTP headers (JSON format)',
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
        resource: ['integration'],
        operation: ['getAll'],
      },
    },
    options: [
      {
        displayName: 'Type',
        name: 'type',
        type: 'options',
        options: [
          { name: 'HTTP', value: 'http' },
          { name: 'Shopify', value: 'shopify' },
          { name: 'BigCommerce', value: 'bigcommerce' },
          { name: 'Magento', value: 'magento' },
          { name: 'WooCommerce', value: 'woocommerce' },
          { name: 'Slack', value: 'slack' },
          { name: 'Aircall', value: 'aircall' },
        ],
        default: '',
        description: 'Filter by integration type',
      },
      {
        displayName: 'Enabled',
        name: 'enabled',
        type: 'boolean',
        default: true,
        description: 'Filter by enabled status',
      },
    ],
  },
];

export async function executeIntegrationOperations(
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
      responseData = await gorgiasApiRequestAllItems.call(this, 'GET', '/integrations', {}, query);
    } else {
      const limit = this.getNodeParameter('limit', i) as number;
      query.limit = limit;
      const response = await gorgiasApiRequest.call(this, 'GET', '/integrations', {}, query);
      responseData = (response.data as IDataObject[]) || [];
    }
  } else if (operation === 'get') {
    const integrationId = this.getNodeParameter('integrationId', i) as number;
    responseData = await gorgiasApiRequest.call(this, 'GET', `/integrations/${integrationId}`);
  } else if (operation === 'create') {
    const name = this.getNodeParameter('name', i) as string;
    const integrationType = this.getNodeParameter('integrationType', i) as string;
    const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;

    const requestBody: IDataObject = {
      name,
      type: integrationType,
      ...additionalFields,
    };

    // Handle HTTP-specific fields
    if (integrationType === 'http') {
      const httpUrl = this.getNodeParameter('httpUrl', i, '') as string;
      if (httpUrl) {
        requestBody.http_url = httpUrl;
      }

      if (additionalFields.httpHeaders) {
        try {
          requestBody.http_headers = JSON.parse(additionalFields.httpHeaders as string);
        } catch {
          requestBody.http_headers = {};
        }
        delete requestBody.httpHeaders;
      }
    }

    responseData = await gorgiasApiRequest.call(this, 'POST', '/integrations', requestBody);
  } else if (operation === 'update') {
    const integrationId = this.getNodeParameter('integrationId', i) as number;
    const updateFields = this.getNodeParameter('updateFields', i, {}) as IDataObject;

    // Parse HTTP headers if provided
    if (updateFields.http_headers && typeof updateFields.http_headers === 'string') {
      try {
        updateFields.http_headers = JSON.parse(updateFields.http_headers);
      } catch {
        updateFields.http_headers = {};
      }
    }

    responseData = await gorgiasApiRequest.call(this, 'PUT', `/integrations/${integrationId}`, updateFields);
  } else if (operation === 'delete') {
    const integrationId = this.getNodeParameter('integrationId', i) as number;
    await gorgiasApiRequest.call(this, 'DELETE', `/integrations/${integrationId}`);
    responseData = { success: true, integrationId };
  }

  return responseData;
}
