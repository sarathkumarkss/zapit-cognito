import { PublishCommand, SNSClient } from "@aws-sdk/client-sns";

type NotificationConfig = Record<string, unknown>;

const sns = new SNSClient({ region: "us-east-1" });

const isPublishEnvironment = (env?: string) =>
  env === "test" || env === "prod";

export const sendNotifications = async (config: NotificationConfig) => {
  console.log("SEND NOTIFICATIONS");
  console.log(config);

  if (!isPublishEnvironment(process.env.ZAPIT_DB)) {
    return;
  }

  const command = new PublishCommand({
    TopicArn: `arn:aws:sns:us-east-1:888328543067:send_notifications_${process.env.ZAPIT_DB}`,
    Message: JSON.stringify(config),
  });

  return sns.send(command);
};

export default sendNotifications;
