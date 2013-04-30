 include.js({
 	ruqq: ['dom/jquery','utils'],
	lib: 'compo',
	compo: ['binding','validation', 'datepicker']
})
.ready(function(){
	
	window.model = {
		name: 'Alex',
		paths: ['path1.html','path2.html'],
		date: new Date,
		height:10
	}

	mask.registerBinding('pathsProvider', {		
		domWay: {
			get: function(provider){
				return provider.element.value.split('\n');
			},
			set: function(provider, value){
				console.log('path, set', value);
				provider.element.value = value.join('\n');
			}
		}
	});


	mask.registerBinding("heightBinder", {
		domWay: {
			set: function(provider,value){
				provider.element.style.height = value + 'px';
			}
		}
	});

	mask.registerBinding("datePickerProvider", {		
		domWay: {
			get: function(provider){
				console.log('getDate',provider.node.parent);
				return provider.node.parent.getDate();
			},
			set: function(provider, value){
				console.log('setDate', value, typeof value);
				provider.node.parent.setDate(new Date(value));
			}
		}
	});
	
	new Compo(document.querySelector('#layout').innerHTML).render(model, null, {
		onclick: function(){
			alert(';clicked');
		}
	}).insert(document.body);
	
});
