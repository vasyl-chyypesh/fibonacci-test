export interface IStorage {
  set(key: string, value: string): Promise<string>;
  get(key: string): Promise<string | null>;
  executeIsolated(func: (client: unknown) => Promise<void>): Promise<void>;
}
