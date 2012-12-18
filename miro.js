// miro.js
//
// MIRO.REQ, MIRO.RES, MIRO.STATUS, MIRO( parser )

var REQ = {
    MINET: 10,
    LOGIN: 11,
    LEAVE: 12,
    GETLIST: 13,
    MESSAGE: 14,
    BEAT: 15,

    KEEP_ALIVE: 400,
};

var RES = {
    MIRO: 20,
    STATUS: 21,
    LIST: 22,
    UPDATE: 23,
    CSMESSAGE: 24,
    ERROR: 404
};

var MES = {
    PARA_MISSING: 'Some parameters missing or wrong',
    USER_ALREADY_EXIST: 'User name already exists',
    LOGIN_SUCCESS: 'Login success',
    ILLEGAL_OPERATION: 'Illegal operation',
    ILLEGAL_PROTOCOL: 'Illegal protocol'
};

var PARSER = function() {
    var self = this;
    this.parse = function( req ) {
        var result = {};

        result.para = {};

//        console.log( req.toString().length );

        req = req.substring( 0, req.length - 1 );
        var reqParas = req.split( ' ' );

       // console.log( reqParas );

        if ( reqParas[0] === 'minet' ) {
            result.type = REQ.MINET;
        }
        else if ( reqParas[0] === 'login' ) {
            result.type = REQ.LOGIN;
            result.para.userName = reqParas[1];
            result.para.port = reqParas[2];
            result.para.keepAlive = REQ.KEEP_ALIVE;
        }
        else if ( reqParas[0] === 'leave' ) {
            result.type = REQ.LEAVE;
        }
        else if ( reqParas[0] === 'getlist' ) {
            result.type = REQ.GETLIST;
        }
        else if ( reqParas[0] === 'message' ) {
            result.type = REQ.MESSAGE;
            result.body = reqParas[1];
        }
        else if ( reqParas[0] === 'beat' ) {
            result.type = REQ.BEAT;
        }
        else {
        }


        return result;
    };

    this.write = function( res ) {
        var result;

        switch ( res.type ) {
            case RES.MIRO:
                result = 'miro';
                break;
            case RES.STATUS:
                result = res.para.status + ' ' + res.body;
                break;
            case RES.LIST:
                result = 'current online users: ';
                for ( var i = 0; i < res.body.length; i++ ) {
                    result = result + res.body[i].userName + ' ';
                }
                break;
            case RES.UPDATE:
                if ( res.para.status === 1 ) {
                    result = res.para.status + ' ' + res.para.userName + ' login';
                }
                else {
                    result = res.para.status + ' ' + res.para.userName + ' logoff';
                }
                break;
            case RES.ERROR:
                result = res.body;
                break;
            case RES.CSMESSAGE:
                result = res.body;
                break;
            default:
                break;
        }

        return result;
    };

    return this;
};


module.exports.REQ = REQ;
module.exports.RES = RES;
module.exports.MES = MES;
module.exports.PARSER = PARSER;
