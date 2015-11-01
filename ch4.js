// JavaScript Document
/*
function simpleTimeout(consoleTimer){
	console.timeEnd(consoleTimer);
}
console.time("twoSecond");
setTimeout(simpleTimeout, 2000, "twoSecond");
console.time("oneSecond");
setTimeout(simpleTimeout, 1000, "oneSecond");
console.time("fiveSecond");
setTimeout(simpleTimeout, 5000, "fiveSecond");
console.time("50mSecond");
setTimeout(simpleTimeout, 50, "50mSecond");
*/
/*
var x=0, y=0, z=0;
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

/*
var fs = require("fs");
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


var events = require("events"),
	util = require("util");

//util.inherits(Account, events.EventEmitter);
function Account() {
	this.balance = 0;
	events.EventEmitter.call(this);
	this.deposit = function(amount){
		this.balance += amount;
		this.emit("balanceChanged")
	};
	this.withdraw = function(amount){
		this.balance -= amount;
		this.emit("balanceChanged")
	}
}

//Account.prototype.__proto__ = events.EventEmitter.prototype;
Account.prototype = new events.EventEmitter();

function displayBalance() {
	console.log("Account balance $%d", this.balance);
}

function checkOverdraw() {
	if (this.balance < 0){
		console.log("Account overdraw!!!");
	}
}

function checkGoal(acc, goal){
	if (acc.balance > goal) {
		console.log("Goal Achived!!!");
	}
}

var account = new Account();
account.on("balanceChanged", displayBalance);
account.on("balanceChanged", checkOverdraw);
account.on("balanceChanged", function(){
	checkGoal(this, 1000);
});

account.deposit(220);
account.deposit(320);
account.deposit(600);
account.withdraw(1200);

/*
var events = require("events");
function CarShow(){
	events.EventEmitter.call(this);
	this.seeCar = function(make){
		this.emit("sawCar", make);
	};
}
CarShow.prototype.__proto__ = events.EventEmitter.prototype;

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
function logCar(logMsg, callback){
	process.nextTick(function(){
		callback(logMsg);
	});
}

var cars = ["Ferrari", "Porsche", "Bugatti"];
for (var idx in cars){
	var message = "Saw a " + cars[idx];
	(function(msg){
		logCar(msg, function(){
			console.log("Closure Callback: " + msg);
		});
	})(message);
}*/
/*
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
logCars(cars);*/
/*
var accountStr = '{"name": "Jedi", "number": 34162}';
var accountObj = JSON.parse(accountStr);
console.log(accountObj.name);
console.log(accountObj.number);

var account = JSON.stringify(accountObj);
console.log(account);*/