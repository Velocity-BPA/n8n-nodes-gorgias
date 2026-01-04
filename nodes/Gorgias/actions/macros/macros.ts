/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties, IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { gorgiasApiRequest, gorgiasApiRequestAllItems } from '../../transport/gorgiasApi';

export const macroOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['macro'],
      },
    },
    options: [
      { name: 'Apply', value: 'apply', description: 'Apply a macro to a ticket', action: 'Apply macro' },
      { name: 'Create', value: 'create', description: 'Create a new macro', action: 'Create macro' },
      { name: 'Delete', value: 'delete', description: 'Delete a macro', action: 'Delete macro' },
      { name: 'Get', value: 'get', description: 'Get a macro by ID', action: 'Get macro' },
      { name: 'Get Many', value: 'getAll', description: 'Get many macros', action: 'Get many macros' },
      { name: 'Update', value: 'update', description: 'Update a macro', action: 'Update macro' },
    ],
    default: 'getAll',
  },
];

export const macroFields: INodeProperties[] = [
  // Macro ID
  {
    displayName: 'Macro ID',
    name: 'macroId',
    type: 'number',
    required: true,
    default: 0,
    displayOptions: {
      show: {
        resource: ['macro'],
        operation: ['get', 'update', 'delete', 'apply'],
      },
    },
    description: 'The ID of the macro',
  },
  // Ticket ID for apply
  {
    displayName: 'Ticket ID',
    name: 'ticketId',
    type: 'number',
    required: true,
    default: 0,
    displayOptions: {
      show: {
        resource: ['macro'],
        operation: ['apply'],
      },
    },
    description: 'The ID of the ticket to apply the macro to',
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
        resource: ['macro'],
        operation: ['create'],
      },
    },
    description: 'The name of the macro',
  },
  // Body for create
  {
    displayName: 'Body (HTML)',
    name: 'body',
    type: 'string',
    typeOptions: {
      rows: 4,
    },
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['macro'],
        operation: ['create'],
      },
    },
    description: 'The HTML body/template of the macro',
  },
  // Return All
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    default: false,
    displayOptions: {
      show: {
        resource: ['macro'],
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
        resource: ['macro'],
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
        resource: ['macro'],
        operation: ['create'],
      },
    },
    options: [
      {
        displayName: 'Description',
        name: 'description',
        type: 'string',
        default: '',
        description: 'The description of the macro',
      },
      {
        displayName: 'Category',
        name: 'category',
        type: 'string',
        default: '',
        description: 'The category of the macro',
      },
      {
        displayName: 'Shared',
        name: 'shared',
        type: 'boolean',
        default: true,
        description: 'Whether the macro is shared with the team',
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
        resource: ['macro'],
        operation: ['update'],
      },
    },
    options: [
      {
        displayName: 'Name',
        name: 'name',
        type: 'string',
        default: '',
        description: 'The name of the macro',
      },
      {
        displayName: 'Body (HTML)',
        name: 'body',
        type: 'string',
        typeOptions: {
          rows: 4,
        },
        default: '',
        description: 'The HTML body/template of the macro',
      },
      {
        displayName: 'Description',
        name: 'description',
        type: 'string',
        default: '',
        description: 'The description of the macro',
      },
      {
        displayName: 'Category',
        name: 'category',
        type: 'string',
        default: '',
        description: 'The category of the macro',
      },
      {
        displayName: 'Shared',
        name: 'shared',
        type: 'boolean',
        default: true,
        description: 'Whether the macro is shared with the team',
      },
    ],
  },
  // Apply options
  {
    displayName: 'Apply Options',
    name: 'applyOptions',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    displayOptions: {
      show: {
        resource: ['macro'],
        operation: ['apply'],
      },
    },
    options: [
      {
        displayName: 'Send Message',
        name: 'send',
        type: 'boolean',
        default: false,
        description: 'Whether to send the message immediately after applying the macro',
      },
    ],
  },
];

export async function executeMacroOperations(
  this: IExecuteFunctions,
  operation: string,
  i: number,
): Promise<IDataObject | IDataObject[]> {
  let responseData: IDataObject | IDataObject[] = {};

  if (operation === 'getAll') {
    const returnAll = this.getNodeParameter('returnAll', i) as boolean;

    if (returnAll) {
      responseData = await gorgiasApiRequestAllItems.call(this, 'GET', '/macros');
    } else {
      const limit = this.getNodeParameter('limit', i) as number;
      const response = await gorgiasApiRequest.call(this, 'GET', '/macros', {}, { limit });
      responseData = (response.data as IDataObject[]) || [];
    }
  } else if (operation === 'get') {
    const macroId = this.getNodeParameter('macroId', i) as number;
    responseData = await gorgiasApiRequest.call(this, 'GET', `/macros/${macroId}`);
  } else if (operation === 'create') {
    const name = this.getNodeParameter('name', i) as string;
    const body = this.getNodeParameter('body', i) as string;
    const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;

    const requestBody: IDataObject = {
      name,
      actions: [
        {
          type: 'set_message_body',
          value: body,
        },
      ],
      ...additionalFields,
    };

    responseData = await gorgiasApiRequest.call(this, 'POST', '/macros', requestBody);
  } else if (operation === 'update') {
    const macroId = this.getNodeParameter('macroId', i) as number;
    const updateFields = this.getNodeParameter('updateFields', i, {}) as IDataObject;

    // Handle body field
    if (updateFields.body) {
      updateFields.actions = [
        {
          type: 'set_message_body',
          value: updateFields.body,
        },
      ];
      delete updateFields.body;
    }

    responseData = await gorgiasApiRequest.call(this, 'PUT', `/macros/${macroId}`, updateFields);
  } else if (operation === 'delete') {
    const macroId = this.getNodeParameter('macroId', i) as number;
    await gorgiasApiRequest.call(this, 'DELETE', `/macros/${macroId}`);
    responseData = { success: true, macroId };
  } else if (operation === 'apply') {
    const macroId = this.getNodeParameter('macroId', i) as number;
    const ticketId = this.getNodeParameter('ticketId', i) as number;
    const applyOptions = this.getNodeParameter('applyOptions', i, {}) as IDataObject;

    const requestBody: IDataObject = {
      ticket_id: ticketId,
    };

    if (applyOptions.send) {
      requestBody.send = true;
    }

    responseData = await gorgiasApiRequest.call(
      this,
      'POST',
      `/macros/${macroId}/apply`,
      requestBody,
    );
  }

  return responseData;
}
