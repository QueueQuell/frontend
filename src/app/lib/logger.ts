/**
 * Logging Module
 * Provides request/response logging and debugging utilities
 */

/**
 * Log levels
 */
export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

/**
 * Log entry interface
 */
export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: Date;
  data?: any;
  context?: string;
}

/**
 * Logger configuration
 */
export interface LoggerConfig {
  enabled?: boolean;
  level?: LogLevel;
  includeTimestamp?: boolean;
  includeStackTrace?: boolean;
  maxLogs?: number;
}

/**
 * Logger class
 */
export class Logger {
  private enabled: boolean;
  private level: LogLevel;
  private includeTimestamp: boolean;
  private includeStackTrace: boolean;
  private logs: LogEntry[] = [];
  private maxLogs: number;

  constructor(config: LoggerConfig = {}) {
    this.enabled = config.enabled ?? (process.env.NODE_ENV === 'development');
    this.level = config.level || LogLevel.INFO;
    this.includeTimestamp = config.includeTimestamp ?? true;
    this.includeStackTrace = config.includeStackTrace ?? false;
    this.maxLogs = config.maxLogs || 100;
  }

  /**
   * Check if logging is enabled for a level
   */
  private shouldLog(level: LogLevel): boolean {
    if (!this.enabled) {
      return false;
    }

    const levels = [LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR];
    const currentLevelIndex = levels.indexOf(this.level);
    const messageLevelIndex = levels.indexOf(level);

    return messageLevelIndex >= currentLevelIndex;
  }

  /**
   * Format log message
   */
  private formatMessage(entry: LogEntry): string {
    const parts: string[] = [];

    if (this.includeTimestamp) {
      parts.push(`[${entry.timestamp.toISOString()}]`);
    }

    parts.push(`[${entry.level}]`);

    if (entry.context) {
      parts.push(`[${entry.context}]`);
    }

    parts.push(entry.message);

    return parts.join(' ');
  }

  /**
   * Add log entry
   */
  private addLog(entry: LogEntry): void {
    this.logs.push(entry);

    // Keep only the last maxLogs entries
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }
  }

  /**
   * Log debug message
   */
  debug(message: string, data?: any, context?: string): void {
    if (!this.shouldLog(LogLevel.DEBUG)) {
      return;
    }

    const entry: LogEntry = {
      level: LogLevel.DEBUG,
      message,
      timestamp: new Date(),
      data,
      context,
    };

    this.addLog(entry);
    console.debug(this.formatMessage(entry), data || '');
  }

  /**
   * Log info message
   */
  info(message: string, data?: any, context?: string): void {
    if (!this.shouldLog(LogLevel.INFO)) {
      return;
    }

    const entry: LogEntry = {
      level: LogLevel.INFO,
      message,
      timestamp: new Date(),
      data,
      context,
    };

    this.addLog(entry);
    console.info(this.formatMessage(entry), data || '');
  }

  /**
   * Log warning message
   */
  warn(message: string, data?: any, context?: string): void {
    if (!this.shouldLog(LogLevel.WARN)) {
      return;
    }

    const entry: LogEntry = {
      level: LogLevel.WARN,
      message,
      timestamp: new Date(),
      data,
      context,
    };

    this.addLog(entry);
    console.warn(this.formatMessage(entry), data || '');
  }

  /**
   * Log error message
   */
  error(message: string, error?: any, context?: string): void {
    if (!this.shouldLog(LogLevel.ERROR)) {
      return;
    }

    const entry: LogEntry = {
      level: LogLevel.ERROR,
      message,
      timestamp: new Date(),
      data: error,
      context,
    };

    this.addLog(entry);
    console.error(this.formatMessage(entry), error || '');

    if (this.includeStackTrace && error?.stack) {
      console.error(error.stack);
    }
  }

  /**
   * Log API request
   */
  logRequest(method: string, url: string, data?: any): void {
    this.debug(`→ ${method} ${url}`, data, 'API');
  }

  /**
   * Log API response
   */
  logResponse(method: string, url: string, status: number, data?: any, duration?: number): void {
    const durationStr = duration ? ` (${duration}ms)` : '';
    this.debug(`← ${method} ${url} ${status}${durationStr}`, data, 'API');
  }

  /**
   * Log API error
   */
  logError(method: string, url: string, error: any): void {
    this.error(`✗ ${method} ${url}`, error, 'API');
  }

  /**
   * Get all logs
   */
  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  /**
   * Get logs by level
   */
  getLogsByLevel(level: LogLevel): LogEntry[] {
    return this.logs.filter(log => log.level === level);
  }

  /**
   * Get logs by context
   */
  getLogsByContext(context: string): LogEntry[] {
    return this.logs.filter(log => log.context === context);
  }

  /**
   * Clear all logs
   */
  clearLogs(): void {
    this.logs = [];
  }

  /**
   * Export logs as JSON
   */
  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  /**
   * Enable logging
   */
  enable(): void {
    this.enabled = true;
  }

  /**
   * Disable logging
   */
  disable(): void {
    this.enabled = false;
  }

  /**
   * Set log level
   */
  setLevel(level: LogLevel): void {
    this.level = level;
  }

  /**
   * Check if logging is enabled
   */
  isEnabled(): boolean {
    return this.enabled;
  }
}

/**
 * Create a global logger instance
 */
let globalLogger: Logger | null = null;

/**
 * Get or create global logger instance
 */
export function getGlobalLogger(config?: LoggerConfig): Logger {
  if (!globalLogger) {
    globalLogger = new Logger(config);
  }
  return globalLogger;
}

/**
 * Reset global logger
 */
export function resetGlobalLogger(): void {
  globalLogger = null;
}

/**
 * Convenience functions using global logger
 */
export const logger = {
  debug: (message: string, data?: any, context?: string) => 
    getGlobalLogger().debug(message, data, context),
  
  info: (message: string, data?: any, context?: string) => 
    getGlobalLogger().info(message, data, context),
  
  warn: (message: string, data?: any, context?: string) => 
    getGlobalLogger().warn(message, data, context),
  
  error: (message: string, error?: any, context?: string) => 
    getGlobalLogger().error(message, error, context),
  
  logRequest: (method: string, url: string, data?: any) => 
    getGlobalLogger().logRequest(method, url, data),
  
  logResponse: (method: string, url: string, status: number, data?: any, duration?: number) => 
    getGlobalLogger().logResponse(method, url, status, data, duration),
  
  logError: (method: string, url: string, error: any) => 
    getGlobalLogger().logError(method, url, error),
};
