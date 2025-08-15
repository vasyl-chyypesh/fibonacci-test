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

  updateRequestWithData<T>(ticket: number, data: T) {
    return this.storageService.set(this.getStorageId(ticket), JSON.stringify(data));
  }
}
