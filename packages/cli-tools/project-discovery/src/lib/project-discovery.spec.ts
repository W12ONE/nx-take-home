import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Mock } from 'vitest';
import { projectDiscovery } from './project-discovery.js';

vi.mock('fs', async () => {
  const actual = await vi.importActual<typeof import('fs')>('fs');
  return {
    ...actual,
    readdirSync: vi.fn(),
    statSync: vi.fn(),
  };
});
import * as fs from 'fs';
const mockReaddirSync = fs.readdirSync as Mock;
const mockStatSync = fs.statSync as Mock;

(fs.readdirSync as typeof fs.readdirSync) = mockReaddirSync;
(fs.statSync as typeof fs.statSync) = mockStatSync;

describe('projectDiscovery', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns directories inside the packages folder', () => {
    mockReaddirSync.mockReturnValue(['a', 'proj-b', 'not-a-dir']);
    mockStatSync.mockImplementation((entryPath: string) => ({
      isDirectory: () => !entryPath.includes('not-a-dir'),
    }));

    const result = projectDiscovery('/mock/repo');

    expect(result).toEqual(['a', 'proj-b']);
  });

  it('throws an error when reading the packages folder fails', () => {
    mockReaddirSync.mockImplementation(() => {
      throw new Error('Boom');
    });

    expect(() => projectDiscovery('/mock/repo')).toThrowError(
      'Failed to read packages directory at /mock/repo/packages: Boom'
    );
  });
});
