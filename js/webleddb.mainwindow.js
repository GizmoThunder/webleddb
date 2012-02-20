/*function aargh( tr ){
   $(tr).toggleClass('ui-state-highlight');
}*/
(function($) {

    $.widget("webleddb.mainwindow", {
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

            var fw = $( "<div id=\"filterwidget\" class=\"ui-widget-container\"> </div>" );
            var fwcontent = $( "<div></div>" );
            fwcontent.filterwindow();
            fwcontent.filterwindow( "option", "init", qso );
            fw.append( fwcontent ).
               dialog({
                autoOpen:false,
                width:320,
                height:490,
                resizable: false,
                show:"slide",
                hide:"slide",
                modal: true,
                buttons: {
                    Ok : function(){
                        //make a json call to load the current view.
                    },
                    Cancel : function(){
                        fw.dialog( "close" );
                    },
               }
            });

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
