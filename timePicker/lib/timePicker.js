include
	.js('js/mobiscroll.js')
	.css('css/mobiscroll.css')
	.done(function() {
	
		mask.registerHandler(':timePicker', Compo({
			tagName: 'div',
			
			events: {
				'click:': function(event){
					event.stopPropagation();
				}
			},
			onRenderEnd: function(){
				var preset = this.attr.preset || 'time',
					timeFormat = this.attr.format || 'HH:ii',
					timeWheels = timeFormat.replace(/:/g, ''),
					wheels = this.attr.values
					
					;
				
				if (wheels) {
					wheels = [{
						values: wheels.split(',')
					}];
					preset = 'raw';
				}
				
				this.wheels = wheels;
				this.preset = preset;
					
				this.$.scroller({
					preset: preset,
					theme: 'android-ics',
					display: 'inline',
					mode: 'scroller',
					timeFormat: timeFormat,
					timeWheels: timeWheels,
					wheels: wheels
				});
			},
			
			getValue: function(){
				if (this.preset === 'raw') {
					return this.wheels[0].values[this.$.scroller('getValue')];
				}
				
				return this.$.scroller('getDate');
			}
		}));
	});
