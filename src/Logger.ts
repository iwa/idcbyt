import logger from 'pino';

let options: any = { level: 'trace' };
if (process.env.NODE_ENV !== 'production')
    options = { level: 'trace', prettyPrint: true };

const log = logger(options);

export default log;