const {
  saveToFile,
  presentExtractedVariables,
  serializeInPrettierCompatibleWay,
  returnProcessed,
  findWidestKeyLen,
} = require("../src/preprocessor.js");

const path = require("path");
const fs = require("fs");

// Mock dependencies
jest.mock("fs");
jest.mock("path");
jest.mock("mkdirp", () => ({
  mkdirp: {
    sync: jest.fn(),
  },
}));

describe("preprocessor", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Mock implementation for path.dirname
    path.dirname.mockImplementation((file) => {
      return "/mock/directory";
    });

    // Default mock for fs.existsSync to return true
    fs.existsSync.mockReturnValue(true);

    // Mock for fs.writeFileSync
    fs.writeFileSync.mockImplementation(() => {});

    // Spy on console.log for the log function
    // jest.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
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

  it("presentExtractedVariables", async () => {
    const obj = {
      a: "b",
      ab: "c",
      abcd: "e",
      abc: "d",
    };

    const result = presentExtractedVariables(obj);

    expect(result).toEqual(
      `    a   : 'b'
    ab  : 'c'
    abcd: 'e'
    abc : 'd'`,
    );
  });

  it("serializeInPrettierCompatibleWay", async () => {
    const obj = {};

    const result = serializeInPrettierCompatibleWay(obj);

    expect(result).toEqual(`{}`);
  });

  it("returnProcessed", async () => {
    const obj = {
      a: "b",
      ab: "c",
      abcd: "e",
      abc: "d",
    };

    const result = returnProcessed(obj);

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

  it("should save processed object to file", () => {
    // Arrange
    const testFile = "/test/file.js";
    const testObj = { TEST_VAR: "test_value" };
    const expectedContent = returnProcessed(testObj);

    // Act
    saveToFile(testFile, testObj);

    // Assert
    expect(path.dirname).toHaveBeenCalledWith(testFile);
    expect(fs.writeFileSync).toHaveBeenCalledWith(testFile, expectedContent);
    // expect(console.log).toHaveBeenCalledWith("preprocessor.js log: ", `Saving ${testFile}`);
  });

  it("should create directory if it does not exist", () => {
    // Arrange
    const mkdirp = require("mkdirp");
    const testFile = "/test/new/directory/file.js";
    const testObj = { TEST_VAR: "test_value" };

    // Mock fs.existsSync to return false for directory check and true for file check
    fs.existsSync.mockImplementation((path) => {
      if (path === "/mock/directory") {
        return false;
      }
      return true;
    });

    // Act
    saveToFile(testFile, testObj);

    // Assert
    expect(mkdirp.mkdirp.sync).toHaveBeenCalledWith("/mock/directory");
    expect(fs.writeFileSync).toHaveBeenCalled();
  });

  it("should throw error if file creation fails", () => {
    // Arrange
    const testFile = "/test/fail/file.js";
    const testObj = { TEST_VAR: "test_value" };

    // Mock fs.existsSync to return true for directory check and false for file check
    fs.existsSync.mockImplementation((path) => {
      if (path === testFile) {
        return false;
      }
      return true;
    });

    // Act & Assert
    expect(() => saveToFile(testFile, testObj)).toThrow(
      `preprocessor.js error: File '${testFile}' creation failed`,
    );
  });
});
