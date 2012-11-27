
include.css('style.css');
void
function() {
    
    var template = "div.overlay > div.wrapper > div.dialog {\
                div.header;\
                div.content {\
                    div.message > '#{message}'\
                    div.buttons {\
                        button.alert-yes;\
                        button.alert-no;\
                    }\
                }\
            }";
    
    mask.registerHandler('dialog', Class({
        render: function(values, container) {
            
        }
    }));
    
    
    var dialogOverlaySingleton = null;
    mask.registerHandler('dialogOverlay', Class({
        Base: Compo,
        Construct: function(){
            return (dialogOverlaySingleton || (dialogOverlaySingleton = this));
        },
        render: function(){
            
            this.nodes = {
                tagName: 'div',
                attr: {
                    class: 'dialogOverlay'
                }
            }
            
            this.render = function(){};
        }
    }));
}();