import { config } from 'dotenv';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

const { parsed } = config({
  path: '.env.test',
  override: true,
  quiet: true,
});

export default defineConfig({
  test: {
    projects: [
      {
        plugins: [tsconfigPaths()],
        test: {
          name: 'unit',
          globals: true,
          include: ['test/unit/**/*.spec.ts'],
        },
      },
      {
        plugins: [tsconfigPaths()],
        test: {
          name: 'functional',
          globals: true,
          include: ['test/functional/**/*.spec.ts'],
          env: parsed,
          globalSetup: ['./test/functional/database.setup.ts'],
          setupFiles: ['./test/functional/database.transaction.ts'],
        },
      },
    ],
  },
});
