var app = function(){
    //self containd and executing function for main application.
    //Note: all code below is run on load
    var studentTimers = document.getElementById('studentTimersList'),
        minutesBox = document.getElementById('minutes'),
        secondsBox = document.getElementById('seconds');
    //setup the main timer. TODO debug
    masterTimer = simpleTimer("master");
    timerManager.addTimer(masterTimer);

    //sets time on all timers when adjusted on master timer
    var setTimes = function(){
        minutes = parseInt(minutesBox.value, 10);
        seconds = parseInt(secondsBox.value, 10);
        timerManager.setTimers([minutes, seconds]);
        console.log("SetTimes: " + minutes + ":" + seconds);
    }

    //***************************UTILITYS******************************************
    function addStudentTimerBox(studentName){
        //get the box and create the element shells
        var li = document.createElement('li'),
            tempName = document.createElement('p'),//not name as that is taken in chrome
            timer = document.createElement('p'),
            button = document.createElement('input');
        //set the data inside them
        tempName.innerHTML = studentName;
        timer.innerHTML = "16:00";
        button.value = "Pause";
        button.type = "button";
        button.onclick = function(){timerManager.swapID(studentName)};
        //add items together in order
        li.appendChild(tempName);
        li.appendChild(timer);
        li.appendChild(button);
        studentTimers.appendChild(li);
        //create timer and add to list;
        tempTimer = simpleTimer(studentName, timer, button);
        timerManager.addTimer(tempTimer);
    }

    return{
        setTime: function(){
            setTimes();
        },
        addStudent: function(name){
            addStudentTimerBox(name);
        }
    }
}();
