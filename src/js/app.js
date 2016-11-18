var app = function(){//everything in here I repeat everything will run on launch. It is bloated enough I know.
    /**********************************INIT**********************************************/
    var currentClass,
        firstRun = true;
        studentTimers = document.getElementById('studentTimersList'),
        classListDropdown = document.getElementById('classSelect');
/*********************************TIMER**********************************************/
    function simpleTimer(name, pointer, buttonPointer){//TODO make button change when paused
        var id = name,  //the ID of the timer
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
                if (minutes <= 0 && seconds <=0) {  //if we are out of time
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
                } else if (countup){    //counting up
                    if (seconds === 59) {   //if we are going to minutes
                        seconds = 0;    //reset seconds
                        minutes += 1;   //add a minute
                    } else {
                        seconds += 1;
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
            if (running) {buttonPointer.value = 'Start'; buttonPointer.className = "startStudentBtn"; running = false}
            else {buttonPointer.value = 'Stop'; buttonPointer.className = "stopStudentBtn"; running = true}
        }
        //simpleTimer external (callable) functions
        return{
            start: function(){if(!running){running = true;}},    //start the timer
            stop: function(){if(running){running = false;}},     //stop the timer
            update: function(){return update()},    //allow the timer to be updated (by timer manager please)
            setCountUp: function(value){if (typeof(value) === 'boolean') {countup = value;}},    //change the counting direction
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
            var stopAll = false;
            if (running) {  //if we are running
                for (var i = 0; i < timerList.length; i++) {//get every timer
                    timerList[i].update();  //update it
                    if (timerList[i].getId() === "master" && timerList[i].isRunning() === false) {stopAll = true; sound(1);}//if the master is done then stop all timers after this update
                }
            } else {console.warn("timerManager.update() run without running being true.");}//something is up ifthis runs. notify
            if(stopAll){stop()};//takes care of error where students are left with 00:01 becuase master is called first
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
                slowbox.onclick = timerManager.reset; slowtext.innerHTML = "Reset" //show the user that they can slow the timer down
                sound(0);
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
        var sound = function(mode){
            if (mode === 1) {var audio = new Audio('audio/end.mp3');}   //mode = 1 play end.mp3
            else {var audio = new Audio('audio/stop.mp3');}             //mode !=1 play stop.mp3
            audio.play();
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
            setCountUp: function(value){
                for (var i = 0; i < timerList.length; i++) {
                    timerList[i].setCountUp(value);
                }
            },//set all the timers countup value to this
            swapIdState: function(id){for (var i = 0; i < timerList.length; i++) {if(timerList[i].getId() === id) {timerList[i].swapText();}}},// run swap id on a timer
            getByID: function(id){for (var i = 0; i < timerList.length; i++) {if (timerList[i].getId() === id) {return timerList[i];}}} //pull a timer by its id
        };
    }();
/***********************************LOG*******************************************/
    var log = function(){
        var classJSON, //DO NOT SET HERE
            errorTime = "00:00:00",//default if error occurs
            today = new Date().toDateString();//get the date for the logging
        if (localStorage.getItem('classList') !== null) {
            classList = JSON.parse(localStorage.getItem('classList'));
        }
        //internal functions
        var addClass = function(){
            var className = prompt("Please enter the name of the class you would like to add.");
            if (className === null || className === "") {
                console.warn("Not valid class name entered. recived null or blank string.");
                className = "Default";
            }
            if (classList.indexOf(className) !== -1) {console.warn("Can not add: Class already Exists"); return;}//throw error and leave function if we already have the class
            classList.push(className);//add it to the list of classes
            classJSON = {students:["master"]};//generate the baisc JSON
            localStorage.setItem(className, JSON.stringify(classJSON));//store it away
            updateClassDropdown();
            return className;
        };
        var loadClass = function(className){
            if (firstRun) {
                firstRun = false;
            } else{logToDrive();}//save the last class.
            //now open class
            if (classList.indexOf(className) === -1) {console.warn("loadClass: No Such Class");return;};//if class is not in list, throw a fit and run to the administrator
            currentClass = className;   //set the current class to that name
            classJSON = JSON.parse(localStorage.getItem(className));
            studentTimers.innerHTML = "";   //someone on stackoverflow said this will not prevoke russian nuclear retaliation. I'm trusting him.
            for (var i = 0; i < classJSON['students'].length; i++) {//for every studet, generate one
                createTimer(classJSON['students'][i]);
            } //update Class list
            updateClassDropdown();
        };
        var removeClass = function(){
            var className = prompt("Enter the name of the class you would like to remove.\nNote: class cannot be open\nWARNING: YOU CAN NOT REVERSE THIS");
            if(className === null || className === ""){return;}//left it blak or cancelled. obviously changed their mind.
            if (className === currentClass) {alert("Please leave class before removing it"); return;}//can't remove current class
            if (classList.indexOf(className) === -1) {alert("Sorry, it seems we do not have a class by that name. Please try again."); return;} //we dont have it. notify user and leave.
            //if no returns where called by now we should be good.
            classList.splice(classList.indexOf(className), 1);  //remove it from the class list. this list s saved when the window closes for future use.
            updateClassDropdown();  //update the dropdown menu
            localStorage.removeItem(className); //remove the class from localStorage
        };
        var addStudent = function(){
            var studentName = prompt("Please enter the name of the student you would like to add.");
            if (studentName === null || studentName === "") {return;};
            if (studentName.indexOf(";") > -1){var new_students = studentName.split(";");} //if multiple students given in. split it up.
            else{var new_students = [studentName]};
            for (var i = 0; i < new_students.length; i++) {
                if (classJSON['students'].indexOf(new_students[i]) !== -1){alert("This student already exists: " + new_students[i]); continue;};//already have this student
                classJSON['students'].push(new_students[i]);
                createTimer(new_students[i]);
            };
        };
        var removeStudent = function(){
            var studentName = prompt("Please enter the name of the student you would like to remove.\nNote: class must be open to work\nWARNING: YOU CAN NOT REVERSE THIS")
            if (studentName === null || studentName === "") {return;}
            if (studentName.indexOf(";") > -1){var removed_students = studentName.split(";");} //if multiple students given in. split it up.
            else{var removed_students = [studentName]};
            for (var i = 0; i < removed_students.length; i++) {
                if (classJSON['students'].indexOf(removed_students[i]) === -1){alert("This student does not exist: " + removed_students[i]); continue;};//already have this student
                classJSON['students'].splice(classJSON['students'].indexOf(removed_students[i]), 1)
                var studentTimer = document.getElementById('s' + removed_students[i]);
                studentTimer.remove();
            }
        };
        var logToDrive = function(){
            //class first
            students = classJSON['students']//makes life simple for now. Is TEMP
            for (var i = 0; i < students.length; i++) {
                var totalSeconds = timerManager.getByID(students[i]).getTotalSeconds();
                if (!classJSON.hasOwnProperty(today)) {classJSON[today] = {};}
                if (classJSON[today][students[i]] !== undefined) {//if the day and student exist
                    var oldTotalSeconds = parseTime(classJSON[today][students[i]]); //get the old time
                    totalSeconds = totalSeconds + oldTotalSeconds;  //ad add it to the time from now
                }
                classJSON[today][students[i]] = formatTime(totalSeconds);
            }
            localStorage.setItem(currentClass, JSON.stringify(classJSON));  //log the class to console
            localStorage.setItem('currentClass', currentClass); //store the current class for the next time the app is opened.
            localStorage.setItem('classList', JSON.stringify(classList));   //store the list of classes for the same reason.
        }
        var generateCSV= function(){
            var students = classJSON['students'];//get all the students
            var dates = Object.keys(classJSON); //get all the dates (keys)
            dates.splice(dates.indexOf('students'), 1); //remove students from that list
            returnCSV = 'data:text/csv;charset=utf-8,';//first cell is empty
            for (var i = 0; i < students.length; i++) {returnCSV = returnCSV + "," + students[i];};//add every student to the top row. Bad implamentation I know, want to fix it?
            returnCSV += "\n";//add a new line to csv file
            for (var i = 0; i < dates.length; i++) {//for every date on file
                returnCSV = returnCSV + dates[i] + ",";//add the date to collumn one
                for (var j = 0; j < students.length; j++) { //for every active student
                    if (classJSON[dates[i]][students[j]] === undefined) {   //see fi he has a log
                        returnCSV = returnCSV + errorTime + ",";  //if not thorw in the error string located at the top of this object
                    } else {
                        returnCSV = returnCSV + classJSON[dates[i]][students[j]] + ",";   //we have him. so put in the time on file.
                    }
                }
                returnCSV += "\n";  //add a new line for every day.
            }
            return encodeURI(returnCSV);
        }

        //external functions
        return {
            add: function(){return addClass();},
            load: function(classname){loadClass(classname)},
            remove: function(classname){removeClass()},
            addStudent: function(studentName){addStudent()},
            removeStudent: function(studentName){removeStudent()},
            csv: function(){return generateCSV()},
            log: function(){logToDrive()}
        };
    }();

/************************************Utilitys*******************************************/
    function cleanUpNumber(number){   //cleans up number for disply. returns String
        if(typeof number === "number"){number = number.toString();} //if number entered make string
        if(typeof number === "string"){if(number.length < 2){number = "0" + number;}}// add a 0 if too short
        else{console.warn("ERROR: Type ("+ typeof number +") not supported");}//throw error if that happens
        return number;//give back the number
    };
    function createTimer(studentName){
        if (studentName === "master") {return;} //fixes bug. this works. move on.
        var li = document.createElement('li'),  //generating all the elements
            tempName = document.createElement('p'), //not name as that is taken in chrome
            timer = document.createElement('p'),
            button = document.createElement('input');
        li.setAttribute('id', 's'+studentName);
        tempName.innerHTML = studentName;   //assign the name to the name <p>
        timer.innerHTML = "16:00"; timer.className = "studentTimer"  //put the defualt time in the timer <p>
        button.value = "Stop"; button.type = 'button'; button.className = "stopStudentBtn";  //set the <button>'s propertys'
        button.onclick = function(){timerManager.swapIdState(studentName)}; //set <button>'s onclick
        li.appendChild(tempName); li.appendChild(timer); li.appendChild(button);    //add them all to the <li>
        studentTimers.appendChild(li);  //throw it in the <ul>
        //generate the backend timer
        tempTimer = simpleTimer(studentName, timer, button);
        timerManager.add(tempTimer);
    };
    function updateClassDropdown(){
        for (var i = classListDropdown.options.length - 1; i >= 0; i--) {classListDropdown.remove(i);}  //remove all the old stuff from the list
        for (var i = 0; i < classList.length; i++) {
            var option = document.createElement('option');
            option.innerHTML = classList[i];
            classListDropdown.appendChild(option);
        };
        classListDropdown.value = currentClass;
    };
    function parseTime(timeString){
        var seconds = 0;
        if (typeof(timeString === 'string') && timeString.indexOf(":") > -1) {
            var numbers = timeString.split(":");
            if (numbers.length === 3) {
                try {seconds = (parseInt(numbers[0])*3600) + (parseInt(numbers[1])*60) + parseInt(numbers[2])} //seconds = (hours * 3600) + (minutes * 60) + seconds
                catch (e) {console.warn("parseTime not given spec (xx:xx:xx)");}
            } else {console.warn("parseTime not given spec (xx:xx:xx)");}//end else
        }//end if
        return seconds;
    };//end function
    function formatTime(seconds){
        if (isNaN(seconds)) {return "00:00:00"};//NaN is annoying so lets kick him out
        var minutes = 0, hours = 0;//these are some things.
        while (seconds >= 60) {//got a minute?
            seconds -= 60;
            minutes += 1;
            if (minutes >= 60) {
                minutes -= 60;
                hours += 1;
            }//end minutes if
        }//partys over, no more minutes left.
        return cleanUpNumber(hours) + ":" + cleanUpNumber(minutes) + ":" + cleanUpNumber(seconds);  //return hours:minutes:seconds
    }
    function shutDown(){
        log.log();
        console.log("disk write complete");
    };

/*'******************************Back to app**********************************************/
    //add master timer
    master = simpleTimer("master");
    timerManager.add(master);
    //get the students and sidplay them
    if (localStorage.getItem('classList') === null) {classList = []}
    else {classList = JSON.parse(localStorage.getItem('classList'));}
    if (localStorage.getItem('currentClass') === null) {currentClass = log.add();}
    else {currentClass = localStorage.getItem('currentClass');}
    //update class list
    log.load(currentClass);
    //public options
    return {
        start: function(){timerManager.start();},
        stop: function(){timerManager.stop();},
        reset: function(){timerManager.reset()},
        setTime: function(){timerManager.set([parseInt(masterMinutes.value, 10), parseInt(masterSeconds.value, 10)])},
        countUp: function(input){timerManager.setCountUp(input.checked);},//TODO change to timerManager.setCountUp(input.checked);
        downloadCSV: function(link){link.setAttribute('href', log.csv())},
        changeClass: function(){log.load(classListDropdown.value);},
        addClass: function(){log.add();},
        removeClass: function(){log.remove()},
        addStudent: function(){log.addStudent()},
        removeStudent: function(){log.removeStudent()},
        onShutdown: function(){shutDown();}
    }
}();//end of app variable. runs whole application. locks everything except what is in the final return becuase js.

//run the shutdown code on time
window.onbeforeunload = function(){
   app.onShutdown();
}
