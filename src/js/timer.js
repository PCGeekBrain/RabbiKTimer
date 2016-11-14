/*
the basic timer objects.
*/


var simpleTimer = function(name, pointer){
    return function (){ //Allows simpleTimer("name") to still work with private Variables
        var id = name,  //The id for the timer
        timerInterval,  //Variable to store the actual countdown interval object
        running = false,
        countup = false,
        minutesLeft = 0,
        secondsLeft = 0,
        minutesLeftString = "00",
        secondsLeftString = "00",
        totalSeconds = 0;

        var updateTimer = function(){
            if(minutesLeft <= 0 && secondsLeft <= 0){
                running = false;
                endTimerNotice();
            }
            if (!countup) { //counting down
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
            pointer.innerHTML = cleanUpNumber(minutesLeft) + ":" + cleanUpNumber(secondsLeft);
            totalSeconds += 1;
        }

        return {
            start: function(){
                if (!running) {
                    console.log("Timer {0}: started", [id]);
                    running = true;
                }
            },
            stop: function(){
                if (running) {
                    console.log("Timer {0}: Stopped", [id]);
                    running = false;
                }
            },
            update: function(){
                updateTimer();
            }
        }
    }();
};

//handles all the timers
var timerManager = function(){
    //Variables
    var timerList = []; //TODO, figure out arrays again

}();

//******************UTILITYS*****************************

var cleanUpNumber = function(number){
    if(typeof number === "number" || typeof number === "string"){
        if(typeof number === "number"){number = number.toString();}
        if(number.length < 2){
            number = "0" + number;
        }
    }
    else{
        console.log("ERROR: Type ("+ typeof number +") not supported");
    }
    return number;
},
