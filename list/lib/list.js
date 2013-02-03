(function() {
	mask.registerHandler('list', Class({
		Base: Compo,
		render: function(model, container, cntx) {
			var property = this.attr.value;
			
			if (property){
				model = Object.getProperty(model, property);
			}
			
			if (model instanceof Array === false) {
				return;
			}

			if (this.attr.template != null) {
				var template = this.attr.template;
				if (template[0] == '#') {
					template = document.querySelector(this.attr.template).innerHTML;
				}
				this.nodes = mask.compile(template);
			}

			if (this.attr.ref != null) {
				console.log(mask.templates, this.attr.ref);
				this.nodes = Compo.findCompo(mask.templates, this.attr.ref).nodes;				
			}

			for (var i = 0, length = model.length; i < length; i++) {
				mask.render(this.nodes, model[i], container, cntx);
			}

			this.$ = $(container);
			
			if (container instanceof Array){
				Compo.shots.on(this, 'DOMInsert',function(){
					this.$ = this.$.parent();
				});
			}
		},
		add: function(values) {
			var dom = mask.render(this.nodes, values, null, this),
				container = this.$ && this.$.get(0);

			
			if (!container) {
				return;
			}


			if ('id' in values) {
				var item = container.querySelector('[data-id="' + values.id + '"]');
				if (item) {
					item.parentNode.replaceChild(dom, item);
					return;
				}
			}
			container.appendChild(dom);
		}
	}));
}());