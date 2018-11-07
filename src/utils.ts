export function camelToKebabCase(input: string): string {
  if (!input || !input.length) {
    return '';
  }
  return input.replace(/[A-Z]/g, m => `-${m.toLowerCase()}`);
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
