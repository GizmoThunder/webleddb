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
            this._setBusy( true );
        },

        setUI: function( ){
            var _vars = this._qmData.QUERY_OPTIONS; //[ "lds", "ldsb", "ldsbp" ]; //each prefix is for one tab.

            //create the tabbed widget for the query options provided
            var acc_data = "";
            var tab_header = "<ul>";
            for( v in _vars ){
                tab_header += "<li> <a href=\"#" + _vars[v] + "_tablecontainer\" >" + _vars[v] + "</a></li>";
                var filter_button = "<button id='" + _vars[v] + "_filter'> Filter </button>";
                var msg = "<span style=\"padding:5px;margin:2px;display:none\"> Error mesg </span>";
                var acc_datatable = "<div id='" + _vars[v] +"_datatable'> </div>";
                var table_container = "<div id='" + _vars[v] + "_tablecontainer'>" + 
                                       filter_button +
                                       msg +
                                       acc_datatable +
                                       "</div>";
                acc_data += table_container;
            }
            tab_header += "</ul>";
            this.element.html( "<div id=\"accordion\">" + tab_header + acc_data + "</div>" );
            $( "#accordion" ).tabs({ fx: { opacity: 'toggle' } });
            $( "#accordion" ).css( "width", this.element.width() - 5 ).
                css( "height", this.element.height() - 5 );

            //creating the ui elements for the data tabels etc.
            for( v in _vars ){
                //set the data tables to show the data.
                $( "#" + _vars[v] + "_datatable" ).datatable();

                //add the dialog box for specifying filter data. (this should probably be created after each ajax call)
                var dlg = "<div id='" + _vars[v] + "_filterdialog'> This is the filter dialog </div>";
                $( dlg ).insertAfter( $( "#messagebox" ) );
                $( "#" + _vars[v] + "_filterdialog" ).dialog({ autoOpen: false, modal:true });

                //configure the filter buttons.
                $( "#" + _vars[v] + "_filter" ).
                    button({
                        icons:{
                            primary:"ui-icon-gear"
                        }
                    });
                $( "#" + _vars[v] + "_filter" ).
                    click( function(){
                        var dlg_id = "#" + $(this).attr( "id" ) + "dialog";
                        $( "#" + $(this).attr( "id" ) + "dialog" ).
                            html( dlg_id ).
                            dialog( "open" );
                });
            }

            //filling one of the tables with junk data. for verification
            $( "#LDS_datatable" ).datatable( "option", {
                header: ["ID", "project", "initial", "final", "asdf", "asdfas"], 
                width: $("#LDS_tablecontainer").width()
            });
            $( "#LDS_datatable" ).datatable( "option", "data", [[10, 10, 20, 10, 10, 20], [20, 20, 1, 24, 20, 21], [10, 2, 46, 32, 20, 1], [3, 5, 6, 34, 20, 39]] );
	
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
                    this._setBusy( false );
                    break;
            }
        }
	});
})( jQuery );
