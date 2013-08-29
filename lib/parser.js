
var xml = require('libxmljs');

var Parser = {
	status: function(r) {
		var doc = xml.parseXml(r);

		var nodes = doc.root().find('//entry');

		return nodes.map(function(node) {
			return {
				path: node.attr('path').value(),
				status: node.get('//wc-status/@item').value()
			};
		});
	},
	log: function(r) {

		var doc = xml.parseXml(r);

		var nodes = doc.root().find('//logentry');

		return nodes.map(function(node) {
			return {
				revision: node.attr('revision').value(),
				author: node.get('./author').text(),
				date: node.get('./date').text(),
				msg: node.get('./msg').text()
			};
		});

	},
	list: function(r) {

		var doc = xml.parseXml(r);
		var nodes = doc.root().find('//entry');

		return nodes.map(function(node) {

			var kind = node.attr('kind').value();
			return {
				kind: node.attr('kind').value(),
				name: node.get('./name').text(),
				size: kind == 'file' ? node.get('./size').text() : '',
				revision: node.get('./commit/@revision').value(),
				author: node.get('./commit/author').text(),
				date: node.get('./commit/date').text()
			};
		});
	},
	diff: function(r) {
		
		var doc = xml.parseXml(r);
		var nodes = doc.root().find('//path');

		return nodes.map(function(node) {
			return {
				kind: node.attr('kind').value(),
				type: node.attr('item').value(),
				path: node.text()
			};
		});

	}


};

module.exports = Parser;