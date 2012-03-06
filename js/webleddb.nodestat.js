(function($){
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
                            append( "<p>" + nodeid + "</p>" ).
                            addClass( 'ui-state-active nodestat-title' );
            if( this.options.cpu < 0 ){
                title.removeClass( 'ui-state-active' ).addClass( 'ui-state-error' );
            }
           //assume we get combined info of all the cpus.
            var cpuinfo = $( "<div></div>" ).
                addClass( 'nodestat-cpus' ).
                append( '<b>Cpu:</b>' );

            var cpu_label = $( "<div></div>" ).addClass( 'nodestat-progressbar-label' );

            var cpu = $( "<div></div>" ).
                addClass( 'nodestat-progressbar' ).
                progressbar({
                   value:this.options.cpu
               }).append( cpu_label );
           cpu_label.html( cpu.progressbar( "option", "value" ) + "%" );
           cpuinfo.append( cpu );

           var meminfo = $( "<div></div>" ).
                addClass( 'nodestat-cpus' ).
                append( '<b>Mem:</b>' );

            var mem_label = $( "<div></div>" ).addClass( 'nodestat-progressbar-label' );

            var mem = $( "<div></div>" ).
                addClass( 'nodestat-progressbar' ).
                progressbar({
                   value:this.options.mem
               }).append( mem_label );
           mem_label.html( mem.progressbar( "option", "value" ) + "%" );
           meminfo.append( mem );
           cpuinfo.append( meminfo );
 
 
            //disks on this node.
            var disks = $( "<div></div>" ).
                    addClass( 'nodestat-disks' ).
                    append( '<b>Disk:</b>' ); 
            for( var i = 0; i < this.options.disks.length; i++ ){
                var disk_info = this.options.disks[i];
                var label = $( "<div></div>" ).
                            addClass( 'nodestat-progressbar-label' );

                var disk = $( "<div></div>" ).
                    addClass( 'nodestat-progressbar' );
                    if( disk_info[0] < 0 ){
                       disk.addClass( 'ui-state-error ui-corner-all' );     
                       label.html( "NA" ).css({
                        "text-align": "center",
                        "font-weight": "bold"
                        }).removeClass('nodestat-progressbar-label');
                    }else{
                        disk.progressbar({
                                value: disk_info[0] 
                            });
                        label.html( disk.progressbar( "option", "value" ) + "%");
                    }
                    disk.append( label );
                    disks.append( disk );
            }

            this.element.html(""); //clear all stuff in this element.
            //add the new info to the element.
            this.element.
                addClass( 'nodestat  ui-state-highlight' ).
                append( title, cpuinfo, disks );
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
