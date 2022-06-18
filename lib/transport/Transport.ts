/* eslint-disable no-unused-vars */
import { Log } from '../Log';

export interface Transport {
    log(data: Log.Data): void
}
