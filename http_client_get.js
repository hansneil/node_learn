// JavaScript Document
var http = require("http");
var options = {
	hostname: "localhost",
	port: '8080'
	};
function handleResponse(response){
	var serveData = '';
	response.on('data', function(chunk){
		serveData += chunk;
	});
	
	response.on('end', function(){
		console.log("response status: ", response.statusCode);
		console.log("Response Headers: ", response.headers);
		console.log(serveData);
	});
}

http.request(options, function(response){
	handleResponse(response);
}).end();