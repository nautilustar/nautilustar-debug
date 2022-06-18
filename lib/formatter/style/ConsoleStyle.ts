import * as util from 'node:util';
import { Style } from './Style';

export class ConsoleStyle implements Style {
  protected placeholder: string;

  constructor(start: number, end: number) {
    this.placeholder = `\u001b[${start}m%s\u001b[${end}m`;
  }

  applyTo(text: string): string {
    return util.format(this.placeholder, text);
  }
}
