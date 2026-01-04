/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties, IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { gorgiasApiRequest, gorgiasApiRequestAllItems } from '../../transport/gorgiasApi';

export const teamOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['team'],
      },
    },
    options: [
      { name: 'Add Member', value: 'addMember', description: 'Add a member to a team', action: 'Add member to team' },
      { name: 'Create', value: 'create', description: 'Create a new team', action: 'Create team' },
      { name: 'Delete', value: 'delete', description: 'Delete a team', action: 'Delete team' },
      { name: 'Get', value: 'get', description: 'Get a team by ID', action: 'Get team' },
      { name: 'Get Many', value: 'getAll', description: 'Get many teams', action: 'Get many teams' },
      { name: 'Get Members', value: 'getMembers', description: 'Get team members', action: 'Get team members' },
      { name: 'Remove Member', value: 'removeMember', description: 'Remove a member from a team', action: 'Remove member from team' },
      { name: 'Update', value: 'update', description: 'Update a team', action: 'Update team' },
    ],
    default: 'getAll',
  },
];

export const teamFields: INodeProperties[] = [
  // Team ID
  {
    displayName: 'Team ID',
    name: 'teamId',
    type: 'number',
    required: true,
    default: 0,
    displayOptions: {
      show: {
        resource: ['team'],
        operation: ['get', 'update', 'delete', 'getMembers', 'addMember', 'removeMember'],
      },
    },
    description: 'The ID of the team',
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
        resource: ['team'],
        operation: ['create'],
      },
    },
    description: 'The name of the team',
  },
  // User ID for add/remove member
  {
    displayName: 'User ID',
    name: 'userId',
    type: 'options',
    typeOptions: {
      loadOptionsMethod: 'getUsers',
    },
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['team'],
        operation: ['addMember', 'removeMember'],
      },
    },
    description: 'The ID of the user to add or remove',
  },
  // Return All
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    default: false,
    displayOptions: {
      show: {
        resource: ['team'],
        operation: ['getAll', 'getMembers'],
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
        resource: ['team'],
        operation: ['getAll', 'getMembers'],
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
        resource: ['team'],
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
        description: 'The description of the team',
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
        resource: ['team'],
        operation: ['update'],
      },
    },
    options: [
      {
        displayName: 'Name',
        name: 'name',
        type: 'string',
        default: '',
        description: 'The name of the team',
      },
      {
        displayName: 'Description',
        name: 'description',
        type: 'string',
        typeOptions: {
          rows: 3,
        },
        default: '',
        description: 'The description of the team',
      },
    ],
  },
];

export async function executeTeamOperations(
  this: IExecuteFunctions,
  operation: string,
  i: number,
): Promise<IDataObject | IDataObject[]> {
  let responseData: IDataObject | IDataObject[] = {};

  if (operation === 'getAll') {
    const returnAll = this.getNodeParameter('returnAll', i) as boolean;

    if (returnAll) {
      responseData = await gorgiasApiRequestAllItems.call(this, 'GET', '/teams');
    } else {
      const limit = this.getNodeParameter('limit', i) as number;
      const response = await gorgiasApiRequest.call(this, 'GET', '/teams', {}, { limit });
      responseData = (response.data as IDataObject[]) || [];
    }
  } else if (operation === 'get') {
    const teamId = this.getNodeParameter('teamId', i) as number;
    responseData = await gorgiasApiRequest.call(this, 'GET', `/teams/${teamId}`);
  } else if (operation === 'create') {
    const name = this.getNodeParameter('name', i) as string;
    const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;

    const requestBody: IDataObject = {
      name,
      ...additionalFields,
    };

    responseData = await gorgiasApiRequest.call(this, 'POST', '/teams', requestBody);
  } else if (operation === 'update') {
    const teamId = this.getNodeParameter('teamId', i) as number;
    const updateFields = this.getNodeParameter('updateFields', i, {}) as IDataObject;

    responseData = await gorgiasApiRequest.call(this, 'PUT', `/teams/${teamId}`, updateFields);
  } else if (operation === 'delete') {
    const teamId = this.getNodeParameter('teamId', i) as number;
    await gorgiasApiRequest.call(this, 'DELETE', `/teams/${teamId}`);
    responseData = { success: true, teamId };
  } else if (operation === 'getMembers') {
    const teamId = this.getNodeParameter('teamId', i) as number;
    const returnAll = this.getNodeParameter('returnAll', i) as boolean;

    if (returnAll) {
      responseData = await gorgiasApiRequestAllItems.call(
        this,
        'GET',
        `/teams/${teamId}/members`,
      );
    } else {
      const limit = this.getNodeParameter('limit', i) as number;
      const response = await gorgiasApiRequest.call(
        this,
        'GET',
        `/teams/${teamId}/members`,
        {},
        { limit },
      );
      responseData = (response.data as IDataObject[]) || [];
    }
  } else if (operation === 'addMember') {
    const teamId = this.getNodeParameter('teamId', i) as number;
    const userId = this.getNodeParameter('userId', i) as number;

    responseData = await gorgiasApiRequest.call(this, 'POST', `/teams/${teamId}/members`, {
      user_id: userId,
    });
  } else if (operation === 'removeMember') {
    const teamId = this.getNodeParameter('teamId', i) as number;
    const userId = this.getNodeParameter('userId', i) as number;

    await gorgiasApiRequest.call(this, 'DELETE', `/teams/${teamId}/members/${userId}`);
    responseData = { success: true, teamId, userId };
  }

  return responseData;
}
