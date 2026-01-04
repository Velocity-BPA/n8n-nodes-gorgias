/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
  IAuthenticateGeneric,
  ICredentialTestRequest,
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow';

export class GorgiasApi implements ICredentialType {
  name = 'gorgiasApi';
  displayName = 'Gorgias API';
  documentationUrl = 'https://developers.gorgias.com/reference/introduction';
  properties: INodeProperties[] = [
    {
      displayName: 'Helpdesk Domain',
      name: 'domain',
      type: 'string',
      default: '',
      placeholder: 'your-store',
      description: 'Your Gorgias helpdesk subdomain (e.g., "your-store" for your-store.gorgias.com)',
      required: true,
    },
    {
      displayName: 'API Email',
      name: 'email',
      type: 'string',
      placeholder: 'name@email.com',
      default: '',
      description: 'The email address associated with the API key',
      required: true,
    },
    {
      displayName: 'API Key',
      name: 'apiKey',
      type: 'string',
      typeOptions: {
        password: true,
      },
      default: '',
      description: 'Your Gorgias API key. Generate from Settings → REST API in your Gorgias dashboard.',
      required: true,
    },
  ];

  authenticate: IAuthenticateGeneric = {
    type: 'generic',
    properties: {
      auth: {
        username: '={{$credentials.email}}',
        password: '={{$credentials.apiKey}}',
      },
    },
  };

  test: ICredentialTestRequest = {
    request: {
      baseURL: '=https://{{$credentials.domain}}.gorgias.com',
      url: '/api/account',
      method: 'GET',
    },
  };
}
