<?php

	// includes
	require('config.php');
	require($docRoot.'/classes/tvtuner.class.php');

	// set vars
	$tvtuner = new tvtuner();
	$formatOutput = 'json';

	$queryString = explode('/', $_SERVER["QUERY_STRING"]);

	if (isset($queryString[1]))
		$queryData = $queryString[1];
	else
		$queryData = null;


	$queryMethod = $queryString[0];

	if (!empty($queryMethod) and !empty($queryData)) {
		switch ($queryMethod) {
			case 'get':
				switch ($queryData) {
					case 'channelJson':
						echo $tvtuner->getLatestChannel();
						break;
					case 'channels':
						echo $tvtuner->getChannels();
						break;
					case 'settings.js':
						echo $tvtuner->getSettings();
						break;

				}
				break;
			case 'setReloadChannelSpeed':
				echo $tvtuner->setReloadChannelSpeed($queryData);
				break;
			case 'setChannel':
				echo $tvtuner->setChannel($queryData);
				break;
			default:
				echo "Not you. Go away!";
				break;
		}
	} else {
		require_once('head.php');
		require_once('foot.php');
	}

?>
