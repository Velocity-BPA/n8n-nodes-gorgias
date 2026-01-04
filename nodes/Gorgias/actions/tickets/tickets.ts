/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties, IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { gorgiasApiRequest, gorgiasApiRequestAllItems } from '../../transport/gorgiasApi';
import { TICKET_STATUSES, TICKET_CHANNELS } from '../../constants/constants';

export const ticketOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['ticket'],
      },
    },
    options: [
      { name: 'Add Tag', value: 'addTag', description: 'Add a tag to a ticket', action: 'Add tag to ticket' },
      { name: 'Assign', value: 'assign', description: 'Assign ticket to a user', action: 'Assign ticket' },
      { name: 'Close', value: 'close', description: 'Close a ticket', action: 'Close ticket' },
      { name: 'Create', value: 'create', description: 'Create a new ticket', action: 'Create ticket' },
      { name: 'Delete', value: 'delete', description: 'Delete a ticket', action: 'Delete ticket' },
      { name: 'Get', value: 'get', description: 'Get a ticket by ID', action: 'Get ticket' },
      { name: 'Get Events', value: 'getEvents', description: 'Get ticket events/timeline', action: 'Get ticket events' },
      { name: 'Get Many', value: 'getAll', description: 'Get many tickets', action: 'Get many tickets' },
      { name: 'Get Messages', value: 'getMessages', description: 'Get messages in a ticket', action: 'Get ticket messages' },
      { name: 'Merge', value: 'merge', description: 'Merge multiple tickets', action: 'Merge tickets' },
      { name: 'Open', value: 'open', description: 'Reopen a ticket', action: 'Open ticket' },
      { name: 'Remove Tag', value: 'removeTag', description: 'Remove a tag from a ticket', action: 'Remove tag from ticket' },
      { name: 'Snooze', value: 'snooze', description: 'Snooze a ticket', action: 'Snooze ticket' },
      { name: 'Unassign', value: 'unassign', description: 'Remove assignee from ticket', action: 'Unassign ticket' },
      { name: 'Unsnooze', value: 'unsnooze', description: 'Unsnooze a ticket', action: 'Unsnooze ticket' },
      { name: 'Update', value: 'update', description: 'Update a ticket', action: 'Update ticket' },
    ],
    default: 'getAll',
  },
];

export const ticketFields: INodeProperties[] = [
  // Ticket ID for operations that need it
  {
    displayName: 'Ticket ID',
    name: 'ticketId',
    type: 'number',
    required: true,
    default: 0,
    displayOptions: {
      show: {
        resource: ['ticket'],
        operation: ['get', 'update', 'delete', 'assign', 'unassign', 'close', 'open', 'snooze', 'unsnooze', 'addTag', 'removeTag', 'getMessages', 'getEvents'],
      },
    },
    description: 'The ID of the ticket',
  },
  // Create ticket fields
  {
    displayName: 'Channel',
    name: 'channel',
    type: 'options',
    required: true,
    default: 'email',
    options: TICKET_CHANNELS.map((c) => ({ name: c.name, value: c.value })),
    displayOptions: {
      show: {
        resource: ['ticket'],
        operation: ['create'],
      },
    },
    description: 'The channel for the ticket',
  },
  {
    displayName: 'Customer Email',
    name: 'customerEmail',
    type: 'string',
    required: true,
    default: '',
    placeholder: 'customer@example.com',
    displayOptions: {
      show: {
        resource: ['ticket'],
        operation: ['create'],
      },
    },
    description: 'The email of the customer for this ticket',
  },
  {
    displayName: 'Subject',
    name: 'subject',
    type: 'string',
    default: '',
    displayOptions: {
      show: {
        resource: ['ticket'],
        operation: ['create'],
      },
    },
    description: 'The subject of the ticket',
  },
  {
    displayName: 'Message Body',
    name: 'body',
    type: 'string',
    typeOptions: {
      rows: 4,
    },
    default: '',
    displayOptions: {
      show: {
        resource: ['ticket'],
        operation: ['create'],
      },
    },
    description: 'The initial message body for the ticket',
  },
  // Return All for getAll
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    default: false,
    displayOptions: {
      show: {
        resource: ['ticket'],
        operation: ['getAll', 'getMessages', 'getEvents'],
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
        resource: ['ticket'],
        operation: ['getAll', 'getMessages', 'getEvents'],
        returnAll: [false],
      },
    },
    description: 'Max number of results to return',
  },
  // User ID for assign
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
        resource: ['ticket'],
        operation: ['assign'],
      },
    },
    description: 'The ID of the user to assign the ticket to',
  },
  // Tag ID for addTag/removeTag
  {
    displayName: 'Tag',
    name: 'tagId',
    type: 'options',
    typeOptions: {
      loadOptionsMethod: 'getTags',
    },
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['ticket'],
        operation: ['addTag', 'removeTag'],
      },
    },
    description: 'The tag to add or remove',
  },
  // Snooze datetime
  {
    displayName: 'Snooze Until',
    name: 'snoozeUntil',
    type: 'dateTime',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['ticket'],
        operation: ['snooze'],
      },
    },
    description: 'When to unsnooze the ticket',
  },
  // Merge tickets
  {
    displayName: 'Primary Ticket ID',
    name: 'primaryTicketId',
    type: 'number',
    required: true,
    default: 0,
    displayOptions: {
      show: {
        resource: ['ticket'],
        operation: ['merge'],
      },
    },
    description: 'The ID of the ticket to merge into (this ticket will remain)',
  },
  {
    displayName: 'Ticket IDs to Merge',
    name: 'ticketIdsToMerge',
    type: 'string',
    required: true,
    default: '',
    placeholder: '123, 456, 789',
    displayOptions: {
      show: {
        resource: ['ticket'],
        operation: ['merge'],
      },
    },
    description: 'Comma-separated list of ticket IDs to merge into the primary ticket',
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
        resource: ['ticket'],
        operation: ['update'],
      },
    },
    options: [
      {
        displayName: 'Subject',
        name: 'subject',
        type: 'string',
        default: '',
        description: 'The subject of the ticket',
      },
      {
        displayName: 'Status',
        name: 'status',
        type: 'options',
        options: TICKET_STATUSES.map((s) => ({ name: s.name, value: s.value })),
        default: 'open',
        description: 'The status of the ticket',
      },
      {
        displayName: 'Priority',
        name: 'priority',
        type: 'options',
        options: [
          { name: 'Low', value: 'low' },
          { name: 'Normal', value: 'normal' },
          { name: 'High', value: 'high' },
          { name: 'Urgent', value: 'urgent' },
        ],
        default: 'normal',
        description: 'The priority of the ticket',
      },
      {
        displayName: 'Assignee User ID',
        name: 'assignee_user_id',
        type: 'options',
        typeOptions: {
          loadOptionsMethod: 'getUsers',
        },
        default: '',
        description: 'The ID of the user to assign the ticket to',
      },
      {
        displayName: 'Assignee Team ID',
        name: 'assignee_team_id',
        type: 'options',
        typeOptions: {
          loadOptionsMethod: 'getTeams',
        },
        default: '',
        description: 'The ID of the team to assign the ticket to',
      },
      {
        displayName: 'Language',
        name: 'language',
        type: 'string',
        default: '',
        placeholder: 'en',
        description: 'The language code for the ticket',
      },
      {
        displayName: 'Spam',
        name: 'spam',
        type: 'boolean',
        default: false,
        description: 'Whether to mark the ticket as spam',
      },
    ],
  },
  // Additional options for create
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['ticket'],
        operation: ['create'],
      },
    },
    options: [
      {
        displayName: 'Assignee User ID',
        name: 'assignee_user_id',
        type: 'options',
        typeOptions: {
          loadOptionsMethod: 'getUsers',
        },
        default: '',
        description: 'The ID of the user to assign the ticket to',
      },
      {
        displayName: 'Assignee Team ID',
        name: 'assignee_team_id',
        type: 'options',
        typeOptions: {
          loadOptionsMethod: 'getTeams',
        },
        default: '',
        description: 'The ID of the team to assign the ticket to',
      },
      {
        displayName: 'Priority',
        name: 'priority',
        type: 'options',
        options: [
          { name: 'Low', value: 'low' },
          { name: 'Normal', value: 'normal' },
          { name: 'High', value: 'high' },
          { name: 'Urgent', value: 'urgent' },
        ],
        default: 'normal',
        description: 'The priority of the ticket',
      },
      {
        displayName: 'Tags',
        name: 'tags',
        type: 'string',
        default: '',
        placeholder: 'tag1, tag2',
        description: 'Comma-separated list of tag names',
      },
      {
        displayName: 'Language',
        name: 'language',
        type: 'string',
        default: '',
        placeholder: 'en',
        description: 'The language code for the ticket',
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
        resource: ['ticket'],
        operation: ['getAll'],
      },
    },
    options: [
      {
        displayName: 'Status',
        name: 'status',
        type: 'options',
        options: TICKET_STATUSES.map((s) => ({ name: s.name, value: s.value })),
        default: '',
        description: 'Filter by ticket status',
      },
      {
        displayName: 'Channel',
        name: 'channel',
        type: 'options',
        options: TICKET_CHANNELS.map((c) => ({ name: c.name, value: c.value })),
        default: '',
        description: 'Filter by ticket channel',
      },
      {
        displayName: 'Customer ID',
        name: 'customer_id',
        type: 'number',
        default: 0,
        description: 'Filter by customer ID',
      },
      {
        displayName: 'Assignee User ID',
        name: 'assignee_user_id',
        type: 'options',
        typeOptions: {
          loadOptionsMethod: 'getUsers',
        },
        default: '',
        description: 'Filter by assigned user',
      },
      {
        displayName: 'Assignee Team ID',
        name: 'assignee_team_id',
        type: 'options',
        typeOptions: {
          loadOptionsMethod: 'getTeams',
        },
        default: '',
        description: 'Filter by assigned team',
      },
      {
        displayName: 'Created After',
        name: 'created_datetime__gte',
        type: 'dateTime',
        default: '',
        description: 'Filter tickets created after this date',
      },
      {
        displayName: 'Created Before',
        name: 'created_datetime__lte',
        type: 'dateTime',
        default: '',
        description: 'Filter tickets created before this date',
      },
      {
        displayName: 'Updated After',
        name: 'updated_datetime__gte',
        type: 'dateTime',
        default: '',
        description: 'Filter tickets updated after this date',
      },
      {
        displayName: 'Order By',
        name: 'order_by',
        type: 'options',
        options: [
          { name: 'Created (Newest First)', value: 'created_datetime:desc' },
          { name: 'Created (Oldest First)', value: 'created_datetime:asc' },
          { name: 'Updated (Newest First)', value: 'updated_datetime:desc' },
          { name: 'Updated (Oldest First)', value: 'updated_datetime:asc' },
        ],
        default: 'created_datetime:desc',
        description: 'Sort order for tickets',
      },
    ],
  },
];

export async function executeTicketOperations(
  this: IExecuteFunctions,
  operation: string,
  i: number,
): Promise<IDataObject | IDataObject[]> {
  let responseData: IDataObject | IDataObject[] = {};

  if (operation === 'getAll') {
    const returnAll = this.getNodeParameter('returnAll', i) as boolean;
    const filters = this.getNodeParameter('filters', i, {}) as IDataObject;
    const query: IDataObject = {};

    // Apply filters
    for (const [key, value] of Object.entries(filters)) {
      if (value !== undefined && value !== '' && value !== 0) {
        query[key] = value;
      }
    }

    if (returnAll) {
      responseData = await gorgiasApiRequestAllItems.call(this, 'GET', '/tickets', {}, query);
    } else {
      const limit = this.getNodeParameter('limit', i) as number;
      query.limit = limit;
      const response = await gorgiasApiRequest.call(this, 'GET', '/tickets', {}, query);
      responseData = (response.data as IDataObject[]) || [];
    }
  } else if (operation === 'get') {
    const ticketId = this.getNodeParameter('ticketId', i) as number;
    responseData = await gorgiasApiRequest.call(this, 'GET', `/tickets/${ticketId}`);
  } else if (operation === 'create') {
    const channel = this.getNodeParameter('channel', i) as string;
    const customerEmail = this.getNodeParameter('customerEmail', i) as string;
    const subject = this.getNodeParameter('subject', i) as string;
    const body = this.getNodeParameter('body', i) as string;
    const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;

    const requestBody: IDataObject = {
      channel,
      customer: {
        email: customerEmail,
      },
      messages: [
        {
          channel,
          via: 'api',
          source: {
            type: 'email',
            from: { address: customerEmail },
          },
          body_html: body || undefined,
          body_text: body || undefined,
        },
      ],
    };

    if (subject) {
      requestBody.subject = subject;
    }

    // Handle tags
    if (additionalFields.tags) {
      const tagNames = (additionalFields.tags as string).split(',').map((t) => t.trim());
      requestBody.tags = tagNames.map((name) => ({ name }));
      delete additionalFields.tags;
    }

    Object.assign(requestBody, additionalFields);
    responseData = await gorgiasApiRequest.call(this, 'POST', '/tickets', requestBody);
  } else if (operation === 'update') {
    const ticketId = this.getNodeParameter('ticketId', i) as number;
    const updateFields = this.getNodeParameter('updateFields', i, {}) as IDataObject;

    responseData = await gorgiasApiRequest.call(this, 'PUT', `/tickets/${ticketId}`, updateFields);
  } else if (operation === 'delete') {
    const ticketId = this.getNodeParameter('ticketId', i) as number;
    await gorgiasApiRequest.call(this, 'DELETE', `/tickets/${ticketId}`);
    responseData = { success: true, ticketId };
  } else if (operation === 'assign') {
    const ticketId = this.getNodeParameter('ticketId', i) as number;
    const userId = this.getNodeParameter('userId', i) as number;

    responseData = await gorgiasApiRequest.call(this, 'PUT', `/tickets/${ticketId}`, {
      assignee_user_id: userId,
    });
  } else if (operation === 'unassign') {
    const ticketId = this.getNodeParameter('ticketId', i) as number;

    responseData = await gorgiasApiRequest.call(this, 'PUT', `/tickets/${ticketId}`, {
      assignee_user_id: null,
      assignee_team_id: null,
    });
  } else if (operation === 'close') {
    const ticketId = this.getNodeParameter('ticketId', i) as number;

    responseData = await gorgiasApiRequest.call(this, 'PUT', `/tickets/${ticketId}`, {
      status: 'closed',
    });
  } else if (operation === 'open') {
    const ticketId = this.getNodeParameter('ticketId', i) as number;

    responseData = await gorgiasApiRequest.call(this, 'PUT', `/tickets/${ticketId}`, {
      status: 'open',
    });
  } else if (operation === 'snooze') {
    const ticketId = this.getNodeParameter('ticketId', i) as number;
    const snoozeUntil = this.getNodeParameter('snoozeUntil', i) as string;

    responseData = await gorgiasApiRequest.call(this, 'PUT', `/tickets/${ticketId}`, {
      snooze_datetime: snoozeUntil,
    });
  } else if (operation === 'unsnooze') {
    const ticketId = this.getNodeParameter('ticketId', i) as number;

    responseData = await gorgiasApiRequest.call(this, 'PUT', `/tickets/${ticketId}`, {
      snooze_datetime: null,
    });
  } else if (operation === 'addTag') {
    const ticketId = this.getNodeParameter('ticketId', i) as number;
    const tagId = this.getNodeParameter('tagId', i) as number;

    // Get current ticket to get existing tags
    const ticket = (await gorgiasApiRequest.call(this, 'GET', `/tickets/${ticketId}`)) as {
      tags?: Array<{ id: number }>;
    };
    const existingTags = ticket.tags || [];
    const tagIds = existingTags.map((t) => ({ id: t.id }));
    tagIds.push({ id: tagId });

    responseData = await gorgiasApiRequest.call(this, 'PUT', `/tickets/${ticketId}`, {
      tags: tagIds,
    });
  } else if (operation === 'removeTag') {
    const ticketId = this.getNodeParameter('ticketId', i) as number;
    const tagId = this.getNodeParameter('tagId', i) as number;

    // Get current ticket to get existing tags
    const ticket = (await gorgiasApiRequest.call(this, 'GET', `/tickets/${ticketId}`)) as {
      tags?: Array<{ id: number }>;
    };
    const existingTags = ticket.tags || [];
    const tagIds = existingTags.filter((t) => t.id !== tagId).map((t) => ({ id: t.id }));

    responseData = await gorgiasApiRequest.call(this, 'PUT', `/tickets/${ticketId}`, {
      tags: tagIds,
    });
  } else if (operation === 'merge') {
    const primaryTicketId = this.getNodeParameter('primaryTicketId', i) as number;
    const ticketIdsToMerge = this.getNodeParameter('ticketIdsToMerge', i) as string;

    const ticketIds = ticketIdsToMerge.split(',').map((id) => parseInt(id.trim(), 10));

    responseData = await gorgiasApiRequest.call(this, 'POST', `/tickets/${primaryTicketId}/merge`, {
      ticket_ids: ticketIds,
    });
  } else if (operation === 'getMessages') {
    const ticketId = this.getNodeParameter('ticketId', i) as number;
    const returnAll = this.getNodeParameter('returnAll', i) as boolean;

    if (returnAll) {
      responseData = await gorgiasApiRequestAllItems.call(
        this,
        'GET',
        `/tickets/${ticketId}/messages`,
      );
    } else {
      const limit = this.getNodeParameter('limit', i) as number;
      const response = await gorgiasApiRequest.call(
        this,
        'GET',
        `/tickets/${ticketId}/messages`,
        {},
        { limit },
      );
      responseData = (response.data as IDataObject[]) || [];
    }
  } else if (operation === 'getEvents') {
    const ticketId = this.getNodeParameter('ticketId', i) as number;
    const returnAll = this.getNodeParameter('returnAll', i) as boolean;

    if (returnAll) {
      responseData = await gorgiasApiRequestAllItems.call(
        this,
        'GET',
        `/tickets/${ticketId}/events`,
      );
    } else {
      const limit = this.getNodeParameter('limit', i) as number;
      const response = await gorgiasApiRequest.call(
        this,
        'GET',
        `/tickets/${ticketId}/events`,
        {},
        { limit },
      );
      responseData = (response.data as IDataObject[]) || [];
    }
  }

  return responseData;
}
