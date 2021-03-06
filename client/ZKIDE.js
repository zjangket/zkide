Apart.define("ZKIDE", function() {
    var ZKIDE = {};
    var console;
    var editors = [];
    var fileBrowsers = [];
  	var mainWindow;
    
    ZKIDE.start = function start(aWindow) {
        mainWindow = aWindow;
	};
  
    ZKIDE.openInNewWindow = function () {
        return mainWindow.open.apply(null, arguments);
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
