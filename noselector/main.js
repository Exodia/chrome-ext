void function($){
    chrome.extension.sendMessage('loaded');

    var URL = 'http://127.0.0.1:8189';
    var $body = $('body');
    var CTRL = 17;
    var started = false;

    function sendMsg(data){
        $.post(URL, data, function(data){
            if(data && data.status == 'success'){
                console && console.log('success');
            } else {
                console && console.log('fail');
            }
        })
    }

    chrome.extension.onMessage.addListener(function(command){
        if(started) {
            return;
        }

        if(command == 'start') {
            started = true;
            var rangeModel = false;
            function keyHandler(ev) {
                if(ev.ctrlKey) {
                    if(rangeModel = !rangeModel) {
                        $body.xxRangeSelect().xxOverSelect('disable');
                    } else {
                        $body.xxRangeSelect('disable').xxOverSelect();
                    }

                }
            }

            $body.keydown(keyHandler);

            $body.xxOverSelect().on('xxselect:select', function(ev, el){
                if(confirm("是否发送消息？")){
                    sendMsg(XX.path(el));
                }
            }).on('xxRangeSelect:selectend', function(ev, point, $mask){
                    $body.xxRangeSelect('disable');
                    if(confirm("是否发送消息？")){
                        console.log(point)
                        var elems = XX.getElementsByRange(point.x1, point.y1, point.x2, point.y2, this);
                        var pathes = [];
                        for(var i = 0, len = elems.length; i < len; ++i) {
                            pathes.push(XX.path(elems[i]));
                        }
                        sendMsg(pathes.join(';'));
                        $body.xxRangeSelect();
                    }
                });
        } else {
            started = false;
            $body.xxRangeSelect('disable').xxOverSelect('disable').off('keydown', keyHandler);
        }
    });
}(jQuery);
