
//function print() {
    Ext.onPrinting(function(){

          //Ext.addStyleSheet("printer-friendly-array-grid.css");
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

            function formatSent(value){
                return ((value == true) ? '<font face="wingdings" size="+1">ü</font>' : '<font face="webdings">r</font>');
                //return ((value == true) ? '<font face="wingdings" size="+1">þ</font>' : '<font face="wingdings" size="+1">ý</font>');
            };

          /*Ext.state.Manager.setProvider(new Ext.state.CookieProvider());*/

          reader = new Ext.data.JsonReader({
            root: 'trips',
            id: 'id'
          }, Trip),

          store = new Ext.data.Store({
            url: 'res/php/schedule-load.php',
            reader: reader
          });

          store.baseParams = {
            date: glb_date.dateFormat('Y-m-d')
          };

          store.setDefaultSort('timestamp', "ASC");

          store.load();

          columns = [{
            width: 20,
            id: 'date',
            header: "Date",
            dataIndex: 'date',
            renderer:  formatDate
          },{
            width: 20,
            id: 'time',
            header: "Time",
            dataIndex: 'time',
            renderer: formatTime
          },{
            width: 20,
            id: 'sent',
            header: "Sent",
            dataIndex: 'sent',
            renderer:  formatSent
          },{
            id: 'cid',
            header: "CID",
            dataIndex: 'cid',
            renderer:  formatCID
          },{
            id: 'driver',
            header: "Driver",
            dataIndex: 'driver',
            renderer:  formatDriver
          },{
            id: 'name',
            header: "Name",
            dataIndex: 'name'
          },{
            id: 'passengers',
            header: "#",
            dataIndex: 'passengers'
          },{
            id: 'address',
            header: "Address",
            dataIndex: 'address'
          },{
            id: 'destination',
            header: "Destination",
            dataIndex: 'destination'
          },{
            id: 'phone',
            header: "Phone",
            dataIndex: 'phone'
          },{
            id: 'cost',
            header: "Cost",
            dataIndex: 'cost',
            renderer: 'usMoney'
        }];

        var printable = new Ext.ux.grid.PrinterGridPanel({
            border: true,
            bodyBorder: true,
            store: store,
            columns: columns,
            stateId: 'array-grid',
            title: glb_date.dateFormat('F jS, Y')
        });

        test = printable.getView();

        printable.getView().forceFit = true;
        printable.getView().enableRowBody = true;
        printable.getView().getRowClass = function(record, rowIndex, p, ds) {
            var xf = Ext.util.Format;
            p.body = '<p>' + xf.stripTags(record.data.comments) + '</p>';
            return 'x-grid3-row-expanded';
        }

        var printer = new Ext.Panel({
            layout: "table",
            layoutConfig: {
                columns: 1
            },
            border: false,
            bodyBorder: false,
            items: [
                printable
            ]
        });

          printer.render('printer-friendly');
          printer.show();

          window.print();

    });

//}