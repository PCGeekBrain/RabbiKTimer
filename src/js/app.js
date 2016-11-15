var app = function(){
    var minutesBox = document.getElementById('minutes'),
        secondsBox = document.getElementById('seconds');
    //setup the main timer. TODO debug
    masterTimer = simpleTimer("master");
    timerManager.addTimer(masterTimer);

    //TODO get rid of this, it is all debugs. Testing generated student timers
    testTimer = simpleTimer(1, document.getElementById("s1t"))
    timerManager.addTimer(testTimer);

    //TODO, make master time apply to all the otherones when reset;
    var setTimes = function(){
        minutes = parseInt(minutesBox.value, 10);
        seconds = parseInt(secondsBox.value, 10);
        timerManager.setTimers([minutes, seconds]);
        console.log("SetTimes: " + minutes + ":" + seconds);
    }

    //***************************UTILITYS******************************************
    function addStudentTimerBox(id, name){
        //get the box and create the element shells
        var studentTimers = document.getElementById('studentTimersList'),
            li = document.createElement('li'),
            name = document.createElement('p'),
            timer = document.createElement('p'),
            button = document.createElement('input');
        //set the data inside them
        name.innerHTML = name;
        timer.innerHTML = "16:00"

    }

    return{
        setTime: function(){
            setTimes();
        }
    }
}();
