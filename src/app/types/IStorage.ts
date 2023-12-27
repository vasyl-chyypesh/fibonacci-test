export interface IStorage {
  set(key: string, value: string): Promise<string>;
  get(key: string): Promise<string | null>;
  executeIsolated(func: (client: any) => Promise<void>): Promise<void>;
}
