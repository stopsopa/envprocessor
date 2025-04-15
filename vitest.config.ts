import { defineConfig } from "vitest/config";

// https://vitest.dev/guide/#configuring-vitest
export default defineConfig({
  test: {
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
  },
});
