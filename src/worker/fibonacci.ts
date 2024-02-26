export class Fibonacci {
  private readonly list: Array<bigint>;

  // TODO should be stored in redis
  constructor() {
    this.list = [0n, 1n];
  }

  getValueFor(inputNumber: number): Promise<bigint> {
    if (!inputNumber || inputNumber < 0) {
      throw new Error(`Invalid input number: ${inputNumber}`);
    }

    if (inputNumber < this.list.length) {
      const alreadyCalculated = this.list.at(inputNumber) as bigint;
      return Promise.resolve(alreadyCalculated);
    }

    return this.calculateValue(inputNumber);
  }

  private async calculateValue(inputNumber: number): Promise<bigint> {
    let [a, b] = [0n, 1n];
    let i = 2;
    while (i <= inputNumber) {
      [a, b] = await this.calculateNext(a, b);
      i++;
    }
    return b;
  }

  private async calculateNext(a: bigint, b: bigint): Promise<[bigint, bigint]> {
    return new Promise((resolve) => {
      setImmediate(() => {
        return resolve([b, a + b]);
      });
    });
  }
}
