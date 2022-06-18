import { ConsoleStyle } from './ConsoleStyle';

export const predefinedStyles = {
  normal: new ConsoleStyle(0, 0),

  bold: new ConsoleStyle(1, 21),
  dim: new ConsoleStyle(2, 22),
  italic: new ConsoleStyle(3, 23),
  underline: new ConsoleStyle(4, 24),
  blink: new ConsoleStyle(5, 25),
  reverse: new ConsoleStyle(7, 27),
  hidden: new ConsoleStyle(8, 28),
  strikethrough: new ConsoleStyle(9, 29),

  default: new ConsoleStyle(39, 39),
  black: new ConsoleStyle(30, 39),
  red: new ConsoleStyle(31, 39),
  green: new ConsoleStyle(32, 39),
  yellow: new ConsoleStyle(33, 39),
  blue: new ConsoleStyle(34, 39),
  magenta: new ConsoleStyle(35, 39),
  cyan: new ConsoleStyle(36, 39),
  lightGray: new ConsoleStyle(37, 39),
  darkGray: new ConsoleStyle(90, 39),
  lightRed: new ConsoleStyle(91, 39),
  lightGreen: new ConsoleStyle(92, 39),
  lightYellow: new ConsoleStyle(93, 39),
  lightBlue: new ConsoleStyle(94, 39),
  lightMagenta: new ConsoleStyle(95, 39),
  lightCyan: new ConsoleStyle(96, 39),
  gray: new ConsoleStyle(90, 39),
  grey: new ConsoleStyle(90, 39),
  white: new ConsoleStyle(97, 39),
};
