/* Init stuff */

$.blockUI.defaults.message = '<div style="padding: 0px;"><img src="res/common/images/processing.gif" />';

Dashboards.blockUIwithDrag = function() {
  $.blockUI();
  var blockui = $("div.blockUI.blockMsg").attr('title','Click to unblock, drag to move');
  blockui.draggable({
    handle:"div.blockUI.blockMsg"
  });
  blockui.bind('click',function(){
    $.unblockUI();
  });

}

var mozilla = {};


mozilla.settings = {};

mozilla.settings.colors = {
    'orange': '#e67a1e',
    'blue': '#0095da',
    'darkblue': '#006091',
    'green': '#8dc63f',
    'gray': '#808285',
    'lightgray':'#CDD8DE'
}

mozilla.settings.dashboardLinks = {
    "Telemetry": "renderbalblablabalb"

};

mozilla.getActiveDashboard = function(param){
    return param;
};


/***************************************************************************
 *                          HEADER functions                               *
 ***************************************************************************/

mozilla.processDatePickerHeader = function(){
    var ph = $("#" + this.htmlObject + " input");
/*    var tmp = ph.val().replace('-','/','g').split('>');
    var start = new Date(tmp[0]),stop;
    
    if(tmp.length==2){
      stop = new Date(tmp[1]);
    }*/
    
    
    var value = ph.val().replace(/([0-9]{4}-[0-9]{2}-[0-9]{2})[^0-9]*([0-9]{4}-[0-9]{2}-[0-9]{2})/,'$1 to $2');
//     var value = start.getMonthName().slice(0,3) + ' ' + start.getDate();
//     if(typeof stop !== 'undefined'){
//       value +=' to ' + stop.getMonthName().slice(0,3) + ' ' + stop.getDate();
//     }

    
    ph.val( value ).width("100%");

};

mozilla.processSingleDatePickerHeader = function(){
    var ph = $("#" + this.htmlObject + " input");
	var value = ph.val() + " : previous 12 months";
	ph.val( value ).width("100%");
}

/***************************************************************************
 *                           TABLE functions                               *
 ***************************************************************************/

/* *** TABLE Draw callback *** */

mozilla.drawTable = function(averagePatches){
    var myself = this;
    //mozilla.formatNumberWithBars
    
    
    //split numbers comes before anything else!!!!!!!!!!

    if(typeof averagePatches !== 'undefined' && typeof dateParam !== 'undefined'){
     //mozilla.drawBubbles.call(this,averagePatches); 
    }

    //mozilla.drawArrows.apply(this);
    //mozilla.fillMonthHeaders.apply(this,[this.htmlObject]);
    //mozilla.drawRightBarText.apply(this);
    //mozilla.drawSparkline.call(this,mozilla.settings.colors.gray,"bar"); //draws sparkbar
    //mozilla.drawArrows.apply(this);
    //mozilla.drawAutoString.call(this,optionalSize)
};



/* TODO: make this function a generic thing (eg: classes and email) */
mozilla.drawCheck = function(htmlObject){

    var employees = $("#" + htmlObject + " td.employee:not(.processed)");

    if (employees.length > 0 ){
    // we need to draw it

        employees.each(function(){
            var ph = $(this);
            var w = ph.width();
            var h = ph.height();

            var value = ph.text();
            ph.empty();
            var user = $( ph.siblings()[0] ).text();
            var a = $('<a href="mailto:mozilla@webdetails.pt?subject=Community%20Metrics%20Dashboard%20Data%20Correction&body=User%20' + user + '%20is%20reported%20as%20' + (value == 'Y'? '' : 'NOT%20') + 'EMPLOYEE%20and%20I%20think%20this%20is%20wrong%20because%20..."></a>').appendTo(ph);

            var paper = Raphael(a[0], w, h);
            paper.rect( (w-10)/2, (h-10)/2, 10, 10).attr({stroke: '#4d4d4d'});    
            if (value == "Y") {
                var c = paper.path("M 12.94,21.25 C 11.05,18.66 11.2,16.25 9.7,14.64 C 8.2,13.06 10.06,13.34 10.48,13.6 C 13.943,15.906 13.114,22.358 15.75,14.24 C 17.506,8.016 21,3 21.707,2.0616 C 22.46,1.13 22.811,2.1486 22.049,3.27 C 18.69,8.78 17.98,12.14 15.561,20.34 C 15.257,21.37 13.775,22.39 12.94,21.24 L 12.939,21.245 z").attr({fill: "#3d3938", stroke: "none"});
                c.scale(0.65, 0.65);
                // moves the circle 'w/2' px to the right and 'h/2' up
                c.translate(w/2-16, -h/2+6);
            }

            ph.attr("title", "Is this information wrong? Click to let us know.");
        });

    }
    employees.addClass('processed');
 
};
 


/* TODO: add description to this function */
mozilla.drawMultiBars = function(colors){

  if(typeof colors === 'undefined' ){
    colors = ["#3d3938","#7b7978","#b7b6b6"];
  }
  
  var multibars = $("#" + this.htmlObject + " td.multibarchart:not(.processed)");
  if (multibars.length > 0 ){
      // Getting absolute max
      var tempMax = [];
      multibars.each(function(e){
        values = $(this).text().split(",");
        //values = [parseInt(values[0]),parseInt(values[1]),parseInt(values[2])];
        tempMax.push( pv.sum(values) );
      });
      var absMax = pv.max(tempMax);

      multibars.each(function(){

          var ph = $(this);
          var w = ph.width();
          var h = ph.height();

          values = ph.text().split(",");
          values = [parseInt(values[0]),parseInt(values[1]),parseInt(values[2])];
          ph.empty();

          var margin = 5;

          var xx = pv.Scale.linear(0, absMax).range(0, w);

          var paper = Raphael(this, w, h);

          var c = paper.set();
          c.push(

              // paper.rect(x, y, width, height);

              paper
                .rect(xx(0), 0+margin, xx(values[0])-xx(0), h-(margin*2))
                .attr({fill:colors[0]}) ,

              paper
                .rect(xx(values[0])-xx(0), 0+margin, xx(values[1]), h-(margin*2))
                .attr({fill:colors[1]}) ,

              paper
                .rect(xx(values[0])-xx(0)+xx(values[1]), 0+margin, xx(values[2]), h-(margin*2))
                .attr({fill:colors[2]})

          ).attr({title:'Patch:'+values[0]+'; Merge:'+values[1]+'; Backout:'+values[2], stroke:"none"});

    });

  }
  multibars.addClass('processed');
 
};
 


/* TODO: add description to this function */
mozilla.drawSparkbar = function(color){

  if(typeof color === 'undefined'){
    color = mozilla.settings.colors.gray;
  }
    
  var myself = this;
  var table = $("#" + myself.htmlObject + " table");
  
  // Format value
  
  /*  Alves: Commented this out. nth-child(1) ?? why?
  var cells = table.find("tbody tr td:nth-child(1)");
  $.each(cells, function(i,d){
    var value = $(d).text();
    var value2 = value.indexOf(',') == -1 ? mozilla.addCommas(value) : value;
    $(d).html( '<div class="value">' + value2 + '</div>' );
  });
  */
  
  
  // Sparkbars
  cells = table.find("tbody td.sparkbar:not(.processed)");
  cells.sparkline('html', {
    type : "bar",
    barColor : color,
    barWidth : 5, 
    barSpacing : 1
  });
  cells.addClass('processed');
  
};



/* Draws up and down arrows */
mozilla.drawArrows = function(textFormat){

  var myself = this;
  var table = $("#" + myself.htmlObject + " table");
  
  // Growth arrows
  var cells = table.find("tbody td.growth");
  $.each(cells, function(i,d){
    var obj = $(d);
    var value = obj.text();    
    if( value.charAt(0) == '-'){
      obj.addClass("negative");
    }else{
      obj.addClass("positive");
    }
    
    value = parseFloat(value)
    if(isNaN(value) || value == 0){
      obj.addClass("stable");
      //TODO: choose one simbol to represent 'NaN'
    }
    if(typeof textFormat === 'undefined'){
      textFormat = "%0.1f%%";
    }
    obj.text(sprintf(textFormat,value));
  });
  
};


/* Draw bubbles: 
 * maximum -> max integer for the bubble max radius, 
 * color -> color code to use */
mozilla.drawBubbles = function(maximum,color){
    
    var bubbles = $("#" + this.htmlObject).find("td.bubblechart:not(.processed)");
    if (bubbles.length > 0 ){
      // we need to draw it.

      // Getting absolute max
      var absMax=0;
      bubbles.each(function(i,vv){
          var v = Math.abs($(this).text());
          if(v>absMax){
            absMax = v;
          }
      });

      var w = 20,
          h = 20,
          maxRadius = pv.min([w,h]) / 2,
          margin = 2;
	  if(typeof color !== 'string'){
	    color = mozilla.settings.colors.gray;  
	  }
          

      var xx = pv.Scale.linear(1, Math.sqrt(maximum) ).range(1, maxRadius-margin);

      bubbles.each(function(){
        var ph = $(this);

        var value = parseFloat(ph.text());
        if(value>maximum){
          value = maximum;
        }
        ph.empty();

        // Min radius = 1
        var paper = Raphael(this, w, h);
        // Creates circle at x = 'w/2', y = 'h/2', with radius 'xx(sqrt(value))'
        var circle = paper.circle(w/2, h/2, (value == 0 ? 0 :  xx(Math.sqrt(value)) ));

        circle.attr({
          fill: color,
          stroke: null
        });

        ph.attr('title', value );
        
      });

    }
    bubbles.addClass('processed');

};



/* Draws right bars with text. See drawBarText for details */
mozilla.drawRightBarText = function (textFormat, className,maximum,colours){
  mozilla.drawBarText.call(this,textFormat,"right",className,maximum,colours);
}

/* Draws left bars with text. See drawBarText for details */
mozilla.drawLeftBarText = function (textFormat, className,maximum,colours){
  mozilla.drawBarText.call(this,textFormat,"left",className,maximum,colours);
}
/* Replaces "className" td cells with a raphael bar and a text *
 * the bar values can only be positive
 ** textFormat - printf style ("%0.2f")
 ** orientation - left, right, from where the bars grow
 ** className - default 'tableBar'
 ** maximum - define optional maximum (like 100, for % bars)                        
 */
mozilla.drawBarText = function (textFormat, orientation, className,maximum,colors){
      
    if(typeof className === 'undefined'){
      className = 'tableBar';
    }
    if(typeof orientation === 'undefined'){
      orientation = "right";
    }
    if(typeof colors === 'undefined'){
      colors = ["#D7D6D6","#B1BABD"];
    }
    
  
    var myself = this;
    var sep = ',';
    myself.maxCols = {};
    
    //see which columns have the class we want
    var cols = $("#"+myself.htmlObject + " th");    
    var colIdxs = [];
    $.each(cols,function(i,val){        
      if($(val).attr("class").search(className)>-1){
        colIdxs.push(i);
      };
    });
    //calculate the maximum per column
    if(colIdxs.length > 0){
      $.each(colIdxs,function(i,val){
        myself.maxCols[val]= mozilla.getMaximumFromColumn.call(myself,val,sep);

        //select the tds for that column
        var bars = $("#"+myself.htmlObject + " td." +className+".column"+val+":not(.processed)");
        if(bars.length > 0){
          //calculate maximum
          var rgabsMax= maximum || myself.maxCols[val];
          
          //loop among the bars
          bars.each(function(){
            var cell = this;
            var ph = $(cell);
            
            var wtmp = ph.width();
            var wwtmp = mozilla.getWidthFromHeader.call(myself,val);
                        
            if(typeof wwtmp !== 'undefined' ){
              wtmp = wtmp>wwtmp?wwtmp:wtmp;
            }              
            ph.width();
            //var htmp = ph.height();
            var htmp = 16;  /* Fixed bar height (16px) */            
            var ref = orientation==='right'?0:rgabsMax;
            var values = ph.text().split(sep);
            ph.empty();            
            var paper = Raphael(cell, wtmp, htmp);
            var xx = pv.Scale.linear(0,rgabsMax).range(0,wtmp-5);
            
            $.each(values,function(vidx,value){
              
              var numericalValue = parseFloat(value);
              
              if(typeof textFormat === 'undefined'){
                value = numericalValue+'';          
              }
              else if(textFormat.toLowerCase() === 'notext'){
                value = '';
              }
              else{
                value = sprintf(textFormat,numericalValue);
              }
              
              if(!isNaN(numericalValue) && numericalValue>0){
                                            
                var leftVal=ref, rightVal=numericalValue;
                
                if(leftVal>rightVal){
                  var swap = rightVal;
                  rightVal = leftVal;
                  leftVal = swap;
                }
                var c,text;

                if(orientation.toLowerCase() === 'right'){
                  c = paper.rect(xx(leftVal), 0, xx(rightVal), htmp, 0);
                }
                else{
                  c = paper.rect(xx(rightVal-leftVal), 0, xx(leftVal), htmp, 0);
                }
                text = paper.text(0, htmp/2, value );            

                c.attr({
                  fill: colors[vidx%colors.length],
                  stroke: "none",
                  value: value,
                  title: value
                });

                text.attr({
                  fill: "#283235",
                  'font-family': "Trebuchet MS",
                  'font-size': 10,
                  'font-weight': "normal",
                  'text-anchor': "start"
                });
                //reference now holds the previous values for the next bars
                if(orientation === 'right'){
                  ref+=numericalValue;
                }
                else{
                  ref-=numericalValue;
                }                
              }
              
            });
            
          });
          
        }
        bars.addClass('processed');
        
      });
    }
    

};


/* *************************************************************************************** */

mozilla.drawDetailsBarText = function (textFormat, orientation, className,maximum){
    
    if(typeof className === 'undefined'){
      className = 'tableBar';
    }
    if(typeof orientation === 'undefined'){
      orientation = "right";
    }
  
    var myself = this;
    myself.maxCols = {};
    
    //see which columns have the class we want
    var cols = $("#"+myself.htmlObject + " th");    
    var colIdxs = [];
    $.each(cols,function(i,val){        
      if($(val).attr("class").search(className)>-1){
        colIdxs.push(i);
      };
    });
    //calculate the maximum per column
    if(colIdxs.length > 0){
      $.each(colIdxs,function(i,val){
        myself.maxCols[val]= mozilla.getMaximumFromColumn.call(myself,val);

        //select the tds for that column
        var bars = $("#"+myself.htmlObject + " td." +className+".column"+val+":not(.processed)");
        if(bars.length > 0){
          //calculate maximum
          var rgabsMax= maximum?maximum:myself.maxCols[1];
          
          //loop among the bars
          bars.each(function(){
            var ph = $(this);
            //var wtmp = ph.width();
            //var htmp = ph.height();
			var wtmp = 50;
            var htmp = 16;  /* Fixed bar height (16px) */
            var value,numericalValue = parseFloat(ph.text());
            
            if(typeof textFormat === 'undefined'){
              value = numericalValue+'';          
            }
            else{
              value = sprintf(textFormat,numericalValue);
            }
            
            ph.empty();
            if(!isNaN(numericalValue) && numericalValue>0){
                          
              var paper = Raphael(this, wtmp, htmp);
              var xx = pv.Scale.linear(0,rgabsMax).range(0,wtmp-5);
              var ref = orientation==='right'?0:rgabsMax;
              
              var leftVal=ref, rightVal=numericalValue;
              if(leftVal>rightVal){
                leftVal = numericalValue;
                rightVal = ref;
              }
              var c,text;

              if(orientation.toLowerCase() === 'right'){
                c = paper.rect(xx(leftVal), 0, xx(rightVal) - xx(leftVal), htmp, 0);
                text = paper.text(0, htmp/2, value );                
              }
              else{
                c = paper.rect(xx(rightVal) - xx(leftVal), 0, xx(leftVal), htmp, 0);
                text = paper.text(0, htmp/2, value );            
              }

              c.attr({
                fill: "#D7D6D6",
                stroke: "none",
                value: value,
                title: value
              });

              text.attr({
                fill: "#283235",
                'font-family': "Trebuchet MS",
                'font-size': 10,
                'font-weight': "normal",
                'text-anchor': "start"
              });
            }
          });
          
        }
        bars.addClass('processed');
        
      });
    }
    

};

/* *************************************************************************************** */


/* Changes the content of a cell by setting the "maxSize" nr of chars. On mouseover, the full value is displayed */
mozilla.drawAutoString = function(maxSize,cssclass){
  
  var  myself = this;
  
  if(typeof cssclass === 'undefined'){
    cssclass = 'autoString';
  }
  var tds = $("#" + this.htmlObject + " td." + cssclass + ":not(."+cssclass+"Processed)");
  tds.each(function(){

    var t = $(this);
    var value = t.text();
    
    var classes = [];
    $(t).each(function() {
        $($(this).attr('class').split(' ')).each(function() { 
            if (this !== '') {
                classes.push(this);
            }    
        });
    });

    if(typeof maxSize === 'undefined' && myself.chartDefinition.colWidths.length > 0){
      var columnIndex = mozilla.getColumnIndex(classes[0]);
      var columnWidth = parseInt(myself.chartDefinition.colWidths[columnIndex].substr(0,myself.chartDefinition.colWidths[columnIndex].length-2));
      
      if($(t).parents("tbody").length !== 0) //check if is the header, needs to be changed
          maxSize = Math.ceil((columnWidth - 25)/5);
      else
          maxSize = Math.ceil((columnWidth - 15)/5);
      
    }
  
    mozilla.setItemText(t, value, maxSize);

  });
  
  tds.addClass(cssclass + "Processed");
  
  
};


/* TODO: add description to this function */
mozilla.processTableLegend = function(colors) {
  if(typeof colors === 'undefined'){
    colors = ["#E25C15","#00ABE8","#7A7978","#B6B5B5","#2B2725"];
  }
  var tds = $('#'+ this.htmlObject + " td.legend:not(.processed)");
  $.each(tds,function(i){
    var a = $('<div></div>');
    a.addClass("legendLine");
    a.css("border-color",colors[i%colors.length]);
    a.appendTo($(this));
  })  
  
  tds.addClass("processed");
  
};


/*Calculates the max value for a given table column*/
mozilla.getMaximumFromColumn = function(idx,sep){
  if(typeof sep === 'undefined'){
    sep = ',';
  }
  var max;
  var resultset = this.queryState.lastResults().resultset;
  if(resultset.length > 0){
    $.each(resultset,function(i,v){
      var val = v[idx];
      if(typeof val === 'string'){
        val = pv.sum(val.split(sep),function(d){return parseFloat(d)});        
      }
      
      if(!isNaN(val)){
        if(!max){
          max = val;
        }
        if(val>max){
          max = val;
        }
      }      
    });
  }
  return max;
  
};


/* extracts the width set manually on the table headers
 * only works with "px", for the moment*/
mozilla.getWidthFromHeader = function(idx){
  var myself = this, w;
  var styles = $("#" + this.htmlObject + " th.column" + idx).attr("style").split(';');
  $.each(styles,function(i,val){
    if(val.search('width:')>-1){
      w = parseFloat((val.split('width:')[1]).split("px")[0]);
    }    
  });
  return w;
}


//get column index from classList info
mozilla.getColumnIndex = function(columnName){
  var index = 0;
  
  var stringNumber = columnName.substr(6, columnName.length-6);
  
  index = parseInt(stringNumber);
  
  return index;
};


/* TODO: add description to this function */
mozilla.setItemText= function(item,text,nchars){
    var astr = text;
    if(text.length > nchars){
      astr = text.slice(0,nchars-3);
      astr = $.trim(astr)+'...';
      item.attr('title',text);
    }
    item.text(astr);

};


/* get month number from datasource and map to short month name */
mozilla.fillMonthHeaders = function() {

  var headers = $("#" + this.htmlObject + " th");

  var ch = this.chartDefinition.colHeaders;

  headers.each(function(i,e){
    $(this).html( ch[i] );
  });

};

/* TODO: add description to this function */
mozilla.fillColumnHeaderWithDayAndMonth = function (dateParam, idx){
    var myself = this;
    
    var date = new Date(dateParam);
    
    var mn = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    
    var a =  date.getDate() + '<br><span class="thMonth">' + mn[date.getMonth()] + '</span>' ;   
    
    myself.chartDefinition.colHeaders[idx] = a;
};


mozilla.fillColumnHeaderGrowthWithDateRangeValueParameter = function (dateRangeParam, idx){
    var myself = this;
    
    var a = '<br><span class="thGrowth">' + 'd/d-'+dateRangeParam + '</span>' ;   
    
    myself.chartDefinition.colHeaders[idx] = a;
};




/* Expanding Row function
 * needs to have a CDE object with the content prepared. The new content is triggered
 * when we firechange "param" (string, not value), and then added a row with the content
 * that was meant to be in detailContainerObj
*/

mozilla.expandRow = function(event,detailContainerObj,param, activeclass){
    var myself = this;
    if(typeof activeclass === 'undefined'){
      activeclass = "activeRow";
    }
    var obj = event.target.closest("tr");
    var a = event.target.prevObject;
	if (!(a)){
		a = event.target.closest();
	}
    if (a.hasClass('info')){
      return;
    }else{
      var row = obj.get(0);
      
      var value = event.series;
      var htmlContent = $("#" + detailContainerObj).html();
      
      if( obj.hasClass(activeclass) ){
      obj.removeClass(activeclass);
      myself.dataTable.fnClose( row );
      }
      else{
        var prev = obj.siblings('.'+activeclass).each(function(i,d){
          var curr = $(d);
          curr.removeClass(activeclass);
          myself.dataTable.fnClose( d );
        });
        obj.addClass(activeclass);
        Dashboards.fireChange( param, value);
        myself.dataTable.fnOpen( row, htmlContent, activeclass );
      }
    }
};



/* TODO: add description to this function */
mozilla.moveTableSearch = function(targetHtmlObj){
    
  var t = $('#' + targetHtmlObj).empty();
  $('#'+this.htmlObject + ' .dataTables_filter').detach().appendTo(t).show();
  
};




/* *** Define custom functions (asc and desc) for sorting *** */

jQuery.fn.dataTableExt.oSort['legend-asc']  = function(x,y) {
    return ((x < y) ? -1 : ((x > y) ?  1 : 0));
};
jQuery.fn.dataTableExt.oSort['legend-desc'] = function(x,y) {
    return ((x < y) ?  1 : ((x > y) ? -1 : 0));
};

jQuery.fn.dataTableExt.oSort['text-asc']  = function(x,y) {
    return ((x < y) ? -1 : ((x > y) ?  1 : 0));
};
jQuery.fn.dataTableExt.oSort['text-desc'] = function(x,y) {
    return ((x < y) ?  1 : ((x > y) ? -1 : 0));
};

jQuery.fn.dataTableExt.oSort['legend autoString-asc']  = function(x,y) {
    return ((x < y) ? -1 : ((x > y) ?  1 : 0));
};
jQuery.fn.dataTableExt.oSort['legend autoString-desc'] = function(x,y) {
    return ((x < y) ?  1 : ((x > y) ? -1 : 0));
};


jQuery.fn.dataTableExt.oSort['tableBar-asc']  = function(x,y) {
    return ( parseFloat(x) < parseFloat(y) ? -1 : ((parseFloat(x) > parseFloat(y)) ?  1 : 0) );
};
jQuery.fn.dataTableExt.oSort['tableBar-desc'] = function(x,y) {
    return ( parseFloat(x) < parseFloat(y) ?  1 : ((parseFloat(x) > parseFloat(y)) ? -1 : 0) );
};

jQuery.fn.dataTableExt.oSort['growth-asc']  = function(x,y) {
    return ( parseFloat(x) < parseFloat(y) ? -1 : ((parseFloat(x) > parseFloat(y)) ?  1 : 0) );
};
jQuery.fn.dataTableExt.oSort['growth-desc'] = function(x,y) {
    return ( parseFloat(x) < parseFloat(y) ?  1 : ((parseFloat(x) > parseFloat(y)) ? -1 : 0) );
};

jQuery.fn.dataTableExt.oSort['percentage-asc']  = function(x,y) {
    return ( parseFloat(x) < parseFloat(y) ? -1 : ((parseFloat(x) > parseFloat(y)) ?  1 : 0) );
};
jQuery.fn.dataTableExt.oSort['percentage-desc'] = function(x,y) {
    return ( parseFloat(x) < parseFloat(y) ?  1 : ((parseFloat(x) > parseFloat(y)) ? -1 : 0) );
};

jQuery.fn.dataTableExt.oSort['visits-asc']  = function(x,y) {
    return ( parseFloat(x) < parseFloat(y) ? -1 : ((parseFloat(x) > parseFloat(y)) ?  1 : 0) );
};
jQuery.fn.dataTableExt.oSort['visits-desc'] = function(x,y) {
    return ( parseFloat(x) < parseFloat(y) ?  1 : ((parseFloat(x) > parseFloat(y)) ? -1 : 0) );
};

/* Used in mozillians dashboard */
jQuery.fn.dataTableExt.oSort['tableBar intBar-asc']  = function(x,y) {
    return ( parseFloat(x) < parseFloat(y) ? -1 : ((parseFloat(x) > parseFloat(y)) ?  1 : 0) );
};
jQuery.fn.dataTableExt.oSort['tableBar intBar-desc'] = function(x,y) {
    return ( parseFloat(x) < parseFloat(y) ?  1 : ((parseFloat(x) > parseFloat(y)) ? -1 : 0) );
};

jQuery.fn.dataTableExt.oSort['tableBar floatBar-asc']  = function(x,y) {
    return ( parseFloat(x) < parseFloat(y) ? -1 : ((parseFloat(x) > parseFloat(y)) ?  1 : 0) );
};
jQuery.fn.dataTableExt.oSort['tableBar floatBar-desc'] = function(x,y) {
    return ( parseFloat(x) < parseFloat(y) ?  1 : ((parseFloat(x) > parseFloat(y)) ? -1 : 0) );
};


/* ***  End of TABLE functions  *** */





/***************************************************************************
 *                           CHART functions                               *
 ***************************************************************************/
 

/* *** CCC Extension Points *** */

mozilla.cccLineChartExtensionPoints = function() {
  var defaults = {
      //"xAxisLabel_textAngle": "-1",
      //"xAxisLabel_textAlign": "center",
      //"xAxisLabel_textBaseline": "top",
      "xAxisRule_strokeStyle": "#ccd8dd",
      "yAxisRule_strokeStyle": "#ccd8dd",
      "xAxisTicks_strokeStyle": "#ccd8dd",
      "yAxisTicks_strokeStyle": "#ccd8dd",
      "xAxisGrid_strokeStyle": "#ccd8dd",
      "yAxisGrid_strokeStyle": "#ccd8dd",
      "dot_shapeRadius": "1",
      "xAxisEndLine_strokeStyle": "#ccd8dd",
      "yAxisEndLine_strokeStyle": "#ccd8dd"
      //"xAxisScale_dateTickPrecision": "86400000"
      //"xAxisScale_dateTickPrecision": "172800000"
  }
  
  var ep = this.chartDefinition.extensionPoints || [];
  var objEp = Dashboards.propertiesArrayToObject(ep);
  objEp = $.extend({},defaults,objEp);
  this.chartDefinition.extensionPoints = Dashboards.objectToPropertiesArray(objEp);
};




/***************************************************************************
 *                            MISC functions                               *
 ***************************************************************************/


mozilla.addEmptyToDatasource = function(data){    
    data.resultset.unshift(["","All"]);
    return data;
};


/* Joins an array into a string (to be used in kettle, for instance) */
mozilla.joinArrayString = function(param,sep){
  
    if(typeof sep === 'undefined'){
        sep = ',';
    }

    if(!param){
        return param;
    }
    else if( typeof param === 'string' || typeof param === 'number'){
        return ''+param;
    }
    else if(param.length < 2){
        return param[0] ? param[0] : '';
    }
    else{
        return param.join(',');
    }
  
};



mozilla.addCommas = function(nStr){
    nStr += '';
    x = nStr.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
    
};


var engNotation = function(d) { 
  var Log1000 = Math.log(1000); 
  var engLabels = ['', ' k' , ' M', ' G' , ' T', ' P']; 
  var exponent3 = ( d == 0 ? 0 : 
    Math.floor(Math.round( 100 * Math.log(d)/Log1000 )/100) ); 
  var mantissa = Math.round( 100* d / Math.pow(1000, exponent3))/100; 
  return mantissa + engLabels[exponent3]; 
}; 


var sigFigs = function (num, sig) {
	if (num == 0)
		return 0;
	if (Math.round(num) == num)
		return num;
	var digits = Math.round((-Math.log(Math.abs(num)) / Math.LN10) + (sig || 2));
	//round to significant digits (sig)
	if (digits < 0)
		digits = 0;
	return num.toFixed(digits);
}



/*
// Events
var eventBinder = function(){
  
  // Export buttons
  $(".exportButton").bind("click", function() {

  });
  
}
*/


      
