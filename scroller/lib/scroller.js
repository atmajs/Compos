

include
	
	.client()
	.js('iscroll-full.js')
	
	.done(function() {

		
		var Scroller = Compo({
			tagName: 'div',
			slots: {
				domInsert: function() {
					if (this.scroller == null) {
						this.scroller = new window.iScroll(this.$[0], {
							vScrollbar: true,
							hScrollbar: true,
							hideScrollbar: true,
							fadeScrollbar: true
						});
	
						if (this.attr.scrollTo) {
							this.scroller.scrollTo(0, this.attr.scrollTo | 0);
						}
					}
				}
			},
			onRenderStart: function(model, container, cntx) {
				
				this.tagName = 'div';
				this.attr['class'] = (this.attr['class'] ? this.attr['class'] + ' ' : '') + 'scroller';
				this.nodes = {
					tagName: 'div',
					attr: {
						'class': 'scroller-container'
					},
					nodes: this.nodes
				};
	
			},
			dispose: function() {
				if (this.scroller) {
					this.scroller.destroy();
				}
			}
		});
		
		// obsolete
		mask.registerHandler('scroller', Scroller);
		
		mask.registerHandler(':scroller', Scroller);
		
	});
