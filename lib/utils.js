const Logger = require('./logger');
const logger = new Logger();

/**
 * Utils Class.
* Provides utility methods for handling maliscious tasks and operations.
*
* @method sleep
* Asynchronously sleeps for a specified duration.
* @param {number} ms - The minimun duration to sleep in milliseconds.
* @param {number} [mx=null] - The maximum value for a random duration (optional).
* @returns {Promise<void>} A promise that resolves after the sleep duration.
*
* @method getRandomInt
* Generates a random integer within a specified range (inclusive).
* @param {number} min - The minimum value of the range.
* @param {number} max - The maximum value of the range.
* @returns {number} A random integer or false on error.
*/

class Utils {
    
    static async sleep(ms, mx = null) {
        if(!ms) {
            logger.error(`The minimum sleep time wasn't provided! Skipping!`);
            return;
        }

        if (mx !== null) {
            ms = this.getRandomInt(ms, mx);
        }
        logger.log(`Initiating sleep for: ${ms}`);
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    static getRandomInt(min = 0, max) {
        if(!min || !max) {
            logger.error('No parameter were specified!');
            return false;
        }

        const rand = Math.floor(Math.random() * (max - min + 1)) + min;
        logger.log(`A random int has been generated: ${rand}`);
        return rand;
    }
}

module.exports = Utils;