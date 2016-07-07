var net = require('net');

// telnet 127.0.0.1 7777
var server = net.createServer(function(socket) {
  socket.write('Echo server\r\n');
  socket.pipe(socket);
});

server.listen(7777, '127.0.0.1');
console.log("Listening to port 7777");
