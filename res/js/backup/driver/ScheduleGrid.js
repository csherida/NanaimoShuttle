/*
 * Ext JS Library 2.0.2
 * Copyright(c) 2006-2008, Ext JS, LLC.
 * licensing@extjs.com
 *
 * http://extjs.com/license
 */
ScheduleGrid = function(viewer, config) {

    this.viewer = viewer;
    Ext.apply(this, config);

    function getColumns () {
        return this.columns;
    }

    function formatDate(value) {
        return Ext.isDate(value) ? value.dateFormat('M d, Y') : value;
    };

    function formatTime(value){
        if (value instanceof Date) {
            return value ? value.dateFormat('H:i') : '';
        } else {
            return value;
        }
    };

    function formatDriver(value){
        return value ? value : 'None';
    };

    function formatCID(value){
        return value ? value : 'None';
    };

    this.reader = new Ext.data.JsonReader({
        root: 'trips',
        id: 'id'
    }, Trip),

    this.store = new Ext.data.GroupingStore({
        url: 'res/php/schedule-load.php',
        reader: this.reader,
        groupField:'date'
        //fields: ['id', 'name', 'passengers', 'driver', 'sent', 'phone', 'cost', 'address', 'destination', {name: 'timestamp', type: 'date', dateFormat: 'Y-m-d H:i:s'}]
    });

    this.store.baseParams = {
        date: glb_date.dateFormat('Y-m-d')
    };

    this.store.setDefaultSort('timestamp', "ASC");

	this.filters = new Ext.grid.GridFilters({
	  filters:[
	    {type: 'numeric', dataIndex: 'id'},
	    {type: 'date',    dataIndex: 'date'},
	    //{type: 'time',  dataIndex: 'time'},
	    {type: 'string',  dataIndex: 'cid'},
	    {type: 'string',  dataIndex: 'name'},
	    {type: 'numeric', dataIndex: 'passengers'},
	    {type: 'string',  dataIndex: 'driver'},
	    {type: 'boolean', dataIndex: 'sent'},
	    {type: 'string',  dataIndex: 'address'},
	    {type: 'string',  dataIndex: 'destination'},
	    {type: 'string',  dataIndex: 'phone'},
	    {type: 'numeric', dataIndex: 'cost'}
	]});

    Ext.grid.GroupSummary.Calculations['totalCost'] = function(v, record, field){
        return v + record.data.cost;
    }

    Ext.grid.GroupSummary.Calculations['totalPassengers'] = function(v, record, field){
        return v + parseInt(record.data.passengers);
    }

	var summary = new Ext.grid.GroupSummary();

    var checkColumn = new Ext.grid.CheckColumn({
        store: this.store,
        header: "Sent?",
        dataIndex: 'sent',
        width: 10,
        readOnly: true
    });

    this.columns = [{
        id: 'id',
        header: "ID",
        dataIndex: 'id',
        sortable:true,
        width: 10,
        groupable: false
      },{
        id: 'date',
        header: "Date",
        dataIndex: 'date',
        renderer:  formatDate,
        sortable:true,
        width: 40
      },{
        id: 'time',
        header: "Time",
        dataIndex: 'time',
        renderer: formatTime,
        sortable:true,
        groupable: false,
        width: 30
      }, checkColumn, {
        id: 'cid',
        header: "CID",
        dataIndex: 'cid',
        renderer:  formatCID,
        width: 30,
        sortable:true
      },{
        id: 'driver',
        header: "Driver",
        dataIndex: 'driver',
        renderer:  formatDriver,
        width: 30,
        sortable:true
      },{
        id: 'name',
        header: "Name",
        dataIndex: 'name',
        sortable:true,
        width: 30,
        renderer: this.formatName
      },{
        id: 'passengers',
        header: "#",
        width: 5,
        groupable: false,
        dataIndex: 'passengers',
        summaryType:'totalPassengers',
        sortable:true
      },{
        id: 'address',
        header: "Address",
        dataIndex: 'address',
        width: 30,
        sortable:true
      },{
        id: 'destination',
        header: "Destination",
        width: 30,
        dataIndex: 'destination',
        sortable:true
      },{
        id: 'phone',
        header: "Phone",
        width: 30,
        dataIndex: 'phone',
        sortable:true
      },{
        id: 'cost',
        header: "Cost",
        dataIndex: 'cost',
        sortable:true,
        width: 30,
        renderer: 'usMoney',
        groupable: false,
        summaryType:'totalCost',
        summaryRenderer: Ext.util.Format.usMoney
    }];

    //
    ScheduleGrid.superclass.constructor.call(this, {
        region: 'center',
        id: 'schedule-grid',
        loadMask: {msg:'Loading Schedule...'},
        sm: new Ext.grid.RowSelectionModel({
            singleSelect:true
        }),
        plugins: [this.filters, checkColumn, summary],
        clicksToEdit: 2,
//        viewConfig: {
//            forceFit:true,
//            enableRowBody: true,
//            showPreview: false,
//            getRowClass: this.applyRowClass
//        },
        view: new Ext.grid.GroupingView({
            forceFit:true,
            enableRowBody: true,
            showPreview: false,
            getRowClass: this.applyRowClass,
            //
            showGroupName: false,
            enableNoGroups: false, // REQUIRED!
            //hideGroupedColumn: true,
            //enableGroupingMenu: false,
            groupTextTpl: '{text} ({[values.rs.length]} {[values.rs.length > 1 ? "Trips" : "Trip"]})'
        })
    });
    //

    this.on('rowcontextmenu', this.onContextClick, this);

};

Ext.extend(ScheduleGrid, Ext.grid.GridPanel, {

    onContextClick : function(grid, index, e){
        if(!this.menu){ // create context menu on first right click
            this.menu = new Ext.menu.Menu({
                id:'grid-ctx',
                items: [{
                    iconCls: 'refresh-icon',
                    text:'Refresh',
                    scope:this,
                    handler: function(){
                        this.ctxRow = null;
                        this.store.reload();
                    }
                }]
            });
            this.menu.on('hide', this.onContextHide, this);
        }
        e.stopEvent();
        if(this.ctxRow){
            Ext.fly(this.ctxRow).removeClass('x-node-ctx');
            this.ctxRow = null;
        }
        this.ctxRow = this.view.getRow(index);
        this.ctxRecord = this.store.getAt(index);
        Ext.fly(this.ctxRow).addClass('x-node-ctx');
        this.menu.showAt(e.getXY());
    },

    onContextHide : function(){
        if(this.ctxRow){
            Ext.fly(this.ctxRow).removeClass('x-node-ctx');
            this.ctxRow = null;
        }
    },

    loadSchedule : function(date) {
        this.store.baseParams = {
            date: date
        };
        this.store.load();
    },

    togglePreview : function(show){
        this.view.showPreview = show;
        this.view.refresh();
    },

    // within this function "this" is actually the GridView
    applyRowClass: function(record, rowIndex, p, ds) {
        if (this.showPreview) {
            var xf = Ext.util.Format;
            p.body  = '<p>';
            if (record.data.comments != '') {
                p.body += xf.stripTags(record.data.comments);
            } else {
                p.body += 'No Comments';
            }
            p.body += '</p>';
            return 'x-grid3-row-expanded';
        }
        if (record.data.colour) {
            return 'x-grid3-row-collapsed-' + record.data.colour;
        }
        return 'x-grid3-row-collapsed';
    },

    formatName: function(value, p, record) {
        //return String.format('<div class="name"><b>{0}</b></div>', value);
        return String.format(value);
    }

});

Ext.grid.CheckColumn = function(config){
    Ext.apply(this, config);
    if(!this.id){
        this.id = Ext.id();
    }
    this.renderer = this.renderer.createDelegate(this);
};

Ext.grid.CheckColumn.prototype ={

    init : function(grid){
        this.grid = grid;
        this.grid.on('render', function(){
            var view = this.grid.getView();
        }, this);
    },

    renderer : function(v, p, record){
        p.css += ' x-grid3-check-col-td';
        return '<div class="x-grid3-check-col'+(v?'-on':'')+' x-grid3-cc-'+this.id+'">&#160;</div>';
    }

};