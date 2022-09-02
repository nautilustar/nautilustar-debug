import { ConfigLogger, Logger } from './Logger';
import { StyledConsoleFormatter } from './formatter';
import { ConsoleTransport } from './transport';

export function createLogger(config?: ConfigLogger): Logger {
  return new Logger(config);
}

export const log = createLogger({
  transporters: [
    new ConsoleTransport({
      formatter: new StyledConsoleFormatter(),
    }),
  ],
});

export default log;

export * from './formatter';
export * from './transport';
