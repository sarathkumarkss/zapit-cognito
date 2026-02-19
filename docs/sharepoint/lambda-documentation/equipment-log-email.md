# Lambda: equipment-log-email

## 1) Overview

| Attribute | Value |
|-----------|-------|
| Function name | equipment-log-email |
| Purpose | Processes inbound SES emails, matches machine/equipment-log references from the subject, creates or updates logs, and handles attachments. |
| Business use case | Allows teams to create/update equipment logs directly by email without manual entry in the app UI. |
| Where it is used | SES receipt rule invocation, with raw email retrieved from S3 inbound bucket. |
| Owner/team responsible | TBD |

---

## 2) Architecture / Flow

- Flow:
  1. SES receives email.
  2. Raw message is stored in S3 inbound bucket.
  3. SES receipt rule invokes Lambda (`equipment-log-email`).
  4. Lambda parses email body and attachments.
  5. Lambda updates RDS entities and stores files to target S3 bucket.
  6. If matching fails, Lambda sends an error reply email.
- Services interacting: SES, S3 (inbound + file storage), RDS.

---

## 3) Lambda Configuration

| Setting | Value |
|---------|-------|
| Runtime | Node.js 20.x or 24.x (confirm deployment target) |
| Memory | 1024 MB (common deployment) |
| Timeout | 900 seconds (15 minutes) |
| Ephemeral storage | Default unless overridden |
| Region | Per deployment |
| VPC | Usually Yes when private RDS access is needed |
| Subnets and security groups | Deployment-specific |

---

## 4) Trigger Details

- Trigger type: SES receipt rule.
- Event structure: `Records[0].ses.mail` with `source`, `destination`, `messageId`, headers.
- Message fetch pattern: Lambda reads raw message from S3 key `emails/<messageId>`.
- Subject usage: subject may contain machine/equipment-log identifiers used for matching logic.

---

## 5) Environment Variables

| Variable | Description | Example value | Required/Optional |
|----------|-------------|---------------|-------------------|
| DB_CREDENTIALS | Database credentials payload | secret payload | Required |
| DEPLOYMENT_ENVIRONMENT_SCOPE | Environment scope | dev / test / prod | Optional |
| S3_EMAIL_TO_MACHINELOG_BUCKET | Inbound raw-email bucket | email-to-machinelog-zapit-dev | Optional |
| S3_ZAPIT_FILES_BUCKET_NAME | Attachment destination bucket | zapit-files | Optional |
| APP_URL | App URL used in reply templates | https://app.zapitmedical.com/ | Optional |
| AWS_REGION | AWS region | us-east-1 | Optional |

---

## 6) IAM Permissions

- Role name: deployment-managed role.
- Required access:
  - `s3:GetObject` on inbound email bucket.
  - `s3:PutObject` (and ACL action if used) on attachment bucket.
  - `ses:SendRawEmail` for error replies.
  - VPC/private DB access for RDS interactions.

---

## 7) Dependencies

- Libraries: `@aws-sdk/client-s3`, `@aws-sdk/client-ses`, `mailparser`, `cheerio`, `typeorm`, `mysql2`, shared ZapIT libraries.
- Template assets: email templates and static assets used for outbound error replies.
- External services: SES, S3, RDS.

---

## 8) Deployment Process

- Build service package (`npm run build`).
- Ensure template and asset files are included in deployment artifact.
- Deploy stack/config for:
  - SES receipt rule to Lambda binding.
  - Inbound S3 bucket access.
  - DB and outbound email permissions.
- Infrastructure reference: service deployment stack/serverless config path (TBD).

---

## 9) Logging and Monitoring

- CloudWatch log group: `/aws/lambda/equipment-log-email-<env>` (confirm actual name).
- Key logs: messageId, parsed sender/subject, match result, DB updates, attachment processing, error reply outcomes.
- Metrics: invocations, errors, duration; monitor SES reject/failure events when available.
- Alarms: recommend errors, timeout, and elevated failure reply rates.
- DLQ: typically not used unless configured in receipt-rule workflow.

---

## 10) Error Handling

- If no unique match is found, Lambda sends an error response email and exits gracefully.
- Hard failures include:
  - Missing raw email object in S3.
  - DB connectivity or write failures.
  - Attachment processing errors.
  - SES send permission/identity issues.
- Retry behavior depends on SES receipt-rule integration settings.

---

## 11) Security

- Secrets handling: DB credentials from secure secret source.
- Encryption: TLS in transit; storage encryption for S3/RDS per standards.
- VPC isolation: required for private DB access.
- IAM restrictions: scope bucket and SES permissions to required resources only.

---

## 12) Performance and Limits

- Throughput depends on inbound email rate.
- Attachment-heavy messages can increase execution time and memory usage.
- Memory/timeout tuning should reflect largest expected email and attachment payloads.
- Concurrency follows SES invocation volume.

---

## 13) Testing

- Unit testing: TBD.
- Integration testing:
  - SES event with known machine identifier in subject.
  - SES event with ambiguous/no match subject.
  - Messages with and without attachments.
- Local workflow: invoke parser/handler with a mock SES event and test S3 object.

---

## 14) Versioning and Release Notes

- Lambda aliases/versions: TBD.
- Track breaking changes for:
  - Subject parsing rules.
  - Template asset paths.
  - Required environment variables.

---

## 15) Troubleshooting Guide

| Issue | Cause | Fix |
|-------|-------|-----|
| Access denied (S3) | Missing `GetObject`/`PutObject` permissions | Update IAM policy and bucket ARN scope |
| Access denied (SES) | Missing `ses:SendRawEmail` or unverified sender | Fix IAM and SES identity/region configuration |
| No match found for subject | Invalid or ambiguous identifier | Validate subject format and source data |
| Template not rendered | Missing template/asset files in package | Include templates/assets in deployment artifact |

---

## 16) Contacts and Ownership

- Primary owner: TBD
- Backup owner: TBD
- Slack channel: TBD
- Jira project: TBD
