/**
 * The Fibonacci class.
 */
export class Fibonacci {
  private readonly fibonacciNumbers: Array<bigint>;

  constructor() {
    this.fibonacciNumbers = [0n, 1n];
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

    return this.calculateValue(fibonacciIndex);
  }

  private async calculateValue(inputNumber: number): Promise<bigint> {
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
}
