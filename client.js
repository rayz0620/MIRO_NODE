// client.js
{
var net = require( 'net' );

var CLIENT_SETTINGS = {};

CLIENT_SETTINGS.host = '127.0.0.1';
CLIENT_SETTINGS.port = 4000;
CLIENT_SETTINGS.encoding = 'ascii';
}

process.stdin.resume();

var client = new net.Socket();

client.connect( CLIENT_SETTINGS.port, CLIENT_SETTINGS.host, function() {
    console.log( 'Connected to Server' );
//	client.write( 'I am dragonbook.' );

    client.setEncoding = CLIENT_SETTINGS.encoding;

    process.stdin.on( 'data', function( data ) {
//        console.log( data.toString() );
        client.write( data );
    } );
} );

client.on( 'data', function( data ) {
    console.log( '>>' + data );
});

client.on( 'close', function() {
	console.log( 'Connnection closed' );
} );
