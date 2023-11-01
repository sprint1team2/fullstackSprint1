const fs = require('fs');
const myArgs = process.argv.slice(2);

// Add logging to the CLI project by using eventLogging
// load the logEvents module
const logEvents = require('./logEvents');
// define/extend an EventEmitter class
const EventEmitter = require('events');
class MyEmitter extends EventEmitter {};
// initialize an new emitter object
const myEmitter = new MyEmitter();
// add the listener for the logEvent
myEmitter.on('log', (event, level, msg) => logEvents(event, level, msg));

// The config file template
const { configjson } = require('./templates')

// Displays the config file
function displayConfig() {
    if(DEBUG) console.log('conigf.displayConfig()');
    fs.readFile(__dirname + "/json/config.json", (error, data) => {
        if(error) {
            myEmitter.emit('log', 'config.displayConfig()', 'ERROR', 'config.json read error');
            throw error;
        }
        console.log(JSON.parse(data));
    });
    myEmitter.emit('log', 'config.displayConfig()', 'INFO', 'display config.json displayed');
}

// Resets the config file to its default state
function resetConfig() {
    if(DEBUG) console.log('config.resetConfig()');
    let configdata = JSON.stringify(configjson, null, 2);
    fs.writeFile(__dirname + '/json/config.json', configdata, (error) => {
        if(error) {
            myEmitter.emit('log', 'config.resetConfig()', 'ERROR', 'config.json write error');
            throw error;
        }
        if(DEBUG) console.log('Config file reset to original state');
        myEmitter.emit('log', 'config.resetConfig()', 'INFO', 'config.json reset to original state.');
    });
}

// Changes a specific setting in the config file
function setConfig() {
    if(DEBUG) console.log('config.setConfig()');
    if(DEBUG) console.log(myArgs);

    let match = false;
    fs.readFile(__dirname + "/json/config.json", (error, data) => {
        if(error) {
            myEmitter.emit('log', 'config.setConfig()', 'ERROR', 'config.json read error');
            throw error;
        }       
        if(DEBUG) console.log(JSON.parse(data));
        let cfg = JSON.parse(data);
        for(let key of Object.keys(cfg)){
            if(key === myArgs[2]) {
                cfg[key] = myArgs[3];
                match = true;
            }
        }
        // If the passed arg is not found, throws an error
        if(!match) {
            console.log(`invalid key: ${myArgs[2]}, try another.`)
            myEmitter.emit('log', 'config.setConfig()', 'WARNING', `invalid key: ${myArgs[2]}`);
        }
        // Otherwise, writes the updated config file
        if(DEBUG) console.log(cfg);
        data = JSON.stringify(cfg, null, 2);
        fs.writeFile(__dirname + '/json/config.json', data, (error) => {
            if (error) {
                myEmitter.emit('log', 'config.setConfig()', 'ERROR', 'config.json write error');
                throw error;
            }
            if(DEBUG) console.log('Config file successfully updated.');
            myEmitter.emit('log', 'config.setConfig()', 'INFO', `config.json "${myArgs[2]}": updated to "${myArgs[3]}"`);
        });
    });

    myEmitter.emit('log', 'config.setConfig()', 'INFO', `config.json "${myArgs[2]}": updated to "${myArgs[3]}"`);
}

// The main config function
function configApp() {
    if(DEBUG) console.log('configApp()');

    // Switch based on the argument
    switch (myArgs[1]) {
    case '--show':
        if(DEBUG) console.log('--show');
        displayConfig();
        break;
    case '--reset':
        if(DEBUG) console.log('--reset');
        resetConfig();
        break;
    case '--set':
        if(DEBUG) console.log('--set');
        setConfig();
        break;
    case '--help':
    case '--h':
    default:
        // By default, displays the config.txt file
        fs.readFile(__dirname + "/views/config.txt", (error, data) => {
            if(error) {
                myEmitter.emit('log', 'configApp()', 'ERROR', 'config.txt read error');
                throw error;
            }          
            console.log(data.toString());
        });
    }
}

module.exports = {
    configApp,
}