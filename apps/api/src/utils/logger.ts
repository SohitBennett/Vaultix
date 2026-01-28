/**
 * Logger utility for consistent logging across the API
 */

enum LogLevel {
  INFO = 'INFO',
  SUCCESS = 'SUCCESS',
  WARN = 'WARN',
  ERROR = 'ERROR',
  DEBUG = 'DEBUG',
}

class Logger {
  private isDevelopment = process.env.NODE_ENV !== 'production';

  private formatMessage(level: LogLevel, message: string, meta?: any): string {
    const timestamp = new Date().toISOString();
    const metaStr = meta ? ` | ${JSON.stringify(meta)}` : '';
    return `[${timestamp}] [${level}] ${message}${metaStr}`;
  }

  private getColor(level: LogLevel): string {
    switch (level) {
      case LogLevel.INFO:
        return '\x1b[36m'; // Cyan
      case LogLevel.SUCCESS:
        return '\x1b[32m'; // Green
      case LogLevel.WARN:
        return '\x1b[33m'; // Yellow
      case LogLevel.ERROR:
        return '\x1b[31m'; // Red
      case LogLevel.DEBUG:
        return '\x1b[35m'; // Magenta
      default:
        return '\x1b[0m'; // Reset
    }
  }

  private log(level: LogLevel, message: string, meta?: any): void {
    const color = this.getColor(level);
    const reset = '\x1b[0m';
    const formattedMessage = this.formatMessage(level, message, meta);
    console.log(`${color}${formattedMessage}${reset}`);
  }

  info(message: string, meta?: any): void {
    this.log(LogLevel.INFO, message, meta);
  }

  success(message: string, meta?: any): void {
    this.log(LogLevel.SUCCESS, message, meta);
  }

  warn(message: string, meta?: any): void {
    this.log(LogLevel.WARN, message, meta);
  }

  error(message: string, error?: any): void {
    const meta = error instanceof Error 
      ? { message: error.message, stack: error.stack }
      : error;
    this.log(LogLevel.ERROR, message, meta);
  }

  debug(message: string, meta?: any): void {
    if (this.isDevelopment) {
      this.log(LogLevel.DEBUG, message, meta);
    }
  }

  // Request logging helper
  request(method: string, path: string, userId?: string): void {
    this.info(`${method} ${path}`, userId ? { userId } : undefined);
  }
}

export const logger = new Logger();
