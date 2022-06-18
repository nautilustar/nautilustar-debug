import { ConsoleStyle } from './ConsoleStyle';
import { predefinedStyles } from './predefined-styles';
import { Style } from './Style';

export class CompositeConsoleStyle implements Style {
  private styles: ConsoleStyle[];

  constructor(...styles: ConsoleStyle[]) {
    this.styles = styles.concat([predefinedStyles.normal]);
  }

  applyTo(text: string): string {
    return this.styles
      .reduce((acc: string, cur: Style) => cur.applyTo(acc), text);
  }
}
