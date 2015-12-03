<?php

include_once dirname(__FILE__) . '/res/php/common.inc.php';

if (isset($_GET['_format']) && isset($_GET['date']) /*&& $_SERVER['REMOTE_ADDR'] == '70.67.26.245'*/) {
	header('Location: /print/?date=' . urlencode($_GET['date']));
	exit;
}

?>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1">
    <title>Nanaimo Airporter</title>

    <link rel="stylesheet" type="text/css" href="res/lib/extjs/resources/css/ext-all.css" />
    <link rel="stylesheet" type="text/css" href="res/css/style.css" />

</head>
<body>

    <script type="text/javascript" src="res/lib/extjs/adapter/ext/ext-base.js"></script>
 	<script type="text/javascript" src="res/lib/extjs/ext-all.js"></script>
 	<!--<script type="text/javascript" src="res/lib/extjs/ext-all-debug.js"></script>-->

<?php $authuser = auth(); ?>
<?php if (empty($authuser)) : ?>

	<!-- Application Code -->
    <script type="text/javascript" src="res/js/LoginWindow.js"></script>

 	<script type="text/javascript">
        Ext.onReady(function(){
            var loginwin = new LoginWindow();
            loginwin.show();
        });
 	</script>

<?php else : ?>

    <div id="printer-friendly" style="diplay: none;"></div>

    <!-- Template used for Feed Items -->
    <textarea id="preview-tpl" style="display:none;">
        <div class="post-data">
            <span class="post-time">{date:date("M j, Y")}, {time:date("G:i a")}</span>
            <h3 class="post-name">{name}</h3>
            <h4 class="post-driver">Driver: {driver:defaultValue("None")}</h4>
        </div>
        <div class="post-body">{content:this.getBody}</div>
    </textarea>

 	<script type="text/javascript" src="res/lib/Ext.ux.PrinterFriendly/config.js"></script>
 	<script type="text/javascript" src="res/lib/Ext.ux.PrinterFriendly/init.js"></script>

    <script type="text/javascript">

        var test = 'empty';

        <?php if (!empty($_REQUEST['date'])) : ?>
            <?php list ($year, $month, $day) = explode("-", $_REQUEST['date']); ?>
            <?php $month = $month - 1; ?>
            <?php $month = ($month < 0) ? 11 : $month; ?>
            var glb_date = new Date();
            glb_date.setFullYear(<?=$year; ?>, <?=$month; ?>, <?=$day; ?>);
        <?php else : ?>
            var glb_date = new Date();
        <?php endif; ?>

        var Trip = Ext.data.Record.create([
			{name: 'id'},
			{name: 'date', type: 'date', dateFormat: 'Y-m-d'},
			{name: 'time', type: 'date', dateFormat: 'H:i:s'},
			{name: 'cid'},
			{name: 'name'},
			{name: 'passengers'},
			{name: 'driver'},
			{name: 'sent', type: 'bool'},
			{name: 'phone'},
			{name: 'cost', type: 'float'},
			{name: 'address_apt'},
			{name: 'address_num'},
			{name: 'address_street'},
			{name: 'destination'},
			{name: 'comments'},
			{name: 'colour'},
			{name: 'timestamp'}
		]);


//        var Trip = Ext.data.Record.create([
//			{name: 'id'},
//			{name: 'date', type: 'date', dateFormat: 'Y-m-d'},
//			{name: 'time', type: 'date', dateFormat: 'H:i:s'},
//			{name: 'cid'},
//			{name: 'name'},
//			{name: 'passengers'},
//			{name: 'driver'},
//			{name: 'sent', type: 'bool'},
//			{name: 'phone'},
//			{name: 'cost', type: 'float'},
//			{name: 'address'},
//			{name: 'destination'},
//			{name: 'comments'},
//			{name: 'colour'},
//			{name: 'timestamp'}
//        ]);

    </script>

    <!-- extjs : Session State -->
    <!--<script language="javascript" src="res/lib/extjs/examples/state/save-state.php"></script>-->
    <!--<script language="javascript" src="res/lib/extjs/examples/state/get-state.php"></script>-->
    <!--<script language="javascript" src="res/lib/extjs/examples/state/SessionProvider.js"></script>-->

    <!-- extjs : Grid Filters -->
	<script type="text/javascript" src="res/lib/extjs/examples/grid-filtering/menu/EditableItem.js"></script>
	<script type="text/javascript" src="res/lib/extjs/examples/grid-filtering/menu/RangeMenu.js"></script>
	<script type="text/javascript" src="res/lib/extjs/examples/grid-filtering/grid/GridFilters.js"></script>
	<script type="text/javascript" src="res/lib/extjs/examples/grid-filtering/grid/filter/Filter.js"></script>
	<script type="text/javascript" src="res/lib/extjs/examples/grid-filtering/grid/filter/StringFilter.js"></script>
	<script type="text/javascript" src="res/lib/extjs/examples/grid-filtering/grid/filter/DateFilter.js"></script>
	<script type="text/javascript" src="res/lib/extjs/examples/grid-filtering/grid/filter/ListFilter.js"></script>
	<script type="text/javascript" src="res/lib/extjs/examples/grid-filtering/grid/filter/NumericFilter.js"></script>
	<script type="text/javascript" src="res/lib/extjs/examples/grid-filtering/grid/filter/BooleanFilter.js"></script>

	<!-- extjs : Tab Plugin -->
	<script type="text/javascript" src="res/lib/extjs/examples/tabs/TabCloseMenu.js"></script>

	<!--extjs : Group Summary Plugin -->
	<script type="text/javascript" src="res/lib/Ext.grid.GroupSummary/Ext.grid.GroupSummary.js"></script>

	<!-- Application Code -->

	<script type="text/javascript" src="res/js/TripWindow.js"></script>
        <script type="text/javascript" src="res/js/admin/DefaultTripTimeEditor.js"></script>

    <script type="text/javascript" src="res/js/<?=$authuser['type']; ?>/ScheduleGrid.js"></script>
    <script type="text/javascript" src="res/js/<?=$authuser['type']; ?>/MainPanel.js"></script>

    <script type="text/javascript" src="res/js/SchedulePanel.js"></script>
    <script type="text/javascript" src="res/js/App.js"></script>
    <script type="text/javascript" src="res/js/AppPrinter.js"></script>

<?php endif; ?>

</body>
</html>