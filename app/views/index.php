<!DOCTYPE html>
<html ng-app="civil">
<head>
	<title></title>
	<link rel="stylesheet" href="/css/styles.css?<?php echo date('mdH');?>">
	<link rel="stylesheet" href="http://cdn.leafletjs.com/leaflet-0.7.3/leaflet.css" />
	<script src="http://cdn.leafletjs.com/leaflet-0.7.3/leaflet.js"></script>
	<script src="/js/vendor.js?<?php echo date('mdH');?>"></script>
	<script type="text/javascript">
		//config
		var app = angular.module('civil', ['ui.router', 'restangular', 'ngStorage']);

		app.run().constant('config', {
			name: 'Civil society',
			resctictions: [[52.89112, 35.911224], [53.062703, 36.215065]],
			url: '<?php print_r(Config::get('app.url'));?>/',
			apiUrl: '<?php print_r(Config::get('app.url'));?>/',
			lon: <?php print_r(Config::get('app.lon'));?>,
			lat: <?php print_r(Config::get('app.lat'));?>,
			zoom: <?php print_r(Config::get('app.zoom'));?>
		});
	</script>
	<script src="/js/app.js?<?php echo date('mdH');?>"></script>
</head>
<body>
	<div ui-view></div>
</body>
</html>