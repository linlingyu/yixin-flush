void function(){
    if(!~location.search.indexOf('type=auto')){return;}
    var profile, article,
        friend = {
            friends: [],
            index: 0,
            initialize: function(friendArray){
                var self = this;
                friendArray.forEach(function(item){
                    self.friends.push(item);
                });
                // $('div.m-list>ul.j-flag>li').each(function(index, item){
                //     var name = $(item).find('h3').text();
                //     friendArray.indexOf(name) && self.friendDOMs.push($(item));
                // });
            },

            getFriendDOM: function(){
                var self = this,
                    friendName = self.friends[self.index++],
                    friendDOM;
                if(self.index >= self.friends.length){self.index = 0;}
                $('div.m-list>ul.j-flag>li').each(function(index, item){
                    var name = $(item).find('h3').text();
                    name === friendName && (friendDOM = $(item));
                });
                return friendDOM;
            }
        },

        article = {
            textArray: [],
            index: 0,
            loop: true,
            initialize: function(txt, loop){
                var self = this;
                self.textArray = txt.split(/[,.!]|[，。！]/g);
                self.loop = loop;
            },
            hasContent: function(){
                return !!this.textArray.length;
            },
            getContent: function(){
                var self = this,
                    ret = self.textArray[self.index++];
                if(self.index >= self.textArray.length && self.loop){self.index = 0;}
                return ret;
            }
        };

    chrome.runtime.sendMessage(null, {type: 'article'}, function(response){
        var friends = response.profile.friends,
            index = 0;
        if(!response.article){alert('未设置源文本，请先设置好源文本～！'); return;}
        if(!friends || friends.length === 0){alert('未添加要对话的好友或群，请先设置好对话列表～！'); return;}

        function getTime(){
            var percent = Math.round(Math.random() * 10),//N分1的机率得到长时间的等待
                time = percent < 9 ? Math.round(Math.random() * 5) + 5 : Math.ceil(Math.random() * 10) * 60;
            console.log('离下次发信：' + time + '秒');
            return time * 1000;
        }

        (function initialize(){
            if($('div.m-list>ul.j-flag>li').length > 0){//数据已经加载
                friend.initialize(friends);
                article.initialize(response.article, response.profile.loop);
                return flush();
            }
            setTimeout(initialize, 1000);
        })();

        function flush(){
            var dom = friend.getFriendDOM(),
                txt = article.hasContent();
            if(!txt){alert('结束，没有文字'); return;}
            if(dom){
                dom.click();
                var tx = article.getContent();
                $('textarea.j-flag').val(tx);
                $('span.u-btn').click();
            }
            setTimeout(flush, getTime());
        }
    });
    // var url = chrome.extension.getURL;
}();