import { IStorage, ISimpleStorage } from '../types/Storage.js';

export class TicketService {
  private storageService;
  private readonly storageName = 'ticket';

  constructor(storageService: IStorage) {
    this.storageService = storageService;
  }

  async getTicket(): Promise<number> {
    let newValue = 1;
    await this.storageService.executeIsolated(async (isolatedClient: ISimpleStorage) => {
      const prevValue = await isolatedClient.get(this.storageName);
      if (prevValue) {
        newValue = parseInt(prevValue, 10) + 1;
      }
      await isolatedClient.set(this.storageName, newValue.toString());
    });
    return newValue;
  }
}
