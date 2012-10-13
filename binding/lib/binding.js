void
function() {
    mask.registerHandler('visible', Class({
        Extends: mask.ValueUtils.out,
        refresh: function(values, container) {
            container.style.display = this.isCondition(this.attr.check, values) ? '' : 'none';
        },
        render: function(values, container, cntx) {
            this.refresh(values, container);

            if (this.attr.bind) {
                Object.observe(values, this.attr.bind, this.refresh.bind(this, values, container));
            }
            if (this.nodes) {
                mask.renderDom(this.nodes, values, container, cntx);
            }
        }
    }));

    mask.registerHandler('bind', Class({
        Extends: mask.ValueUtils.out,
        refresh: function(values, container, x) {
            if (this.attr.attr) {
                container[this.attr.attr] = x;
                return;
            }
            container.innerHTML = x;
        },
        render: function(values, container, cntx) {
            this.refresh(values, container, Object.getProperty(values, this.attr.value));
            Object.observe(values, this.attr.value, this.refresh.bind(this, values, container));

            if (this.nodes) {
                mask.renderDom(this.nodes, values, container, cntx);
            }
        }
    }));

    mask.registerHandler('list', Class({
        Base: Compo,
        render: function(values, container, cntx) {

            values = Object.getProperty(values, this.attr.value);
            if (values instanceof Array === false) return;

            if (this.attr.template != null) {
				var template = this.attr.template;
                if (template[0] == '#') template = document.querySelector(this.attr.template).innerHTML;
                this.nodes = mask.compile(template);
            }

            for (var i = 0, length = values.length; i < length; i++) {
                mask.renderDom(this.nodes, values[i], container, cntx);
            }

            this.$ = $(container);
        }
    }));

}();