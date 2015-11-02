// JavaScript Document
var net = require("net");
var client = net.connect({port: 8107, host: 'localhost'}, function(){
	console.log("connect success");
	client.write("some data\r\n");
});

client.on("data", function(chunk){
	console.log(chunk.toString());
	client.end();
});

client.on("end", function(){
	console.log("connection closed");
});