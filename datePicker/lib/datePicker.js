include.js('js/glDatePicker.min.js').css('css/android.css').done(function() {

	mask.registerHandler('datePicker', Class({
		Base: Compo,
		render: function(values, container, cntx) {
			this.tagName = 'div';
			Compo.render(this, values, container, cntx);
			
			
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
		getDate: function(date){
			return this.date;
		}
	}));
});