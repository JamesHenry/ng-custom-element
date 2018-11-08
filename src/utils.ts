const DIR_PREFIX_REGEXP = /^((?:x|data)[:\-_])/;
const NGCE_ATTR_PREFIX = /^ngce[:\-_][^:\-_]+[:\-_]/;

export function camelToKebabCase(input: string): string {
  if (!input || !input.length) {
    return '';
  }
  return input.replace(/[A-Z]/g, m => `-${m.toLowerCase()}`);
}

export function getNormalizedPropOrEventName(originalAttrName: string): string {
  return originalAttrName
    .toLowerCase()
    .replace(DIR_PREFIX_REGEXP, '')
    .replace(NGCE_ATTR_PREFIX, '')
    .replace(/_(.)/g, (_, g1) => g1.toUpperCase());
}

export function pascalToCamelCase(input: string): string {
  if (!input || !input.length) {
    return '';
  }
  return input[0].toLowerCase() + input.slice(1);
}

export function pascalToKebabCase(input: string): string {
  if (!input || !input.length) {
    return '';
  }
  return camelToKebabCase(pascalToCamelCase(input));
}
