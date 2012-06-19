Apart.define("fileStore", function() {
        var fileStore = {};
        
        function get(path, callback) {
            var xhr = new XMLHttpRequest();
            xhr.open("GET", path);
            xhr.onreadystatechange = function() {
                if (xhr.readyState != 4)  { return; }
                callback(null, xhr.responseText);
           };
            xhr.send(null);
        }
        
        function getAsJSON(path, callback) {
            get(path, function(error, result) {
                var jsonResult = null;
                if (!error) {
                    jsonResult = JSON.parse(result);
                } 
                callback(error, jsonResult);
            });
        };
                
        fileStore.getContent = function (path, callback) {
            get(path, callback);
        };
                
        fileStore.getMetaData = function(path, callback) {
            getAsJSON(path, callback);
        }
        
        return fileStore;
});
