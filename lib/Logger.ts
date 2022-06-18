import * as util from 'node:util';
import * as callsites from 'error-callsites';
import { CallSite } from './CallSite';
import { Log } from './Log';
import { Transport } from './transport';

export type ConfigLogger = {
    transporters?: Transport[],
}

export class Logger {
  private transporters: Transport[];

  constructor(config?: ConfigLogger) {
    this.transporters = config?.transporters || [];
  }

  debug(...args: unknown[]) {
    this.log(Log.Level.DEBUG, ...args);
  }

  info(...args: unknown[]) {
    this.log(Log.Level.INFO, ...args);
  }

  warn(...args: unknown[]) {
    this.log(Log.Level.WARN, ...args);
  }

  error(...args: unknown[]) {
    this.log(Log.Level.ERROR, ...args);
  }

  protected log(level: Log.Level, ...args: unknown[]): void {
    const log: Log.Data = {
      date: new Date(),
      level,
      message: util.format(...args),
      stacktrace: this.currentStackTrace(args[0]),
    };

    for (let i = this.transporters.length; i-- > 0;) {
      this.transporters[i].log(log);
    }
  }

  private currentStackTrace(error: unknown): CallSite[] {
    if (error instanceof Error) {
      return callsites(error);
    }
    let rm = true;
    return callsites(new Error())
      // eslint-disable-next-line no-return-assign
      .filter((cs: CallSite) => !(rm = rm && cs.getFileName() === __filename));
  }
}
