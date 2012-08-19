Apart.define("fileStore", function() {
        var fileStore = {};
        
        function get(path, callback) {
            var xhr = new XMLHttpRequest();
            xhr.open("GET", path);
            xhr.onreadystatechange = function() {
                if (xhr.readyState != 4)  { return; }
                var metaData = {
                    "contentType":  xhr.getResponseHeader("Content-Type")
                };
                callback(null, xhr.responseText, metaData);
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
        }
        
        function put(path, content, callback) {
            var xhr = new XMLHttpRequest();
            xhr.open("PUT", path);
            xhr.setRequestHeader("Cache-Control", "no-cache");
            xhr.onreadystatechange = function() {
                if (xhr.readyState != 4)  { return; }
                var result = xhr.responseText;
	            callback(xhr);
	        };
	        xhr.send(content);
	    }
        
        function del(path, callback) {
            var xhr = new XMLHttpRequest();
            xhr.open("DELETE", path);
            xhr.onreadystatechange = function() {
                if (xhr.readyState != 4)  { return; }
                var result = xhr.responseText;
	            callback(xhr);
	        };
	        xhr.send(null);
	    }

        fileStore.get = get;
                
        fileStore.getContent = function (path, callback) {
            get(path, callback);
        };
                
        fileStore.getMetaData = function(path, callback) {
            getAsJSON(path, callback);
        };
        
        fileStore.save = function(path, content, callback) {
            put(path, content, callback);
        };
        
        fileStore.del = del;
        
        return fileStore;
});
