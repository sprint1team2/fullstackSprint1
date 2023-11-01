// Initializes the application

// Node.js common core global modules
const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');

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

// Getting some templates
const { folders, configjson, usagetxt, inittxt, configtxt, tokentxt } = require('./templates');

// Creates required folders, specified in templates.js
function createFolders() {
    if(DEBUG) console.log('init.createFolders()');
    myEmitter.emit('log', 'init.createFolders()', 'INFO', 'All folders should be created.');
    let mkcount = 0; // Keeps track of number of folders created
    folders.forEach(foldername => {
        if(DEBUG) console.log(foldername);
        try {
            if(!fs.existsSync(path.join(__dirname, foldername))) {
                fsPromises.mkdir(path.join(__dirname, foldername));
                mkcount++;
            }
        } catch (err) {
            myEmitter.emit('log', 'init.createFolders()', 'ERROR', 'Folder creation was unsuccessful.');
            console.log(err);
        }
    });
    // If no folders were needed to be created...
    if(mkcount === 0) {
        if(DEBUG) console.log('All folders already exist.');
        myEmitter.emit('log', 'init.createFolders()', 'INFO', 'All folders already existed.');
    // If only some folders were needed to be created...
    } else if (mkcount <= folders.length) {
        if(DEBUG) console.log(mkcount + ' of ' + folders.length + ' folders were created.');
        myEmitter.emit('log', 'init.createFolders()', 'INFO', mkcount + ' of ' + folders.length + ' folders needed to be created.');
    // If all folders were needed to be created
    } else {
        if(DEBUG) console.log('All folders successfully created.');
        myEmitter.emit('log', 'init.createFolders()', 'INFO', 'All folders successfully created.');
    }
};

// Creates the config.json and usage.txt files, based on the templates in templates.js
function createFiles() {
    if(DEBUG) console.log('init.createFiles()');
    myEmitter.emit('log', 'init.createFiles()', 'INFO', 'Files should be created.');
    try {
        let configdata = JSON.stringify(configjson, null, 2);
        if(!fs.existsSync(path.join(__dirname, './json/config.json'))) {
            fs.writeFile('./json/config.json', configdata, (err) => {
                if(err) {
                    console.log(err)
                    myEmitter.emit('log', 'init.createFiles()', 'ERROR', 'config.json creation was unsuccessful.');
                }
                else {
                    if(DEBUG) console.log('Data written to config file');
                    myEmitter.emit('log', 'init.createFiles()', 'INFO', 'config.json successfully created.');
                }
            });
        } else {
            myEmitter.emit('log', 'init.createFiles()', 'INFO', 'config.json already exists.'); 
        }

        if(!fs.existsSync(path.join(__dirname, './json/tokens.json'))) {
            fs.writeFile('./json/tokens.json', '[]', (err) => {
                if(err) {
                    console.log(err)
                    myEmitter.emit('log', 'init.createFiles()', 'ERROR', './json/tokens.json creation was unsuccessful.');
                } else {
                    if(DEBUG) console.log('tokens.json file created');
                    myEmitter.emit('log', 'init.createFiles()', 'INFO', './json/tokens.json successfully created.');
                }
            });
        } else {
            myEmitter.emit('log', 'init.createFiles()', 'INFO', './json/tokens.json already exists.');
        }

        if(!fs.existsSync(path.join(__dirname, './views/usage.txt'))) {
            fs.writeFile('./views/usage.txt', usagetxt, (err) => {
                if(DEBUG) console.log('Data written to usage.txt file');
                myEmitter.emit('log', 'init.createFiles()', 'INFO', './views/usage.txt successfully created.');
            });
        } else {
            myEmitter.emit('log', 'init.createFiles()', 'INFO', './views/usage.txt already exists.'); 
        }

        if(!fs.existsSync(path.join(__dirname, './views/token.txt'))) {
            fs.writeFile('./views/token.txt', tokentxt, (err) => {
                if(DEBUG) console.log('Data written to token.txt file');
                myEmitter.emit('log', 'init.createFiles()', 'INFO', './views/token.txt successfully created.');
            });
        } else {
            myEmitter.emit('log', 'init.createFiles()', 'INFO', './views/token.txt already exists.');
        }

        if(!fs.existsSync(path.join(__dirname, './views/config.txt'))) {
            fs.writeFile('./views/config.txt', configtxt, (err) => {
                if(DEBUG) console.log('Data written to config.txt file');
                myEmitter.emit('log', 'init.createFiles()', 'INFO', './views/config.txt successfully created.');
            });
        } else {
            myEmitter.emit('log', 'init.createFiles()', 'INFO', './views/config.txt already exists.');
        }

        if(!fs.existsSync(path.join(__dirname, './views/init.txt'))) {
            fs.writeFile('./views/init.txt', inittxt, (err) => {
                if(DEBUG) console.log('Data written to init.txt file');
                myEmitter.emit('log', 'init.createFiles()', 'INFO', './views/init.txt successfully created.');
            });
        } else {
            myEmitter.emit('log', 'init.createFiles()', 'INFO', './views/init.txt already exists.');
        }
    } catch(err) {
        myEmitter.emit('log', 'init.createFiles()', 'ERROR', 'File creation was unsuccessful.');
        console.log(err);
    }
};

const myArgs = process.argv.slice(2);

// The main initialization function
function initializeApp() {
    if(DEBUG) console.log('initializeApp()');
    myEmitter.emit('log', 'initializeApp()', 'INFO', 'init feature was called.');
    
    // Switch based on passed arguments
    switch (myArgs[1]) {
    case '--all':
        // Creates all folders and files
        if(DEBUG) console.log('--all createFolders() & createFiles()');
        createFolders();
        createFiles();
        myEmitter.emit('log', 'init --all', 'INFO', 'Create all folders and files.');
        break;
    case '--cat':
        // Creates all files
        if(DEBUG) console.log('--cat createFiles()');
        createFiles();
        myEmitter.emit('log', 'init --cat', 'INFO', 'Create all files.');
        break;
    case '--mk':
        // Creates all folders
        if(DEBUG) console.log('--mk createFolders()');
        createFolders();
        myEmitter.emit('log', 'init --mk', 'INFO', 'Create all folders.');
        break;
    case '--help':
    case '--h':
    default:
        // By default, displays the init.txt file
        fs.readFile(__dirname + "/views/init.txt", (error, data) => {
            if(error) throw error;              
            console.log(data.toString());
        });
    }
}

module.exports = {
    initializeApp,
}