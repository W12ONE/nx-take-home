import { readdirSync, statSync } from 'fs';

export function projectDiscovery(repoPath: string): string[] {
  const packagesPath = `${repoPath}/packages`;

  try {
    const entries = readdirSync(packagesPath);

    return entries.filter((entry) => {
      const entryPath = `${packagesPath}/${entry}`;
      return statSync(entryPath).isDirectory();
    });
  } catch (error) {
    throw new Error(
      `Failed to read packages directory at ${packagesPath}: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}
