import { DeleteMessageCommand, ReceiveMessageCommand, SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import { IQueueGateway } from "../../Iqueue.gateway";
import { BadRequestException } from "@nestjs/common";

export class SQSQueue implements IQueueGateway {
  private static getClient() {
    const client = new SQSClient({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID_B64,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_B64
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
    } catch (error) {
      console.error(`error on sqs-queue => ${error}`);
      throw new BadRequestException(error);
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