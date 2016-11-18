/***********
Creator: Mendel Hornbacher
Date: November 12, 2015

Dependencys: log.js
Global Variables: minutes, seconds, timerInterval, minutesLeft, secondsLeft, slowed, running, countup, startTime, totalSeconds.
Global Functions: stUpTimer(), updateTimer(), startTimer(), slowTimer(), stopTimer(), cleanUpNumber(number), endTimer(type).
***********/

var minutes = document.getElementById("minutes"),	//get the elements from the screen
	seconds = document.getElementById("seconds"),
	timerInterval, 			//the Timer as a repeating event
	minutesLeft = "00", 	//the time left to display - minutes
	secondsLeft = "00", 	//the time left to display - seconds
	slowed = false,			//is the timer slowed?
	running = false,		//is the timer running
	countup = false,		//is the timer counting up or down
	startTime, 				//stores the time it started.
	totalSeconds = 0;			//The total seconds the timer has run.

function setUpTimer(){
	//get the values
	var minutesValue = minutes.value,
		secondsValue = seconds.value,
		countupbox = document.getElementById("slideOne");
	//clean them up
	minutesValue = cleanUpNumber(minutesValue);
	secondsValue = cleanUpNumber(secondsValue);
	//set that as the start time
	startTime = minutesValue + ":" + secondsValue;
	console.log("Started: " + startTime);
	//set up the remaining time on the display
	minutesLeft = parseInt(minutesValue);
	secondsLeft = parseInt(secondsValue);
	running = true;
	if(countupbox.checked === true){
		countup = true;
	} else{
		countup = false;
	}
};

function updateTimer(){//this updates the timer
	if(running === true){
		console.log("Update");
		//if the time rmaining is 0 or less.
		if(minutesLeft <= 0 && secondsLeft <= 0){
			endTimer("timerEnd");
			//set the text to 00:00 just in case t is negitive
			minutes.value = cleanUpNumber(0);
			seconds.value = cleanUpNumber(0);
			return;
		}
		if(countup === false){//countdown
			//if there are seconds remaining - remove one
			if(secondsLeft > 0){
				secondsLeft -= 1;
			} else if(secondsLeft === 0){//if seconds is zero, remove a minute and set the seconds to 59.
				secondsLeft = 59;
				minutesLeft -= 1;
			}
		} else { //if we are counting up:
			if(secondsLeft < 60){	//if the seconds is less then 60:
				secondsLeft += 1;	//add a second
			} else if(secondsLeft === 60){	//if seconds is 60:
				secondsLeft = 0;	//set the seconds to 0
				minutesLeft += 1;	//add a minute
			}
		}
		//display the new time
		minutes.value = cleanUpNumber(minutesLeft);
		seconds.value = cleanUpNumber(secondsLeft);

		totalSeconds += 1;
	}
};

function startTimer(){
	if(!running){
		console.log('Start');
		//set up the timer
		setUpTimer();
		//make update timer run every 1000 seconds
		timerInterval = setInterval(updateTimer, 1000);
	}
};

function slowTimer(){
	if(running === true){
		console.log('Slow');
		//if we are currently running in slow mode:
		if(slowed === true){
			//erase the existing timer (but not the time remaining. That is held untill timer is reset)
			clearInterval(timerInterval);
			//Make a new timer at full speed.
			timerInterval = setInterval(updateTimer, 1000);
			//set slowmode to false
			slowed = false;
			return;//hay, it works.
		} else{//slow is false: do the opposite of above.
			clearInterval(timerInterval);
			timerInterval = setInterval(updateTimer, 2000);
			slowed = true;
			return;//hay, it works.
		}
	}
	
};

function stopTimer(){
	if(running === true){
		console.log('Stop');
		endTimer("stop");
		running = false;
	}
};

function cleanUpNumber(number){  // takes a number and makes it into at least "xx"
	if(typeof number === "boolean"){
		console.log('ERROR: Boolean not supported');
		return;
	}
	if(typeof number === "number"){
		number = number.toString();
	}
	if(number.length < 2){
		return "0" + number
	} else{
		return number;
	}
}

function endTimer(type){//put code here for when the timer ends.
	clearInterval(timerInterval);//get rid of the timer
	//play sound if correct type given.
	if(type === "timerEnd"){
		var audio = new Audio('audio/Noises2.mp3');
		audio.play();
	}else{
		var audio = new Audio('audio/Tone.mp3');
		audio.play();
	}
	console.log("Timer end: " + type);//log the ending
};

window.onbeforeunload = function(){
   logTotalTime(totalSeconds);
}