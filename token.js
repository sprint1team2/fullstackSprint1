// All token related functions are located in this file

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

// Node.js common core global modules
const fs = require('fs');
const path = require('path');

const crc32 = require('crc/crc32');
const { format } = require('date-fns');

const myArgs = process.argv.slice(2);

// Displays the token count
var tokenCount = function() {
    if(DEBUG) console.log('token.tokenCount()');
    return new Promise(function(resolve, reject) {
        fs.readFile(__dirname + '/json/tokens.json', 'utf-8', (error, data) => {
            if(error) {
                reject(error); 
                myEmitter.emit('log', 'token.tokenCount()', 'ERROR', 'token.json read error');
            } else {
                let tokens = JSON.parse(data);
                // Gets the number of tokens in the tokens.json file
                let count = Object.keys(tokens).length;
                console.log(`Current token count is ${count}.`);
                myEmitter.emit('log', 'token.tokenCount()', 'INFO', `Current token count is ${count}.`);
                resolve(count);
            };
        });
    });
};

// Generates a new token based on the given username
function newToken(username) {
    if(DEBUG) console.log('token.newToken()');

    // A new token template
    let newToken = JSON.parse(`{
        "created": "1969-01-31 12:30:00",
        "username": "username",
        "email": "user@example.com",
        "phone": "5556597890",
        "token": "token",
        "expires": "1969-02-03 12:30:00",
        "confirmed": "tbd"
    }`);

    let now = new Date();
    let expires = addDays(now, 3);

    // Building the new token
    newToken.created = `${format(now, 'yyyy-MM-dd HH:mm:ss')}`;
    newToken.username = username;
    newToken.token = crc32(username).toString(16);
    newToken.expires = `${format(expires, 'yyyy-MM-dd HH:mm:ss')}`;

    fs.readFile(__dirname + '/json/tokens.json', 'utf-8', (error, data) => {
        if(error) {
            myEmitter.emit('log', 'token.newToken()', 'ERROR', 'token.json read error');
            throw error;
        }
        let tokens = JSON.parse(data);
        tokens.push(newToken);
        userTokens = JSON.stringify(tokens);
        
        // Writing the new token to the tokens.json file
        fs.writeFile(__dirname + '/json/tokens.json', userTokens, (err) => {
            if (err) {
                myEmitter.emit('log', 'token.newToken()', 'ERROR', 'token.json write error');
                console.log(err);
            } else { 
                console.log(`New token ${newToken.token} was created for ${username}.`);
                myEmitter.emit('log', 'token.newToken()', 'INFO', `New token ${newToken.token} was created for ${username}.`);
            }
        })
        
    });
    return newToken.token;
}

// Updates an existing token
function updateToken(argv) {
    if (DEBUG) console.log('token.updateToken()');
    if (DEBUG) console.log(argv);
    // Reading the tokens.json file
    fs.readFile(__dirname + '/json/tokens.json', 'utf-8', (error, data) => {
        if (error) {
            myEmitter.emit('log', 'token.updateToken()', 'ERROR', 'tokens.json read error');
            throw error;
        }
        let tokens = JSON.parse(data);
        let objFound = false;
        let success = false;
        // Checks through each token to find a matching one
        tokens.forEach(obj => {
            // If the usernames match...
            if (obj.username === argv[3]) {
                if (DEBUG) console.log(obj);
                objFound = true;
                // Switch based on the option passed
                switch (argv[2].toLowerCase()) { 
                    case 'p':
                        // Updates the phone number
                        obj.phone = argv[4];
                        success = true;
                        break;
                    case 'e':
                        // Updates the email
                        obj.email = argv[4];
                        success = true;
                        break;
                    default:
                        // Default for all invalid options
                        console.log(`Invalid option: ${argv[2]}. Please use 'p' for phone or 'e' for email.`);
                        myEmitter.emit('log', 'token.updateToken()', 'WARNING', `invalid syntax, usage displayed.`);
                        return; 
                }
            }
        });
        if (!objFound) {
            console.log(`User ${argv[3]} not found.`);
            myEmitter.emit('log', 'token.updateToken()', 'WARNING', `User ${argv[3]} not found.`);
            return;
        } else if (success) {
            // If the update was successful, updates the tokens.json file
            userTokens = JSON.stringify(tokens);
            fs.writeFile(__dirname + '/json/tokens.json', userTokens, (err) => {
                if (err) {
                    myEmitter.emit('log', 'token.updateToken()', 'ERROR', 'tokens.json write error');
                    console.log(err);
                } else {
                    console.log(`Token record for ${argv[3]} was updated with ${argv[4]}.`);
                    myEmitter.emit('log', 'token.updateToken()', 'INFO', `Token record for ${argv[3]} was updated with ${argv[4]}.`);
                }
            });
        }
    });
}

// Searches for a token
function searchToken(argv, callback) {
    if (DEBUG) console.log('token.searchToken()');
    if (DEBUG) console.log(argv);

    fs.readFile(__dirname + '/json/tokens.json', 'utf-8', (error, data) => {
        if (error) {
            callback(error, null);
            return;
        }

        const tokens = JSON.parse(data);
        const matchingTokens = tokens.filter(token => {
            // Switch based on the option passed
            switch (argv[2]) {
                case 'u':
                case 'U':
                    // If the usernames match, return true
                    return token.username === argv[3];
                case 'e':
                case 'E':
                    // If the emails match, return true
                    return token.email === argv[3];
                case 'p':
                case 'P':
                    // If the phone numbers match, return true
                    return token.phone === argv[3];
                default:
                    // By default, return false
                    return false;
            }
        });

        callback(null, matchingTokens);
    });
}

// Lists all tokens in the tokens.json file
function tokenList(callback) {
    fs.readFile(__dirname + '/json/tokens.json', 'utf-8', (error, data) => {
        if (error) {
            callback(error, null);
            return;
        }

        const tokens = JSON.parse(data);
        callback(null, tokens);
    });
}

// The main function for token.js
function tokenApp() {
    if(DEBUG) console.log('tokenApp()');

    // Switch based on the argument passed
    switch (myArgs[1]) {
        // Counts the number of tokens
        case '--count':
            if(DEBUG) console.log('token.tokenCount() --count');
            tokenCount();
            break;
        // Lists all tokens
        case '--list':
            if(DEBUG) console.log('token.tokenList() --list');
            tokenList((error, tokens) => {
                if (error) {
                    console.error("Error listing tokens: ", error.message);
                // If any tokens were found, lists them in the console
                } else if (tokens.length > 0) {
                    console.log('All tokens:'); 
                    tokens.forEach(token => {
                        console.log(token);
                    });
                    console.log(tokens.length + ' tokens listed.');
                    myEmitter.emit('log', 'token.tokenList() --list', 'INFO', tokens.length + ' tokens listed.');
                } else {
                    console.log('No tokens found.');
                }
            });
            break; 
        // Creates a new token
        case '--new':
            if (myArgs.length < 3) {
                console.log('invalid syntax. node myapp token --new [username]')
                myEmitter.emit('log', 'token.newToken() --new', 'WARNING', 'invalid syntax, usage displayed');
            } else {
                newToken(myArgs[2]);
            }
            break;
        // Updates an existing token
        case '--upd':
            if (myArgs.length < 5) {
                console.log('invalid syntax. node myapp token --upd [option] [username] [new value]')
                myEmitter.emit('log', 'token.updateToken() --upd', 'WARNING', 'invalid syntax, usage displayed');
            } else {
                updateToken(myArgs);
            }
            break;
        // case '--fetch':
        //     if (myArgs.length < 3) {
        //         console.log('invalid syntax. node myapp token --fetch [username]');
        //         myEmitter.emit('log', 'token.fetchRecord() --fetch', 'WARNING', 'invalid syntax, usage displayed');
        //     } else {
        //         // fetchRecord(myArgs[2]);
        //     }
        //     break;
        // Searches for a token
        case '--search':
            if (myArgs.length < 4) {
                console.log('invalid syntax. node myapp token --search [option] [value]');
                myEmitter.emit('log', 'token.searchToken() --search', 'WARNING', 'invalid syntax, usage displayed');
            } else {
                searchToken(myArgs, (error, tokens) => {
                    if (error) {
                        myEmitter.emit('log', 'token.searchToken() --search', 'ERROR', 'token.json read error');
                        console.error("Error searching for tokens: ", error.message);
                    // If any tokens were found, lists them in the console
                    } else if (tokens.length > 0) {
                        myEmitter.emit('log', 'token.searchToken() --search', 'INFO', 'matching tokens displayed');
                        console.log('Matching tokens:');
                        tokens.forEach(token => {
                            console.log(token);
                        });
                    } else {
                        myEmitter.emit('log', 'token.searchToken() --search', 'WARNING', 'no matching tokens found');
                        console.log('No matching tokens found.');
                    }
                });
            }
            break;
        case '--help':
        case '--h':
        default:
            // By default, displays the token.txt file
            fs.readFile(__dirname + "/views/token.txt", (error, data) => {
                if(error) {
                    myEmitter.emit('log', 'tokenApp()', 'ERROR', 'token.txt read error');
                    throw error;
                }
                console.log(data.toString());
            });
    }
}

// Function to add days to a date
// Used for token expiration
function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

module.exports = {
    tokenApp,
    newToken,
    tokenCount,
    // fetchRecord,
}