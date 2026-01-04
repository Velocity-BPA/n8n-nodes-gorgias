/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { Gorgias } from '../../nodes/Gorgias/Gorgias.node';
import { GorgiasTrigger } from '../../nodes/Gorgias/GorgiasTrigger.node';

describe('Gorgias Node', () => {
  let gorgiasNode: Gorgias;

  beforeEach(() => {
    gorgiasNode = new Gorgias();
  });

  describe('Node Description', () => {
    it('should have correct display name', () => {
      expect(gorgiasNode.description.displayName).toBe('Gorgias');
    });

    it('should have correct name', () => {
      expect(gorgiasNode.description.name).toBe('gorgias');
    });

    it('should have correct group', () => {
      expect(gorgiasNode.description.group).toContain('transform');
    });

    it('should have version 1', () => {
      expect(gorgiasNode.description.version).toBe(1);
    });

    it('should require gorgiasApi credentials', () => {
      const credentials = gorgiasNode.description.credentials;
      expect(credentials).toBeDefined();
      expect(credentials).toHaveLength(1);
      expect(credentials![0].name).toBe('gorgiasApi');
      expect(credentials![0].required).toBe(true);
    });

    it('should have inputs and outputs', () => {
      expect(gorgiasNode.description.inputs).toEqual(['main']);
      expect(gorgiasNode.description.outputs).toEqual(['main']);
    });
  });

  describe('Resources', () => {
    it('should have resource property', () => {
      const properties = gorgiasNode.description.properties;
      const resourceProp = properties.find(p => p.name === 'resource');
      expect(resourceProp).toBeDefined();
    });

    it('should have all 14 resources', () => {
      const properties = gorgiasNode.description.properties;
      const resourceProp = properties.find(p => p.name === 'resource');
      expect(resourceProp).toBeDefined();
      expect(resourceProp!.options).toHaveLength(14);
    });

    it('should include ticket resource', () => {
      const properties = gorgiasNode.description.properties;
      const resourceProp = properties.find(p => p.name === 'resource');
      const options = resourceProp!.options as Array<{ value: string }>;
      const ticketOption = options.find(o => o.value === 'ticket');
      expect(ticketOption).toBeDefined();
    });

    it('should include customer resource', () => {
      const properties = gorgiasNode.description.properties;
      const resourceProp = properties.find(p => p.name === 'resource');
      const options = resourceProp!.options as Array<{ value: string }>;
      const customerOption = options.find(o => o.value === 'customer');
      expect(customerOption).toBeDefined();
    });

    it('should include message resource', () => {
      const properties = gorgiasNode.description.properties;
      const resourceProp = properties.find(p => p.name === 'resource');
      const options = resourceProp!.options as Array<{ value: string }>;
      const messageOption = options.find(o => o.value === 'message');
      expect(messageOption).toBeDefined();
    });
  });

  describe('Properties', () => {
    it('should have multiple properties defined', () => {
      expect(gorgiasNode.description.properties.length).toBeGreaterThan(10);
    });

    it('should have default resource set to ticket', () => {
      const properties = gorgiasNode.description.properties;
      const resourceProp = properties.find(p => p.name === 'resource');
      expect(resourceProp!.default).toBe('ticket');
    });
  });
});

describe('Gorgias Trigger Node', () => {
  let triggerNode: GorgiasTrigger;

  beforeEach(() => {
    triggerNode = new GorgiasTrigger();
  });

  describe('Node Description', () => {
    it('should have correct display name', () => {
      expect(triggerNode.description.displayName).toBe('Gorgias Trigger');
    });

    it('should have correct name', () => {
      expect(triggerNode.description.name).toBe('gorgiasTrigger');
    });

    it('should have correct group', () => {
      expect(triggerNode.description.group).toContain('trigger');
    });

    it('should have version 1', () => {
      expect(triggerNode.description.version).toBe(1);
    });

    it('should require gorgiasApi credentials', () => {
      const credentials = triggerNode.description.credentials;
      expect(credentials).toBeDefined();
      expect(credentials).toHaveLength(1);
      expect(credentials![0].name).toBe('gorgiasApi');
      expect(credentials![0].required).toBe(true);
    });

    it('should have no inputs and one output', () => {
      expect(triggerNode.description.inputs).toEqual([]);
      expect(triggerNode.description.outputs).toEqual(['main']);
    });
  });

  describe('Webhooks', () => {
    it('should have webhook configuration', () => {
      expect(triggerNode.description.webhooks).toBeDefined();
      expect(triggerNode.description.webhooks).toHaveLength(1);
    });

    it('should have correct webhook settings', () => {
      const webhook = triggerNode.description.webhooks![0];
      expect(webhook.name).toBe('default');
      expect(webhook.httpMethod).toBe('POST');
      expect(webhook.responseMode).toBe('onReceived');
      expect(webhook.path).toBe('webhook');
    });
  });

  describe('Events', () => {
    it('should have event property', () => {
      const properties = triggerNode.description.properties;
      const eventProp = properties.find(p => p.name === 'event');
      expect(eventProp).toBeDefined();
    });

    it('should have all 11 event types', () => {
      const properties = triggerNode.description.properties;
      const eventProp = properties.find(p => p.name === 'event');
      expect(eventProp).toBeDefined();
      expect(eventProp!.options).toHaveLength(11);
    });

    it('should include ticket-created event', () => {
      const properties = triggerNode.description.properties;
      const eventProp = properties.find(p => p.name === 'event');
      const options = eventProp!.options as Array<{ value: string }>;
      const ticketCreatedOption = options.find(o => o.value === 'ticket-created');
      expect(ticketCreatedOption).toBeDefined();
    });

    it('should have default event set to ticket-created', () => {
      const properties = triggerNode.description.properties;
      const eventProp = properties.find(p => p.name === 'event');
      expect(eventProp!.default).toBe('ticket-created');
    });
  });

  describe('Webhook Methods', () => {
    it('should have webhookMethods defined', () => {
      expect(triggerNode.webhookMethods).toBeDefined();
    });

    it('should have default webhook method', () => {
      expect(triggerNode.webhookMethods.default).toBeDefined();
    });

    it('should have checkExists method', () => {
      expect(triggerNode.webhookMethods.default.checkExists).toBeDefined();
      expect(typeof triggerNode.webhookMethods.default.checkExists).toBe('function');
    });

    it('should have create method', () => {
      expect(triggerNode.webhookMethods.default.create).toBeDefined();
      expect(typeof triggerNode.webhookMethods.default.create).toBe('function');
    });

    it('should have delete method', () => {
      expect(triggerNode.webhookMethods.default.delete).toBeDefined();
      expect(typeof triggerNode.webhookMethods.default.delete).toBe('function');
    });
  });
});
