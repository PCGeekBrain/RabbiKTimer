/*
the basic timer objects.
*/

var simpleTimer = function(name, pointer){
    return function (){ //Allows simpleTimer("name") to still work with private Variables
        var id = name,  //The id for the timer
        timerInterval,  //Variable to store the actual countdown interval object
        running = false,
        countup = false,
        minutesLeft = 16,
        secondsLeft = 00,
        totalSeconds = 0;
        //code
        if (id === "master") {
            masterMinutes = document.getElementById("minutes"),
            masterSeconds = document.getElementById("seconds");
        }

        //private functions
        var updateTimer = function(){
            if (running) {
                if(minutesLeft <= 0 && secondsLeft <= 0){
                    running = false;
                } else if (!countup) { //counting down
                    if (secondsLeft > 0) {
                        secondsLeft -=1;
                    } else if (secondsLeft === 0) {
                        secondsLeft = 59;
                        minutesLeft -= 1;
                    }
                } else { //countup === true
                    if (secondsLeft < 60) {
                        secondsLeft += 1;
                    } else if (secondsLeft === 60) {
                        secondsLeft = 0;
                        minutesLeft += 1;
                    }
                }
                updateDisplay();
                totalSeconds += 1;
            }
        };

        var updateDisplay = function(){
            if (id === "master") {
                masterMinutes.value = cleanUpNumber(minutesLeft);
                masterSeconds.value = cleanUpNumber(secondsLeft);
            } else {
                pointer.innerHTML = cleanUpNumber(minutesLeft) + ":" + cleanUpNumber(secondsLeft);
            }
        }

        return {
            start: function(){
                if (!running) {
                    console.log("Timer {0}: started", [id]);
                    running = true;
                }
            },
            stop: function(){//stop the running
                if (running) {
                    console.log("Timer {0}: Stopped", [id]);
                    running = false;
                }
            },
            update: function(){//called every update
                updateTimer();
            },
            setCountUp: function(value){//counting up or down
                if (value === true || value === false) {
                    countup = value;
                }
            },
            setTime: function(minutes, seconds){
                minutesLeft = minutes;
                secondsLeft = seconds;
                updateDisplay();
            },
            getTotal: function(){
                return totalSeconds;
            },
            getId: function(){
                return id;
            },
            isRunning: function(){return running}
        }
    }();
};

//handles all the timers
var timerManager = function(){
    //Variables
    var timerList = [],
        timerInterval,
        slowed = false,
        running = false,
        slowbox = document.getElementById("slow"),
		slowtext = document.getElementById("slowtext");
    //private functions
    var update = function(){
        for (var i = 0; i < timerList.length; i++) {
            timerList[i].update();
            if (timerList[i].getId() === "master" && timerList[i].isRunning() === false) {
                stop();
            }
        }
    },
    start = function(){
        if (!running) {
            for (var i = 0; i < timerList.length; i++) {
                timerList[i].start();
            }
            timerInterval = setInterval(update, 1000); //have the timers update once a second.

            //enable slowing
            running = true;
            slowbox.onclick = slow;
            slowtext.innerHTML = "Slow";
            console.log("Slowed");
        }
    },
    stop = function(){
        if (running) {
            running = false;
            for (var i = 0; i < timerList.length; i++) {
                timerList[i].stop();
            }
            clearInterval(timerInterval);
            //enable reset
            slowbox.onclick = reset;
            slowtext.innerHTML = "Reset";
        }
    },
    slow = function(){
        console.log("Slow Hit");
        if (running) {
            if (slowed){    //if already slowed down
                clearInterval(timerInterval);
                timerInterval = setInterval(update, 1000);    //speed back up
                slowed = false;
                slowtext.innerHTML = 'Slow';
            } else {
                clearInterval(timerInterval);
                timerInterval = setInterval(update, 2000);    //slow down
                slowed = true;
                slowtext.innerHTML = 'Fast';
            }
        }
    },
    reset = function(){
        console.log("Reset Hit");
        set([16, 00]);
    },
    set = function(time){
        for (var i = 0; i < timerList.length; i++) {
            timerList[i].setTime(time[0], time[1])
        }
    }

    return {
        addTimer: function(timer){//add timer to list
            timerList.push(timer);
        },
        updateTimers: function(){//run update on all the timers
            update();
        },
        startTimers(){
            start();
        },
        slowTimers: function(){
            slow();
        },
        stopTimers(){
            stop();
        },
        resetTimers: function() {
            reset();
        },
        setTimers: function(time){
            set(time);
        },
        setCountUp: function(value){
            for (var i = 0; i < timerList.length; i++) {
                timerList[i].setCountUp(value);
            }
        },
        swapID: function(id){ //stop a specific ID
            for (var i = 0; i < timerList.length; i++) {
                if (timerList[i].getId() === id) {
                    if (timerList[i].isRunning()) {
                        timerList[i].stop();
                    } else {
                        timerList[i].start();
                    }
                }
            }
        }
    }
}();

//******************UTILITYS*****************************
var cleanUpNumber = function(number){   //cleans up number for disply. returns String
    if(typeof number === "number"){number = number.toString();} //if number entered make string
    if(typeof number === "string"){//if it is a string
        if(number.length < 2){  //that is only one letter long
            number = "0" + number;  //add a 0 to that string.
        }
    }
    else{
        console.log("ERROR: Type ("+ typeof number +") not supported");
    }
    return number;
}
