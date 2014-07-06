<!DOCTYPE html>
<html ng-app="civil">
<head>
	<title></title>
	<link rel="stylesheet" href="/css/styles.css">
	<link rel="stylesheet" href="http://cdn.leafletjs.com/leaflet-0.7.3/leaflet.css" />
	<script src="http://cdn.leafletjs.com/leaflet-0.7.3/leaflet.js"></script>
	<script src="/js/vendor.js"></script>
	<script type="text/javascript">
		//config
		var app = angular.module('civil', ['ui.router', 'restangular', 'ngStorage']);

		app.run().constant('config', {
			url: '<?php print_r(Config::get('app.url'));?>/',
			apiUrl: '<?php print_r(Config::get('app.url'));?>/',
			lon: <?php print_r(Config::get('app.lon'));?>,
			lat: <?php print_r(Config::get('app.lat'));?>,
			zoom: <?php print_r(Config::get('app.zoom'));?>
		});
	</script>
	<script src="/js/app.js"></script>
</head>
<body>
	<div ui-view></div>
</body>
</html>