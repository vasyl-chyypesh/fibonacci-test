export interface IStorage {
  set(key: string, value: string): Promise<string>;
  get(key: string): Promise<string | null>;
  increment(key: string): Promise<number>;
}
