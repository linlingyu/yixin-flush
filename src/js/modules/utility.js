define(function(require, exports, module){
    module.exports = {
        defineProperties: function(obj, methods, options){
            var c = {}, item;
            for(var i in methods){
                item = c[i] = {value: methods[i]};
                if(options){
                    for(var j in options[i]){
                        item[j] = options[i][j];
                    }
                }
            }
            Object.defineProperties(obj, c);
        },

        extend: function(source, copy){
            if(copy){
                for(var i in copy){
                    source[i] = copy[i];
                }
            }
            return source;
        }
    };
});