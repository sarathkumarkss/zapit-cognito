# Lambda: equipment-log-processor

## 1) Overview

| Attribute | Value |
|-----------|-------|
| Function name | equipment-log-processor |
| Purpose | Consumes adapter messages from SQS, resolves facility/machine context, and upserts equipment logs and attachments. |
| Business use case | Converts upstream equipment events into normalized ZapIT equipment-log records. |
| Where it is used | SQS event source mapping on the `equipment-log-events` queue. |
| Owner/team responsible | TBD |

---

## 2) Architecture / Flow

- Flow: SQS (`equipment-log-events`) -> Lambda (`equipment-log-processor`) -> RDS upsert operations -> optional S3 attachment operations.
- Services interacting: SQS, RDS (TypeORM), optional S3.
- Processing pattern:
  1. Parse each SQS record body.
  2. Resolve facility and machine.
  3. Upsert machine log and notes.
  4. Process attachment metadata/files where present.

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

- Trigger type: SQS.
- Event structure: `Records[]` array with each record containing metadata and JSON `body`.
- Batch behavior:
  - Typical batch size: up to 10 records (deployment configurable).
  - Partial failure mode can be enabled to retry only failed record IDs.

---

## 5) Environment Variables

| Variable | Description | Example value | Required/Optional |
|----------|-------------|---------------|-------------------|
| DB_CREDENTIALS | Database credentials payload | secret payload | Required |
| DEPLOYMENT_ENVIRONMENT_SCOPE | Environment scope | test / prod | Optional |
| S3_ZAPIT_FILES_BUCKET_NAME | Attachment bucket | zapit-files | Optional |

---

## 6) IAM Permissions

- Role name: deployment-managed role (for example `analyze_role_{scope}`).
- Required access:
  - `sqs:ReceiveMessage`, `sqs:DeleteMessage`, `sqs:GetQueueAttributes`.
  - Database network access via VPC.
  - Optional S3 object permissions for attachment handling.
- Principle: least privilege for queue, storage, and DB integrations.

---

## 7) Dependencies

- Libraries: `typeorm`, `mysql2`, shared ZapIT data/services.
- AWS SDK modules: SQS and S3 clients as needed by the processor path.
- External services: RDS, SQS, optional S3.

---

## 8) Deployment Process

- Build from equipment-log service package.
- Deploy stack/config that defines:
  - Lambda function.
  - SQS event source mapping.
  - Queue/DLQ configuration.
  - VPC and secret wiring.
- Infrastructure reference: equipment-log deployment stack/config path.

---

## 9) Logging and Monitoring

- CloudWatch log group: `/aws/lambda/equipment-log-processor-<env>` (confirm actual name).
- Key logs: message IDs, normalization result, facility/machine resolution, upsert result, per-record error details.
- Metrics:
  - Lambda: errors, duration, throttles.
  - SQS: queue depth, age of oldest message, DLQ depth.
- DLQ: configured for repeated processing failures (for example maxReceiveCount 5).

---

## 10) Error Handling

- Retry model: SQS retries failed records after visibility timeout.
- DLQ path: messages move to DLQ after configured receive count.
- Known failures:
  - Facility/machine not found.
  - Invalid payload schema.
  - Database transaction failures.
  - Attachment upload failures.
- Fallback: inspect DLQ, fix root cause, replay messages.

---

## 11) Security

- Secrets handling: DB credentials from secure secret source.
- Encryption: SQS/RDS/S3 encryption according to account standards.
- VPC isolation: enabled when DB is private.
- IAM restrictions: queue consume and optional S3 access only.

---

## 12) Performance and Limits

- Throughput scales with SQS backlog and Lambda concurrency.
- Batch-size tuning balances cost and processing latency.
- Memory/timeout should be tuned for attachment-heavy payloads.
- Visibility timeout should remain greater than expected processing duration.

---

## 13) Testing

- Unit testing: TBD.
- Integration testing:
  - Send representative SQS payloads (new log, update log, attachments).
  - Validate DB rows and attachment links.
  - Validate partial batch failure behavior.
- Local testing: invoke handler with a mock SQS event JSON.

---

## 14) Versioning and Release Notes

- Lambda aliases/versions: TBD.
- Record breaking changes for:
  - Input message schema changes.
  - DB model migration dependencies.
  - Attachment processing contract updates.

---

## 15) Troubleshooting Guide

| Issue | Cause | Fix |
|-------|-------|-----|
| Messages accumulate in queue | Processor errors or low concurrency | Check CloudWatch errors, adjust concurrency, verify DB health |
| Messages move to DLQ | Repeated record failure | Inspect DLQ payload, fix data/code, replay |
| Access denied (SQS/S3) | Missing IAM actions | Update role policies for queue or bucket |
| Facility or machine not found | Mapping/data mismatch | Validate adapter identifiers and source data integrity |

---

## 16) Contacts and Ownership

- Primary owner: TBD
- Backup owner: TBD
- Slack channel: TBD
- Jira project: TBD
