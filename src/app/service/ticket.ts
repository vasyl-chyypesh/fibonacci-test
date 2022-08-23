export class Ticket {
  private storageClient;
  private readonly storageName = 'ticket';

  constructor(storageClient: any) {
    this.storageClient = storageClient;
  }

  async getTicket(): Promise<number> {
    return this.storageClient.INCR(this.storageName);
  }
}
