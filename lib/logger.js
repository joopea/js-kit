const fs = require('fs');
const path = require('path');

/**
 * Logger Class.
 * Provides basic logging functionality, supporting different log types.
 *
 * @method constructor
 * Sets up the logger which includes the filePath preparation and ensures the log file exists.
 *
 * @method initLogFiles
 * Initiate the log file path in this format: /path/to/log/directory/logType-YYYYMMDD.txt
 *
 * @method ensureLogFileExists
 * Checks whether the log file and its parent directory exist. If not, it creates them.
 *
 * @method log
 * Logs a message to the console and a log file.
 * @param {string} message - The message to be logged.
 * @param {string} [type=info] - The type of log.
 *
 * @method error
 * Logs error messages on file and in console.
 * @param {string} message - The error message to be logged.
 * @throws {Error} - Raise an error with the same message of input parameter
 *
 * @method warning
 * Logs warning messages on file.
 * @param {string} message - The warning message to be logged.
 *
 * @method report
 * Logs reporting messages on report file.
 * @param {string} message - The report message to be logged.
 *
 * @method logType
 * Determines and exports accurate log type string
 * @param {string} type - The type of log
 */
class Logger {
    constructor() {
        if (!Logger.instance) {
            Logger.instance = this;

            this.initLogFiles();
        }
        return Logger.instance;
    }

    initLogFiles() {
        const rootDir = process.cwd();

        const date = new Date();
        const logDateString = `${date.getFullYear()}${('0' + (date.getMonth() + 1)).slice(-2)}${('0' + date.getDate()).slice(-2)}`;

        this.logFile = path.join(rootDir, 'logs', `log_${logDateString}.txt`);
        this.reportFile = path.join(rootDir, 'logs', `report_${logDateString}.txt`);

        // Ensure the log file and its directory exist
        (async () => {
            await this.ensureLogFileExists();
        })();
    }

    async ensureLogFileExists() {
        const logDir = path.dirname(this.logFile);

        // Create the log directory if it doesn't exist
        if (!fs.existsSync(logDir)) {
            await fs.mkdirSync(logDir, {recursive: true});
        }

        // Create the log files if they don't exist
        if (!fs.existsSync(this.logFile)) {
            await fs.writeFileSync(this.logFile, '');
        }
        if (!fs.existsSync(this.reportFile)) {
            await fs.writeFileSync(this.reportFile, '');
        }
    }

    async log(message, type = 'info') {
        let logMessage;
        const logType = this.logType(type);

        if (type !== 'report') {
            const stack = new Error().stack;
            const callerLine = stack.split('\n')[3];
            const callerInfo = callerLine.match(/at (.*?) \((.*?)\)/);
            const methodName = callerInfo ? callerInfo[1].split('.').pop() : 'Global';
            const className = callerInfo ? callerInfo[1].split('.')[0] : 'Global';

            logMessage = `[${new Date().toISOString()}] ${logType.type} ${className}.${methodName}: ${message}`;
        } else {
            logMessage = `[${new Date().toISOString()}] ${message}`;
        }

        // Log to console
        if (logType.onConsole) {
            console.log(logMessage);
        }

        // Log to file
        await fs.appendFileSync(logType.file, logMessage + "\n", 'utf-8');
    }

    async error(message) {
        await this.log(message, 'error');
    }

    async warning(message) {
        await this.log(message, 'warning');
    }

    async report(message) {
        await this.log(message, 'report');
        await this.log(message, 'info');
    }

    logType(type = 'info') {
        let logType = {};

        switch (type.toLowerCase()) {
            case "error":
            case "e":
                logType = {
                    type: '[ERROR]',
                    report: true,
                    onConsole: true,
                    file: this.logFile
                }
                break;

            case "warning":
            case "w":
                logType = {
                    type: '[WARNING]',
                    report: false,
                    onConsole: false,
                    file: this.logFile
                }
                break;

            case "report":
            case "r":
                logType = {
                    type: '[INFO]',
                    report: true,
                    onConsole: false,
                    file: this.reportFile
                }
                break;

            case "info":
            case "i":
            default:
                logType = {
                    type: '[INFO]',
                    report: false,
                    onConsole: false,
                    file: this.logFile
                }
                break;
        }

        return logType;
    }
}

module.exports = Logger;
        