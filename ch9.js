// JavaScript Document
/*
var util = require('util');
console.log('Current dir: ' + process.cwd());
console.log('Env Setting: ' + JSON.stringify(process.env));
console.log('Node Args: ' + process.argv);
console.log('Exec Path ' + process.execPath);
console.log('Memory Usage: ' + util.inspect(process.memoryUsage()));*/

//实现子进程
//childProcess对象
//事件: message error exit close disconnect
//方法: kill, send, disconnect
//属性: stdin stdout stderr pid connected

//exec():将工作添加到另一个进程中
/*
var childProcess = require('child_process');
var options = {maxBuffer: 100*1024, encoding: 'utf8', timeout: 5000};
var child = childProcess.exec('dir /B', options, function(error, stdout, stderr){
	if (error) {
		console.log(error.stack);
		console.log('Error Code: ' + error.code);
		console.log('Error Signal' + error.signal);
	}
	console.log('Results: \n' + stdout);
	if (stderr.length){
		console.log('Errors: ' + stderr);
	}
});

child.on("exit", function(code){
	console.log("completed with code: " + code);
});*/

//execFile(): 将工作添加到另一个进程，但执行的是可执行文件
/*
var childProcess = require('child_process');
var options = {maxBuffer: 100*1024, encoding: 'utf8', timeout: 5000};
var child = childProcess.execFile('ping.exe', ['-n', '1', 'google.com'],
								options, function(error, stdout, stderr){
	if (error) {
		console.log(error.stack);
		console.log('Error Code: ' + error.code);
		console.log('Error Signal: ' + error.signal);
	}
	
	console.log("Results: \n" + stdout);
	
	if (stderr.length) {
		console.log("Errors: " + stderr);
	}
});

child.on('exit', function(code){
	console.log('Child completed with code ' + code);
});*/

//spawn: 产生一个新的进程，连接它们之间的stdin stdout stderr管道
//在产生的新的进程中运行spawn函数执行文件
//spawn()和 exec() execFile()主要区别在于产生的进程中stdin是可配置的
//stdout stderr是父进程的readable流，因此无需等到进程执行完成exit才能获取数据
//只要数据已被写入，就可以读取它
//spawn函数没有回调函数
/*
var spawn = require('child_process').spawn;
var options = {
	env: {user: 'neil'},
	detached: false,
	stdio: ['pipe', 'pipe', 'pipe']
};

var child = spawn('netstat', ['-e']); //没有回调函数
child.stdout.on('data', function(data){
	console.log(data.toString());
});

child.stderr.on('data', function(data){
	console.log(data.toString());
});

child.on('exit', function(code){
	console.log('Child exited with code: ' + code);
});*/

//实现子派生，很有用，用于在一个单独处理器上执行另一个V8引擎实例的nodejs代码
//不能创建比CPU数目更多的进程，这样并没有什么好处
//fork函数返回一个childProcess对象，并且没有回调函数，通过send()在子进程和父进程之间通信
/*
var childProcess = require("child_process");
var options = { 
	env: {user: "neil"},
	encoding: 'utf8'
}
function makeChild() {
	var child = childProcess.fork("chef.js", null, options);
	child.on("message", function(message){
		console.log("served: " + message);
	});
	return child;
}
function sendCommand(child, command){
	console.log("Requesting: " + command);
	child.send({cmd: command});
}

var child1 = makeChild();
var child2 = makeChild();
var child3 = makeChild();
sendCommand(child1, "makeBreakfast");
sendCommand(child2, "makeLunch");
sendCommand(child3, "makeDinner");*/

var cluster = require("cluster");
var http = require("http");
if (cluster.isMaster) {
	cluster.on("fork", function(worker){
		console.log("Worker " + worker.id + " created");
	});
	
	cluster.on('listening',function(worker, address){
		console.log("Worker " + worker.id + " is listening on " + 
					address.address + ":" + address.port);
	});
	
	cluster.on('exit', function(worker, code, signal){
		console.log("Worker " + worker.id + " Exited");
	});
	
	cluster.setupMaster({exec: 'cluster_worker.js'});
	
	var numCPUs = require('os').cpus().length;
	for (var i = 0; i < numCPUs; i++){
		if (i >= 4) break;
		cluster.fork();
	}
	
	Object.keys(cluster.workers).forEach(function(id){
		cluster.workers[id].on('message', function(message){
			console.log(message);
		});
	});
}