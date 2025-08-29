import { IStorage } from '../types/IStorage.js';

export class TicketService {
  private readonly storageService;
  private readonly storageName = 'ticket';

  constructor(storageService: IStorage) {
    this.storageService = storageService;
  }

  async getTicket(): Promise<number> {
    return this.storageService.increment(this.storageName);
  }
}
