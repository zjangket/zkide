var path = require('path');

mapping = {
    ".css"  : 'text/css',
    ".gif"    :  'image/gif',
    ".html": 'text/html',
    ".jpg"    :  'image/jpeg',
    ".jpeg"    :  'image/jpeg',
    ".js"    :  'application/javascript',
    ".png"    :  'image/png',
    ".txt"    :  'text/plain',
    ".xml"    :  'text/xml'
};

exports.mapExtension = function(aString) {
    return mapping[path.extname(aString)] || 'text/html';
}
