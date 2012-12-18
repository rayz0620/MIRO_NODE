// miro.js
//
// MIRO.REQ, MIRO.RES, MIRO.STATUS, MIRO( parser )

var REQ = {
    MINET : 10,
    LOGIN : 11,
    LEAVE : 12,
    GETLIST : 13,
    MESSAGE : 14,
    BEAT : 15
};

var RES = {
    MIRO : 20,
    STATUS : 21,
    LIST : 22,
    UPDATE : 23,
    CSMESSAGE : 24,
    ERROR: -1
};

var MES = {
    PARA_MISSING : 'Some parameters missing or wrong',
    USER_ALREADY_EXIST : 'User name already exists',
    LOGIN_SUCCESS : 'Login success',
    ILLEGAL_OPERATION : 'Illegal operation'
};

var PARSER = function() {
    var self = this;
    this.parse = function(msg) {
        if ( typeof msg != 'string')
            throw new Error('Parameter is not of type String');

        var headAndBody = msg.split('\n\n');
        var head = headAndBody[0];
        var body = headAndBody[1];
        var headLines = head.split('\n');
        var requestLine = headLines[0];
        var parsed = {
            type : '',
            para : {},
            body : ''
        };

        // Process request part
        if (requestLine[0] === 'MINET') {
            parsed.type = REQ.MINET;
            if (requestLine[1] != undefined) {
                parsed.hostname = requestLine[1];
                parsed.correct = true;
            }
        } else if (requestLine[0].match(/CS[0-9].[0-9]+/) != null) {
            parsed.request.type = requestLine[0].slice(0, 1);
            parsed.request.version = requestLine[0].slice(2);

            // Resolve method type
            if (requestLine[1] != undefined)
                parsed.type = REQ[requestLine[1]];

            if (requestLine[1] === 'LEAVE' || requestLine[0] === 'MESSAGE' || requestLine[1] === 'BEAT') {
                if (requestLine[2] != undefined)
                    parsed.para.username = requestLine[2];
            }
        }

        // Process Header part
        for (var i = 1; i < headLines.length; i++) {
            var thisline = headLines[i];
            if (thisline[0] != undefined && thisline[1] != undefined) {
                parsed.para[thisline[0]] = thisline[1];
            }
        }

        //Process Body part
        parsed.body = body;

        if(validate(parsed))
            return parsed;
        else return RES.ERROR;
        return parsed;
    }
    // this.parse = function( req ) {
    //     var result = {};

    //     result.para = {};

    //     req = req.substring( 0, req.length - 1 );
    //     var reqParas = req.split( ' ' );

    //    // console.log( reqParas );

    //     if ( reqParas[0] === 'minet' ) {
    //         result.type = REQ.MINET;
    //     }
    //     else if ( reqParas[0] === 'login' ) {
    //         result.type = REQ.LOGIN;
    //         result.para.userName = reqParas[1];
    //         result.para.port = reqParas[2];
    //     }
    //     else if ( reqParas[0] === 'leave' ) {
    //         result.type = REQ.LEAVE;
    //     }
    //     else if ( reqParas[0] === 'getlist' ) {
    //         result.type = REQ.GETLIST;
    //     }
    //     else if ( reqParas[0] === 'message' ) {
    //         result.type = REQ.MESSAGE;
    //         result.body = reqParas[1];
    //     }
    //     else {
    //     }

    //     return result;
    // };

    this.write = function(res) {
        var response = 'CS1.1 ';
        switch (res.type) {
            case RES.MIRO:
                response += 'MIRO' + ' ' + res.para.hostname;
                break;

            case RES.STATUS:
                response += 'STATUS' + ' ' + res.para.status + ' ' + '\n' + this.getDate() + this.getContentLength(res.body.length) + res.body;
                break;

            case RES.LIST:
                var body = '';
                for (var i = 0; i < res.bodyArray.length; i++) {
                    body += res.body[i].username + ' ' + res.body[i].port + '\n';
                }
                response += 'LIST' + ' ' + '\n' + this.getCommonHead(body.length) + body;

            case RES.UPDATE:
                response += 'UPDATE' + res.para.status + ' ' + res.para.userName + '\n' + this.getDate();
                break;

            case RES.ERROR:

                break;

            case RES.CSMESSAGE:
                var body = res.body;
                response += 'CMESSAGE' + ' ' + res.para.username + '\n' + this.getDate + this.getContentLength(body.length) + body;
                break;
        }
        return response;
    }
    // this.write = function( res ) {
    //     var result;

    //     switch ( res.type ) {
    //         case RES.MIRO:
    //             result = 'miro';
    //             break;
    //         case RES.STATUS:
    //             result = res.para.status + ' ' + res.body;
    //             break;
    //         case RES.LIST:
    //             result = 'current online users: ';
    //             for ( var i = 0; i < res.body.length; i++ ) {
    //                 result = result + res.body[i].userName + ' ';
    //             }
    //             break;
    //         case RES.UPDATE:
    //             if ( res.para.status === 1 ) {
    //                 result = res.para.status + ' ' + res.para.userName + ' login';
    //             }
    //             else {
    //                 result = res.para.status + ' ' + res.para.userName + ' logoff';
    //             }
    //             break;
    //         case RES.ERROR:
    //             result = res.body;
    //             break;
    //         case RES.CSMESSAGE:
    //             result = res.body;
    //             break;
    //         default:
    //             break;
    //     }
    //
    // return result;
    // };
    this.getDate = function() {
        var date = new Date();
        return ('DATE:' + ' ' + date.toUTCString + '\n' );
    }

    this.getContentLength = function(contentLength) {
        return ('Content-Length:' + ' ' + contentLength + '\n');
    }

    this.validate = function(parsed) {
        if (parsed.type === undefined)
            return false;
        else
            switch(parsed.type) {
                case REQ.MINET:
                    return !(parsed.para.hostname === undefined);
                case REQ.LOGIN:
                    return !(parsed.para.username === undefined || parsed.para.port === undefined || !this.validatePort(parsed.para.port));
                case REQ.LEAVE:
                    return !(parsed.para.username === undefined );
                case REQ.GETLIST:
                    return true;
                case REQ.MESSAGE:
                    return !(parsed.username === undefined || parsed.body === undefined || parsed.body === '');
                case REQ.BEAT:
                    return !(parsed.username === undefined);
                default:
                    return false;
            }
    }

    this.validatePort = function(portString) {
        if ( typeof portString == 'string' && portString.match(/[0-9]*/) != null)
            return true;
        else
            return false;
    }
    return this;
};

module.exports.REQ = REQ;
module.exports.RES = RES;
module.exports.MES = MES;
module.exports.PARSER = PARSER;
