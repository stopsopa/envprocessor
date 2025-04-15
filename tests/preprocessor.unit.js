import fs from "fs";
import path from "path";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { mkdirp } from "mkdirp";

// Mock dependencies before imports
vi.mock("fs");
vi.mock("path");

// Create a properly spied version of mkdirp

vi.mock("mkdirp", () => {
  return {
    mkdirp: {
      sync: vi.fn(),
    },
  };
});


// Import after mocks are defined
import {
  saveToFile,
  presentExtractedVariables,
  serializeInPrettierCompatibleWay,
  produceFileContent,
  findWidestKeyLen,
  produceRegex,
  pickEnvironmentVariables,
  getCredit,
  debugString,
  debugJson,
} from "../src/preprocessor.js";

describe("preprocessor", () => {
  describe("produceRegex", () => {
    it("should convert string to RegExp", () => {
      // Arrange
      const mask = "^TEST_";

      // Act
      const result = produceRegex(mask);

      // Assert
      expect(result).toBeInstanceOf(RegExp);
      expect(result.test("TEST_VAR")).toBe(true);
      expect(result.test("NOT_TEST")).toBe(false);
    });

    it("should throw error if mask contains $ character", () => {
      // Arrange
      const mask = "^TEST$";

      // Act & Assert
      expect(() => produceRegex(mask)).toThrow(
        "preprocessor.js error: mask should not containe '$' character, replace it with <dollar> tag instead",
      );
    });

    it("should replace <dollar> with $ in string mask", () => {
      // Arrange
      const mask = /test/;

      // Act
      const result = produceRegex(mask);

      // Assert
      expect(result).toBeInstanceOf(RegExp);
      expect(String(result)).toBe("/test/");
    });

    it("should replace <dollar> with $ in string mask", () => {
      // Arrange
      const mask = "/abc/def/i";

      // Act & Assert
      expect(() => produceRegex(mask)).toThrow(
        "stringToRegex error: general error: string '/abc/def/i' error: Error: param '/abc/def/i' should split to one or two segments",
      );
    });
  });

  it("findWidestKeyLen", async () => {
    const obj = {
      a: "b",
      ab: "c",
      abcd: "e",
      abc: "d",
    };

    const result = findWidestKeyLen(obj);

    expect(result).toEqual(4);
  });

  it("presentExtractedVariables 0", async () => {
    const obj = {
      a: "b",
      ab: "c",
      abcd: "e",
      abc: "d",
    };

    const result = presentExtractedVariables(obj, 0);

    expect(result).toEqual(
      `a    : 'b'
ab   : 'c'
abcd : 'e'
abc  : 'd'`,
    );
  });

  it("presentExtractedVariables default", async () => {
    const obj = {
      a: "b",
      ab: "c",
      abcd: "e",
      abc: "d",
    };

    const result = presentExtractedVariables(obj);

    expect(result).toEqual(
      `  a    : 'b'
  ab   : 'c'
  abcd : 'e'
  abc  : 'd'`,
    );
  });

  it("serializeInPrettierCompatibleWay", async () => {
    const obj = {};

    const result = serializeInPrettierCompatibleWay(obj);

    expect(result).toEqual(`{}`);
  });

  it("produceFileContent", async () => {
    const obj = {
      a: "b",
      ab: "c",
      abcd: "e",
      abc: "d",
    };

    const result = produceFileContent(obj);

    expect(result).toEqual(
      `window.process = {
  env: {
    "a": "b",
    "ab": "c",
    "abcd": "e",
    "abc": "d"
  }
};
`,
    );
  });
  describe("saveToFile", () => {
    beforeEach(() => {
      vi.clearAllMocks();

      // Mock implementation for path.dirname
      path.dirname.mockImplementation((file) => {
        return "/mock/directory";
      });

      // Default mock for fs.existsSync to return true
      fs.existsSync.mockReturnValue(true);

      // Mock for fs.writeFileSync
      fs.writeFileSync.mockImplementation(() => {});

      // Spy on console.log for the log function
      // vi.spyOn(console, "log").mockImplementation(() => {});
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("should save content to file", () => {
      // Arrange
      const testFile = "/test/file.js";
      const testContent = "console.log('test content');";

      // Act
      saveToFile(testFile, testContent);

      // Assert
      expect(path.dirname).toHaveBeenCalledWith(testFile);
      expect(fs.writeFileSync).toHaveBeenCalledWith(testFile, testContent);
    });

    it("should throw error if content is not a string", () => {
      // Arrange
      const testFile = "/test/file.js";
      const testObj = { TEST_VAR: "test_value" };

      // Act & Assert
      expect(() => saveToFile(testFile, testObj)).toThrow(
        "preprocessor.js error: saveToFile: content should be a string",
      );
    });

    it("should create directory if it does not exist", () => {
      // Arrange
      const mkdirp = require("mkdirp");
      const testFile = "/test/new/directory/file.js";
      const testContent = "console.log('test content');";

      // Mock fs.existsSync to return false for directory check and true for file check
      fs.existsSync.mockImplementation((path) => {
        if (path === "/mock/directory") {
          return false;
        }
        return true;
      });

      // Act
      saveToFile(testFile, testContent);

      // Assert
      expect(fs.writeFileSync).toHaveBeenCalled();
    });

    it("should throw error if file creation fails", () => {
      // Arrange
      const testFile = "/test/fail/file.js";
      const testContent = "console.log('test content');";

      // Mock fs.existsSync to return true for directory check and false for file check
      fs.existsSync.mockImplementation((path) => {
        if (path === testFile) {
          return false;
        }
        return true;
      });

      // Act & Assert
      expect(() => saveToFile(testFile, testContent)).toThrow(
        `preprocessor.js error: File '${testFile}' creation failed`,
      );
    });
  });

  describe("pickEnvironmentVariables", () => {
    it("basic", () => {
      const ENVPROCESSOR_EXPOSE_ENV_VARS =
        "/(^PUBLIC_|^FIREBASE_|^(PROJECT_NAME|NODE_API_PORT|GITHUB_SOURCES_PREFIX|GIPHY_API_KEY|PROD)<dollar>)/";

      const result = pickEnvironmentVariables(ENVPROCESSOR_EXPOSE_ENV_VARS, {
        PUBLIC_: "PUBLIC_1",
        PUBLIC_MORE: "PUBLIC_2",
        PUBLIC: "PUBLIC_3",
        PUBLEC_: "PUBLIC_4",
        PROJECT_NAME: "PROJECT_NAME_1",
        PROJECT_NAME_: "PROJECT_NAME_2",
        NODE_API_PORT: "NODE_API_PORT_1",
        NODE_API_PORT_: "NODE_API_PORT_2",
        GITHUB_SOURCES_PREFIX: "GITHUB_SOURCES_PREFIX_1",
        GIPHY_API_KEY: "GIPHY_API_KEY_1",
        PROD: "PROD_1",
        PROD_: "PROD_2",
      });

      expect(result).toEqual({
        PUBLIC_: "PUBLIC_1",
        PUBLIC_MORE: "PUBLIC_2",
        PROJECT_NAME: "PROJECT_NAME_1",
        NODE_API_PORT: "NODE_API_PORT_1",
        GITHUB_SOURCES_PREFIX: "GITHUB_SOURCES_PREFIX_1",
        GIPHY_API_KEY: "GIPHY_API_KEY_1",
        PROD: "PROD_1",
      });
    });
  });

  describe("getCredit", () => {
    it("should return package name and version in the expected format", () => {
      // Arrange
      const packageJson = require("../package.json");
      const expectedCredit = `${packageJson.name} v${packageJson.version}`;

      // Act
      const result = getCredit();

      // Assert
      expect(result).toBe(expectedCredit);
    });
  });

  describe("debugString", () => {
    it("should format debug information correctly", () => {
      // Arrange
      const envVarFiltered = {
        TEST_VAR: "test_value",
        ANOTHER_VAR: "another_value",
      };
      const files = ["/path/to/file1.js", "/path/to/file2.js"];
      const packageJson = require("../package.json");

      // Act
      const result = debugString(envVarFiltered, files);

      //   console.log(`>${result}<`)

      // Assert
      expect(result).toContain(`${packageJson.name} v${packageJson.version}`);
      const toArray = result.split("\n");
      toArray.shift();
      toArray.shift();
      const join = toArray.join("\n");
      expect(join).toMatchSnapshot();
      //   expect(result).toContain("TEST_VAR      : 'test_value'");
      //   expect(result).toContain("ANOTHER_VAR   : 'another_value'");
      //   expect(result).toContain("Generated files:");
      //   expect(result).toContain("    - /path/to/file1.js");
      //   expect(result).toContain("    - /path/to/file2.js");
    });

    it("should show 'none' when files array is empty", () => {
      // Arrange
      const envVarFiltered = {
        TEST_VAR: "test_value",
      };
      const files = [];
      const packageJson = require("../package.json");

      // Act
      const result = debugString(envVarFiltered, files);

      // Assert
      expect(result).toContain(`${packageJson.name} v${packageJson.version}`);
      expect(result).toContain("Generated files:");
      expect(result).toContain("    none");
    });

    it("should throw error if envVarFiltered is not an object", () => {
      // Arrange
      const envVarFiltered = "not an object";
      const files = ["/path/to/file.js"];

      // Act & Assert
      expect(() => debugString(envVarFiltered, files)).toThrow(
        "preprocessor.js error: debugString: envVarFiltered should be an object",
      );
    });

    it("should throw error if files is not an array", () => {
      // Arrange
      const envVarFiltered = { TEST_VAR: "test_value" };
      const files = "not an array";

      // Act & Assert
      expect(() => debugString(envVarFiltered, files)).toThrow(
        "preprocessor.js error: debugString: files should be an array",
      );
    });
  });

  describe("debugJson", () => {
    it("should return a properly structured JSON object with environment variables and files", () => {
      // Arrange
      const envVarFiltered = {
        TEST_VAR: "test_value",
        ANOTHER_VAR: "another_value",
      };
      const files = ["/path/to/file1.js", "/path/to/file2.js"];
      const packageJson = require("../package.json");
      const expectedCredit = `${packageJson.name} v${packageJson.version}`;

      // Act
      const result = debugJson(envVarFiltered, files);

      // Assert
      expect(result).toEqual({
        credit: expectedCredit,
        envVarFiltered: envVarFiltered,
        files: files,
      });
    });

    it("should throw error if envVarFiltered is not an object", () => {
      // Arrange
      const envVarFiltered = "not an object";
      const files = ["/path/to/file.js"];

      // Act & Assert
      expect(() => debugJson(envVarFiltered, files)).toThrow(
        "preprocessor.js error: debugJson: envVarFiltered should be an object",
      );
    });

    it("should throw error if files is not an array", () => {
      // Arrange
      const envVarFiltered = { TEST_VAR: "test_value" };
      const files = "not an array";

      // Act & Assert
      expect(() => debugJson(envVarFiltered, files)).toThrow(
        "preprocessor.js error: debugJson: files should be an array",
      );
    });

    it("should throw error if files array is empty", () => {
      // Arrange
      const envVarFiltered = { TEST_VAR: "test_value" };
      const files = [];

      // Act & Assert
      expect(() => debugJson(envVarFiltered, files)).toThrow(
        "preprocessor.js error: debugJson: files should contain at least one file",
      );
    });
  });
});
