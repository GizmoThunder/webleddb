function checkboxHandler( cb, e ){
    var th = cb.parent();
    var tr = th.parent();
    var table = tr.parent();
    if( $( cb ).attr( 'checked' ) ){
        tr.addClass( "ui-state-active" );
        table.find( "tr" ).each( function(){
                $(this).addClass( "ui-state-active" );
                });
    }else{
        table.find( "tr" ).each( function(){
                $(this).removeClass( "ui-state-active" );
                });
        tr.removeClass( "ui-state-active" );
    }
}

(function($) {
    $.widget( "webleddb.uitable", $.ui.mouse, {
        options: {
        },

        _create: function(){
            this._mouseInit();
            var rows = this.element.find( "tr" );
            rows.each( function(){
                    $( this ).bind( 'mousedown', function(){
                            $( this ).toggleClass( "ui-state-active" );
                        }
                    );
            });
            this.helper = $( "<div class='ui-selectable-helper'> </div>" );
        },

        _mouseStart: function( event ){
            this.opos = {x:event.pageX, y:event.pageY};
            this.helper.css({
                "left": event.pageX,
                "top": event.pageY,
                "width":0,
                "height":0
            }); 
            $( 'body' ).append( this.helper );
            //since we start dragging from here. register the callback for adding class
            var rows = this.element.find( "tr" );
            rows.each( function(){
                $(this).bind( 'mouseover', function(){
                    $(this).addClass( 'ui-state-active' );
                });
            });
        },

        _mouseDrag: function( event ){
            var x1 = this.opos.x, y1 = this.opos.y, x2 = event.pageX, y2 = event.pageY;
            if (x1 > x2) { var tmp = x2; x2 = x1; x1 = tmp; }
            if (y1 > y2) { var tmp = y2; y2 = y1; y1 = tmp; }
            this.helper.css({left: x1, top: y1, width: x2-x1, height: y2-y1});
        },
   	   
        _mouseStop: function( event ){
            this.helper.remove();
            //since we start dragging from here. register the callback for adding class
            var rows = this.element.find( "tr" );
            rows.each( function(){
                $(this).unbind( 'mouseover' );
            });
        },

        _setOptions: function(){
            $.Widget.prototype._setOptions.apply(this, arguments);
        },

		_setOption: function( option, value ) {
			$.Widget.prototype._setOption.apply( this, arguments );
	    }		
    });
})( jQuery );

(function($) {
    $.widget( "webleddb.datatable", {
		options: {
            width: "320",
            height: "80px",
            keyindex: 1, //index of value to keep track of for selected items.
            header: ['First', 'Second'],
            data: []
		},
				
		_create: function() {
            this.element.addClass("ui-widget-content");
            this.keyindex = 1;
            this.header = ['First', 'Second'];
		},
			
        fillData: function( value ) {
            this.data = value;
            var _html = "<table width='100%'> <th>" + 
            "<input type='checkbox' onClick='checkboxHandler( $(this) );'> </input>" +
            "</th>";
            for( v in this.header ){
                _html += "<th class='ui-widget-header' style='text-transform:uppercase;height:20px;'>" + this.header[v] + "</th>";
            }
            for( v in this.data ){
                _html += "<tr>";
                for( h in this.header ){
                    if(h == 0){
                        _html += "<td align='center' colspan=2>" + this.data[v][h] + "</td>";
                    }else{
                        _html += "<td align='center'>" + this.data[v][h] + "</td>";
                    }
                }
                _html += "</tr>";
            }
            _html += "</table>";
            this.element.html( _html );
            var tables = this.element.find( "table" );
            tables.uitable();
       },
        
        _selectAll: function(){
            var rows = this.element.find( "tr" );
            rows.each( function() {
                    if( !$( this ).hasClass( "ui-state-active" ) ){
                        $( this ).toggleClass( "ui-state-active" );
                    }
                }
            );
        },

        getSelected: function( selected_row_keys ){
            //console.log("getting selected");
            var rows = this.element.find( "tr" );
            var key = this.keyindex;
            rows.each( function() {
                if( $( this ).hasClass( "ui-state-active" ) ){
                    var _cols = $(this).children();
                    selected_row_keys.push( _cols[key].innerHTML );
                }
            });
        },

		destroy: function() {			
			this.element.html( "" );
		},

        _setOptions: function(){
            $.Widget.prototype._setOptions.apply(this, arguments);
        },

		_setOption: function( option, value ) {
			$.Widget.prototype._setOption.apply( this, arguments );
			
			switch ( option ) {
                case "selectall":
                    if( value ){
                        this.element.find( "input" ).attr( "checked", true );
                        this._selectAll();
                    }
                    break;
                case "width":
                    this.element.css( "width", value );
                    break;
                case "height":
                    this.element.css( "height", value );
                    break;
                case "data":
                    this.fillData( value );
                    break;
                case "header":
                    this.header = value;
                    break;
                case "getselected":
                    this.getSelected( value );
                    break;
		    }
		}
	});
})( jQuery );
