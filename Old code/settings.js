//Closure pattern
var app = function() {
	var x = 1,

	setSettings = function(){
		//code here
	};

	return{
		set: function(){
			setSettings();
		}
		get: function(setting_name){
			return x;
		}
		load: function(){

		}
		loadCSV: function(){

		}
		loadOld: function(){
			
		}
	}
}();