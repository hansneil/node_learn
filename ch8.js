// JavaScript Document
/*
 * Node.js中实现套接字服务
 * 后端服务的一个重要部分：通过套接字通信的能力
 * 套接字允许一个进程通过IP地址和端口与另一个进程通信
 * Node.js提供net模块，既可以创建套接字服务器，也可以创建连接到套接字服务器的客户端
 *     套接字：位于HTTP层下面，提供服务器之间的点对点通信
 *            套接字地址：IP和端口的组合
 *            套接字连接中的两种类型的点：一类是服务器，一类是客户端
 *            套接字是http模块的底层结构，不需要GET POST请求，只需要点对点传输数据
 *            进程间只要每个进程打开同一个套接字来读取和写入两个进程之间的数据
 * net模块套接字使用TCP来通信[负责包装数据，并保证成功投递]，实现了Duplex流
 */

/*
 * 1.两个对象 net.Socket net.Server
 *   net.Socket对象：同时在套接字服务器和客户端套接字上创建
 *                  客户端：创建Socket对象：net.connect()/net.createConnection() [表示到服务器的连接]
 *                         该对象监控客户端和服务器的连接，将数据发送给服务器并处理来自服务器的响应
 *                         [node.js net模块中没有客户端对象，用Socket充当]
 *                  服务器：当客户端连接到服务器，Socket对象被创建，并作为参数传递给事件处理程序
 *                         使用该对象监控链接，并发送和接收数据
 *   net.connect(options | port, [host] | path, [connectionListener])
 *   触发事件：connect | data | end | timeout | drain  | error | close
 *   方法：setEncoding | write | end | destroy | pause | resume
 *        setTimeout | setNoDelay | address | unref | ref
 *   属性： bufferSize | remoteAddress | remotePort | localAddress | localPort | bytesRead | bytesWritten
 */
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

/*
 * 1.两个对象 net.Socket net.Server
 *   net.Server对象：创建TCP套接字服务器，通过net.createServer()创建
 *                  负责处理监听连接，然后发送和接收那些连接到服务器的连接的数据
 *   服务器收到连接时，创建一个Socket对象，并传递给正在监听的处理程序
 *   net.createServer([options], [connectListener]), 回调函数接收客户端的socket对象
 *   触发事件： listening | connection | close | error
 *   方法：listen(port, [host], [backlog] | path | handle, [callback])
 *        getConnections(callback) 接收err count
 *        close 阻止服务器接收新的连接
 *        address() 返回绑定的地址
 *        unref ref
 */
var net = require("net"),
	server = net.createServer(function(client){
		console.log("client connected");
		client.on("data", function(data) {
			console.log("client sent ", data.toString());
		});
		client.on("end", function(){
			console.log("Client disconnected");
		});
		client.write("hello");
	});
server.listen(8107, function(){
	console.log("Server listening for connections");
});

/*
 * 2.实现TCP套接字服务器和客户端
 *   客户端：
 *        需要实现：创建连接到服务器的Socket对象，将数据写入服务器，然后处理返回的数据
 *                 创建的套接字需要能够处理错误、缓冲区已满、超时等情况
 */

/*---------------------------------socket_client.js------------------------------*/
var net = require('net');
function getConnection(connName){
	//创建socket客户端
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

//当很多数据写到服务器并且写入失败时，需要一个drain处理程序
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
/*---------------------------------socket_client.js end------------------------------*/

/*
 * 2.实现TCP套接字服务器和客户端
 *   服务器：
 *        需要实现: 创建一个Server对象，监听端口，并处理传入的连接，包括从连接读取数据和把数据写入连接
 *                 套接字服务器需处理Server对象上的close，error事件，以及发生在传入的客户端连接socket对象上的事件
 */

/*---------------------------------socket_server.js------------------------------*/
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
/*---------------------------------socket_server.js end------------------------------*/