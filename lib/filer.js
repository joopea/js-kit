const fs = require('fs');
const path = require('path');
const util = require('util');
const access = util.promisify(fs.access);
const Logger = require('./logger');
const logger = new Logger();

/**
 * Filer Class.
 * Provides file and folder manipulation methods for handling asynchronous tasks regarding file operations.
 *
 * @method addProperty
 * Static method that creates properties for this class.
 * @param {string}
 * @param {string}
 * @param {string}
 *
 * @method doesFileExist
 * Checks if a file exists asynchronously.
 * @param {string} filePath - The path to the file.
 * @returns {Promise<boolean>} A promise that resolves to true if the file exists, false otherwise.
 *
 * @method readFileContent
 * Returns the content of a file.
 * @param {string} filePath - The path to the file.
 * @returns {string|null} The content of the file or null if there was an error reading the file.
 * Throws {Error}* Logs an error if there was an issue reading the file.
 *
 * @method getFileStats
 * Retrieves the statistics of a file.
 * @param {string} filePath - The path to the file.
 * @returns {Promise<fs.Stats>} A promise that resolves to the file statistics.
 *
 * @method removeFile
 * Removes a file asynchronously.
 * @param {string} filePath - The path to the file.
 * @returns {Promise<void>} A promise that resolves after the file is removed.
 * @throws {Error} Throws an error if there is an issue removing the file.
 *
 * @method writeToFile
 * Writes an string to a file asynchronously.
 * @param {string} stringToWrite - The string that is going to be written to the file.
 * @param {string} filePath - The path to the file.
 * @throws {Error} Throws an error if there is an issue removing the file.
 *
 * @method updateFile
 * Updates a file with new data if it exists and is older than a certain age.
 * If the file doesn't exist, it writes the file with new data.
 * @param {string} filePath - The path to the file.
 * @param {number} [timePeriod=null] - The age of the file (in seconds) to check against. If null, default is a week.
 * @param {function} [methodForNewData=null] - A method that generates new data. If null, the method writes an empty string to the file.
 * @returns {Promise<void>} A promise that resolves after the file has been updated.
 * @throws {Error} Throws an error if there was an issue updating the file.
 */

class Filer {

    constructor() {
        if (!Filer.instance) {
            Filer.instance = this;
        }
        return Filer.instance;
    }

    static addProperty(propertyName, dirName = null, fileName) {
        const rootDir = process.cwd();
        const fullPath = dirName ? path.join(rootDir, dirName, fileName) : path.join(rootDir, fileName);

        Object.defineProperty(Filer, propertyName, {
            value: fullPath,
            writable: false, // Make it read-only
            configurable: false,
            enumerable: true // Make it enumerable for easier listing
        });
    }

    static async doesFileExist(filePath) {
        try {
            await access(filePath);
            return true;
        } catch (error) {
            return false;
        }
    }

    static async readFileContent(filePath) {
        try {
            return fs.readFileSync(filePath, 'utf8');
        } catch (error) {
            logger.error(`${filePath}: ${error.message}`);
            return null;
        }
    }

    static async getFileStats(filePath) {
        return new Promise((resolve, reject) => {
            fs.stat(filePath, (err, stats) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(stats);
                }
            });
        });
    }

    static async removeFile(filePath) {
        fs.unlink(filePath, (error) => {
            if (error) {
                logger.error(`Removing ${filePath}: ${error.message}`);
            } else {
                logger.log(`${filePath} removed successfully`);
            }
        });
    }

    static async writeToFile(stringToWrite, filePath) {
        try {
            await fs.writeFileSync(filePath, stringToWrite, {encoding: 'utf8', flag: 'w'});
            logger.log(`New data has been written to ${filePath}`);
        } catch (error) {
            logger.error(`${filePath}: ${error.message}`);
        }
    }

    static async updateFile(filePath, timePeriod = null, generateDataMethod = null) {
        try {
            // Check if the file exists
            if (await Filer.doesFileExist(filePath)) {
                // Get the file's creation time
                const stats = await Filer.getFileStats(filePath);

                // Check if the file is older than the time period
                if (Math.floor(Date.now() - stats.mtime.getTime()) < timePeriod * 1000) {
                    // The file is younger than the time period. Do nothing.
                    logger.log(`File content '${filePath}' are young enough to skip.`);
                    return;
                }
            }

            logger.log(`File '${filePath}' is modified before ${timePeriod} seconds.`);

            // Generate new data using the provided method
            const newData = (generateDataMethod) ? await generateDataMethod() : '';

            await Filer.writeToFile(newData, filePath);
        } catch (error) {
            logger.error(`${filePath}: ${error.message}`);
        }
    }
}

/**
 * files
 * @property {string} log - This is a sample how to introduce the Filer properties
 */
const files = {
    log: {dirName: '../logs', fileName: 'log'},
};

/**
 * Create the class properties
 */
for (const [propertyName, {dirName, fileName}] of Object.entries(files)) {
    Filer.addProperty(propertyName, dirName, fileName);
}

module.exports = Filer;
