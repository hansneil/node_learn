// JavaScript Document
/*
 * 具备创建、读取和修改文件，访问目录的能力
 * 访问文件和目录的信息，删除、截断和重命名文件与目录
 *
 * 同步文件系统调用会阻塞线程，直至调用完成，应尽可能限制同步文件系统调用
 * 异步文件系统调用则被放在事件队列中以备随后运行
 */
//加载文件系统模块
var fs = require("fs");
//fs提供的功能都有两种形式可供选择，异步和同步[理解差异至关重要!!!]
//异步调用会被放置在事件队列中，符合node.js事件模型

//异步和同步文件系统调用的区别
//异步调用需要一个回调函数作为参数，回调函数在文件系统请求完成时被执行
//异步调用自动处理异常，而在同步中需要处理异常必须使用try/catch块
//同步调用立即执行，并且除非它们完成，否则执行不会回到当前线程，而异步调用则被放在事件队列中，并且执行返回到运行的线程代码

/*
 * 1.打开关闭文件
 *   同步： fs.openSync(path, flag, [mode])
 *         fs.closeSync(fd);
 *   异步： fs.open(path, flag, [mode], callback)
 *         fs.close(fd, callback)
 *   关闭文件的作用：迫使操作系统把更改刷新到磁盘并释放操作系统锁
 *   异步操作实例：
 *      fs.open("myFile", "w", function(err, fd){
 *          if (!err) {
 *              fs.close(fd);
 *          }
 *      });
 *   同步操作实例：
 *       var fd = fs.openSync("myFile", "w");
 *       fs.closeSync(fd);
 */

/*
 * 2.写入文件
 *   fs提供4种方式写入文件
 *     单个调用中将数据写入文件 fs.writeFile(path, data, [options], callback) fs.writeFileSync(path, data, [options])
 *     使用同步写操作写入块 fs.writeSync(fd, data, offset, length, position)
 *     使用异步写操作写入块 fs.write(fd, data, offset, length, position, callback)
 *     通过writable流来流写入 fs.createWriteStream(path, [options])
 *   四种方式都接受string或者buffer作为输入
 */

//简单文件写入 writeFile/writeFileSync
/*
 * 特点：将字符串或缓冲区的全部内容写入一个文件
 */

var config = {
	maxFiles: 20,
	maxConnection: 15,
	rootPath: "/webroot"
};

var configTxt = JSON.stringify(config); //将json对象转换为string对象
var options = {encoding: 'utf8', flag: 'w'};
fs.writeFile('config.txt', configTxt, options, function(err){
	if (err) {
		console.log("config write failed");
	} else {
		console.log("config saved");
	}
});

//同步写入文件 writeSync(fd, data, offset, length, position) 注意打开和关闭文件
/*
 * 在返回执行正在运行的线程之前，将数据写入文件
 * 需要通过openSync获取文件描述符，最后通过closeSync释放
 * offset: 指定data参数中开始阅读的索引，如果想从当前索引开始，则设为NULL
 * length: 指定写入的字节数，如果是NULL，则从所有开始到数据缓冲区的末尾
 * position: 指定文件中开始写入的位置，若为NULL，表示从当前位置开始
 */

var veggieTray = ["carrots", "celery", "olives"];
fd = fs.openSync('veggie.txt', 'w');
while (veggieTray.length) {
	veggie = veggieTray.shift() + " ";
	var bytes = fs.writeSync(fd, veggie, null, null, null);
	console.log("wrote %s %dbytes", veggie, bytes);
}
fs.closeSync(fd);

//异步写入文件 write(fd, data, offset, length, position, callback) callback必须包含err和bytes
/*
 * 异步写入文件更加符合node.js的宗旨，在事件队列中放置一个写入请求
 * 之后将控制权返回给调用代码，只有当事件循环提出写入请求时才会执行它
 * 如果有多个异步写入请求，除非等到前一个写入回调函数完成，否则无法保证写入顺序
 * 解决方法：将写操作嵌套执行，将写操作嵌套在上一个写操作的回调函数中！！
 *
 * 实现：
 *    和同步写入一样，需要通过open和close获取和释放文件描述符
 *    offset/length/position 和同步写入一致
 *    callback接受两个参数，err 和 bytes
 */

var fruitBowl = ["apple", "orange", "banana", "grapes"];
function writeFruit(fd) {
	if (fruitBowl.length) {
		var fruit = fruitBowl.shift() + " ";
		fs.write(fd, fruit, null, null, function(err, bytes){
			if (err) {
				console.log("file write error");
			} else {
				console.log("write %s %dbytes", fruit, bytes);
				writeFruit(fd);
			}
		});
	} else {
		fs.close(fd);
	}
}

fs.open('fruit.txt', 'w', function(err, fd){
	writeFruit(fd);
});

//流式文件写入 fs.createWriteStream创建Writable对象，之后就可以用write写入了
/*
 * 适用于向文件中写入大量数据
 * fs.createWriteStream(path, [options])
 * options: encoding | mode | flag
 * 写入方式：标准的流式write(buffer)写入，写入最后用end结束
 */

var grains = ["wheat", "rice", "oats"];
var options = {encoding: "utf8", flag: "w"};
var fileWriteStream = fs.createWriteStream('grains.txt', options);
fileWriteStream.on("close", function(){
	console.log("file closed");
});

while (grains.length) {
	var data = grains.shift() + " ";
	fileWriteStream.write(data);
	console.log("write: %s", data);
}
fileWriteStream.end();

/*
 * 3.读取文件
 * 同样是4种方式读取数据
 *    以一个大块读取
 *    以采用同步读取的块
 *    以采用异步读取的块
 *    通过一个Readable流来流式读
 */
//简单文件读取 readFile(path, [options], callback)/readFileSync(path, [options])

var options = {encoding: 'utf8', flag: 'r'}; //encoding | mode | flag
fs.readFile('config.txt', options, function(err, data){
	if (err) {
		console.log("failed to open config file");
	} else {
		console.log("config loaded");
		var dataObj = JSON.parse(data);
		console.log(dataObj);
		console.log("maxFiles: ", dataObj.maxFiles);
		console.log("maxConnection: ", dataObj.maxConnection);
		console.log("rootPath: ", dataObj.rootPath);
	}
});

//同步读取文件 readSync(fd, buffer, offset, length, position)

fd = fs.openSync("veggie.txt", 'r');
var grains = "";
do {
	var buf = new Buffer(5);
	buf.fill();
	var bytes = fs.readSync(fd, buf, null, 5);
	console.log("read %dbytes", bytes);
	grains += buf.toString();
}while (bytes > 0);
fs.closeSync(fd);
console.log("Grains: ", grains);

//异步读取文件 read(fd, buffer, offset, length, position, callback)
/*
 * 为确保读取数据的顺序，可以将读操作嵌套在上一次的读取操作中
 */

function readGrains(fd, grains) {
	var buf = new Buffer(5);
	buf.fill();
	fs.read(fd, buf, 0, 5, null, function(err, bytes, data){
		if (err) {
			console.log("read error!!!");
		} else if (bytes > 0) {
			console.log("read %dbytes", bytes);
			grains += data;
			readGrains(fd, grains);
		} else {
			fs.close(fd);
			console.log("Grains: ", grains);
		}
	});
}

fs.open("fruit.txt", 'r', function(err, fd){
	readGrains(fd, "");
});

//流式文件读取 createReadStream(path, [options])
/*
 * 读取大量数据最好的方法
 * 打开文件后，可以通过readable事件，read()请求或者data事件轻松地将数据读出
 */

var options = {encoding: 'utf8', flag: 'r'};
var fileReadStream = fs.createReadStream("grains.txt", options);
fileReadStream.on("data", function(chunk){
	console.log("Grains: %s", chunk);
	console.log("read %dbytes of data", chunk.length);
});
fileReadStream.on("close", function(){
	console.log("file closed");
});

/*
 * 4.其他文件系统任务
 */

/*
 * 4.1 验证路径的存在性
 * fs.exists(path, callback)
 * fs.existsSync(path);
 * 异步调用时，callback会有一个代表路径是否存在的参数
 * 同步调用时是一个返回值
 */

fs.exists("config.txd", function(exist){
	console.log(exist ? "Path exists" : "Path does not exists");
});

var exist = fs.existsSync("config.txt");
console.log(exist ? "Path exists" : "Path does not exists");

/*
 * 4.2 获取文件信息
 * fs.stat(path, callback)
 * fs.statSync(path)
 */

fs.stat("config.txt", function(err, stats){
	if (err) {
		console.log("Path not exists!!!");
	} else {
		console.log("stats: " + JSON.stringify(stats, null, " "));
		console.log(stats.isFile());
		console.log(stats.isDirectory());
		console.log(stats.isSocket());
	}
});

/*
 * 4.3 列出文件
 * fs.readdir(path, callback)
 * fs.readdirSync(path)
 */

var path = require("path");
function WalkDirs(dirPath) {
	console.log(dirPath);
	fs.readdir(dirPath, function(err, entries){
		for (var idx in entries) {
			var fullPath = path.join(dirPath, entries[idx]);
			(function(fullPath){
				fs.stat(fullPath, function(err, stats){
					if (stats && stats.isFile()){
						console.log(fullPath);
					} else if (stats && stats.isDirectory()){
						WalkDirs(fullPath);
					}
				});
			})(fullPath);
		}
	});
}
WalkDirs(".");

/*
 * 4.4 删除文件
 * fs.unlink(path, callback);
 * fs.unlinkSync(path)
 */

fs.unlink("new.txt", function(err){
	console.log(err ? "del failed" : "del");
});

/*
 * 4.5 截断文件
 * fs.truncate(path, len, callback)
 * fs.truncateSync(path, len)
 */

fs.truncate("new.txt", function(err){
	console.log(err ? "truncate failed" : "truncated");
});

/*
 * 4.6 创建删除目录
 */

fs.mkdir("./data", function(err){
	fs.mkdir("./data/folderA", function(err){
		console.log("complete");
	});
});

fs.rmdir("./data/folderA", function(err){
	fs.rmdir("./data", function(err){
		console.log("recovered");
	});
});

fs.rename("config.txt", "grains.txt", function(err){
	console.log(err ? "rename failed" : "file renamed");
});

fs.watchFile("grains.txt", {persistent: true, interval: 5000}, function(curr, prev){
	console.log("grains.txt modified at: " + curr.mtime);
	console.log("previous modification was: " + prev.mtime);
});