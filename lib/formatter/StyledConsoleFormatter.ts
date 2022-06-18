import * as path from 'node:path';
import * as util from 'node:util';
import { Formatter } from './Formatter';
import { CallSite } from '../CallSite';
import { Log } from '../Log';
import { predefinedStyles } from './style/predefined-styles';
import { Style } from './style';

const base = process.cwd();

export type ConfigConsoleFormatter = {
    appName?: string,
    stackSizeLimit?: number,
}

export class StyledConsoleFormatter implements Formatter {
  private appName: string;

  private stackSizeLimit: number;

  constructor(config?: ConfigConsoleFormatter) {
    this.appName = config?.appName || path.basename(base);
    this.stackSizeLimit = config?.stackSizeLimit || 10;
  }

  format(data: Log.Data): string {
    const style = this.styleForLevel(data.level);
    const logName = this.formatLogName(data.stacktrace[0]);

    const toWrite = [
      ` ${style.applyTo(logName)} ${data.message}\n`,
    ];

    if (data.level === Log.Level.ERROR && data.stacktrace.length) {
      const marker = style.applyTo('  %s %s ');
      const markerSize = 8;

      const columnSize = process.stdout.columns || 80;
      const symbols = ['├─', '└─'];
      let line: string;
      let stack: CallSite;

      for (let i = 0, len = data.stacktrace.length; i < len; i += 1) {
        if (i === this.stackSizeLimit) {
          toWrite.push(util.format(`${marker}more %s\n`, symbols[1], '…', len - i));
          break;
        }

        stack = data.stacktrace[i];
        line = stack.toString();
        if (columnSize < line.length + markerSize) {
          // TODO: optimize it placing elipsis in the midle of file path
          line = `…${line.slice(0 - (columnSize - markerSize - 1))}`;
        }
        toWrite.push(`${util.format(marker, symbols[i < len - 1 ? 0 : 1], len - i - 1)}${line}\n`);
      }
    }

    return toWrite.join('');
  }

  protected styleForLevel(level: Log.Level): Style {
    switch (level) {
      case Log.Level.DEBUG:
        return predefinedStyles.darkGray;
      case Log.Level.LOG:
        return predefinedStyles.lightGray;
      case Log.Level.INFO:
        return predefinedStyles.blue;
      case Log.Level.WARN:
        return predefinedStyles.yellow;
      case Log.Level.ERROR:
        return predefinedStyles.red;
      case Log.Level.SUCCESS:
        return predefinedStyles.green;
      default:
        return predefinedStyles.normal;
    }
  }

  private formatLogName(stacktrace: CallSite): string {
    return util.format(
      '%s:%s:%s',
      this.appName,
      path.relative(base, stacktrace.getFileName()),
      stacktrace.getLineNumber(),
    );
  }
}
