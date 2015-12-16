// JavaScript Document
//处理数据I/O
/*
 * 处理Json: 把javascript对象和字符串的形式相互转换
 * 掌握：将json转换成javascript对象 JSON.parse(string);
 * 		将javascript对象转换成JSON JSON.stringify()
 */

/*var accountStr = '{"name": "Jedi", "members": ["Yoda", "Obi Wan"]}';
var accountObj = JSON.parse(accountStr);
console.log(accountObj.name);
console.log(accountObj.members);
var accountToString = JSON.stringify(accountObj);
console.log(accountToString);*/

/*
 * 使用Buffer模块缓冲数据
 * js不擅长管理二进制数据，buffer模块允许在缓冲区结构中创建读取写入和操作二进制数据
 * Buffer模块是全局性的，不需要require
 * 1.创建缓冲区
 * 	 由于是原始的内存分配区，必须指定大小创建。
 * 	 三种方法: new Buffer(256) [size in Bytes]
 * 	 		  new Buffer([0x6f, 0x63, 0x74, 0x65, 0x74, 0x73])
 * 	 		  new Buffer("Some UTF8 Text \u00b3 \u30c6")
 * 2.写入缓冲区
 *   方法： buffer.write(string, [offset], [length], [encoding])
 *   	   buffer[offset] = value
 *   	   buffer.fill(value, [offset], [end])
 * 3.从缓冲区读取
 *   方法： buffer.toString([encoding], [start], [end])
 *         stringDecoder.write(buffer)  //返回缓冲区的解码字符串版本
 *         buffer[offset]  //返回缓冲区指定的offset字节的八进制值
 * 4.确定缓冲区的长度
 *   在确定缓冲区的长度时，可以使用buffer.length
 *   但在确定字节长度时，必须使用buffer.byteLength()
 * 5.复制缓冲区
 * 	 copy(targetBuffer, [targetStart], [sourceStart], [sourceIndex])
 * 	 也可以直接复制
 * 	 destinationBuffer[index] = sourceBuffer[index]
 */

//写入缓冲区
/*buf256 = new Buffer(256);
buf256.fill(0);
buf256.write("add some text");
console.log(buf256.toString());
buf256.write("more text", 9, 9);
console.log(buf256.toString());
buf256[18] = 43;
console.log(buf256.toString());*/

//从缓冲区读取
/*bufUTF8 = new Buffer("some UTF8 text \u00b6 \u30c6 \u20ac", 'utf8');
console.log(bufUTF8.toString());
console.log(bufUTF8.toString('utf8', 5, 9));
var stringDecoder = require("string_decoder").StringDecoder;
var decoder = new stringDecoder('utf8');
console.log(decoder.write(bufUTF8));  //返回缓冲区的字符串解码版本
console.log(bufUTF8[18].toString());
console.log(bufUTF8.readUInt32BE(18).toString(16));*/

//确定缓冲区长度
/*bufUTF8 = new Buffer("some UTF8 text \u00b6 \u30c6 \u20ac", 'utf8');
console.log(bufUTF8.length);
console.log("\u20ac".length);
console.log(Buffer.byteLength('\u00b6', 'utf8'));
console.log(Buffer.byteLength('\u30c6', 'utf8'));
console.log(Buffer.byteLength('\u0f00', 'utf8'));*/

//复制缓冲区
/*var alphabet = new Buffer('abcdefghijklmnopqrstuvwxyz');
console.log(alphabet.toString());
// copy full buffer
var blank = new Buffer(26);
blank.fill();
console.log(blank.toString());
alphabet.copy(blank);
console.log(blank.toString());

//copy part of buffer
var dashes = new Buffer(26);
dashes.fill('-');
console.log(dashes.toString());
alphabet.copy(dashes, 10, 10, 15);
console.log(dashes.toString());

//copy to and from direct index of buffer
var dots =  new Buffer('--------------------------');
dots.fill('.');
console.log(dots.toString());
dots[0] = alphabet[0];
console.log(dots.toString());*/

/*
 * 使用Stream模块传送数据
 * stream模块时nodejs的重要组成部分，数据流时是可读，可写或者两者都可以的内存结构
 * stream一般用于HTTP数据和文件
 * 作为读取流：可以打开一个文件
 * 			 从HTTP请求访问数据
 * 1.readable流：方便读取从其他来源进入应用程序的数据
 * 		在客户端的http响应/服务器端的http请求/fs读取流/zlib流/crypto流/TCP套接字/子进程的stdout stderr/process.stdin
 * 		方法: read() setEncoding()
 *           pause()/resume() 暂停或者恢复对象发出的data事件
 *			 pipe(dest)/unpipe() 将流的输出传输到指定的writable流对象
 *		事件：
 *			 readable: 当数据块可以从流中读取时发出
 *			 data: 类似于readable，但当data触发时，流变成流动模式，可以被处理程序连续调用
 *			 end：当数据将不再被提供时由流发出
 *			 close: 当底层资源关闭时发出
 *			 error：当接收数据中出现错误时发出
 */

/*var stream = require("stream"),
	util = require("util");
util.inherits(Answers, stream.Readable);  //首先继承readable流的功能
function Answers(opt){
	stream.Readable.call(this, opt);	//继承父类
	this.quotes = ["yes", "no", "maybe"];
	this._index = 0;
}

Answers.prototype._read = function() {
	if (this._index > this.quotes.length){
		this.push(null);
	} else {
		this.push(this.quotes[this._index]);
		this._index += 1;
	}
};

var r = new Answers();
console.log("Direct read: " + r.read().toString());
r.on("data", function(data){
	console.log("Callback read: " + data.toString());
});
r.on("end", function(data){
	console.log("No more answers");
});*/

/*
 * 2.Writable流
 * 		客户端的Http请求/服务器的http响应/fs写入流/zlib流/crypto流/TCP套接字/子进程的stdin/process.stdout process.stderr
 * 	    方法：write(chunk, [encoding], [callback])	将数据写入流对象的数据位置，指定callback，会在数据刷新后调用
 * 	         end,和write一样，只是会将对象设置成不再接收数据的状态，并发送finish事件
 * 	    事件：drain: write()返回false时，当准备好开始写更多数据的时候触发
 * 	         finish：当end()方法在writable对象上调用，所有数据被刷新且不会有新的数据时触发
 * 	         pipe: 当pipe方法在readable流上被调用，以添加此writbale流为目的地时
 * 	         unpipe: 当unpipe方法在readable流上被调用，以删除此writable流为目的地时
 */

/*var stream = require("stream"),
	util = require("util");
util.inherits(Writer, stream.Writable);
function Writer(opt) {
	stream.Writable.call(this, opt);
	this.data = new Array();
}

Writer.prototype._write = function(data, encoding, callback){
	this.data.push(data.toString('utf8'));
	console.log("Adding: " + data);
	callback();
};

var w = new Writer();
for (var i=1; i<=5; i++){
	w.write("Item" + i, 'utf8');
}
w.end("ItemLast");
console.log(w.data);*/

/*
 * 3.Duplex流
 * 结合可读写功能的流，如TCP套接字，可以在创建套接字后进行读取和写入
 * 支持的方法和事件由Readable和Writable流组成
 */

/*var stream = require("stream"),
	util = require("util");
util.inherits(Duplexer, stream.Duplex);

//构造函数
function Duplexer(opt){
	stream.Duplex.call(this, opt);
	this.data = [];
}

Duplexer.prototype._read = function readItem(size) {
	var chunk = this.data.shift();
	if (chunk == "stop") {
		this.push(null);
	} else {
		if (chunk) {
			this.push(chunk);
		} else {
			setTimeout(readItem.bind(this), 500, size);
		}
	}
};

Duplexer.prototype._write = function(data, encoding, callback) {
	this.data.push(data);
	callback();
};

var d = new Duplexer();
d.on("data", function(data) {
	console.log('read: ', data.toString());
});
d.on("end", function(){
	console.log("Message Complete");
});

d.write("I think, ");
d.write("therefore ");
d.write("I am.");
d.write("Rene Descartes");
d.write("stop");*/

/*
 * 4.Transform流
 * 	 transform流扩展流Duplex流，但可以修改writable和readable流之间的数据
 * 	 不需要实现_read _write [作为直通函数提供]，需要实现_transform接受来自write()请求的数据 _flush
 *   1.zlib流
 *   2.crypto流
 */

/*var stream = require("stream"),
	util = require("util");
util.inherits(JSONObjectStream, stream.Transform);

function JSONObjectStream(opt){
	stream.Transform.call(this, opt);
}

JSONObjectStream.prototype._transform = function(data, encoding, callback){
	object = data ? JSON.parse(data.toString()) : "";
	this.emit("object", object);
	object.handled = true;
	this.push(JSON.stringify(object));
	callback();
};

JSONObjectStream.prototype._flush = function(callback) {
	callback();
};

var tc = new JSONObjectStream();
tc.on("object", function(){
	console.log("Name: %s", object.name);
	console.log("Color: %s", object.color);
});

tc.on("data", function(data){
	console.log("Data: %s", data.toString());
});

tc.write('{"name": "neil", "color": "red"}');
tc.write('{"name": "nathan", "color": "green"}');
tc.write('{"name": "hans", "color": "blue"}');
tc.write('{"name": "jeil", "color": "yellow"}');*/

/*
 * 5.将readable流用管道输送到writable流
 *   通过pipe函数把Readable流连接到Writable流：将readbale流的输出直接输入到writable流中
 *   pipe(writableStream, [options])
 *   1.当end属性为true时，writable流会随着readable流的结束而结束
 *   2.也可以实现unpipe来打破管道
 */

/*var stream = require("stream"),
	util = require("util");
util.inherits(Reader, stream.Readable);
util.inherits(Writer, stream.Writable);

function Reader(opt){
	stream.Readable.call(this, opt);
	this._index = 1;
}
Reader.prototype._read = function(size){
	var i =  this._index++;
	if (i > 10) {
		this.push(null);
	} else {
		this.push("Item" + i.toString());
	}
};

function Writer(opt){
	stream.Writable.call(this, opt);
	this._index = 1;
}
Writer.prototype._write = function(data, encoding, callback){
	console.log(data.toString());
	callback();
};

var r = new Reader();
var w = new Writer();
r.pipe(w);*/

/*
 * 用Zlib压缩与解压数据
 * 压缩数据需要花费CPU周期，在压缩数据时必须考虑是否确实会带来好处
 * 支持的压缩方法：
 * 		gzip/gunzip
 * 		deflate/inflate
 * 		deflateRaw/inflateRaw
 */

//1.压缩/解压缓冲区
/*
 *  提供几个基本函数：
 *  基本格式 function(buffer, callback)
 */

/*
var zlib = require("zlib");
var input = "....................text....................";
zlib.deflate(input, function(err, buffer){
	if (!err) {
		console.log("deflate (%s):", buffer.length, buffer.toString("base64"));
		zlib.inflate(buffer, function(err, buffer){
			if (!err){
				console.log("inflate (%s):", buffer.length, buffer.toString());
			}
		});
		zlib.unzip(buffer, function(err, buffer){
			if (!err){
				console.log("unzip deflate(%s):", buffer.length, buffer.toString());
			}
		});
	}
});

zlib.deflateRaw(input, function(err, buffer){
	if (!err) {
		console.log("deflateRaw (%s):", buffer.length, buffer.toString("base64"));
		zlib.inflateRaw(buffer, function(err, buffer){
			if (!err){
				console.log("inflateRaw (%s):", buffer.length, buffer.toString());
			}
		});
	}
});

zlib.gzip(input, function(err, buffer){
	if (!err) {
		console.log("gzip (%s):", buffer.length, buffer.toString("base64"));
		zlib.gunzip(buffer, function(err, buffer){
			if (!err){
				console.log("gunzip (%s):", buffer.length, buffer.toString());
			}
		});
		zlib.unzip(buffer, function(err, buffer){
			if (!err){
				console.log("unzip (%s):", buffer.length, buffer.toString());
			}
		});
	}
});*/

//2.压缩/解压流
/*
 *  使用pipe()函数，通过压缩/解压缩对象来把数据从一个流输出到另外一个流
 *  这适用于将任何readable数据流压缩成writable流
 */
var zlib = require('zlib'),
	gzip = zlib.createGzip(),
	fs = require('fs'),
	inFile = fs.createReadStream("ch15.js"),
	outFile = fs.createWriteStream("ch15.gz");
inFile.pipe(gzip).pipe(outFile);
setTimeout(function(){
	var gunzip = zlib.createUnzip({flush: zlib.Z_FULL_FLUSH}),
		inFile = fs.createReadStream("ch15.gz"),
		outFile = fs.createWriteStream('ch15.txt');
	inFile.pipe(gunzip).pipe(outFile);
}, 3000);
