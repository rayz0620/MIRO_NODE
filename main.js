// main.js
//
// Server Main Module.


// --------------- Global Settings --------------- //

// MIRO protocol parameters and parser.
var MIRO = {};

MIRO.REQ = require( './miro' ).REQ;
MIRO.RES = require( './miro' ).RES;
MIRO.PARSER = require( './miro' ).PARSER;

var parser = new MIRO.PARSER();

// Users and Online Users.
var User = require( './ulity' ).User;
var OnlineUsers = require( './ulity' ).OnlineUsers;

var onlineUsers = new OnlineUsers();

// Server and default settings.
var server = require( 'net' ).createServer();
var SERVER_SETTINGS = {};

SERVER_SETTINGS.hostname = 'MIRO';
SERVER_SETTINGS.port = 4000;

// --------------- Server Services --------------- //

// Initialize server.
server.listen( SERVER_SETTINGS.port );

server.on( 'listening', function() {
    console.log( 'Server is listening on port ' + SERVER_SETTINGS.port );
} );

// Connection form client.
server.on( 'connection', function( socket ) {
    console.log( 'Server has a new connection' );
} );

// Connection end.
server.on( 'end', function() {
    console.log( 'Server is now closed' );
} );

// Connection error.
server.on( 'error', function( err ) {
    console.log( 'Error occured: ' + err.message );
} );
