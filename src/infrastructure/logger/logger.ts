class Logger {

    constructor() {
    }


    public info(message: string): void {
        const timestamp = new Date().toISOString();
        const logMessage = `[${timestamp}] [INFO] ${message}`;
        console.log(`\x1b[32m${logMessage}\x1b[0m`);
    }

    public warn(message: string): void {
        const timestamp = new Date().toISOString();
        const logMessage = `[${timestamp}] [WARN] ${message}`;
        console.log(`\x1b[33m${logMessage}\x1b[0m`);
    }

    public error(message: string): void {
        const timestamp = new Date().toISOString();
        const logMessage = `[${timestamp}] [ERROR] ${message}`;
        console.log(`\x1b[31m${logMessage}\x1b[0m`);
    }
}

export default new Logger();
