Apart.define('zkfilebrowser/ZKFileBrowser2', function() {
	return Backbone.View.extend({
   		template: _.template($("#template-fileBrowser").html()),
      
   		el: $('#fileBrowser'),
       
		initialize: function(){
  	 		this.render();
   		},
      	 
      	render: function() {
       		$(this.el).append("<span id='fileMenuItem'>File</span>");
           	var html = this.template({test: 'world'});
           	$(this.el).html(html);
        }
   	}); 
});