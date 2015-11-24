LoginWindow = function(store) {

    this.loginUsername = new Ext.form.TextField({
        id: 'login-username',
        fieldLabel: 'Username',
        emptyText: '',
        width:'100%',
        validationEvent: false,
        validateOnBlur: false,
        msgTarget: 'under',
        triggerAction: 'all',
        displayField: 'username',
        mode: 'local',
        listeners:{
            valid: this.syncShadow,
            invalid: this.syncShadow,
            scope: this
        }
    });

    this.loginPassword = new Ext.form.Field({
        id: 'login-password',
        fieldLabel: 'Password',
        emptyText: '',
        width:'100%',
        validationEvent: false,
        validateOnBlur: false,
        msgTarget: 'under',
        triggerAction: 'all',
        displayField: 'password',
        inputType: 'password',
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
                this.loginUsername,
                this.loginPassword
            ],
        border: false,
        bodyStyle:'background:transparent;padding:10px;'
    });

    LoginWindow.superclass.constructor.call(this, {
        title: '<img src="res/img/logos/logo-airporter.gif" alt="Nanaimo Airporter"><img src="res/img/logos/logo-shuttle.gif" alt="AC Shuttle">',
        iconCls: 'ico-login',
        id: 'login-win',
        autoHeight: true,
        width: 450,
        y: 300,
        //resizable: false,
        //plain:true,
        closable: false,
        modal: true,
        //autoScroll: true,
        closeAction: 'hide',
        buttons:[{
            text: 'Login',
            handler: this.onLogin,
            scope: this
        }],
        items: this.form
    });

}

Ext.extend(LoginWindow, Ext.Window, {

    show : function(){
        if(this.rendered){
            //
            this.loginUsername.setValue('');
            this.loginPassword.setValue('');
            //
        }
        LoginWindow.superclass.show.apply(this, arguments);
    },

    onLogin: function() {
        this.el.mask('Authenticating Login...', 'x-mask-loading');
        //
        Ext.Ajax.request({
            url: 'res/php/login.php',
            params: {
                username: this.loginUsername.getValue(),
                password: this.loginPassword.getValue()
            },
            success: this.validateLogin,
            failure: this.markInvalid,
            scope: this
        });
        //
    },

    markInvalid : function(response){
//        if (this.loginUsername.getValue() == '') {
//            this.loginUsername.markInvalid('Username is a required field.');
//        }
//        if (this.loginPassword.getValue() == '') {
//            this.loginPassword.markInvalid('Password is a required field.');
//        }
        this.el.unmask();
    },

    validateLogin : function(response, options){
        response = Ext.util.JSON.decode(response.responseText);
        if (response.errors.length == 0) {
            // success
            this.el.unmask();
            this.hide();
            // reload page
            window.location.reload();
            //history.go(0);
            //window.location.href=window.location.href;
        } else {
            // error(s) returned
            Ext.Msg.show({
               title: 'Error Occurred',
               msg: response.errors[0],
               buttons: Ext.Msg.OK,
               animEl: 'elId',
               icon: Ext.MessageBox.ERROR
            });
            //
            this.markInvalid();
        }
    }

});