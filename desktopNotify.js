void function() {
	var _instance = null,
		_permissionStatus = -1;
		
	var DesktopNotify = {
		isSupport : function() {
			return 'webkitNotifications' in window;
		},

		show : function(iconURL, title, msg) {
			_instance = this.create(iconURL, title, msg);
			_instance.show();
		},

		showHTML : function(url) {
			_instance = this.createHTML(url);
			_instance.show();
		},

		hide : function(cb) {
			_instance && _instance.close();
			cb && cb();
		},

		destroy: function() {
			_instance = null,
			_permissionStatus = -1;
		},

		checkPermission : function() {
			return _permissionStatus = webkitNotifications.checkPermission();
		},
		
		isPermitted: function() {
			return this.checkPermission() === 0;
		},
		
		requestPermission: function(cb) {
			if(this.isPermitted()) {
				cb && cb();
			} else {
				webkitNotifications.requestPermission(cb);
			}
		},
		
		create: function(iconURL, title, value) {
			return webkitNotifications.createNotification(iconURL, title, value);
		},
		
		createHTML: function(url) {
			return webkitNotifications.createHTMLNotification(url);
		} 
		
		/*
		 *todo:
		 * 事件支持 
		 */
		 
	};

	window.XX || (window.XX = {});
	window.XX.DesktopNotify = DesktopNotify;
}();
