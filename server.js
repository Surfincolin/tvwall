var http = require('http');
var express = require('express');
var app  = express();
var nrc = require('node-run-cmd');

var alltvs = [];
var shutdownFlag = false;

app.use( express.static(__dirname + '/public') );

// app.get('/', function (res, res) {
// 	res.sendfile(__dirname + '/index.html');
// });


var server = http.createServer(app);
var io = require('socket.io').listen( server );
server.listen(8080);

var tvnsp = io.of('/television');

io.on('connection', function (socket) {
	console.log("New Connection");

	socket.on('turnoff', function() {
		console.log('Turning Off TVs');
		shutdownFlag = true;
		tvnsp.emit('shutdown');
	});

	socket.on('startVideos', function() {
		console.log('Starting Playback');
		tvnsp.emit('startVideo');
		nrc.run('sudo supervisorctl start video_looper');
	});

	socket.on('stopVideos', function() {
		console.log('Stopping Playback');
		tvnsp.emit('stopVideo');
		nrc.run('sudo supervisorctl stop video_looper');
	});

	notify();
});

tvnsp.on('connection', function(socket) {
	console.log('television connected');

	socket.emit('connected', 'Welcome');

	socket.on('computerrunning', function (data) {
		socket.info = data;
		alltvs.push(socket);

		notify();		
	});

	socket.on('disconnect', function(data) {
		console.log('disconnection');

		var i = alltvs.indexOf(socket);
		alltvs.splice(i, 1);

		notify();

		if (shutdownFlag) {
			console.log('ShuttingDown');
			nrc.run('sudo shutdown -h now');
			// process.exit();
		}
	});

});

function notify() {

	var list = [];
	alltvs.forEach(function(s) {
		list.push(s.info);
	});
	

	io.emit('notification', { connected: list });
}