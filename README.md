# n8n-nodes-gorgias

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

A comprehensive n8n community node for Gorgias, the leading e-commerce customer support helpdesk built specifically for Shopify, Magento, and BigCommerce merchants. This node provides full access to the Gorgias REST API for managing tickets, customers, messages, tags, rules, teams, and more.

![n8n](https://img.shields.io/badge/n8n-community--node-orange)
![Gorgias](https://img.shields.io/badge/gorgias-helpdesk-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/typescript-5.3+-blue)

## Features

- **14 Resource Categories** - Complete coverage of the Gorgias API
- **90+ Operations** - Full CRUD operations and specialized actions
- **Webhook Triggers** - Real-time event notifications via HTTP integrations
- **Multi-Channel Support** - Email, chat, phone, SMS, and social channels
- **E-commerce Integration** - View Shopify/Magento/BigCommerce orders directly
- **Automation Support** - Manage rules, macros, and saved replies
- **Team Management** - Handle users, teams, and assignments
- **Statistics & Analytics** - Access performance metrics and CSAT scores

## Installation

### Community Nodes (Recommended)

1. Open your n8n instance
2. Go to **Settings** → **Community Nodes**
3. Click **Install a community node**
4. Enter `n8n-nodes-gorgias`
5. Click **Install**

### Manual Installation

```bash
# Navigate to your n8n custom nodes directory
cd ~/.n8n/custom

# Clone the repository
git clone https://github.com/Velocity-BPA/n8n-nodes-gorgias.git

# Install dependencies and build
cd n8n-nodes-gorgias
npm install
npm run build

# Restart n8n
```

### Development Installation

```bash
# 1. Extract/clone the project
cd n8n-nodes-gorgias

# 2. Install dependencies
npm install

# 3. Build the project
npm run build

# 4. Create symlink to n8n custom nodes directory
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-gorgias

# 5. Restart n8n
n8n start
```

## Credentials Setup

To use this node, you need Gorgias API credentials:

| Field | Description | Example |
|-------|-------------|---------|
| **Domain** | Your Gorgias helpdesk subdomain | `your-store` (from your-store.gorgias.com) |
| **API Key** | Your Gorgias API key | Found in Settings → REST API |
| **Password** | Leave empty for API key auth | (empty) |

### Getting Your API Key

1. Log in to your Gorgias helpdesk
2. Go to **Settings** → **REST API**
3. Click **Add API key**
4. Copy the generated API key
5. Note your helpdesk domain (subdomain from the URL)

## Resources & Operations

### Ticket

| Operation | Description |
|-----------|-------------|
| Get Many | List tickets with filters |
| Get | Get ticket by ID |
| Create | Create new ticket |
| Update | Update ticket |
| Delete | Delete ticket |
| Assign | Assign to user |
| Unassign | Remove assignee |
| Close | Close ticket |
| Open | Reopen ticket |
| Snooze | Snooze ticket |
| Unsnooze | Unsnooze ticket |
| Add Tag | Add tag to ticket |
| Remove Tag | Remove tag from ticket |
| Merge | Merge multiple tickets |
| Get Messages | Get messages in ticket |
| Get Events | Get ticket events/timeline |

### Message

| Operation | Description |
|-----------|-------------|
| Get Many | List messages |
| Get | Get message by ID |
| Create | Create message in ticket |
| Create Internal Note | Create internal note |
| Send | Send outbound message |
| Update | Update message |
| Delete | Delete message |

### Customer

| Operation | Description |
|-----------|-------------|
| Get Many | List customers |
| Get | Get customer by ID |
| Create | Create new customer |
| Update | Update customer |
| Delete | Delete customer |
| Add Note | Add note to customer |
| Merge | Merge customers |
| Get Tickets | Get customer's tickets |
| Get Orders | Get orders from e-commerce integrations |

### User (Agent)

| Operation | Description |
|-----------|-------------|
| Get Many | List users/agents |
| Get | Get user by ID |
| Create | Create new user |
| Update | Update user |
| Deactivate | Deactivate user |
| Get Stats | Get agent statistics |

### Team

| Operation | Description |
|-----------|-------------|
| Get Many | List teams |
| Get | Get team by ID |
| Create | Create team |
| Update | Update team |
| Delete | Delete team |
| Get Members | Get team members |
| Add Member | Add member to team |
| Remove Member | Remove member from team |

### Tag

| Operation | Description |
|-----------|-------------|
| Get Many | List all tags |
| Get | Get tag by ID |
| Create | Create new tag |
| Update | Update tag |
| Delete | Delete tag |

### View

| Operation | Description |
|-----------|-------------|
| Get Many | List views |
| Get | Get view by ID |
| Create | Create view |
| Update | Update view |
| Delete | Delete view |
| Get Tickets | Get tickets in view |

### Macro (Saved Reply)

| Operation | Description |
|-----------|-------------|
| Get Many | List macros |
| Get | Get macro by ID |
| Create | Create macro |
| Update | Update macro |
| Delete | Delete macro |
| Apply | Apply macro to ticket |

### Rule

| Operation | Description |
|-----------|-------------|
| Get Many | List automation rules |
| Get | Get rule by ID |
| Create | Create rule |
| Update | Update rule |
| Delete | Delete rule |
| Enable | Enable rule |
| Disable | Disable rule |

### Integration

| Operation | Description |
|-----------|-------------|
| Get Many | List integrations |
| Get | Get integration |
| Create | Create HTTP integration |
| Update | Update integration |
| Delete | Delete integration |

### Widget

| Operation | Description |
|-----------|-------------|
| Get Many | List widgets |
| Get | Get widget by ID |
| Create | Create widget |
| Update | Update widget |
| Delete | Delete widget |

### Channel

| Operation | Description |
|-----------|-------------|
| Get Many | List support channels |
| Get | Get channel |
| Update | Update channel settings |

### Statistics

| Operation | Description |
|-----------|-------------|
| Get Ticket Stats | Get ticket statistics |
| Get Agent Stats | Get agent performance |
| Get Satisfaction Stats | Get CSAT scores |
| Get Response Time Stats | Get response times |
| Get Volume Stats | Get ticket volumes |

### Satisfaction

| Operation | Description |
|-----------|-------------|
| Get Many | List satisfaction surveys |
| Get Responses | Get survey responses |
| Get Stats | Get survey statistics |

## Trigger Node

The Gorgias Trigger node listens for webhook events via HTTP integrations:

| Event | Description |
|-------|-------------|
| Ticket Created | New ticket created |
| Ticket Updated | Ticket updated |
| Ticket Closed | Ticket closed |
| Ticket Opened | Ticket reopened |
| Ticket Assigned | Ticket assigned |
| Ticket Tagged | Tag added to ticket |
| Message Created | New message received |
| Message Sent | Message sent |
| Customer Created | Customer created |
| Customer Updated | Customer updated |
| Satisfaction Received | CSAT response received |

## Usage Examples

### Create a Ticket

```json
{
  "resource": "ticket",
  "operation": "create",
  "subject": "Order Issue",
  "channel": "email",
  "customerEmail": "customer@example.com",
  "additionalFields": {
    "priority": "high",
    "status": "open"
  }
}
```

### Send a Reply

```json
{
  "resource": "message",
  "operation": "send",
  "ticketId": 12345,
  "body": "Thank you for contacting us. We're looking into this issue.",
  "channel": "email"
}
```

### Apply a Macro

```json
{
  "resource": "macro",
  "operation": "apply",
  "ticketId": 12345,
  "macroId": 67890,
  "sendMessage": true
}
```

## Gorgias Concepts

| Concept | Description |
|---------|-------------|
| **Ticket** | A support conversation/case |
| **Message** | Individual message within a ticket |
| **Customer** | End customer/shopper |
| **User** | Agent/team member |
| **Channel** | Communication channel (email, chat, etc.) |
| **Tag** | Ticket categorization label |
| **Macro** | Saved reply template |
| **Rule** | Automation rule |
| **View** | Filtered ticket list |
| **Integration** | External service connection |

## Supported Channels

- Email
- Chat
- Phone
- SMS
- Facebook
- Facebook Messenger
- Instagram
- Instagram Direct
- Twitter
- Air Call
- Help Center
- Internal Note
- API

## Error Handling

The node handles Gorgias API errors gracefully:

- **401 Unauthorized** - Invalid API credentials
- **403 Forbidden** - Insufficient permissions
- **404 Not Found** - Resource not found
- **422 Unprocessable Entity** - Validation error
- **429 Too Many Requests** - Rate limit exceeded
- **500+ Server Errors** - Gorgias server issues

Enable **Continue on Fail** to handle errors in workflows without stopping execution.

## Security Best Practices

1. **Store credentials securely** - Use n8n's credential system
2. **Limit API key permissions** - Use least privilege principle
3. **Monitor API usage** - Check Gorgias dashboard for unusual activity
4. **Rotate keys periodically** - Update API keys regularly
5. **Use webhooks wisely** - Validate incoming webhook data

## Development

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Watch for changes
npm run dev

# Run linting
npm run lint

# Fix linting issues
npm run lint:fix

# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## Author

**Velocity BPA**
- Website: [velobpa.com](https://velobpa.com)
- GitHub: [Velocity-BPA](https://github.com/Velocity-BPA)

## Licensing

This n8n community node is licensed under the **Business Source License 1.1**.

### Free Use
Permitted for personal, educational, research, and internal business use.

### Commercial Use
Use of this node within any SaaS, PaaS, hosted platform, managed service,
or paid automation offering requires a commercial license.

For licensing inquiries:
**licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## Support

- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-gorgias/issues)
- **Gorgias API Docs**: [developers.gorgias.com](https://developers.gorgias.com)
- **n8n Community**: [community.n8n.io](https://community.n8n.io)

## Acknowledgments

- [Gorgias](https://www.gorgias.com) for their comprehensive helpdesk platform
- [n8n](https://n8n.io) for the powerful workflow automation platform
- The n8n community for inspiration and best practices
