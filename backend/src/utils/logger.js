// Lightweight logger wrapper for backend
// - In production, info and debug logs are suppressed
// - Errors and warnings are always printed
const isProd = process.env.NODE_ENV === 'production';

function timestamp() {
  return new Date().toISOString();
}

const logger = {
  info: (...args) => {
    if (!isProd) console.log('[INFO]', timestamp(), ...args);
  },
  debug: (...args) => {
    if (!isProd) console.debug('[DEBUG]', timestamp(), ...args);
  },
  warn: (...args) => {
    console.warn('[WARN]', timestamp(), ...args);
  },
  error: (...args) => {
    console.error('[ERROR]', timestamp(), ...args);
  }
};

export default logger;
