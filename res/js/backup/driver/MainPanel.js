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

    this.grid = new ScheduleGrid(this, {
        tbar:[{
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
    }, this, {buffer:250});

    this.grid.store.on('beforeload', this.preview.clear, this.preview);
    this.grid.store.on('load', this.gsm.selectFirstRow, this.gsm);

};

Ext.extend(MainPanel, Ext.TabPanel, {

    loadSchedule : function(schedule){
        this.grid.loadSchedule(schedule.date);
        Ext.getCmp('main-view').setTitle(schedule.name);
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