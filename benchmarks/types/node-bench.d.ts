declare module 'node:bench' {
  export interface BenchContext {
    readonly name: string;
    readonly index: number;
    readonly phase: 'warmup' | 'measurement';
    readonly params: Record<string, string | number | boolean>;
    readonly signal: AbortSignal;
    start(): void;
    end(
      operations: number,
      options?: {
        detail?: unknown;
      },
    ): {
      operations: number;
      duration_ns: bigint;
      rate: number;
    };
    record(sample: { operations: number; duration_ns: number; detail?: unknown }): unknown;
    diagnostic(message: unknown, options?: { level?: 'info' | 'warning'; detail?: unknown }): void;
    done(): void;
  }

  export type BenchFn = (b: BenchContext) => void | Promise<void>;

  export interface BenchOptions {
    samples?: number;
    warmup?: number;
    skip?: boolean | string;
    only?: boolean;
    timeout?: number;
    tags?: string[];
    params?: Record<string, string | number | boolean>;
  }

  export function bench(name: string, fn: BenchFn): Promise<unknown>;
  export function bench(name: string, options: BenchOptions, fn: BenchFn): Promise<unknown>;
  export function suite(name: string, fn: () => void | Promise<void>): Promise<unknown>;
  export function suite(name: string, options: BenchOptions, fn: () => void | Promise<void>): Promise<unknown>;
}
