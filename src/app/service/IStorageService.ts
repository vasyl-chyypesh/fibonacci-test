export interface IStorageService {
  set(key: string, value: string): Promise<string>;
  get(key: string): Promise<string>;
  executeIsolated(func: (client: any) => Promise<void>): void;
}
