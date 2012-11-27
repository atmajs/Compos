include.js('prism.lib.js').css('prism.lib.css').done(function() {
    
    function IDeferred(){}    
    IDeferred.prototype = {
        resolve: function(){
            this.done = function(fn){
                fn();
            }
            if (this.callbacks){
                for(var i = 0, x, length = this.callbacks.length; x = this.callbacks[i], i<length; i++){
                    x()
                }
            }
            delete this.callbacks;
        },
        done: function(fn){
            (this.callbacks || (this.callbacks = [])).push(fn);
        }
    }
    
    
    function highlight(compo){
        Prism.highlightElement(compo.$.find('code').get(0));
        
        compo.resolve();
    }
    
    mask.registerHandler('prism', Class({
        Base: Compo,
        Extends: IDeferred,
        Construct: function() {
            this.attr = { language: 'javascript' };            
        },
        render: function(values, container, cntx) {
            this.tagName = 'pre';
            
            var _class = 'language-' + this.attr.language;            
            this.attr.class = _class + ' ' + (this.attr.class || '');            
            this.nodes = {
                tagName: 'code',
                attr: {
                    class: _class
                },
                nodes: this.nodes
            };
            
            Compo.prototype.render.call(this, values, container, cntx);

            if (this.attr.src != null) {
                var _this = this;
                window.include.ajax(this.attr.src).done(function(r) {
                    _this.$.find('code').text(r.ajax[0]);                    
                    
                    highlight(_this);                    
                });
            }else {
                highlight(this);
            }
        }
    }));
});