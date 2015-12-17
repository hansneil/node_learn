// JavaScript Document
var http = require("http");
var options = {port: '8080'};
function sendRequest(){
	http.request(options, function(response){
		var serverData = '';
		response.on('data', function(chunk){
			serverData += chunk;
		});
		
		response.on('end', function(){
			console.log(serverData);
		});
	}).end();
}

//发送五个请求，这个时候由于服务器有4个工作进程，所以并不知道实际由哪个工作进程处理
//每次运行都会得到不确定的结果
for (var i = 0; i < 5; i++){
	console.log("Sending request");
	sendRequest();
}