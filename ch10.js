// JavaScript Document

//1.os模块： 实现应用程序时可能有用的操作系统方面的信息
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
/*
 * 2.util模块：功能较杂，主要提供实用函数来格式化字符串
 *                       将对象转换为字符串
 *                       检查对象的类型
 *                       执行对输出流的同步写入
 *                       对一些对象继承的增强[已经接触,inherits]
 */
/*
 * 2.1 格式化字符串:[快速格式化]
 *     util.format(format, [...])
 *     第一个格式化占位符表示第二个参数
 *     支持的占位符：%s %d %j [JSON对象]
 *     如果第一个参数不是格式化字符串，则将每个参数转换成字符串，用空格隔开
 */

/*var util = require('util');
console.log(util.format("%s = %s != %s", 'item', 'item2', 'item3'));*/

/*
 * 2.2 检查对象类型
 *     提供isArray(obj) isRegExp(obj) isDate(obj) isError(obj)
 */

/*console.log(util.isArray([1,2,3]));*/

/*
 * 2.3 同步写入输出流
 *     同步写数据到stdout和stderr的能力，意味着进程保持阻塞，直到数据被写出来
 *     好处：确保当数据被写入时，系统没有改变其他行为
 */

/*
 * 2.4 将javascript对象转换为字符串
 *     尤其是调试的时候，util.inspect允许将一个对象转化为字符串
 *     util.inspect(object, [options])
 *     options属性：showHidden | depth[限制检查过程的遍历深度] | colors | customInspect
 */

/*var obj = {first: 'brad', last: 'dayley'};
obj.inspect = function(depth) {
	return '{name: "' + this.first +" " + this.last + '"}';
};
console.log(util.inspect(obj, {customInspect: false}));
console.log(util.inspect(obj));*/

/*
 * 2.5 从其他对象继承功能
 *     util.inherits()允许创建一个继承另一个对象prototype方法的对象
 *     util.inherits(constructor, superConstructor)
 */
var events = require("events");
function Writer() {
	events.EventEmitter.call(this);
}
util.inherits(Writer, events.EventEmitter);
Writer.prototype.write = function(data) {
	this.emit("data", data);
};

var w = new Writer();
w.on('data', function(data){
	console.log("Received data: '" + data + "'");
});
w.write("Some Data");
