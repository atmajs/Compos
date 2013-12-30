include
	.js('./node_modules/switchery/dist/switchery.js')
	.css('./node_modules/switchery/dist/switchery.css')
	.done(function(){

		mask.registerHandler('switchery:checkbox', mask.Compo({

			_switchery: null,

			tagName: 'input',
			attr: {
				type: 'checkbox'
			},

			onRenderEnd: function(elements){

				var params = {},
					color = this.attr['x-color'],
					secondaryColor = this.attr['x-secondary-color'],
					disabled = this.attr['disabled']
					;

				if (color)
					params.color= color;
				
				if (secondaryColor)
					params.secondaryColor= secondaryColor;
				
				if (disabled != null)
					params.disabled= disabled;

				this._switchery = new Switchery(elements[0], params)
			}
		}));
	})