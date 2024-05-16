import { SQSClient } from "@aws-sdk/client-sqs";
import { SQSQueue } from "./sqs-queue";

// Mock SQSClient and its methods
jest.mock("@aws-sdk/client-sqs", () => {
  return {
    SQSClient: jest.fn(() => ({
      send: jest.fn()
    })),
    SendMessageCommand: jest.fn(),
    ReceiveMessageCommand: jest.fn(),
    DeleteMessageCommand: jest.fn()
  };
});

describe('SQSQueue Test Suite', () => {
  let sqsQueue: SQSQueue;
  let sqsClient: SQSClient;

  beforeEach(() => {
    sqsQueue = new SQSQueue();
    sqsClient = new SQSClient({});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Deve enviar mensagens', async () => {
    const queueUrl = 'some-queue-url';
    const messageBody = { foo: 'bar' };

    await sqsQueue.enviarMensagem(queueUrl, messageBody);

    expect(SQSClient).toHaveBeenCalledTimes(2);
  });

  it('Deve receber mensagens', async () => {
    const queueUrl = 'some-queue-url';

    await sqsQueue.receberMensagem(queueUrl);

    expect(SQSClient).toHaveBeenCalledTimes(2);
  });

  it('Deve deletar mensagens', async () => {
    const queueUrl = 'some-queue-url';
    const messages = {
      Messages: [
        { ReceiptHandle: 'receipt-handle-1' },
        { ReceiptHandle: 'receipt-handle-2' }
      ]
    };

    await sqsQueue.deletarMensagem(queueUrl, messages);

    expect(SQSClient).toHaveBeenCalledTimes(2);
  });
});
