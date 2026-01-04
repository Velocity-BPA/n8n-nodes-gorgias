/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IDataObject, INodePropertyOptions, ILoadOptionsFunctions } from 'n8n-workflow';
import { gorgiasApiRequest } from '../transport/gorgiasApi';

export function simplifyResponse(data: IDataObject, fields?: string[]): IDataObject {
  if (!fields || fields.length === 0) {
    return data;
  }

  const simplified: IDataObject = {};
  for (const field of fields) {
    if (data[field] !== undefined) {
      simplified[field] = data[field];
    }
  }
  return simplified;
}

export function buildQueryParams(options: IDataObject): IDataObject {
  const query: IDataObject = {};

  for (const [key, value] of Object.entries(options)) {
    if (value !== undefined && value !== '' && value !== null) {
      if (typeof value === 'object' && !Array.isArray(value)) {
        Object.assign(query, value);
      } else {
        query[key] = value;
      }
    }
  }

  return query;
}

export function formatDateForGorgias(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toISOString();
}

export function parseGorgiasDate(dateStr: string): Date {
  return new Date(dateStr);
}

export async function getUsers(
  this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
  try {
    const response = (await gorgiasApiRequest.call(
      this,
      'GET',
      '/users',
      {},
      { limit: 100 },
    )) as { data?: Array<{ id: number; email: string; firstname?: string; lastname?: string }> };

    if (!response.data) {
      return [];
    }

    return response.data.map((user) => ({
      name: user.firstname && user.lastname
        ? `${user.firstname} ${user.lastname} (${user.email})`
        : user.email,
      value: user.id,
    }));
  } catch {
    return [];
  }
}

export async function getTeams(
  this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
  try {
    const response = (await gorgiasApiRequest.call(
      this,
      'GET',
      '/teams',
      {},
      { limit: 100 },
    )) as { data?: Array<{ id: number; name: string }> };

    if (!response.data) {
      return [];
    }

    return response.data.map((team) => ({
      name: team.name,
      value: team.id,
    }));
  } catch {
    return [];
  }
}

export async function getTags(
  this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
  try {
    const response = (await gorgiasApiRequest.call(
      this,
      'GET',
      '/tags',
      {},
      { limit: 100 },
    )) as { data?: Array<{ id: number; name: string }> };

    if (!response.data) {
      return [];
    }

    return response.data.map((tag) => ({
      name: tag.name,
      value: tag.id,
    }));
  } catch {
    return [];
  }
}

export async function getViews(
  this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
  try {
    const response = (await gorgiasApiRequest.call(
      this,
      'GET',
      '/views',
      {},
      { limit: 100 },
    )) as { data?: Array<{ id: number; name: string }> };

    if (!response.data) {
      return [];
    }

    return response.data.map((view) => ({
      name: view.name,
      value: view.id,
    }));
  } catch {
    return [];
  }
}

export async function getMacros(
  this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
  try {
    const response = (await gorgiasApiRequest.call(
      this,
      'GET',
      '/macros',
      {},
      { limit: 100 },
    )) as { data?: Array<{ id: number; name: string }> };

    if (!response.data) {
      return [];
    }

    return response.data.map((macro) => ({
      name: macro.name,
      value: macro.id,
    }));
  } catch {
    return [];
  }
}

export async function getTickets(
  this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
  try {
    const response = (await gorgiasApiRequest.call(
      this,
      'GET',
      '/tickets',
      {},
      { limit: 30, order_by: 'created_datetime:desc' },
    )) as { data?: Array<{ id: number; subject?: string }> };

    if (!response.data) {
      return [];
    }

    return response.data.map((ticket) => ({
      name: ticket.subject || `Ticket #${ticket.id}`,
      value: ticket.id,
    }));
  } catch {
    return [];
  }
}

export async function getCustomers(
  this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
  try {
    const response = (await gorgiasApiRequest.call(
      this,
      'GET',
      '/customers',
      {},
      { limit: 30, order_by: 'created_datetime:desc' },
    )) as { data?: Array<{ id: number; email?: string; name?: string }> };

    if (!response.data) {
      return [];
    }

    return response.data.map((customer) => ({
      name: customer.name || customer.email || `Customer #${customer.id}`,
      value: customer.id,
    }));
  } catch {
    return [];
  }
}

export async function getIntegrations(
  this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
  try {
    const response = (await gorgiasApiRequest.call(
      this,
      'GET',
      '/integrations',
      {},
      { limit: 100 },
    )) as { data?: Array<{ id: number; name: string; type: string }> };

    if (!response.data) {
      return [];
    }

    return response.data.map((integration) => ({
      name: `${integration.name} (${integration.type})`,
      value: integration.id,
    }));
  } catch {
    return [];
  }
}

export async function getRules(
  this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
  try {
    const response = (await gorgiasApiRequest.call(
      this,
      'GET',
      '/rules',
      {},
      { limit: 100 },
    )) as { data?: Array<{ id: number; name: string }> };

    if (!response.data) {
      return [];
    }

    return response.data.map((rule) => ({
      name: rule.name,
      value: rule.id,
    }));
  } catch {
    return [];
  }
}

export function sanitizeHtml(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/on\w+='[^']*'/gi, '');
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength - 3) + '...';
}

export function parseIdList(input: string | number | number[]): number[] {
  if (Array.isArray(input)) {
    return input;
  }
  if (typeof input === 'number') {
    return [input];
  }
  return input.split(',').map((id) => parseInt(id.trim(), 10)).filter((id) => !isNaN(id));
}
