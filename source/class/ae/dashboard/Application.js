/* ************************************************************************

   Copyright:

   License:

   Authors:

 ************************************************************************ */

/* ************************************************************************


 ************************************************************************ */

/**
 * This is the main application class of your custom application "dashboard"
 *
 * @asset(ae/dashboard/*)
 */
qx.Class.define("ae.dashboard.Application", {
	extend : qx.application.Inline,

	/*
	 *****************************************************************************
	   MEMBERS
	 *****************************************************************************
	 */

	members : {
		/**
		 * This method contains the initial application code and gets called 
		 * during startup of the application
		 * 
		 * @lint ignoreDeprecated(alert)
		 */
		main : function() {
			// Call super class
			this.base(arguments);

			qx.theme.manager.Meta.getInstance().setTheme(qx.theme.Indigo);
			
			// Enable logging in debug variant
			if (qx.core.Environment.get("qx.debug")) {
				// support native logging capabilities, e.g. Firebug for Firefox
				qx.log.appender.Native;
				// support additional cross-browser console. Press F7 to toggle visibility
				qx.log.appender.Console;
			}

			var htmlElement = document.getElementById("dashboard");

			var inline = new qx.ui.root.Inline(htmlElement, true, true).set({
				allowStretchY: true,
				allowShrinkY: true,
				allowGrowY: true,
				backgroundColor:null
			});

			var scroll = new qx.ui.container.Scroll();
			
			var container = new qx.ui.container.Composite();
			var gridlayout = new qx.ui.layout.Grid();

			// use VBox layout instead of basic
			container.setLayout(gridlayout);

			inline.setLayout(new qx.ui.layout.VBox());
			inline.add(scroll,{flex:1})
			scroll.add(container);			
			
			var req = new qx.io.request.Xhr(window.location.search.split("=")[1]);
            req.addListener("success", function (e) {
            	
            	
            	var config = JSON.parse(e.getTarget().getResponse());
            	window.dsconfig=config;
            	
            	container.setPadding(config.layout.ySpacing,config.layout.xSpacing,config.layout.ySpacing,config.layout.xSpacing);
            	gridlayout.setSpacingX(config.layout.xSpacing);
            	gridlayout.setSpacingY(config.layout.ySpacing);
            	
            	for(var i=0;i<config.widgets.length;i++){
            		
            		var wgt = window[config.widgets[i].type];

            		var widget = new qx.ui.embed.Html(wgt.html).set({
            			//height:150
            		});
    				
    				container.add(widget, {
    					row : config.widgets[i].position.r,
    					column : config.widgets[i].position.c,
    					colSpan : config.widgets[i].position.w,
    					rowSpan : config.widgets[i].position.h
    				});
    				qx.ui.core.queue.Manager.flush(); 
    				
    				//widget.getContentElement().getDomElement().id="widget"+i;
    				//wgt.id="widget"+i;
    				if(wgt.init){
    					wgt.init(widget.getContentElement().getDomElement(),config.widgets[i]);
    				}
    				
    				if(config.widgets[i].datasource){
    					var dataSource = new window[config.widgets[i].datasource.name](config.widgets[i]);
        				dataSource.getData(widget.getContentElement().getDomElement(),config.widgets[i],wgt.setData);
    				}
    				//wgt.updateData();
    			}
    			
    			switch(config.layout.flex){
    				case "both":
    					for(var i=0;i<gridlayout.getRowCount();i++){
    						gridlayout.setRowFlex(i, 1);
    	    			}
    					for(var i=0;i<gridlayout.getColumnCount();i++){
    						gridlayout.setColumnFlex(i, 1);
    	    			}
    					break;
    				case "horizontal" :
    					for(var i=0;i<gridlayout.getColumnCount();i++){
    						gridlayout.setColumnFlex(i, 1);
    	    			}
    					for(var i=0;i<gridlayout.getRowCount();i++){
    						gridlayout.setRowHeight(i,config.layout.rowsHeight[i]);
    	    			}
    					break;
    				case "vertical" :
    					for(var i=0;i<gridlayout.getRowCount();i++){
    						gridlayout.setRowFlex(i, 1);
    	    			}
    					for(var i=0;i<gridlayout.getColumnCount();i++){
    						gridlayout.setColumnWidth(i,config.layout.columnsWidth[i]);
    	    			}
    					break;
    				case "none" :
    					for(var i=0;i<gridlayout.getRowCount();i++){
    						gridlayout.setRowHeight(i,config.layout.rowsHeight[i]);
    	    			}
    					for(var i=0;i<gridlayout.getColumnCount();i++){
    						gridlayout.setColumnWidth(i,config.layout.columnsWidth[i]);
    	    			}
    				
    			}
            },this);
            req.send();			
		}
	}
});
