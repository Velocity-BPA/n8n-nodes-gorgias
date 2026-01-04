/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties, IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { gorgiasApiRequest, gorgiasApiRequestAllItems } from '../../transport/gorgiasApi';

export const satisfactionOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['satisfaction'],
      },
    },
    options: [
      { name: 'Get Many Surveys', value: 'getSurveys', description: 'List satisfaction surveys', action: 'Get many surveys' },
      { name: 'Get Survey Responses', value: 'getResponses', description: 'Get survey responses', action: 'Get survey responses' },
      { name: 'Get Survey Stats', value: 'getStats', description: 'Get survey statistics', action: 'Get survey stats' },
    ],
    default: 'getResponses',
  },
];

export const satisfactionFields: INodeProperties[] = [
  // Return All for surveys and responses
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    default: false,
    displayOptions: {
      show: {
        resource: ['satisfaction'],
        operation: ['getSurveys', 'getResponses'],
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
        resource: ['satisfaction'],
        operation: ['getSurveys', 'getResponses'],
        returnAll: [false],
      },
    },
    description: 'Max number of results to return',
  },
  // Filters for responses
  {
    displayName: 'Filters',
    name: 'filters',
    type: 'collection',
    placeholder: 'Add Filter',
    default: {},
    displayOptions: {
      show: {
        resource: ['satisfaction'],
        operation: ['getResponses'],
      },
    },
    options: [
      {
        displayName: 'Score',
        name: 'score',
        type: 'options',
        options: [
          { name: 'All Scores', value: '' },
          { name: 'Very Unsatisfied (1)', value: '1' },
          { name: 'Unsatisfied (2)', value: '2' },
          { name: 'Neutral (3)', value: '3' },
          { name: 'Satisfied (4)', value: '4' },
          { name: 'Very Satisfied (5)', value: '5' },
        ],
        default: '',
        description: 'Filter by satisfaction score',
      },
      {
        displayName: 'Ticket ID',
        name: 'ticket_id',
        type: 'number',
        default: 0,
        description: 'Filter by specific ticket',
      },
      {
        displayName: 'User ID',
        name: 'user_id',
        type: 'number',
        default: 0,
        description: 'Filter by specific agent',
      },
      {
        displayName: 'Customer ID',
        name: 'customer_id',
        type: 'number',
        default: 0,
        description: 'Filter by specific customer',
      },
      {
        displayName: 'Created After',
        name: 'created_datetime__gte',
        type: 'dateTime',
        default: '',
        description: 'Filter responses created after this date',
      },
      {
        displayName: 'Created Before',
        name: 'created_datetime__lte',
        type: 'dateTime',
        default: '',
        description: 'Filter responses created before this date',
      },
      {
        displayName: 'Has Comment',
        name: 'has_comment',
        type: 'boolean',
        default: false,
        description: 'Filter responses with comments only',
      },
    ],
  },
  // Stats date range
  {
    displayName: 'Period',
    name: 'period',
    type: 'options',
    required: true,
    options: [
      { name: 'Today', value: 'today' },
      { name: 'This Week', value: 'this_week' },
      { name: 'Last Week', value: 'last_week' },
      { name: 'This Month', value: 'this_month' },
      { name: 'Last Month', value: 'last_month' },
      { name: 'This Quarter', value: 'this_quarter' },
      { name: 'Last Quarter', value: 'last_quarter' },
      { name: 'This Year', value: 'this_year' },
      { name: 'Custom', value: 'custom' },
    ],
    default: 'this_month',
    displayOptions: {
      show: {
        resource: ['satisfaction'],
        operation: ['getStats'],
      },
    },
    description: 'The time period for statistics',
  },
  {
    displayName: 'Start Date',
    name: 'startDate',
    type: 'dateTime',
    default: '',
    displayOptions: {
      show: {
        resource: ['satisfaction'],
        operation: ['getStats'],
        period: ['custom'],
      },
    },
    description: 'The start date for custom period',
  },
  {
    displayName: 'End Date',
    name: 'endDate',
    type: 'dateTime',
    default: '',
    displayOptions: {
      show: {
        resource: ['satisfaction'],
        operation: ['getStats'],
        period: ['custom'],
      },
    },
    description: 'The end date for custom period',
  },
  // Stats options
  {
    displayName: 'Options',
    name: 'statsOptions',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    displayOptions: {
      show: {
        resource: ['satisfaction'],
        operation: ['getStats'],
      },
    },
    options: [
      {
        displayName: 'Group By',
        name: 'groupBy',
        type: 'options',
        options: [
          { name: 'Day', value: 'day' },
          { name: 'Week', value: 'week' },
          { name: 'Month', value: 'month' },
          { name: 'Agent', value: 'agent' },
          { name: 'Team', value: 'team' },
          { name: 'Channel', value: 'channel' },
        ],
        default: 'day',
        description: 'Group statistics by dimension',
      },
      {
        displayName: 'User ID',
        name: 'userId',
        type: 'number',
        default: 0,
        description: 'Filter by specific agent',
      },
      {
        displayName: 'Team ID',
        name: 'teamId',
        type: 'number',
        default: 0,
        description: 'Filter by specific team',
      },
      {
        displayName: 'Channel',
        name: 'channel',
        type: 'options',
        options: [
          { name: 'All Channels', value: '' },
          { name: 'Email', value: 'email' },
          { name: 'Chat', value: 'chat' },
          { name: 'Phone', value: 'phone' },
          { name: 'SMS', value: 'sms' },
          { name: 'Facebook', value: 'facebook' },
          { name: 'Instagram', value: 'instagram' },
        ],
        default: '',
        description: 'Filter by specific channel',
      },
    ],
  },
];

function getDateRange(period: string, startDate?: string, endDate?: string): { start: string; end: string } {
  const now = new Date();
  let start: Date;
  let end: Date;

  switch (period) {
    case 'today':
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      end = now;
      break;
    case 'this_week':
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
      end = now;
      break;
    case 'last_week':
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay() - 7);
      end = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
      break;
    case 'this_month':
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      end = now;
      break;
    case 'last_month':
      start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      end = new Date(now.getFullYear(), now.getMonth(), 0);
      break;
    case 'this_quarter': {
      const currentQuarter = Math.floor(now.getMonth() / 3);
      start = new Date(now.getFullYear(), currentQuarter * 3, 1);
      end = now;
      break;
    }
    case 'last_quarter': {
      const lastQuarter = Math.floor(now.getMonth() / 3) - 1;
      const lastQuarterYear = lastQuarter < 0 ? now.getFullYear() - 1 : now.getFullYear();
      const adjustedQuarter = lastQuarter < 0 ? 3 : lastQuarter;
      start = new Date(lastQuarterYear, adjustedQuarter * 3, 1);
      end = new Date(lastQuarterYear, adjustedQuarter * 3 + 3, 0);
      break;
    }
    case 'this_year':
      start = new Date(now.getFullYear(), 0, 1);
      end = now;
      break;
    case 'custom':
      start = startDate ? new Date(startDate) : now;
      end = endDate ? new Date(endDate) : now;
      break;
    default:
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      end = now;
  }

  return {
    start: start.toISOString(),
    end: end.toISOString(),
  };
}

export async function executeSatisfactionOperations(
  this: IExecuteFunctions,
  operation: string,
  i: number,
): Promise<IDataObject | IDataObject[]> {
  let responseData: IDataObject | IDataObject[] = {};

  if (operation === 'getSurveys') {
    const returnAll = this.getNodeParameter('returnAll', i) as boolean;
    const query: IDataObject = {};

    if (returnAll) {
      responseData = await gorgiasApiRequestAllItems.call(this, 'GET', '/satisfaction-surveys', {}, query);
    } else {
      const limit = this.getNodeParameter('limit', i) as number;
      query.limit = limit;
      const response = await gorgiasApiRequest.call(this, 'GET', '/satisfaction-surveys', {}, query);
      responseData = (response.data as IDataObject[]) || [];
    }
  } else if (operation === 'getResponses') {
    const returnAll = this.getNodeParameter('returnAll', i) as boolean;
    const filters = this.getNodeParameter('filters', i, {}) as IDataObject;
    const query: IDataObject = {};

    // Build query from filters
    for (const [key, value] of Object.entries(filters)) {
      if (value !== undefined && value !== '' && value !== 0) {
        query[key] = value;
      }
    }

    if (returnAll) {
      responseData = await gorgiasApiRequestAllItems.call(this, 'GET', '/satisfaction-surveys/responses', {}, query);
    } else {
      const limit = this.getNodeParameter('limit', i) as number;
      query.limit = limit;
      const response = await gorgiasApiRequest.call(this, 'GET', '/satisfaction-surveys/responses', {}, query);
      responseData = (response.data as IDataObject[]) || [];
    }
  } else if (operation === 'getStats') {
    const period = this.getNodeParameter('period', i) as string;
    const statsOptions = this.getNodeParameter('statsOptions', i, {}) as IDataObject;
    
    let startDate: string | undefined;
    let endDate: string | undefined;
    
    if (period === 'custom') {
      startDate = this.getNodeParameter('startDate', i, '') as string;
      endDate = this.getNodeParameter('endDate', i, '') as string;
    }

    const dateRange = getDateRange(period, startDate, endDate);
    const query: IDataObject = {
      start_datetime: dateRange.start,
      end_datetime: dateRange.end,
    };

    // Add optional filters
    if (statsOptions.groupBy) {
      query.group_by = statsOptions.groupBy;
    }
    if (statsOptions.userId) {
      query.user_id = statsOptions.userId;
    }
    if (statsOptions.teamId) {
      query.team_id = statsOptions.teamId;
    }
    if (statsOptions.channel) {
      query.channel = statsOptions.channel;
    }

    responseData = await gorgiasApiRequest.call(this, 'GET', '/satisfaction-surveys/stats', {}, query);
  }

  return responseData;
}
