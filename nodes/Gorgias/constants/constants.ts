/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

export const GORGIAS_RESOURCES = [
  { name: 'Ticket', value: 'ticket' },
  { name: 'Message', value: 'message' },
  { name: 'Customer', value: 'customer' },
  { name: 'User', value: 'user' },
  { name: 'Team', value: 'team' },
  { name: 'Tag', value: 'tag' },
  { name: 'View', value: 'view' },
  { name: 'Macro', value: 'macro' },
  { name: 'Rule', value: 'rule' },
  { name: 'Integration', value: 'integration' },
  { name: 'Widget', value: 'widget' },
  { name: 'Channel', value: 'channel' },
  { name: 'Statistics', value: 'statistics' },
  { name: 'Satisfaction Survey', value: 'satisfaction' },
] as const;

export const TICKET_STATUSES = [
  { name: 'Open', value: 'open' },
  { name: 'Closed', value: 'closed' },
] as const;

export const TICKET_CHANNELS = [
  { name: 'Email', value: 'email' },
  { name: 'Chat', value: 'chat' },
  { name: 'Phone', value: 'phone' },
  { name: 'SMS', value: 'sms' },
  { name: 'Facebook', value: 'facebook' },
  { name: 'Facebook Messenger', value: 'facebook-messenger' },
  { name: 'Instagram', value: 'instagram' },
  { name: 'Instagram Comments', value: 'instagram-comments' },
  { name: 'Twitter', value: 'twitter' },
  { name: 'WhatsApp', value: 'whatsapp' },
  { name: 'API', value: 'api' },
  { name: 'Help Center', value: 'help-center' },
  { name: 'Contact Form', value: 'contact-form' },
  { name: 'Internal Note', value: 'internal-note' },
] as const;

export const MESSAGE_TYPES = [
  { name: 'Message', value: 'message' },
  { name: 'Internal Note', value: 'internal-note' },
  { name: 'Auto Response', value: 'auto-response' },
] as const;

export const MESSAGE_SENDER_TYPES = [
  { name: 'Customer', value: 'customer' },
  { name: 'User (Agent)', value: 'user' },
  { name: 'Rule', value: 'rule' },
] as const;

export const SNOOZE_DURATIONS = [
  { name: '1 Hour', value: 3600 },
  { name: '2 Hours', value: 7200 },
  { name: '4 Hours', value: 14400 },
  { name: '8 Hours', value: 28800 },
  { name: '1 Day', value: 86400 },
  { name: '2 Days', value: 172800 },
  { name: '1 Week', value: 604800 },
  { name: 'Custom', value: 'custom' },
] as const;

export const PRIORITY_LEVELS = [
  { name: 'Low', value: 'low' },
  { name: 'Normal', value: 'normal' },
  { name: 'High', value: 'high' },
  { name: 'Urgent', value: 'urgent' },
] as const;

export const USER_ROLES = [
  { name: 'Admin', value: 'admin' },
  { name: 'Agent', value: 'agent' },
  { name: 'Lite Agent', value: 'lite_agent' },
  { name: 'Observer', value: 'observer' },
] as const;

export const RULE_TYPES = [
  { name: 'Auto Close', value: 'auto_close' },
  { name: 'Auto Assign', value: 'auto_assign' },
  { name: 'Auto Reply', value: 'auto_reply' },
  { name: 'Auto Tag', value: 'auto_tag' },
  { name: 'HTTP Integration', value: 'http_integration' },
] as const;

export const INTEGRATION_TYPES = [
  { name: 'Shopify', value: 'shopify' },
  { name: 'Magento', value: 'magento' },
  { name: 'BigCommerce', value: 'bigcommerce' },
  { name: 'WooCommerce', value: 'woocommerce' },
  { name: 'HTTP', value: 'http' },
  { name: 'Slack', value: 'slack' },
  { name: 'Klaviyo', value: 'klaviyo' },
  { name: 'Yotpo', value: 'yotpo' },
  { name: 'ReCharge', value: 'recharge' },
  { name: 'Attentive', value: 'attentive' },
] as const;

export const SATISFACTION_RATINGS = [
  { name: 'Very Unsatisfied', value: 1 },
  { name: 'Unsatisfied', value: 2 },
  { name: 'Neutral', value: 3 },
  { name: 'Satisfied', value: 4 },
  { name: 'Very Satisfied', value: 5 },
] as const;

export const WEBHOOK_EVENTS = [
  { name: 'Ticket Created', value: 'ticket-created' },
  { name: 'Ticket Updated', value: 'ticket-updated' },
  { name: 'Ticket Closed', value: 'ticket-closed' },
  { name: 'Ticket Opened', value: 'ticket-opened' },
  { name: 'Message Created', value: 'message-created' },
  { name: 'Message Sent', value: 'message-sent' },
  { name: 'Customer Created', value: 'customer-created' },
  { name: 'Customer Updated', value: 'customer-updated' },
  { name: 'Ticket Assigned', value: 'ticket-assigned' },
  { name: 'Ticket Tagged', value: 'ticket-tagged' },
  { name: 'Satisfaction Received', value: 'satisfaction-received' },
] as const;

export const STAT_PERIODS = [
  { name: 'Today', value: 'today' },
  { name: 'Yesterday', value: 'yesterday' },
  { name: 'Last 7 Days', value: 'last_7_days' },
  { name: 'Last 30 Days', value: 'last_30_days' },
  { name: 'This Month', value: 'this_month' },
  { name: 'Last Month', value: 'last_month' },
  { name: 'Custom Range', value: 'custom' },
] as const;

export const SORT_DIRECTIONS = [
  { name: 'Ascending', value: 'asc' },
  { name: 'Descending', value: 'desc' },
] as const;
