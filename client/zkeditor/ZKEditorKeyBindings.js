Apart.define("zkeditor/ZKEditorKeyBindings", function() {
    CodeMirror.keyMap.zkide = {
        "Ctrl-S": function(cm) {cm.zkeditor.save()},
        fallthrough: "pcDefault"
    };
});
