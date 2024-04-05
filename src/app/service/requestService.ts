import { IStorage } from '../types/IStorage.js';

export class RequestService {
  private storageService;

  constructor(storageService: IStorage) {
    this.storageService = storageService;
  }

  private getStorageId(ticket: number) {
    return `fib_request_${ticket}`;
  }

  addRequest(ticket: number, inputNumber: number) {
    return this.storageService.set(this.getStorageId(ticket), JSON.stringify({ inputNumber }));
  }

  getRequest(ticket: number) {
    return this.storageService.get(this.getStorageId(ticket));
  }

  updateRequestWithField(ticket: number, field: string, value: string | number) {
    return this.storageService.executeIsolated(async (isolatedClient: any) => {
      const prevValue = await isolatedClient.get(this.getStorageId(ticket));
      if (!prevValue) {
        throw new Error(`Not found request by ticket: ${ticket}`);
      }
      const prevReq = JSON.parse(prevValue);
      const updatedData = Object.assign(prevReq, { [field]: value });
      await isolatedClient.set(this.getStorageId(ticket), JSON.stringify(updatedData));
    });
  }
}
