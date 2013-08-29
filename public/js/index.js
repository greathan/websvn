
+function($) {

	$('#repo').on('keyup', function(evt) {

		var repo = $(this).val();

		if (repo && evt.keyCode == 13) {
			load(repo);
		}
	});

	var history = $('#history');

	history.click(function() {
		var repo = $('#repo').val();
		
		history.button('loading');
		$.getJSON('/log', {repo: repo}, function(data) {
			history.button('reset');
			if (data.err) {
				alert(data.err);
			} else if (data.data) {
				render(data.data)
			}
		})
	});

	$('#content').delegate('a.revision', 'click', function(evt) {

		var repo = $('#repo').val();

		$.getJSON(this.href, {repo: repo}, function(data) {
			data.err && alert(data.err);
			data.data && renderDiff(data.data, data.revision)
		});

		evt.preventDefault();

	});

	$('#content').delegate('a[data-path]', 'click', function(evt) {

		var repo = $('#repo').val();

		$.getJSON(this.href, {repo: repo, path: $(this).data('path')}, function(data) {
			data.err && alert(data.err);
			data.path && $('#content').html(data.data);
		});

		evt.preventDefault();

	});


	$('#merge').click(function() {
		$(this).popover({
			placement: 'bottom',
			container: 'body',
			html: true,
			content: '<input type="text" class="form-control input-sm" />'
		})
	});


	var path = location.hash.split('=')[1];

	$(window).on('hashchange', function() {
		//load(path);
		//console.log(location.hash)
	}).on('load', function() {
		load(path);
		$('#repo').val(path);
	});

	function load(repo) {
		$.getJSON('/list', { repo: repo }, function(data) {
			if (data.err) {
				alert(data.err)
			} else if (data.data) {

				data.data.sort(function(a, b) {
					return a.kind == 'dir' ? -1 : 1;
				})

				render(data.data);
				
				location.hash = 'repo=' + repo;
			}
		});
	}

	function render(data) {

		var res = ['<table class="table">'];

		data.forEach(function(item) {
			res.push('<tr>');
			item.revision && res.push('<td><a class="revision" href="/revision/', item.revision ,'">', item.revision, '</a></td>');
			item.name && res.push('<td><a href="#">', item.name ,'</a></td>');
			res.push('<td><a href="##">', item.author, '</a></td></li>');
			item.msg && res.push('<td>', item.msg, '</td>');
			var o = parseDate(item.date);
			res.push('<td class="text-muted text-right"><small>', getDateStr(o) ,'</small></td>');
			res.push('</tr>');
		});
		res.push('</table>');
		$('#content').html(res.join('')).show(600);
	}

	function renderDiff(data, revision) {

		var res = ['<div class="alert alert-info">Changelist of revision <span class="badge">', revision ,'</span></div>']
		res.push('<pre>');

		data.forEach(function(item) {
			var cls = {
				modified: 'text-warning',
				deleted: 'text-danger'
			}[item.type];

			var s = item.type.charAt(0).toUpperCase();

			res.push('<div class="file-item ', cls ,'">', s, '   <a href="/revision/', revision, '/', item.path, '" data-path="', item.path, '">', item.path, '</a></div>');
		});
		res.push('</pre>');

		$('#content').html(res.join(''));

	}


	function getDateStr(d) {
		if (d.toDateString() == new Date().toDateString()) {
			return [d.getHours(), d.getMinutes()].join(':');
		} else {
			return [d.getFullYear(), d.getMonth() + 1, d.getDate()].join('-');
		}
	}

	function parseDate(str) {
		var s = str.split('T');
		var d = new Date(s[0].replace(/-/, '/') + ' ' + s[1]);
		d.setHours(d.getHours() + 8);
		return d;
	}



}(jQuery);