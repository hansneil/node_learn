// JavaScript Document

/*
 * 将工作添加到事件队列
 * 方式1：setTimeout setInterval setImmediate [实现定时器]
 * 方式2：process.nextTick(callback) [这个调度会在IO事件之前被执行，可能导致IO饥饿]
 * 方式3：事件发射器：events.EventEmitter();
 * 		 事件监听器：addListener, on, once
 * 		 管理监听器：listeners(eventName) 返回绑定在eventName事件上的监听函数
 * 		 		   setMaxListeners(n) 最多能够绑定的监听数
 * 		 		   removeListener(eventName, callback) 删除绑定的监听器
 */

/*var events = require('events');
function Account(){
	this.balance = 0;
	events.EventEmitter.call(this); //继承父类

	this.deposit = function(amount) {
		this.balance += amount;
		this.emit("balanceChanged");
	};

	this.withdraw = function(amount){
		this.balance -= amount;
		this.emit("balanceChanged");
	};
}
Account.prototype.__proto__ = events.EventEmitter.prototype; //继承父类原型
//Account.prototype = new events.EventEmitter();
//Account.prototype.constructor = Account;

function displayBalance(){
	console.log("Account balance: $%d", this.balance);
}

function checkOverdraw(){
	if (this.balance < 0){
		console.log("Account overdrawn!!!");
	}
}

function checkGoal(acc, goal){
	if (acc.balance > goal){
		console.log("Goal Achieved!!!");
	}
}

var account = new Account(); //调用构造函数创建新类Account()实例
account.on("balanceChanged", displayBalance); //绑定事件的监听器
account.on("balanceChanged", checkOverdraw); //绑定事件的监听器
account.on("balanceChanged", function(){
	checkGoal(this, 1000);
});

account.deposit(220);
account.deposit(320);
account.deposit(600);
account.withdraw(1200);*/

/*function simpleTimeout(consoleTimer){
	console.timeEnd(consoleTimer);
}
console.time("twoSecond");
setTimeout(simpleTimeout, 2000, "twoSecond");
console.time("oneSecond");
setTimeout(simpleTimeout, 1000, "oneSecond");
console.time("fiveSecond");
setTimeout(simpleTimeout, 5000, "fiveSecond");
console.time("50mSecond");
setTimeout(simpleTimeout, 50, "50mSecond");*/

/*var x=0, y=0, z=0;
function displayValue() {
	console.log("x=%d; y=%d; z=%d", x,y,z);
}

function updateX() {
	x += 1;
}

function updateY() {
	y += 1;
}

function updateZ() {
	z += 1;
	displayValue();
}

setInterval(updateX, 500);
setInterval(updateY, 1000);
setInterval(updateZ, 2000);*/

/*var fs = require("fs");
fs.stat("ch4.js", function(err, stats){
	console.log("ch4.js Exists");
});

setImmediate(function(){
	console.log("Immediate Timer1");
});

setImmediate(function(){
	console.log("Immediate Timer2");
});

setTimeout(function(){
	console.log("timeout exe");
}, 2000);

process.nextTick(function(){
	console.log("next tick1");
});

process.nextTick(function(){
	console.log("next tick2");
});*/


//var events = require("events"),
//	util = require("util");

//util.inherits(Account, events.EventEmitter);
//function Account() {
//	this.balance = 0;
//	events.EventEmitter.call(this);
//	this.deposit = function(amount){
//		this.balance += amount;
//		this.emit("balanceChanged")
//	};
//	this.withdraw = function(amount){
//		this.balance -= amount;
//		this.emit("balanceChanged")
//	}
//}

//Account.prototype.__proto__ = events.EventEmitter.prototype;
//Account.prototype = new events.EventEmitter();
//
//function displayBalance() {
//	console.log("Account balance $%d", this.balance);
//}
//
//function checkOverdraw() {
//	if (this.balance < 0){
//		console.log("Account overdraw!!!");
//	}
//}
//
//function checkGoal(acc, goal){
//	if (acc.balance > goal) {
//		console.log("Goal Achived!!!");
//	}
//}
//
//var account = new Account();
//account.on("balanceChanged", displayBalance);
//account.on("balanceChanged", checkOverdraw);
//account.on("balanceChanged", function(){
//	checkGoal(this, 1000);
//});
//
//account.deposit(220);
//account.deposit(320);
//account.deposit(600);
//account.withdraw(1200);

/*
 * 实现回调
 * 三种具体实现：1.将参数传递给回调函数
 * 			   2.在循环内处理回调函数
 * 			   3.嵌套回调
 * 1.将参数传递给回调函数：使用匿名函数实现该参数，用来自匿名函数的参数调用回调函数
 */

/*var events = require("events");
//创建新类CarShow
function CarShow(){
	events.EventEmitter.call(this);  //继承父类
	this.seeCar = function(make){
		this.emit("sawCar", make);	//通过匿名函数向emit传递参数
	};
}
CarShow.prototype.__proto__ = events.EventEmitter.prototype;  //继承原型

var show = new CarShow();

function logCar(make){
	console.log("Saw a " + make);
}

function logColorCar(make, color){
	console.log("Saw a %s %s", color, make);
}

show.on("sawCar", logCar);
show.on("sawCar", function(make){
	var colors = ["red", "blue", "black"];
	var color = colors[Math.floor(Math.random()*3)];
	logColorCar(make, color);
});

show.seeCar("Ferrari");
show.seeCar("Porsche");
show.seeCar("Bugatti");
show.seeCar("Lamboghini");
show.seeCar("Aston Martin");*/

/*
 * 实现回调
 * 三种具体实现：1.将参数传递给回调函数
 * 			   2.在循环内处理回调函数
 * 			   3.嵌套回调
 * 2.如果某个回调函数需要访问父函数的作用域的变量，就需要提供闭包
 *   使得这些值在回调函数从事件队列中被提取时可以得到
 */

/*function logCar(logMsg, callback){
	process.nextTick(function(){
		callback(logMsg);
	});
}

var cars = ["Ferrari", "Porsche", "Bugatti"];
for (var idx in cars){
	var message = "Saw a " + cars[idx];
	logCar(message, function(){
		console.log("Normal Callback: " + message);
	});
}
for (var idx in cars){
	var message = "Saw a " + cars[idx];
	(function(msg){
		logCar(msg, function(){
			console.log("Closure Callback: " + msg);
		});
	})(message);	//创建匿名函数传入参数，强制让闭包符合预期
}*/

/*
 * 实现回调
 * 三种具体实现：1.将参数传递给回调函数
 * 			   2.在循环内处理回调函数
 * 			   3.嵌套回调
 * 3.使用异步函数时，两个函数都在事件队列上，则无法保证运行顺序，
 *   最佳方法：让来自异步函数的回调再次调用该函数
 */

function logCar(car, callback){
	console.log("Saw a %s", car);
	if (cars.length){
		process.nextTick(function(){
			callback();
		});
	}
}

function logCars(cars){
	var car = cars.pop();
	logCar(car, function(){
		logCars(cars);
	});
}

var cars = ["Ferrari", "Porsche", "Bugatti", "Lamborghini", "Aston Martin"];
logCars(cars);
/*
var accountStr = '{"name": "Jedi", "number": 34162}';
var accountObj = JSON.parse(accountStr);
console.log(accountObj.name);
console.log(accountObj.number);

var account = JSON.stringify(accountObj);
console.log(account);*/