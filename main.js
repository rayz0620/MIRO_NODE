// main.js
//
// Server Main Module.

// --------------- Global Settings --------------- //

// MIRO protocol parameters and parser.
var MIRO = {};

MIRO.REQ = require('./miro').REQ;
MIRO.RES = require('./miro').RES;
MIRO.MES = require('./miro').MES;
MIRO.PARSER = require('./miro').PARSER;

var miro = new MIRO.PARSER();

// Users and Online Users.
var User = require('./ulity').User;
var OnlineUsers = require('./ulity').OnlineUsers;

var onlineUsers = new OnlineUsers();

// Server and default settings.
var server = require('net').createServer();
var SERVER_SETTINGS = {};

SERVER_SETTINGS.hostname = 'MIRO_NODE';
SERVER_SETTINGS.port = 4000;
SERVER_SETTINGS.encoding = 'ascii';

// --------------- Server --------------- //

// Initialize server.
server.listen(SERVER_SETTINGS.port);

server.on('listening', function() {
    console.log('Server is listening on port ' + SERVER_SETTINGS.port);
});

// Connection from client.
server.on('connection', function(socket) {
    console.log('Server has a new connection');

    // Set default encoding to 'ascii'.
    socket.setEncoding(SERVER_SETTINGS.encoding);

    // Say Hello to client.
    
    // var res = miro.write({
        // type : MIRO.RES.MIRO
    // });
    // socket.write(res);
    sayHello(socket);
    

    // Create a new user.
    var user = new User();

    // Data received from client.
    socket.on('data', function(data) {

        // Parse client request.
        var req = miro.parse(data);

        switch ( req.type ) {
            case MIRO.REQ.MINET:
                sayHello(socket);
                break;
            case MIRO.REQ.LOGIN:
                login(socket, user, req);
                break;
            case MIRO.REQ.LEAVE:
                if (user.isOnline()) {
                    logoff(socket, user);
                }
                break;
            case MIRO.REQ.GETLIST:
                if (user.isOnline()) {
                    sendOnlineUsersList(user);
                }
                break;
            case MIRO.REQ.MESSAGE:
                if (user.isOnline()) {
                    broadcastMessage(req);
                }
                break;
            default:
                break;
        }
    });

    // Set time out for idle socket, 10s.
    socket.setTimeout(10000, function() {
        socket.write('Idle time out, disconnecting, bye');
        socket.end();
    });

    // Connection end.
    socket.on('end', function() {
        console.log('Connection end');

        if (user.isOnline()) {
            logoff(socket, user);
        }
    });

    // Connection close.
    socket.on('close', function() {
        console.log('Connection close');

        if (user.isOnline()) {
            logoff(socket, user);
        }
    });

});

// Server close.
server.on('close', function() {
    console.log('Server is now closed');
});

// Server error.
server.on('error', function(err) {
    console.log('Error occured: ' + err.message);
});

// --------------- Ulity Functions --------------- //

// Say hello to client.
sayHello = function(socket) {
    var res = miro.write({
        type : MIRO.RES.MIRO,
        para : {
            hostname : SERVER_SETTINGS.hostname
        }
    });

    socket.write(res);
}
// User login in.
login = function(socket, user, req) {
    var res;

    // Login failed if some parameters missing.
    if (req.para.userName === undefined || req.para.port === undefined) {
        res = miro.write({
            type : MIRO.RES.STATUS,
            para : {
                status : 0
            },
            body : MIRO.MES.PARA_MISSING
        });
        socket.write(res);
    }

    // Check if user name already exists.
    else if (onlineUsers.isExist(req.para.userName)) {
        res = miro.write({
            type : MIRO.RES.STATUS,
            para : {
                status : 0
            },
            body : MIRO.MES.USER_ALREADY_EXIST
        });
        socket.write(res);
    }

    // Login success.
    else {
        res = miro.write({
            type : MIRO.RES.STATUS,
            para : {
                status : 1
            },
            body : MIRO.MES.LOGIN_SUCCESS
        });
        socket.write(res);

        // Add user to online users.
        user.setUser(req.para.userName, socket, socket.remoteAddress, req.para.port, 1);

        onlineUsers.addUser(user);

        sendOnlineUsersList(user);
        // Send online users list to new user.
        broadcastUpdate(user, 1);
        // Broadcast update to other online users.
    }
}
// Send current online users information to the user.
sendOnlineUsersList = function(user) {
    var res;

    res = miro.write({
        type : MIRO.RES.LIST,
        body : onlineUsers.get()
    });

    user.getSocket().write(res);
};

// Broadcast updates to other online users if some user login or logoff.
broadcastUpdate = function(user, state) {
    var res;

    res = miro.write({
        type : MIRO.RES.UPDATE,
        para : {
            userName : user.getName(),
            status : state
        }
    });

    onlineUsers.getSockets().forEach(function(otherUserSocket) {
        if (otherUserSocket !== user.getSocket()) {
            otherUserSocket.write(res);
        }
    });
};

// User leave, log off.
logoff = function(socket, user) {
    if (user.getName() !== undefined && onlineUsers.isExist(user.getName())) {
        broadcastUpdate(user, 0);

        onlineUsers.removeUser(user);

        // Set user state be off line.
        user.setState(0);
    }
};

// Braoadcast user message.
broadcastMessage = function(req) {
    var res = miro.write({
        type : MIRO.RES.CSMESSAGE,
        body : req.body
    });

    onlineUsers.getSockets().forEach(function(socket) {
        socket.write(res);
    });
};
