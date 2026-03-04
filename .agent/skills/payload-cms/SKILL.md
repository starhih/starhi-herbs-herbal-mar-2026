---
name: payload-cms
description: Comprehensive guide for building, configuring, and deploying Payload CMS applications. Use this skill when the user needs help with Payload CMS, including installation, configuration (collections, globals), API usage (Local, REST, GraphQL), or admin panel customization.
---

# Payload CMS Skill

This skill provides expert guidance on working with **Payload CMS**, a code-first, headless CMS and application framework.

## Quick Start

Create a new Payload project:
```bash
npx create-payload-app@latest
```

## Core Concepts

*   **Config (`payload.config.ts`)**: The central configuration file for the database, admin panel, and more.
*   **Collections**: Groups of recurring documents (e.g., Pages, Users, Products).
*   **Globals**: Singletons for site-wide content (e.g., Header, Footer).
*   **Fields**: The building blocks of your schema (Text, Number, Relationship, etc.).

## Detailed Guides

For specific tasks, refer to the following guides:

*   **Configuration**: [payload.config.ts](references/configuration.md) - Database, server URL, admin options.
*   **Collections & Globals**: [references/collections.md](references/collections.md) - Defining schemas, fields, hooks, and access control.
*   **Admin Panel**: [references/admin.md](references/admin.md) - Custom components, views, and I18n.
*   **APIs**: [references/api.md](references/api.md) - Using the Local API, REST, and GraphQL.
