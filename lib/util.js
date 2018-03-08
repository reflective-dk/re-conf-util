"use strict";

var stream = require('stream');

module.exports = {
    ensureStream: ensureStream
};

function ensureStream(bufferOrStream) {
    if (bufferOrStream instanceof stream.Readable) {
        return bufferOrStream;
    }
    if (bufferOrStream instanceof Buffer || typeof bufferOrStream === 'string') {
        var duplex = new stream.Duplex();
        duplex.push(bufferOrStream);
        duplex.push(null);
        return duplex;
    }
    throw new Error('unknown buffer type: ' + bufferOrStream);
}
