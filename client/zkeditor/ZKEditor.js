Apart.define("zkeditor/ZKEditor", ['ZKIDE'], function(ZKIDE) {
  
    return Backbone.View.extend({
        el: '#zkTextarea',
      
        codeMirrorConfiguration: {
            lineNumbers: true,
            matchBrackets: true,
            keyMap: "zkide",
            onGutterClick: CodeMirror.newFoldFunction(CodeMirror.braceRangeFinder)
        },
      
        codeMirrorEditor: null,
      
        browserWindow: null,

        initialize: function (options) {
          	this.url = options.url;
            ZKIDE.editorOpened(this);
            this.browserWindow = ZKIDE.openInNewWindow('./zkeditor/zkeditor.html');
            var self = this;
            var thisCopyModelStateToCodeMirrorEditor = _.bind(this.copyModelStateToCodeMirrorEditor, self);
            this.model.fetch({
                success: thisCopyModelStateToCodeMirrorEditor
            });
            this.browserWindow.onload = function() {
                self.browserWindow.document.title = self.model.get('name');
                var domElement = self.browserWindow.document.getElementById("zkTextarea");            
                var editor = CodeMirror.fromTextArea(domElement, self.codeMirrorConfiguration);
              	//editor.setOption('onGutterClick', CodeMirror.newFoldFunction(CodeMirror.indentRangeFinder));
                editor.zkeditor = self;
                self.codeMirrorEditor = editor;
                thisCopyModelStateToCodeMirrorEditor();
            }
        },
      
        getCodeMirrorContent: function () {
            return this.codeMirrorEditor.getValue();
        },
      
        copyModelStateToCodeMirrorEditor: function () {
            if (this.codeMirrorEditor != null &&
               		this.model.get('content') !== undefined) {
                this.codeMirrorEditor.setOption('mode', this.model.get('contentType'));
                this.codeMirrorEditor.setValue(this.model.get('content'));
                this.foldToOneLevel();
            }
        },
      
        foldToOneLevel: function () {
            var lineCount = this.codeMirrorEditor.lineCount();
          	var currentLine = 0;
        },
      
        save: function () {
            this.model.set('content', this.getCodeMirrorContent());
            this.model.save();
        }
    });
});
