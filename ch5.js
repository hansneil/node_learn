// JavaScript Document
/*
buf256 = new Buffer(256);
buf256.fill(0);
buf256.write("add some text");
console.log(buf256.toString());
buf256.write("more text", 9, 9);
console.log(buf256.toString());
buf256[18] = 43;
console.log(buf256.toString());*/
/*
bufUTF8 = new Buffer("some UTF8 text \u00b6 \u30c6 \u20ac", 'utf8');
console.log(bufUTF8.toString());
console.log(bufUTF8.toString('utf8', 5, 9));
var stringDecoder = require("string_decoder").StringDecoder;
var decoder = new stringDecoder('utf8');
console.log(decoder.write(bufUTF8));
console.log(bufUTF8[18].toString(16));
console.log(bufUTF8.readUInt32BE(18).toString(16));
console.log(bufUTF8.length);
console.log(Buffer.byteLength('\u00b6', 'utf8'));
console.log(Buffer.byteLength('\u30c6', 'utf8'));
console.log(Buffer.byteLength('\u20ac', 'utf8'));
*/
/*
var alphabet = new Buffer('abcdefghijklmnopqrstuvwxyz');
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
var stream = require("stream"),
	util = require("util");
util.inherits(Answers, stream.Readable);
function Answers(opt){
	stream.Readable.call(this, opt);
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
var stream = require("stream"),
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
console.log(w.data);
*/
/*
var stream = require("stream"),
	util = require("util");
util.inherits(Duplexer, stream.Duplex);

function Duplexer(opt){
	stream.Duplex.call(this, opt);
	this.data = [];
}

Duplexer.prototype._read = function readItem(size){
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

Duplexer.prototype._write = function(data, encoding, callback){
	this.data.push(data);
	callback();
};

var d = new Duplexer();
d.on("data", function(chunk){
	console.log("read: "　+ chunk.toString());
});
d.on("end", function(){
	console.log("Msg Complete");
});

d.write("I think, ");
d.write("therefore ");
d.write("I am");
d.write("Rene Des");
d.write("stop");*/
/*
var stream = require("stream"),
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

JSONObjectStream.prototype._flush = function(cb) {
	cb();
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
var stream = require("stream"),
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
	console.log(console.log(data.toString()));
	callback();
};

var r = new Reader();
var w = new Writer();
r.pipe(w);*/
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