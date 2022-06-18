import { Transport } from './Transport';
import { Formatter } from '../formatter';
import { Log } from '../Log';

export type ConfigConsoleTransport = {
    formatter: Formatter,
}

export class ConsoleTransport implements Transport {
  protected formatter: Formatter;

  constructor(config: ConfigConsoleTransport) {
    this.formatter = config.formatter;
  }

  log(data: Log.Data): void {
    const formatted = this.formatter.format(data);
    process.stdout.write(formatted);
  }
}
