// JavaScript Document
/*
var MongoClient = require('mongodb').MongoClient,
	Server = require('mongodb').Server;
//MongoClient(server options)
var client = new MongoClient(new Server('localhost', 27017, {
						socketOptions: {connectTimeoutMS: 500},
						poolSize: 5,
						auto_reconnect: true}), {
							numberOfRetries: 3,
							retryMiliSeconds: 500});

//调用open方法打开mongodb数据库到服务器的连接，如果连接失败，第一个参数表示错误，成功，第二个参数表示MongoClient对象
client.open(function(err, client){
	if (err) {
		console.log("connection failed via client object");
	} else {
		var db = client.db("testDB"); //创建需要连接的数据库的名称
		//如果使用了身份验证，还需要验证
		db.authenticate("dbadmin", "test", function(err, results){
			if (err) {
				console.log("Authentication failed");
				client.close();
				console.log("Connection closed ......");
			} else {
				console.log("Authnticated via Client object");
				//可以调用db.logout)_注销数据库，将关闭和数据库的连接
				db.logout(function(err, result){
					if (!err) {
						console.log("Logged out via Client object");
					}
					//关闭到MongoDB的连接
					client.close();
					console.log("Connection closed");
				});
			}
		});
	}
});*/

/*
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var url = 'mongodb://dbadmin:test@localhost:27017/admin';
MongoClient.connect(url, function(err, db) {
	//列出数据库
	/*
	var adminDB = db.admin();
	adminDB.listDatabases(function(err, database){
		console.log("before add database list");
		console.log(database);
		db.close();
	});*/
	//创建数据库
	/*
	var newDB = db.db("newDB");
	newDB.createCollection("newCollection", function(err, collection){
		if (!err) {
			console.log("new database and collection created");
		}
	});*/
	//获取mongoDB服务器的状态
	/*
	var adminDB = db.admin();
	adminDB.serverStatus(function(err, status){
		console.log(status);
		db.close();
	});
});*/

//访问和操作集合
var MongoClient = require("mongodb").MongoClient;
var url = 'mongodb://dbadmin:test@localhost:27017/admin';
MongoClient.connect(url, function(err, db){
	if (err) {
		console.log("failed")
	} else {
		//列出集合
		/*
		var newDB = db.db("newDB");
		newDB.collections(function(err, collectionList){
			console.log(collectionList[1]);
			db.close();
		});*/
		//创建集合
		/*
		var newDB = db.db("newDB");
		newDB.createCollection("myCollection", function(err, collection){
			if (!err) {
				console.log("success");
				db.close();
			}
		});*/
		//删除集合
		var myDB = db.db("newDB");
		myDB.dropCollection("myCollection", function(err, results){
			console.log("success");
			db.close();
		});
	}
});
