/*function aargh( tr ){
   $(tr).toggleClass('ui-state-highlight');
}*/
(function($) {

    $.widget("vk.mainwindow", {
		options: {
            //callbacks
            getSelected: null,
            _setBusy: null
		},
				
		_create: function() {
            this.element.addClass("ui-widget-content").
                css("width", 640).
                css("height", 480).
                resizable({
                    minHeight: 480,
                    minWidth: 640,
                    resize: function(){
                        $( "#accordion" ).accordion( "resize" );
                    }
                });
            $( "#accordion" ).accordion({ header: "h3", fillSpace: true });
            $( "#messagebox" ).dialog({ autoOpen: false, modal: true });

            var _vars = [ "lds", "ldsb", "ldsbp" ]; //each prefix is for one tab.
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
            $( "#lds_datatable" ).datatable( "option", {
                header: ["ID", "project", "initial", "final"], 
                width: $("#lds_tablecontainer").width()
            });
            $( "#lds_datatable" ).datatable( "option", "data", [[10, 10, 20, 10], [20, 20, 1, 24], [10, 2, 46, 32], [3, 5, 6, 34]] );
		},
			
        getSelected: function( selected_row_keys ){
            //console.log("getting selected");
            var rows = this.element.find( "tr" );
            var key = this.keyindex;
            rows.each( function() {
                if( $( this ).hasClass( "ui-state-highlight" ) ){
                    var _cols = $(this).children();
                    selected_row_keys.push( _cols[key].innerHTML );
                }
            });
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
        }
	});
})( jQuery );
