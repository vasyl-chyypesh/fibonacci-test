import { describe, test } from 'node:test';
import assert from 'node:assert';
import { Fibonacci } from '../fibonacci.js';

describe('Fibonacci Performance', () => {
  describe('getValueFor', () => {
    test('should calculate numbers quickly (cached)', async () => {
      const fibonacci = new Fibonacci();
      await fibonacci.getValueFor(20); // pre-calculate the value

      const startTime = process.hrtime.bigint();

      const result = await fibonacci.getValueFor(20);

      const endTime = process.hrtime.bigint();
      const executionTime = Number(endTime - startTime) / 1_000_000; // Convert to milliseconds

      assert.strictEqual(result, 6765n);
      assert.ok(executionTime < 2, `Execution time ${executionTime}ms exceeded 2ms threshold`);
    });

    test('should calculate medium numbers within reasonable time', async () => {
      const fibonacci = new Fibonacci();
      const startTime = process.hrtime.bigint();

      const result = await fibonacci.getValueFor(25);

      const endTime = process.hrtime.bigint();
      const executionTime = Number(endTime - startTime) / 1_000_000; // Convert to milliseconds

      assert.strictEqual(result, 75025n);
      assert.ok(executionTime < 10, `Execution time ${executionTime}ms exceeded 10ms threshold`);
    });

    test('should calculate larger numbers within acceptable time', async () => {
      const fibonacci = new Fibonacci();
      const startTime = process.hrtime.bigint();

      const result = await fibonacci.getValueFor(40);

      const endTime = process.hrtime.bigint();
      const executionTime = Number(endTime - startTime) / 1_000_000; // Convert to milliseconds

      assert.strictEqual(result, 102334155n);
      assert.ok(executionTime < 20, `Execution time ${executionTime}ms exceeded 20ms threshold`);
    });

    test('should maintain consistent performance for repeated calculations', async () => {
      const fibonacci = new Fibonacci();
      const times: number[] = [];

      // Run the same calculation multiple times
      for (let i = 0; i < 5; i++) {
        const startTime = process.hrtime.bigint();
        await fibonacci.getValueFor(30);
        const endTime = process.hrtime.bigint();
        times.push(Number(endTime - startTime) / 1_000_000);
      }

      // Ignore the first run
      times.shift();

      // Calculate average and standard deviation
      const avg = times.reduce((a, b) => a + b, 0) / times.length;
      const stdDev = Math.sqrt(times.reduce((sq, n) => sq + Math.pow(n - avg, 2), 0) / times.length);

      // Check that standard deviation is not too high (indicating inconsistent performance)
      assert.ok(stdDev < avg * 0.5, `Performance is too inconsistent: avg=${avg}ms, stdDev=${stdDev}ms`);
    });
  });
});
