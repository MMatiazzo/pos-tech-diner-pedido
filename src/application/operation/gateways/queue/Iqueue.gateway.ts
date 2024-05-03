
export interface IQueueGateway {
  enviarMensagem(queueUrl: string, messageBody: any): Promise<void>;
  receberMensagem(queueUrl: string): Promise<any>;
  deletarMensagem(queueUrl: string, mensagens: any): Promise<void>;
}

export const IQueueGateway = Symbol('IQueueGateway');