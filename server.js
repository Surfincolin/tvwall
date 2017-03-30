var http = require('http');
var express = require('express');
var app  = express();




app.use( express.static(__dirname + '/public') );

// app.get('/', function (res, res) {
// 	res.sendfile(__dirname + '/index.html');
// });


var server = http.createServer(app);
var io = require('socket.io').listen( server );
server.listen(8080);

io.on('connection', function (socket) {
	console.log("New Connection");

	socket.emit('news', { hello: 'world' });

	socket.on('my other event', function (data) {
		console.log(data);
	});
});

var tvnsp = io.of('/television');

tvnsp.on('connection', function(socket) {
	console.log('television connected');

	socket.emit('connected', 'Welcome');
});