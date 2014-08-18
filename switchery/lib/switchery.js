include
	.setBase('./node_modules/switchery/dist/')
	.js('/switchery.js')
	.css('/switchery.css')
	.done(function(){

		mask.registerHandler(':switchery', mask.Compo({
			tagName: 'input',
			attr: {
				type: 'checkbox',
				color: null,
				secondaryColor: null,
				disabled: null
			},
			slots: {
				domInsert: function(){
					console.log('domInsert');
					this._.setPosition();
				}
			},
			onRenderStart: function(){
				
			},
			onRenderEnd: function(elements){
				console.log(this.attr);
				this._ = new Switchery(elements[0], this.attr);
			},
			
			_: null
		}));
	});