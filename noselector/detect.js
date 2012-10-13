/**
 *范围选取 
 */

void function($){
	var _$mask = null,
		_status = '',
		MOVEINTERVAL = 25,
		startX, startY;
	
	var _createMask = function() {
		if(!_$mask) {
			_$mask = $('<div>').css({
				position: 'absolute',
				zIndex: '9999',
				zoom:'1',
				//filter:'alpha(opacity=50)',
				opacity:0.5,
				backgroundColor:'blue'
			})
		}
		
		_$mask.css({width:0, height:0}).appendTo(document.body);
	};
	
	var _disableSelect = function($el) {
		$el.css({
			webkitUserSelect:'none',
			mozUserSelect:'none',
			userSelect:'none'
		});
	}
	
	var eventFns = {
		mousedown: function(ev) {
			_status = 'start';
			_$mask.css({
				top : ev.pageY -2,
				left : ev.pageX -2,
				height: 0,
				width: 0
			});
			$(this).trigger('xxRangeSelect:selectstart', [{x1:ev.pageX, y1:ev.pageY}, _$mask]);
		},
		mousemove:  function(ev) {
			if(!_status) {
				return;
			}
				
			_status = 'move';
			$(this).trigger('xxRangeSelect:select', [{x1:startX, y1:startY, x2:ev.pageX, y2:ev.pageY}, _$mask]);
		},
		mouseup: function(ev) {
			if(!_status || Math.abs(ev.pageX - startX) < 5 || Math.abs(ev.pageY - startY) < 5) {
				_status = '';
				return;
			}
			_status = '';
			$(this).trigger('xxRangeSelect:selectend', [{x1:startX, y1:startY, x2:ev.pageX, y2:ev.pageY},  _$mask]);
		},
		mouseleave: function(ev) {
			eventFns.mouseup.call(this, ev);
		},
		
		"xxRangeSelect:selectstart": function(ev, point, $mask) {
			startX = point.x1;
			startY = point.y1;
		},
		
		"xxRangeSelect:select": function(ev, point, $mask) {
			var w = Math.abs(point.x2 - startX),
				h = Math.abs(point.y2 - startY);
			
			if(point.x2 < startX) {
				$mask.css('left', point.x2 + 2);
			}
			
			if(point.y2 < startY) {
				$mask.css('top', point.y2 + 2);
			}
			
			$mask.width(w).height(h);
		}
	};
	
	var commandFns = {
		enable: function() {
			_createMask();
			this.on(eventFns);
			_$mask.on(eventFns);
			_disableSelect(this);  
			 
			return this;
		},
		disable: function() {
			_$mask && _$mask.remove();
			this.off(eventFns);
		
			return this;
		},
		destroy: function() {
			commandFns.disable.call(this);
			_$mask = null;
			
			return this;
		}
	};
	
	$.fn.xxRangeSelect = function(options) {
		options || (options = 'enable');
		
		if(typeof options == 'string') {
			commandFns[options] && commandFns[options].call(this);
		} else {
			
		}

		return this;
		
	};
	
}(jQuery);

void function($){
	$.fn.xxOverSelect = function() {
		var $left, $right, $top, $bottom, enabled = false;
		var overFn = function(evt) {
			var target = evt.target;
			if(this === target || target === $left[0] || target === $right[0] || target === $top[0] || target === $bottom[0]) {
				return true;
			}
			
			var $target = $(target), 
				h = $target.outerHeight(), 
				w = $target.outerWidth(), 
				oft = $target.offset();
			$left.offset({
				left : oft.left - 4,
				top : oft.top - 4
			}).height(h + 4);
			$right.offset({
				top : oft.top,
				left : oft.left + w
			}).height(h);
			$top.offset({
				top : oft.top - 4,
				left : oft.left
			}).width(w);
			$bottom.offset({
				left : oft.left,
				top : oft.top + h
			}).width(w);
			$(this).trigger('xxselect:over', evt.target);
			return false;
		};

		var clickFn = function(evt) {
			var target = evt.target;
			if(this === target || target === $left[0] || target === $right[0] || target === $top[0] || target === $bottom[0]) {
				return true;
			}
	
			$(this).trigger('xxselect:select', evt.target);
			return false;
		}
		var mapFun = {
			enable : function($elem) {
				if(enabled) {
					return;
				}

				if(!$left) {
					$left = $("<div>").css({
						position : 'absolute',
						zIndex : 9999,
						left : '-5000px',
						width : '0',
						height : '0',
						border : '2px solid red'
					}).appendTo('body');
					$bottom = ( $top = ( $right = $left.clone().appendTo('body')).clone().appendTo('body')).clone().appendTo('body');
				}
				
				if(!$left.parent().length){
					$left.appendTo('body');
					$right.appendTo('body');
					$top.appendTo('body');
					$bottom.appendTo('body');
				}
				$elem.$oldCursor = $elem.css('cursor');
				$elem.css('cursor', 'pointer');
				$elem.mouseover(overFn).click(clickFn);
			},

			disable : function($elem) {
				$elem.off({
					mouseover : overFn,
					click : clickFn
				}).css('cursor', this.$oldCursor);
				$left.remove(), $right.remove(), $top.remove(), $bottom.remove();
				enabled = false;
			},

			destroy : function($elem) {
				$elem.off({
					mouseenter : overFn,
					click : clickFn
				}).css('cursor', this.$oldCursor);
				$left.remove(), $right.remove(), $top.remove(), $bottom.remove();
				$left = $right = $top = $bottom = null;
				enabled = false;
			}
		}
		var select = function(options) {
			if('string' === typeof options) {
				mapFun[options] && mapFun[options](this);
				return this;
			}

			options = options || {};
			$.extend(options, {});
			mapFun.enable(this);
			return this;
		};

		return select;
	}();
}(jQuery);


void function() {
	window.XX = {};
	/*获取元素在DOM树中的路径，以“标签名$索引位置>标签名$索引位置“的字符串返回
	 *参数elem:计算路径的元素
	 * 参数root: 路径开始的节点,默认为body,最高也为body
	 * */
	XX.path = function(elem, root) {
		var ret = [], body = document.body, root = root || body;
		while (elem !== root && elem !== body) {
			ret.unshift(elem.nodeName.toLowerCase() + '$' + XX.indexTag(elem));
			elem = elem.parentNode;
		}
		console.log(ret.join('>'));
		return ret.join('>')
	};
	
	
	/*获取元素在DOM树中相同标签节点的位置索引*/
	XX.indexTag = function(elem, deep) {
		var name = elem.nodeName, i, children,
			elems;
		if (name === 'BODY' || name === 'HTML') {
			return 0;
		}
		
		if(deep) {
			elems = elem.parentNode.getElementsByTagName(name);
		} else {
			elems = [];
			children = XX.children(elem.parentNode);
			for(i = 0, len = children.length; i < len; ++i) {
				if(children[i].nodeName === name) {
					elems.push(children[i]);
				}
			}
		}
		
		for ( i = elems.length - 1; i > -1; --i) {
			if (elem === elems[i]) {
				return i;
			}
		}
	};
	
	
	/*获取元素的非文本节点集合*/
	XX.children = function(elem) {
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

	XX.getElementsByRange = function(x1, y1, x2, y2, context) {
		var elems, i, len, ret = [];
		context = context || document.body;
		elems = context.getElementsByTagName('*');
		for(i = 0, len = elems.length; i < len; ++i) {
			XX.isElemInPoint(elems[i], x1, y1, x2, y2) && ret.push(elems[i]);
		}
		
		return ret;
	};
	
	XX.isElemInPoint = function (elem, x1, y1, x2, y2) {
		var temp, offset, elx, ely;
		if(x1 > x2) {
			temp = x1;
			x1 = x2;
			x2 = temp;
		}
		
		if(y1 > y2) {
			temp = y1;
			y1 = y2;
			y2 = temp;
		}
		
		offset = $(elem).offset();
		elx = offset.left;
		ely = offset.top;
		
		return (x1 <= elx && x2 >= elx) && (y1 <= ely && y2 >= ely);
	}

}();
