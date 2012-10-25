include
.js('js/mobiscroll.js')//
.css('css/mobiscroll.css').done(function() {

	mask.registerHandler('timePicker', Class({
		Base: Compo,
		render: function(values, container, cntx) {
			this.tagName = 'div';
			Compo.prototype.render.call(this, values, container, cntx);
			

			this.$.scroller({
				preset: 'time',
                theme: 'android-ics',
                display: 'inline',
                mode: 'scroller',
                timeFormat:'HH:ii',
                timeWheels: 'HHii'
			});

		}
	}));
});