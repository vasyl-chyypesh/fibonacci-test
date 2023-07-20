export interface IStorageClient {
  set(key: string, value: string): any;
  get(key: string): any;
  executeIsolated(func: (client: any) => Promise<void>): void;
}
