# AIQEdge SMTP

A production-grade, scalable SMTP server built with Node.js 24+, TypeScript, PostgreSQL, BullMQ, and Clean Architecture. Designed for maintainability, extensibility, and robust cloud/server deployment.

---

## Table of Contents

- [Features](#features)
- [Architecture Overview](#architecture-overview)
- [Folder Structure](#folder-structure)
- [Setup & Installation](#setup--installation)
- [Environment Variables](#environment-variables)
- [Database Schema](#database-schema)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)
- [CI/CD Pipeline](#cicd-pipeline)
- [Monitoring & Log Aggregation](#monitoring--log-aggregation)
- [Extending the System](#extending-the-system)
- [License](#license)

---

## Features

- Clean Architecture: strict separation of domain, application, infrastructure, and interfaces
- PostgreSQL for persistent email storage
- BullMQ (Redis) for background email queueing and delivery
- Dependency injection for all providers (database, mail, logging, queue)
- Robust error handling and environment validation
- Ready for cloud or bare metal deployment (DigitalOcean, AWS EC2, GCP, etc.)
- Comprehensive CI/CD pipeline with GitHub Actions and SSH/rsync deploy
- Logging: Uses [Pino](https://getpino.io/) for high-performance, structured logging
  - Configure log level with `PINO_LOG_LEVEL` (e.g., info, debug, error)
  - Pretty-print logs in development (`NODE_ENV=development`)

## Architecture Overview

- **domain/**: Business entities, value objects, and provider interfaces (no dependencies on other layers)
- **application/**: Use cases and business logic orchestration (depends only on domain)
- **infrastructure/**: External services (database, mail, logging, queue, config), implements interfaces from domain/application
- **interfaces/**: HTTP controllers, routes, and middlewares (depends on application/infrastructure)

## Folder Structure

```
src/
  app.ts
  server.ts
  application/
    services/
      emailStorageService.ts
      smtpService.ts
    usecases/
      sendEmail.ts
  domain/
    entities/
      emailEntity.ts
    repositories/
      smtpRepository.ts
  infrastructure/
    config/
      index.ts
    database/
      inMemoryDatabaseProvider.ts
      pgDatabaseProvider.ts
    logging/
      consoleLogger.ts
    mail/
      smtpProvider.ts
    queue/
      emailQueueProvider.ts
  interfaces/
    controllers/
      errorHandler.ts
      smtpController.ts
    routes/
      smtpRoutes.ts
  types/
    index.ts
```

## Setup & Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/yourusername/aiqedge-smtp.git
   cd aiqedge-smtp
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Configure environment variables:** See [Environment Variables](#environment-variables)
4. **Set up PostgreSQL and Redis:** See [Database Schema](#database-schema)
5. **Build the project:**
   ```sh
   npm run build
   ```
6. **Start the application:**
   ```sh
   npm start
   ```

## Environment Variables

Add these to your `.env` file:

```
# PostgreSQL
PG_HOST=localhost
PG_PORT=5432
PG_USER=postgres
PG_PASSWORD=postgres
PG_DATABASE=aiqedge

# Redis (for BullMQ)
REDIS_HOST=localhost
REDIS_PORT=6379

# SMTP
SMTP_HOST=localhost
SMTP_PORT=587
SMTP_USER=user@example.com
SMTP_PASS=password

# App
APP_PORT=3000

# Logging
PINO_LOG_LEVEL=info
```

## Database Schema

Run this SQL to create or migrate the required `emails` table to support all Nodemailer options:

```sql
CREATE TABLE IF NOT EXISTS emails (
  id SERIAL PRIMARY KEY,
  to_address VARCHAR(255) NOT NULL,
  from_address VARCHAR(255) NOT NULL,
  cc VARCHAR(255),
  bcc VARCHAR(255),
  reply_to VARCHAR(255),
  subject VARCHAR(255) NOT NULL,
  text TEXT,
  html TEXT,
  attachments JSONB
);
```

## Usage

- **Development:**
  ```sh
  npm run dev
  ```
- **Production:**
  ```sh
  npm run build
  npm start
  ```

## API Endpoints

### Send Email

- **POST** `/smtp/send`
  - Request Body (all Nodemailer options supported):
    ```json
    {
      "to": "recipient@example.com",
      "from": "sender@example.com",
      "subject": "Email Subject",
      "text": "Plain text body (optional)",
      "html": "<b>HTML body (optional)</b>",
      "cc": ["cc1@example.com", "cc2@example.com"],
      "bcc": "bcc@example.com",
      "replyTo": "reply@example.com",
      "attachments": [
        {
          "filename": "file.txt",
          "content": "SGVsbG8gd29ybGQ=",
          "encoding": "base64"
        }
      ]
    }
    ```
  - All fields are optional except `to`, `from`, and `subject`. If `text`/`html` are omitted, the body is generated using @brainspore/shackuz.

### Retrieve All Emails

- **GET** `/smtp/emails`
  - Response:
    ```json
    {
      "emails": [
        { "to": "...", "from": "...", "subject": "...", "body": "..." },
        ...
      ]
    }
    ```

## Testing

To run the tests:

```sh
npm test
```

## CI/CD Pipeline

- Automated with GitHub Actions: see `.github/workflows/ci-cd.yml`
- On push to `main`, the pipeline:
  - Installs dependencies, lints, type-checks, tests, and builds
  - Deploys to your server via SSH/rsync
- **Required GitHub Secrets:**
  - `SSH_HOST`, `SSH_USER`, `SSH_KEY`, `SSH_PORT`
- **Server Setup:**
  - Use a systemd service for auto-restart (see below)

### Example systemd Service

```ini
[Unit]
Description=AIQEdge SMTP Service
After=network.target

[Service]
Type=simple
User=youruser
WorkingDirectory=/home/youruser/aiqedge-smtp
ExecStart=/usr/bin/node dist/server.js
Restart=always
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

## Monitoring & Log Aggregation

### Prometheus Metrics

- The app exposes a `/metrics` endpoint (default: `http://localhost:3000/metrics`) for Prometheus scraping.
- Metrics include HTTP request durations, status codes, and default system metrics.
- Example Prometheus scrape config:
  ```yaml
  scrape_configs:
    - job_name: "aiqedge-smtp"
      static_configs:
        - targets: ["localhost:3000"]
  ```
- You can add custom business metrics using [prom-client](https://github.com/siimon/prom-client).

### Pino Log Aggregation

- Logs are structured JSON by default (production-ready for ELK, Loki, or cloud logging).
- For local development, use `pino-pretty` for human-readable logs:
  ```sh
  node dist/server.js | npx pino-pretty
  ```
- For production log aggregation:
  - Forward logs to ELK, Loki, or any log collector that supports JSON.
  - Use cloud logging agents or Fluentd for advanced routing.

## Extending the System

- **Add a new provider:**
  - Define an interface in `domain/repositories/`
  - Implement it in `infrastructure/`
  - Inject via the composition root (routes/controllers)
- **Add a new use case:**
  - Implement in `application/usecases/`
  - Expose via a controller/route in `interfaces/`
- **Switch database/queue/logging:**
  - Swap the provider implementation in the composition root (e.g., use `SequelizeDatabaseProvider` and `PinoLogger`)
- **Email Schema:**
  - The email schema supports all [Nodemailer options](https://nodemailer.com/message/), including `to`, `from`, `subject`, `text`, `html`, `cc`, `bcc`, `replyTo`, `attachments`, and more.
  - The database and API are aligned for full flexibility and future extensibility.

## License

MIT License
