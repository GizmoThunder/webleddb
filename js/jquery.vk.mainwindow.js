/*function aargh( tr ){
   $(tr).toggleClass('ui-state-highlight');
}*/
(function($) {

    $.widget("vk.mainwindow", {
		options: {
            //callbacks
            _setBusy: null
		},
				
		_create: function() {
            this.element.addClass("ui-widget-content").
                css("width", 640).
                css("height", 480);
            $( "#messagebox" ).dialog({ autoOpen: false, modal: true });
        },

        setUI: function(){
            var _vars = this._qmData.QUERY_OPTIONS; //[ "lds", "ldsb", "ldsbp" ]; //each prefix is for one tab.
            var qso = this._qmData.QUERY_SELECTION_OPTIONS;

            //create the widget to pop when filter buttons are pressed
            var fw_list = "<ul>";
            var fw_data = "";
            for( i in qso ){
                fw_list += "<li> <a href=\"#fwtablecontainer_" + qso[i].name + "\">" + qso[i].name + "</a></li>";                
                fw_data += "<div id=\"fwtablecontainer_" + qso[i].name + "\">" + qso[i].header + "</div>";
            }
            fw_list += "</ul>";
            var fw = $( "<div id=\"filterwidget\" class=\"ui-widget-container\"> </div>" );
            var fw_content =  $( "<div></div>" );
            fw_content.
                css( "width", 490 ).
                css( "height", 420 ).
                html( fw_list + fw_data ).
                tabs();
            fw.html( fw_content ).
                insertAfter( $( "#mainwindow" ) ).
                dialog({
                width: 520,
                height:550,
                show: "slide",
                hide: "slide",
                modal:true,
                title: "Filter Options",
                autoOpen: false,
                buttons:{
                    cancel:function(){
                        $(this).dialog( "close" );
                    }
                }});
            $( "<div id='filtermsg' style='margin-top: 5px; padding: 0 .9em;'> </div>" ).
                html('<p><span class="ui-icon ui-icon-info" style="float: left; margin-right: .3em;"></span>' + qso[0].helptext + "</p>").
                addClass( "ui-state-highlight ui-widget-header" ).
                insertBefore( fw_content );
            //change the help message everytime a tab is pressed.
            fw.bind('tabsshow', function( e, ui ){
                $( "#filtermsg" ).html('<p><span class="ui-icon ui-icon-info" style="float: left; margin-right: .3em;"></span>' + qso[ui.index].helptext + "</p>");
            });

            //fill the filter options in the filter widget.
            for( i in qso ){
                $( "#fwtablecontainer_" + qso[i].name ).
                    datatable().
                    datatable( "option", {
                        header: qso[i].header,
                        data: qso[i].data,
                        width: 460,
                        height: 330,
                        "selectall": qso[i].defaultin
                    }).
                    css( "overflow", "auto" ); 
            }
            //create the tabbed widget for the query options provided
            var acc_data = "";
            var tab_header = "<ul>";
            for( v in _vars ){
                tab_header += "<li> <a href=\"#tablecontainer_" + _vars[v] + "\" >" + _vars[v] + "</a></li>";
                var filter_button = "<button id='" + _vars[v] + "_filter'> Filter </button>";
                var msg = "<span style=\"padding:5px;margin:2px;display:none\"> Error mesg </span>";
                var acc_datatable = "<div id='datatable_" + _vars[v] + "'> </div>";
                var table_container = "<div id='tablecontainer_" + _vars[v] + "'>" + 
                                       filter_button +
                                       msg +
                                       acc_datatable +
                                       "</div>";
                acc_data += table_container;
            }
            tab_header += "</ul>";
            this.element.html( "<div id=\"accordion\">" + tab_header + acc_data + "</div>" ).resizable( {
                resize: function(){
                    var h = $(this).height();
                    $( "#accordion" ).css( {"width": $(this).width()-5, "height": h-5 } );
                    $( "div[id^='datatable_']" ).css( "height", h - 85);
                }
            });
            var mw = this.element;
            $( "#accordion" ).tabs({
                //specifying what to do when we start showing up the tabs.
                show: function( e, ui ){
                    mw.mainwindow( "option", "busy", true );
                    //replace with the querier.py when its' ready for usage.
                    $.getJSON( "ldsfirstquery.html", {
                        qo: ui.tab.text,
                        pqo: null,
                        sv: null
                    }, function( obj ){
                        //set the widget width and height.
                        var tcontainer = $( "#tablecontainer_" + ui.tab.text );
                        tcontainer.height( $( "#mainwindow" ).height() - 90 );
                        $( "#datatable_" + ui.tab.text ).
                        css( "overflow", "auto" ).
                        datatable( "option", {
                            header: obj.header, 
                            data: obj.data,
                            width: "100%",
                            height: "100%"
                        }); 
                        //unblock the ui.
                        mw.mainwindow( "option", "busy", false );
                    });
                }
            });

            $( "#accordion" ).css( "width", this.element.width() - 5 ).
                css( "height", this.element.height() - 5 );

            //creating the ui elements for the data tabels etc.
            for( v in _vars ){
                //set the data tables to show the data.
                $( "#datatable_" + _vars[v] ).datatable();
                //configure the filter buttons.
                $( "#" + _vars[v] + "_filter" ).
                    button({
                        icons:{
                            primary:"ui-icon-gear"
                        }
                    });

                $( "#" + _vars[v] + "_filter" ).
                    click( function(){
                        //fw_content.tabs( "option", "disabled", [2, 4, 5] );
                        fw.dialog( "option", {title : "Filter options for " + $(this).attr( "id" ).split('_')[0]} );
                        fw.dialog( "open" );
                    });
            }
        },
			
        _setBusy: function( val ){
            if(val){
                this.element.block({
                    css: { 
                        border: 'none', 
                        padding: '15px', 
                        backgroundColor: '#000', 
                        '-webkit-border-radius': '10px', 
                        '-moz-border-radius': '10px', 
                        opacity: .5, 
                        color: '#fff' 
                    },
                    message: "<h3> Loading... </h3>"
                });
            }else{
                this.element.unblock();
            }
        },

		destroy: function() {			
//			this.element.html( "" );
		},
	
        _setOptions: function(){
            $.Widget.prototype._setOptions.apply(this, arguments);
        },

		_setOption: function( option, value ) {
			$.Widget.prototype._setOption.apply( this, arguments );
            switch(option){
                case "init":
                    this._qmData = value;
                    this.setUI();
                    //this._setBusy( false );
                    break;
                case "busy":
                    this._setBusy( value );
                    break;
            }
        }
	});
})( jQuery );
