(function($) {
    $.widget("webleddb.filterwindow", {
		options: {
            init: [{"name":"LDS"}, {"name":"LDSB"}, {"name":"LDSVP"}]
		},
				
		_create: function() {
            this.content_holder = $( "<div></div>" );
            this.element.
                css({
                    overflow:'hidden',
                    width:"300px",
                    height:"400px"
                }).
                append( this.content_holder );
		},
		
        _fillData: function( qso ){
            this.content_holder.css( "width", 300 );

            //fill the first page of the filter window with buttons.
            var menu_content = $( "<div></div>" );
            menu_content.
                css({
                        float: "left",
                        width: "300px",
                        height: "400px",
                });
            for( var i in qso ){
                var item = $( "<button>" + qso[i].name + "</button>" );
                //we will set the attribute "sa" of the button which is not standard to be able to scroll the right amount.
                item.
                attr( "screen", "#screen_" + qso[i].name ).
                css({
                    width: "300px",
                    height: "30px"
                }).
                click( function(){
                    $( $(this).attr( "screen" ) ).show( "slide", {}, 500, function(){
                        menu_content.fadeOut(); //slide the menu_content away. 
                    });
                }).
                button();
                menu_content.append( item );
                menu_content.append( "<br/>" );
            }
            this.content_holder.append( menu_content );

            //now start filling the rest of the pages for filter window
            for( var i in qso ){
                var _button = $( "<button>Back</button>" );
                _button.
                    css( "float", "right").
                    attr( "screen", "#screen_" + qso[i].name ).
                    click( function(){
                        var sc_id = $(this).attr( "screen" );
                        menu_content.fadeIn();
                        $( sc_id ).hide( "slide", {}, 500);    
                    }).
                    button();
                var content = $( "<div> </div>" );
                content.
                    append( "<span style='text-align:center;float:left;width:240px;height:30px' class='ui-state-highlight ui-corner-all'>" +
                        qso[i].helptext+
                        "</span>" ).
                    attr( "id", "screen_" + qso[i].name ).
                    append( _button ).
                    css({
                        float: "left",
                        width: "300px",
                        height: "400px",
                        position: "absolute",
                        left: "10px",
                        top: "10px",
                        display: "none",
                        "background-color": "#ffffff"
                    });
                var qso_data = $( "<div></div>" );
                qso_data.datatable().
                    datatable( "option", {
                        header: qso[i].header,
                        data: qso[i].data,
                        "selectall": qso[i].defaultin
                });
                qso_data.css({
                    position: "relative",
                    top: "5px",
                    width: "295px",
                    height: "350px",
                    overflow: "auto"
                });
                content.append( qso_data );
                this.content_holder.append( content );
            }
        },

        _setOptions: function(){
            $.Widget.prototype._setOptions.apply(this, arguments);
        },

		_setOption: function( option, value ) {
			$.Widget.prototype._setOption.apply( this, arguments );
            switch(option){
                case "init":
                    this._fillData( value );
                    break;
            }
        }
	});
})( jQuery );
