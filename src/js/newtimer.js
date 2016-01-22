
var newTimer = function() {

	//priate Variables
	var minutes = document.getElementById("minutes"),
		seconds = document.getElementById("seconds"),
		slow = document.getElementById("slow"),
		slowtext = document.getElementById("slowtext"),
		timerInterval, 
		minutesLeft = "00",
		secondsLeft = "00",
		slowed = false,
		running = false,
		countup = false,
		totalSeconds = 0;

	//private functions

	//takes a number and maes it at laest 2 digits and a string
	var cleanUpNumber = function(number){
		if(typeof number === "number" || typeof number === "string"){
			if(typeof number === "number"){number = number.toString();}
			if(number.length < 2){
				number = "0" + number;
			} else{
				number = number.toString();
			}
		}
		else{
			console.log("ERROR: Type ("+ typeof number +") not supported");
		}
		return number;
	},
	changeInterval = function(new_interval){
		clearInterval(timerInterval)
		timerInterval = setInterval(updateTimer, new_interval)
	},

	//SetUp the timer
	setUpTimer = function(){
		//Variables
		var minutesValue = cleanUpNumber(minutes.value),
			secondsValue = cleanUpNumber(seconds.value),
			countupbox = document.getElementById("slideOne"),
			startTime = minutesValue + ":" + secondsValue;

		console.log("Started: " + startTime);
		//change objects variables
		minutesLeft = parseInt(minutesValue);
		secondsLeft = parseInt(secondsValue);
		running = true;
		if(countupbox.checked === true){
			countup = true;
		} else{
			countup = false;
		}
		//start the timer
		timerInterval = setInterval(updateTimer, 1000);
	},

	updateTimer = function(){
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
				if(secondsLeft > 0){
					secondsLeft -= 1;
				} else if(secondsLeft === 0){
					//remove a minute and kick up seconds
					secondsLeft = 59;
					minutesLeft -= 1;
				}
			} else {//counting up
				if(secondsLeft < 60){
					secondsLeft += 1;
				} else if(secondsLeft === 60){
					//reset seconds and add a minute
					secondsLeft = 0;
					minutesLeft += 1;
				}
			}
			//display the new time
			minutes.value = cleanUpNumber(minutesLeft);
			seconds.value = cleanUpNumber(secondsLeft);

			totalSeconds += 1;
		}
	},
	startTimer = function(){
		if(!running){
			console.log('Start');
			setUpTimer();
			//added 1/20/16
			slow.onclick = slowTimer;//Make The slow function turn on
			slowtext.innerHTML = 'Slow';
		}
	},
	slowTimer = function(){
		if(running){
			if(slowed){
				changeInterval(1000);
				slowed = false;
				slowtext.innerHTML = 'Slow';
			} else{
				changeInterval(2000);
				slowed = true;
				slowtext.innerHTML = 'Fast';
			}
		}
	},
	stopTimer = function(){
		if(running){
			console.log('Stop');
			endTimer("stop");
			running = false;
			//added 1/20/16
			slow.onclick = resetTimer;
			slowtext.innerHTML = "reset";
		}
	},
	resetTimer = function() {
	 	minutes.value = "16";
	 	seconds.value = "00";
	 	console.log("Reset Timer");
	};

	function endTimer(type){
		clearInterval(timerInterval);
		if(type === "timerEnd"){
			var audio = new Audio('audio/Noises2.mp3');
			audio.play();
		}else{
			var audio = new Audio('audio/Tone.mp3');
			audio.play();
		}
		console.log("End Type: " + type);
	};

	return {//public settings
		start: function(){
			startTimer();
		},
		slow: function(){
			slowTimer();
		},
		stop: function(){
			stopTimer();
		},
		reset: function(){
			resetTimer();
		},
		getTotal: function(){
			return totalSeconds;
		},
		getInterval: function(){
			return timerInterval;
		},
		cleanUpNumber: function(number){
			return cleanUpNumber(number)
		}
	};
}();

window.onbeforeunload = function(){
   newLog.logTotalTime(newTimer.getTotal());
}