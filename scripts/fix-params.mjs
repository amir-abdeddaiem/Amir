import { readFileSync, writeFileSync } from 'fs';

const files = [
  'd:/code/src/app/api/review/[id]/route.ts',
  'd:/code/src/app/api/services/[id]/route.ts',
  'd:/code/src/app/api/services/availability/[id]/route.ts',
  'd:/code/src/app/api/provider/[id]/route.ts',
  'd:/code/src/app/api/reservations/[id]/route.ts',
  'd:/code/src/app/api/provider/services/[id]/route.ts',
  'd:/code/src/app/api/lostfound/[id]/route.ts',
  'd:/code/src/app/api/animal/[id]/route.ts',
  'd:/code/src/app/api/admin/product/[id]/route.ts',
];

for (const file of files) {
  let src = readFileSync(file, 'utf8');

  // Step 1: change params type to Promise
  src = src.replace(
    /\{ params \}: \{ params: \{ id: string \} \}/g,
    '{ params }: { params: Promise<{ id: string }> }'
  );

  // Step 2: inside each async function body, after the opening brace add await params
  // We want to add `const { id } = await params;` right after the opening `{` of the function
  // and before `try {`. Only if `params.id` is used in the function.
  // Strategy: insert `const { id } = await params;\n` right after `{\n  try {` or `{\n  const`
  
  // Step 3: replace params.id with id (but only standalone params.id references)
  src = src.replace(/\bparams\.id\b/g, 'id');

  // Step 4: now we need to add `const { id } = await params;` before first use of `id`
  // in each exported function. Best approach: add it at the top of each try block.
  // But we need to be careful not to add it multiple times in the same block.
  // Pattern: `try {\n` -> `try {\n    const { id } = await params;\n`
  // Only if the function has a params parameter (checked by seeing if we changed params type).
  
  // Find all functions with promise params and add the await line
  // We'll do a targeted replacement: after each function signature that has Promise<{ id: string }>
  // find the next `try {` and insert the await there
  src = src.replace(
    /(\{ params \}: \{ params: Promise<\{ id: string \}> \}[^{]*\{[^{]*?try \{)/gs,
    (match) => {
      // Check if we already have the await line
      if (match.includes('const { id } = await params')) return match;
      return match.replace(/try \{/, 'try {\n    const { id } = await params;');
    }
  );

  writeFileSync(file, src, 'utf8');
  console.log('✓', file.split('/').slice(-3).join('/'));
}

console.log('\nDone!');
