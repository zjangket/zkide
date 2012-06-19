(function (exports) {

Function.prototype.inheritsFrom = function( parentClassOrObject ){ 
    if ( parentClassOrObject.constructor == Function ) { 
		//Normal Inheritance 
		this.prototype = new parentClassOrObject();
		this.prototype.constructor = this;
		this.prototype.parent = parentClassOrObject.prototype;
	} 
	else { 
		//Pure Virtual Inheritance 
		this.prototype = parentClassOrObject;
		this.prototype.constructor = this;
		this.prototype.parent = parentClassOrObject;
	} 
	return this;
};

var Async = {};
Async.forEach = function(anArray, iterator, callback) {
    if (anArray === null || anArray.length === 0 ) {
        callback();
        return;
    }
    
    var times = anArray.length;
    anArray.forEach(function (x) {
        iterator(x, function(err) {
            if(err) {
                var tmp = callback;
                callback = function() {};
                tmp(err);
            } else {
                times--;
                if (times === 0) {
                    var tmp2 = callback;
                    callback = function() {};
                    tmp2();
                }
            }
        });
    });
};
    
Async.map = function(anArray, iterator, callback) {
    var results = new Array(anArray.length);
    Async.forEach(anArray, function (x, finishedCallback) {
        iterator(x, function(err, mappedElement) {
            if (err) {                
                finishedCallback(err);
            } else {
                //To fix: very imperformant
                results[anArray.indexOf(x)] = mappedElement;
                finishedCallback();
            }
        });},
        function (err) {
            if (err) {
                callback(err, null);
            } else {
                callback(null, results);
            }
        });
};

exports.Async = Async;

(function() {
    var Apart = {};
    var loadingModules = Apart.loadingModules = {};
    var loadedModules = Apart.loadedModules = {};
        
    function load(aDependency, finishedCallback) {
        if (loadedModules[aDependency] !== undefined) {
            finishedCallback(null,loadedModules[aDependency]);
            return;
        }
        if (loadingModules[aDependency] === undefined) { 
            loadingModules[aDependency] = finishedCallback;
            var s = window.document.createElement('script');
            if (Apart.root) {
               s.src = Apart.root + aDependency + '.js'; 
            } else {
                s.src = aDependency + '.js';
            }
            window.document.head.appendChild(s);
        } else {
            var tmp = loadingModules[aDependency];
            loadingModules[aDependency] = function(error, mappingResult) {
                tmp(error, mappingResult);
                finishedCallback(error, mappingResult);
            };
        }
    }
    
    
    function define(id, dependencies, factory) {
        if (arguments.length === 2) { //no dependencies
            return define(arguments [0], [], arguments[1]);
        }
        
        if (loadedModules[id] !== undefined) {
            throw new Error(id + ' already defined');
        }
        
        Async.map(dependencies, load, function(error, deps) {
            if (error) {
                throw new Error(error);
            }
            loadedModules[id] = factory.apply(this, deps);
            if (loadingModules[id] !== undefined) {
                var tmp = loadingModules[id];
                loadingModules[id] = undefined;
                tmp(null, loadedModules[id]);
            }
        });    
    }
    
    function require(dependencies, callback) {
        Async.map(dependencies, load, function(error, deps) {
            if (error) {
                throw new Error(error);
            }
            callback.apply(this, deps);
        });
    }
    
    Apart.define = define;
    Apart.require = require;
    exports.Apart = Apart;
})();
})(window);
