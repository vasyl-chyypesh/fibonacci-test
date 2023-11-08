import { IStorageService } from './IStorageService';

export class RequestStorage {
  private storageClient;

  constructor(storageClient: IStorageService) {
    this.storageClient = storageClient;
  }

  private getStorageId(ticketId: number) {
    return `fib_request_${ticketId}`;
  }

  addRequest(ticketId: number, inputNumber: number) {
    return this.storageClient.set(this.getStorageId(ticketId), JSON.stringify({ inputNumber }));
  }

  getRequest(ticketId: number) {
    return this.storageClient.get(this.getStorageId(ticketId));
  }

  updateRequestWithField(ticketId: number, field: string, value: any) {
    return this.storageClient.executeIsolated(async (isolatedClient: any) => {
      const prevValue = await isolatedClient.get(this.getStorageId(ticketId));
      const prevReq = JSON.parse(prevValue);
      const updatedData = Object.assign(prevReq, { [field]: value });
      await isolatedClient.set(this.getStorageId(ticketId), JSON.stringify(updatedData));
    });
  }
}
