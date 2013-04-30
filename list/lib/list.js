(function() {
	mask.registerHandler('list', Compo({
		renderStart: function(model, cntx, container) {
			var array = Object.getProperty(model, this.attr.value || '.'),
				nodes = this.nodes,
				item = null;

			this.nodes = [];
			this.template = nodes;

			if (array instanceof Array === false) {
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
				this.nodes = jmask(mask.templates).find(this.attr.ref).nodes;
			}

			var Component = mask.Dom.Component;

			for (var i = 0, x, length = array.length; i < length; i++) {
				x = array[i];

				item = new Component();
				item.nodes = nodes;
				item.model = x;
				item.container = container;

				this.nodes[i] = item;
			}
		},
		renderEnd: function(elements, model, cntx, container){
			this.$ = $(container);
		},
		add: function(model) {

			var dom = mask.render(this.template, model, null, null, this),
				container = this.$ && this.$.get(0);


			if (!container) {
				return;
			}


			if ('id' in model) {
				var item = container.querySelector('[data-id="' + model.id + '"]');
				if (item) {
					item.parentNode.replaceChild(dom, item);
					return;
				}
			}
			container.appendChild(dom);
		}
	}));
}());
