# nautilustar-debug

Just another library for logging.

## Usage

Basic usage

### Importing
```js
// from ts files
import log from 'nautilustar-debug';

// from js files
const { log } = require('nautilustar-debug');
```
### Example
```js
// example.ts
import log from 'nautilustar-debug';

log('log message');
log.debug('debug message');
log.info('info message');
log.warn('warn message');
log.success('success message');
log.error('error message');
```

Will print something like:

![demo](demo.png?raw=true)