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
            var ret;
            if (elem.children) {
                return XX.nodeListToArray(elem.children);
            }

            ret = [];
            for (var i = 0, nodes = elem.childNodes, len = nodes.length; i < len; ++i) {
                if (nodes[i].nodeType === 1) {
                    ret.push(nodes[i]);
                }
            }

            return ret;
        };

        /*NodeList转化为数组*/
        XX.nodeListToArray = function(list) {
            var elems = [];
            try {
                elems = Array.prototype.slice.call(list, 0);
            } catch (e) {/*For IE*/
                for (var i = 0, len = list.length; i < len; ++i) {
                    elems.push(list[i]);
                }
            }
            return elems;
        };


        function dispatchIframePath() {
            var frames = document.querySelectorAll('iframe, frame'),
                iframePath = top == window ? '' : XX.currentFramePath + '>';
            for (var i = 0, len = frames.length; i < len; ++i) {
                frames[i].contentWindow.postMessage(
                    {
                        type:'NoSelector',
                        cmd:'set_iframe_path',
                        path: iframePath + XX.path(frames[i])
                    }, '*');
            }
        }

        function onMessage(ev) {
            var data = ev.data;
            if (data.type !== 'NoSelector') {
                return;
            }
            if (data.cmd === 'set_iframe_path') {
                if (window.source != window) {
                    //  window.postMessage({type:'NoSelector', cmd:'set_iframe_path', path:data.path}, '*');
                    XX.currentFramePath = data.path;
                    dispatchIframePath();
                }
            }
        }

        function onDomModified(ev) {
            if (ev.target.tagName == 'IFRAME') {
                dispatchIframePath();
            }
        }
        window.addEventListener('message', onMessage, false);
        document.body.addEventListener('DOMSubtreeModified', onDomModified, false);
        //第一次加载，顶层窗口广播iframe路径
        top == window && dispatchIframePath();

    }

    var doc = document, head = doc.head;
    var script = doc.createElement('script');
    script.text = '(' + insertCode + ')()';
    head.removeChild(head.insertBefore(script, head.firstChild));
}();