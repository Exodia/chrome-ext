/**
 * Created with JetBrains WebStorm.
 * User: tafeng.dxx
 * Date: 12-11-10
 * Time: 下午4:21
 * To change this template use File | Settings | File Templates.
 */

/*将路径计算函数插入顶层代码，突破跨域*/
void function () {	
    function insertCode() {
        window.XX = window.XX || {};
        /*获取元素在DOM树中的路径，以“标签名$索引位置>标签名$索引位置“的字符串返回
         *参数elem:计算路径的元素
         * 参数root: 路径开始的节点,默认为body,最高也为body
         * */
        XX.path = function (elem, root) {
            var ret = [], body = document.body;
            root = root || body;
            while (elem !== root && elem !== body) {
                ret.unshift(elem.nodeName.toLowerCase() + '$' + XX.indexTag(elem));
                elem = elem.parentNode;
            }

            console.log(ret.join('>'));
            return ret.join('>')
        };


        /*获取元素在DOM树中相同标签节点的位置索引*/
        XX.indexTag = function (elem, deep) {
            var name = elem.nodeName, i, children,
                elems;
            if (name === 'BODY' || name === 'HTML') {
                return 0;
            }

            if (deep) {
                elems = elem.parentNode.getElementsByTagName(name);
            } else {
                elems = [];
                children = XX.children(elem.parentNode);
                for (i = 0, len = children.length; i < len; ++i) {
                    if (children[i].nodeName === name) {
                        elems.push(children[i]);
                    }
                }
            }

            for (i = elems.length - 1; i > -1; --i) {
                if (elem === elems[i]) {
                    return i;
                }
            }
        };

        /*获取元素的非文本节点集合*/
        XX.children = function (elem) {
           return elem.children;        
        };
      
      	var timer = null;
      	function delayDispatch() {
      		timer && clearTimeout(timer);
      		timer = setTimeout(dispatchFramePath, 100);
      	}
      
      
        function dispatchFramePath() {
            var frames = document.querySelectorAll('iframe, frame'),
                iframePath = top == window ? '' : XX.currentFramePath + '>';            
            for (var i = 0, len = frames.length; i < len; ++i) {              	     	          	
                frames[i].contentWindow.postMessage(
                    {
                        type:'NoSelector',
                        cmd:'set_frame_path',
                        path: iframePath + XX.path(frames[i])
                    }, '*');
            }
        }

		var cmdRouter = {
			"set_frame_path": function(data) {
				XX.currentFramePath = data.path;			
				delayDispatch();			
               // dispatchFramePath();
			},
			"send_frame_path":  delayDispatch,
			'add_dom_handler': function() {
				//dispatchFramePath();
				delayDispatch();
				addDomModifiedHandler();
			},
			'remove_dom_handler': removeDomModifiedHandler
		}
        function onMessage(ev) {
            var data = ev.data;
            if (data.type !== 'NoSelector') {
                return;
            }          
            cmdRouter[data.cmd] && cmdRouter[data.cmd](data);            
        }

        function addDomModifiedHandler() {     
        	if(!!XX.observer) {       		
        		XX.observer.observe(document.body, {childList: true, subtree:true});
        		return;
        	} 	
            XX.observer = new WebKitMutationObserver(function(records){             	       	
            	var addedNodes = null, removedNodes = null;
            	for(var i = records.length - 1; i > -1; --i) {
            		addedNodes = records[i].addedNodes || [];                		      		
            		for(var j = addedNodes.length - 1; j > -1; --j ) {
            			if(addedNodes[j].tagName == 'IFRAME') {
            				//dispatchFramePath();
            				delayDispatch();
            				return;
            			}
            		}
            		
            		removedNodes = records[i].removedNodes || []; 
            		for(var j = removedNodes.length - 1; j > -1; --j ) {
            			if(removedNodes[j].tagName == 'IFRAME') {
            			//	dispatchFramePath();
            				delayDispatch();
            				return;
            			}
            		}
            	}
            });           
            XX.observer.observe(document.body, {childList: true, subtree:true});
        }
        
        function removeDomModifiedHandler() {
        	XX.observer.disconnect();      	
        }
        window.addEventListener('message', onMessage, false);            
       //非顶层窗口，且消息函数已经绑定，则通知顶层窗口发送路径
        if(window.top !== window) {
        	window.top.postMessage({type:'NoSelector', cmd:'send_frame_path'}, '*');
        } else {
        	delayDispatch();
        	//dispatchFramePath();	
        }	
    }


	var TYPE = "NoSelector";
	
	function insertScript() {
		var doc = document, head = doc.head;
    	var script = doc.createElement('script');
    	script.text = '(' + insertCode + ')()';
    	head.removeChild(head.insertBefore(script, head.firstChild));
	}
	
	//content_script中设置iframe路径的信息
	function onContentMessage(ev) {
		var data = ev.data;
		if(data.type !== TYPE) {
			return;
		}
			
		if(data.cmd == 'set_frame_path') {
			XX.currentFramePath = data.path;
		}
	}
	
	window.XX = window.XX || {};
	XX.init = function() {
		if(XX._inited) {
			return;
		}
		console.log('init:', location.href);
		window.addEventListener('message', onContentMessage, false);
		insertScript();
    	XX._inited = true;
	};
	
	XX.start = function() {
		//通知页面窗口开始监听DOM变化
		window.postMessage({type:TYPE, cmd:'add_dom_handler'}, "*");
	};
	
	XX.stop = function() {
		window.postMessage({type:TYPE, cmd:'remove_dom_handler'}, "*");
	};
}();
