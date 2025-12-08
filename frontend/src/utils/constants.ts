/**
 * Application constants
 */

// Database colors (matching the project palette)
export const DATABASE_COLORS = {
  postgres: {
    primary: '#006414',
    light: '#008519',
    dark: '#004D0F',
  },
  mongodb: {
    primary: '#009929',
    light: '#00B833',
    dark: '#007A21',
  },
  redis: {
    primary: '#EBED17',
    light: '#F5F649',
    dark: '#D4D412',
  },
  neo4j: {
    primary: '#5CCB5F',
    light: '#7DD780',
    dark: '#4AB34D',
  },
} as const;

// Database names
export const DATABASE_NAMES = {
  postgres: 'PostgreSQL',
  mongodb: 'MongoDB',
  redis: 'Redis',
  neo4j: 'Neo4j',
} as const;

// Database icons (emoji placeholders)
export const DATABASE_ICONS = {
  postgres: '🐘',
  mongodb: '🍃',
  redis: '⚡',
  neo4j: '🔵',
} as const;

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  LIMIT_OPTIONS: [10, 25, 50, 100],
} as const;

// Toast durations (in ms)
export const TOAST_DURATION = {
  SUCCESS: 3000,
  ERROR: 5000,
  INFO: 4000,
  WARNING: 4000,
} as const;

// Query stale times (in ms)
export const QUERY_STALE_TIME = {
  SHORT: 1000 * 30, // 30 seconds
  MEDIUM: 1000 * 60 * 5, // 5 minutes
  LONG: 1000 * 60 * 30, // 30 minutes
} as const;

// Local storage keys
export const STORAGE_KEYS = {
  THEME: 'app-theme',
  SIDEBAR_COLLAPSED: 'sidebar-collapsed',
  RECENT_ACTIVITIES: 'recent-activities',
  USER_PREFERENCES: 'user-preferences',
} as const;

// Date formats
export const DATE_FORMATS = {
  FULL: 'dd/MM/yyyy HH:mm:ss',
  DATE_ONLY: 'dd/MM/yyyy',
  TIME_ONLY: 'HH:mm:ss',
  SHORT: 'dd/MM HH:mm',
  ISO: "yyyy-MM-dd'T'HH:mm:ss",
} as const;

// HTTP status codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// Debounce delays (in ms)
export const DEBOUNCE_DELAY = {
  SEARCH: 500,
  RESIZE: 300,
  SCROLL: 200,
} as const;
