Apart.define("ZKEditor", ['fileStore'], function(fileStore) {
        var url;
        var browserWindow;
        
        var ZKEditor = function(path) {
            browserWindow = window.open('./zkeditor.html');
            var editor;
            browserWindow.onload = function() {
                editor = CodeMirror.fromTextArea(browserWindow.document.getElementById("zkTextarea"), {
                    lineNumbers: true});
                browserWindow.document.title = path;            
                if (path) {
                    url = path;
                    fileStore.get(url, function (error, fileContent, metaData) {
                            if (metaData && metaData.contentType) {
                                editor.setOption('mode', metaData.contentType);
                            }
                            editor.setValue(fileContent);
                    });
                }     
            }       
        };
        
        ZKEditor.prototype.getURL = function getURL() {
            return url;
        };
        
        return ZKEditor;
});
