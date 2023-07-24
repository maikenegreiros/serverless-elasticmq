import { SQSEvent } from "aws-lambda";

const handler = async (event: SQSEvent) => {
  for (const record of event.Records) {
    console.log('reading message:  ', record.body)
  }
};

module.exports = { handler };
