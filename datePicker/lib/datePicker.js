include.js('js/glDatePicker.min.js').css('css/android.css').done(function() {

	mask.registerHandler(':datePicker', Compo({

		renderStart: function(values, container, cntx) {
			this.tagName = 'div';
		},
		onRenderEnd: function(){
			this.$.glDatePicker({
				cssName: 'android',
				allowOld: false,
				showAlways: true,
				position: 'static',
				selectedDate: this.date,
				onChange: function(sender, date){
					this.setDate(date);
					this.$.trigger('change', date);
				}.bind(this)
			});
		},
		setDate: function(date){
			this.date = date;
			if (this.$ != null){
				this.$.glDatePicker('setSelectedDate',date);
				this.$.glDatePicker('update');
			}
        },
		dispose: function(){
			this.$.glDatePicker('remove');
		},
		getDate: function(date){
			return this.date;
		}
	}));
});
