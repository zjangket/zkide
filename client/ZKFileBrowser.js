Apart.define('ZKFileBrowser', ['ZKIDE', 'fileStore', 'ZKEditor'], function(ZKIDE, fileStore, ZKEditor) {
        function ZKFileBrowser(aDomElement) {
            ZKIDE.fileBrowserOpened(this);
            this.domElement = aDomElement;
        }
        
        ZKFileBrowser.prototype.getDocument = function() {
            return this.domElement.ownerDocument;
        };
        
        ZKFileBrowser.prototype.listDirectory = function(aPath) {
            return this.listDirectoryAtIn(aPath, this.domElement) ;
        };
        
        ZKFileBrowser.prototype.listDirectoryAtIn = function (path, domElement) {
            var childLists = domElement.getElementsByTagName('ul');
            if (childLists.length > 0) {
                domElement.removeChild(childLists[0]);
                return;
            }
    
            var ul = this.getDocument().createElement('ul');
            domElement.appendChild(ul);
            var self = this;
            fileStore.getMetaData(path, function(error, dirContents)  {
                    //TODO: do something with error
                    dirContents.forEach(function(dirElement) {
                            var li = self.getDocument().createElement('li');
                            var style = dirElement.isDirectory ? 'directory' : 'file';
                            li.setAttribute('class', style);
                            var a = self.getDocument().createElement('a');
                            a.setAttribute('href', '#');
                            if (dirElement.isDirectory) {
                                a.onclick = function() {
                                    self.listDirectoryAtIn(dirElement.url, li);
                                };
                            } else {
                                a.onclick = function() {
                                    new ZKEditor(dirElement.url);
                                };
                            }
                            var aText = self.getDocument().createTextNode(dirElement.name);
                            a.appendChild(aText);
                            li.appendChild(a);
                            ul.appendChild(li);                 
                    });
            });
	};
        
        return ZKFileBrowser;
});
