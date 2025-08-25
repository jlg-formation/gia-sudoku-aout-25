import { makeRng } from './rng';

export type Grid = number[][]; // 0 for empty
const N = 9;
const BOX = 3;

export function emptyGrid(): Grid {
  return Array.from({ length: N }, () => Array(N).fill(0));
}

function canPlace(grid: Grid, r: number, c: number, val: number): boolean {
  for (let i = 0; i < N; i++) {
    if (grid[r][i] === val || grid[i][c] === val) return false;
  }
  const br = Math.floor(r / BOX) * BOX;
  const bc = Math.floor(c / BOX) * BOX;
  for (let i = 0; i < BOX; i++) {
    for (let j = 0; j < BOX; j++) {
      if (grid[br + i][bc + j] === val) return false;
    }
  }
  return true;
}

function findEmpty(grid: Grid): [number, number] | null {
  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      if (grid[r][c] === 0) return [r, c];
    }
  }
  return null;
}

// Backtracking solver; if stopAtTwo is true, count up to 2 solutions (for uniqueness test)
export function solve(grid: Grid, rngSeed?: string | number, stopAtTwo = false): { solved: boolean; solutions?: number; grid: Grid } {
  const rng = makeRng(rngSeed);
  const work: Grid = grid.map(row => row.slice());
  let solutions = 0;

  const values = [1,2,3,4,5,6,7,8,9];

  function backtrack(): boolean {
    const pos = findEmpty(work);
    if (!pos) {
      solutions++;
      return true;
    }
    const [r, c] = pos;
    const order = rng.shuffle(values);
    for (const v of order) {
      if (canPlace(work, r, c, v)) {
        work[r][c] = v;
        if (backtrack()) {
          if (!stopAtTwo) return true;
          if (solutions >= 2) return true; // early exit when counting
        }
        work[r][c] = 0;
      }
    }
    return false;
  }

  const ok = backtrack();
  return stopAtTwo ? { solved: ok, solutions, grid: work } : { solved: ok, grid: work };
}

export function generateFullSolution(seed?: string | number): Grid {
  const g = emptyGrid();
  const { solved, grid } = solve(g, seed, false);
  if (!solved) throw new Error('Failed to generate a full solution');
  return grid;
}

export function countSolutions(grid: Grid, seed?: string | number): number {
  const { solutions } = solve(grid, seed, true);
  return solutions ?? 0;
}

export function generatePuzzle(seed?: string | number): { puzzle: Grid; solution: Grid } {
  const rng = makeRng(seed);
  const solution = generateFullSolution(seed);
  const puzzle: Grid = solution.map(row => row.slice());

  // Create list of all positions and shuffle
  const positions = rng.shuffle(Array.from({ length: N * N }, (_, k) => [Math.floor(k / N), k % N] as [number, number]));

  for (const [r, c] of positions) {
    const backup = puzzle[r][c];
    puzzle[r][c] = 0;

    // Ensure still uniquely solvable
    const sols = countSolutions(puzzle, seed);
    if (sols !== 1) {
      // revert if not unique
      puzzle[r][c] = backup;
    }
  }
  return { puzzle, solution };
}

export function fmt(grid: Grid): string {
  const lines: string[] = [];
  for (let r = 0; r < N; r++) {
    if (r % 3 === 0) lines.push('+-------+-------+-------+');
    let row = '';
    for (let c = 0; c < N; c++) {
      if (c % 3 === 0) row += '| ';
      row += (grid[r][c] === 0 ? '.' : String(grid[r][c])) + ' ';
    }
    row += '|';
    lines.push(row.trimEnd());
  }
  lines.push('+-------+-------+-------+');
  return lines.join('\n');
}
