import { DeleteMessageCommand, ReceiveMessageCommand, SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import { IQueueGateway } from "../../Iqueue.gateway";

export class SQSQueue implements IQueueGateway {
  private static getClient() {
    const client = new SQSClient({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACESS_KEY
      },
      // endpoint: "http://sqs.us-east-1.localhost.localstack.cloud:4566" // tirar dps
    });

    return client;
  }

  async enviarMensagem(queueUrl: string, messageBody: any): Promise<void> {
    try {
      const client = SQSQueue.getClient();

      const command = new SendMessageCommand({
        MessageBody: JSON.stringify(messageBody),
        QueueUrl: queueUrl,
      });

      const response = await client.send(command);
      console.info(`response => ${response}`);
    } catch (err) {
      console.error(`error on sqs-queue => ${err}`);
    }
  }

  async receberMensagem(queueUrl: string) {
    const client = SQSQueue.getClient();

    const command = new ReceiveMessageCommand({
      QueueUrl: queueUrl,
      MaxNumberOfMessages: 8
    });

    const response = await client.send(command);

    return response;
  }

  async deletarMensagem(queueUrl: string, mensagens: any) {
    if (mensagens?.Messages.length) {
      const client = SQSQueue.getClient();

      const messagesToDelete = mensagens.Messages.map((message: any) => {
        const input2 = {
          QueueUrl: queueUrl,
          ReceiptHandle: message.ReceiptHandle, // required
        };

        const command2 = new DeleteMessageCommand(input2);
        return client.send(command2);
      });

      await Promise.all(messagesToDelete)
        .then((value => console.info('value => ', value)))
        .catch(err => console.error('err => ', err));
    }
  }
}