export default class Callable extends Function {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  constructor(call: unknown) {
    // eslint-disable-next-line no-constructor-return
    return Object.setPrototypeOf(call, new.target.prototype);
  }
}
