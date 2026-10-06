import { IStorage } from '../types/IStorage.js';

const IDEMPOTENCY_TTL_MILLISECONDS = 1000 * 60 * 2; // 2 minutes

export class IdempotencyService {
  private readonly storageService;

  constructor(storageService: IStorage) {
    this.storageService = storageService;
  }

  private getStorageKey(idempotencyKey: string): string {
    return `idempotency_${idempotencyKey}`;
  }

  public async getIdempotency<T>(idempotencyKey: string): Promise<T | null> {
    const data = await this.storageService.get(this.getStorageKey(idempotencyKey));
    return data ? (JSON.parse(data) as T) : null;
  }

  public async setIdempotency<T>(idempotencyKey: string, data: T): Promise<string> {
    return this.storageService.set(this.getStorageKey(idempotencyKey), JSON.stringify(data), {
      expirationMilliseconds: IDEMPOTENCY_TTL_MILLISECONDS,
    });
  }
}
