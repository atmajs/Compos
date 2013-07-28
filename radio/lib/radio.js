mask.registerHandler(':radio', mask.Compo({
    tagName: 'div',
    attr: {
        'class': '-radio'
    },
    
    findItems: function(){
        if (this.attr.selector == null)
            return this.$.children();
        
        return this.$.find(this.attr.selector);
    },
    
    onRenderEnd: function(){
        this.findItems().on('click', function(event) {
			debugger;
			
            var $this = $(event.currentTarget);
            if ($this.hasClass('active'))
                return;
            
            $this
                .parent()
                .children('.active')
                .removeClass('active');
                
            $this
                .addClass('active');
                
            $this
                .parent()
                .trigger('changed', event.currentTarget);
        });
    },
    
    setActive: function(name){
        var $el = this.$.find('[name="'+name+'"]');
        
        if ($el.hasClass('active'))
            return;
        
        if ($el.length === 0)
            console.error('[:radio] Item not found', name);

        $el
            .parent()
            .children('.active')
            .removeClass('active');
            
        $el
            .addClass('active');
    },
    
    getActiveName: function(){
        return this.$.find('.active').attr('name');
    },
    
    getList: function(){
        var array = [];
		this.findItems().each(function(index, $x){
			array.push($x.getAttribute('name'));
		});
		
		return array;
    }
}));