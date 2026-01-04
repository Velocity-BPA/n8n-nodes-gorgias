/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
  IExecuteFunctions,
  IHookFunctions,
  ILoadOptionsFunctions,
  IWebhookFunctions,
  IHttpRequestMethods,
  IRequestOptions,
  IDataObject,
  JsonObject,
} from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';

export interface IGorgiasCredentials {
  domain: string;
  email: string;
  apiKey: string;
}

export interface IGorgiasResponse<T = IDataObject> {
  data?: T[];
  meta?: {
    page?: number;
    per_page?: number;
    total?: number;
    next_cursor?: string;
    previous_cursor?: string;
  };
}

export async function gorgiasApiRequest(
  this: IExecuteFunctions | ILoadOptionsFunctions | IHookFunctions | IWebhookFunctions,
  method: IHttpRequestMethods,
  endpoint: string,
  body: IDataObject = {},
  query: IDataObject = {},
  _options: IDataObject = {},
): Promise<IDataObject> {
  const credentials = (await this.getCredentials('gorgiasApi')) as unknown as IGorgiasCredentials;

  const baseUrl = `https://${credentials.domain}.gorgias.com/api`;

  const requestOptions: IRequestOptions = {
    method,
    uri: `${baseUrl}${endpoint}`,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    auth: {
      user: credentials.email,
      pass: credentials.apiKey,
    },
    json: true,
  };

  if (Object.keys(query).length > 0) {
    requestOptions.qs = query;
  }

  if (Object.keys(body).length > 0 && method !== 'GET') {
    requestOptions.body = body;
  }

  try {
    const response = await this.helpers.request(requestOptions);
    return response as IDataObject;
  } catch (error) {
    throw new NodeApiError(this.getNode(), error as JsonObject, {
      message: `Gorgias API Error: ${(error as Error).message}`,
    });
  }
}

export async function gorgiasApiRequestAllItems(
  this: IExecuteFunctions | ILoadOptionsFunctions,
  method: IHttpRequestMethods,
  endpoint: string,
  body: IDataObject = {},
  query: IDataObject = {},
  dataKey = 'data',
): Promise<IDataObject[]> {
  const returnData: IDataObject[] = [];
  let responseData: IDataObject;
  let cursor: string | undefined;

  query.limit = query.limit || 100;

  do {
    if (cursor) {
      query.cursor = cursor;
    }

    responseData = await gorgiasApiRequest.call(this, method, endpoint, body, query);

    const items = (responseData[dataKey] as IDataObject[]) || [];
    returnData.push(...items);

    cursor =
      (responseData.meta as IDataObject)?.next_cursor as string | undefined;
  } while (cursor);

  return returnData;
}

export function handleGorgiasError(error: unknown): never {
  const err = error as { response?: { body?: { message?: string; errors?: unknown } }; message?: string };
  
  if (err.response?.body) {
    const body = err.response.body;
    const message = body.message || 'Unknown Gorgias API error';
    const details = body.errors ? JSON.stringify(body.errors) : '';
    throw new Error(`Gorgias API Error: ${message}${details ? ` - ${details}` : ''}`);
  }
  
  throw new Error(`Gorgias API Error: ${err.message || 'Unknown error'}`);
}
