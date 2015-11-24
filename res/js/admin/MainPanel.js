/*
 * Ext JS Library 2.0.2
 * Copyright(c) 2006-2008, Ext JS, LLC.
 * licensing@extjs.com
 *
 * http://extjs.com/license
 */

//Ext.getCmp('mytabs')

MainPanel = function(){

    this.preview = new Ext.Panel({
        id: 'preview',
        region: 'south',
        cls:'preview',
        height: 100,
        autoScroll: true,
        clear: function(){
            this.body.update('');
        }
    });

    this.colour = {
        id:'colour',
        iconCls:'colour-trip',
        text:'Colour Trip',
        scope:this,
        menu: new Ext.menu.ColorMenu ({
            scope:this,
            handler : function(cm, colour) {
                var trip = this.grid.getSelectionModel().getSelected();
                if (trip) {
                    this.colourTrip(trip, colour);
                }
            }
        })
    };

    this.grid = new ScheduleGrid(this, {
        tbar:[{
            iconCls:'add-trip',
            text:'Add Trip',
            handler: this.addTrip,
            scope: this
        }, '-', {
            id:'delete',
            iconCls:'delete-trip',
            text:'Remove Trip',
            scope:this,
            handler: function (){
                var trip = this.grid.getSelectionModel().getSelected();
                if (trip) {
                    this.deleteTrip(trip);
                }
            }
        }, '-',
        this.colour,
        '-', {
            id:'print',
            iconCls:'print-icon',
            text:'Print Schedule',
            scope:this,
            handler: function () {
                window.open('?_format=printerfriendly&date=' + glb_date.dateFormat('Y-m-d'));
            }
        }, '-', {
            split:true,
            text:'Reading Pane',
            tooltip: {title:'Reading Pane',text:'Show, move or hide the Reading Pane'},
            iconCls: 'preview-bottom',
            handler: this.movePreview.createDelegate(this, []),
            menu:{
                id:'reading-menu',
                cls:'reading-menu',
                width:100,
                items: [{
                    text:'Bottom',
                    checked:true,
                    group:'rp-group',
                    checkHandler:this.movePreview,
                    scope:this,
                    iconCls:'preview-bottom'
                },{
                    text:'Right',
                    checked:false,
                    group:'rp-group',
                    checkHandler:this.movePreview,
                    scope:this,
                    iconCls:'preview-right'
                },{
                    text:'Hide',
                    checked:false,
                    group:'rp-group',
                    checkHandler:this.movePreview,
                    scope:this,
                    iconCls:'preview-hide'
                }]
            }
        }, '-', {
            pressed: false,
            enableToggle:true,
            text:'Summary',
            tooltip: {title:'Post Summary',text:'View a short summary of each item in the list'},
            iconCls: 'summary',
            scope:this,
            toggleHandler: function(btn, pressed){
                this.grid.togglePreview(pressed);
            }
        }]
    });

//    this.grid.getView().on("refresh", function (view) {
//        var arLen = view.getRows().length;
//        for (var i = 1, len = arLen; i < len; ++i){
//            view.getRows()[i].style.background = '#000';
//        }
//    });

    MainPanel.superclass.constructor.call(this, {
        id:'main-tabs',
        activeTab:0,
        region:'center',
        margins:'0 5 5 0',
        resizeTabs:true,
        tabWidth:150,
        minTabWidth: 120,
        enableTabScroll: true,
        plugins: new Ext.ux.TabCloseMenu(),
        items: {
            id:'main-view',
            iconCls:'schedule-open',
            layout:'border',
            title:'Loading...',
            hideMode:'offsets',
            items:[
                this.grid, {
                id:'bottom-preview',
                layout:'fit',
                items:this.preview,
                height: 250,
                split: true,
                border:false,
                region:'south'
            }, {
                id:'right-preview',
                layout:'fit',
                border:false,
                region:'east',
                width:350,
                split: true,
                hidden:true
            }]
        }
    });

    this.gsm = this.grid.getSelectionModel();

    this.gsm.on('rowselect', function(sm, index, record){
        App.getTemplate().overwrite(this.preview.body, record.data);
    }, this, {buffer:500});

    this.grid.store.on('beforeload', this.preview.clear, this.preview);
    this.grid.store.on('load', this.gsm.selectFirstRow, this.gsm);

};

Ext.extend(MainPanel, Ext.TabPanel, {

    loadSchedule : function(schedule){
        this.grid.loadSchedule(schedule.date);
        Ext.getCmp('main-view').setTitle(schedule.name);
    },

    addTrip : function(btn){
        if (!this.win){
            this.win = new TripWindow(this.grid.store);
            this.win.on('addtrip', this.addTrip, this);
        }
        this.win.show(btn);
    },

    deleteTrip : function (trip){
        var trip = this.grid.store.getById(trip.data.id);
        Ext.Msg.confirm('Remove Trip', 'Are you sure you want to remove this trip?' + "<br />"
            + trip.data.date.dateFormat('M d, Y') + ' ' + trip.data.time.dateFormat('H:i')
            + ' - ' + trip.data.name,
            function (confirm) {
                if (confirm == 'yes') {
                    /* */
                    Ext.Ajax.request({
                        url: 'res/php/trip-remove.php',
                        params: {
                            id:        trip.data.id,
                            date:      trip.data.date.dateFormat('Y-m-d'),
                            time:      trip.data.time.dateFormat('H:i:s'),
                            timestamp: trip.data.timestamp
                        },
                        success: function (response, options) {
                            response = Ext.util.JSON.decode(response.responseText);
                            if (response.errors.length == 0) {
                                //this.grid.store.remove(trip);
                                this.grid.store.reload();
                            } else {
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
            }, this);

    },

    colourTrip : function (trip, colour) {
        if (!colour.length) {
            return;
        }
        var trip = this.grid.store.getById(trip.data.id);
        //this.grid.store.remove(trip);
        /* */
        Ext.Ajax.request({
            url: 'res/php/trip-edit.php',
            params: {
                id:    trip.data.id,
                field: 'colour',
                value: colour,
                date:  glb_date.dateFormat('Y-m-d')
                //date:  trip.data.date.dateFormat('Y-m-d')
            },
            success: function (response, options) {
                response = Ext.util.JSON.decode(response.responseText);
                if (response.errors.length == 0) {
                    // success
                    this.grid.store.reload();
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
        //this.grid.store.reload();
    },

    movePreview : function(m, pressed){
        if(!m){ // cycle if not a menu item click
            var readMenu = Ext.menu.MenuMgr.get('reading-menu');
            readMenu.render();
            var items = readMenu.items.items;
            var b = items[0], r = items[1], h = items[2];
            if(b.checked){
                r.setChecked(true);
            }else if(r.checked){
                h.setChecked(true);
            }else if(h.checked){
                b.setChecked(true);
            }
            return;
        }
        if(pressed){
            var preview = this.preview;
            var right = Ext.getCmp('right-preview');
            var bot = Ext.getCmp('bottom-preview');
            var btn = this.grid.getTopToolbar().items.get(6);
            switch(m.text){
                case 'Bottom':
                    right.hide();
                    bot.add(preview);
                    bot.show();
                    bot.ownerCt.doLayout();
                    btn.setIconClass('preview-bottom');
                    break;
                case 'Right':
                    bot.hide();
                    right.add(preview);
                    right.show();
                    right.ownerCt.doLayout();
                    btn.setIconClass('preview-right');
                    break;
                case 'Hide':
                    preview.ownerCt.hide();
                    preview.ownerCt.ownerCt.doLayout();
                    btn.setIconClass('preview-hide');
                    break;
            }
        }
    }

});