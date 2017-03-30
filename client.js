var os = require('os');
var nrc = require('node-run-cmd');
var socket = require('socket.io-client')('http://tvpi1.local/television');

socket.on('connect', function(){
  console.log('Connected to System');

  var ifaces = os.networkInterfaces();


  Object.keys(ifaces).forEach(function (ifname) {
    var alias = 0;

    ifaces[ifname].forEach(function (iface) {

      if ('IPv4' !== iface.family || iface.internal !== false) {
        // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
        return;
      }

      if (alias >= 1) {
        // this single interface has multiple ipv4 addresses
        console.log(ifname + ':' + alias, iface.address);
      } else {
        // this interface has only one ipv4 adress
        console.log(ifname, iface.address);
        if (ifname == 'wlan0') {
        // if (ifname == 'en1') {
          
          var info = {
            hostname: os.hostname(),
            ip: iface.address
          };

          socket.emit('computerrunning', info);
        }
      }
      ++alias;
    });
  });

});

socket.on('shutdown', function(data) {
  console.log('shutting down');
  nrc.run('sudo shutdown -h now');
  // process.exit();
});

socket.on('startVideo', function(data) {
  console.log('Starting Video');
  nrc.run('sudo supervisorctl start video_looper');
});

socket.on('stopVideo', function(data) {
  console.log('Stopping Video');
  nrc.run('sudo supervisorctl stop video_looper');
});