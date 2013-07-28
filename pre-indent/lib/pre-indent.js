(function(){
	var _cache_Regexp = {};
	
	function PreIndent() {}
	
	PreIndent.prototype = {
		mode: 'server',
		renderStart: function(values, container, cntx) {
			if (this.nodes == null) {
				return;
			}
	
			for (var i = 0, x, imax = this.nodes.length; i < imax; i++) {
				x = this.nodes[i];
	
				if (x.content) {
					x.content = str_trimTrailings(x.content);
				}
			}
		},
		renderEnd: null
	};
	
	mask.registerHandler('pre:indent', PreIndent);

	
	function str_trimTrailings(string) {
		var regexp_trailing = /^[\t ]+(?=[^\r\n\t ]+)/m,
			count,
			match;

		match = regexp_trailing.exec(string);

		if (!match)
			return string;

		count = match[0].length;

		if (_cache_Regexp[count] == null)
			_cache_Regexp[count] = new RegExp('^[\\t ]{1,' + count + '}', 'gm');

		return string.replace(_cache_Regexp[count], '');
	};

}());