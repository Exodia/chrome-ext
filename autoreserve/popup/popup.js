$(function() {
    var html = '';
    for(var k in Data) {
        var name = Data[k].fields.lastname + Data[k].fields.firstname;
        html +=  '<li id="' + k + '"><label><input type="radio" name="item" />' + name +
            '</label></li> '
    }
    $('#list').html(html);
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
});
