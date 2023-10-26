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

var tokenCount = function() {
    if(DEBUG) console.log('token.tokenCount()');
    return new Promise(function(resolve, reject) {
        fs.readFile(__dirname + '/json/tokens.json', 'utf-8', (error, data) => {
            if(error)  
                reject(error); 
            else {
                let tokens = JSON.parse(data);
                let count = Object.keys(tokens).length;
                console.log(`Current token count is ${count}.`);
                myEmitter.emit('log', 'token.tokenCount()', 'INFO', `Current token count is ${count}.`);
                resolve(count);
            };
        });
    });
};

function newToken(username) {
    if(DEBUG) console.log('token.newToken()');

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

    newToken.created = `${format(now, 'yyyy-MM-dd HH:mm:ss')}`;
    newToken.username = username;
    newToken.token = crc32(username).toString(16);
    newToken.expires = `${format(expires, 'yyyy-MM-dd HH:mm:ss')}`;

    fs.readFile(__dirname + '/json/tokens.json', 'utf-8', (error, data) => {
        if(error) throw error; 
        let tokens = JSON.parse(data);
        tokens.push(newToken);
        userTokens = JSON.stringify(tokens);
    
        fs.writeFile(__dirname + '/json/tokens.json', userTokens, (err) => {
            if (err) console.log(err);
            else { 
                console.log(`New token ${newToken.token} was created for ${username}.`);
                myEmitter.emit('log', 'token.newToken()', 'INFO', `New token ${newToken.token} was created for ${username}.`);
            }
        })
        
    });
    return newToken.token;
}

function updateToken(argv) {
    if(DEBUG) console.log('token.updateToken()');
    if(DEBUG) console.log(argv);
    fs.readFile(__dirname + '/json/tokens.json', 'utf-8', (error, data) => {
        if(error) throw error; 
        let tokens = JSON.parse(data);
        tokens.forEach(obj => {
            if(obj.username === argv[3]) {
                if(DEBUG) console.log(obj);
                switch (argv[2]) {
                    case 'p':
                    case 'P':
                        obj.phone = argv[4];
                        break;
                    case 'e':
                    case 'E':
                        obj.email = argv[4];
                        break;
                    default:
                        // TODO: handle incorrect options #
                }
                if(DEBUG) console.log(obj);
            }
        });
        userTokens = JSON.stringify(tokens);
        fs.writeFile(__dirname + '/json/tokens.json', userTokens, (err) => {
            if (err) console.log(err);
            else { 
                console.log(`Token record for ${argv[3]} was updated with ${argv[4]}.`);
                myEmitter.emit('log', 'token.updateToken()', 'INFO', `Token record for ${argv[3]} was updated with ${argv[4]}.`);
            }
        })
    });
}

function tokenApp() {
  if(DEBUG) console.log('tokenApp()');

  switch (myArgs[1]) {
  case '--count':
      if(DEBUG) console.log('token.tokenCount() --count');
      tokenCount();
      break;
  case '--list':
      if(DEBUG) console.log('token.tokenList() --list');
      // tokenList();
      break; 
  case '--new':
      if (myArgs.length < 3) {
          console.log('invalid syntax. node myapp token --new [username]')
          myEmitter.emit('log', 'token.newToken() --new', 'WARNING', 'invalid syntax, usage displayed');
      } else {
        newToken(myArgs[2]);
      }
      break;
  case '--upd':
      if (myArgs.length < 5) {
          console.log('invalid syntax. node myapp token --upd [option] [username] [new value]')
          myEmitter.emit('log', 'token.updateToken() --upd', 'WARNING', 'invalid syntax, usage displayed');
      } else {
          updateToken(myArgs);
      }
      break;
  case '--fetch':
      if (myArgs.length < 3) {
          console.log('invalid syntax. node myapp token --fetch [username]')
          myEmitter.emit('log', 'token.fetchRecord() --fetch', 'WARNING', 'invalid syntax, usage displayed');
      } else {
          // fetchRecord(myArgs[2]);
      }
      break;
  case '--search':
      if(DEBUG) console.log('token.searchToken()');
  //    searchToken();
      break;
  case '--help':
  case '--h':
  default:
      fs.readFile(__dirname + "/views/token.txt", (error, data) => {
          if(error) throw error;              
          console.log(data.toString());
      });
  }
}

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