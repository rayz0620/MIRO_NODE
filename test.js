// test.js

/*
var User = require( './ulity.js' ).User;
var OnlineUsers = require( './ulity.js' ).OnlineUsers;

var onlineUsers = new OnlineUsers();

var t = {};

t.userName = 'user';
t.socket = 'socket';
t.ip = 'ip';
t.port = 'port';

var user1 = new User( t );

for ( var i = 1; i <= 5; i++ ) {
    t.userName = t.userName + i;
    t.socket = t.socket + i;
    t.ip = t.ip + i;
    t.port = t.port + i;

    if ( i === 3 ) {
        var u = new User( t );
        onlineUsers.addUser( u );
    }

    if ( i !== 3 ) {
        onlineUsers.addUser( new User( t ) );
    }
}

//console.log( onlineUsers.isExist( u.getName() ) );

console.log( onlineUsers );

//onlineUsers.removeUser( u );

u.userName = 'wow';

console.log( onlineUsers );

console.log( onlineUsers.isExist( u.getName() ) );
*/

/*
var User = require( './ulity' ).User;

var user = new User();

f = function( user ) {
    user.port = 1;
}

f( user );

console.log( user.port );	// !!! not null

var user = null;

f = function( user ) {
    user = 1;
}

f( user )

console.log( user );		// !!! null
*/

var User = require( './ulity' ).User;

var user = new User();

user.userName = 'a';

console.log( user.isOnline() );

f = function( theUser ) {
    theUser = new User;
};

f( user );

console.log( user.isOnline() );
