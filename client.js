// client.js
//
// A simple client for testing.
// Read data from stdin and write to socket(server).

var net = require( 'net' );

var CLIENT_SETTINGS = {};

CLIENT_SETTINGS.host = '127.0.0.1';
CLIENT_SETTINGS.port = 4000;
CLIENT_SETTINGS.encoding = 'ascii';

// Resume standard input.
process.stdin.resume();

var client = new net.Socket();

client.connect( CLIENT_SETTINGS.port, CLIENT_SETTINGS.host, function() {
    console.log( 'Connected to Server' );

    client.setEncoding = CLIENT_SETTINGS.encoding;

    process.stdin.on( 'data', function( data ) {

        // Write data from stdin to socket.
        client.write( data );
    } );
} );

client.on( 'data', function( data ) {

    // Just log the data from server to stdout.
    console.log( '>>' + data );
});

client.on( 'close', function() {
	console.log( 'Connnection closed' );
} );
