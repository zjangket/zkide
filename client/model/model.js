Apart.define('model/model', function () {
    var model = {};
    model.ZKDirectoryEntry = Backbone.Model.extend({
    	defaults: {name: null}
    });
    
    model.ZKDirectoryEntries = Backbone.Collection.extend({
    	model: model.ZKDirectoryEntry,
      
      	comparator: function (x, y) {
          	if (x.isDirectory() && !y.isDirectory()) { return -1; }
            if (y.isDirectory() && !x.isDirectory()) { return 1; }
            return x.get('name').localeCompare(y.get('name'));
        },
    	
    	parse: function (response, xhr) {
          	return _.map(response, function(x) {
                return new (x.isDirectory ? model.ZKDirectory : model.ZKFile)(x)
            });
    	},
    	
    	isDirectory: function () {
    	    throw Error('Should be overridden in sub models');
    	}
    });
    
    model.ZKFile = model.ZKDirectoryEntry.extend({    	
        contentType: null,
      
    	isDirectory: function () {
    	    return false;
    	},
        
        initialize: function () {
            this.id = this.get('name');
        },
      
        fetch: function (options) {
            var newOptions = _.extend(options || {}, {dataType: "something-unparseable"});
            Backbone.Model.prototype.fetch.call(this, newOptions);
        },
        
        parse: function (response, xhr) {
          	return {
              name: this.get('name'), //the name of a file is immutable and part of it's URL
              contentType: xhr.getResponseHeader('content-type'),
              content: xhr.responseText
            }
        },
        
        save: function (options) {
            var newOptions = _.extend(options || {}, {
              	data: this.get('content'),
                contentType: this.get('contentType')
            });
            return Backbone.Model.prototype.save.call(this, {}, newOptions);
        }
    });
    
    model.ZKDirectory = model.ZKDirectoryEntry.extend({
        defaults: {
            urlSuffix: null,
            entries: null,
        },
        
        initialize: function() {
            var entries = new model.ZKDirectoryEntries();
            if (this.get('url') !== undefined) { 
                entries.url = this.get('url');
            } else { 
                entries.url = (this.get('urlSuffix') !== null ? this.get('urlSuffix') : '/');
            }
            this.set('entries', entries);            
        },
        
    	isDirectory: function () {
    	    return true;
    	},
      
        getEntries: function () {
            return this.get('entries');
        },
      
        fetchEntries: function () {
            Backbone.Collection.prototype.fetch.apply(this.getEntries(), arguments); 
        },
      
        createFileNamed: function(aString) {
            var file = new model.ZKFile({name: aString})
            this.getEntries().add(file);
            file.save();
            return file;
        }
    });
    return model;
});