Apart.define('zkfilebrowser/FBView', 
             ['model/model', 
              'zkeditor/ZKEditor', 
              'zkmenu/ZKMenuView'], 
             function (model, ZKEditor, zkmenu) {
               
    var view = {};
    
    view.FBFileBrowserView = Backbone.View.extend({
        el: '#fileBrowser',
        
        rootDirView: null,

        initialize: function (options) {
            if (options.rootDir === null || options.rootDir.constructor === null || options.rootDir.constructor !== model.ZKDirectory) {
                throw new Error('Needs to be constructed with a model.ZKDirectory rootDir attribute');
            }
            this.rootDirView = new view.FBDirectoryView({model: options.rootDir});
          	this.rootDirView.setFileBrowserView(this);
            this.render();
        },
        
        render: function () {
            $('#fileBrowser').append(this.rootDirView.el);
            this.rootDirView.render();
        }
    });
    
    view.FBDirectoryView = Backbone.View.extend({
        tagName: 'ul',
        
        entryViews: null,
      
      	fileBrowserView: null,

        initialize: function () {
            this.entryViews = [];
            this.model.getEntries().bind('add', _.bind(this.addViewForEntry, this));
            this.model.getEntries().bind('remove', _.bind(this.rerender, this));
        },
      
        setFileBrowserView: function (view) {
            this.fileBrowserView = view
        },

        render: function () {
          	var self = this;
            this.model.getEntries().forEach(function (directoryEntry) { 
                self.addViewForEntry(directoryEntry); 
            });
        },
      
        rerender: function () {
            this.$el.html('');
            this.render();
        },
      
      
        addViewForEntry: function (aDirectoryEntry) {
          	var constructor = aDirectoryEntry.isDirectory() ?
                    view.FBDirectoryDirectoryEntryView : view.FBFileDirectoryEntryView;
            var entryView = new constructor({model: aDirectoryEntry});            
            entryView.setFileBrowserView(this.fileBrowserView);
            this.entryViews.push(entryView);
            this.$el.append(entryView.$el);
            entryView.render(); 
        }
    });
    
    view.FBDirectoryEntryView = Backbone.View.extend({
        template: _.template($("#template-FBDirectoryEntryView").html()),

        tagName: 'li',
      
        menuView: null,
      
      	fileBrowserView: null,

        render: function () {
            var html = this.template({
                name: this.model.get('name'),
                url: this.model.url()
            });
            this.$el.html(html);
        },
      
        setFileBrowserView: function (view) {
            this.fileBrowserView = view
        },
        
        stopEventCompletely: function (event) {
            event.stopPropagation();
            event.preventDefault();
        },
      
        doToggleContextMenu: function (event) {
            if (this.menuView === null) {
                this.menuView = new zkmenu.ZKMenuView({$targetEl: this.$('div').first()});
                this.addMenuItems();
                this.menuView.open();
            } else {
                this.menuView = null;
            }
            this.stopEventCompletely(event);
        },
      
        addMenuItems: function () {
        }
    });
    
    view.FBDirectoryDirectoryEntryView = view.FBDirectoryEntryView.extend({      
        className: 'directory',
        
        directoryView: null,
        
        initialize: function () {
        },
        
        events: {
            'click div:first-child': 'doSelect',
            'dblclick div:first-child': 'doList',
            'tap div:first-child': 'doList',
          	'click div:first-child img': 'doToggleContextMenu'
        },
        
        render: function (){
            view.FBDirectoryEntryView.prototype.render.call(this);
            if (this.directoryView != null) {
                this.$el.append(this.directoryView.$el);
                this.directoryView.render();
            }
        },
        
        doSelect: function (event) {
            this.stopEventCompletely(event);
        },
        
        doList: function (event) {
            var self = this;
            if (self.directoryView != null) {
                self.directoryView.remove();
                self.directoryView = null;
            } else {
                this.model.fetchEntries({
                    success: function() {
                        self.directoryView = new view.FBDirectoryView({model: self.model});                                 
                        self.directoryView.setFileBrowserView(this.fileBrowserView);
                        self.$el.append(self.directoryView.$el);
                        self.directoryView.render();
                        self.fileBrowserView.trigger('FBFileBrowser.directoryListed', self);
                    }
                });
            }
            this.stopEventCompletely(event);
        },
      
        doCreateFile: function (event) {
          	var targetWindow = this.el.ownerDocument.defaultView;
            var name = targetWindow.prompt('Enter a filename for the new file');
            if (name != null) {
                var file = this.model.createFileNamed(name);
            }
        },
      
        addMenuItems: function () {
            this.menuView.addItem({
              caption: 'Create file',
              callback: _.bind(this.doCreateFile, this)
            });
        }
    });
    
    view.FBFileDirectoryEntryView = view.FBDirectoryEntryView.extend({        
        className: 'file',
        
        initialize: function () {
        },
        
        events: {
            'click div:first-child': 'doSelect',
            'dblclick div:first-child': 'doEdit',
            'tap div:first-child': 'doEdit',
          	'click div:first-child img': 'doToggleContextMenu'
        },
        
        doSelect: function (event) {
            this.stopEventCompletely(event);
        },
        
        doEdit: function (event) {
          	new ZKEditor({model:this.model});
            this.stopEventCompletely(event);
        },
      
        addMenuItems: function () {
            this.menuView.addItem({
              caption: 'Delete file',
              callback: _.bind(this.doDeleteFile, this)
            });
        },
      
        doDeleteFile: function (event) {
          	var targetWindow = this.el.ownerDocument.defaultView;
            if (targetWindow.confirm('Are you sure you want to delete ' +  this.model.get('url'))) {
                this.model.destroy();
            }
        },
    });
    
    return view;
});