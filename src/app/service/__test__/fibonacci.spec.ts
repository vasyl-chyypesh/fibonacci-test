import { Fibonacci } from '../fibonacci';

describe('Fibonacci', () => {
  test('getValueFor should return 1 for 1', async () => {
    const fibonacci = new Fibonacci();

    const result = await fibonacci.getValueFor(1);

    expect(result).toBe(1n);
  });

  test('getValueFor should return 13 for 7', async () => {
    const fibonacci = new Fibonacci();

    const result = await fibonacci.getValueFor(7);

    expect(result).toBe(13n);
  });

  test('getValueFor should return 21 for 9', async () => {
    const fibonacci = new Fibonacci();

    const result = await fibonacci.getValueFor(9);

    expect(result).toBe(34n);
  });

  test('getValueFor should throw error', async () => {
    const fibonacci = new Fibonacci();

    expect(() => {
      fibonacci.getValueFor(-1);
    }).toThrow('Invalid input number: -1');
  });
});
