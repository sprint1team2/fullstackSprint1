# Team 2 Sprint 1 - Fullstack

## Documentation

### Summary

This is a CLI (Command Line Interface). Using the CLI, you can do three main things:

- Configure the program and change the configuration
- Initialize the application (create all required files and folders)
- Create, update, search, count and list tokens

The program also includes a web form which can be used to display the token count, and to create new tokens.

### Startup

To initialize the program, first run the 'npm i' command. This will create the node_modules folder and fill it with all of the additional required modules.

Next, run the following command: 'node myapp init --all'. This should create all of the required folders and files that are not already included with the program.

That's it! It's all set up. Now just run 'node myapp --help' to get started.

### Using the CLI

Everything is run via the 'node myapp' command. There are three types of commands you can run: 'init', 'config' and 'token'. 'init' is the first command you will run, and has the following three options:

- '--all'
- '--mk'
- '--cat'

'--mk' and '--cat' create the folders and json/txt files respectively (as specified in the templates.js file), while '--all' does both simultaneously. If one or more is missing, these commands will create them.

The next command is 'config'. It does not have much use currently, but there are a few things you can do with it:

- '--show'
- '--reset'
- '--set (setting) (new)

'--show' shows the current config file. '--reset' resets the config file to its default state. And '--set' changes a setting. For example, if you wanted to change the version to 1.2.5, you'd type: 'node myapp config --set version 1.2.5'.

The final, and most complicated command is 'token'. There are 5 main options for the token command:

- '--count'
- '--list'
- '--new (username)'
- '--upd (option) (username) (new)'
- '--search (option) (query)

'--count' is the most basic option. It simply counts all of the tokens in the tokens.json file. '--list' lists all token records. '--new' creates a new token record based on a given username. There can not be more than one of each token in the json file. '--upd' updates either the email or phone number of a token record. For example, if you wanted to update Will's phone number to be '1234567890', you'd type: 'node myapp token --upd p Will 1234567890'. And finally, '--search' searches for a token record based on a given query. You can search by username, phone number or email. For example, if you wanted to find Will's token record, and you only know his name, you'd type: 'node myapp token --search u Will'.

That's all you need to know about how to use the CLI.

## Using the web form

Also included with this program is a web form. It currently runs locally via express.js.

To start the server, in a new terminal at this folder, run the following command: 'node express'. The server should now be running on localhost:3000. I recommend using Google Chrome to access the web form.

The web form includes only two options:

- Create a new token
- Count all tokens

Clicking 'New Tokens' will bring you to a page with a form to enter a username. When the username is sent, a token for the username will be displayed and a new token record will be added to the tokens.json file (also there may be a little secret animation in the new tokens page, but you didn't hear that from me).

Clicking 'Token Count' will simply display how many tokens are currently in the tokens.json file.

To close the web server, press the keys Ctrl + C in the terminal.
