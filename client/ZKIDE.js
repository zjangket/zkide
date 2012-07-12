Apart.define("ZKIDE", function() {
    var ZKIDE = {};
    var console;
    var editors = [];
    var fileBrowsers = [];
    
    ZKIDE.start = function start() {
	};
	
	ZKIDE.fileBrowserOpened = function (browser) {
	    fileBrowsers.push(browser);
	}
	
	ZKIDE.editorOpened = function (editor) {
	    editors.push(editor);
	}
	
	ZKIDE.getEditors = function getEditors(path, content, callback) {
	     return editors;
	}	
	
	return ZKIDE;
});
