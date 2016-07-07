//Common function for single value widgets
function commonSVW(elt,settings,data){
	if(settings.title!=null){
		elt.getElementsByClassName("chart-title")[0].innerHTML = "<i class='"+settings.icon+"'></i> "+settings.title;
	}else{
		elt.getElementsByClassName("chart-title")[0].innerHTML = "<i class='"+settings.icon+"'></i> "+data.title;
	}
	if(settings.dateFormat!=null){
		elt.getElementsByClassName("chart-time")[0].innerHTML = moment(data.date).format(settings.dateFormat);
	}else{
		elt.getElementsByClassName("chart-time")[0].innerHTML = moment(data.date).format("DD-MM-YYYY HH:mm:ss");
	}
	if(settings.footer!=null){
		elt.getElementsByClassName("chart-notes")[0].innerHTML = settings.footer;
	}
	var col = elt.getElementsByClassName("cell")[0];
	col.style.color=settings.color;
	col.style.backgroundColor=settings.bgcolor;
}

//SINGLE VALUE WIDGET
var SingleValueWidget= {
	html : "<div class='chart-wrapper'><div class='chart-title'></div><div class='cell'><div class='chart-stage'></div><div class='chart-time'></div></div><div class='chart-notes right'></div></div>",
	init : function(elt,settings){
		elt.getElementsByClassName("chart-title")[0].innerHTML = "<i class='"+settings.icon+"'></i> "+settings.title;
	},
	setData : function(elt,settings,data){
		commonSVW(elt,settings,data);
		
		elt.getElementsByClassName("chart-stage")[0].innerHTML = data.value.toFixed(settings.digit)+data.unit;
		
	}
}

// WIND SPEED WIDGET
var WindSpeedWidget = {
	html : "<div class='chart-wrapper'><div class='chart-title'></div><div class='cell'><div class='chart-stage'></div><div class='chart-time'></div></div><div class='chart-notes right'> Notes about this chart</div></div>",
	setData : function(elt,settings,data) {
		commonSVW(elt,settings,data);
		
		elt.getElementsByClassName("chart-title")[0].innerHTML = "<i class='wi wi-wind-beaufort-0'></i> Wind Speed";
		var res = (data.value*3.6).toFixed(settings.digit);
		elt.getElementsByClassName("chart-stage")[0].innerHTML = "<div>"+data.value.toFixed(settings.digit)+" "+data.unit+"</div><div style='font-size:15px'>"+res+" km/h</div>";
	}
}

// WIND DIRECTION WIDGET
var WindDirectionWidget = {
	html : "<div class='chart-wrapper'><div class='chart-title'></div><div class='cell'><div class='wd'><div class='chart-stage'></div><div class='chart-time'></div></div></div><div class='chart-notes right'> Notes about this chart</div></div>",
	setData : function(elt,settings,data) {
		commonSVW(elt,settings,data);
		
		elt.getElementsByClassName("chart-title")[0].innerHTML = "<i class='wi wi-wind-direction'></i> Wind Direction";
		var degreLogo = Math.round(data.value);
		var logoClass = "wi wi-wind from-"+degreLogo+"-deg";
		elt.getElementsByClassName("chart-stage")[0].innerHTML = "<i style='font-size:65px; float:left; position:relative' class='"+logoClass+"'></i><div>"+data.value.toFixed(settings.digit)+" "+data.unit+"</div>";
	}
}

// TIME WIDGET
var TimeWidget = {
	html : "<div class='chart-wrapper'><div class='chart-title'></div><div class='cell'><div class='chart-stage'></div><div class='chart-time'></div></div><div class='chart-notes'> Notes about this chart</div></div>",
	setData : function(elt,settings,data) {
		commonSVW(elt,settings,data);
		
		elt.getElementsByClassName("chart-title")[0].innerHTML = "<i class='wi wi-time-12'></i> Time";
		elt.getElementsByClassName("chart-stage")[0].innerHTML = "<div>"+moment().format("DD-MM-YYYY HH:mm:ss")+"</div>";
		setInterval(function(){elt.getElementsByClassName("chart-stage")[0].innerHTML = moment().format("DD-MM-YYYY HH:mm:ss");},1000);
	}
}

//CHART WIDGET
var ChartWidget= {
	html : "<div class='chart-wrapper'><div class='chart-title'></div><div class='chart-stage' style='flex:1'></div><div class='chart-notes'> Notes about this chart</div></div>",
	init : function(elt,settings){
		elt.getElementsByClassName("chart-title")[0].innerHTML = "<i class='"+settings.icon+"'></i> "+settings.title;
		//Plotly.newPlot(elt.getElementsByClassName("chart-stage")[0],settings.config.data,settings.config.layout,{displayModeBar: false});
		Plotly.load(elt.getElementsByClassName("chart-stage")[0],settings.url);
	},	
	setData : function(elt,settings,data){
		
		var chartElt = elt.getElementsByClassName("chart-stage")[0];
		
		Plotly.Plots.resize(chartElt);
		
		if(data!=null){
			//data.type et data.unit

			var update={};
			var series = chartElt.data;
			var allyaxes=[];
			for (var i=0;i<series.length;i++){
				if (series[i].yaxis!=null){
					if (series[i].yaxis=="y1"){
						allyaxes.push("y");
					} else {
						allyaxes.push(series[i].yaxis);
					}
				}else{
					allyaxes.push("y");
				}
				if (chartElt.data[i].name==null || chartElt.data[i].name==""){
					update.name=settings.datasource.data[i].name+" ("+settings.datasource.data[i].aggregator+")"; //EST6000_TEM_01median
					Plotly.restyle(chartElt,update,i);
				}
				
			}
			
			var yaxes=[];
			for(var i=0;i<allyaxes.length;i++){
				if(yaxes.indexOf(allyaxes[i])==-1){
					if (chartElt.layout[allyaxes[i].substring(0,1)+"axis"+allyaxes[i].split("y")[1]].title==null){
						update[allyaxes[i].substring(0,1)+"axis"+allyaxes[i].split("y")[1]+".title"]=data.type[i]+" ("+data.unit[i]+")"; //yaxis2.ticksuffix
					}
					if (chartElt.layout[allyaxes[i].substring(0,1)+"axis"+allyaxes[i].split("y")[1]].ticksuffix==null){
						update[allyaxes[i].substring(0,1)+"axis"+allyaxes[i].split("y")[1]+".ticksuffix"]=data.unit[i]; //yaxis2.ticksuffix
					}
					yaxes.push(allyaxes[i]);
				}
			}
			Plotly.relayout(chartElt, update);
		}
	}
}


//WIND CHART WIDGET
var WindChartWidget= {
	html : "<div class='chart-wrapper'><div class='chart-title'></div><div class='chart-stage' style='flex:1'></div><div class='chart-notes'> Notes about this chart</div></div>",
	init : function(elt,settings){
		elt.getElementsByClassName("chart-title")[0].innerHTML = "<i class='"+settings.icon+"'></i> "+settings.title;
		Plotly.load(elt.getElementsByClassName("chart-stage")[0],settings.url);
		//Plotly.newPlot(elt.getElementsByClassName("chart-stage")[0],settings.config.data,settings.config.layout,{displayModeBar: false});
	},	
	setData : function(elt,settings,data){
		var chartElt = elt.getElementsByClassName("chart-stage")[0];
		
		var lines = data.split("\n");
		var maxspeed = 10;
		var intervals = 5;

		var data = [];
		for (var i = 0; i < intervals; i++) {
			//N, NE, E, SE, S, SW, W, NW
			data.push([ [], [], [], [], [], [], [], [] ]);
		}
		for (var i = 1; i < lines.length; i++) {
			var val = lines[i].split(";");
			var speed = parseFloat(val[1]);
			var direction = parseFloat(val[2]);
			for (var j = 0; j < intervals; j++) {
				if (speed < maxspeed / intervals * (j + 1)) {
					switch (true) {
					//N
					case (direction < 22.5):
						data[j][0].push(speed);
						break;
					//NE
					case (direction < 47.5):
						data[j][1].push(speed);
						break;
					//E
					case (direction < 92.5):
						data[j][2].push(speed);
						break;
					//SE
					case (direction < 137.5):
						data[j][3].push(speed);
						break;
					//S
					case (direction < 182.5):
						data[j][4].push(speed);
						break;
					//SW
					case (direction < 227.5):
						data[j][5].push(speed);
						break;
					//W
					case (direction < 272.5):
						data[j][6].push(speed);
						break;
					//NW
					case (direction < 317.5):
						data[j][7].push(speed);
						break;
					//N
					default:
						data[j][0].push(speed);
						break;
					}
					break;
				}
			}

		}

		var traces = chartElt.data;
		var tr = [ [ 0, 0, 0, 0, 0, 0, 0, 0 ] ];
		for (var i = 0; i < intervals; i++) {
			var r = [];
			for (var j = 0; j < 8; j++) {
				r.push(data[i][j].length * 100
						/ (lines.length - 1) + tr[i][j]);
			}
			tr.push(r);
			//console.log(traces.length - i - 1);
			traces[traces.length - i - 1].r = r;

		}
		Plotly.plot(chartElt, traces, chartElt.layout);
		Plotly.Plots.resize(chartElt);
	}
}


//Contour Plots WIDGET
var ContourPlotWidget= {
	html : "<div class='chart-wrapper'><div class='chart-title'></div><div class='chart-stage' style='flex:1'></div><div class='chart-notes'> Notes about this chart</div></div>",
	init : function(elt,settings){
		elt.getElementsByClassName("chart-title")[0].innerHTML = "<i class='"+settings.icon+"'></i> "+settings.title;
		Plotly.load(elt.getElementsByClassName("chart-stage")[0],settings.url);
		//Plotly.newPlot(elt.getElementsByClassName("chart-stage")[0],settings.config.data,settings.config.layout,{displayModeBar: false});
	},	
	setData : function(elt,settings,data){
		var chartElt = elt.getElementsByClassName("chart-stage")[0];

		var response = JSON.parse(data);
		var result = response.features[0].properties;

		var xvalues = [];
		var yvalues = [];
		var zvalues = [];
		var mpname = [];

		for (i=0;i<response.features.length;i++){
			xvalues[i]=response.features[i].properties.x;
			yvalues[i]=response.features[i].properties.y;
			zvalues[i]=response.features[i].properties.lastvalue;
			mpname[i]=response.features[i].properties.mpname+' ('+zvalues[i]+')';	
		}
		
		var power=1;
		var smoothing=0;
		var xmin=Math.min.apply(null, xvalues);
		var ymin=Math.min.apply(null, yvalues);
		var xmax=Math.max.apply(null, xvalues);
		var ymax=Math.max.apply(null, yvalues);		
					
		var xcellcount = 10;
		var ycellcount = 10;
		var text = [mpname];
		var grid = {
			xcellcount:xcellcount,
			ycellcount:ycellcount,
			x0:xmin-(xmax-xmin)*0.1,
			y0:ymin-(ymax-ymin)*0.1,
			xcellsize:(xmax-xmin)*1.2/xcellcount,
			ycellsize:(ymax-ymin)*1.2/ycellcount,
			getXs:function(){
				var xs=[];
				for(var i=0;i<this.xcellcount;i++){
					xs.push(this.x0+i*this.xcellsize);
				}
				return xs;
			},
			getYs:function(){
				var ys=[];
				for(var i=0;i<this.ycellcount;i++){
					ys.push(this.y0+i*this.ycellsize);
				}
				return ys;
			}
		};
		
		var alldata = [xvalues,yvalues,zvalues];
		var idw = spint.idw(alldata,grid,power,smoothing);	
		
		var dt = chartElt.data;
		var lo = chartElt.layout;
		dt[0].z=idw;
		dt[0].x=grid.getXs(); 
		dt[0].y=grid.getYs();
		dt[1].x=xvalues; 
		dt[1].y=yvalues;
		dt[1].text=mpname;

		lo.height=lo.width*((ymax-ymin)/(xmax-xmin));
		
		var traces = {
			x: xvalues,
			y: yvalues,
			mode: 'markers+text',
			type: 'scatter',
			text: mpname,
			textposition: 'top center',
			textfont: {color:  'lime'}
		};
		Plotly.plot(chartElt, dt, lo);
		Plotly.Plots.resize(chartElt);
	}
}



//HTML WIDGET
var HTMLWidget= {
	html : "<div class='chart-wrapper'><div class='chart-title'></div><div class='cell'><div class='chart-html'></div></div><div class='chart-notes'> Notes about this chart</div></div>",
	init : function(elt,settings){
		elt.getElementsByClassName("chart-title")[0].innerHTML = settings.title;
		elt.getElementsByClassName("chart-html")[0].innerHTML = settings.HTML;
	},
	setData : function(elt,settings,data) {
	}
}



// SVG WIDGET
var SVGWidget = {
	html : "<div class='chart-wrapper'><div class='chart-title'></div><div class='chart-stage' style='flex:1'><div class='chart-html'></div></div><div class='chart-notes'> Notes about this chart</div></div>",
	init : function(elt,settings) {
		elt.getElementsByClassName("chart-title")[0].innerHTML = settings.title;
		
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4 && xhr.status == 200) {
				var response = xhr.responseText;
				elt.getElementsByClassName("chart-html")[0].innerHTML=response;
				
				var textareas = elt.getElementsByClassName("nova-svg");
				for (var i=0;i<textareas.length;i++){
					
					(function (index){
						var xhr2 = new XMLHttpRequest();
						var value_type = textareas[index].getAttribute("data-attribute");
						var sensor = textareas[index].getAttribute("data-name");
						xhr2.onreadystatechange=function(){
							if (xhr2.readyState==4 && xhr2.status==200)
							{
								var properties2 = JSON.parse(xhr2.responseText).features[0].properties;
								if (value_type=="lastvalue")
								{
									textareas[index].textContent = properties2.lastvalue+" "+properties2.unit;
								}else if (value_type=="lastdate"){
									textareas[index].textContent = properties2.lastdate;
								}
							}
						}
						xhr2.open("GET",dsconfig.global.wfsurl+"'" + sensor + "'",true);
						xhr2.send();
					})(i)

				}
				
			}
		}

		xhr.open("GET",settings.url,true);
		xhr.send();
	}
}