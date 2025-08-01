/* eslint-disable @nx/enforce-module-boundaries */

import { join } from 'path';
import { projectDiscovery } from '@nx-take-home/project-discovery';
import { countMultiProjectContributors } from '@nx-take-home/git-metrics';
import { updateReadmeSection } from '@nx-take-home/readme-manager';
import { Command } from 'commander';

const program = new Command();

export async function runCli(repoRoot: string) {
  console.time('⏱ Git contributor collection');
  try {
    const packagePaths = projectDiscovery(repoRoot).map((pkg) =>
      join('packages', pkg)
    );
    if (packagePaths.length === 0) {
      console.warn('⚠️ No valid packages found. Exiting.');
      process.exit(0);
    }
    const count = await countMultiProjectContributors(repoRoot, packagePaths);
    updateReadmeSection(repoRoot, count);
    console.log(`✅ Counted ${count} cross-project contributors`);
    console.timeEnd('⏱ Git contributor collection');
  } catch (error) {
    console.error(`❌ Error: ${(error as Error).message}`);
    process.exit(1);
  }
}

program
  .name('contributor-metrics')
  .description('Counts contributors who committed to multiple projects')
  .argument('<repoRoot>', 'Path to the git repository')
  .action(runCli);

// Only run if called from CLI directly (not during tests)
if (require.main === module) {
  program.parse();
}
