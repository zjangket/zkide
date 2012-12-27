Apart.define('zkmenu/ZKMenuView', function () {
    var zkMenu = {};
    
    zkMenu.ZKMenuView = Backbone.View.extend({        
        className: 'popUpMenu',
      
        items: null,
      
        $targetEl: null,

        initialize: function (options) {
          	this.$targetEl = options.$targetEl;
            this.items = [];            
        },
      
        attributes: {
          	tabindex: '888'
        },
      
      	addItem: function (args) {
            var item = new zkMenu.ZKMenuItemView(args);
            item.menuView = this;
            this.items.push(item);
            return item;
      	},
      
      	positionEl: function () {
            var offset = this.$targetEl.offset();
          	this.$el.css({
                position: 'absolute',
              	top: offset.top,
                left: (offset.left + this.$targetEl.width())});
      	},
      
        open: function () {
            this.$targetEl.addClass('hasPopUpMenu');
			this.positionEl();
            this.render();
        },
        
        render: function () {            
            $('body').append(this.el);
            var self = this;
            this.items.forEach(function (itemView) { 
                self.$el.append(itemView.$el);
                itemView.render(); 
            });
            this.$el.focus();
        },
      
        events: {
      		'blur': 'doBlur'
    	},
      
        doBlur: function () {
            this.remove();
            this.$targetEl.removeClass('hasPopUpMenu');
        }
    });
    
    zkMenu.ZKMenuItemView = Backbone.View.extend({
      	tagName: 'button',
      
        className: 'popUpMenuItem',
      
        menuView: null,
      
        attributes: {
                type: 'button',
                height: '1em',
                height: '1em'
        },

        events: {
           'click': 'doExecute'
        },

        render: function () {
            this.$el.html(this.options.caption);
        },
      
        doExecute: function (event) {
            this.options.callback(event);
            this.menuView.doBlur();
        }
    });
    
    return zkMenu;
});