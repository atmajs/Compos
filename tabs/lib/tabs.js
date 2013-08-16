
include
	.css('tabs.css');

(function(){
	
	function child_resolve(child) {
		if (child.type === mask.Dom.NODE) 
			return child;
		
		if (child.controller && child.controller.prototype.tagName) 
			return child;
		
		var $col = jmask(),
			$children = jmask(child).children(),
			imax = $children.length,
			i = 0;
			
		for (; i < imax; i++) {
			$col.add(child_resolve($children[i]));
		}
		
		return $col;
	}
	
	function route_current(route, path) {
		var query = path.indexOf('?');
		if (query !== -1) 
			path = path.substring(0, query);
		
		var _parts = route.split('/'),
			_length = _parts.length,
			_default = _parts[_length - 1],
			
			_path = path.split('/');
			
		
		if (_length > _path.length) {
			return _default !== '-'
				? _default
				: null;
		}
		
		var i = _length - 1;
		while (--i > -1) {
			if (_parts[i] === '-')
				break;
			
			// in case we care about parents path
			// '/-/strict/tabName'
			if (_parts[i] !== _path[i]) 
				return null;
		}
		
		return _path[_length - 1];
	}

	mask.registerHandler(':tabs', mask.Compo({
		tagName: 'div',
		attr: {
			'class': '-tabs'
		},
		_children: function($children){
			var $coll = jmask();
			
			if ($children.length === 0)
				return $coll;
			
			for (var i = 0, x, imax = $children.length; i < imax; i++){
				$coll.add(child_resolve($children[i]));
			}
			
			return $coll;
		},
		_items: function(type){
			var klass = '.-tab-' + type;
			
			if (this.$ == null){
				var $children = jmask(this)
					.children(klass)
					.children();
				
				return this._children($children);
			}
			
			if (this.attr.anchors) {
				return this
					.$
					.find('.-tab-panels:eq(0)')
					.find('a[name]');
			}
			
			
			return this
				.$
				.find('.-tab-' + type + 's:eq(0)')
				.children(klass);
		},
		_getHeaders: function(){
			
		},
		
		slots: {
			domInsert: function(){
				
				if (!this.attr.scrollbar) 
					return;
				
				if (!this.attr.visible) 
					return;
				
				this.setActive(this.attr.visible);
			}
		},
		
		renderStart: function(model, cntx){
			
			if (this.attr.anchors) 
				this.attr.scrollbar = true;
			
			if (this.attr.scrollbar) 
				this.attr['class'] += ' scrollbar';
			
			if (this.attr['x-route']) {
				var path = cntx.req && cntx.req.url;
				if (path == null && typeof location !== 'undefined') 
					path = location.pathname;
			
				this.visible = route_current(this.attr['x-route'], path);
				this.attr['x-route'] = null;
				
				this.attr.visible = this.visible;
			}
	
			var $this = jmask(this),
				$panels = $this.children('@panels'),
				$header = $this.children('@header');
	
			$panels.tag('div').addClass('-tab-panels');
			$header.tag('div').addClass('-tab-headers');
	
	
			if (this.attr.anchors == null) {
		
				var x = this._children($panels.children());
				
				if (x.length === 0) {
					console.error('[:tabs] > has no els in @panels tag');
					return;
				}
				
				x.addClass('-tab-panel -hidden');
			}
			
			this
				._children($header.children())
				.addClass('-tab-header -hidden');
		},
		
		onRenderEndServer: function(elements, model, cntx){
			
			if (this.visible && !this.attr.scrollbar) {
				
				var sel = '[name="'
					+ this.visible
					+ '"].-tab-panel';
					
				var pane = elements[0].querySelector(sel);
				if (pane) 
					pane.classList.add('-show');
			}
			
		},
	
		onRenderEnd: function(){
			if (this.attr.scrollbar) {
				this.scroller = this.closest(':scroller');
				this.scroller.on('scroll', '', this._scrolled.bind(this));
			}
			
			
			
			var $headers = this.$.find('.-tab-header');
			if ($headers.length === 0)
				return;
	
			var that = this;
			$headers.on('click', function(event){
	
				var $this = $(event.currentTarget);
				if ($this.hasClass('active'))
					return;
				
	
				var name = $this.attr('name');
	
				that.setActive(name);
				that.$.trigger('change', event.currentTarget);
			});
			
			
			
		},
		
		animate: function(type, panel, callback){
			if (panel == null)
				return;
			
			var animation = this._getAnimation(type);
			
			if (animation == null)
				return;
				
			animation.start(callback, panel);
		},
		_getAnimation: function(ani){
			// cache ?
			var animation;
			for (var i = 0, x, imax = this.components.length; i < imax; i++){
				x = this.components[i];
				if (':animation' === x.compoName && ani === x.attr.id) {
					animation = x;
					break;
				}
			}
			return animation;
		},
		_hide: function($el){
			if (!$el.length)
				return;
			
			if (!this._getAnimation('hide')) {
				$el.removeClass('-show');
				return;
			}
				
			this.animate('hide', $el[0], function(){
				$el.removeClass('-show');
			});
		},
		_show: function($el){
			if (!$el.length){
				this._activeName = '';
				return;
			}
			
			$el.addClass('-show');
			this.animate('show', $el[0]);
	
		},
		_scrolled: function(top, left){
			var scrollTop = this.scroller.$[0].scrollTop + (this.attr.dtop << 0);
			
			var $panels = this._items('panel'),
				min = null,
				$el = null;
				
			for (var i = 0, x, imax = $panels.length; i < imax; i++){
				x = $panels[i];
				
				if (min == null) {
					min = scrollTop - x.offsetTop;
					$el = x;
					continue;
				}
				
				if (Math.abs(x.offsetTop - scrollTop) < min) {
					min = scrollTop - x.offsetTop;
					$el = x;
				}
			}
			
			var name = $el.getAttribute('name');
			
			
			if (name && this._activeName !== name) {
				this._activeName = name;
				
				this.emitOut('-tabChanged', name);
			}
		},
		_scrollInto: function($el){
			this
				.scroller
				.scroller
				.scrollToElement($el[0]);
		},
		_activeName: null,
	
		setActive: function(name){
			
			if (this._activeName === name) 
				return;
			
			this._activeName = name;
	
			var $panels = this._items('panel'),
				$headers = this._items('header');
	
			var $panel = $panels
				.filter('[name="' + name + '"]');
				
			
			if (this.attr.scrollbar) {
				if ($panel.length == 0) {
					console.error('[:tabs] panel not found', name);
					return;
				}
				this._scrollInto($panel);
			}
			else {
			
				if ($panel.hasClass('-show')) 
					return;
					
				this._hide($panels.filter('.-show'));
				this._show($panel);
			}
			
			
			$headers
				.removeClass('-show')
				.children('[name="' + name + '"]')
				.addClass('active');
		},
		has: function(name){
			return this
				._items('panel')
				.filter('[name="'+name+'"]')
				.length !== 0;
		},
		getActiveName: function(){
			return this._activeName;
		},
		
		getList: function(){
			var array = [],
				$panels = this._items('panel'),
				name;
			
			for (var i = 0, $x, imax = $panels.length; i < imax; i++){
				$x = $panels[i];
				
				name = null;
				
				if ($x.getAttribute) 
					name = $x.getAttribute('name');
				
				if (!name) 
					name = $x.attr && $x.attr.name;
				
				if (!name)
					debugger;
				
				array.push(name);
			}
				
				
			return array;
		}
	}));

}());