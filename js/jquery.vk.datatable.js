/*function aargh( tr ){
   $(tr).toggleClass('ui-state-highlight');
}*/
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
            var _html = "<table width='100%'>";
            for( v in this.header ){
                _html += "<th class='ui-widget-header' style='text-transform:uppercase;'>" + this.header[v] + "</th>";
            }
            for( v in this.data ){
                _html += "<tr onClick='$(this).toggleClass(\"ui-state-highlight\");'>"
                for( h in this.header ){
                    _html += "<td align='center'>" + this.data[v][h] + "</td>";
                }
                _html += "</tr>";
            }
            _html += "</table>";
            this.element.html( _html );
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

		destroy: function() {			
			this.element.html( "" );
		},
	
        _setOptions: function(){
            $.Widget.prototype._setOptions.apply(this, arguments);
        },

		_setOption: function( option, value ) {
			$.Widget.prototype._setOption.apply( this, arguments );
			
			switch ( option ) {
                case "width":
                    this.element.css( "width", value );
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
