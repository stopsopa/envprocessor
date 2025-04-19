import { defineConfig } from "vitest/config";

// https://vitest.dev/guide/#configuring-vitest

// read more:
// https://vitest.dev/guide/filtering.html
// https://vitest.dev/guide/features.html#mocking
// https://www.youtube.com/watch?v=CSaH-rexUdE - run in browser & run in node
export default defineConfig({
  test: {
    name: 'test',
    environment: 'node', // that is actually default: 
    coverage: {
      // provider: "istanbul", // or 'v8'
      provider: "v8",
      reporter: ["text", "html"],
      include: ["src/**/*.{js,ts,jsx,tsx}"],
    },
    globals: true,
    include: ["**/*.{unit,spec}.?(c|m)[jt]s?(x)"],
    exclude: [
      // https://vitest.dev/config/#exclude
      "**/node_modules/**",
      // "jasmine/**",
      // "pages/encryptor/aes.jasmine.unit.js",
    ],
    typecheck: {
      enabled: true,
    },
  },
});
