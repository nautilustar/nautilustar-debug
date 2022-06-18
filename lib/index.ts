import { ConfigLogger, Logger } from './Logger';
import { StyledConsoleFormatter } from './formatter';
import { ConsoleTransport } from './transport';

export function createLogger(config?: ConfigLogger) {
  return new Logger(config);
}

const log = createLogger({
  transporters: [
    new ConsoleTransport({
      formatter: new StyledConsoleFormatter(),
    }),
  ],
});

export default log;

export * from './formatter';
export * from './transport';
