/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties, IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { gorgiasApiRequest } from '../../transport/gorgiasApi';

export const statisticsOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['statistics'],
      },
    },
    options: [
      { name: 'Get Agent Stats', value: 'getAgentStats', description: 'Get agent performance statistics', action: 'Get agent stats' },
      { name: 'Get Response Time Stats', value: 'getResponseTimeStats', description: 'Get response time statistics', action: 'Get response time stats' },
      { name: 'Get Satisfaction Stats', value: 'getSatisfactionStats', description: 'Get CSAT satisfaction scores', action: 'Get satisfaction stats' },
      { name: 'Get Ticket Stats', value: 'getTicketStats', description: 'Get ticket statistics', action: 'Get ticket stats' },
      { name: 'Get Volume Stats', value: 'getVolumeStats', description: 'Get ticket volume statistics', action: 'Get volume stats' },
    ],
    default: 'getTicketStats',
  },
];

export const statisticsFields: INodeProperties[] = [
  // Date range for all stats
  {
    displayName: 'Period',
    name: 'period',
    type: 'options',
    required: true,
    options: [
      { name: 'Today', value: 'today' },
      { name: 'Yesterday', value: 'yesterday' },
      { name: 'This Week', value: 'this_week' },
      { name: 'Last Week', value: 'last_week' },
      { name: 'This Month', value: 'this_month' },
      { name: 'Last Month', value: 'last_month' },
      { name: 'This Quarter', value: 'this_quarter' },
      { name: 'Last Quarter', value: 'last_quarter' },
      { name: 'This Year', value: 'this_year' },
      { name: 'Last Year', value: 'last_year' },
      { name: 'Custom', value: 'custom' },
    ],
    default: 'this_week',
    displayOptions: {
      show: {
        resource: ['statistics'],
      },
    },
    description: 'The time period for statistics',
  },
  // Custom date range
  {
    displayName: 'Start Date',
    name: 'startDate',
    type: 'dateTime',
    default: '',
    displayOptions: {
      show: {
        resource: ['statistics'],
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
        resource: ['statistics'],
        period: ['custom'],
      },
    },
    description: 'The end date for custom period',
  },
  // User ID for agent stats
  {
    displayName: 'User ID',
    name: 'userId',
    type: 'number',
    default: 0,
    displayOptions: {
      show: {
        resource: ['statistics'],
        operation: ['getAgentStats'],
      },
    },
    description: 'Specific user ID to get stats for (leave empty for all agents)',
  },
  // Grouping options
  {
    displayName: 'Options',
    name: 'options',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    displayOptions: {
      show: {
        resource: ['statistics'],
      },
    },
    options: [
      {
        displayName: 'Group By',
        name: 'groupBy',
        type: 'options',
        options: [
          { name: 'Hour', value: 'hour' },
          { name: 'Day', value: 'day' },
          { name: 'Week', value: 'week' },
          { name: 'Month', value: 'month' },
        ],
        default: 'day',
        description: 'Group statistics by time interval',
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
          { name: 'Twitter', value: 'twitter' },
          { name: 'WhatsApp', value: 'whatsapp' },
        ],
        default: '',
        description: 'Filter by specific channel',
      },
      {
        displayName: 'Team ID',
        name: 'teamId',
        type: 'number',
        default: 0,
        description: 'Filter by specific team',
      },
      {
        displayName: 'Tag ID',
        name: 'tagId',
        type: 'number',
        default: 0,
        description: 'Filter by specific tag',
      },
      {
        displayName: 'Timezone',
        name: 'timezone',
        type: 'string',
        default: 'UTC',
        description: 'Timezone for date calculations (e.g., America/New_York)',
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
    case 'yesterday':
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
      end = new Date(now.getFullYear(), now.getMonth(), now.getDate());
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
    case 'last_year':
      start = new Date(now.getFullYear() - 1, 0, 1);
      end = new Date(now.getFullYear() - 1, 11, 31);
      break;
    case 'custom':
      start = startDate ? new Date(startDate) : now;
      end = endDate ? new Date(endDate) : now;
      break;
    default:
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
      end = now;
  }

  return {
    start: start.toISOString(),
    end: end.toISOString(),
  };
}

export async function executeStatisticsOperations(
  this: IExecuteFunctions,
  operation: string,
  i: number,
): Promise<IDataObject | IDataObject[]> {
  let responseData: IDataObject | IDataObject[] = {};

  const period = this.getNodeParameter('period', i) as string;
  const options = this.getNodeParameter('options', i, {}) as IDataObject;
  
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
  if (options.groupBy) {
    query.group_by = options.groupBy;
  }
  if (options.channel) {
    query.channel = options.channel;
  }
  if (options.teamId) {
    query.team_id = options.teamId;
  }
  if (options.tagId) {
    query.tag_id = options.tagId;
  }
  if (options.timezone) {
    query.timezone = options.timezone;
  }

  if (operation === 'getTicketStats') {
    responseData = await gorgiasApiRequest.call(this, 'GET', '/stats/tickets', {}, query);
  } else if (operation === 'getAgentStats') {
    const userId = this.getNodeParameter('userId', i, 0) as number;
    if (userId) {
      query.user_id = userId;
    }
    responseData = await gorgiasApiRequest.call(this, 'GET', '/stats/agents', {}, query);
  } else if (operation === 'getSatisfactionStats') {
    responseData = await gorgiasApiRequest.call(this, 'GET', '/stats/satisfaction', {}, query);
  } else if (operation === 'getResponseTimeStats') {
    responseData = await gorgiasApiRequest.call(this, 'GET', '/stats/response-time', {}, query);
  } else if (operation === 'getVolumeStats') {
    responseData = await gorgiasApiRequest.call(this, 'GET', '/stats/volume', {}, query);
  }

  return responseData;
}
