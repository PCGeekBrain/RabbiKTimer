var app = function(){
    //self containd and executing function for main application.
    //Note: all code below is run on load
//*****************************MAIN APP*****************************************
    //get variables
    var studentTimers = document.getElementById('studentTimersList'),
        minutesBox = document.getElementById('minutes'),
        secondsBox = document.getElementById('seconds');
    //setup the main timer
    masterTimer = simpleTimer("master");
    timerManager.addTimer(masterTimer);
    //load class
    if (localStorage.getItem('currentClass') !== null) {    //if class set
        log.loadClass(localStorage.getItem('currentClass'));    //load it
    } else {//if no class is set. generate a default one, load it and set it.
        log.addClass("default");
        log.loadClass("default");
    }
    //load class list
    if (localStorage.getItem('classList') === null) {
        localStorage.setItem('classList', JSON.stringify({classes:[]}))
        classList = [];
    } else {
        classList = JSON.parse(localStorage.getItem('classList'))['classes'];
    }
//***************************UTILITYS******************************************
    //sets time on all timers when adjusted on master timer
    var setTimes = function(){
        minutes = parseInt(minutesBox.value, 10);
        seconds = parseInt(secondsBox.value, 10);
        timerManager.setTimers([minutes, seconds]);
        console.log("SetTimes: " + minutes + ":" + seconds);
    }
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

//**************************UTILITYS*******************************************
function cleanUpNumber(number){   //cleans up number for disply. returns String
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

/*/when page is unloaded log times from currnet class.
window.onbeforeunload = function(){
   log.logTime();
}
*/
