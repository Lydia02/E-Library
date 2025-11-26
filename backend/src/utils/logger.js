const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = process.env.NODE_ENV === 'development';

class Logger {
  // Log levels: error, warn, info, debug

  error(message, ...args) {
    // Always log errors
    console.error(`[ERROR] ${message}`, ...args);
  }

  warn(message, ...args) {
    // Log warnings in all environments
    console.warn(`[WARN] ${message}`, ...args);
  }

  info(message, ...args) {
    // Log info only in development
    if (!isProduction) {
      console.log(`[INFO] ${message}`, ...args);
    }
  }

  debug(message, ...args) {
    // Log debug only in development
    if (isDevelopment) {
      console.log(`[DEBUG] ${message}`, ...args);
    }
  }

  // Success messages (only in development)
  success(message, ...args) {
    if (!isProduction) {
      console.log(`[SUCCESS] ${message}`, ...args);
    }
  }
}

export default new Logger();
