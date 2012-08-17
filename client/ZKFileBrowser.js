Apart.define('ZKFileBrowser', ['raw@ZKFileBrowser.html', 'ZKIDE', 'fileStore', 'ZKEditor'], function(template, ZKIDE, fileStore, ZKEditor) {
        var templates = {loaded: false};
        
        function ZKFileBrowser(aPath, aDomElement) {
            var doc = aDomElement.ownerDocument;
            if (!template.loaded) {
                aDomElement.innerHTML = template;
                aDomElement = doc.getElementById('fileBrowserDiv');
                extractTemplatesFromElement(aDomElement);
                templates.loaded = true;
            }
            listDirectoryAtIn(aPath, aDomElement);
        };
        
        ZKFileBrowser.prototype.constructor = ZKFileBrowser;
        
        ZKFileBrowser.prototype.addFileClicked =  function addFileClicked(anEvent, anHTMLElement) {
            var currentElement = anHTMLElement;
            var defaultValue = null;
            while ( defaultValue == null && currentElement != null ) {
                if ( currentElement instanceof HTMLAnchorElement) {
                    defaultValue = currentElement.href;
                }
                currentElement = currentElement.parentNode;
            }
            var pathToCreate = anHTMLElement.ownerDocument.defaultView.prompt(
                'Enter the path to create', defaultValue);
        };
        
        ZKFileBrowser.prototype.directoryClicked = function (anEvent, anHTMLElement) {
            toggleSelectedClass(anHTMLElement);
            anEvent.stopPropagation();
            anEvent.preventDefault();
        };
        
        ZKFileBrowser.prototype.directoryDblClicked = function (anEvent, anHTMLAnchorElement) {
            listDirectoryAtIn(anHTMLAnchorElement.href, anHTMLAnchorElement.parentNode);
            anEvent.stopPropagation();
            anEvent.preventDefault();
        };        
        
        ZKFileBrowser.prototype.fileClicked = function (anEvent, anHTMLElement) {
            toggleSelectedClass(anHTMLElement);
            anEvent.stopPropagation();
            anEvent.preventDefault();
        };
        
        ZKFileBrowser.prototype.fileDblClicked = function (anEvent, anHTMLAnchorElement) {
            new ZKEditor(anHTMLAnchorElement.href);
            anEvent.stopPropagation();
            anEvent.preventDefault();
        };
        
        function resolveTemplate(aString, anObject) {
            return aString.replace(/(\{\{|%7B%7B)(\w*)(\}\}|%7D%7D)/g, function(match, prefix, key, suffix) {
                return anObject.hasOwnProperty(key) ? anObject[key]: "";
            });
        }
        
        function extractTemplatesFromElement(aDomElement) {
            var children = aDomElement.children;
            var templateNodes = [];
            for(var i = 0; i < children.length; i++) {
                extractTemplatesFromElement(children[i]);
                if (children[i].hasAttribute('id') && /.*Template/.test(children[i].id)) {
                    templateNodes.push(children[i]);
                }
            }
            templateNodes.forEach(function(node) {          
                node.parentNode.removeChild(node);
                var templateName = (node.id.match(/(.*)Template$/))[0];                
                templates[templateName] = node.outerHTML;
            });
        }
        
        function toggleSelectedClass(aNode) {
            var classesString = aNode.getAttribute('class');
            var classes;
            if (classesString) {
                classes = classesString.split(/\s+/);
            } else {
                classes = [];
            }
            var i = classes.indexOf('selected');
            var result;
            if (i > -1) {
                classes = classes.filter(function(x) {
                        return x != "selected";
                });
            } else {
                classes.push('selected');
            }
            aNode.setAttribute('class', classes.join(' '));
        }
        
        function listDirectoryAtIn (path, domElement) {            
            var childLists = domElement.getElementsByTagName('ul');
            if (childLists !== undefined && (childLists.length > 0)) {
                var ulChild = childLists[0];
                ulChild.parentNode.removeChild(ulChild);
                return;
            }
    
            var ul = domElement.ownerDocument.createElement('ul');
            var listNode = domElement.appendChild(ul);
            fileStore.getMetaData(path, function(error, dirContents)  {
                    //TODO: do something with error
                    dirContents.forEach(function(dirElement) {
                            var template = dirElement.isDirectory ? templates.directoryTemplate : templates.fileTemplate;
                            var data = {
                                        name: dirElement.name,
                                        url: dirElement.url};
                            var html =  resolveTemplate(template, data);
                            var range = document.createRange();
                            range.selectNodeContents(listNode);
                            range.collapse(false);
                            var frag = range.createContextualFragment(html);
                            listNode.appendChild(frag);       
                    });
            });
	};
        
        return ZKFileBrowser;
});
