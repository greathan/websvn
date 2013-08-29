var http = require('http'),
	x = require('child_process').exec,
	parser = require('./parser');


var OUT_FORMAT = '--xml';

var svn = function(command, repo, parser, callback) {
	
	command = ['svn', OUT_FORMAT, command].join(' ');

	x(command, {
		cwd: repo,
		maxBuffer: 1024 * 1024 * 10
	}, function(error, stdout, stderr) {

		if (~stdout.indexOf('is not a working copy')) {
			error = repo + ' is not a working copy';
		}

		callback(error, parser && stdout.indexOf('<') == 0 ? parser(stdout) : stdout);

	});

	
};

svn.status = function(repo, callback) {

	svn('st', repo, parser.status, function(err, result) {
		if (err) {
			callback(err, result);
			return;
		}

		callback(null, result);
	});

};

svn.log = function(repo, callback) {
	svn('log -l 20', repo, parser.log, function(err, result) {
		if (err) {
			callback(err, result);
			return;
		}
		callback(null, result);
	})
};

svn.list = function(repo, callback) {
	svn('ls', repo, parser.list, function(err, result) {
		if (err) {
			callback(err, result);
			return;
		}
		callback(null, result);
	});
};

svn.diff = function(repo, callback, revision, path) {
	var sum = path ? '--summarize' : '';
	svn('diff ' + (path ||'') + ' -r' + revision + ':' + (revision - 1) + ' ' + sum, repo, parser.diff, function(err, result) {

		if (err) {
			callback(err, result);
			return;
		}
		callback(null, result);
	})

}

module.exports = svn;