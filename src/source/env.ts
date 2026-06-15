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
 *
 * @param map - A record of environment variable names and their values.
 */
export function mockEnv(map: Record<string, string>): void {
  env = map;
}

/**
 * Returns a complete object containing all environment variables.
 *
 * @returns A record containing all environment variables.
 */
export function all(): Record<string, string> {
  return env;
}

/**
 * Checks if an environment variable exists.
 *
 * @param key - The name of the environment variable.
 * @returns True if the variable exists as a string, false otherwise.
 */
export function has(key: string): boolean {
  return typeof env[key] === "string";
}

/**
 * Retrieves an environment variable if it exists.
 *
 * @param key - The name of the environment variable.
 * @returns The value of the environment variable if it exists, otherwise undefined.
 */
export function get(key: string): string | undefined {
  return env[key];
}

/**
 * Retrieves an environment variable or returns the specified default value if not found.
 *
 * @param key - The name of the environment variable.
 * @param defaultValue - The value to return if the environment variable is not defined.
 * @returns The environment variable value or the provided default value.
 */
export function getDefault(key: string, defaultValue: string | number): string | number {
  if (has(key)) {
    return env[key];
  }
  return defaultValue;
}

/**
 * Retrieves an environment variable or throws an error if it doesn't exist.
 *
 * @param key - The name of the environment variable.
 * @param msg - An optional custom error message to throw.
 * @returns The value of the environment variable.
 * @throws Will throw an error if the environment variable is not defined.
 */
export function getThrow(key: string, msg?: string): string {
  if (has(key)) {
    return env[key];
  }
  throw th(msg || `env var ${key} is not defined`);
}

/**
 * Retrieves an environment variable, trims it, and throws an error if it's missing or empty.
 *
 * @param key - The name of the environment variable.
 * @returns The trimmed value of the environment variable.
 * @throws Will throw if the variable is not defined or is an empty string after trimming.
 */
export function getTrimmedThrow(key: string): string {
  const value = getThrow(key).trim();

  if (value === "") {
    throw th(`env var ${key} is defined but it is an empty string after trimming`);
  }

  return value;
}

/**
 * Retrieves an environment variable and validates it using a regex or a custom function.
 *
 * @param key - The name of the environment variable.
 * @param validator - A RegExp to test against or a function that returns an error message string (or throws) on failure.
 * @returns The original value of the environment variable if validation passes.
 * @throws Will throw if the variable is not defined, doesn't match the regex, or if the validator function returns a string or throws.
 */
export function getValidatedThrow(
  key: string,
  validator: RegExp | ((value: string) => string | null | undefined | void),
): string {
  const value = getThrow(key);

  if (validator instanceof RegExp) {
    if (!validator.test(value)) {
      throw th(`env var ${key} value >${value}< does not match regex >${validator}<`);
    }
  } else if (typeof validator === "function") {
    const result = validator(value);
    if (typeof result === "string") {
      throw th(result);
    }
  }

  return value;
}

/**
 * Retrieves an environment variable and validates it using a regex or a custom function.
 * If validation fails (regex doesn't match, function returns not null/undefined, or function throws)
 * or the variable is not found, it returns the specified default value.
 *
 * @param key - The name of the environment variable.
 * @param defaultValue - The value to return if the environment variable is not defined or validation fails.
 * @param validator - A RegExp to test against or a function that returns something not null/undefined or throws on failure.
 * @returns The value of the environment variable if validation passes, otherwise the default value.
 */
export function getDefaultIfInvalid(
  key: string,
  defaultValue: string | number,
  validator: RegExp | ((value: string) => any),
): string | number {
  try {
    const value = getThrow(key);

    if (validator instanceof RegExp) {
      if (!validator.test(value)) {
        return defaultValue;
      }
    } else if (typeof validator === "function") {
      const result = validator(value);
      if (result !== null && result !== undefined) {
        return defaultValue;
      }
    }

    return value;
  } catch (e) {
    return defaultValue;
  }
}

const intTest = /^-?\d+$/;

/**
 * Retrieves an environment variable and converts it to an integer.
 *
 * @param key - The name of the environment variable.
 * @returns The integer value if it exists and is valid, otherwise undefined.
 * @throws Will throw an error if the variable exists but cannot be converted to a valid integer.
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
 * Retrieves an environment variable as an integer, or returns a default value if not found or invalid.
 *
 * @param key - The name of the environment variable.
 * @param defaultValue - The value to return if the environment variable is not defined or invalid.
 * @returns The integer value or the default value.
 */
export function getIntegerDefault(key: string, defaultValue: number): number {
  try {
    const val = getIntegerThrowInvalid(key);

    if (typeof val === "number") {
      return val;
    }
  } catch (e) {}

  return defaultValue;
}

/**
 * Retrieves an environment variable, converts it to an integer, and returns the value.
 *
 * @param key - The name of the environment variable.
 * @returns The integer value of the environment variable.
 * @throws Will throw an error if the variable is not defined or cannot be converted to a valid integer.
 */
export function getIntegerThrow(key: string): number {
  const val = getIntegerThrowInvalid(key);

  if (typeof val === "number") {
    return val;
  }

  throw th(`env var ${key} is not defined or is not a number`);
}
