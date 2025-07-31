import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],

  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
  },

  transformIgnorePatterns: [
    "/node_modules/(?!(@apollo/client|other-esm-lib)/)",
  ],

  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.{ts,tsx,js,jsx}", "src/*.{ts,tsx,js,jsx}"],

  coverageThreshold: {
    global: {
      branches: 75,
      functions: 75,
      lines: 75,
      statements: 75,
    },
  },
};

export default createJestConfig(customJestConfig);
