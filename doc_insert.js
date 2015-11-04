// JavaScript Document
/*
var MongoClient = require("mongodb").MongoClient;
function addObject(collection, object){
	collection.insert(object, function(err, result){
		if (!err) {
			console.log("Insert: ");
			console.log(result);
		}
	});
}

MongoClient.connect("mongodb://localhost/", function(err, db){
	var myDB = db.db("astro");
	myDB.dropCollection("nebulae");
	myDB.createCollection("nebulae", function(err, nebulae){
		addObject(nebulae, {ngc: "NGC 7293", name: "Helix",
			type: "planetary", location: "Aquila"});
		addObject(nebulae, {ngc: "NGC 6543", name: "Cat's Eye",
			type: "planetary", location: "Draco"});
		addObject(nebulae, {ngc: "NGC 1952", name: "Crab",
			type: "supernova", location: "Taurus"});
	});
	
	setTimeout(function(){db.close()}, 3000);
});*/

/*
var MongoClient = require("mongodb").MongoClient;
MongoClient.connect("mongodb://localhost/", function(err, db){
	var myDB = db.db("astro");
	myDB.collection("nebulae", function(err, nebulae){
		nebulae.find(function(err, items){
			items.toArray(function(err, itemArr){
				console.log("Document Array");
				console.log(itemArr);
			});
		});
		
		nebulae.find(function(err, items){
			items.each(function(err, sItem){
				if(sItem) {
					console.log("Singular Doc");
					console.log(sItem);
				}
			});
		});
		
		nebulae.findOne({type: 'planetary'}, function(err, oneItem){
			console.log("Found One");
			console.log(oneItem);
		});
	});
	setTimeout(function(){db.close();}, 3000);
});*/

/*
var MongoClient = require("mongodb").MongoClient;
MongoClient.connect("mongodb://localhost/", function(err, db){
	var myDB = db.db("astro");
	myDB.collection("nebulae", function(err, nebulae){
		nebulae.find({type: "planetary"}, function(err, items){
			items.toArray(function(err, itemArr){
				console.log("Before update: ");
				console.log(itemArr);
				
				nebulae.update({type: "planetary", $isolated: 1},
								{$set: {type: "Planetary", updated: true}},
								{upsert: false, multi: true, w: 1},
								function(err, results){
					nebulae.find({type: "Planetary"}, function(err, items){
						items.toArray(function(err, itemArr){
							console.log("After Update: ");
							console.log(itemArr);
							db.close();
						});
					});
				});
			});
		});
	});
});*/

/*
var MongoClient = require("mongodb").MongoClient;
MongoClient.connect("mongodb://localhost/", function(err, db){
	var myDB = db.db("astro");
	myDB.collection("nebulae", function(err, nebulae){
		nebulae.find({type: "supernova"}, function(err, items){
			items.toArray(function(err, itemArr){
				console.log("Before Modify: ");
				console.log(itemArr);
				
				nebulae.findAndModify({type: "supernova"}, [['name', 1]],
					{$set: {type: "Super Nova", updated: true}},
					{w:1, new: true}, function(err, doc){
						console.log("After Modify");
						console.log(doc);
						db.close();
					})
			});
		});
	});
});*/

/*
var MongoClient = require("mongodb").MongoClient;
MongoClient.connect("mongodb://localhost/", function(err, db){
	var myDB = db.db("astro");
	myDB.collection("nebulae", function(err, nebulae){
		nebulae.findOne({type: "Super Nova"}, function(err, oneItem){
			console.log("Before save ");
			console.log(oneItem);
			oneItem.info = "some new info, cuz error occurred just now";
			nebulae.save(oneItem, {w:1}, function(err, results){
				nebulae.findOne({_id: oneItem._id}, function(err, savedItem){
					console.log("After Save: ");
					console.log(savedItem);
					db.close();
				});
			});
		});
	});
});*/

/*
var MongoClient = require("mongodb").MongoClient;
MongoClient.connect("mongodb://localhost/", function(err, db){
	var myDB = db.db("astro");
	myDB.collection("nebulae", function(err, nebulae){
		nebulae.find({type: "diffuse"}, function(err, items){
			items.toArray(function(err, itemArr){
				console.log("Before upsert");
				console.log(itemArr);
				nebulae.update({type: "diffuse"},
					{$set: {ngc: "NGC 3372", name: "Carina",
							type: "diffuse", location: "Carina"}},
					{upsert: true, w: 1, forceServeObjectId: false},
					function(err, results){
						nebulae.find({type: "diffuse"}, function(err, items){
							items.toArray(function(err, itemArray){
								console.log("After upsert 1:");
								console.log(itemArray);
								var itemID = itemArray[0]._id;
								nebulae.update({_id: itemID},
									{$set: {ngc: "NGC 3372", name: "Carina",
											type: "Diffuse", location: "Carina"}},
									{upsert: true, w:1}, function(err, results){
										nebulae.findOne({_id: itemID}, function(err, oneItem){
											console.log("After upsert 2");
											console.log(oneItem);
											db.close();
										});
									}
								);
							});
						});
					}
				);
			});
		});
	});
});*/

/*
var MongoClient = require("mongodb").MongoClient;
MongoClient.connect("mongodb://localhost/", function(err, db){
	var myDB = db.db("astro");
	myDB.collection("nebulae", function(err, nebulae){
		nebulae.find(function(err, items){
			items.toArray(function(err, itemArr){
				console.log("Before Delete: ");
				console.log(itemArr);
				nebulae.remove({type: "Planetary"}, function(err, results){
					console.log("Deleted " + results + " documents");
					nebulae.find(function(err, items){
						items.toArray(function(err, itemArr){
							console.log("After Delete: ");
							console.log(itemArr);
							db.close();
						});
					});
				});
			});
		});
	});
});*/

var MongoClient = require("mongodb").MongoClient;
MongoClient.connect("mongodb://localhost/", function(err, db){
	var myDB = db.db("astro");
	myDB.collection("nebulae", function(err, nebulae){
		nebulae.find(function(err, items){
			items.toArray(function(err, itemArr){
				console.log("Before Delete: ");
				console.log(itemArr);
				nebulae.findAndRemove({type: "Diffuse"}, [['name', 1]],
									{w: 1}, function(err, results){
					console.log("Deleted:\n" + results);
					nebulae.find(function(err, items){
						items.toArray(function(err, itemArr){
							console.log("After Delete:");
							console.log(itemArr);
							db.close();
						});
					});
				});
			});
		});
	});
});