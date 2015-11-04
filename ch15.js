// JavaScript Document
/*
var MongoClient = require("mongodb").MongoClient;
MongoClient.connect("mongodb://localhost", function(err, db){
	var myDB = db.db("words");
	myDB.collection("word_stats", findItems);
	setTimeout(function(){
		db.close();
	}, 3000);
});

function displayWords(msg, cursor, pretty){
	cursor.toArray(function(err, itemArr){
		console.log("\n" + msg);
		var wordList = [];
		for (var i = 0; i < itemArr.length; i++){
			wordList.push(itemArr[i].word);
		}
		console.log(JSON.stringify(wordList, null, pretty));
	});
}

function findItems(err, words){
	//以a,b或c开头的单词
	words.find({first: {$in: ['a', 'b', 'c']}}, function(err, cursor){
		displayWords("Words starting with a,b or c:", cursor);
	});
	
	//查找长度大于12的单词
	words.find({size: {$gt: 12}}, function(err, cursor){
		displayWords("Words longer than 12 characters", cursor);
	});
	
	//查找单词字母个数为偶数个的单词
	words.find({size: {$mod: [2, 0]}}, function(err, cursor){
		displayWords("Words with even length:", cursor);
	});
	
	//查找字母个数刚好为12的单词
	words.find({letters: {$size: 12}}, function(err, cursor){
		displayWords("Words with 12 Distinct characters ", cursor);
	});
	
	//以元音字母开头结尾的单词
	words.find({$and: [{first: {$in: ['a', 'e', 'i', 'o', 'u']}},
						{last: {$in: ['a', 'e', 'i', 'o', 'u']}}]},
				function(err, cursor){
		displayWords("Words start and end with a vowel:", cursor);
	});
	
	//查找元音字母超过6个的单词
	words.find({"stats.vowels": {$gt: 6}}, function(err, cursor){
		displayWords("words containning 7 or more vowels", cursor);
	});
	
	//查找包含所有元音字母的单词
	words.find({letters: {$all: ['a', 'e', 'i', 'o', 'u']}}, function(err, cursor){
		displayWords("words with all 5 vowels", cursor);
	});
	
	//查找包含非字母字符的单词
	words.find({otherchars: {$exists: true}}, function(err, cursor){
		displayWords("words with non-alphabet characters: ", cursor);
	});
	
	//
	words.find({charsets: {$elemMatch: {$and: [{type: 'other'},
										{chars: {$size: 2}}]}}},
							function(err, cursor){
		displayWords("Words with 2 non-alphabet characters: ", cursor);
	});
}*/

var MongoClient = require("mongodb").MongoClient;
MongoClient.connect("mongodb://localhost", function(err, db){
	var myDB = db.db("words");
	myDB.collection("word_stats", countItems);
	setTimeout(function(){
		db.close();
	}, 3000);
});

function countItems(err, words){
	//以a,b或c开头的单词
	words.count({first: {$in: ['a', 'b', 'c']}}, function(err, cursor){
		console.log("Words starting with a,b or c " + cursor);
	});
	
	//查找长度大于12的单词
	words.count({size: {$gt: 12}}, function(err, cursor){
		console.log("Words longer than 12 characters " + cursor);
	});
	
	//查找单词字母个数为偶数个的单词
	words.count({size: {$mod: [2, 0]}}, function(err, cursor){
		console.log("Words with even length " + cursor);
	});
	
	//查找字母个数刚好为12的单词
	words.count({letters: {$size: 12}}, function(err, cursor){
		console.log("Words with 12 Distinct characters " + cursor);
	});
	
	//以元音字母开头结尾的单词
	words.count({$and: [{first: {$in: ['a', 'e', 'i', 'o', 'u']}},
						{last: {$in: ['a', 'e', 'i', 'o', 'u']}}]},
				function(err, cursor){
		console.log("Words start and end with a vowel " + cursor);
	});
	
	//查找元音字母超过6个的单词
	words.count({"stats.vowels": {$gt: 6}}, function(err, cursor){
		console.log("words containning 7 or more vowels " + cursor);
	});
	
	//查找包含所有元音字母的单词
	words.count({letters: {$all: ['a', 'e', 'i', 'o', 'u']}}, function(err, cursor){
		console.log("words with all 5 vowels " + cursor);
	});
	
	//查找包含非字母字符的单词
	words.count({otherchars: {$exists: true}}, function(err, cursor){
		console.log("words with non-alphabet characters: " + cursor);
	});
	
	//
	words.count({charsets: {$elemMatch: {$and: [{type: 'other'},
										{chars: {$size: 2}}]}}},
							function(err, cursor){
		console.log("Words with 2 non-alphabet characters: " + cursor);
	});
}