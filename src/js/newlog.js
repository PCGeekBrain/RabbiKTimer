
var newLog = function(){
	//variables
	var dateparts = [2015, 1, 1],
		stopStorage = false,
		shown = false,
		header = document.getElementById('logHeader'),
		table = document.getElementById('logTable'),
		dateDisplay = document.getElementById('Date'),
		tableSize, myTable, startdate, datestring;

	var logTotal = function(seconds){
		console.log("Logging: " + secondsToString(seconds)); //log out the time sent in
		insertInTable(seconds);
		saveData();
		console.log('Logging Compleate');
	},
	insertInTable = function(secondsToInsert){
		var location = new Date(),
			diff = daysSince(startDate),
			row = 1,
			column = 1,
			seconds = secondsToInsert,
			oldData, total;
		while(diff >= 7){
			row = row + 1;
			diff = diff - 7;
		}; 
		column = diff + 1;
		console.log("Logging: location = " + row +" : "+ column);

		if(myTable[row] === undefined){
			console.log('Logging: Empty row');
			myTable[row] = []
		}
		oldData = myTable[row][column];
		if(oldData === undefined){
			total = secondsToString(seconds);
			console.log("Logging: Empty Cell");
		} else{
			total = secondsToString(stringToSeconds(oldData) + seconds);
		}
		console.log("Logging: total = " + total);
		myTable[row][column] = total;
	},
	saveData = function(){
		showtable();
		var logTable = JSON.stringify(myTable),
			logDate = startDate.getFullYear() + "-" + startDate.getMonth() + "-" + startDate.getDate();
		console.log("LogTable: " + logTable);
		console.log("LogDate: " + logDate);
		if(!stopStorage){
			localStorage.setItem('Table', logTable);
			localStorage.setItem('StartDate', logDate);
		}
	},
	showtable = function(){
		var result = "";
		tableSize = 34;
		for(var row = 0; row < myTable.length; row += 1){
			result += "<tr>";
			if(myTable[row] === undefined || myTable[row] === null){
				myTable[row] = [];
			}
			for(var column = 0; column < 8; column += 1){
				if(column === 0){
					myTable[row][0] = row;
				}
				else {
					if(myTable[row][column] === undefined || myTable[row][column] === null){
						myTable[row][column] = "00:00:00";
					}
				}
				result += "<td>" + myTable[row][column] + "</td>";
			}
			if(tableSize < 390){
				tableSize += 39 //add the height to the total to display (more then 10 rows is overflow)
			}
			result += "</tr>";
		}
		return result;
	},
	secondsToString = function(fromseconds){
		if(isNaN(seconds)){seconds = 00;}//GET LOST NAN!!!
		var result = "00:00:00",
			seconds = fromseconds,
			minutes = 00,
			hours = 00;
		//Go through the seconds and remove the minutes and hours
		if(seconds >= 60){
			while(seconds >= 60){
				seconds = seconds - 60;
				minutes = minutes + 1;
			}
			if(minutes >= 60){
				while(minutes >= 60){
					minutes = minutes - 60;
					hours = hours + 1;
				}
			}
		}
		result = newTimer.cleanUpNumber(hours) + ":" + newTimer.cleanUpNumber(minutes) + ":" + newTimer.cleanUpNumber(seconds);
		return result;
	},
	stringToSeconds = function(string){//errors return 0
		var numbers,
			timestring = string;
			result = 0;
		if (typeof timestring === 'string' && timestring.indexOf(":") > -1){
			numbers = timestring.split(":");
			if (numbers.length === 3){
				result = (parseInt(numbers[0], 10)*60+parseInt(numbers[1], 10)*60+parseInt(numbers[2], 10));
			}
		}
		return result;
	},
	daysSince = function(fromdate){
		var oneDay = 86400000, //24*60*60*1000 / 86,400,000
			now = new Date(),
			today = new Date(now.getFullYear(), now.getMonth(), now.getDate()),
			diffDays = Math.round(Math.abs((today.getTime() - fromdate.getTime())/(oneDay)));
		console.log("Days since "+fromdate+":"+ diffDays);
		return diffDays;
	},
	getLastSunday = function(){
		var now = new Date(),
			today = new Date(now.getFullYear(), now.getMonth(), now.getDate()),
			lastSunday = new Date(today.setDate(today.getDate() - today.getDay()));
		return lastSunday;
	},
	makeStartDate = function(){
		return startDate.getDate() + "/" + (startDate.getMonth() + 1) + "/" + startDate.getFullYear();
	}
	makeCSV = function(){
		var returnCSV = "";
		showtable();
		for(var row = 0; row < myTable.length; row = row + 1){
			for(var column = 0; column < 8; column = column + 1){
				returnCSV = returnCSV + myTable[row][column] + ",";
			}
			returnCSV = returnCSV + "\n";
		}
		return returnCSV;
	};
	//Startup: load data
	if(localStorage.getItem('Table') === null){
		myTable = [[]] //[ * [ 0-7 ] ] or [weeks[days]]. so sunday is [x][1].
		myTable[0]=["","Sunday","Monday","Tuesday","Wendsday","Thursday","Friday","Shabbos"];
	} else {
		myTable = JSON.parse(localStorage.getItem('Table')) //[ * [ 0-7 ] ] or [weeks[days]]. so sunday is [x][1].
	};

	if(localStorage.getItem('StartDate') === null){
		startDate = getLastSunday();
		console.log("Getting last sunday for startDate: " + startDate);
	} else {
		//TODO strings cuase an issue on 2 digit months DOCUMENT
		datestring = localStorage.getItem('StartDate'),
		dateparts = datestring.split('-');
		for(var i = 0; i < dateparts.length; i +=1){
			dateparts[i] = parseInt(dateparts[i], 10)
		}
		startDate = new Date(dateparts[0], dateparts[1], dateparts[2]) //the start date (all the B.S. Above is to avoid strings);
	};

	return {
		getTable: function(){
			return myTable;
		},
		loadTable: function(){
			if(shown){
				header.innerHTML = 'Show log';
				table.parentNode.style.maxHeight = '0px';
				shown = false;
			} else{
				header.innerHTML = 'Hide log';
				dateDisplay.innerHTML = "Log starts from: " + makeStartDate();
				table.innerHTML = showtable();
				table.parentNode.style.maxHeight = (tableSize + "px");
				shown = true;
			}
		},
		logTotalTime: function(seconds){
			logTotal(seconds);
		},
		getStartDate: function(){
			return startDate;
		},
		downloadCSV: function(link){
			link.href = "data:text/csv; charset=utf-8," + encodeURIComponent(makeCSV() + "\n" + "Log starts:," + makeStartDate())
		},
		suspendStorage: function(){
			if(arguments[0] === false){
				stopStorage = false;
			} else{
				stopStorage = true;
			}
		}
	};
}();
