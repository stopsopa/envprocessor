import { OptionsType, ValuesType } from "./generatorArgs.js";

function hasDefaultProperty(option: any): boolean {
  return option && typeof option === "object" && "default" in option;
}

function differenceDetected(options: OptionsType, values: ValuesType): boolean {
  const keys = Object.keys(values) as (keyof ValuesType)[];

  for (const key of keys) {
    const option = options[key];
    const c1 = typeof values[key] === option.type;

    // Use type guard to check for default property
    const c2 = hasDefaultProperty(option);

    // Now TypeScript knows that option.default exists if c2 is true
    const c3 = c2 && "default" in option && values[key] !== option.default;

    if (c1 && c2 && c3) {
      return false;
    }
  }

  return true;
}

export default differenceDetected;
