/*
the basic timer objects.
*/


var simpleTimer = function(name){
    return function (){ //Allows simpleTimer("name") to still work with private Variables
        var id = name,  //The id for the timer
        timerInterval,  //Variable to store the actual countdown interval object
        running = false,
        slowed = false,
        countup = false,
        minutesLeft = "00",
        secondsLeft = "00",
        totalSeconds = 0;

        return {
            start: function(){
                console.log("start Hit");
            }
        }
    }();
};

//handles all the timers
var timerManager = function(){
    //Variables
    var timerList = []; //TODO, figure out arrays again

}();
