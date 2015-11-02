// JavaScript Document
var net = require('net');
function getConnection(connName){
	var client = net.connect({port: 8107, host: "localhost"}, function(){
		console.log(connName + " Connected");
		console.log(' local=%s:%s', this.localAddress, this.localPort);
		console.log(' remote=%s:%s', this.remoteAddress, this.remotePort);
		this.setTimeout(500);
		this.setEncoding('utf8');
		this.on('data', function(data){
			console.log(connName + " From Server: " + data.toString());
			this.end();
		});
		
		this.on('end', function(){
			console.log(connName + " Client Disconnected");
		});
		
		this.on('error', function(err){
			console.log("Socket error: " + JSON.stringify(err));
		});
		
		this.on('timeout', function(){
			console.log("Socket Timeout");
		});
		
		this.on('close', function(){
			console.log("Socket Closed")
		});
	});
	
	return client;
}

function writeData(socket, data){
	var success = !socket.write(data);
	if (!success) {
		(function(socket, data){
			socket.once('drain', function(){
				socket.write(data);
			});
		})(socket, data);
	}
}

var Dwarves = getConnection("Dwarves"),
	Elves = getConnection("Elves"),
	Hobbits = getConnection("Hobbits");
	
writeData(Dwarves, "More Axes");
writeData(Elves, "More Arrows");
writeData(Hobbits, "More pipe weed");