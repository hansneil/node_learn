// JavaScript Document
//加载文件系统模块
var fs = require("fs");
//fs提供的功能都有两种形式可供选择，异步和同步[理解差异至关重要!!!]
//异步调用会被放置在事件队列中，符合node.js事件模型

//异步和同步文件系统调用的区别
//异步调用需要一个回调函数作为参数，回调函数在文件系统请求完成时被执行
//异步调用自动处理异常，而在同步中需要处理异常必须使用try/catch块
//同步调用立即执行，并且除非它们完成，否则执行不会回到当前线程，而异步调用则被放在事件队列中，并且执行返回到运行的线程代码

//简单文件写入 writeFile/writeFileSync
/*
var config = {
	maxFiles: 20,
	maxConnection: 15,
	rootPath: "/webroot"
};

var configTxt = JSON.stringify(config);
var options = {encoding: 'utf8', flag: 'w'};
fs.writeFile('config.txt', configTxt, options, function(err){
	if (err) {
		console.log("config write failed");
	} else {
		console.log("config saved");
	}
});*/

//同步写入文件 writeSync(fd, data, offset, length, position) 注意打开和关闭文件
/*
var veggieTray = ["carrots", "celery", "olives"];
fd = fs.openSync('config.txt', 'w');
while (veggieTray.length) {
	veggie = veggieTray.pop();
	var bytes = fs.writeSync(fd, veggie, null, null, null);
	console.log("wrote %s %dbytes", veggie, bytes);
}
fs.closeSync(fd);*/

//异步写入文件 write(fd, data, offset, length, position, callback) callback必须包含err和bytes
//var fs = require("fs");
/*
var fruitBowl = ["apple", "orange", "banana", "grapes"];
function writeFruit(fd) {
	if (fruitBowl.length) {
		var fruit = fruitBowl.pop() + " ";
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

fs.open('config.txt', 'w', function(err, fd){
	writeFruit(fd);
});*/

//流式文件写入 fs.createWriteStream创建Writable对象，之后就可以用write写入了
//var fs = require("fs");
/*
var grains = ["wheat", "rice", "oats"];
var options = {encoding: "utf8", flag: "w"};
var fileWriteStream = fs.createWriteStream('config.txt', options);
fileWriteStream.on("close", function(){
	console.log("file closed");
});

while (grains.length) {
	var data = grains.pop() + " ";
	fileWriteStream.write(data);
	console.log("write: %s", data);
}
fileWriteStream.end();*/

//简单文件读取 readFile/readFileSync
//var fs = require("fs");
/*
var options = {encoding: 'utf8', flag: 'r'};
fs.readFile('config.txt', options, function(err, data){
	if (err) {
		console.log("failed to open config file");
	} else {
		console.log("config loaded");
		console.log(data);
	}
});*/

//同步读取文件 readSync
//var fs = require("fs");
/*
fd = fs.openSync("config.txt", 'r');
var grains = "";
do {
	var buf = new Buffer(5);
	buf.fill();
	var bytes = fs.readSync(fd, buf, null, 5);
	console.log("read %dbytes", bytes);
	grains += buf.toString();
}while (bytes > 0);
fs.closeSync(fd);
console.log("Grains: " + grains);*/

//异步读取文件 read
//var fs = require("fs");
/*
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
			console.log("Grains: %s", grains);
		}
	});
}

fs.open("config.txt", 'r', function(err, fd){
	readGrains(fd, "");
});*/

//流式文件读取 createReadStream
//var fs = require("fs");
/*
var options = {encoding: 'utf8', flag: 'r'};
var fileReadStream = fs.createReadStream("config.txt", options);
fileReadStream.on("data", function(chunk){
	console.log("Grains: %s", chunk);
	console.log("read %dbytes of data", chunk.length);
});
fileReadStream.on("close", function(){
	console.log("file closed");
});*/

/*
fs.exists("config.txd", function(exist){
	console.log(exist ? "Path exists" : "Path does not exists");
});*/

/*
fs.stat("config.txt", function(err, stats){
	if (err) {
		console.log("Path not exists!!!");
	} else {
		console.log("stats: " + JSON.stringify(stats, null, " "));
	}
});*/

//var fs = require("fs");
/*
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
WalkDirs(".");*/

/*
fs.unlink("new.txt", function(err){
	console.log(err ? "del failed" : "del");
});*/
/*
fs.truncate("log.txt", 0, function(err){
	console.log(err ? "truncate failed" : "truncated");
});*/

/*
fs.mkdir("./data", function(err){
	fs.mkdir("./data/folderA", function(err){
		console.log("complete");
	});
});*/

/*
fs.rmdir("./data/folderA", function(err){
	fs.rmdir("./data", function(err){
		console.log("recovered");
	});
});*/

/*
fs.rename("config.txt", "grains.txt", function(err){
	console.log(err ? "rename failed" : "file renamed");
});*/

fs.watchFile("grains.txt", {persistent: true, interval: 5000}, function(curr, prev){
	console.log("grains.txt modified at: " + curr.mtime);
	console.log("previous modification was: " + prev.mtime);
});