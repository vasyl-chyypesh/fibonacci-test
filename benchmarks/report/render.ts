import { execFileSync } from 'node:child_process';
import { mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';

const REPORT_DIR = path.dirname(fileURLToPath(import.meta.url));
const TEMPLATE_PATH = path.join(REPORT_DIR, 'template.html');
const DATA_PLACEHOLDER = '"__BENCH_DATA__"';

// Usage: render.ts [input.json] [output.html] [--docs-link <href>]
const { values: options, positionals } = parseArgs({
  allowPositionals: true,
  options: { 'docs-link': { type: 'string' } },
});
const [
  inputPath = path.join(REPORT_DIR, '..', 'report.json'),
  outputPath = path.join(REPORT_DIR, '..', 'report.html'),
] = positionals;

const git = (...args: string[]): string | null => {
  try {
    return execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return null;
  }
};

// Commit the numbers were measured at; `dirty` means the working tree had uncommitted changes.
const getCommit = () => {
  const sha = git('rev-parse', '--short', 'HEAD');
  return sha && { sha, dirty: git('status', '--porcelain', '--untracked-files=no') !== '' };
};

// Captured at render time, so it describes the benchmark machine when rendering runs right after the benchmarks.
const getEnvironment = () => ({
  node: process.version,
  os: `${os.type()} ${os.release()} (${os.arch()})`,
  cpu: os.cpus()[0]?.model.trim() ?? 'unknown',
});

interface RawSample {
  operations: number;
  duration_ns: string;
  rate: number;
}

interface BenchSummary {
  mean: number;
  median: number;
  min: number;
  max: number;
  stddev: number;
  coefficientOfVariation: number;
  confidenceInterval: { lower: number; upper: number };
  medianConfidenceInterval: { lower: number; upper: number };
  skewness: number;
}

interface BenchEvent {
  type: string;
  data: Record<string, unknown>;
}

interface Bench {
  name: string;
  namePath: string[];
  warmup: number | null;
  plannedSamples: number | null;
  samples: { index: number; operations: number; durationNs: number; rate: number }[];
  summary: BenchSummary;
}

const parseEvents = (content: string): BenchEvent[] =>
  content
    .split('\n')
    .filter((line) => line.trim() !== '')
    .map((line, lineIndex) => {
      try {
        return JSON.parse(line) as BenchEvent;
      } catch {
        throw new Error(`Invalid JSON on line ${lineIndex + 1} of ${inputPath}`);
      }
    });

const buildReportData = (events: BenchEvent[], runAt: Date) => {
  const plans = new Map<string, Record<string, unknown>>();
  const benches: Bench[] = [];
  let runSummary: Record<string, unknown> | null = null;

  for (const { type, data } of events) {
    if (type === 'bench:plan') {
      plans.set(data.benchId as string, data);
    } else if (type === 'bench:complete') {
      const plan = plans.get(data.benchId as string);
      benches.push({
        name: data.name as string,
        namePath: data.namePath as string[],
        warmup: (plan?.warmup as number | undefined) ?? null,
        plannedSamples: (plan?.samples as number | undefined) ?? null,
        samples: (data.samples as RawSample[]).map((sample, index) => ({
          index,
          operations: sample.operations,
          durationNs: Number(sample.duration_ns),
          rate: sample.rate,
        })),
        summary: data.summary as BenchSummary,
      });
    } else if (type === 'bench:summary') {
      runSummary = data;
    }
  }

  if (benches.length === 0) {
    throw new Error(`No completed benchmarks found in ${inputPath}`);
  }

  return {
    source: path.relative(process.cwd(), inputPath),
    runAt: runAt.toISOString(),
    generatedAt: new Date().toISOString(),
    commit: getCommit(),
    environment: getEnvironment(),
    docsLink: options['docs-link'] ?? null,
    run: runSummary && {
      success: runSummary.success as boolean,
      counts: runSummary.counts as Record<string, number>,
      durationNs: Number(runSummary.duration_ns),
    },
    benches,
  };
};

const [content, template, inputStat] = await Promise.all([
  readFile(inputPath, 'utf8'),
  readFile(TEMPLATE_PATH, 'utf8'),
  stat(inputPath),
]);

const reportData = buildReportData(parseEvents(content), inputStat.mtime);
// Escape "<" so bench names can never close the surrounding <script> tag.
const serialized = JSON.stringify(reportData).replaceAll('<', '\\u003c');

if (!template.includes(DATA_PLACEHOLDER)) {
  throw new Error(`Template ${TEMPLATE_PATH} is missing the ${DATA_PLACEHOLDER} placeholder`);
}

await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(
  outputPath,
  template.replace(DATA_PLACEHOLDER, () => serialized),
);
process.stdout.write(`Benchmark report written to ${path.relative(process.cwd(), outputPath)}\n`);
