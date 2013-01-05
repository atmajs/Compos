(function() {
	mask.registerHandler('visible', Class({
		Extends: mask.ValueUtils.out,
		refresh: function(values, container) {
			container.style.display = this.isCondition(this.attr.check, values) ? '' : 'none';
		},
		render: function(values, container, cntx) {
			this.refresh(values, container);

			if (this.attr.bind) {
				Object.observe(values, this.attr.bind, this.refresh.bind(this, values, container));
			}
			if (this.nodes) {
				mask.renderDom(this.nodes, values, container, cntx);
			}
		}
	}));


	mask.registerHandler('bind', Class({
		refresh: function(values, container, x) {
			if (this.attr.attr != null) {
				container.setAttribute(this.attr.attr, x);
				return;
			}
			if (this.attr.prop != null) {
				container[this.attr.prop] = x;
				return;
			}
			container.innerHTML = x;
		},
		render: function(values, container, cntx) {
			this.refresh(values, container, Object.getProperty(values, this.attr.value));
			Object.observe(values, this.attr.value, this.refresh.bind(this, values, container));

			if (this.nodes) {
				mask.render(this.nodes, values, container, cntx);
			}
		}
	}));

	var Providers = {},
		BindingProvider = null;

	mask.registerBinding = function(type, binding) {
		Providers[type] = binding;
	};


	mask.BindingProvider = BindingProvider = Class({
		Construct: function(model, element, node) {
			//-if (this.__proto__ == BindingProvider.prototype) {
			if (this.constructor == BindingProvider) {
				var type = node.attr.bindingProvider || element.tagName.toLowerCase();

				if (Providers[type] instanceof Function) {
					return new Providers[type](model, element, node);
				} else {
					Object.extend(this, Providers[type]);
				}
			}
			this.node = node;
			this.model = model;
			this.element = element;
			this.property = node.attr.property || 'element.value';
			this.setter = node.attr.setter;
			this.getter = node.attr.getter;
			var event = node.attr.changeEvent || 'change';

			Object.observe(model, node.attr.value, this.objectChanged.bind(this));


			$(element).on(event, this.domChanged.bind(this));

			this.objectChanged();
			return this;
		},
		objectChanged: function(x) {
			if (this.dismiss-- > 0) {
				return;
			}

			if (x == null) {
				x = this.objectWay.get(this.model, this.node.attr.value);
			}

			this.domWay.set(this, x);

			if (x instanceof Array && x.hasObserver !== true) {
				observeArray(x, this.objectChanged.bind(this));
			}
		},
		domChanged: function() {
			var x = this.domWay.get(this);

			if (this.node.validations) {

				for (var i = 0, validation, length = this.node.validations.length; i < length; i++) {
					validation = this.node.validations[i];
					if (validation.validate(x, this.element, this.objectChanged.bind(this)) === false) {
						return;
					}
				}
			}

			this.dismiss = 1;
			this.objectWay.set(this.model, this.node.attr.value, x);
			this.dismiss = 0;
		},
		objectWay: {
			get: function(obj, property) {
				return Object.getProperty(obj, property);
			},
			set: function(obj, property, value) {
				Object.setProperty(obj, property, value);
			}
		},
		/**
		 * usually you have to override this object, while getting/setting to element,
		 * can be very element(widget)-specific thing
		 *
		 * Note: The Functions are static
		 */
		domWay: {
			get: function(provider) {
				if (provider.getter) {
					return provider.node.parent[provider.getter]();
				}
				return Object.getProperty(provider, provider.property);
			},
			set: function(provider, value) {
				if (provider.setter) {
					provider.node.parent[provider.setter](value);
				} else {
					Object.setProperty(provider, provider.property, value);
				}

			}
		}
	});

	function observeArray(arr, callback) {

		/** Note: till now, only one observer can be added */
		Object.defineProperty(arr, 'hasObserver', {
			value: true,
			enumerable: false,
			writable: false
		});

		function wrap(method) {
			arr[method] = function() {
				Array.prototype[method].apply(this, arguments);
				callback(this, method, arguments);
			};
		}

		var i = 0,
			fns = ['push', 'unshift', 'splice', 'pop', 'shift', 'reverse', 'sort'],
			length = fns.length;
		for (; i < length; i++) {
			wrap(fns[i]);
		}
	}

	mask.registerHandler('dualbind', Class({
		render: function(model, container, cntx) {
			if (this.nodes) {
				mask.renderDom(this.nodes, model, container, cntx);
			}

			if (cntx.components) {
				for (var i = 0, x, length = cntx.components.length; i < length; i++) {
					x = cntx.components[i];

					if (x.compoName == 'validate') {
						(this.validations || (this.validations = [])).push(x);
					}
				}

			}

			new BindingProvider(model, container, this);
		}
	}));


}());