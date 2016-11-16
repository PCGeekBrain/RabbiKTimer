/*
the basic timer objects.
*/
//simple timer object: constructer below.
var simpleTimer = function(name, pointer, textPointer){//added textPointer
    //when constructon (above) is called the code below executes and returns an object;
    return function (){
        var id = name,  //The id for the timer
            timerInterval,  //Variable to store the actual countdown interval object
            running = false,
            countup = false,
            minutesLeft = 16,
            secondsLeft = 00,
            totalSeconds = 0;
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
        };

        return {
            start: function(){running = true;},
            stop: function(){running = false;},
            update: function(){updateTimer();},
            setCountUp: function(value){//counting up or down
                if (value === true || value === false) {countup = value;}
            },
            setTime: function(minutes, seconds){
                minutesLeft = minutes;
                secondsLeft = seconds;
                updateDisplay();
            },
            getTotalSeconds: function(){return totalSeconds;},
            getId: function(){return id;},
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
                stop(1);
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
    stop = function(mode){
        if (running) {
            running = false;    //duh
            clearInterval(timerInterval);   //clear that constant running thing.
            for (var i = 0; i < timerList.length; i++) {
                timerList[i].stop();    //stop every timer becuase, y not.
            }
            //make noise!!!!
            if (mode === 1) {
                var audio = new Audio('audio/Noises2.mp3');
            } else {
                var audio = new Audio('audio/Tone.mp3');
            }
            audio.play();
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
        set([16, 00]);
    },
    set = function(time){
        if (running === false) {
            for (var i = 0; i < timerList.length; i++) {
                timerList[i].setTime(time[0], time[1])
            }
        }
    }

    return {
        addTimer: function(timer){timerList.push(timer);},
        updateTimers: function(){update();},
        startTimers(){start();},
        slowTimers: function(){slow();},
        stopTimers(){stop();},
        resetTimers: function() {reset();},
        setTimers: function(time){set(time);},
        setCountUp: function(value){
            for (var i = 0; i < timerList.length; i++) {
                timerList[i].setCountUp(value);
            }
        },
        swapID: function(id){ //start/stop a sub timer.
            for (var i = 0; i < timerList.length; i++) {
                if (timerList[i].getId() === id) {
                    if (timerList[i].isRunning()) {
                        timerList[i].stop();
                    } else {
                        timerList[i].start();
                    }//close else
                }//close if
            }//close for
        },//close function
        getId(id){
            for (var i = 0; i < timerList.length; i++) {
                if (timerList[i].getId() === id) {
                    return timerList[i];
                }
            }
        }
    }
}();
