const express = require('express');
const app = express();
const { newToken, tokenCount } = require('./token');

// Serve static files from the public directory
app.use(express.static('public'));
// Harvest fields from a form
app.use(express.urlencoded({ extended: true }));

global.DEBUG = true;

// Serve the index.html file when the root URL is requested
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/count', async (req, res) => {
  var theCount = await tokenCount();
  res.setHeader('Content-type', 'text/html');
  res.write(`<!doctype html><html><body>`);
  res.write(`Token count is ${theCount}</br>`);
  res.write(`<a href="http://localhost:3000">[home]</a>`);
  res.write(`</body></html>`);
  res.end();
});

app.get('/new', (req, res) => {
  console.log('new token requested');
  res.sendFile(__dirname + '/public/newtoken.html');
});


// Not working as expected. Needs to be fixed!
app.post('/new', (req, res) => {
    var theToken = newToken(req.body.username);
    res.setHeader('Content-type', 'text/html');
    // res.write(`${req.body.username} token is ${theToken}</br>`);
    // res.write(`<a href="http://localhost:3000" class="homebutton">[home]</a>`);
    const htmlContent = `
    <!doctype html>
    <html>
    <head>
        <link rel="stylesheet" type="text/css" href="./public/style.css">
    </head>
    <body>
        ${req.body.username} token is ${theToken} <br />
        <a href="http://localhost:3000">[home]</a>
    </body>
    </html>
    `
    res.send(htmlContent);
});

// Start the server
app.listen(3000, () => {
  console.log('Express server started on port 3000');
});
