var http = require('http');
var fs = require('fs');
var path = require('path');
var uri = require('url');
var util = require('util');
var mime = require('./mime');
var async = require('./server/async.min.js');

var defaults = {
    port: 9090
};
    
function process(request, response) {    
    var url = uri.parse(request.url);
    var filePath = "." + (url.pathname || '/');
    util.print(request.method + ": " + url.path + "\n");
    
    switch (request.method) {
        case "GET": 
            processGet();
            break;
        case "PUT":
            processPut();
            break;
    }
        
    function send_headers(httpstatus, headers) {
        headers = headers || {};
        headers["Server"] = "zkide on nodejs";
        headers["Date"] = (new Date()).toUTCString();

        response.writeHead(httpstatus, headers);
    }
    
    function return_error(responseCode, message) {
        var body = responseCode + ": " + request.url + " " + message + ".\n";
        send_headers(responseCode,{ 
            'Content-Length':body.length,
            'Content-Type':"text/plain"
        });
        if (request.method != 'HEAD') {
            response.end(body, 'utf-8');
        } else {
            response.end('');
        }
    }        
    
    function file_not_found() {
        return_error(404, "not found");
    }       
        
    function internal_server_err() {
        return_error(500, " resulted in error:" + err);
    }

    function processPut() {
        try {
                var writeStream = fs.createWriteStream(filePath);
            } 
            catch (err) {
                util.print("fs.createWriteStream(",filePath,") error: ",util.inspect(err,true));
                return internal_server_err(err);
            }           
            
            
            request.pipe(writeStream);
            request.on('end', function() {
                    util.print('wrote: ',filePath, '\n');
                     send_headers(204, {
                             'Content-Length': 0, 
                     });
                     response.end();
            });
            
            response.addListener('error', function (err) {
                util.print('error writing',filePath,util.inspect(err));
                writeStream.destroy();
            });
    }
    
    function processGet() {
        
        function list_directory(filePath, stats) {
            var listing = [];
            //TODO: investigate whether connection timeout should be handled
            //TODO: do something with error
            fs.readdir(filePath, function(error, fileArray) {
                async.forEach(fileArray, function(x, callback) {
                    var newPath = path.join(filePath, x);
                    var isDirectory = false;
                     fs.stat(newPath, function (err, stats) {
                        if (err) {
                            if (err.errno != process.ENOENT) { 
                                // any other error is abnormal - log it
                                util.print("fs.stat(",newPath,") failed: ", err, '\n');
                            }
                            return internal_server_err();
                        }
                        if (stats.isDirectory()) {
                            isDirectory = true;
                        }
                    listing.push( 
                        {"name": x,
                            "url": newPath,
                        "isDirectory": isDirectory});
                     callback();
                     });
                },
                function(error) { 
                    body = JSON.stringify(listing);
                    send_headers(200, {
                        'Content-Length':body.length,
                        'Content-Type':"text/plain"
                    });
                    if (request.method != 'HEAD') {
                        response.end(body, 'utf-8');
                    } else {
                        response.end();
                    }
                });
            });
        }
        
        function stream_file(filePath, stats) {
             try {
                var readStream = fs.createReadStream(filePath);
            } 
            catch (err) {
                util.print("fs.createReadStream(",filePath,") error: ",util.inspect(err,true));
                return file_not_found();
            }
    
            send_headers(200, {
                'Content-Length': stats.size, 
                'Content-Type': mime.contentTypeForExtension(filePath),
                'Last-Modified': stats.mtime
            }); 
            readStream.pipe(response);
            readStream.on('end', function() {
                    util.print('served: ',filePath, '\n');
            });
    
            /*request.connection.addListener('timeout', function() {
                // dont destroy it when the fd's already closed
                if (readStream.readable) {
                    util.print('timed out. destroying file read stream');
                    readStream.destroy();
                }
            });*/
    
            readStream.addListener('fd', function(fd) {
                util.print("opened",filePath,"on fd",fd);
            });
    
            readStream.addListener('error', function (err) {
                util.print('error reading',filePath,util.inspect(err));
                response.end();
                readStream.destroy();
            });
        }
        
        fs.stat(filePath, function (err, stats) {
            if (err) {
                if (err.errno != process.ENOENT) { 
                    // any other error is abnormal - log it
                    util.print("fs.stat(",filePath,") failed: ", err, '\n');
                }
                return file_not_found();
            }
            if (stats.isDirectory()) {
                return list_directory(filePath, stats);
            } else {
                if (!stats.isFile()) {
                    util.print(filePath, " is not a directory and not a file, what is it then?");
                return file_not_found();
                }
                stream_file(filePath, stats);
            }
        });
    }
}
  
var server = http.createServer(process);
server.listen(defaults.port);
