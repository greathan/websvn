var svn = require('./lib/svn'),
	connect = require('connect'),
	fs = require('fs'),
	url = require('url'),
	async = require('async'),
	jade = require('jade');


var qzz = '/Users/greathan/workshop/qzz.com/';

var app = connect()
	.use(connect.logger('dev'))
	.use('/public', connect.static(__dirname + '/public'))
	.use('/revision', function(req, res) {

		var p = url.parse(req.url, true);
		var revision = p.pathname.split('/')[1];

		var repo = p.query.repo,
			path = p.query.path;

		svn.diff(repo, function(err, result) {

			res.end(JSON.stringify({
				err: err,
				revision: revision,
				path: path,
				data: result
			}));

		}, revision, path);

	})
	.use('/status', function(req, res) {
		var q = url.parse(req.url, true).query;

		var repo = q.repo;

		async.series([
			function(callback) {
				fs.exists(repo, function(is) {
					if (is) {
						callback();
					} else {
						callback({err: 'file not exist'});
					}
				});
			},
			function(callback) {
				svn.status(repo, function(err, result) {


					res.end(JSON.stringify({
						err: err,
						data: result
					}));

				});
			}
		], function(err) {
			if (err) {
				res.end(JSON.stringify(err));
			}
		});

		

	}).use('/log', function(req, res) {

		var q = url.parse(req.url, true).query;

		var repo = q.repo;

		async.series([
			function(callback) {
				fs.exists(repo, function(is) {
					if (is) callback();
					else callback({err: 'file not exist'});
				})
			},
			function(callback) {
				svn.log(repo, function(err, result) {

					res.end(JSON.stringify({
						err: err,
						data: result
					}))


				});
			}
		]);


	}).use('/list', function(req, res) {

		var q = url.parse(req.url, true).query;

		var repo = q.repo;

		async.series([
			function(callback) {
				fs.exists(repo, function(is) {
					if (is) callback();
					else callback({err: 'file not exist'});
				})
			},
			function(callback) {
				svn.list(repo, function(err, result) {

					res.end(JSON.stringify({
						err: err,
						data: result
					}))


				});
			}
		]);


	}).use('/', function(req, res) {
		var html = jade.renderFile('templates/index.jade');
		res.end(html);
	}).listen('8800', function() {

	});