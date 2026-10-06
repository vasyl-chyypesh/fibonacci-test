export interface IStorageSetOptions {
  expirationMilliseconds?: number;
}

export interface IStorage {
  set(key: string, value: string, options?: IStorageSetOptions): Promise<string>;
  get(key: string): Promise<string | null>;
  increment(key: string): Promise<number>;
}
