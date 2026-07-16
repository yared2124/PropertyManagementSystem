# Frontend Fix Notes

## Current issue observed

- `npm run dev` fails with: `Missing script: "dev"`.

## Planned fixes

1. Add Vite scripts to `frontend/package.json`:
   - dev, build, preview.
2. Add basic start instructions:
   - `npm install`
   - `npm run dev`

## Next steps after scripting

- Start dev server and reproduce the original frontend runtime error.
- Fix any remaining issues (axios baseURL/env, routing, etc.)
