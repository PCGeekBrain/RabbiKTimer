var testapp = function(){
    /**************************TIMER**********************************************/
    function simpleTimer(name, pointer, buttonPointer){//TODO make button change when paused
        var id = name,
            running = false,    //timer not running at init
            countup = false,    //timer counting down at init
            minutes = 16,       //defaults to 16:00
            seconds = 0,
            totalSeconds = 0;   //keeps track of how long the timer has run
        if (id === 'master') {//if we are dealing with the master timer we will need these two variables
            masterMinutes = document.getElementById("minutes"),
            masterSeconds = document.getElementById("seconds");
        }
        //simpleTimer internal functons
        var update = function(){
            if (running) {  //if the timer is running
                if (minutes <= 0 && secondsLeft <=0) {  //if we are out of time
                    running = false //stop timer
                    return; //quit update function
                }
                if (!countup) { //if we are counting down...
                    if (seconds === 0) {    //if we are out of seconds
                        seconds = 59;   //set it to 59
                        minutes -= 1;   //remove a minute
                    } else {    //there are seconds to remove
                        seconds -= 1;   //take one
                    }
                } else {    //we are assuming here that running and countup === true
                    if (seconds === 59) {   //if we are going to minutes
                        seconds = 0;    //reset seconds
                        minutes += 1;   //add a minute
                    }
                }//done with adjusting the internal time. now to the displaying of that data
                updateDisplay();
                totalSeconds += 1;  //tick up one.
            }   //not running code goes here
        };  //done with update
        var setTime = function(setminutes, setseconds){
            minutes = setminutes;
            seconds = setseconds;
            updateDisplay();
        };
        var updateDisplay = function(){   //seperated to avoid code duplication.
            if (id === 'master') {//the master timer has different html elements and needs to be handled differently
                masterMinutes.value = cleanUpNumber(minutes);
                masterSeconds.value = cleanUpNumber(seconds);
            } else {    //student sub timers
                pointer.innerHTML = cleanUpNumber(minutes) + ":" + cleanUpNumber(seconds);
            }
        };
        var swapText = function(){
            if (running) {buttonPointer.innerHTML = 'Start'; running = false}
            else {buttonPointer.innerHTML = 'Stop'; running = true}
        }
        //simpleTimer external (callable) functions
        return{
            start: function(){running = true;},    //start the timer
            stop: function(){running = false;},     //stop the timer
            update: function(){return update()},    //allow the timer to be updated (by timer manager please)
            setCountUp: function(value){if (typeof(value) === 'boolean') {countup = value}},    //change the counting direction
            setTime: function(min, sec){return setTime(min, sec)},  //change the time of said timer
            getTotalSeconds: function(){return totalSeconds},   //get the total seconds for logging
            getId: function(){return id},   //return the id to figure out what object this is
            isRunning:function(){return running},   //see if the timer is running or not
            swapText:function(){return swapText()}
        }
    };
    var timerManager = function(){//runs function and returns object that handles all the timers
        var timerList = [], //literally just an array to put the timers in
            timerInterval,
            slowed = false,
            running = false,
            slowbox = document.getElementById("slow"),
		    slowtext = document.getElementById("slowtext");
        //internal functions
        var update = function(){
            var stop = false;
            if (running) {  //if we are running
                for (var i = 0; i < timerList.length; i++) {//get every timer
                    timerList[i].update();  //update it
                    if (timerList[i].getId() === "master" && timerList[i].isRunning() === false) {stop = true;}//if the master is done then stop all timers after this update
                }
            } else {console.error("timerManager.update() run without running being true.");}//something is up ifthis runs. notify
            if(stop){stop()};//takes care of error where students are left with 00:01 becuase master is called first
        };
        var start = function(){
            if (!running) {
                for (var i = 0; i < timerList.length; i++) {timerList[i].start()}//run start() on every timer
                timerInterval = setInterval(update, 1000);//set the interval to run the timer every second
                running = true; //set running to true
                slowbox.onclick = slow; slowtext.innerHTML = "Slow" //show the user that they can slow the timer down
            }
        };
        var stop = function(){
            if (running) {
                for (var i = 0; i < timerList.length; i++) {timerList[i].stop()}//run stop() on every timer
                clearInterval(timerInterval);
                running = false;
                slowbox.onclick = reset; slowtext.innerHTML = "Reset" //show the user that they can slow the timer down
            }
        };
        var slow = function(){
            if (running) {  //make sure we are running
                clearInterval(timerInterval);   //clear the interval
                if (slowed) {   //if we already slowed down. Speed up
                    timerInterval = setInterval(update, 1000);    //speed back up
                    slowed = false; slowtext.innerHTML = 'Slow';
                } else {
                    timerInterval = setInterval(update, 2000);    //slow down
                    slowed = true; slowtext.innerHTML = 'Fast';
                }
            }//code here should never be run but who knows
        };
        var set = function(time){
            if (running == false && time.length === 2){//if we are not running and input is length of two
                for (var i = 0; i < timerList.length; i++) {timerList[i].setTime(time[0], time[1]);} //set every timer to these two numbers
            }
        }
        //external functions
        return {
            update: function(){return update();},
            start: function(){return start();},
            stop: function(){return stop();},
            slow: function(){return slow();},
            set: function(time){return set(time)},
            reset: function(){set([16,00])},
            add: function(timer){timerList.push(timer)},
            setCountUp: function(value){for (var i = 0; i < timerList.length; i++) {timerList[i].setCountUp(value);}},//set all the timers countup value to this
            swapIdState: function(id){for (var i = 0; i < timerList.length; i++) {if(timerList[i].getId() === id) {timerList[i].swapText();}}},// run swap id on a timer
            getByID: function(id){for (var i = 0; i < timerList.length; i++) {if (timerList[i].getId() === id) {return timerList[i];}}} //pull a timer by its id
        };
    }();
    //test all the objects in the console
    console.log(simpleTimer("test"));
    console.log(timerManager);
    return {
        simpleTimer: function(name, pointer, buttonPointer){
            return simpleTimer(name, pointer, buttonPointer);
        }
    }
}();//end of app variable. runs whole application. locks everything except what is in the final return becuase js.
