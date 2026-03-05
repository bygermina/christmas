import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const breakpointsJsonPath = path.resolve(__dirname, '../src/shared/lib/breakpoints.json');
const scssOutputPath = path.resolve(
  __dirname,
  '../src/shared/styles/design-system/_breakpoints.generated.scss',
);

const run = async () => {
  const raw = await readFile(breakpointsJsonPath, 'utf-8');
  const parsed = JSON.parse(raw);

  const requiredKeys = ['xs', 'sm', 'md', 'lg'];
  const hasAllKeys = requiredKeys.every((key) => typeof parsed[key] === 'number');

  if (!hasAllKeys) {
    throw new Error('breakpoints.json must contain numeric keys: xs, sm, md, lg');
  }

  const scss = `// This file is auto-generated. Do not edit manually.
$breakpoints: (
  xs: ${parsed.xs}px,
  sm: ${parsed.sm}px,
  md: ${parsed.md}px,
  lg: ${parsed.lg}px,
);
`;

  await writeFile(scssOutputPath, scss, 'utf-8');
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
