/**
 * Validation utilities
 */

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate URL format
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate JSON string
 */
export function isValidJSON(str: string): boolean {
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate number range
 */
export function isInRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max;
}

/**
 * Validate required field
 */
export function isRequired(value: unknown): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  return true;
}

/**
 * Validate minimum length
 */
export function hasMinLength(value: string, min: number): boolean {
  return value.length >= min;
}

/**
 * Validate maximum length
 */
export function hasMaxLength(value: string, max: number): boolean {
  return value.length <= max;
}

/**
 * Validate positive number
 */
export function isPositive(value: number): boolean {
  return value > 0;
}

/**
 * Validate integer
 */
export function isInteger(value: number): boolean {
  return Number.isInteger(value);
}

/**
 * Validate Redis key name
 */
export function isValidRedisKey(key: string): boolean {
  // Redis keys can contain any string, but we'll avoid special characters
  return /^[a-zA-Z0-9:_-]+$/.test(key);
}

/**
 * Validate MongoDB collection name
 */
export function isValidMongoCollectionName(name: string): boolean {
  // MongoDB collection names restrictions
  if (name.length === 0 || name.length > 64) return false;
  if (name.startsWith('system.')) return false;
  if (/[$]/.test(name)) return false;
  return true;
}

/**
 * Validate Cypher query (basic)
 */
export function isValidCypherQuery(query: string): boolean {
  // Basic validation - just check if it's not empty and contains MATCH, CREATE, or RETURN
  const trimmed = query.trim().toUpperCase();
  return (
    trimmed.length > 0 &&
    (trimmed.includes('MATCH') || trimmed.includes('CREATE') || trimmed.includes('RETURN'))
  );
}

/**
 * Sanitize string (remove special characters)
 */
export function sanitizeString(str: string): string {
  return str.replace(/[^\w\s-]/gi, '');
}
