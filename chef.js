// JavaScript Document
process.on('message', function(message, parent){
	var meal = {};
	switch(message.cmd){
		case 'makeBreakfast':
			meal = ['Breakfast: ', "hams", "eggs", "toast"];
			break;
		case 'makeLunch':
			meal = ['Lunch: ', "burgers", "fries", "shake"];
			break;
		case 'makeDinner':
			meal = ['Dinner: ', "soup", "salad", "steak"];
			break;
	}
	
	process.send(meal);
});