$(function() {
	$('li').live('click', function(ev) {
		li = $(this);
		li.find('input').prop('checked', true);
		chrome.tabs.getSelected(null, function(tab) {	
			console.log( Data[li.attr('data-index')])							
			chrome.tabs.sendMessage(tab.id, {				
				data : Data[li.attr('data-index')]
			});
		});
	});
	
})
