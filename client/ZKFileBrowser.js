Apart.define('ZKFileBrowser', ['raw@ZKFileBrowser.html', 'ZKIDE', 'fileStore', 'ZKEditor'], function(template, ZKIDE, fileStore, ZKEditor) {        
        var fileBrowserTemplate;
        var dirTemplateNode;
        var fileTemplateNode;
        
        var fb = function(aPath, aDomElement) {
            var doc = aDomElement.ownerDocument;
            if(fileBrowserTemplate === undefined) {
                aDomElement.innerHTML = template; 
                dirTemplateNode = doc.getElementById('directoryTemplate', aDomElement);
                dirTemplateNode.removeAttribute('id');
                fileTemplateNode = doc.getElementById('fileTemplate', aDomElement);
                fileTemplateNode.removeAttribute('id');
                doc.getElementById('fileBrowserDiv', aDomElement).innerHTML = '';
                fileBrowserTemplate = doc.getElementById('fileBrowserSection', aDomElement);
                aDomElement.innerHTML = '';
            }
            var newFileBrowserSection = fileBrowserTemplate.cloneNode(true);
            aDomElement.appendChild(newFileBrowserSection);
            listDirectoryAtIn(aPath, doc.getElementById('fileBrowserDiv', aDomElement));
        };
        
        function doAddFile() {
            buttonNode = node.getElementsByTagName('button')[0];
            buttonNode.onclick = function() {
                var pathToCreate = domElement.ownerDocument.defaultView.prompt(
                    'Enter the path to create', dirElement.url); 
            }
        }
        
        function toggleSelectedClass(anEvent) {
            var element = anEvent.target;
            var classesString = element.getAttribute('class');
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
            element.setAttribute('class', classes.join(', '));
        }
        
        function listDirectoryAtIn (path, domElement) {            
            var childLists = domElement.getElementsByTagName('ul');
            if (childLists !== undefined && (childLists.length > 0)) {
                var ulChild = childLists[0];
                ulChild.parentNode.removeChild(ulChild);
                return;
            }
    
            var ul = domElement.ownerDocument.createElement('ul');
            domElement.appendChild(ul);
            fileStore.getMetaData(path, function(error, dirContents)  {
                    //TODO: do something with error
                    dirContents.forEach(function(dirElement) {
                            var node;
                            if (dirElement.isDirectory) {
                                node = dirTemplateNode.cloneNode(true);
                                spanNode = node.getElementsByTagName('span')[0]; 
                                spanNode.innerHTML = dirElement.name;
                                spanNode.onclick = function(event) {
                                    toggleSelectedClass(event);
                                    listDirectoryAtIn(dirElement.url, node);
                                }; 
                            } else {
                                node = fileTemplateNode.cloneNode(true);
                                spanNode = node.getElementsByTagName('span')[0];   
                                spanNode.innerHTML = dirElement.name;
                                spanNode.onclick = function(event) {
                                    toggleSelectedClass(event);
                                };
                                spanNode.ondblclick = function() {
                                    new ZKEditor(dirElement.url);
                                };
                            }
                            ul.appendChild(node);                 
                    });
            });
	};
        
        return fb;
});
