DefaultTripTimeEditor = function(gridStore) {
    
    this.gridStore = gridStore;

    this.store = new Ext.data.JsonStore({
        root: 'trips',
        scope: this,
        //id: 'id',
        autoLoad: true,
        fields: ['id', 'time', 'name', 'address_street', 'destination'],
        url: 'res/php/defaults-schedule-load.php',
        //reader: this.reader,
        //fields: ['id', 'name', 'passengers', 'driver', 'sent', 'phone', 'cost', 'address', 'destination', {name: 'timestamp', type: 'date', dateFormat: 'Y-m-d H:i:s'}]
        listeners: {
            scope: this,
            load: function (store, trips, options) {
                console.log('Received default trips: ', trips);
                this.populateScreen(trips);
            },
            loadexception: function (proxy, options, response) {
                console.log('We have an error message.', response);
            }
        }
    });
    
    this.tripTimes = [];
    
    this.panel = new Ext.Panel({
        id: 'main_panel',
//        items: [
//            this.tripAddress,
//            this.tripDestination
//        ],
        border: false,
        bodyStyle: 'background:transparent;padding:10px;'
    });

    DefaultTripTimeEditor.superclass.constructor.call(this, {
        title: 'Default Trip Time Editor',
        iconCls: 'add-trip',
        id: 'add-trip-win',
        autoHeight: true,
        width: 400,
        //resizable: false,
        //plain:true,
        modal: true,
        y: 0,
        //autoScroll: true,
        closeAction: 'hide',
        buttons: [{
                text: 'Close',
                handler: this.hide.createDelegate(this, [])
            }],
        items: this.panel
    });

    this.addEvents({add: true});
};

Ext.extend(DefaultTripTimeEditor, Ext.Window, {
    show: function () {
        if (this.rendered) {
            //
            //
        }
        TripWindow.superclass.show.apply(this, arguments);
    },
    onModify: function (btn, event) {
        var tripId = btn.id.replace('btn','');
        var timeValue = '';

        for(var i = 0; i < this.tripTimes.length; i ++){
            if (this.tripTimes[i].id === 'trip-time' + tripId){
                timeValue = this.tripTimes[i].value;
            }
        }
        
        // Only process if we found the value
        if (timeValue !== ''){
            console.log('New time value: ', timeValue);
            this.el.mask('Modifying Default Trip...', 'x-mask-loading');

            var effectiveDate = (new Date()).dateFormat('Y-m-d');
            //
            Ext.Ajax.request({
                url: 'res/php/defaults-schedule-change.php',
                params: {
                    trip_id: tripId,
                    time: timeValue,
                    effective_date: effectiveDate
                },
                success: this.validateUpdate,
                failure: this.failureNotification,
                scope: this
            });
        }
    },
    failureNotification: function (response) {
        console.log('Error calling default trip time editor', response.responseText);
        this.el.unmask();
    },
    validateUpdate: function (response, options) {

        response = Ext.util.JSON.decode(response.responseText);
        if (response.errors.length === 0) {
            this.gridStore.reload();
            this.el.unmask();
            this.hide();
        } else {
            // error(s) returned
            this.failureNotification(response);
        }
    },
    // This function will loop through all of the trips and create the fields on the screen
    populateScreen: function (trips) {
        for (var i = 0; i < trips.length; i++) {
            //var id = trips[i].get('id');
            var tripId = trips[i].get('id');
            
            var idLabel = new Ext.form.Label({
                id: 'label' + id,
                width: '50',
                text: tripId
            });
            
            var street = new Ext.form.Label({
                id: 'address' + tripId,
                width: '100',
                html: trips[i].get('address_street')
            });
            //this.form.items.add(street);
            
            var tripTimeRecord = new Ext.form.TimeField({
                id: 'trip-time' + tripId,
                fieldLabel: 'Time',
                width: 100,
                format: 'H:i',
                value: this.formatTime(trips[i].get('time'))
            });
            
            this.tripTimes.push(tripTimeRecord);
            
            var button = new Ext.Button({
                //id: 'btn' + trips[i].get('id'),
                text: 'Change Time',
                //handler: this.onModify,
                scope: this
            });
            
            var container = new Ext.FormPanel({
                id: 'panel' + id,
                layout: 'column',
                items: [
                    idLabel,
                    street,
                    tripTimeRecord,
                    {
                        border:false,
                        width: 100,
                        items: { xtype:'button', id: 'btn' + tripId, text: 'Change Time', scope: this, handler: this.onModify },
                        bodyStyle: 'background:transparent;padding;'
                    }
                ],
                bodyStyle: 'background:transparent;padding:5px;'
            });
            
            this.findById('main_panel').add(container);
            //this.findById(id + 'panel').add(button);
            this.findById('main_panel').doLayout();
        }
                
    },
    
    formatTime: function(value){
        if (value instanceof Date) {
            return value ? value.dateFormat('H:i') : '';
        } else {
            var dt  = ('01-01-1970 ' + value).split(/\-|\s/);
            dat = new Date(dt.slice(0,3).reverse().join('/')+' '+dt[3]);
            return dat.dateFormat('H:i');
        }
    }
});