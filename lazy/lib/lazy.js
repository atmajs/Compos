(function(mask){
	
	if (mask == null) 
		mask = atma.mask;
	
	
	mask.registerHandler(':lazy', mask.Compo({
		mode: 'server',
		_deferredNodes: null,
		onRenderStart: function(model, ctx, container){
			
			this._deferredNodes = this.nodes;
			
			this.nodes = null;
			this.model = model;
			this.ctx = ctx;
			this.container = container;
			this.placeholder = document.createComment('');
			
			container.appendChild(this.placeholder);
		},
		
		resolveLazy: function(){
			this.lazyShow = function(){};
			
			var fragment = mask.render(this._deferredNodes, this.model, this.ctx, null, this),
				that = this;
			
			if (this.ctx.async) {
				this.ctx.done(function(fragment){
					that._appendLazy(fragment);
				});
			}
			
			that._appendLazy(fragment);
			that.emitIn('domInsert');
		},
		
		_appendLazy: function(fragment){
			this.placeholder.parentNode.insertBefore(fragment, this.placeholder);
		}
	}));
	
}(typeof mask === 'undefined' ? null : mask));