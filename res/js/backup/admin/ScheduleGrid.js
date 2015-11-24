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
        width: 10
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
        width: 40,
        editor: new Ext.form.DateField({
            format: 'Y-m-d'
        })
      },{
        id: 'time',
        header: "Time",
        dataIndex: 'time',
        renderer: formatTime,
        sortable:true,
        width: 30,
        groupable: false,
        editor: new Ext.form.TimeField({
            format: 'H:i'
        })
      }, checkColumn, {
        id: 'cid',
        header: "CID",
        dataIndex: 'cid',
        renderer:  formatCID,
        sortable:true,
        width: 30,
        editor: new Ext.form.TextField({
        })
      },{
        id: 'driver',
        header: "Driver",
        dataIndex: 'driver',
        renderer:  formatDriver,
        sortable:true,
        width: 30,
        editor: new Ext.form.TextField({
        })
      },{
        id: 'name',
        header: "Name",
        dataIndex: 'name',
        sortable:true,
        renderer: this.formatName,
        width: 30,
        editor: new Ext.form.TextField({
        })
      },{
        id: 'passengers',
        header: "#",
        width: 5,
        dataIndex: 'passengers',
        sortable:true,
        groupable: false,
        editor: new Ext.form.NumberField({
            allowNegative: false,
            maxValue: 100000
        }),
        summaryType:'totalPassengers'
      },{
        id: 'address',
        header: "Address",
        dataIndex: 'address',
        sortable:true,
        width: 30,
        editor: new Ext.form.TextField({
        })
      },{
        id: 'destination',
        header: "Destination",
        dataIndex: 'destination',
        sortable:true,
        width: 30,
        editor: new Ext.form.TextField({
        })
      },{
        id: 'phone',
        header: "Phone",
        dataIndex: 'phone',
        sortable:true,
        width: 30,
        editor: new Ext.form.TextField({
        })
      },{
        id: 'cost',
        header: "Cost",
        dataIndex: 'cost',
        sortable:true,
        width: 30,
        renderer: 'usMoney',
        editor: new Ext.form.NumberField({
            allowNegative: false,
            maxValue: 100000
        }),
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

    this.on('afterEdit', function (row) {
        //row.field
        //row.originalValue
        //row.record.data.id
        //row.value
        /* */

        if (row.field == 'date') {
            row.value = row.value.dateFormat('Y-m-d');
        }

        Ext.Ajax.request({
            url: 'res/php/trip-edit.php',
            params: {
                id:    row.record.data.id,
                field: row.field,
                value: row.value,
                date:  glb_date.dateFormat('Y-m-d')
                //date:  row.record.data.date.dateFormat('Y-m-d')
            },
            success: function (response, options) {
                response = Ext.util.JSON.decode(response.responseText);
                if (response.errors.length == 0) {
                    // success
                    this.store.reload();
                } else {
                    // error
                    Ext.Msg.show({
                       title: 'Error Occurred',
                       msg: response.errors,
                       buttons: Ext.Msg.OK,
                       animEl: 'elId',
                       icon: Ext.MessageBox.ERROR
                    });
                }
            },
            failure: function () {
                // error
                Ext.Msg.show({
                   title: 'Error Occurred',
                   msg: 'Server script error. Please try again.',
                   buttons: Ext.Msg.OK,
                   animEl: 'elId',
                   icon: Ext.MessageBox.ERROR
                });
            },
            scope: this
        });
        /* */
    });

};

Ext.extend(ScheduleGrid, Ext.grid.EditorGridPanel, {

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
            p.body += '<a href="javascript:void(0);" onclick="mainPanel.grid.editComments(' + record.data.id + ');"><img src="res/img/ico/pencil.png" border="0" /></a> &nbsp; ';
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
    },

    editComments: function (id) {
        record = this.store.getById(id);
        Ext.MessageBox.show({
           title: 'Trip Comments',
           msg: 'Please enter your comment:',
           width: 300,
           buttons: Ext.MessageBox.OKCANCEL,
           multiline: true,
           value: record.data.comments,
           scope: this,
           fn: function (btn, text) {
               if (btn == 'ok') {
                    /* */
                    Ext.Ajax.request({
                        url: 'res/php/trip-edit.php',
                        params: {
                            id:    record.data.id,
                            field: 'comments',
                            value: text,
                            date:  record.data.date.dateFormat('Y-m-d')
                        },
                        success: function (response, options) {
                            response = Ext.util.JSON.decode(response.responseText);
                            if (response.errors.length == 0) {
                                // success
                                this.store.reload();
                            } else {
                                // error
                                Ext.Msg.show({
                                   title: 'Error Occurred',
                                   msg: response.errors,
                                   buttons: Ext.Msg.OK,
                                   animEl: 'elId',
                                   icon: Ext.MessageBox.ERROR
                                });
                            }
                        },
                        failure: function () {
                            // error
                            Ext.Msg.show({
                               title: 'Error Occurred',
                               msg: 'Server script error. Please try again.',
                               buttons: Ext.Msg.OK,
                               animEl: 'elId',
                               icon: Ext.MessageBox.ERROR
                            });
                        },
                        scope: this
                    });
                    /* */
               }
           }
       });
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
            view.mainBody.on('mousedown', this.onMouseDown, this);
        }, this);
    },

    onMouseDown : function(e, t){
        if(t.className && t.className.indexOf('x-grid3-cc-'+this.id) != -1){
            e.stopEvent();
            var index = this.grid.getView().findRowIndex(t);
            var record = this.grid.store.getAt(index);
            record.set(this.dataIndex, !record.data[this.dataIndex]);
            /* */
            Ext.Ajax.request({
                url: 'res/php/trip-edit.php',
                params: {
                    id:    record.data.id,
                    field: 'sent',
                    value: record.data.sent,
                    date:  record.data.date.dateFormat('Y-m-d')
                },
                success: function (response, options) {
                    response = Ext.util.JSON.decode(response.responseText);
                    if (response.errors.length == 0) {
                        // success
                        this.store.reload();
                    } else {
                        // error
                        Ext.Msg.show({
                           title: 'Error Occurred',
                           msg: response.errors,
                           buttons: Ext.Msg.OK,
                           animEl: 'elId',
                           icon: Ext.MessageBox.ERROR
                        });
                    }
                },
                failure: function () {
                    // error
                    Ext.Msg.show({
                       title: 'Error Occurred',
                       msg: 'Server script error. Please try again.',
                       buttons: Ext.Msg.OK,
                       animEl: 'elId',
                       icon: Ext.MessageBox.ERROR
                    });
                },
                scope: this
            });
            /* */
        }
    },

    renderer : function(v, p, record){
        p.css += ' x-grid3-check-col-td';
        return '<div class="x-grid3-check-col'+(v?'-on':'')+' x-grid3-cc-'+this.id+'">&#160;</div>';
    }

};