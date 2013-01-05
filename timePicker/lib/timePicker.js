include
.js('js/mobiscroll.js')//
.css('css/mobiscroll.css').done(function() {

	mask.registerHandler('timePicker', Class({
		Base: Compo,
		render: function(model, container, cntx) {
			this.tagName = 'div';
			Compo.render(this, model, container, cntx);
			

			this.$.scroller({
				preset: this.attr.preset || 'time',
                theme: 'android-ics',
				display: 'inline',
                mode: 'scroller',
                timeFormat:'HH:ii',
                timeWheels: 'HHii'
			});
		}
	}));
});