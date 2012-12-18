var a = {
    request : {
        type : 'LEAVE',
        username :　''
    },
    head : {date:'', da:'da'},
    body : {}
};

function parseMsg(msg) {
    if ( typeof msg != 'string')
        throw new Error('Parameter is not of type String');

    var headAndBody = msg.split('\n\n');
    var head = headAndBody[0];
    var body = headAndBody[1];
    var headLines = head.split('\n');
    var requestLine = headLines[0];
    var parsed = {
        request : {},
        head : {},
        body : body
    };

    // Process request part
    if (requestLine[0] === 'MINET' || requestLine[0] === 'MIRO') {
        parsed.method = requestLine[0];
        if (requestLine[1] != undefined) {
            parsed.hostname = requestLine[1];
            parsed.correct = true;
        }
    } else if (requestLine[0].match(/CS[0-9].[0-9]+/) != null) {
        parsed.request.type = requestLine[0].slice(0, 1);
        parsed.request.version = requestLine[0].slice(2);

        if (requestLine[1] != undefined)
            parsed.request.method = requestLine[1];

        if (requestLine[1] === 'LEAVE' || requestLine[0] === 'MESSAGE' || requestLine[1] === 'BEAT') {

            if (requestLine[2] != undefined)
                parsed.request.username = requestLine[2];
        }
    }

    // Process Header part
    for (var i = 1; i < headLines.length; i++) {
        var thisline = headLines[i];
        if (thisline[0] != undefined && thisline[1] != undefined) {
            parsed.head[thisline[0]] = thisline[1];
        }
    }

    //Process Body part
    parsed.body = body;

    validate(parsed);
    return parsed;
}

function validate(parsed) {

}