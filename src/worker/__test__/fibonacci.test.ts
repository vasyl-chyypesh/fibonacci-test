import { describe, test } from 'node:test';
import assert from 'node:assert';
import { Fibonacci } from '../fibonacci.js';

describe('Fibonacci', () => {
  test('getValueFor should return 1 for 1', async () => {
    const fibonacci = new Fibonacci();

    const result = await fibonacci.getValueFor(1);

    assert.strictEqual(result, 1n);
  });

  test('getValueFor should return 13 for 7', async () => {
    const fibonacci = new Fibonacci();

    const result = await fibonacci.getValueFor(7);

    assert.strictEqual(result, 13n);
  });

  test('getValueFor should return 21 for 9', async () => {
    const fibonacci = new Fibonacci();

    const result = await fibonacci.getValueFor(9);

    assert.strictEqual(result, 34n);
  });

  test('getValueFor should throw error', async () => {
    const fibonacci = new Fibonacci();

    assert.rejects(async () => {
      await fibonacci.getValueFor(-1);
    }, /Invalid input fibonacci index: -1/);
  });
});
