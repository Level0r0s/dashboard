Dashboard = {
	init : function (config){
		
		//document.body.innerHTML=config.html;
		
		for( var i=0;i<config.widgets.length;i++){
			//var div = document.getElementById(config.widgets[i].id);	
			var div = document.getElementById("widget"+i);
			var widget = new window[config.widgets[i].type](config.widgets[i]);
			div.appendChild(widget.getHtml());
			//widget.init();
			widget.updateData();
		}
		
		/*var elts = document.getElementsByClassName("widget"); 

		for(var i=0;i<elts.length;i++){
			
			var widgetClass = elts[i].getAttribute("data-widget");
			var settings = JSON.parse(widgetClass);
			var widget = new window[settings.widget](settings);
			elts[i].appendChild(widget.getHtml());

		}*/
	},
	
	load : function (url){
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4 && xhr.status == 200) {
				var config = JSON.parse(xhr.responseText);

				Dashboard.init(config);
			}
		}

		xhr.open("GET",url,true);
		xhr.send();
		
	}
}

/**Recup�ration des param�tres de l'url**/

//Dashboard.load(window.location.search.split("=")[1]);





