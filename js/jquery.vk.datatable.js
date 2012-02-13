function checkboxHandler( cb, e ){
    var th = cb.parent();
    var tr = th.parent();
    var table = tr.parent();
    if( $( cb ).attr( 'checked' ) ){
        table.find( "tr" ).each( function(){
                $(this).addClass( "ui-state-active" );
                });
    }else{
        table.find( "tr" ).each( function(){
                $(this).removeClass( "ui-state-active" );
                });
    }
    tr.toggleClass( "ui-state-active" );
}

(function($) {
    $.widget("vk.datatable", {
		options: {
            width: "320",
            height: "80px",
            keyindex: 1, //index of value to keep track of for selected items.
            header: ['First', 'Second'],
            data: [], 
            //callbacks
            fillData: null,
            getSelected: null
		},
				
		_create: function() {
            this.element.addClass("ui-widget-content").
                css("width", 320).
                css("height", 180);
            this.keyindex = 1;
            this.header = ['First', 'Second'];
		},
			
        fillData: function( value ) {
            this.data = value;
            var _html = "<table width='100%'>"+"<th><input type='checkbox' onClick='checkboxHandler( $(this) );'> </input></th>";
            for( v in this.header ){
                _html += "<th class='ui-widget-header' style='text-transform:uppercase;'>" + this.header[v] + "</th>";
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

            var rows = this.element.find( "tr" );
            rows.each( function() {
                    $( this ).click( function(){
                            $( this ).toggleClass( "ui-state-active" );
                        }
                    ).
                    mouseenter( function( me ) {
                        if( me.shiftKey ){
                            $( this ).toggleClass( "ui-state-active" );
                        }
                    });
            });
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
