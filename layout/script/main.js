include.js({
	lib: 'compo',
	framework: 'dom/zepto'
})
.wait()
.js({
	compo: 'layout'
}).load('/script/view.mask').ready(function(resp){
	
	window.onerror = function(){console.log(arguments);}
	
	var start = Date.now();
	new Compo(resp.load[0]).render().insert(document.body);
	console.log('end', Date.now() - start);
});