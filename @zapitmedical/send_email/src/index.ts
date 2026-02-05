import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { DateTime } from "luxon";
import path from "path";
import pug from "pug";

type MomentLike = {
  format: (fmt: string) => string;
};

type SendEmailConfig = {
  to: string;
  subject: string;
  template: string;
  body?: string;
  [key: string]: unknown;
};

const ses = new SESClient({ region: "us-east-1" });

const normalizeFormat = (format: string) =>
  format.replace(/YYYY/g, "yyyy").replace(/DD/g, "dd");

const moment = (input: Date | string | number): MomentLike => {
  const parsed = input instanceof Date ? input : new Date(input);
  const dateTime = DateTime.fromJSDate(parsed);
  return {
    format: (fmt: string) => dateTime.toFormat(normalizeFormat(fmt)),
  };
};

export const send = async (config: SendEmailConfig) => {
  if (process.env.ZAPIT_DISABLE_SEND_EMAIL) {
    console.log("not sending email - disabled");
    return;
  }

  console.log("SENDING EMAIL");
  console.log(config);

  const templatePath = path.resolve(
    __dirname,
    "..",
    "email_templates",
    `${config.template}.pug`
  );
  const body =
    config.body ??
    pug.renderFile(templatePath, {
      ...config,
      moment,
    });

  console.log(`body length: ${body.length}`);

  const command = new SendEmailCommand({
    Source: "support@zapitmedical.com",
    Destination: { ToAddresses: [config.to] },
    Message: {
      Subject: {
        Data: config.subject,
      },
      Body: {
        Html: {
          Data: body,
        },
      },
    },
  });

  return ses.send(command);
};

export default {
  send,
};
