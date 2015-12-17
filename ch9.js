/*
 * Node.js使用多处理器扩展应用程序
 * 为方便使用多个进程： process: 提供了访问正在运行的进程
 *                   child-process: 创建子进程，并与它们通信
 *                   cluster: 提供实现共享相同端口的集群服务器的能力，允许多个请求被同时处理
 */

/*
 * 1.process模块：全局对象
 *   进程I/O管道：该模块为进程stdin,stdout,stderr提供流标准IO管道的访问
 *   进程信号：该模块允许你注册监听器来处理操作系统发送给进程的信号
 *            进程信号事件： SIGUSR1 | SIGPIPE | SIGHUP | SIGTERM
 *                         SIGINT | SIGBREAK | SIGWINCH | SIGKILL & SIGSTOP [不能安装监听器]
 *   使用process模块控制进程执行
 *            process.exit(0) 使得当前程序退出
 *            process.abort() 使得当前应用程序发出abort事件，并退出产生一个core dump文件
 *            process.kill(pid, [signal])
 *            process.nextTick(callback) 调度应用程序队列中的callback函数
 *   从process模块获取信息
 */
/*process.stdin.on('data', function(data) {
	console.log("You input: " + data);
});
process.on("SIGBREAK", function(){
	console.log("Got a SIGBREAK");
});*/

/*var util = require('util');
console.log('Current dir: ' + process.cwd());
console.log('Env Setting: ' + JSON.stringify(process.env));
console.log('Node Args: ' + process.argv);
console.log('Exec Path ' + process.execPath);
console.log('Memory Usage: ' + util.inspect(process.memoryUsage()));*/

/*
 * 2.实现子进程：利用多处理器的优势，将工作分配给子进程
 *   [子进程无法直接访问彼此或父进程的全局内存]
 *   process模块也是childProcess对象
 *   childProcess对象
 *     事件: message： 在ChildProcess调用send()方法时发出， callback(message)，获得发送的数据
 *          error：在工作进程出现错误时发出
 *          exit：在工作进程结束时发出，接收两个参数 code signal
 *          close：当工作进程中所有的stdio流已经终止时发出
 *          disconnect
 *     方法: kill, send, disconnect
 *     属性: stdin stdout stderr pid connected
 */
//exec():将工作添加到另一个进程中
/*
 * child_process.exec(command, [options], callback)
 * command: 字符串，指定在子shell中执行的命令
 * 返回一个ChildProcess对象
 */

/*var childProcess = require('child_process');
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

/*var childProcess = require('child_process');
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

/*var spawn = require('child_process').spawn;
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

/*var childProcess = require("child_process");
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
	child.send({cmd: command}); //发送command给子进程
}

//创建三个子派生
var child1 = makeChild();
var child2 = makeChild();
var child3 = makeChild();
sendCommand(child1, "makeBreakfast");
sendCommand(child2, "makeLunch");
sendCommand(child3, "makeDinner");*/

/*
 * 3.实现进程集群
 *   使用cluster模块
 *      事件： fork 当新的工作进程被派生时触发，callback接收Worker对象为唯一参数
 *            online 当新工作进程发回一条消息表明已经启动时触发 callback:Worker
 *            listening 当工作进程调用listen()开始监听共享端口时发出 callback接收 (worker, address)
 *            disconnect 当IPC通道被切断时发出
 *            exit | setup
 *      方法和属性：
 *            settings: 包含exec/args/silent等属性值，用于建立集群 exec指向工作进程js文件 args要传递的参数的数组 silent断开IPC机制
 *            isMaster 如果当前进程是集群的主节点，返回true
 *            isWorker 如果当前进程时集群的工作节点，返回true
 *            setupMaster([settings]) 创建主节点
 *            disconnect([callback]) 断开工作进程的IPC机制并关闭句柄
 *            worker: 不在主进程中定义，引用在工作进程的当前Worker对象
 *            workers: 包含worker对象，可以通过标识从主进程引用它们，例如cluster.workers[workerId]
 *
 *   Worker对象，当一个工作进程被派生时，一个Worker对象同时在主进程和工作进程
 *              在工作进程中，Worker对象表示当前的工作进程，并与正在发生的集群事件进行交互
 *              在主进程中，Worker对象代表子工作进程，使主应用程序可以向子进程发送信息，接收子进程状态变化的事件
 *              事件： message: 当受到新消息时触发
 *                    disconnect: IPC通道已对这个工作进程断开时发出
 *                    exit：这个对象断开时发出
 *                    error：这个进程发生错误时发出
 *              方法和属性：
 *                    id: 工作进程的唯一ID
 *                    process：指定该工作进程运行的ChildProcess对象
 *                    suicide：对这个工作进程调用kill/disconnect时被设置为true
 *                    send: 将消息发送给主进程
 *                    kill：断开IPC通道杀掉当前工作进程，然后退出，将suicide标志设置为true
 *                    disconnect() 工作进程中：关闭所有服务器，等待关闭事件，断开IPC通道
 *                                 主进程中：发送一个内部消息给工作进程，使其断开本身，设置suicide标志
 */

var cluster = require("cluster");
var http = require("http");
if (cluster.isMaster) {
	//当主节点派生新的进程时触发，即调用fork()方法时
	cluster.on("fork", function(worker){
		console.log("Worker " + worker.id + " created");
	});

	//监听listening事件，当工作进程Worker调用listen方法时触发，回调函数有一个worker对象指代工作进程，address指代监听端口
	cluster.on('listening',function(worker, address){
		console.log("Worker " + worker.id + " is listening on " +
					address.address + ":" + address.port);
	});

	//当worker对象已经断开时发出
	cluster.on('exit', function(worker, code, signal){
		console.log("Worker " + worker.id + " Exited");
	});

	//设置工作进程要执行的javascript文件
	cluster.setupMaster({exec: 'cluster_worker.js'});
	
	var numCPUs = require('os').cpus().length;
	for (var i = 0; i < numCPUs; i++){
		if (i >= 4) break;
		cluster.fork(); //此处主节点调用fork方法，触发fork事件
	}

	//为每个工作进程绑定message事件，当工作进程执行send()方法时触发
	Object.keys(cluster.workers).forEach(function(id){
		cluster.workers[id].on('message', function(message){
			console.log(message);
		});
	});
}
