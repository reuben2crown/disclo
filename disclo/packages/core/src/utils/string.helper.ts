// Extend the global String interface with case conversion and utility methods
declare global {
  interface String {
    toTitleCase(): string;
    toSentenceCase(): string;
    toCamelCase(): string;
    toKebabCase(): string;
    toSnakeCase(): string;
    toPascalCase(): string;
    toSlug(): string;
    toArray(): string[];
  }
}

/**
 * Convert string to Title Case - capitalizes the first letter of each word
 * @example
 * "hello world".toTitleCase()          // "Hello World"
 * "HELLO WORLD".toTitleCase()          // "Hello World"
 * "hello-world".toTitleCase()          // "Hello-World"
 */
if (!String.prototype.toTitleCase) {
  String.prototype.toTitleCase = function (this: string): string {
    return this.toLowerCase().replace(/\b\w/g, (match) =>
      match.toUpperCase()
    );
  };
}

/**
 * Convert string to Sentence Case - capitalizes only the first letter of the entire string
 * Converts underscores and hyphens to spaces
 * @example
 * "hello world".toSentenceCase()       // "Hello world"
 * "HELLO WORLD".toSentenceCase()       // "Hello world"
 * "hello_world".toSentenceCase()       // "Hello world"
 * "hello-world".toSentenceCase()       // "Hello world"
 */
if (!String.prototype.toSentenceCase) {
  String.prototype.toSentenceCase = function (this: string): string {
    return this.toLowerCase()
      .replace(/[_-]+/g, ' ')
      .trim()
      .replace(/^./, (match) => match.toUpperCase());
  };
}

/**
 * Convert string to camelCase - first word lowercase, subsequent words capitalized, no separators
 * Handles underscores, hyphens, spaces, and camelCase/PascalCase as separators
 * @example
 * "hello world".toCamelCase()          // "helloWorld"
 * "Hello-World".toCamelCase()          // "helloWorld"
 * "hello_world".toCamelCase()          // "helloWorld"
 * "HelloWorld".toCamelCase()           // "helloWorld"
 */
if (!String.prototype.toCamelCase) {
  String.prototype.toCamelCase = function (this: string): string {
    return this
      .replace(/([a-z])([A-Z])/g, '$1_$2')
      .replace(/([A-Z])([A-Z][a-z])/g, '$1_$2')
      .toLowerCase()
      .replace(/[_\-\s]+(.)?/g, (_, char) => char ? char.toUpperCase() : '')
      .replace(/^./, (match) => match.toLowerCase());
  };
}

/**
 * Convert string to kebab-case - all lowercase with hyphens as separators
 * Handles camelCase, PascalCase, underscores, and spaces
 * @example
 * "hello world".toKebabCase()          // "hello-world"
 * "HelloWorld".toKebabCase()           // "hello-world"
 * "hello_world".toKebabCase()          // "hello-world"
 * "helloWorld".toKebabCase()           // "hello-world"
 */
if (!String.prototype.toKebabCase) {
  String.prototype.toKebabCase = function (this: string): string {
    return this
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
      .toLowerCase()
      .replace(/[_\s]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-/, '');
  };
}

/**
 * Convert string to snake_case - all lowercase with underscores as separators
 * Handles camelCase, PascalCase, hyphens, and spaces
 * @example
 * "hello world".toSnakeCase()          // "hello_world"
 * "HelloWorld".toSnakeCase()           // "hello_world"
 * "hello-world".toSnakeCase()          // "hello_world"
 * "helloWorld".toSnakeCase()           // "hello_world"
 */
if (!String.prototype.toSnakeCase) {
  String.prototype.toSnakeCase = function (this: string): string {
    return this
      .replace(/([a-z])([A-Z])/g, '$1_$2')
      .replace(/([A-Z])([A-Z][a-z])/g, '$1_$2')
      .toLowerCase()
      .replace(/[-\s]+/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_/, '');
  };
}

/**
 * Convert string to PascalCase - capitalize first letter of each word, no separators
 * Similar to camelCase but first letter is also capitalized
 * Handles underscores, hyphens, spaces, and camelCase as separators
 * @example
 * "hello world".toPascalCase()         // "HelloWorld"
 * "hello-world".toPascalCase()         // "HelloWorld"
 * "hello_world".toPascalCase()         // "HelloWorld"
 * "helloWorld".toPascalCase()          // "HelloWorld"
 */
if (!String.prototype.toPascalCase) {
  String.prototype.toPascalCase = function (this: string): string {
    return this
      .replace(/([a-z])([A-Z])/g, '$1_$2')
      .replace(/([A-Z])([A-Z][a-z])/g, '$1_$2')
      .toLowerCase()
      .replace(/[_\-\s]+(.)?/g, (_, char) => char ? char.toUpperCase() : '')
      .replace(/^./, (match) => match.toUpperCase());
  };
}

/**
 * Convert string to URL-friendly slug
 * All lowercase with hyphens, removes special characters except numbers
 * Useful for creating URL-safe identifiers from user input or titles
 * @example
 * "Hello World!".toSlug()              // "hello-world"
 * "Product & Service".toSlug()         // "product-service"
 * "Price: $50".toSlug()                // "price-50"
 * "hello_world".toSlug()               // "hello-world"
 * "CamelCase".toSlug()                 // "camel-case"
 */
if (!String.prototype.toSlug) {
  String.prototype.toSlug = function (this: string): string {
    return this
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
      .toLowerCase()
      .replace(/[_\s]+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-')
      .replace(/^-|-$/, '');
  };
}

/**
 * Convert comma-separated string to array of trimmed strings
 * Removes empty strings and whitespace from results
 * Useful for parsing comma-separated input fields from forms
 * @example
 * "apple, banana, cherry".toArray()   // ["apple", "banana", "cherry"]
 * "a, , b".toArray()                   // ["a", "b"]
 * "  spaces  , around  ".toArray()     // ["spaces", "around"]
 * "single".toArray()                   // ["single"]
 */
if (!String.prototype.toArray) {
  String.prototype.toArray = function (this: string): string[] {
    if (typeof this !== "string") return [];
    return this.split(",").map((s) => s.trim()).filter(Boolean);
  };
}

export { };

// 
export function countWords(text: string): number {
  const t = text.trim();
  if (!t) return 0;
  return t.split(/\s+/).filter(Boolean).length;
}
