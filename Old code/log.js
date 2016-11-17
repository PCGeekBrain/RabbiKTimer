/*
Logging code for timer logs.
*/

var log = function(){
    //below is executed onLoad and private;
    //Variables
    var currentClass,
        errorTime = "00:00:00",
        classList,
        today = new Date(), //get today
        today = today.toDateString();   //make that a nice simple date would you? thanks.

    //functions
    function addClass(){
        if(arguments[0] === null){
            var className = arguments[0];
        } else {
            var className = prompt("Please enter class name", "Gemarah");
        }
        var classObj = {
            students:["master"]
        };
        if (localStorage.getItem(className) === null) {
            localStorage.setItem(className, JSON.stringify(classObj));
        } else {
            alert(className + "already exists")
        }
        //add class to selector and storage
    };
    function loadClass(className){
        //TODO set object name
    };
    function logTotal(){ //Main function. Logs class
        if (currentClass !== undefined && localStorage.getItem(currentClass) !== null) {//check for errors in class loading
            classJson = JSON.parse(localStorage.getItem(currentClass)); //load it
            students = classJson["Students"];   //get the students
            for (var i = 0; i < students.length; i++) {//go through each student
                if (timerManager.getId(students[i]) !== undefined) {//catching stupid possible undefined issues
                    var totalSeconds = timerManager.getId(students[i]).getTotalSeconds();   //get the total seconds for the student
                    if (classJson.hasOwnProperty(today)){//if today exists (already logged)
                        var oldTotalSeconds = parseTime(classJson[today][students[i]]); //get what was logged before
                        totalSeconds = totalSeconds + oldTotalSeconds;  //add it up
                    }
                    classJson[today][students[i]] = formatTime(totalSeconds);   //write the total to the JSON
                } else {
                    classJson[today][students[i]] = errorTime;
                }
            }//done going through all the students
        } else {console.warn("currentClass is null or localStorage has no currentClass");}
    };
    function CSV(){

    };
//******************************************UTILITYS****************************
    function parseTime(timeString){
        var seconds = 0;
        if (typeof(timeString === 'string') && timeString.indexOf(":") > -1) {
            var numbers = timeString.split(":");
            if (numbers.length === 3) {
                try { //seconds = (hours * 3600) + (minutes * 60) + seconds
                    seconds = (parseInt(numbers[0])*3600) + (parseInt(numbers[1])*60) + parseInt(numbers[2])
                } catch (e) {
                    console.error("parseTime not given spec (xx:xx:xx)");
                }
            } else {
                console.error("parseTime not given spec (xx:xx:xx)");
            }//end else
        }//end if
    };//end function
    function formantTime(seconds){
        if (isNaN(seconds)) {return "00:00:00"};//NaN is annoying so lets kick him out
        var minutes, hours;//these are some things.
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

    //below is object returned
    return {
        downloadCSV: function(link){
            console.warn("downloadCSV in dev");
        },
        addClass: function(){
            addClass();
            console.warn("addClass in dev");
        },
        loadClass: function(className){
            loadClass(className);
            console.warn("loadClass in dev");
        },
        loadClassFromList(selector){
            loadClass(selector.options[selector.selectedIndex].text);
        },
        removeClass: function(){
            removeClass()
        },
        addStudent:function(){
            addStudent();
        },
        removeStudent:function(){
            removeStudent();
        },
        logTime: function(){//depends on timermanager object existing. Will fail otherwise.
            logTotal();
        }
    }
}()
