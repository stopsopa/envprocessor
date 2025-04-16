/**
 * Type guard to check if option has default property
 * @param {any} option - The option to check
 * @returns {option is { type: string, default: any }}
 */
function hasDefaultProperty(option) {
  return option && typeof option === 'object' && 'default' in option;
}

/**
 * @param {import('./generatorArgs.js').OptionsType} options
 * @param {import('./generatorArgs.js').Values} values
 */
function differenceDetected(options, values) {
  const keys = /** @type {(keyof typeof values)[]} */ (Object.keys(values));

  for (const key of keys) {
    const option = options[key];
    const c1 = typeof values[key] === option.type;
    
    // Use type guard to check for default property
    const c2 = hasDefaultProperty(option);
    
    // Now TypeScript knows that option.default exists if c2 is true
    const c3 = c2 && values[key] !== option.default;

    if (c1 && c2 && c3) {
      return false;
    }
  }

  return true;
}

export default differenceDetected;
