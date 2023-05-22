import { SQS } from "aws-sdk";
import { APIGatewayEvent } from "aws-lambda";

const isOffline = process.env.IS_OFFLINE === 'true'
const offlineQueueUrl = 'http://localhost:9324/000000000000/myqueue'
console.log({ isOffline })

const options = isOffline ? {
  credentials: {
    accessKeyId: 'doesnt_matter',
    secretAccessKey: 'doesnt_matter'
  },
  endpoint: 'http://localhost:9324'
} : {}

const sqs = new SQS(options);

const handler = async (event: APIGatewayEvent) => {
  let statusCode = 200;
  let message;

  try {
    await sqs
      .sendMessage({
        QueueUrl: isOffline ? offlineQueueUrl : (process.env.QUEUE_URL || ''),
        MessageBody: event.body || '',
        MessageAttributes: {
          AttributeName: {
            StringValue: "Attribute Value",
            DataType: "String",
          },
        },
      })
      .promise();

    message = "Successfully enqueued message!";
  } catch (error) {
    console.log(error);
    message = error;
    statusCode = 500;
  }


  return {
    statusCode,
    body: JSON.stringify({
      message,
    }),
  };
};

module.exports = { handler };
