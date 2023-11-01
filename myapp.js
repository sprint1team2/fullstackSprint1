// The main starting point for the app
// Used to initialize the app, configure the app and generate, update, search, count and list tokens

// A global variable for debugging
// If true, the console will print debug messages
global.DEBUG = true;

const fs = require("fs");
const { initializeApp } = require('./init.js');
const { configApp } = require('./config.js');
const { tokenApp } = require('./token.js')

const myArgs = process.argv.slice(2);
if(DEBUG) if(myArgs.length >= 1) console.log('the myapp.args: ', myArgs);

// Switch based on the argument passed
switch (myArgs[0]) {
    case 'init':
    case 'i':
        // Runs the initializeApp function (init.js)
        if(DEBUG) console.log(myArgs[0], ' - initialize the app.');
        initializeApp();
        break;
    case 'config':
    case 'c':
        // Runs the configApp function (config.js)
        if(DEBUG) console.log(myArgs[0], ' - display the configuration file');
        configApp();
        break;
    case 'token':
    case 't':
        // Runs the tokenApp function (token.js)
        if(DEBUG) console.log(myArgs[0], ' - generate a user token');
        tokenApp();
        break;  
    case '--help':
    case '--h':
    default:
        // By default, displays the usage.txt file
        fs.readFile(__dirname + "/usage.txt", (error, data) => {
            if(error) throw error;
            console.log(data.toString());
        });
}