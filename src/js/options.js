requirejs(['jquery', 'angular', 'modules/popup', 'modules/FriendList', 'modules/fileHelper'], function($, angular, popup, FriendList, fileHelper){
    var profilePath = '/yixin/profile.txt',
        articlePath = '/yixin/article.txt',
        $file = $('#fileId'),
        popover = popup.getInstance();
    popover.prefix('c-popup');
    function template(text){
        return '<div class="popup-inner"><a class="popup-close" href="javascript:void(0)"></a><div class="popup-text">'+ text +'</div></div>';
    }
    //angular
    var app = angular.module('myform', [])
        .controller('formController', function($scope){
            $scope.opts = {
                loop: false,
                showText: true,
                onSelectFile: function(){$('#fileId').click();},
                onChangeFile: function(el){
                    $scope.opts.path = el.value;
                    $scope.opts.showText = false;
                    $scope.$apply();
                },
                onShowText: function(){
                    var file = $file.get(0).files[0],
                        fileReader = new FileReader();
                    fileReader.onloadend = function(){
                        var fileContent = this.result.substring(0, 500);
                        popover.content(template(fileContent));
                        popover.show();
                    }
                    fileReader.readAsText(file, this.encoding);
                }
            };
            $scope.friend = {
                array: [],
                onRemove: function(){
                    var ret = [];
                    $('.item>input[type=checkbox]').each(function(index, item){
                        if(item.checked){return;}
                        ret.push(item.value);
                    });
                    this.array = ret;
                    $('.item>input[type=checkbox]').prop('checked', false);
                },
                onAdd: function(){
                    this.array.push('');
                },
                onSave: function(){
                    var profile = {
                            path: $scope.opts.path,
                            encoding: $scope.opts.encoding,
                            loop: $scope.opts.loop,
                            friends: []
                        };
                    $('.item>input[type=text]').each(function(index, item){profile.friends.push(item.value)});
                    //save
                    fileHelper.write(profilePath, JSON.stringify(profile), {encoding: 'utf-8', success: function(){
                        if(!$file.val()){
                            popover.content(template('<div align="center">保存成功</div>'));
                            popover.show();
                            return;
                        }
                        var fileReader = new FileReader();
                        fileReader.onloadend = function(){
                            fileHelper.write(articlePath, this.result, {encoding: 'utf-8', success: function(){
                                popover.content(template('<div align="center">保存成功</div>'));
                                popover.show();
                            }});
                        }
                        fileReader.readAsText($file.get(0).files[0], $scope.opts.encoding);
                    }});
                }
            };

            fileHelper.read(profilePath, {success: function(txt){
                if(!txt){return;}
                $scope.$apply(function(){
                    var datas = JSON.parse(txt),
                        opts = $scope.opts;
                    angular.forEach(['path', 'encoding', 'loop'], function(item){
                        opts[item] = datas[item];
                    });
                    $scope.friend.array = datas.friends;
                });
            }});
        });
    $file.change(function(){angular.element(this).scope().opts.onChangeFile(this)});//angular不支持type=file的onchange事件
    angular.bootstrap(document.getElementById('mainId'), ['myform']);
});