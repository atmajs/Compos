include
.js('js/mobiscroll.js')//
.css('css/mobiscroll.css').done(function() {

	mask.registerHandler(':timePicker', Compo({
		renderStart: function() {
			this.tagName = 'div';
		},
		onRenderEnd: function(){
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
