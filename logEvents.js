// Used by nearly every other file to log events to a daily log file

// NPM installed Modules
const { format, getYear } = require('date-fns');
const { v4: uuid } = require('uuid');

// Node.js common core global modules
const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');

// Logs events to a daily log file
// Takes in an event, an event level, and a message
const logEvents = async (event, level, message) => {
    // Creates a log item using all the passed in arguments and the current date and time
    const dateTime = `${format(new Date(), 'yyyyMMdd\tHH:mm:ss')}`;
    const logItem = `${dateTime}\t${level}\t${event}\t${message}\t${uuid()}`;
    try {
        // Include year when managing log folders
        const currFolder = 'logs/' + getYear(new Date());
        if(!fs.existsSync(path.join(__dirname, 'logs/'))) {
            // if the parent directory logs/ doesn't exist, create it
            await fsPromises.mkdir(path.join(__dirname, 'logs/'));
            if(!fs.existsSync(path.join(__dirname, currFolder))) {
                // create the directory for the year ./logs/yyyy
                await fsPromises.mkdir(path.join(__dirname, currFolder));
            }
        }
        else {
            if(!fs.existsSync(path.join(__dirname, currFolder))) {
                // create the directory for the year ./logs/yyyy
                await fsPromises.mkdir(path.join(__dirname, currFolder));
            }
        }
        // Include todays date in filename
        if(DEBUG) console.log(logItem);
        const fileName = `${format(new Date(), 'yyyyMMdd')}` + '_events.log';
        await fsPromises.appendFile(path.join(__dirname, currFolder, fileName), logItem + '\n');
    } catch (err) {
        console.log(err);
    }
}

module.exports = logEvents;