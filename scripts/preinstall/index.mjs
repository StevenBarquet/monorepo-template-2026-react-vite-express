// @ts-check
import { generateSecrets } from "./generate-secrets.mjs";
import { installPostCommit } from "./install-git-hooks.mjs";

async function main() {
  await installPostCommit();
  await generateSecrets('apps/backend/src/config/envs/secrets.ts');
  console.log(`
  '+-----------+'
  '| H O O K S |'
  '+-----------+'
  `);
}

main();
