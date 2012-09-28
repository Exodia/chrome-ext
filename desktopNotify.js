void function() {
	var _instance = null,
		_permissionStatus = -1,
		_eventTable = {
			"show": 1,
			"error": 1,
			"close": 1,
			"click": 1
		};
	
	
	/**
	 *调用例子： 
	 * var DN = window.XX.DesktopNotify;
	 * DN.requestPermission(function(){
	 * 	  DN.show("http://xxx", "hello", "world");
	 * });
	 */	
	var DesktopNotify = {
		
		/**
		 *检测是否支持Notification，支持返回true 
		 */
		isSupport : function() {
			return 'Notification' in window || 'webkitNotifications' in window;
		},

		/**
		 *弹出一个文本桌面通知 
		 *
		 * @param {String} iconURL:图标资源
		 * @param {String} title: 标题
		 * @param {String} content: 内容
		 */
		show : function(iconURL, title, content) {
			_instance = this.create(iconURL, title, content);
			_instance.show();
		},

		
		/**
		 *弹出一个 HTML桌面通知
		 *
		 * @param {String} url:html链接资源
		 */
		showHTML : function(url) {
			_instance = this.createHTML(url);
			_instance.show();
		},

		/***
		 * 关闭一个桌面通知
		 * 
 		 * @param {Object} cb： 隐藏后的回调函数
 		 * 
		 */
		hide : function(cb) {
			_instance && _instance.close();
			cb && cb();
		},
		
		/**
		 * 释放通知对话框引用
		 */
		destroy: function() {
			_instance = null,
			_permissionStatus = -1;
		},

		/**
		 * 检查权限状态
		 * @return {Number}: 0为允许，1为不允许， 2为禁止
		 */
		checkPermission : function() {
			return _permissionStatus = webkitNotifications.checkPermission();
		},
		
		/**
		 * 检查是否得到授权
		 * @return {Boolean}： true表示得到授权
		 */
		isPermitted: function() {
			return this.checkPermission() === 0;
		},
		
		
		/**
		 * 请求授权
 		 * @param {Object} cb：得到授权后的回调函数
		 */
		requestPermission: function(cb) {
			if(this.isPermitted()) {
				cb && cb();
			} else {
				webkitNotifications.requestPermission(cb);
			}
		},
		
		/**
		 * 创建一个文本性质的通知对话框，但不展示
 		 * @param {Object} iconURL
		 * @param {Object} title
 		 * @param {Object} content
 		 * @return {Object} Notification实例
		 */
		create: function(iconURL, title, content) {
			return webkitNotifications.createNotification(iconURL, title, content);
		},
		
		/**
		 * 创建一个HTML性质的通知对话框，但不展示
 		 * @param {Object} url: 指向html页面的链接
 		 * @return {Object} Notification实例
		 */
		createHTML: function(url) {
			return webkitNotifications.createHTMLNotification(url);
		},
		
		/**
		 * 添加事件监听函数
 		 * @param {Object} type: 事件类型
 		 * @param {Object} fn: 监听函数
		 */
		on: function(type, fn) {
			_eventTable[type] && _instance && _instance.addEventListener(type, fn, false); 
		},
		
		/**
		 * 移除事件监听函数
 		 * @param {Object} type: 事件类型
 		 * @param {Object} fn: 监听函数
		 */
		un: function(type, fn) {
				_eventTable[type] && _instance && _instance.removeEventListener(type, fn, false); 
		}
	};

	window.XX || (window.XX = {});
	window.XX.DesktopNotify = DesktopNotify;
}();
