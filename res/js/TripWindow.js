TripWindow = function(store) {

    this.store = store;

    this.tripDate = new Ext.form.DateField({
        id: 'trip-date',
        fieldLabel: 'Date',
        width: 250,
        validationEvent: false,
        validateOnBlur: false,
        allowBlank:false,
        msgTarget: 'under',
        format: 'Y-m-d',
        value: glb_date,
        listeners:{
            valid: this.syncShadow,
            invalid: this.syncShadow,
            scope: this
        }
    });
    //this.tripDate.setValue(glb_date.format('m/d/Y'));

    this.tripTime = new Ext.form.TimeField({
        id: 'trip-time',
        fieldLabel: 'Time',
        width: 250,
        validationEvent: false,
        validateOnBlur: false,
        allowBlank:false,
        msgTarget: 'under',
        triggerAction: 'all',
        displayField: 'time',
        mode: 'local',
        format: 'H:i',
        listeners:{
            valid: this.syncShadow,
            invalid: this.syncShadow,
            scope: this
        }
    });

    this.tripDriver = new Ext.form.TextField({
        id: 'trip-driver',
        fieldLabel: 'Driver',
        emptyText: '',
        width:'100%',
        validationEvent: false,
        validateOnBlur: false,
        msgTarget: 'under',
        triggerAction: 'all',
        displayField: 'driver',
        mode: 'local',
        listeners:{
            valid: this.syncShadow,
            invalid: this.syncShadow,
            scope: this
        }
    });

    this.tripCID = new Ext.form.TextField({
        id: 'trip-cid',
        fieldLabel: 'Call Taker ID',
        emptyText: '',
        width:'100%',
        validationEvent: false,
        validateOnBlur: false,
        msgTarget: 'under',
        triggerAction: 'all',
        displayField: 'cid',
        mode: 'local',
        listeners:{
            valid: this.syncShadow,
            invalid: this.syncShadow,
            scope: this
        }
    });

    this.tripName = new Ext.form.TextField({
        id: 'trip-name',
        fieldLabel: 'Name',
        emptyText: '',
        width:'100%',
        validationEvent: false,
        validateOnBlur: false,
        msgTarget: 'under',
        triggerAction: 'all',
        displayField: 'name',
        mode: 'local',
        listeners:{
            valid: this.syncShadow,
            invalid: this.syncShadow,
            scope: this
        }
    });

    this.tripPassengers = new Ext.form.NumberField({
        id: 'trip-passengers',
        allowNegative: false,
        fieldLabel: 'Passengers',
        width:'100%',
        validationEvent: false,
        validateOnBlur: false,
        msgTarget: 'under',
        triggerAction: 'all',
        displayField: 'passengers',
        mode: 'local',
        listeners:{
            valid: this.syncShadow,
            invalid: this.syncShadow,
            scope: this,
            change: this.onCalcRefresh
        }
    });

    this.tripAddressApt = new Ext.form.TextField({
        id: 'trip-address-apt',
        fieldLabel: 'Apartment #',
        width:'100%',
        validationEvent: false,
        validateOnBlur: false,
        msgTarget: 'under',
        triggerAction: 'all',
        displayField: 'address-apt',
        mode: 'local',
        listeners:{
            valid: this.syncShadow,
            invalid: this.syncShadow,
            scope: this,
            change: this.onCalcRefresh
        }
    });
    
    this.tripAddressHouse = new Ext.form.TextField({
        id: 'trip-address-house',
        fieldLabel: 'House #',
        width:'100%',
        validationEvent: false,
        validateOnBlur: false,
        msgTarget: 'under',
        triggerAction: 'all',
        displayField: 'address-house',
        mode: 'local',
        listeners:{
            valid: this.syncShadow,
            invalid: this.syncShadow,
            scope: this,
            change: this.onCalcRefresh
        }
    });    
    
    this.tripAddress = new Ext.form.TextField({
        id: 'trip-address',
        fieldLabel: 'Street Name',
        width:'100%',
        validationEvent: false,
        validateOnBlur: false,
        msgTarget: 'under',
        triggerAction: 'all',
        displayField: 'address',
        mode: 'local',
        listeners:{
            valid: this.syncShadow,
            invalid: this.syncShadow,
            scope: this,
            change: this.onCalcRefresh
        }
    });

    this.tripDestination = new Ext.form.TextField({
        id: 'trip-destination ',
        fieldLabel: 'Destination',
        width:'100%',
        validationEvent: false,
        validateOnBlur: false,
        msgTarget: 'under',
        triggerAction: 'all',
        displayField: 'destination',
        mode: 'local',
        listeners:{
            valid: this.syncShadow,
            invalid: this.syncShadow,
            scope: this
        }
    });

    this.tripPhone = new Ext.form.TextField({
        id: 'trip-phone ',
        fieldLabel: 'Phone',
        width:'100%',
        validationEvent: false,
        validateOnBlur: false,
        msgTarget: 'under',
        triggerAction: 'all',
        displayField: 'phone',
        mode: 'local',
        listeners:{
            valid: this.syncShadow,
            invalid: this.syncShadow,
            scope: this
        }
    });

    this.tripCost = new Ext.form.NumberField({
        id: 'trip-cost',
        allowNegative: false,
        fieldLabel: 'Cost',
        width:'100%',
        validationEvent: false,
        validateOnBlur: false,
        msgTarget: 'under',
        triggerAction: 'all',
        displayField: 'cost',
        mode: 'local',
        listeners:{
            valid: this.syncShadow,
            invalid: this.syncShadow,
            scope: this
        }
    });

    this.tripComments = new Ext.form.TextArea({
        id: 'trip-comments',
        fieldLabel: 'Comments',
        //hideLabel: true,
        emptyText: '',
        width:'100%',
        height: 40,
        validationEvent: false,
        validateOnBlur: false,
        msgTarget: 'under',
        triggerAction: 'all',
        displayField: 'comments',
        mode: 'local',
        listeners:{
            valid: this.syncShadow,
            invalid: this.syncShadow,
            scope: this
        }
    });

    this.form = new Ext.FormPanel({
        //labelAlign:'top',
        items: [
                this.tripDate,
                this.tripTime,
                this.tripCID,
                this.tripName,
                this.tripPassengers,
                this.tripAddressApt,
                this.tripAddressHouse,
                this.tripAddress,
                this.tripDestination,
                this.tripPhone,
                this.tripCost,
                this.tripDriver,
                this.tripComments
            ],
        border: false,
        bodyStyle:'background:transparent;padding:10px;'
    });

    TripWindow.superclass.constructor.call(this, {
        title: 'Add Trip',
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

        buttons:[{
            text: 'Add Trip',
            handler: this.onAdd,
            scope: this
        },{
            text: 'Cancel',
            handler: this.hide.createDelegate(this, [])
        }],

        items: this.form
    });

    this.addEvents({add:true});
}

Ext.extend(TripWindow, Ext.Window, {

    show : function(){
        if(this.rendered){
            //
            //this.tripDate.setValue('');
            this.tripTime.setValue('');
            this.tripCID.setValue('');
            this.tripDriver.setValue('');
            this.tripName.setValue('');
            this.tripPassengers.setValue('');
            this.tripAddressApt.setValue('');
            this.tripAddressHouse.setValue('');
            this.tripAddress.setValue('');
            this.tripDestination.setValue('');
            this.tripPhone.setValue('');
            this.tripCost.setValue('');
            this.tripComments.setValue('');
            this.tripDate.setValue(glb_date);
            //
        }
        TripWindow.superclass.show.apply(this, arguments);
    },

    onCalcRefresh: function() {
    	if ( this.tripPassengers.isValid() && this.tripAddress.isValid() ) {
    		var addr = this.tripAddress.getRawValue();
    		var pass = this.tripPassengers.getRawValue();
		
    		if ( addr.length > 0 && pass.length > 0 ) {
    			this.el.mask('Calculating cost...');
    			
                Ext.Ajax.request({
                    url: 'res/php/trip-cost.php',
                    params: {
                        passengers:     pass,
                        address:        addr
                	},
                	success: this.tripCalculated,
                	failure: this.tripCalculated,
                	scope: this
                });
    		}
    	}
    },
    
    tripCalculated : function(response, options) {
    	this.el.unmask();
    	
        var response = Ext.util.JSON.decode(response.responseText);
        if (response.cost > 0) {
        	this.tripCost.setValue( response.cost );
        }
    },
    
    calcFailed : function( response ) {
    	this.el.unmask();
    },
    
    onAdd: function() {
        this.el.mask('Creating Trip...', 'x-mask-loading');
        //
        var date = this.tripDate.getValue() ? this.tripDate.getValue().dateFormat('Y-m-d') : '';
        //var date = this.tripDate.getValue();
        var time = this.tripTime.getValue();
        var cid  = this.tripCID.getValue();
        var driv = this.tripDriver.getValue();
        var name = this.tripName.getValue();
        var pass = this.tripPassengers.getValue();
        var addr_apt = this.tripAddressApt.getValue();
        var addr_house = this.tripAddressHouse.getValue();
        var addr = this.tripAddress.getValue();
        var dest = this.tripDestination.getValue();
        var phon = this.tripPhone.getValue();
        var cost = this.tripCost.getValue();
        var comm = this.tripComments.getValue();
        //
        Ext.Ajax.request({
            url: 'res/php/trip-add.php',
            params: {
                date:        date,
                time:        time,
                cid:         cid,
                driver:      driv,
                name:        name,
                passengers:  pass,
                address_apt: addr_apt,
                address_num: addr_house,
                address:     addr,
                destination: dest,
                phone:       phon,
                cost:        cost,
                comments:    comm
            },
            success: this.validateTrip,
            failure: this.markInvalid,
            scope: this
        });
        //
    },

    markInvalid : function(response){
        //response.responseText
        if (this.tripDate.getValue() == '') {
            this.tripDate.markInvalid('You must select a date for this trip.');
        }
        if (this.tripTime.getValue() == '') {
            this.tripTime.markInvalid('You must select a time for this trip.');
        }
//        if (this.tripAddress.getValue() == '') {
//            this.tripAddress.markInvalid('Please provide a pickup location for this trip.');
//        }
//        if (this.tripName.getValue() == '') {
//            this.tripName.markInvalid('Please provide a name for this trip.');
//        }
        this.el.unmask();
    },

    validateTrip : function(response, options){
        response = Ext.util.JSON.decode(response.responseText);
        if (response.errors.length == 0) {
            // success
            var record = new Trip({
                id          : response.record.id,
                date        : response.record.date,
                time        : response.record.time,
                cid         : response.record.cid,
                name        : response.record.name,
                passengers  : response.record.passengers,
                driver      : response.record.driver,
                phone       : response.record.phone,
                cost        : response.record.cost,
                address_apt     : response.record.address_apt,
                address_num     : response.record.address_num,
                address_street     : response.record.address_street,
                destination : response.record.destination,
                comments    : response.record.comments,
                timestamp   : response.record.timestamp
            });
            this.store.add(record);
            this.store.reload();
            this.el.unmask();
            this.hide();
        } else {
            // error(s) returned
            this.markInvalid();
        }
    }

});