import { suite, bench, BenchContext } from 'node:bench';
import { Fibonacci } from '../src/worker/fibonacci.js';

const FIBONACCI_INDEX = 25;
const WARMUP = 2;
const SAMPLES = 30;

suite('Fibonacci', () => {
  bench('Fibonacci.getValueFor (iterative)', { warmup: WARMUP, samples: SAMPLES }, async (context: BenchContext) => {
    const fibonacci = new Fibonacci('iterative');

    context.start();
    const result = await fibonacci.getValueFor(FIBONACCI_INDEX);
    context.end(FIBONACCI_INDEX, { detail: result.toString() });
  });

  bench('Fibonacci.getValueFor (recursive)', { warmup: WARMUP, samples: SAMPLES }, async (context: BenchContext) => {
    const fibonacci = new Fibonacci('recursive');

    context.start();
    const result = await fibonacci.getValueFor(FIBONACCI_INDEX);
    context.end(FIBONACCI_INDEX, { detail: result.toString() });
  });
});
