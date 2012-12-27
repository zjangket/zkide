Apart.define("zkeditor/ZKEditorKeyBindings", function() {
    CodeMirror.keyMap.zkide = {
        "Ctrl-S": function(cm) {cm.zkeditor.save()},
        "Tab": function(cm) {
            CodeMirror.commands[cm.getSelection().length ? "indentMore" : "insertTab"](cm);
        },
        fallthrough: "pcDefault"
    };
});
