import { IStorageService } from './IStorageService';

export class Ticket {
  private storageClient;
  private readonly storageName = 'ticket';

  constructor(storageClient: IStorageService) {
    this.storageClient = storageClient;
  }

  async getTicket(): Promise<number> {
    let newValue = 1;
    await this.storageClient.executeIsolated(async (isolatedClient: any) => {
      const prevValue = await isolatedClient.get(this.storageName);
      if (prevValue) {
        newValue = parseInt(prevValue, 10) + 1;
      }
      await isolatedClient.set(this.storageName, newValue.toString());
    });
    return newValue;
  }
}
