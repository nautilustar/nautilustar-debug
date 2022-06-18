/* eslint-disable no-unused-vars */
import { Log } from '../Log';

export interface Formatter {
    format(data: Log.Data): string
}
