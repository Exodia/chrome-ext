$(function() {
	$('li').live('click', function(ev) {
		li = $(this);
		li.find('input').prop('checked', true);
		chrome.tabs.getSelected(null, function(tab) {								
			chrome.tabs.sendMessage(tab.id, {
				isAuto : $('#autosubmit').prop('checked'),
				id : li.prop('id')
			});
		});
	});

})
