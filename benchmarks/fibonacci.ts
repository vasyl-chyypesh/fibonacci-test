import { suite, bench, BenchContext } from 'node:bench';
import { Fibonacci } from '../src/worker/fibonacci.js';

const FIBONACCI_INDEX = 25;
const BENCH_OPTS = {
  warmup: 3,
  samples: 50
};

suite('Fibonacci', () => {
  bench('Iterative', BENCH_OPTS, async (context: BenchContext) => {
    const fibonacci = new Fibonacci('iterative');

    context.start();
    const result = await fibonacci.getValueFor(FIBONACCI_INDEX);
    context.end(1, { detail: result.toString() });
  });

  bench('Recursive', BENCH_OPTS, async (context: BenchContext) => {
    const fibonacci = new Fibonacci('recursive');

    context.start();
    const result = await fibonacci.getValueFor(FIBONACCI_INDEX);
    context.end(1, { detail: result.toString() });
  });
});
