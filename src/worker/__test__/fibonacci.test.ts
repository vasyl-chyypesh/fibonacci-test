import { describe, test } from 'node:test';
import assert from 'node:assert';
import { Fibonacci } from '../fibonacci.js';

describe('Fibonacci', () => {
  describe('getValueFor', () => {
    test('should return 1 for 1', async () => {
      const fibonacci = new Fibonacci();

      const result = await fibonacci.getValueFor(1);

      assert.strictEqual(result, 1n);
    });

    test('should return 13 for 7', async () => {
      const fibonacci = new Fibonacci();

      const result = await fibonacci.getValueFor(7);

      assert.strictEqual(result, 13n);
    });

    test('should return 34 for 9', async () => {
      const fibonacci = new Fibonacci();

      const result = await fibonacci.getValueFor(9);

      assert.strictEqual(result, 34n);
    });

    test('should throw error for -1', async () => {
      const fibonacci = new Fibonacci();

      await assert.rejects(async () => {
        await fibonacci.getValueFor(-1);
      }, /Invalid input fibonacci index: -1/);
    });
  });

  describe('getValueForWithLastOptions', () => {
    test('should return 55 for 10 with options', async () => {
      const fibonacci = new Fibonacci();

      const resultPrev = await fibonacci.getValueFor(7);
      const resultLast = await fibonacci.getValueFor(8);
      const result = await fibonacci.getValueForWithLastOptions(10, {
        lastIndex: 8,
        lastValues: [resultPrev, resultLast],
      });

      assert.strictEqual(result, 55n);
    });

    test('should throw error for fibonacci index less then last calculated', async () => {
      const fibonacci = new Fibonacci();

      const resultPrev = await fibonacci.getValueFor(7);
      const resultLast = await fibonacci.getValueFor(8);

      await assert.rejects(async () => {
        await fibonacci.getValueForWithLastOptions(7, { lastIndex: 8, lastValues: [resultPrev, resultLast] });
      }, /Fibonacci index is less than or equal to last index/);
    });
  });
});
