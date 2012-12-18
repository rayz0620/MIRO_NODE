// unity.js
//
// Object User and OnlineUsers.


// User object.
var User = function( user ) {
    var self = this;

    // User does not exist or off line.
    self.state = 0;

    return self;
};

User.prototype.set = function( user ) {
    this.userName = user.userName;
    this.socket = user.socket;
    this.ip = user.ip;
    this.port = user.port;
    this.state = user.state;
};

User.prototype.setUser = function( userName, socket, ip, port, state ) {
    this.userName = userName;
    this.socket = socket;
    this.ip = ip;
    this.port = port;
    this.state = state;
};

// Get user's userName, ip and port
User.prototype.get = function() {
    var result = {};

    result.userName = this.userName;
//    result.socket = this.socket;
    result.ip = this.ip;
    result.port = this.port;

    return result;
};

User.prototype.getName = function() {
    return this.userName;
};

User.prototype.getSocket = function() {
    return this.socket;
};

User.prototype.setState = function( state ) {
    this.state = state;
};

User.prototype.isOnline = function() {
    if ( this.state === 1 ) {
        return true;
    }

    return false;
}

// OnlineUsers object.
var OnlineUsers = function() {
    var self = this;

    self.users = [];

    return self;
};

OnlineUsers.prototype.set = function( users ) {
    this.users = users;
};


// Get Online users information.
// Include user's userName, ip and port.
OnlineUsers.prototype.get = function( users ) {
    var result = [];

    this.users.forEach( function( user ) {
        result.push( user.get() );
    } );

    return result;
};

OnlineUsers.prototype.getSockets = function() {
    var result = [];

    this.users.forEach( function( user ) {
        result.push( user.getSocket() );
    } );

    return result;
};

// Check if the user already online.
OnlineUsers.prototype.isExist = function( userName ) {
    // problems here, return failed, all items excute.
/*
    this.users.forEach( function( user ) {
        console.log( user.getName() );
        console.log( userName );
        console.log( '\n' );

        if ( user.getName() === userName ) {
            return true;
        }
    } );
*/
    for ( var i = 0; i < this.users.length; i++ ) {
        if ( this.users[i].getName() === userName ) {
            return true;
        }
    }

    return false;
};

OnlineUsers.prototype.addUser = function( user ) {
    this.users.push( user );
};

OnlineUsers.prototype.removeUser = function( user ) {
    var index = this.users.indexOf( user );
    this.users.splice( index, 1 );
};

module.exports.User = User;
module.exports.OnlineUsers = OnlineUsers;
