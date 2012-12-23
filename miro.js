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
    ERROR : -1
};

var MES = {
    PARA_MISSING : 'Some parameters missing or wrong',
    USER_ALREADY_EXIST : 'User name already exists',
    LOGIN_SUCCESS : 'Login success',
    ILLEGAL_OPERATION : 'Illegal operation',
    ALREADY_LOGIN : 'You have alreay logged in',
    ILLEGAL_PROTOCOL : 'Unrecogonized protocol',
    ILLEGAL_REQUEST : 'Illegal request',
    NOT_LOG_IN : 'You have not logged in'
};

var PARSER = function() {
    var self = this;
    this.parse = function(msg) {
        if ( typeof msg != 'string')
            throw new Error('Parameter is not of type String');

        var headAndBody = msg.split(/[\n\r]{3,}/);

        var head;
        if (headAndBody[0] != undefined)
            head = headAndBody[0].trim();
        else
            head = '';

        var body;
        if (headAndBody[1] != undefined)
            body = headAndBody[1].trim();
        else
            body = '';

        var headLines = head.split('\n');
        var requestLine = headLines[0].split(' ');
        var parsed = {
            type : '',
            para : {},
            body : ''
        };

        // Process request part
        if (requestLine[0] === 'MINET') {
            parsed.type = REQ.MINET;
            if (requestLine[1] != undefined) {
                parsed.para.hostname = requestLine[1].trim();
            }
        } else if (requestLine[0].match(/CS[0-9].[0-9]+/) != null) {
            parsed.para.requesttype = requestLine[0].slice(0, 2);
            parsed.para.requestversion = requestLine[0].slice(2);

            // Resolve method type
            if (requestLine[1] != undefined)
                parsed.type = REQ[requestLine[1]];

            if (parsed.type === REQ['LEAVE'] || parsed.type === REQ['MESSAGE'] || parsed.type === REQ['BEAT'] || parsed.type === REQ['LOGIN']) {
                if (requestLine[2] != undefined)
                    parsed.para.userName = requestLine[2].trim();
            }
        }

        // Process Header part
        for (var i = 1; i < headLines.length; i++) {
            var thisline = headLines[i].split(' ');
            if (thisline[0] != undefined && thisline[1] != undefined) {
                parsed.para[thisline[0].toLowerCase().trim()] = thisline[1].trim();
            }
        }

        //Process Body part
        if (body != undefined)
            parsed.body = body.trim();

        return parsed;
    }

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
                for (var i = 0; i < res.body.length; i++) {
                    body += res.body[i].userName + ' ' + res.body[i].ip + ' ' + res.body[i].port + '\n';
                }
                response += 'LIST' + ' ' + '\n' + this.getDate() + this.getContentLength(res.body.length) + body;
                break;

            case RES.UPDATE:
                response += 'UPDATE' + ' ' + res.para.status + ' ' + res.para.userName + '\n' + this.getDate();
                break;

            case RES.ERROR:

                break;

            case RES.CSMESSAGE:
                var body = res.body;
                response += 'CMESSAGE' + ' ' + res.para.userName + '\n' + this.getDate() + this.getContentLength(body.length) + '\n' + body;
                break;
        }
        return response;
    }

    this.getDate = function() {
        var date = new Date();
        return ('DATE:' + ' ' + date.toUTCString() + '\n' );
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
                    return !(parsed.para.userName === undefined || parsed.para.port === undefined || !this.validatePort(parsed.para.port));
                case REQ.LEAVE:
                    return !(parsed.para.userName === undefined );
                case REQ.GETLIST:
                    return true;
                case REQ.MESSAGE:
                    return !(parsed.userName === undefined || parsed.body === undefined || parsed.body === '');
                case REQ.BEAT:
                    return !(parsed.userName === undefined);
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
