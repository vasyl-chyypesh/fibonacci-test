/* eslint-disable no-console */
export class Logger {
  public static log(...args: any[]) {
    console.log(`[${new Date().toISOString()}]`, ...args);
  }

  public static error(...args: any[]) {
    console.error(`[${new Date().toISOString()}] Error:`, ...args);
  }
}
