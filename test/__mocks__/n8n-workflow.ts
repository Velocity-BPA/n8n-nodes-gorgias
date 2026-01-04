/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

// Mock types for n8n-workflow

export interface INodeProperties {
  displayName: string;
  name: string;
  type: string;
  default?: unknown;
  required?: boolean;
  noDataExpression?: boolean;
  displayOptions?: {
    show?: Record<string, unknown[]>;
    hide?: Record<string, unknown[]>;
  };
  options?: Array<{
    name: string;
    value: string;
    description?: string;
    action?: string;
  }>;
  description?: string;
  typeOptions?: Record<string, unknown>;
  placeholder?: string;
}

export interface INodeTypeDescription {
  displayName: string;
  name: string;
  icon?: string;
  group: string[];
  version: number;
  subtitle?: string;
  description: string;
  defaults: {
    name: string;
  };
  inputs: string[];
  outputs: string[];
  credentials?: Array<{
    name: string;
    required?: boolean;
    displayOptions?: Record<string, unknown>;
  }>;
  webhooks?: Array<{
    name: string;
    httpMethod: string;
    responseMode: string;
    path: string;
  }>;
  properties: INodeProperties[];
}

export interface INodeType {
  description: INodeTypeDescription;
  execute?(this: IExecuteFunctions): Promise<INodeExecutionData[][]>;
  webhook?(this: IWebhookFunctions): Promise<IWebhookResponseData>;
  webhookMethods?: {
    [key: string]: {
      checkExists: (this: IHookFunctions) => Promise<boolean>;
      create: (this: IHookFunctions) => Promise<boolean>;
      delete: (this: IHookFunctions) => Promise<boolean>;
    };
  };
}

export interface IExecuteFunctions {
  getNodeParameter(parameterName: string, itemIndex: number, fallbackValue?: unknown): unknown;
  getInputData(): INodeExecutionData[];
  getCredentials(type: string): Promise<ICredentialDataDecryptedObject>;
  helpers: IExecuteFunctionsHelpers;
  continueOnFail(): boolean;
  logger: ILogger;
}

export interface IWebhookFunctions {
  getNodeParameter(parameterName: string, fallbackValue?: unknown): unknown;
  getBodyData(): IDataObject;
  getHeaderData(): IDataObject;
  helpers: IWebhookFunctionsHelpers;
}

export interface IHookFunctions {
  getNodeParameter(parameterName: string, fallbackValue?: unknown): unknown;
  getNodeWebhookUrl(name: string): string;
  getWorkflowStaticData(type: string): IDataObject;
  logger: ILogger;
}

export interface ICredentialsDecrypted {
  data: ICredentialDataDecryptedObject;
}

export interface ICredentialDataDecryptedObject {
  [key: string]: unknown;
}

export interface ICredentialTestFunctions {
  helpers: {
    request: (options: IHttpRequestOptions) => Promise<unknown>;
  };
}

export interface ICredentialType {
  name: string;
  displayName: string;
  documentationUrl?: string;
  properties: INodeProperties[];
  authenticate?: IAuthenticate;
  test?: ICredentialTestRequest;
}

export interface IAuthenticate {
  type: string;
  properties: Record<string, unknown>;
}

export interface ICredentialTestRequest {
  request: IHttpRequestOptions;
}

export interface IHttpRequestOptions {
  method?: string;
  url?: string;
  baseURL?: string;
  headers?: Record<string, string>;
  body?: unknown;
  qs?: Record<string, unknown>;
  json?: boolean;
}

export interface INodeExecutionData {
  json: IDataObject;
  binary?: IBinaryKeyData;
  pairedItem?: IPairedItemData;
}

export interface IPairedItemData {
  item: number;
}

export interface IBinaryKeyData {
  [key: string]: IBinaryData;
}

export interface IBinaryData {
  data: string;
  mimeType: string;
  fileName?: string;
}

export interface IDataObject {
  [key: string]: unknown;
}

export type JsonObject = Record<string, unknown>;

export interface IExecuteFunctionsHelpers {
  request(options: IHttpRequestOptions): Promise<unknown>;
  requestWithAuthentication(
    credentialsType: string,
    options: IHttpRequestOptions,
    additionalCredentialOptions?: IAdditionalCredentialOptions,
  ): Promise<unknown>;
  httpRequestWithAuthentication(
    credentialsType: string,
    options: IHttpRequestOptions,
  ): Promise<unknown>;
  returnJsonArray(data: IDataObject | IDataObject[]): INodeExecutionData[];
}

export interface IWebhookFunctionsHelpers {
  returnJsonArray(data: IDataObject | IDataObject[]): INodeExecutionData[];
}

export interface IAdditionalCredentialOptions {
  oauth2?: {
    tokenType?: string;
  };
}

export interface IWebhookResponseData {
  webhookResponse?: unknown;
  workflowData?: INodeExecutionData[][];
}

export interface ILogger {
  debug(message: string, ...args: unknown[]): void;
  info(message: string, ...args: unknown[]): void;
  warn(message: string, ...args: unknown[]): void;
  error(message: string, ...args: unknown[]): void;
}

export class NodeApiError extends Error {
  description: string;
  httpCode: string;

  constructor(_node: INodeType, error: Error | JsonObject, options?: { httpCode?: string; description?: string }) {
    super(error instanceof Error ? error.message : 'API Error');
    this.name = 'NodeApiError';
    this.description = options?.description || '';
    this.httpCode = options?.httpCode || '500';
  }
}
