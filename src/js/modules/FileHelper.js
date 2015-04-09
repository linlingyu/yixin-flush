define(function(require, exports, module){
    //在浏览器输入filesystem:chrome-extension://domain/persistent/,把persistent换成temporary则是读取临时空间
    var fs;
    window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
    // var resolveLocalFileSystemURL = window.resolveLocalFileSystemURL || window.webkitResolveLocalFileSystemURL;//根据URL取得文件的读取权限
    function errorHandler(e){
        var msg = '';
        switch (e.code) {
            case FileError.QUOTA_EXCEEDED_ERR:
              msg = 'QUOTA_EXCEEDED_ERR';
              break;
            case FileError.NOT_FOUND_ERR:
              msg = 'NOT_FOUND_ERR';
              break;
            case FileError.SECURITY_ERR:
              msg = 'SECURITY_ERR';
              break;
            case FileError.INVALID_MODIFICATION_ERR:
              msg = 'INVALID_MODIFICATION_ERR';
              break;
            case FileError.INVALID_STATE_ERR:
              msg = 'INVALID_STATE_ERR';
              break;
            default:
              msg = 'Unknown Error';
              break;
        };  
        console.log('Error: ' + msg);
    }
    function initFileSystem(callback){
        if(fs){callback();}
        navigator.webkitPersistentStorage.requestQuota(1024 * 1024 * 1024, function(grantedSize){
        window.requestFileSystem(window.PERSISTENT, grantedSize, function(fireSystem){
                fs = fireSystem;
                callback();
            }, errorHandler);
        }, errorHandler);
    }

    var base = {
        dir: function(dirPath, callback){
            if(dirPath.length === 0){return callback();}
            var currPath = [];
            (function createDir(){
                currPath.push(dirPath.shift());
                fs.root.getDirectory(currPath.join('/'), {create: true}, function(dirEntry){
                    console.log('dir created: ' + currPath.join('/'));
                    if(dirPath.length === 0){return callback();}
                    createDir();
                }, errorHandler);
            })();
        },

        file: function(fullPath, fileContent, opts){
            var self = this;
            opts.encoding = opts.encoding || 'utf-8';
            opts.success = opts.success || function(){};
            fs.root.getFile(fullPath, {create: true, exclusive: true}, function(fileEntry){
                fileEntry.createWriter(function(fileWriter){
                    fileWriter.onwriteend = function(e){opts.success();};
                    fileWriter.onerror = function(e){console.log('Write failed: ' + e.toString());}
                    fileWriter.write(new Blob([fileContent], {type: 'text/plain;charset=' + opts.encoding}));
                }, errorHandler);
            }, function(e){
                if(FileError.INVALID_MODIFICATION_ERR === e.code){//如果文件存在
                    self.remove(fullPath, {success: function(){
                        self.file(fullPath, fileContent, opts);
                    }});
                    return;
                }
                errorHandler(e);
            });
        },

        remove: function(fullPath, opts){
            if(!fs){return;}
            opts.success = opts.success || function(){};
            fs.root.getDirectory(fullPath, {}, function(dirEntry){
                //如果是目录
                dirEntry.removeRecursively(function(){
                    console.log('remove dir: ' + fullPath);
                    opts.success();
                });
            }, function(e){
                if(FileError.TYPE_MISMATCH_ERR === e.code){//如果是文件
                    fs.root.getFile(fullPath, {create: false}, function(fileEntry){
                        fileEntry.remove(function(){
                            console.log('remove file: ' + fullPath);
                            opts.success();
                        });
                    }, errorHandler);
                    return;
                }
                errorHandler(e);
            });
        }
    };

    var fileHelper = module.exports = {
        write: function(path, fileContent, opts){
            initFileSystem(function(){
                var dirPath = path.split('/').filter(function(item){if(item){return item}}),
                    fileName = dirPath.pop();
                base.dir(dirPath, function(){
                    base.file(path, fileContent, opts);
                });
            });
        },

        read: function(path, opts){
            initFileSystem(function(){
                opts.encoding = opts.encoding || 'utf-8';
                opts.success = opts.success || function(){};
                fs.root.getFile(path, {}, function(fileEntry){
                    fileEntry.file(function(file){
                        var fileReader = new FileReader();
                        fileReader.onload = function(evt){opts.success(this.result);}
                        fileReader.readAsText(file, opts.encoding);
                    });
                }, function(){opts.success(null)});
            });
        },

        remove: function(path, opts){
            initFileSystem(function(){
                base.remove(path, opts);
            });
        }
    }; 
});