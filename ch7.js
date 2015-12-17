// JavaScript Document
/*
 * Node.js能够非常迅速实现HTTP和HTTPS服务器和服务的能力
 * 提供内置的http和https模块
 * 主要用于：
 *        供应用程序使用的后端Web服务
 * 实现客户端和服务器时需要使用的对象
 */

/*
 * 1.url:统一资源定位符/充当http服务器用来处理来自客户端请求的一个地址标签
 *     http://  user  :  pass  @host.com:   80   /resource/path/?query=string#hash
 *     [协议]    [ 身份验证 ]    [主机(名)] [端口号]    [路径名]    	  [搜索/查询]
 *     url为将一个请求发送到正确的服务器端口上，并访问合适的数据提供了[所有]需要的信息
 *
 *     node.js提供了url模块，可以将url字符串转换为url对象
 *         url.parse(urlStr, [parseQueryString], [slashesDenoteHost])
 *         [parseQueryString] boolean 默认为false 如果true, 将查询字符串也解析为对象字面量
 *         [slashesDenoteHost] boolean 默认为false 如果true，则将//host/path部分分开解析
 *     也可以将url对象转换为字符串形式：url.format(urlObj)
 *
 *     解析url组件：和浏览器相同的方式解析url的组件，方便在服务器端操作url字符串
 *     [例如：请求的资源已经移动或者更改参数，这样方便在服务器端进行调整]
 *     url.resolve(from, to)
 *         from: 指定原始基础url字符串
 *         to：指定想要url被解析到的新位置
 */

var url = require("url");
var urlStr = "http://hansneil:hansneil@163.com:80/resource/path?query=string#hash";
var urlObj = url.parse(urlStr, true, false);
console.log("url object: ");
console.log(urlObj);
console.log("url string: ");
console.log(url.format(urlObj));

var newSource = "/another/path?querynew";
console.log(" ");
console.log("====!!The resource has been moved, enjoy it====")
console.log(url.resolve(urlStr, newSource));

/*
 * 2.处理查询字符串和表单参数
 *   [1]url中包含查询字符串--通过解析url对象获得    ------------------------------------
 *   																			   |--都是基本的键/值对
 *   [2]正文内包含参数数据来处理表单的提交--从客户端请求的正文中读出 -----------------------
 *   在node.js web服务器中，需要使用querystring模块的parse方法来将请求字符串转换成js对象
 *       querystring.parse(str, [sep], [eq], [options])
 *       str -- 查询或者参数字符串
 *       [sep] -- 指定使用的分隔符 默认为： &
 *       [eq] -- 指定使用的赋值运算符 默认为：=
 *       [options]里面具有一个maxKeys属性，如果为0则没有任何限制，默认为1000
 *       反过来将查询对象转换为字符串 querystring.stringify(obj, [sep], [eq])
 */

var url = require("url");
var qstring = require("querystring");  //调用querystring模块，使用其中的parse方法
//对于一个完整的url字符串，可以先通过url.parse(urlStr)获取url对象，然后处理其中的urlObj.search
var urlStr = "http://hansneil:hansneil@163.com:80/resource/path?name=hansneil&color=green&color=blue&age=15";
var urlObj = url.parse(urlStr, true, false);
var urlQuery = urlObj.search;
var urlQuery = urlQuery.slice(1);
var params = qstring.parse(urlQuery);
console.log("============完整的查询对象============");
console.log(params);
console.log("====================================");
console.log(params.name);
console.log(params.color);
console.log(params.age);
var queryStr = qstring.stringify(params, '+', ':');
console.log(queryStr);

/*
 * 3.了解请求、响应和服务器对象
 *   http模块的基本对象：请求和响应对象[提供信息以及流入流出http客户端和服务器的许多功能]
 *                    [了解对象的属性、方法和事件]
 *            主要对象: ClientRequest [客户端请求]
 *                     ServerResponse [服务器响应]
 *                     IncomingMessage 和 Server
 */

/*
 * 3.1 http.ClientRequest对象
 *     构建http客户端时，调用http.request()会在内部创建一个ClientRequest对象
 *     ClientRequest对象：启动、监控和处理来自服务器的响应
 *                       实现了一个writable流 [拥有所有writable流的功能]
 *                       创建方法：
 *                          http.request(options, callback)
 *                          options: 定义如何把客户端的http请求打开并发送给服务器
 *                          callback: 回调函数，处理服务器的响应，唯一的参数就是IncomingMessage对象[来自服务器的响应]
 *                       _____________________________________________________________________________________
 *                       | 支持的事件：																		  |
 *                       | response: 从服务器接收到该请求的响应时发出											  |
 *                       | socket: 当套接字被分配给该请求时发出													  |
 *                       | connect: 每当服务器响应一个由connect方法发起的请求时发出								  |
 *                       | upgrade: 当服务器响应在标头包括一个更新请求时发出										  |
 *                       | continue: 当服务器发送100 Continue HTTP响应，指示客户端发送请求正文时发出				  |
 *                       --------------------------------------------------------------------------------------
 *                       -------------------------------------------------------------------------------------
 *                       | 支持的方法：将数据写入请求、中止请求或者停止请求的方法									  |
 *                       | write(chunk, [encoding]) writable流 传输正文数据，标头{transfer-encoding, chunked}    |
 *                       | end([data], [encoding]) 将数据写入请求正文，刷新writable流并终止请求					  |
 *                       | abort() 中止当前请求																  |
 *                       | setTimeout(timeout, [callback]) 为请求设置套接字超时时间								  |
 *                       | setNoDelay([noDelay]) setSocketKeepAlive([enable], [initialDelay])				  |
 *                       --------------------------------------------------------------------------------------
 *
 *     给出options的一个实例：
 *        options = {
 *            hostname: 'www.myserver.com', -- 请求发往的服务器的域名和ip地址[同host，但更被url.parse支持]
 *            path: '/', -- 指定所请求的资源路径的字符串 [也应该包含查询字符串，如/book.html?chapter=12]
 *            port: 8080, -- 运程服务器的端口
 *            method: 'POST' -- 指定HTTP请求的方法的字符串 'GET POST CONNECT OPTIONS'
 *        }
 */

/*
 * 3.2 http.ServerResponse对象
 *     http服务器接收到一个request事件时，在内部创建一个ServerResponse对象，
 *     该对象作为第二个参数被传递到request事件处理程序中，
 *     可以使用该对象指定并发送到客户端的响应
 *     ServerResponse对象：实现一个writable流，支持该流的所有功能
 *                        使用属性、事件和方法建立标头，写入数据并发送响应，处理客户端请求
 *                        ----------------------------------------------------------------------------------
 *                        | 支持的事件或属性																	|
 *                        | close[event] 当到客户端的连接在发送response.end()来完成刷新响应之前关闭时发出			|
 *                        | headersSent: boolean 如果标头已被发送，则为true										|
 *                        | sendData: boolean 如果为true, Date标头自动生成										|
 *                        | statusCode: 无需显式地写入标头来指定响应状态码										|
 *                        ----------------------------------------------------------------------------------
 *                        ----------------------------------------------------------------------------------
 *                        | 支持的方法																		|
 *                        | writeContinue() 发送一个HTTP/ 1.1 100 Continue消息给客户端，请求被发送的正文内容		|
 *                        | writeHead(statusCode, [reasonPhase], [headers]) 把响应标头写入请求					|
 *                        |     statusCode: 三位响应状态代码 reasonPhase: 代码的原因 headers: 响应标头			|
 *                        | setTimeout(msecs, callback) 设置客户端连接的套接字超时时间							|
 *                        | setHeader(name, value) getHeader(name) removeHeader(name)						|
 *                        | write(chunk, [encoding]) 写入chunk/buffer/string到响应writable流					|
 *                        | addTrailers(headers) 将http尾随标头写入响应的结束处									|
 *                        | end([data], [encoding]) 将可选的数据输出写入响应的正文，完成响应						|
 *                        ----------------------------------------------------------------------------------
 */

/*
 * 3.3 http.IncomingMessage对象
 *     无论http服务器还是http客户端都创建IncomingMessage对象
 *     服务器端：客户端请求由一个IncomingMessage对象表示
 *     客户端：服务器响应由一个IncomingMessage对象表示
 *     IncomingMessage对象：实现了一个readable流，方便将客户端请求和服务器响应作为流连续读入[readable和data事件可以被监听]
 *                         ---------------------------------------------------------------------------------
 *                         | 支持的事件/属性/方法																|
 *                         | close[event] 当底层套接字被关闭时发出												|
 *                         | httpVersion: 指定用于构建客户端请求/响应的http版本									|
 *                         | headers/trailers: 随请求/响应发送的标头/trailer标头的对象							|
 *                         | method: 指定用于请求/响应的方法 [GET POST CONNECT]									|
 *                         | url: 指定发送到服务器的url字符串，只在客户端有效										|
 *                         | statusCode: 指定来自服务器的3位数状态码，只在客户端有效								|
 *                         | socket: 指向net.socket对象的句柄，用来与客户端/服务器通信							|
 *                         | setTimeout(msecs, callback)													|
 *                         ---------------------------------------------------------------------------------
 */

/*
 * 3.4 httpServer对象
 *     该对象实现了HTTP服务器的基本框架，提供一个监听端口的底层套接字、接收请求，然后发送响应给客户端连接的处理程序
 *     httpServer对象实现EventEmitter
 *     httpServer对象： -------------------------------------------------------------------------------------
 *                     | 支持的事件																			|
 *                     | request: 接收到客户端请求时触发，回调函数接受两个参数，代表客户端请求的IncomingMessage对象	|
 *                     |										  用来制定和发送响应的http.ServerResponse对象	|
 *                     | connection: 新的TCP流建立时被触发，回调函数接收唯一的参数：套接字socket					|
 *                     | close：服务器关闭时触发，回调函数不接受参数												|
 *                     | checkContinue: 当收到包括期待的100-continue标头的请求时触发								|
 *                     | connect: 接收到http connect请求时发出													|
 *                     | upgrade: 客户端请求http升级时发出														|
 *                     | clientError: 当客户端连接套接字发出一个错误时发出 callback(err, socket)					|
 *                     -------------------------------------------------------------------------------------
 *     启动http服务器：1.调用createServer()方法创建一个Server对象
 *                     http.createServer([requestListener]) 可选的参数：在请求事件被触发时执行的回调函数
 *                     回调函数接受两个参数，代表客户端请求的IncomingMessage对象，用来制定和发送响应的http.ServerResponse对象
 *                   2.创建server对象后可以调用listen方法开始监听
 *                     listen(port, [hostname], [backlog], [callback])
 *                     port: 监听的端口 hostname: 当主机名将接受链接时指定
 *                     backlog: 允许进行排队的最大待处理连接数 callback: 在开始监听时要执行的回调函数
 *                     示例：
 *                         	var http = require('http');
 *                         	http.createServer(function(req, res){
 *                         	});
 *                         	通过两种方法监听通过文件系统的连接
 *                         	listen(path, [callback]) -- 文件路径
 *                         	listen(handle, [callback]) -- 文件句柄
 *                         	结束开始的监听
 *                         	close([callback])
 *
 */

/*
 * 4.实现HTTP客户端和服务器
 */

/*
 * 4.1 提供静态文件服务
 *     步骤： 启动HTTP服务器并监听端口 -- 通过请求处理程序打开文件	-- 将文件内容写入响应
 */

/*--------------------------http_server_static.js------------------------------*/
var fs = require("fs");
var http = require("http");
var url = require("url");
var ROOT_DIR = "html/";

//http.createServer 创建一个server对象，回调函数处理当接收到客户端请求时处理请求
//listen：一旦server创建后，开始监听
http.createServer(function(req, res){
	//handle the request and response here
	var urlObj = url.parse(req.url, true, false);
	console.log(urlObj);
	fs.readFile(ROOT_DIR + urlObj.pathname, function(err, data){
		if (err) {
			res.writeHead(404);
			res.end(JSON.stringify(err));
			return;
		} else {
			//res属于http.ServerResponse, 实现了writable流的功能
			//通过end方法写入数据关闭连接
			res.writeHead(200);
			res.end(data);
		}
	});
}).listen(8080);
/*--------------------------http_server_static.js end------------------------------*/

/*--------------------------http_client_static.js------------------------------*/
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
//由于response是一个IncomingMessage对象，由readable流实现，因此可以通过触发data事件获取数据
http.request(options, function(response){
	handleResponse(response);
}).end();
/*--------------------------http_client_static.js end------------------------------*/

/*
 * 4.2 实现动态的GET服务器
 *     该内容由动态的HTML文件或片段，JSON数据等构成
 *     实现： 在request事件处理程序中来动态填充要发送给客户端的数据，把它写入响应，
 *           调用end()完成响应和刷新writable流
 */

/*--------------------------http_server_static.js------------------------------*/
//很好理解，注释省略
var http = require("http");
var message = [
	'Hello World',
	'From a basic Node.js server',
	'Take Luck'
];
http.createServer(function(req, res){
	res.setHeader("Content-Type", "text/html");
	res.writeHeader(200);
	res.write('<html><head><title>simple http server</title></head>');
	res.write('<body>');
	for (var idx in message){
		res.write('\n<h1>' + message[idx] + '</h1>');
	}
	res.end('\n</body></html>');
}).listen(8080);
/*--------------------------http_server_static.js end------------------------------*/

/*--------------------------http_client_static.js------------------------------*/
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
//最后需要调用end()刷新writable流并终止请求
/*--------------------------http_client_static.js end------------------------------*/

/*
 * 4.3 实现POST服务器
 *     如果需要提交表单将数据发送到服务器进行更新，需要POST服务器实现
 *     在request事件发生时，需要通过事件处理程序在POST请求正文中读取内容并处理
 *     一旦完成数据处理，将其写回响应并通过end()完成响应
 */

/*--------------------------http_server_static.js------------------------------*/
//很好理解，注释省略
var http = require('http');
http.createServer(function (req, res) {
	var jsonData = "";
	req.on('data', function (chunk) {
		jsonData += chunk;
	});
	req.on('end', function () {
		var reqObj = JSON.parse(jsonData);
		var resObj = {
			message: "Hello " + reqObj.name,
			question: "Are you a good " + reqObj.occupation + "?"
		};
		res.writeHead(200);
		res.end(JSON.stringify(resObj));
	});
}).listen(8080);
/*--------------------------http_server_static.js end------------------------------*/

/*--------------------------http_client_static.js------------------------------*/
var http = require('http');
var options = {
	host: '127.0.0.1',
	path: '/',
	port: '8080',
	method: 'POST'
};
function readJSONResponse(response) {
	var responseData = '';
	response.on('data', function (chunk) {
		responseData += chunk;
	});
	response.on('end', function () {
		var dataObj = JSON.parse(responseData);
		console.log("Raw Response: " +responseData);
		console.log("Message: " + dataObj.message);
		console.log("Question: " + dataObj.question);
	});
}
var req = http.request(options, readJSONResponse);
req.write('{"name":"Bilbo", "occupation":"Burgler"}'); //调用write方法将数据写入正文
req.end();
/*--------------------------http_client_static.js end------------------------------*/

/*
 * 4.4 与外部源交互
 *     另外一个常见用途：从外部系统获取数据来满足客户端的请求
 */

/*---------------------------http_server_external.js------------------------------*/
var http = require('http');
var url = require('url');
var qstring = require('querystring');
function sendResponse(weatherData, res){
	var page = '<html><head><title>External Example</title></head>' +
		'<body>' +
		'<form method="post">' +
		'City: <input name="city"><br>' +
		'<input type="submit" value="Get Weather">' +
		'</form>';
	if(weatherData){
		page += '<h1>Weather Info</h1><p>' + weatherData +'</p>';
	}
	page += '</body></html>';
	res.end(page);
}
function parseWeather(weatherResponse, res) {
	var weatherData = '';
	weatherResponse.on('data', function (chunk) {
		weatherData += chunk;
	});
	weatherResponse.on('end', function () {
		sendResponse(weatherData, res);
	});
}
function getWeather(city, res){
	var options = {
		host: 'http://api.openweathermap.org',
		path: '/data/2.5/weather?q=' + city
	};
	http.request(options, function(weatherResponse){
		parseWeather(weatherResponse, res);
	}).end();
}
//创建一个server，然后开始监听，注意最开始请求网页时发出的是GET请求，此时直接调用sendResponse, 没有weatherData
//如果用户输入城市点击submit时，这个时候发出的请求是post
http.createServer(function (req, res) {
	console.log(req.method);
	if (req.method == "POST"){
		var reqData = '';
		req.on('data', function (chunk) {
			reqData += chunk;
		});
		req.on('end', function() {
			var postParams = qstring.parse(reqData);
			getWeather(postParams.city, res);
		});
	} else{
		sendResponse(null, res);
	}
}).listen(8080);
/*---------------------------http_server_external.js end-------------------------*/
