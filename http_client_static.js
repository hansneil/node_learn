// JavaScript Document
var http = require("http");
var options = {
	hostname: 'localhost',
	port: '8080',
	path: '/helloa.html'
};

function handleResponse(response){
	var serverData = '';
	response.on('data', function(chunk){
		serverData += chunk;
	});
	response.on('end', function(){
		console.log(serverData);
	});
}

//通过http.request实现ClientRequest对象，回调函数的唯一参数是来自服务器的响应,IncomingMessage对象
http.request(options, function(response){
	handleResponse(response);
}).end();