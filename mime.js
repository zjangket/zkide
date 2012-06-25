var path = require('path');

mapping = {
    ".css"  : 'text/css',
    ".gif"    :  'image/gif',
    ".html": 'text/html',
    ".jpg"    :  'image/jpeg',
    ".jpeg"    :  'image/jpeg',
    ".js"    :  'text/javascript',
    ".png"    :  'image/png',
    ".txt"    :  'text/plain',
    ".xml"    :  'text/xml'
};

exports.contentTypeForExtension = function(aString) {
    return mapping[path.extname(aString)] || 'text/html';
}
