# Lambda documentation (SharePoint)

This folder contains SharePoint-ready documentation for backend Lambdas.

## Included documents

| Lambda | Document |
|--------|----------|
| zapit-cognito | [zapit-cognito.md](./zapit-cognito.md) |
| equipment-log-adapter-accruent | [equipment-log-adapter-accruent.md](./equipment-log-adapter-accruent.md) |
| equipment-log-processor | [equipment-log-processor.md](./equipment-log-processor.md) |
| equipment-log-email | [equipment-log-email.md](./equipment-log-email.md) |

## SharePoint publishing workflow

1. Open the Markdown file you need.
2. Copy the content into a SharePoint page (or convert to Word/PDF and upload).
3. Keep "TBD" fields visible until ownership, alarms, or environment values are finalized.

## Document standard

Each Lambda page includes:

1. Overview
2. Architecture and flow
3. Lambda configuration
4. Trigger details
5. Environment variables
6. IAM permissions
7. Dependencies
8. Deployment process
9. Logging and monitoring
10. Error handling
11. Security
12. Performance and limits
13. Testing
14. Versioning and release notes
15. Troubleshooting
16. Contacts and ownership

## Template

Use [TEMPLATE.md](./TEMPLATE.md) when adding documentation for a new Lambda.
