Apart.define("ZKIDE", ['ZKEditor', 'fileStore'], function(ZKEditor, fileStore) {
    var ZKIDE = {};
    var console;
    var editors = [];
    
    ZKIDE.start = function start() {
        /*var editor = CodeMirror.fromTextArea(document.getElementById("zkTextarea"), {
			lineNumbers: true});
		editors.push(editor);*/
		ZKIDE.listDirectoryAtIn(workingDirectory(),  document.getElementById('fileBrowser'));
	};
	
	function workingDirectory() {
	    //we are in the client subdir now
	    return "/";
	}
	
	ZKIDE.open = function open(path) {
	    editors.push(new ZKEditor(path));
	}	
	
	ZKIDE.listDirectoryAtIn = function listDirectoryAtIn(path, domNode) {
	    fileStore.getMetaData(path, function(error, dirContents)  {
	            //TODO: do something with error
	            var ul = document.createElement('ul');
	            domNode.appendChild(ul);
	            dirContents.forEach(function(dirElement) {
	                    var li = document.createElement('li');
	                    var a = document.createElement('a');
	                    a.setAttribute('href', '#');
	                    if (dirElement.isDirectory) {
	                        a.onclick = function() {
	                            ZKIDE.listDirectoryAtIn(workingDirectory() + dirElement.url, li);
	                        };
	                    } else {
	                        a.onclick = function() {
	                            ZKIDE.open(workingDirectory() + dirElement.url);
	                        };
	                    }
	                    var aText = document.createTextNode(dirElement.name);
	                    a.appendChild(aText);
	                    li.appendChild(a);
	                    ul.appendChild(li);                 
	            });
	    });
	};
	
	ZKIDE.put = function put(path, content, callback) {
	     var xhr = new XMLHttpRequest();
	    xhr.open("PUT", path);
	    xhr.onreadystatechange = function() {
	        if (xhr.readyState != 4)  { return; }
	        var result = xhr.responseText;
	        callback();
	    };
	    xhr.send(content);
	}
	
	
	return ZKIDE;
});
