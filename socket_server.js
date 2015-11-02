var net = require("net");
var server = net.createServer(function(client){
	console.log("Client Connection:");
	console.log(" local = %s : %s", client.localAddress, client.localPort);
	console.log(" remote = %s : %s", client.remoteAddress, client.remotePort);
	client.setTimeout(500);
	client.setEncoding('utf8');
	client.on('data', function(data){
		console.log("Received data from client on port %d: %s",
					client.remotePort, data);
		console.log(" Bytes Received: " + client.bytesRead);
		writeData(client, "Sending: " + data.toString());
		console.log(" Bytes Sent: " + client.bytesWritten);
	});
	
	client.on('end', function(){
		console.log("Client Disconnected");
		server.getConnections(function(err, count){
			console.log("Remaining Connections: " + count);
		});
	});
	
	client.on('error', function(err){
		console.log("Socket Error: " + JSON.stringify(err));
	});
	
	client.on('timeout', function(){
		console.log("Socket Timeout");
	});
});

server.listen("8107", function(){
	console.log('Server listening: ' + JSON.stringify(server.address()));
	server.on('close', function(){
		console.log("Server Terminated");
	});
	
	server.on('error', function(){
		console.log("server error: " + JSON.stringify(err));
	});
});

function writeData(socket, data){
	var success = !socket.write(data);
	if (!success){
		(function(socket, data){
			socket.once('drain', function(){
				writeData(data);
			});
		})(socket, data);
	}
}