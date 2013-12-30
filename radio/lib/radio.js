(function(){
	
	function route_current(route, path) {
		var query = path.indexOf('?');
		if (query !== -1) 
			path = query.substring(0, query);
		
		var _parts = route.split('/'),
			_index = _parts.length - 1,
			_default = _parts[_index];
		
		_parts = path.split('/');
		
		return _index < _parts.length
			? _parts[_index]
			: _default;
	}
	
	mask.registerHandler(':radio', mask.Compo({
		tagName: 'div',
		attr: {
			// add manually appropriate class
			//-'class': '-radio'
		},
		
		findItems: function(){
			if (this.attr.selector == null)
				return this.$.children();
			
			return this.$.find(this.attr.selector);
		},
		
		renderStart: function(model, ctx){
			
			if (this.attr['as']) {
				this.tagName = this.attr['as'];
			}
			
			if (this.attr['x-route']) {
				var path = ctx.req && ctx.req.url;
				if (path == null && typeof location !== 'undefined') 
					path = location.pathname;
			
				this.visible = route_current(this.attr['x-route'], path);
				this.attr['x-route'] = null;
			}
		},
		
		onRenderEnd: function(){
			
			this
				.findItems()
				.on('click', function(event) {
					
					
					
					var $this = $(event.currentTarget);
					if ($this.hasClass('active'))
						return;
					
					$this
						.parent()
						.children('.active')
						.removeClass('active');
						
					$this
						.addClass('active');
						
					var $parent = $this
						.parent();
					
					// obsolete, to support generic HTML 'change' event
					$parent.trigger('changed', event.currentTarget);
					
					$parent.trigger('change', event.currentTarget);
					
				});
		},
		
		onRenderEndServer: function(elements, model, cntx){
				
			if (this.visible) {
				var sel = '[name="'
					+ this.visible
					+ '"]';
					
				var pane = elements[0].querySelector(sel);
				if (pane) 
					pane.classList.add('active');
			}
			
		},
		
		setActive: function(name){
			var $el = this.$.find('[name="'+name+'"]');
			
			if ($el.hasClass('active'))
				return;
			
			if ($el.length === 0)
				console.error('[:radio] Item not found', name);
	
			$el
				.parent()
				.children('.active')
				.removeClass('active');
				
			$el
				.addClass('active');
		},
		
		getActiveName: function(){
			return this.$.find('.active').attr('name');
		},
		
		getList: function(){
			var array = [];
			this.findItems().each(function(index, $x){
				array.push($x.getAttribute('name'));
			});
			
			return array;
		}
	}));
	

}());
