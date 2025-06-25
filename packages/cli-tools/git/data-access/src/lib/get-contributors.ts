import { simpleGit } from 'simple-git';
import { resolve } from 'path';

export async function getContributorsForPath(
  path: string
): Promise<Set<string>> {
  const git = simpleGit(resolve(path));

  try {
    const log = await git.raw([
      'log',
      '--pretty=format:%ae', // email only
      '--',
      '.',
    ]);

    const emails = log
      .split('\n')
      .map((email) => email.trim())
      .filter((email) => email.length > 0);

    return new Set(emails);
  } catch (err) {
    throw new Error(
      `Failed to get contributors for ${path}: ${
        err instanceof Error ? err.message : String(err)
      }`
    );
  }
}
