<?php

	require('config.php');

	// set vars
	$tvtuner = new tvtuner();
	$formatOutput = 'json';
	//$channels = $tvtuner->getChannelsArray('SELECT * FROM stations', $formatOutput);
	$queryString = explode('/', $_SERVER["QUERY_STRING"]);

	if (isset($queryString[1])) {
		$queryData = $queryString[1];
	} else {
		$queryData = null;
	}


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
				echo "No.";
				break;
		}
	} else {
		require_once('head.php');
		require_once('foot.php');
	}



	
/*
	include_once('lib.php');
	
	//create_sq_db($station_db);
	
	$view_channel_rows = "SELECT * FROM stations ORDER BY number ASC";
	//$view_channel_row_detail = "SELECT * FROM stations WHERE name='3'";
	
	$arr = array();
	
	
	//$arr = delete_name_sq_db($station_db, 3);

	$arr = query_sq_db($station_db,$view_channel_rows);
	$json_out = query_sq_json_db($station_db,$view_channel_rows);
	$cn = 0;


	$r_name = $_REQUEST['name'];
	$r_freq = $_REQUEST['freq'];

	if (!empty($r_freq) and !empty($r_name)) {
		change_freq($r_name,$r_freq);
		exit;
	}
*/


?>
