import { config } from 'dotenv';
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
        resolve: { tsconfigPaths: true },
        test: {
          name: 'unit',
          globals: true,
          include: ['test/unit/**/*.spec.ts'],
        },
      },
      {
        resolve: { tsconfigPaths: true },
        test: {
          name: 'functional',
          globals: true,
          include: ['test/functional/**/*.spec.ts'],
          env: parsed,
          globalSetup: ['./test/support/database/setup.ts'],
          setupFiles: ['./test/support/database/transaction.ts'],
        },
      },
    ],
  },
});
