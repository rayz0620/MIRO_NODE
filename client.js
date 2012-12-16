// client.js

var net = require( 'net' );

var CLIENT_SETTINGS = {};

CLIENT_SETTINGS.host = '127.0.0.1';
CLIENT_SETTINGS.port = 4000;

var client = new net.Socket();

client.connect( CLIENT_SETTINGS.port, CLIENT_SETTINGS.host, function() {
    console.log( 'Connected to Server' );
//	client.write( 'I am dragonbook.' );
} );

client.on( 'data', function( data ) {
	console.log( 'DATA: ' + data );
	client.destroy();
});

client.on( 'close', function() {
	console.log( 'Connnection closed' );
} );
