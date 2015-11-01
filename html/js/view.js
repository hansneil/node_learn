// JavaScript Document
window.onload = function(){
	
	var my_nav = document.getElementById("my_nav");
	
	my_nav.onmouseover = function(event){
		var sub_menu = event.target.childNodes[1];
		sub_menu.style.display = "block";
	};
	
	my_nav.onmouseleave = function(event){
		var sub_menu = event.target.childNodes[1];
		
		handle = setTimeout(function(){
			sub_menu.style.display = "none";
			}, 1000);
		
	};

	var mySubMenu = document.getElementById("my_nav").childNodes[1];
	
	mySubMenu.onmouseover = function(event){
		var sub_menu = event.target;
		clearTimeout(handle);
		sub_menu.style.display = "block";
	};
	
	mySubMenu.onmouseleave = function(event){
		var sub_menu = event.target;
		setTimeout(function(){
			sub_menu.style.display = "none";
			}, 1000);
	};
	
	/****************************************/
	/*			login&register              */
	/****************************************/
	var login = document.getElementById("login");
	login.onclick = function() {
		var loginDiv = document.getElementById("login-div");
		loginDiv.style.display = "block";
		
		var mask = document.getElementById("mask");
		mask.classList.toggle("mask");
	};
	
	var register = document.getElementById("register");
	register.onclick = function() {
		var regDiv = document.getElementById("register-div");
		regDiv.style.display = "block";
		
		var mask = document.getElementById("mask");
		mask.classList.toggle("mask");
	};
	
	var loginClose = document.getElementById("login-div").childNodes[1];
	loginClose.onclick = function(event){
		var div = event.target.parentNode;
		div.style.display = "none";
		
		var mask = document.getElementById("mask");
		mask.classList.remove("mask");
	};
	
	var regClose = document.getElementById("register-div").childNodes[1];
	regClose.onclick = function(event){
		var div = event.target.parentNode;
		div.style.display = "none";
		
		var mask = document.getElementById("mask");
		mask.classList.remove("mask");
	};
	
	var loginBtn = document.getElementById("login-btn");
	loginBtn.onmousedown = function(event) {
		var btn = event.target;
		btn.style.backgroundColor = "#ca383f";
	};
	
	loginBtn.onmouseup = function(event) {
		var btn = event.target;
		btn.style.backgroundColor = "#df3d45";
	}
	
	/****************************************/
	/*		switch login&register           */
	/****************************************/
	var interSwitch = document.getElementById("switch");
	interSwitch.onclick = function() {
		var loginDiv = document.getElementById("login-div");
		var regDiv = document.getElementById("register-div");
		loginDiv.className += " switch";
		
		setTimeout(function(){
			regDiv.className += " switch-on";
			loginDiv.style.display = "none";
			loginDiv.className = "login-div";
		}, 1000);
		
		setTimeout(function(){
			regDiv.style.display = "block";
		}, 1001);
		
		setTimeout(function(){
			regDiv.className = "register-div";
		}, 2000);
	}
	
	var interSwitchOn = document.getElementById("switch-on");
	interSwitchOn.onclick = function() {
		var loginDiv = document.getElementById("login-div");
		var regDiv = document.getElementById("register-div");
		regDiv.className += " switch-onback";
		
		setTimeout(function(){
			loginDiv.className += " switch-back";
			regDiv.style.display = "none";
			regDiv.className = "register-div";
		}, 1000);
		
		setTimeout(function(){
			loginDiv.style.display = "block";
		},1001);
		
		setTimeout(function(){
			loginDiv.className = "login-div";
		}, 2000);
	}
	
	//
	var beforeScrollTop = document.body.scrollTop;
	window.addEventListener("scroll", function(){
		afterScrollTop = document.body.scrollTop;
		if (afterScrollTop - beforeScrollTop >= 276){
			var wrapper = document.getElementById("wrapper");
			wrapper.classList.add("fixed");
		} else if (afterScrollTop - beforeScrollTop < 200) {
			var wrapper = document.getElementById("wrapper");
			wrapper.classList.remove("fixed");
		}
	}, false);
}