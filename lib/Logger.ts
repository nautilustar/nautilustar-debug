import * as util from 'node:util';
import * as callsites from 'error-callsites';
import { CallSite } from './CallSite';
import { Log } from './Log';
import { Transport } from './transport';
import Callable from './Callable';

export type ConfigLogger = {
  transporters?: Transport[],
}

export class Logger extends Callable {
  transporters: Transport[];

  constructor(config?: ConfigLogger) {
    super((message: unknown, ...args: unknown[]) => this.log(Log.Level.LOG, message, ...args));
    this.transporters = config?.transporters || [];
  }

  debug(message: unknown, ...args: unknown[]) {
    this.log(Log.Level.DEBUG, message, ...args);
  }

  info(message: unknown, ...args: unknown[]) {
    this.log(Log.Level.INFO, message, ...args);
  }

  warn(message: unknown, ...args: unknown[]) {
    this.log(Log.Level.WARN, message, ...args);
  }

  success(message: unknown, ...args: unknown[]) {
    this.log(Log.Level.SUCCESS, message, ...args);
  }

  error(message: unknown, ...args: unknown[]) {
    this.log(Log.Level.ERROR, message, ...args);
  }

  protected log(level: Log.Level, message: unknown, ...args: unknown[]): void {
    const log: Log.Data = {
      date: new Date(),
      level,
      message: util.format(message instanceof Error ? message.toString() : message, ...args),
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
