export class Fibonacci {
  private readonly list: Array<number>;

  // TODO should be stored in redis
  constructor() {
    this.list = [0, 1];
  }

  getValueFor(inputNumber: number): number {
    if (!inputNumber || inputNumber < 0) {
      throw new Error(`Invalid input number: ${inputNumber}`);
    }

    if (inputNumber < this.list.length) {
      return this.list[inputNumber];
    }

    return this.calculateValue(inputNumber);
  }

  private calculateValue(inputNumber: number): number {
    for (let i = this.list.length; i < inputNumber + 1; i += 1) {
      this.list.push(this.list[i - 2] + this.list[i - 1]);
    }
    return this.list[inputNumber];
  }
}
