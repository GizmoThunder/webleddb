(function($) {
    $.widget("webleddb.nodestat", {
		options: {
            'nodeid': 'Node 007',
            'cpu': '0',
            'mem': '0',
            'disks' : []
		},
				
		_create: function(){
            this._refresh();
        },

        _refresh: function(){
            //label for the node.
            var nodeid = this.options.nodeid;
            var title = $( "<div></div>" ).
                        css({
                            'position':'relative',
                            'width':'30px',
                            'left':'-32px',
                            'top': '-1px',
                            'height':'30px',
                            'text-align':'center',
                            'font-weight': 'bold',
                            }).append( "Node " + nodeid.slice( nodeid.indexOf('e') + 1) ). //assuming node id is of "nodexxx" form.
                            addClass( 'ui-state-active' );
                            
           //assume we get combined info of all the cpus.
           var cpus = $( "<div></div>" ).
               css({
                   'position':'relative',
                   'top': '-32px',
                   'width': '99px'
               }).append( '<b>Cpu:</b>' );

           var cpu_label = $( "<div></div>" ).
               css({
                   'position':'relative',
                   'top':'-12px',
                   'width':'100%',
                   'text-align':'center',
                   'font-weight':'bold'
               });

           var cpu = $( "<div></div>" ).
               css({
               'height': '12px', 
               'margin': '2px'
               }).
               progressbar({
                   value:this.options.cpu
               }).append( cpu_label );
           cpu_label.html( cpu.progressbar( "option", "value" ) + "%" );
           cpus.append( cpu );
 
            //disks on this node.
            var disks = $( "<div></div>" ).
                        css({
                            'position':'relative',
                            'top': '-32px',
                            'width' : '99px'
                        }).append( '<b>Disks:</b>' ); 
            for( var i = 0; i < this.options.disks.length; i++ ){
                var disk_info = this.options.disks[i];
                var label = $( "<div></div>" ).
                    css({
                            'position':'relative',
                            'top':'-12px',
                            'width':'100%',
                            'text-align':'center',
                            'font-weight':'bold'
                            });

                var disk = $( "<div></div>" ).
                    css( {
                            'height': '12px',
                            'margin': '2px'
                            }).
                    progressbar({
                        value: disk_info[0] 
                    }).append( label );
                    label.html( disk.progressbar( "option", "value" ) + "%");
                    disks.append( disk );
            }

            this.element.html(""); //clear all stuff in this element.
            //add the new info to the element.
            this.element.
                addClass( 'ui-widget-content ui-state-highlight' ).
                    css({
                        margin: '20px',
                        padding: '5px',
                        float: 'left',
                        width: "100px",
                        height: "100px",
                    }).append( title, cpus, disks );
		},
		
        _setOptions: function(){
            $.Widget.prototype._setOptions.apply(this, arguments);
            this._refresh();
        },

		_setOption: function( option, value ) {
			$.Widget.prototype._setOption.apply( this, arguments );
            this._refresh();
        }
	});
})( jQuery );
