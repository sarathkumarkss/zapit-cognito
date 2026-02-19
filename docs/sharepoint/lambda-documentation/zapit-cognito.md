# Lambda: zapit-cognito

## 1) Overview

| Attribute | Value |
|-----------|-------|
| Function name | zapit-cognito |
| Purpose | Executes Cognito User Pool trigger logic for ZapIT authentication: sync/lifecycle, custom messages (sign-up, forgot-password), and pre/post authentication logic. |
| Business use case | Keeps Cognito user lifecycle aligned with ZapIT data and customizes account emails for authentication events. |
| Where it is used | Cognito User Pool triggers (PreSignUp, PostConfirmation, CustomMessage, PreAuthentication, PostAuthentication). |
| Owner/team responsible | TBD |

---

## 2) Architecture / Flow

- Flow: Cognito User Pool trigger -> Lambda (`zapit-cognito`) -> RDS (TypeORM) -> optional SNS notifications.
- Services interacting: Cognito, RDS, SNS.
- Routing model: handler inspects `triggerSource` and dispatches to service logic.

---

## 3) Lambda Configuration

| Setting | Value |
|---------|-------|
| Runtime | Node.js 24.x |
| Memory | TBD (common range: 256-512 MB) |
| Timeout | TBD (common range: 15-30 seconds) |
| Ephemeral storage | Default unless overridden |
| Region | Must match Cognito User Pool region |
| VPC | Usually Yes when RDS access is required |
| Subnets and security groups | TBD |

---

## 4) Trigger Details

- Trigger type: Cognito User Pool trigger.
- Event structure: AWS Cognito trigger event (`version`, `triggerSource`, `region`, `userPoolId`, `userName`, `request`, `response`).
- Common trigger values:
  - `PreSignUp_SignUp`
  - `CustomMessage_SignUp`
  - `CustomMessage_ForgotPassword`
  - `PostConfirmation_ConfirmSignUp`
  - `PreAuthentication_Authentication`
  - `PostAuthentication_Authentication`

---

## 5) Environment Variables

| Variable | Description | Example value | Required/Optional |
|----------|-------------|---------------|-------------------|
| DB_CREDENTIALS | RDS credentials (JSON) | secret payload | Required |
| DEPLOYMENT_ENVIRONMENT_SCOPE | Environment scope | dev / test / prod | Optional |
| AWS_REGION | AWS region | us-east-1 | Optional |
| AWS_ACCOUNT | AWS account ID | 123456789012 | Optional |
| SLACK_TOPIC_ARN | SNS topic for Slack notifications | arn:aws:sns:... | Optional |
| SLACK_CHANNEL | Slack channel alias | server_status | Optional |
| NOTIFICATION_TOPIC_ARN | SNS topic for notification events | arn:aws:sns:... | Optional |
| PUBLISH_NOTIFICATION_EVENTS | Enable notification publishing | true | Optional |
| DISABLE_SNS | Disable SNS in local/dev flows | true | Optional |

---

## 6) IAM Permissions

- Role name: TBD (stack managed).
- Required access:
  - RDS connectivity via VPC networking.
  - `sns:Publish` to configured topic ARNs.
- Follow least privilege for topic and network scope.

---

## 7) Dependencies

- Libraries: `typeorm`, `mysql2`, `@zapitmedical/zapit-data`, `@aws-sdk/client-sns`, `reflect-metadata`.
- External services: RDS, optional SNS.

---

## 8) Deployment Process

- Build path: service package containing `zapit-cognito`.
- Standard flow:
  1. Build (`npm run build` in service package).
  2. Deploy stack/pipeline that maps Lambda to Cognito trigger points.
- Infrastructure reference: TBD (stack or serverless config path).

---

## 9) Logging and Monitoring

- CloudWatch log group: `/aws/lambda/zapit-cognito-<env>` (confirm actual name).
- Key logs: trigger source, user identity, branch of logic, DB/SNS outcomes.
- Metrics: invocations, duration, errors, throttles.
- Alarms: error rate and timeout alarms are recommended.
- DLQ: not applicable for Cognito trigger integration.

---

## 10) Error Handling

- If Lambda throws, the Cognito action may fail depending on trigger type.
- Known failures:
  - DB unreachable.
  - Missing/invalid `DB_CREDENTIALS`.
  - SNS publish permission/topic issues.
- Retry behavior is governed by Cognito trigger semantics.

---

## 11) Security

- Secrets handling: `DB_CREDENTIALS` via Secrets Manager or encrypted environment variable.
- Encryption: TLS for network traffic; at-rest encryption per AWS service defaults.
- VPC isolation: required when database is private.
- IAM: only allow actions needed for this Lambda.

---

## 12) Performance and Limits

- Throughput is tied to sign-up and authentication traffic.
- Cold starts: normal Node.js behavior; optimize package size.
- Tuning: validate memory/timeout under peak sign-up events.
- Scaling: concurrency follows Cognito invocation demand.

---

## 13) Testing

- Unit testing: TBD (existing service tests may be limited).
- Local simulation: invoke handler with mock Cognito events by `triggerSource`.
- Integration test scenarios:
  - Sign-up and confirmation flow.
  - Forgot-password custom message flow.
  - Pre/post authentication behavior.

---

## 14) Versioning and Release Notes

- Lambda versions/aliases: TBD.
- Record breaking changes when:
  - Trigger contract changes.
  - Required environment variables change.
  - DB interaction model changes.

---

## 15) Troubleshooting Guide

| Issue | Cause | Fix |
|-------|-------|-----|
| Trigger not firing | Trigger mapping missing in User Pool | Verify Cognito trigger configuration and Lambda permission |
| Timeout | DB latency or cold start | Increase timeout and validate DB connectivity/performance |
| Access denied (SNS) | Missing `sns:Publish` | Update IAM policy for target topic ARN |
| Custom email not updated | CustomMessage logic not setting response fields | Verify handler branch and response payload |

---

## 16) Contacts and Ownership

- Primary owner: TBD
- Backup owner: TBD
- Slack channel: TBD
- Jira project: TBD
