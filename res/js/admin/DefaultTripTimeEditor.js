DefaultTripTimeEditor = function () {

//    this.reader = new Ext.data.JsonReader({
//        root: 'trips',
//        id: 'id'
//    }, Trip),

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
    
    this.tripTime = new Ext.form.TimeField({
        id: 'trip-time',
        fieldLabel: 'Time',
        width: 250,
        validationEvent: false,
        validateOnBlur: false,
        allowBlank: false,
        msgTarget: 'under',
        triggerAction: 'all',
        displayField: 'time',
        mode: 'local',
        format: 'H:i'
//        listeners:{
//            valid: this.syncShadow,
//            invalid: this.syncShadow,
//            scope: this
//        }
    });


    this.tripAddress = new Ext.form.TextField({
        id: 'trip-address',
        fieldLabel: 'Street Name',
        width: '100%',
        validationEvent: false,
        validateOnBlur: false,
        msgTarget: 'under',
        triggerAction: 'all',
        displayField: 'address',
        mode: 'local',
        listeners: {
            valid: this.syncShadow,
            invalid: this.syncShadow,
            scope: this
        }
    });

    this.tripDestination = new Ext.form.TextField({
        id: 'trip-destination ',
        fieldLabel: 'Destination',
        width: '100%',
        validationEvent: false,
        validateOnBlur: false,
        msgTarget: 'under',
        triggerAction: 'all',
        displayField: 'destination',
        mode: 'local',
        listeners: {
            valid: this.syncShadow,
            invalid: this.syncShadow,
            scope: this
        }
    });
    
    this.panel = new Ext.Panel({
        id: 'main_panel',
//        items: [
//            this.tripAddress,
//            this.tripDestination
//        ],
        border: false,
        bodyStyle: 'background:transparent;padding:10px;'
    });

//    this.form = new Ext.FormPanel({
//        //labelAlign:'top',
//        items: [
//            this.tripTime,
//            this.panel
//        ],
//        border: false,
//        bodyStyle: 'background:transparent;padding:10px;'
//    });

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
                text: 'Add Trip',
                handler: this.onModify,
                scope: this
            }, {
                text: 'Cancel',
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
        debugger;
        for(var i = 0; i < this.tripTimes.length; i ++){
            if (this.tripTimes[i].id === 'trip-time' + tripId){
                timeValue = this.tripTimes[i].value;
            }
        }
        
        // Only process if we found the value
        if (timeValue !== ''){
            console.log('New time value: ', timeValue);
            this.el.mask('Modifying Default Trip...', 'x-mask-loading');

            debugger;
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
//        if (this.tripDate.getValue() === '') {
//            this.tripDate.markInvalid('You must select a date for this trip.');
//        }
//        if (this.tripTime.getValue() === '') {
//            this.tripTime.markInvalid('You must select a time for this trip.');
//        }
//        if (this.tripAddress.getValue() == '') {
//            this.tripAddress.markInvalid('Please provide a pickup location for this trip.');
//        }
//        if (this.tripName.getValue() == '') {
//            this.tripName.markInvalid('Please provide a name for this trip.');
//        }
        this.el.unmask();
    },
    validateUpdate: function (response, options) {
        debugger;
        response = Ext.util.JSON.decode(response.responseText);
        if (response.errors.length === 0) {
            // success
//            var record = new Trip({
//                id: response.record.id,
//                date: response.record.date,
//                time: response.record.time,
//                cid: response.record.cid,
//                name: response.record.name,
//                passengers: response.record.passengers,
//                driver: response.record.driver,
//                phone: response.record.phone,
//                cost: response.record.cost,
//                address_apt: response.record.address_apt,
//                address_num: response.record.address_num,
//                address_street: response.record.address_street,
//                destination: response.record.destination,
//                comments: response.record.comments,
//                timestamp: response.record.timestamp
//            });
//            this.store.add(record);
            this.store.reload();
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
                    },
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