// JavaScript Document
process.on('message', function(message, parent){
	var meal = {};
	switch(message.cmd){
		case 'makeBreakfast':
			meal = ["hams", "eggs", "toast"];
			break;
		case 'makeLunch':
			meal = ["burgers", "fries", "shake"];
			break;
		case 'makeDinner':
			meal = ["soup", "salad", "steak"];
			break;
	}
	
	process.send(meal);
});