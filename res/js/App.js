/*
 * Ext JS Library 2.0.2
 * Copyright(c) 2006-2008, Ext JS, LLC.
 * licensing@extjs.com
 *
 * http://extjs.com/license
 */

App = {};

var schedules = null;
var mainPanel = null;

Ext.onReady(function(){

    Ext.QuickTips.init();

	Ext.menu.RangeMenu.prototype.icons = {
	  gt: 'res/img/ico/filter_greater_then.png',
	  lt: 'res/img/ico/filter_less_then.png',
	  eq: 'res/img/ico/filter_equals.png'
	};
	Ext.grid.filter.StringFilter.prototype.icon = 'res/img/ico/filter_find.png';

//    Ext.state.Manager.setProvider(new Ext.state.SessionProvider({state: Ext.appState}));

    var tpl = Ext.Template.from('preview-tpl', {
        compiled:true,
        getBody : function(v, all){
            return Ext.util.Format.stripScripts(v || all.comments);
        }
    });

    App.getTemplate = function(){
        return tpl;
    }

    schedules = new SchedulePanel();
    mainPanel = new MainPanel();

    schedules.on('scheduleselect', function(schedule){
        console.log('About to load the schedule.', mainPanel);
        if (mainPanel.recycleBinButton)
            mainPanel.recycleBinButton.toggle(false, true);
        mainPanel.grid.store.removeAll();
        mainPanel.loadSchedule(schedule);
    });
    
    mainPanel.on('recycleselect', function(schedule){
        console.log('About to get recycled items.');
        mainPanel.loadSchedule(schedule);
    });

    var viewport = new Ext.Viewport({
        layout:'border',
        items:[
//            new Ext.BoxComponent({ // raw element
//                region:'north',
//                el: 'header',
//                height:32
//            }),
            schedules,
            mainPanel
         ]
    });

    //schedules.loadSchedule({ date: glb_date.format('Y-m-d'), name: glb_date.format('F jS, Y'), text: glb_date.format('F jS, Y')});
    schedules.fireEvent('scheduleselect', { date: glb_date.format('Y-m-d'), name: glb_date.format('F jS, Y'), text: glb_date.format('F jS, Y')});

    //
    //Ext.query('.x-date-bottom')[0].style.display = 'none';
    Ext.query('.x-date-bottom')[1].style.display = 'none';

    //
    try {
        mainPanel.preview.ownerCt.hide();
        mainPanel.preview.ownerCt.ownerCt.doLayout();
        mainPanel.grid.getTopToolbar().items.get(6).setIconClass('preview-hide');
    } catch (e) {
        //alert(e);
    }

});