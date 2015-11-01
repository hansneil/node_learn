// JavaScript Document
//url:
//http://user:pass@host.com:80/resource/path/?query=string#hash
//[协议] [ 身份验证 ][主机(名)][端口号][路径名]	[搜索/查询]
/*
var url = require("url");
var urlStr = "http://hansneil:hansneil@163.com:80/resource/path?query=string#hash";
var urlObj = url.parse(urlStr, true, false);
console.log(urlObj.href);
console.log(urlObj.protocol);
console.log(urlObj.host);
console.log(JSON.stringify(urlObj, null, 4));

var newSource = "/another/path?querynew";
console.log(url.resolve(urlStr, newSource));*/

/*
var qstring = require("querystring");
var params = qstring.parse("name=hansneil&color=green&color=blue&age=15");
console.log(params.name);
console.log(params.color);
console.log(params.age);*/

//http.request(),实现一个ClientRequest对象
/*
var http = require("http");
var options = {
	hostname: 'www.baidu.com',
	path: '/',
	port: '80',
	method: 'GET'
};
var req = http.request(options, function(response){
	var str = "";
	response.on('data', function(chunk){
		str += chunk;
	});
	response.on('end', function(){
		//console.log(str);
	});
	console.log(response.statusCode);
});
req.end();*/

var fs = require("fs");
var http = require("http");
var url = require("url");
var ROOT_DIR = "html/";
http.createServer(function(req, res){
	//handle the request and response here
	var urlObj = url.parse(req.url, true, false);
	fs.readFile(ROOT_DIR + urlObj.pathname, function(err, data){
		if (err) {
			res.writeHead(404);
			res.end(JSON.stringify(err));
			return;
		} else {
			res.writeHead(200);
			res.end(data);
		}
	});
}).listen(8080);