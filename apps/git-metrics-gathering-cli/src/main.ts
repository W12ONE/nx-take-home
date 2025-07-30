import { projectDiscovery } from '@nx-coding-assignment/project-discovery';
import { countMultiProjectContributors } from '@nx-coding-assignment/git-metrics';
import { updateReadmeSection } from '@nx-coding-assignment/readme-manager';
import { Command } from 'commander';

const program = new Command();

program
  .name('contributor-metrics')
  .description('Counts contributors who committed to multiple projects')
  .argument('<repoPath>', 'Path to the git repository')
  .action(async (repoPath) => {
    try {
      const projectPaths = projectDiscovery(repoPath);
      const count = await countMultiProjectContributors(projectPaths);
      updateReadmeSection(repoPath, count);
      console.log(`✅ Counted ${count} cross-project contributors`);
    } catch (error) {
      console.error(`❌ Error: ${(error as Error).message}`);
      process.exit(1);
    }
  });

program.parse();
