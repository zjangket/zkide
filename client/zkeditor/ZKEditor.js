Apart.define("zkeditor/ZKEditor", ['ZKIDE'], function(ZKIDE) {
  
    return Backbone.View.extend({
        el: '#zkTextarea',
      
        codeMirrorConfiguration: {
            lineNumbers: true,
            matchBrackets: true,
            keyMap: "zkide"
        },
      
        codeMirrorEditor: null,
      
        browserWindow: null,

        initialize: function (options) {
          	this.url = options.url;
            ZKIDE.editorOpened(this);
            this.browserWindow = ZKIDE.openInNewWindow('./zkeditor/zkeditor.html');
            var self = this;
            if (self.model) {
                var _ = window._;
                self.model.fetch({
                    success: function () {
                        if (this.codeMirrorEditor != null) {
                          this.copyModelStateToCodeMirrorEditor();
                        } else {
                            window.setTimeout(_.bind(self.copyModelStateToCodeMirrorEditor, self), 500);
                        }
                    }
                });
            }
            this.browserWindow.onload = function() {
                self.browserWindow.document.title = self.model.get('name');
                var domElement = self.browserWindow.document.getElementById("zkTextarea");            
                var editor = CodeMirror.fromTextArea(domElement, self.codeMirrorConfiguration);
                editor.zkeditor = self;
                self.codeMirrorEditor = editor;                
            }
        },
      
        getCodeMirrorContent: function () {
            return this.codeMirrorEditor.getValue();
        },
      
        copyModelStateToCodeMirrorEditor: function () {
            this.codeMirrorEditor.setOption('mode', this.model.get('contentType'));
            this.codeMirrorEditor.setValue(this.model.get('content'))
        },
      
        save: function () {
            this.model.set('content', this.getCodeMirrorContent());
            this.model.save();
        }
    });
});
