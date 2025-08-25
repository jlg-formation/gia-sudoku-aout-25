#!/usr/bin/env node
import { generatePuzzle, fmt } from './sudoku';

function parseArgs(argv: string[]) {
  const args: Record<string, string | boolean> = {};
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--seed') {
      const v = argv[i + 1];
      if (!v) {
        console.error('Error: --seed requires a value');
        process.exit(1);
      }
      args.seed = v;
      i++;
    } else if (a === '-h' || a === '--help') {
      args.help = true;
    } else {
      console.error(`Unknown argument: ${a}`);
      process.exit(1);
    }
  }
  return args;
}

function printHelp() {
  console.log(`sudoku-gen
Generate a 9x9 Sudoku puzzle (unique solution) and its solution.

Usage:
  sudoku-gen [--seed <value>]

Options:
  --seed <value>   Seed for deterministic generation
  -h, --help       Show this help
`);
}

(function main() {
  const args = parseArgs(process.argv);
  if (args.help) return printHelp();

  const seed = (args.seed as string | undefined);
  const { puzzle, solution } = generatePuzzle(seed);

  console.log('Puzzle:');
  console.log(fmt(puzzle));
  console.log('\nSolution:');
  console.log(fmt(solution));
})();
