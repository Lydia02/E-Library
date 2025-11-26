// Lightweight logger wrapper for frontend
// - In production (import.meta.env.PROD) info/debug are no-ops
const meta = typeof import.meta !== 'undefined' ? (import.meta as unknown as { env?: { PROD?: boolean } }) : undefined;
const isProd = !!meta?.env?.PROD;

export const info = (...args: unknown[]) => {
  if (!isProd) console.log('[INFO]', ...args);
};

export const debug = (...args: unknown[]) => {
  if (!isProd) console.debug('[DEBUG]', ...args);
};

export const warn = (...args: unknown[]) => {
  console.warn('[WARN]', ...args);
};

export const error = (...args: unknown[]) => {
  console.error('[ERROR]', ...args);
};

export default { info, debug, warn, error };
