/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
import { CallSite } from './CallSite';

export namespace Log {
    export enum Level {
        NONE = 0,
        ERROR = 1,
        WARN = 3,
        INFO = 7,
        LOG = 15,
        DEBUG = 31,
        SUCCESS = 63,
        ALL = 61,
    }

    export type Data = {
        date: Date,
        level: Level,
        message: string,
        stacktrace: CallSite[],
    }
}
