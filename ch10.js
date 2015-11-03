// JavaScript Document

//os模块
/*
var os = require("os");
console.log(os.tmpdir());
console.log(os.endianness());
console.log(os.hostname());
console.log(os.type());
console.log(os.platform());
console.log(os.arch());
console.log(os.release());
console.log(os.uptime());
console.log(os.loadavg());
console.log(os.totalmem());
console.log(os.freemem());
console.log(os.cpus());
*/

var util = require('util');
//util模块
//格式化字符串
/*
var util = require('util');
console.log(util.format("%s = %s", 'item', 'item2', 'item3'));*/

//检查对象类型
/*
console.log(util.isArray([1,2,3]));*/
var obj = {first: 'brad', last: 'dayley'};
obj.inspect = function(depth) {
	return '{name: "' + this.first +" " + this.last + '"}';
};
console.log(util.inspect(obj));
