const isNode = typeof global !== "undefined" && Object.prototype.toString.call(global.process) === "[object process]";

/**
 * Creates an error with a prefixed message
 */
const th = (msg: string): Error => new Error(`env.js: ${msg}`);

let env: Record<string, string>;

if (isNode) {
  env = (process?.env || {}) as Record<string, string>;
  /**
   * added
   * "lib": [
   *   "esnext",
   *   "dom" // that will get rid of issue TS2304: Cannot find name 'window'
   * ]
   * to tsconfig.json
   * since I want this lib to be polymorphic and work in both node.js and browser context
   */
} else if (typeof window !== "undefined") {
  env = (window?.process?.env || {}) as Record<string, string>;
} else {
  throw th("env.js: neither node.js nor browser context detected");
}

/**
 * For testing purposes, it is possible to substitute the object process.env with a custom object.
 */
export function mockEnv(map: Record<string, string>): void {
  env = map;
}

/**
 * Returns a complete object containing all environment variables
 */
export function all(): Record<string, string> {
  return env;
}

/**
 * Checks if an environment variable exists
 */
export function has(key: string): boolean {
  return typeof env[key] === "string";
}

/**
 * Retrieves an environment variable if it exists
 */
export function get(key: string): string | undefined {
  return env[key];
}

/**
 * Retrieves an environment variable or returns the specified default value if not found
 */
export function getDefault(key: string, defaultValue: string | number): string | number {
  if (has(key)) {
    return env[key];
  }
  return defaultValue;
}

/**
 * Retrieves an environment variable or throws an error if it doesn't exist
 */
export function getThrow(key: string, msg?: string): string {
  if (has(key)) {
    return env[key];
  }
  throw th(msg || `env var ${key} is not defined`);
}

const intTest = /^-?\d+$/;

/**
 * Retrieves an environment variable and converts it to an integer
 * Returns undefined if the variable doesn't exist
 * Throws an error if the variable exists but cannot be converted to a valid integer
 */
export function getIntegerThrowInvalid(key: string): number | undefined {
  if (has(key)) {
    // We know the value exists because has(key) returned true
    const value = get(key) as string;

    if (!intTest.test(value)) {
      throw th(`env var ${key} is not a number. value >${value}<, doesn't match regex >${intTest}<`);
    }

    const int = parseInt(value, 10);

    const strint = String(int);

    if (!intTest.test(strint)) {
      throw th(`parseInt(${value}, 10) returned ${strint}, doesn't match regex >${intTest}<`);
    }

    return int;
  }

  return undefined;
}

/**
 * If not defined or not able to cast to int, return defaultValue.
 */
export function getIntegerDefault(key: string, defaultValue: number): number {
  try {
    const val = getIntegerThrowInvalid(key);

    if (typeof val === "number") {
      return val;
    }

    return defaultValue;
  } catch (e) {
    return defaultValue;
  }
}

/**
 * Retrieves an environment variable, converts it to an integer, and returns the value.
 * Throws an error if the variable is not defined or cannot be converted to a valid integer.
 */
export function getIntegerThrow(key: string): number {
  const val = getIntegerThrowInvalid(key);

  if (typeof val === "number") {
    return val;
  }

  throw th(`env var ${key} is not defined or is not a number`);
}
