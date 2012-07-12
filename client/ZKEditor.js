Apart.define("ZKEditor", ['ZKIDE', 'fileStore'], function(ZKIDE, fileStore) {
        
        var codeMirrorConfiguration= {
            lineNumbers: true,
            keyMap: "zkide"
        };
        
        function ZKEditor(path) {
            ZKIDE.editorOpened(this);
            function initializeCodeMirrorEditor(zkeditor, domId) {
                var domElement = zkeditor.browserWindow.document.getElementById(domId);            
                var editor = CodeMirror.fromTextArea(domElement, codeMirrorConfiguration);
                editor.zkeditor = zkeditor;
                zkeditor.codeMirrorEditor = editor;
            }
            
            this.url = path;
            this.browserWindow = window.open('./zkeditor.html');
            this.codeMirrorEditor = null;
            var self = this;
            this.browserWindow.onload = function() {
                initializeCodeMirrorEditor(self, "zkTextarea");         
                if (self.url) {
                    self.browserWindow.document.title = self.url;   
                    fileStore.get(self.url, function (error, fileContent, metaData) {
                            if (metaData && metaData.contentType) {
                                self.codeMirrorEditor.setOption('mode', metaData.contentType);
                            }
                            self.codeMirrorEditor.setValue(fileContent);
                    });
                }     
            }       
        };
        
        ZKEditor.prototype.getContent = function getContent() {
            return this.codeMirrorEditor.getValue();
        };
        
        ZKEditor.prototype.getURL = function getURL() {
            return this.url;
        };
        
        ZKEditor.prototype.save = function save() {
            if (!this.url) {
               askUrl();
            }
            var self = this;
            fileStore.save(this.url, this.getContent(), function() {
                    self.browserWindow.alert('file saved');
            });
        };
        
        return ZKEditor;
});
