/**
 * Professional Structured Logging - TypeSpec Go Emitter
 *
 * PRODUCTION LOGGING: Replaces all console.log statements
 * ZERO ANY TYPES: Type-safe logging throughout
 * OBSERVABILITY: Structured logs for monitoring systems
 */

export enum LogLevel {
  DEBUG = "debug",
  INFO = "info",
  WARN = "warn",
  ERROR = "error",
}

export enum LogContext {
  TYPESPEC_INTEGRATION = "typespec-integration",
  GO_GENERATION = "go-generation",
  ERROR_HANDLING = "error-handling",
  BDD_FRAMEWORK = "bdd-framework",
  DOMAIN_VALIDATION = "domain-validation",
  SYSTEM_PERFORMANCE = "system-performance",
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  context: LogContext;
  message: string;
  details?: Record<string, unknown>;
  errorId?: string;
  correlationId?: string;
}

/**
 * Professional Structured Logger
 * ZERO ANY TYPES: Type-safe logging with observability
 */
export class StructuredLogger {
  private static correlationId: string = crypto.randomUUID();

  /**
   * Create structured log entry
   * TYPE SAFETY: Enforced logging structure
   */
  private static createLogEntry(
    level: LogLevel,
    context: LogContext,
    message: string,
    details?: Record<string, unknown>,
    errorId?: string,
  ): LogEntry {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      context,
      message,
      correlationId: this.correlationId,
      ...(details && { details }),
      ...(errorId && { errorId }),
    };
    return entry;
  }

  /**
   * Log debug message
   * DEVELOPMENT: Detailed debugging information
   */
  static debug(context: LogContext, message: string, details?: Record<string, unknown>): void {
    const entry = this.createLogEntry(LogLevel.DEBUG, context, message, details);
    this.writeLog(entry);
  }

  /**
   * Log info message
   * PRODUCTION: General operational information
   */
  static info(context: LogContext, message: string, details?: Record<string, unknown>): void {
    const entry = this.createLogEntry(LogLevel.INFO, context, message, details);
    this.writeLog(entry);
  }

  /**
   * Log warning message
   * OPERATIONAL: Potential issues that need attention
   */
  static warn(context: LogContext, message: string, details?: Record<string, unknown>): void {
    const entry = this.createLogEntry(LogLevel.WARN, context, message, details);
    this.writeLog(entry);
  }

  /**
   * Log error message
   * PRODUCTION: Error information for monitoring
   */
  static error(
    context: LogContext,
    message: string,
    details?: Record<string, unknown>,
    errorId?: string,
  ): void {
    const entry = this.createLogEntry(LogLevel.ERROR, context, message, details, errorId);
    this.writeLog(entry);
  }

  /**
   * Generic log level writer - eliminates duplication
   * SINGLE SOURCE OF TRUTH: Centralized log level handling
   */
  private static writeLogLevel(entry: LogEntry): void {
    const logJson = JSON.stringify(entry);

    switch (entry.level) {
      case LogLevel.DEBUG:
        console.debug(logJson);
        break;
      case LogLevel.INFO:
        console.info(logJson);
        break;
      case LogLevel.WARN:
        console.warn(logJson);
        break;
      case LogLevel.ERROR:
        console.error(logJson);
        break;
    }
  }

  /**
   * Write structured log to output
   * OBSERVABILITY: JSON format for log aggregation
   */
  private static writeLog(entry: LogEntry): void {
    this.writeLogLevel(entry);
  }

  /**
   * Set correlation ID for request tracking
   * OBSERVABILITY: Track operations across systems
   */
  static setCorrelationId(id: string): void {
    this.correlationId = id;
  }

  /**
   * Get current correlation ID
   * DEBUGGING: Debug correlation tracking
   */
  static getCorrelationId(): string {
    return this.correlationId;
  }

  /**
   * Generic context factory - eliminates duplication
   * SINGLE SOURCE OF TRUTH: Centralized context logger creation
   */
  private static createContextLogger(context: LogContext) {
    return {
      debug: (message: string, details?: Record<string, unknown>) =>
        this.debug(context, message, details),
      info: (message: string, details?: Record<string, unknown>) =>
        this.info(context, message, details),
      warn: (message: string, details?: Record<string, unknown>) =>
        this.warn(context, message, details),
      error: (message: string, details?: Record<string, unknown>, errorId?: string) =>
        this.error(context, message, details, errorId),
    };
  }

  /**
   * Create child logger with specific context
   * COMPOSABLE: Context-specific loggers
   */
  static withContext(context: LogContext) {
    return this.createContextLogger(context);
  }
}

/**
 * Development logger with human-readable output
 * DEVELOPMENT: Pretty-printed logs for development
 */
export class DevelopmentLogger {
  private static contextEmojis: Record<LogContext, string> = {
    [LogContext.TYPESPEC_INTEGRATION]: "🔍",
    [LogContext.GO_GENERATION]: "🔧",
    [LogContext.ERROR_HANDLING]: "❌",
    [LogContext.BDD_FRAMEWORK]: "🧪",
    [LogContext.DOMAIN_VALIDATION]: "📋",
    [LogContext.SYSTEM_PERFORMANCE]: "⚡",
  };

  /**
   * Generic development log level writer - eliminates duplication
   * SINGLE SOURCE OF TRUTH: Centralized development log handling
   */
  private static writeDevelopmentLogLevel(level: LogLevel, output: string): void {
    switch (level) {
      case LogLevel.DEBUG:
        console.log(output);
        break;
      case LogLevel.INFO:
        console.log(output);
        break;
      case LogLevel.WARN:
        console.warn(output);
        break;
      case LogLevel.ERROR:
        console.error(output);
        break;
    }
  }

  /**
   * Pretty log development message
   * DEVELOPMENT: Human-readable debugging output
   */
  static log(
    level: LogLevel,
    context: LogContext,
    message: string,
    details?: Record<string, unknown>,
  ): void {
    const emoji = this.contextEmojis[context] || "📝";
    const timestamp = new Date().toLocaleTimeString();
    const contextStr = context.replace("-", " ");

    let output = `${timestamp} ${emoji} [${contextStr}] ${message}`;

    if (details && Object.keys(details).length > 0) {
      output += `\n   Details: ${JSON.stringify(details, null, 2)}`;
    }

    this.writeDevelopmentLogLevel(level, output);
  }
}

/**
 * Environment-aware logger
 * PRODUCTION: Uses structured logging in production
 * DEVELOPMENT: Uses pretty-printed logging in development
 */
export class Logger {
  private static isDevelopment = process.env.NODE_ENV !== "production";

  /**
   * Generic logger method factory - eliminates duplication
   * SINGLE SOURCE OF TRUTH: Centralized environment-aware logging
   */
  private static logWithLevel(
    level: LogLevel,
    context: LogContext,
    message: string,
    details?: Record<string, unknown>,
    errorId?: string,
  ): void {
    if (this.isDevelopment) {
      DevelopmentLogger.log(level, context, message, details);
    } else {
      switch (level) {
        case LogLevel.DEBUG:
          StructuredLogger.debug(context, message, details);
          break;
        case LogLevel.INFO:
          StructuredLogger.info(context, message, details);
          break;
        case LogLevel.WARN:
          StructuredLogger.warn(context, message, details);
          break;
        case LogLevel.ERROR:
          StructuredLogger.error(context, message, details, errorId);
          break;
      }
    }
  }

  static debug(context: LogContext, message: string, details?: Record<string, unknown>): void {
    this.logWithLevel(LogLevel.DEBUG, context, message, details);
  }

  static info(context: LogContext, message: string, details?: Record<string, unknown>): void {
    this.logWithLevel(LogLevel.INFO, context, message, details);
  }

  static warn(context: LogContext, message: string, details?: Record<string, unknown>): void {
    this.logWithLevel(LogLevel.WARN, context, message, details);
  }

  static error(
    context: LogContext,
    message: string,
    details?: Record<string, unknown>,
    errorId?: string,
  ): void {
    this.logWithLevel(LogLevel.ERROR, context, message, details, errorId);
  }

  static withContext(context: LogContext) {
    return {
      debug: (message: string, details?: Record<string, unknown>) =>
        this.debug(context, message, details),
      info: (message: string, details?: Record<string, unknown>) =>
        this.info(context, message, details),
      warn: (message: string, details?: Record<string, unknown>) =>
        this.warn(context, message, details),
      error: (message: string, details?: Record<string, unknown>, errorId?: string) =>
        this.error(context, message, details, errorId),
    };
  }
}
