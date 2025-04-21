import { OptionsType, ValuesType } from "./generatorArgs.js";

function hasDefaultProperty(option: any): boolean {
  return option && typeof option === "object" && "default" in option;
}

function differenceDetected(options: OptionsType, values: ValuesType): boolean {
  const keys = Object.keys(values) as (keyof ValuesType)[];

  for (const key of keys) {
    const option = options[key];

    if (typeof values[key] !== option.type) {
      return true;
    }

    if (hasDefaultProperty(option)) {
      if ("default" in option && values[key] !== option.default) {
        return true;
      }
    } else {
      if (typeof values[key] !== "undefined") {
        return true;
      }
    }
  }

  return false;
}

export default differenceDetected;
