# Lambda: equipment-log-adapter-accruent

## 1) Overview

| Attribute | Value |
|-----------|-------|
| Function name | equipment-log-adapter-accruent |
| Purpose | Runs Accruent work-order sync, normalizes payloads, and publishes messages to the equipment-log-events SQS queue. |
| Business use case | Keeps ZapIT equipment-log data synchronized from Accruent on a scheduled interval. |
| Where it is used | EventBridge schedule (for example, every 10 minutes) and optional on-demand invocation. |
| Owner/team responsible | TBD |

---

## 2) Architecture / Flow

- Flow: EventBridge schedule -> Lambda (`equipment-log-adapter-accruent`) -> Accruent API -> SQS queue (`equipment-log-events`) -> downstream processor Lambda.
- Services interacting: EventBridge, external Accruent API, SQS, optional RDS sync-state lookups.
- Result: producer Lambda emits normalized records for queue-based processing.

---

## 3) Lambda Configuration

| Setting | Value |
|---------|-------|
| Runtime | Node.js 24.x |
| Memory | 1024 MB |
| Timeout | 900 seconds (15 minutes) |
| Ephemeral storage | Default |
| Region | Per deployment stack |
| VPC | Yes |
| Subnets and security groups | Deployment-specific (for example `analyze-service-security-group-{scope}`) |

---

## 4) Trigger Details

- Trigger type: EventBridge rate/cron.
- Event structure: standard scheduled EventBridge event (`id`, `source`, `detail-type`, `time`).
- Input payload: usually ignored; Lambda executes a sync cycle (`runOnce`) per invocation.

---

## 5) Environment Variables

| Variable | Description | Example value | Required/Optional |
|----------|-------------|---------------|-------------------|
| DB_CREDENTIALS | Database credentials payload | secret payload | Required |
| ACCRUENT_SECRET | Accruent API credentials payload | secret payload | Required |
| EQUIPMENT_LOG_EVENTS_QUEUE_URL | Target SQS queue URL | https://sqs.../equipment-log-events-prod | Required |
| DEPLOYMENT_ENVIRONMENT_SCOPE | Environment scope | test / prod | Optional |
| PAGE_SIZE | Accruent page size for pull loop | 100 | Optional |
| SYNC_SAFETY_MARGIN_MINUTES | Reprocessing safety window | 5 | Optional |

---

## 6) IAM Permissions

- Role name: deployment-managed role (for example `analyze_role_{scope}`).
- Required access:
  - `sqs:SendMessage` to equipment-log-events queue.
  - Secrets read access for DB/Accruent credentials.
  - VPC networking access for private services.
- Outbound HTTPS access is required for Accruent API calls.

---

## 7) Dependencies

- Libraries: service sync modules, `typeorm`, `mysql2`, shared ZapIT data libraries.
- AWS SDK modules: SQS client (`@aws-sdk/client-sqs`) as configured by package.
- External services: Accruent API, SQS, optional RDS.

---

## 8) Deployment Process

- Build from equipment-log service package (`npm run build`).
- Deploy with infrastructure stack that defines:
  - EventBridge schedule rule.
  - Lambda environment variables.
  - Queue permissions.
- Reference: equipment-log deployment stack/config path (TBD if split by CDK/serverless).

---

## 9) Logging and Monitoring

- CloudWatch log group: `/aws/lambda/equipment-log-adapter-accruent-<env>` (confirm name).
- Useful logs: sync start/end, duration, items processed, API errors, queue publish outcomes.
- Metrics: invocation count, duration, errors; queue depth observed on consumer side.
- Alarms: recommend error and timeout alarms for schedule health.
- DLQ: usually not configured on this producer Lambda; downstream queue handles message retries.

---

## 10) Error Handling

- EventBridge retries failed invocations per AWS defaults.
- Known failures:
  - Accruent authentication failure.
  - Accruent API unavailability.
  - SQS publish failure.
  - DB connectivity issues (if state tracking is enabled).
- Fallback: next scheduled run attempts sync again.

---

## 11) Security

- Secrets handling: DB and Accruent credentials from Secrets Manager or encrypted environment variables.
- Encryption: TLS for API calls; SQS and DB encryption per AWS controls.
- VPC isolation: enabled for private service access.
- IAM restrictions: grant only required queue and secret actions.

---

## 12) Performance and Limits

- Cadence: one execution per schedule period.
- Long-running sync: 15-minute timeout supports larger data windows.
- Tuning knobs: page size, safety margin, memory.
- Throughput depends on Accruent API performance and queue publish rate.

---

## 13) Testing

- Unit testing: TBD.
- Integration testing:
  - Mock Accruent API responses.
  - Validate queue message schema and count.
- Local invocation: run with mock schedule event and test credentials.

---

## 14) Versioning and Release Notes

- Lambda aliases/versions: TBD.
- Log breaking changes when:
  - Message schema changes.
  - Environment variable contract changes.
  - Accruent API integration changes.

---

## 15) Troubleshooting Guide

| Issue | Cause | Fix |
|-------|-------|-----|
| No messages in queue | No new/changed records | Validate source data window and logs |
| Access denied (SQS) | Missing queue permission | Add `sqs:SendMessage` for queue ARN |
| Accruent auth errors | Invalid/expired secret | Rotate/update `ACCRUENT_SECRET` |
| Timeout | Large data pull or API latency | Tune PAGE_SIZE, increase memory, review schedule overlap |

---

## 16) Contacts and Ownership

- Primary owner: TBD
- Backup owner: TBD
- Slack channel: TBD
- Jira project: TBD
