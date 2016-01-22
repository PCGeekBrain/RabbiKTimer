/***********
Creator: Mendel Hornbacher
Date: November 19, 2015

Dependencys: timer.js
Global Variables: myTable, startDate
Global Functions: logTotalTime(seconds), secondsToString(seconds), stringToSeconds(timeString);

myTable is * weeks -> 7 days
***********/
var myTable, startDate;

function onstart(){//loads data from localStorage
	//Get data from storge
	if(localStorage.getItem('Table') === null){
		myTable = [[]] //[ * [ 0-7 ] ] or [weeks[days]]. so sunday is [x][1].
		myTable[0]=["","Sunday","Monday","Tuesday","Wendsday","Thursday","Friday","Shabbos"];
	} else {
		myTable = JSON.parse(localStorage.getItem('Table')) //[ * [ 0-7 ] ] or [weeks[days]]. so sunday is [x][1].
	}

	if(localStorage.getItem('StartDate') === null){
		startDate = getLastSunday();
	} else {
		startDate = new Date(localStorage.getItem('StartDate')) //the start date
	}
}
onstart();//run it
//log it.
function logTotalTime(seconds){//get the seconds to log
	console.log("Logging: " + secondsToString(seconds)); //log out the time sent in
	insert(seconds);
	close();
};

//****************************************Conversions****************************************************//

function insert(seconds){//DEBUG

	var location = new Date(),			//Today
		diff = daysSinceDate(startDate),//How many days have passed
		row = Math.ceil(diff / 7) + 1,		//Gives row (from 1)
		column = Math.ceil(diff % 7) + 1;	//Gives column (from 1)
	
	//Done above

	 if(myTable[row] === undefined){
	 	console.log('empty row');	//check if row exists
	 	myTable[row] = [];			//if not add it
	 }

	 var olddate = myTable[row][column];	//
	 console.log("In table: " + olddate);

	 if(olddate === undefined){
	 	console.log("Nothing there. Adding: " + secondsToString(seconds));
	 	var total = secondsToString(seconds);
	 } else{
	 	console.log("Loaded: " + olddate);
	 	var oldseconds = stringToSeconds(olddate),	//Make the old string into a total seconds. NaN?
	 		newSeconds = oldseconds + seconds,		//
	 		total = secondsToString(newSeconds);	//
	 	console.log("End: ");
	 	console.log("oldseconds: " + oldseconds);
	 	console.log("newSeconds: " + newSeconds);	
	 	console.log("Total: " + total);	
	 }

	 myTable[row][column] = total;
	 console.log('End table: ' + myTable);

}

function secondsToString(seconds){ //convert seconds to string
	if(isNaN(seconds)){
		seconds = 00;
	}
	var result = "00:00:00",
		minutes = 00,
		hours = 00;
	if(seconds >= 60){ //while there are minutes
		while(seconds >= 60){
			seconds = seconds - 60;
			minutes = minutes + 1; //add a minute and remove 60 seconds
		}
		if(minutes >= 60){ //while there are minutes
			while(minutes >= 60){
				minutes = minutes - 60;
				hours = hours + 1; //add a hour and remove 60 minute
			}
		}
	}
	result = cleanUpNumber(hours) + ":" + cleanUpNumber(minutes) + ":" + cleanUpNumber(seconds);
	return result;
};

function stringToSeconds(timeString){
	console.log("Input of strngtoSeconds: " + timeString);
	if(typeof timeString === 'string' && timeString.indexOf(":") > -1){ //check for valid string
		var numbers = timeString.split(":"),
			result = (parseInt(numbers[0])*60+parseInt(numbers[1])*60+parseInt(numbers[2]));
		console.log("numbers: "+numbers);
		console.log("Result: "+ result);
	}
	return result;
}

function getLastSunday(){
	console.log('get last sunday');
	var now = new Date(),
		today = new Date(now.getFullYear(), now.getMonth(), now.getDate()),
		lastSunday = new Date(today.setDate(today.getDate()-today.getDay()));
	return lastSunday;
}

function daysSinceDate(datein){
	var oneDay = 24*60*60*1000,
		now = new Date(),
		today = new Date(now.getFullYear(), now.getMonth(), now.getDate()),
		diffDays = Math.round(Math.abs((today.getTime() - datein.getTime())/(oneDay)));
	return diffDays;
}

function close(){
	cleanuptable = function(){
		for (var row = 0; row < myTable.length; row++) {
			if(myTable[row] === null){
				myTable[row] = [row];
			} else{
				myTable[row][0] = row;
			}
		};
	}();
	var logTable = JSON.stringify(myTable),
		logDate = startDate.getFullYear() + "-" + (startDate.getMonth()+1) + "-" + startDate.getDate();
	console.log(logDate);
	localStorage.setItem('Table', logTable);
	localStorage.setItem('StartDate', logDate);
	console.log("closed: " + logDate);
}


//TODO/////////////////////////////////////////////////////////////////////////////////////////////////////

function exportToCSV(){
	var CSVResult = "";
	for(var row = 0; row < myTable.length; row++){
		if(myTable[row] != null){
			for(var column = 0; column < myTable[row].length; column++){
				CSVResult = CSVResult + myTable[row][column] + ",";
			}
		}
		CSVResult = CSVResult + "\n";
	}
	var encodedUri = encodeURI(CSVResult);
	window.open(encodedUri);
}

function showTable(){
	console.log('Show table');
	var result = "";
	for(var row = 0, length1 = myTable.length; row < length1; row++){
		result += "<tr>"
		if(myTable[row] != null){
			for(var column = 0; column < myTable[row].length; column++){
				if(myTable[row][column] === null){
					myTable[row][column] = "00:00:00"
				}
				result += "<td>" + myTable[row][column] + "</td>"
			}
		}
		result += "</tr>"
	}
	document.getElementById('logTable').innerHTML =  result;
}