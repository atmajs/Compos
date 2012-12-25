(function() {
	mask.registerHandler('list', Class({
		Base: Compo,
		render: function(values, container, cntx) {

			values = Object.getProperty(values, this.attr.value);
			if (values instanceof Array === false) {
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

			for (var i = 0, length = values.length; i < length; i++) {
				mask.renderDom(this.nodes, values[i], container, cntx);
			}

			this.$ = $(container);
			
			if (container instanceof Array){
				Compo.shots.on(this, 'DOMInsert',function(){
					this.$ = this.$.parent();
				});
			}
		},
		add: function(values) {
			var dom = mask.renderDom(this.nodes, values, null, this),
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