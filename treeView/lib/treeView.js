
include
    .load('treeView.mask')
    .css('treeView.less')
    .done(function(resp){
        
        mask.registerHandler(':treeView', Compo({
            template: resp.load.treeView,
            
            mode: 'server',
            events: {
                'click: .-treeView-head': function(event){
                    
                    var node = event.currentTarget.parentNode,
                        $node = $(node);
                        
                    if ($node.hasClass('__sub')) {
                        $(node).toggleClass('__sub-hidden');
                        return;
                    }
                    
                    if ($node.hasClass('selected') === false) {
                        this
                            .$
                            .find('.selected')
                            .removeClass('selected')
                            ;
                        $node.addClass('selected');
                        
                        this.$.trigger('change', this, $node);
                    }
                    
                }
            },
            getSelectedPath: function(){
                var $item = this.getSelectedItem(),
                    path = '',
                    $parent = $item;
                
                while (1) {
                    path = $parent.data('tree-id') + (path ? '/' : '') + path;
                    
                    if ($parent.parent().hasClass('-treeView-tree') === false) {
                        break;
                    }
                    
                    $parent = $parent.parent().closest('.-treeView-item');
                    if ($parent.length === 0) {
                        break;
                    }
                    
                }
                
                if (this.rootPath) {
                    return path_combine(this.rootPath, path);
                }
                
                return path;
            },
            getSelectedItem: function(){
                
                return this.$.find('.selected');
            },
            add: function(path, model){
                
                tree_prepairModel(model);
                
                var $item = node_getItem(this.$, path),
                    $sub = $item.children('.-treeView-sub'),
                    $ul = $sub.children('ul');
                
                if ($ul.length === 0) {
                    $item.addClass('__sub');
                    $ul = $('<ul class="-treeView-tree">').appendTo($sub);
                }
                
                
                
                
                jmask(resp.load.treeView)
                    .filter('#treeView-item')
                    .children()
                    .appendTo($ul[0], model);
                
                
            },
            
            onRenderStart: function(model){
                
                this.model = arr_isArray(model)
                    ? model
                    : [model];
                
                if (typeof this.model[0] === 'string') {
                    model = tree_fromPaths(this.model);
                    
                    
                    var rootPath = this.model[0],
                        index = rootPath.indexOf(model[0].id);
                    if (index > -1) {
                        this.rootPath = rootPath.substring(0, index);
                    }
                    
                    this.model = model;
                    
                }
                
                var i = this.model.length;
                while (--i > -1) {
                    tree_prepairModel(this.model[i]);   
                }
                
                this.selectedItem = this.attr.selected || this.model[0].id;
            }
            
        }));
        
        function tmpl_ensureItem(compo) {
            if (compo.templateItem) 
                return;
            
            compo.templateItem = jmask(compo.nodes)
                .find('#treeView-item')
                .get(0)
                .nodes;
        }
        
        function node_getItem($nodes, path) {
            if (path == null || path.length === 0|| path === '/') 
                return $nodes
            
            var parts = typeof path === 'string'
                ? path.split('/')
                : path
                ;
         
            var i = -1,
                imax = parts.length;
            
            while ($nodes.length && ++i < imax - 1) {
                $nodes = sel_child(
                    $nodes,
                    formatSelector(),
                    '.-treeView-sub',
                    'ul'
                );
            }
            
            return sel_child($nodes, formatSelector());
            
                
            function formatSelector() {
                return '[data-tree-name="' + parts[i] + '"]';
            }
        }
        
        function sel_child($node) {
            var $child = $node,
                i = 0,
                imax = arguments.length;
            while (++i < imax) {
                $child = $child.children(arguments[i]);
            }
            return $child;
        }
        
        function tree_prepairModel(model) {
            if (model.id == null) 
                model.id = model.title.toLowerCase();
                
            if (model.title == null) 
                model.title = model.id;
            
            if (model.items == null) {
                model.items = [];
                return;
            }
            
            if (arr_isArray(model.items)) {
                var i = model.items.length;
                while (--i > -1){
                    tree_prepairModel(model.items[i]);
                }
                return;
            }
            
            tree_prepairModel(model.items);
            model.items = [model.items]
        }
        
        function tree_fromPaths(model) {
            model = model.slice(0);
            // reduce,
            var index = -1,
                index_ = index,
                i = 0,
                imax = model.length;
            for (; i < imax - 1; i++){
                
                index_ = str_lastSameIndex(model[i], model[++i]);
                if (index === -1 || index > index_) {
                    index = index_;
                }
            }
            
            if (imax === 1) 
                model[0] = model[0].substring(model[0].lastIndexOf('/') + 1);
            
            
            if (index > 0) {
                index_ = model[0].lastIndexOf('/');
                if (index_ < index) {
                    index = index_
                }
                
                for (i = 0; i< imax; i++) {
                    model[i] = model[i].substring(index);
                    
                    if (model[i][0] === '/') 
                        model[i] = model[i].substring(1);
                    
                }
            }
            
            var tree = [],
                parts;
            
            for (var i = 0, imax = model.length; i < imax; i++){
                
                tree_ensurePath(tree, model[i].split('/'));
            }
            
            return tree;
        }
        
        function tree_getItem(items, id) {
            for (var i = 0, x, imax = items.length; i < imax; i++){
                x = items[i];
                
                if (x.id === id) 
                    return x;
            }
            return null;
        }
        
        function tree_ensurePath(rootItems, parts) {
            var items = rootItems,
                item_,
                item;
            for (var i = 0, imax = parts.length; i < imax; i++){
                item_ = tree_getItem(items, parts[i]);
                
                if (item_ == null) {
                    item_ = {
                        id: parts[i],
                        items: []
                    };
                    items.push(item_);
                }
                
                items = item_.items;
            }
            return items;
        }
        
        function str_lastSameIndex(str, compare) {
            var i = 0,
                imax = str.length < compare.length
                ? str.length
                : compare.length
                ;
            
            for (; i< imax; i++) {
                if (str.charCodeAt(i) !== compare.charCodeAt(i)) {
                    break;
                }
            }
            
            return i;
        }
        
        function path_combine(_1, _2) {
            if (_1[_1.length - 1] === '/') 
                _1 = _1.substring(0, _1.length - 1);
            
            if (_2[0] !== '/') 
                _2 = '/' + _2;
                
            return _1 + _2;
        }
        
        function arr_isArray(array) {
            return array != null
                && typeof array.length === 'number'
                && typeof array.splice === 'function'
        }
    });
