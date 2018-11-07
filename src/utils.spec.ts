import {
  camelToKebabCase,
  pascalToCamelCase,
  pascalToKebabCase
} from './utils';

describe('ngCustomElement utils', () => {
  describe('camelToKebabCase()', () => {
    it.each`
      input         | expected
      ${'firstVal'} | ${'first-val'}
      ${''}         | ${''}
    `(
      'returns $expected when $input is formatted with camelToKebabCase()',
      ({ input, expected }) => {
        expect(camelToKebabCase(input)).toBe(expected);
      }
    );
  });

  describe('pascalToCamelCase()', () => {
    it.each`
      input             | expected
      ${'AnotherThing'} | ${'anotherThing'}
      ${''}             | ${''}
    `(
      'returns $expected when $input is formatted with pascalToCamelCase()',
      ({ input, expected }) => {
        expect(pascalToCamelCase(input)).toBe(expected);
      }
    );
  });

  describe('pascalToKebabCase()', () => {
    it.each`
      input       | expected
      ${'OhYeah'} | ${'oh-yeah'}
      ${''}       | ${''}
    `(
      'returns $expected when $input is formatted with pascalToKebabCase()',
      ({ input, expected }) => {
        expect(pascalToKebabCase(input)).toBe(expected);
      }
    );
  });
});
