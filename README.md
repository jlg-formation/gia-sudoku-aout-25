# sudoku-gen-cli

CLI Node/TypeScript to generate **9×9 Sudoku** puzzles with **unique solution**, using a **randomized backtracking** solver.  
Output shows both the **puzzle** and the **solution** in ASCII. Optional `--seed` for reproducibility.

## Install & Run

```bash
# In this folder
npm install
npm run build

# Generate one puzzle to stdout
node dist/cli.js
# or after global link
npm link
sudoku-gen
```

## Options

- `--seed <value>`: make generation reproducible (same seed → same puzzle/solution).

## Design
- Generates a full valid solution (backtracking with random order).
- Carves clues by removing cells while **maintaining unique solvability** (counts solutions up to 2).
- ASCII output (text export ready).

