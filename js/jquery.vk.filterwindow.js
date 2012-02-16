(function($) {
    $.widget("vk.filterwindow", {
		options: {
            init: [{"name":"LDS"}, {"name":"LDSB"}, {"name":"LDSVP"}]
		},
				
		_create: function() {
            this.scroller = $( "<div></div>" );
            this.content_holder = $( "<div></div>" );
            this.scroller.css({
                overflow:"hidden",
                width:"300px",
                height:"400px",
                //border:"solid 1px #000000"
            }).
            append( this.content_holder );
            this.element.
                css({
                    overflow:'hidden',
                    width:"300px",
                    height:"400px"
                }).
                append( this.scroller );
		},
		
        _fillData: function( qso ){
            console.log( qso );
            this.content_holder.css( "width", (qso.length+2) * 300 );

            var scroller = this.scroller;
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
                var scrollAmount = (Number(i)+1) * 300;
                //we will set the attribute "sa" of the button which is not standard to be able to scroll the right amount.
                item.
                attr("sa", scrollAmount).
                css({
                    width: "300px",
                    height: "30px"
                }).
                click( function(){
                    scroller.animate( {scrollLeft:$(this).attr("sa")}, 500 );
                }).
                button();
                menu_content.append( item );
                menu_content.append( "<br/>" );
            }
            this.content_holder.append( menu_content );

            //now start filling the rest of the pages for filter window
            for( var i in qso ){
                var scrollAmount = -(Number(i)+1) * 300;
                var _button = $( "<button>Back</button>" );
                _button.
                    css( "float", "right").
                    attr( "sa", scrollAmount ).
                    click( function(){
                        scroller.animate( {scrollLeft:$(this).attr("sa")}, 500 );
                    }).
                    button();
                var content = $( "<div> </div>" );
                content.
                    append( "<span style='text-align:center;float:left;width:245px;height:30px' class='ui-state-highlight ui-corner-all'>" +
                        qso[i].helptext+
                        "</span>" ).
                    append( _button ).
                    css({
                        float: "left",
                        width: "300px",
                        height: "400px"
                    });
                var qso_data = $( "<div></div>" );
                qso_data.datatable().
                    datatable( "option", {
                        header: qso[i].header,
                        data: qso[i].data,
                        "selectall": qso[i].defaultin
                });
                qso_data.css({
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
