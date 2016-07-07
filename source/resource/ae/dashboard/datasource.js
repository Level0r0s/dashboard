/*function DataSource() {
	this.getData = function() {

	}
}*/

function LastValueDS(widget,settings,callback) {
	this.getData = function(widget,settings,callback) {
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4 && xhr.status == 200) {
				var response = JSON.parse(xhr.responseText);
				
				var result = response.features[0].properties;
				var data = {
					"title":result.mpname,
					"value":result.lastvalue,
					"date":result.lastdate,
					"unit":result.unit,
					"notes":null
				}
				
				var xhr2 = new XMLHttpRequest();
				xhr2.onreadystatechange=function(){
					if (xhr2.readyState==4 && xhr2.status==200)
					{
						var response = JSON.parse(xhr2.responseText);
						var value = response.queries[0].results[0].values[0][1];
						var date = response.queries[0].results[0].values[0][0];
						data.value=value;
						data.date = date;
						callback(widget,settings,data);
					}
				}
				xhr2.open("POST",dsconfig.global.dataurl,true);
				var query={
					"start_relative": {
						"value": "2",
						"unit": "days"
					  },
					"metrics":[
						{
							"name":settings.datasource.sensor,
							"order":"desc",
							"limit":1
						}
					 ]
				};
				xhr2.send(JSON.stringify(query));
				
			}
		}
		xhr.open("GET",dsconfig.global.wfsurl+"'"+ settings.datasource.sensor + "'",
						true);
		xhr.send();
	}
}

function ChartDS(widget,settings,callback) {
	this.getData = function(widget,settings,callback) {

		var p=0;
		var data= {
			unit:new Array(settings.datasource.data.length),
			type:new Array(settings.datasource.data.length)
		};
		for(var i=0;i<settings.datasource.data.length;i++){
			
			(function (index){
				var xhr = new XMLHttpRequest();
				xhr.onreadystatechange=function(){
					if (xhr.readyState==4 && xhr.status==200)
					{
						var response = JSON.parse(xhr.responseText);

						var result = response.features[0].properties;
						
						data.unit[index]=result.unit;
						data.type[index]=result.type;
						
						p = p+1;

						if(p==settings.datasource.data.length){
							callback(widget,settings,data);
						}
					}
				}

				xhr.open("GET",dsconfig.global.wfsurl+"'"+ settings.datasource.data[index].name + "'",true);
				xhr.send();
			})(i);
		}
		
	};
}


function SimpleChartDS(widget,settings,callback) {
	this.getData = function(widget,settings,callback) {
			
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange=function(){
			if (xhr.readyState==4 && xhr.status==200)
			{
				callback(widget, settings, xhr.responseText);
			}
		}

		xhr.open("GET",settings.datasource.url,true);
		xhr.send();
		
	};
}