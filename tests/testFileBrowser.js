function doTest(QUnit, sut) {
    "use strict";
  
  	QUnit.config.autostart = false;
  
  	QUnit.test("Opening root shows 8 entries", function() {
            QUnit.equal(sut.$(".directoryEntryView").length, 8);
    }); /*
  
  	QUnit.asyncTest("Double clicking first shows an extra element (Apart folder)", function() {
          QUnit.expect(1);
          sut.fileBrowserView.once('FBFileBrowser.directoryListed', function(directoryEntryView) {
          	  QUnit.equal(sut.$(".directoryEntryView").length, 9);
              QUnit.start();
          });
          sut.Syn.dblclick({}, sut.$(".directoryEntryView")[0]);
    }); */
  
    QUnit.asyncTest("should fetch comments from server", function () {
      	var server = sut.sinon.sandbox.useFakeServer();
    	server.respondWith("GET", "/apart/",
                       [200, 
                        {'Content-Type': 'text/plain'},
            	  		'[{"name":"apart.js","url":"/apart/apart.js","isDirectory":false}]']);      
        sut.fileBrowserView.once('FBFileBrowser.directoryListed', function(directoryEntryView) {
          	QUnit.equal(sut.$(".directoryEntryView").length, 9);
            QUnit.start();
        });
        sut.Syn.dblclick({}, sut.$(".directoryEntryView")[0]); 
      	window.setTimeout(function() {
    	    server.respond();
        }, 500);   
    });
  
  	window.setTimeout(function() {
    	    sut.close();
    }, 5000);   
}


var sut = window.open('../client/zkide.html');
var loading = false;
var intervalID = window.setInterval(function () {
    if (!loading && sut.document && sut.document.readyState === "complete" && sut.fileBrowserView) {
      	appendScript(sut.document, '../tests/lib/syn.js');
      	appendScript(sut.document, '../tests/lib/sinon.js');
      	loading = true;
    }
    if (loading
           && isDefined('Syn.init.prototype._drag', sut)
           && isDefined('sinon', sut)) {
      	window.clearInterval(intervalID);    
        doTest(window.QUnit, sut);
    }
}, 10);

function appendScript(document, scriptSrc) {  
    var scriptElement = document.createElement('script');
    scriptElement.src = scriptSrc;
    document.head.appendChild(scriptElement);
}

function isDefined(aString, searchIn) {
    var part, parts = aString.split('.');
    reference = searchIn || window;
    while (part = parts.shift()) {
        if ((reference = reference[part]) === undefined) return false;
    }
    return true;
}
