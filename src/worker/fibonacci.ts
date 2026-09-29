/**
 * The Fibonacci class.
 * It can be used to calculate the Fibonacci number for a given index using either an iterative or a recursive approach.
 */
export class Fibonacci {
  private readonly fibonacciNumbers: bigint[];
  private readonly method: 'iterative' | 'recursive';

  constructor(method: 'iterative' | 'recursive' = 'iterative') {
    this.fibonacciNumbers = [0n, 1n];
    this.method = method;
  }

  /**
   * Gets the Fibonacci number for the given index.
   *
   * @param fibonacciIndex - The index of the Fibonacci number to retrieve.
   * @returns A Promise that resolves with the Fibonacci number for the given index.
   */
  public async getValueFor(fibonacciIndex: number): Promise<bigint> {
    if (!Number.isInteger(fibonacciIndex) || fibonacciIndex < 0) {
      throw new Error(`Invalid input fibonacci index: ${fibonacciIndex}`);
    }

    if (fibonacciIndex < this.fibonacciNumbers.length) {
      const alreadyCalculated = this.fibonacciNumbers.at(fibonacciIndex) as bigint;
      return Promise.resolve(alreadyCalculated);
    }

    return this.method === 'recursive'
      ? this.calculateRecursively(BigInt(fibonacciIndex))
      : this.calculateIteratively(fibonacciIndex);
  }

  private async calculateIteratively(inputNumber: number): Promise<bigint> {
    let [previous, current] = [0n, 1n];
    let i = 2;
    while (i <= inputNumber) {
      [previous, current] = await this.calculateNext(previous, current);
      i++;
    }
    return current;
  }

  private async calculateNext(previous: bigint, current: bigint): Promise<[bigint, bigint]> {
    return new Promise((resolve) => {
      setImmediate(() => {
        return resolve([current, previous + current]);
      });
    });
  }

  public async getValueForWithLastOptions(
    fibonacciIndex: number,
    lastOptions: { lastIndex: number; lastValues: bigint[] },
  ) {
    if (!Number.isInteger(fibonacciIndex) || fibonacciIndex < 0) {
      throw new Error(`Invalid input fibonacci index: ${fibonacciIndex}`);
    }

    if (fibonacciIndex <= lastOptions.lastIndex) {
      throw new Error(`Fibonacci index is less than or equal to last index`);
    }

    let [previous, current] = lastOptions.lastValues;
    let i = lastOptions.lastIndex;
    while (i < fibonacciIndex) {
      [previous, current] = await this.calculateNext(previous, current);
      i++;
    }

    return current;
  }

  private calculateRecursively(fibonacciIndex: bigint): Promise<bigint> {
    if (fibonacciIndex < 2n) {
      return Promise.resolve(fibonacciIndex);
    }

    return new Promise((resolve, reject) => {
      setImmediate(() => {
        void (async () => {
          const left = await this.calculateRecursively(fibonacciIndex - 1n);
          const right = await this.calculateRecursively(fibonacciIndex - 2n);
          const result = left + right;
          resolve(result);
        })().catch(reject);
      });
    });
  }
}
