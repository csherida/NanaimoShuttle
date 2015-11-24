/*
 * Ext JS Library 2.0.2
 * Copyright(c) 2006-2008, Ext JS, LLC.
 * licensing@extjs.com
 *
 * http://extjs.com/license
 */

SchedulePanel = function() {

    this.this_month = new Ext.DatePicker({
        id: 'calendar-this_month',
        scheduler: this,
        autoShow: true,
        todayText: 'Today\'s Schedule',
        handler: function(date) {
            glb_date = date.getValue();
            this.scheduler.fireEvent('scheduleselect', { date: glb_date.format('Y-m-d'), name: glb_date.format('F jS, Y'), text: glb_date.format('F jS, Y')});
        }
    });

    next_month = new Date();
    if (next_month.getMonth() + 1 < 12) {
        next_month.setMonth(next_month.getMonth() + 1);
    } else {
        next_month.setMonth(0);
    }

    this.next_month = new Ext.DatePicker({
        id: 'calendar-next_month',
        scheduler: this,
        autoShow: true,
        value: next_month,
        todayText: 'Today\'s Schedule',
        handler: function(date) {
            glb_date = date.getValue();
            this.scheduler.fireEvent('scheduleselect', { date: glb_date.format('Y-m-d'), name: glb_date.format('F jS, Y'), text: glb_date.format('F jS, Y')});
        }
    });

    SchedulePanel.superclass.constructor.call(this, {
        id:'schedule-tree',
        region:'west',
        title:'Schedules',
        split:true,
        width: 195,
        minSize: 180,
        maxSize: 400,
        collapsible: true,
        margins:'5 0 5 5',
        cmargins:'5 5 5 5',
        rootVisible:false,
        lines:false,
        autoScroll:true,
        root: new Ext.tree.TreeNode('Schedule Viewer'),
        collapseFirst:false,
        items: [this.this_month, this.next_month]
    });

//    this.schedules = this.root.appendChild(
//        new Ext.tree.TreeNode({
//            text:'Schedule List',
//            cls:'schedule-node',
//            expanded:true
//        })
//    );

    this.getSelectionModel().on({
        'beforeselect' : function(sm, node){
             return node.isLeaf();
        },
        'selectionchange' : function(sm, node){
            if(node){
                this.fireEvent('scheduleselect', node.attributes);
            }
            //this.getTopToolbar().items.get('delete').setDisabled(!node);
        },
        scope:this
    });

    this.addEvents({scheduleselect:true});

    this.on('contextmenu', this.onContextMenu, this);
};

Ext.extend(SchedulePanel, Ext.tree.TreePanel, {

    onContextMenu : function(node, e){
        if(!this.menu){ // create context menu on first right click
            this.menu = new Ext.menu.Menu({
                id:'schedules-ctx',
                items: [{
                    id:'load',
                    iconCls:'load-icon',
                    text:'Open Schedule',
                    scope: this,
                    handler:function(){
                        this.ctxNode.select();
                    }
                }]
            });
            this.menu.on('hide', this.onContextHide, this);
        }
        if(this.ctxNode){
            this.ctxNode.ui.removeClass('x-node-ctx');
            this.ctxNode = null;
        }
        if(node.isLeaf()){
            this.ctxNode = node;
            this.ctxNode.ui.addClass('x-node-ctx');
            this.menu.items.get('load').setDisabled(node.isSelected());
            this.menu.showAt(e.getXY());
        }
    },

    onContextHide : function(){
        if(this.ctxNode){
            this.ctxNode.ui.removeClass('x-node-ctx');
            this.ctxNode = null;
        }
    },

    selectSchedule: function(id){
        this.getNodeById(id).select();
    },

//    addSchedule : function(attrs, inactive, preventAnim){
//        var exists = this.getNodeById(attrs.date);
//        if(exists){
//            if(!inactive){
//                exists.select();
//                exists.ui.highlight();
//            }
//            return;
//        }
//        Ext.apply(attrs, {
//            iconCls: 'schedule-icon',
//            leaf:true,
//            cls:'schedule',
//            id: attrs.date
//        });
//        var node = new Ext.tree.TreeNode(attrs);
//        this.schedules.appendChild(node);
//        if(!inactive){
//            if(!preventAnim){
//                Ext.fly(node.ui.elNode).slideIn('l', {
//                    callback: node.select, scope: node, duration: .4
//                });
//            }else{
//                node.select();
//            }
//        }
//        return node;
//    },

    // prevent the default context menu when you miss the node
    afterRender : function(){
        SchedulePanel.superclass.afterRender.call(this);
        this.el.on('contextmenu', function(e){
            e.preventDefault();
        });
    }

});