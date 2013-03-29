void function($){ 
    var URL = 'http://127.0.0.1:8189';
    var $body = $('body');
    var started = false;
    var F2 = 113;
    var rangeModel = false;

    function sendMsg(data){
        XX.$vefifyMask && XX.$vefifyMask.remove();
    	if(!window.top) {
    		data = XX.currentFramePath + '>' + data;
            window.postMessage({data:data, tpye:'NO_SELECTOR', cmd:'log_path'});
    	}
    	console.log(data);

    }
    function keyHandler(ev) {

        if(ev.which == F2) {
            if(rangeModel = !rangeModel) {
                $body.xxRangeSelect().xxOverSelect('disable');
            } else {
                $body.xxRangeSelect('disable').xxOverSelect();
            }

        }
    }
    
    void function() {

    	chrome.extension.sendMessage('loaded');


    }();


    chrome.extension.onMessage.addListener(function(command){
        if(command == 'start') {
            if(started) {
                return;
            }
            started = true;
			XX.init();
			XX.start();
            $body.on('keydown', keyHandler);

            $body.xxOverSelect().on('xxselect:select', function(ev, el){
                if(confirm("确定记录元素路径？")){
                	$body.xxOverSelect('disable');
                    sendMsg(XX.path(el));
                    $body.xxOverSelect();
                }
            }).on('xxRangeSelect:selectend', function(ev, point, $mask){
                    $body.xxRangeSelect('disable');
                    if(confirm("确定记录元素路径？")){
                        var elems = XX.getElementsByRange(point.x1, point.y1, point.x2, point.y2, this);
                        var pathes = [];
                        for(var i = 0, len = elems.length; i < len; ++i) {
                            pathes.push(XX.path(elems[i]));
                        }
                        sendMsg(pathes.join(';'));
                    }
                    $body.xxRangeSelect();
            });
        } else {
            started = false;
            XX.stop();
            $body.xxRangeSelect('disable').xxOverSelect('disable')
            	 .off('keydown xxselect:select xxRangeSelect:selectend');
        }
    });
}(jQuery);
