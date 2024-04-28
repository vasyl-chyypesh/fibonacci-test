export interface ISimpleStorage {
  set(key: string, value: string): Promise<string>;
  get(key: string): Promise<string | null>;
}

export interface IStorage extends ISimpleStorage {
  executeIsolated(func: (client: any) => Promise<void>): Promise<void>;
}
