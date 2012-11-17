<?

/*

Copyright (c) 2012 by pp--.  All Rights Reserved.

*/

/**
* tvtuner
*
* @uses     
*
* @category Category
* @package  Package
* @author    <>
* @license  
* @link     
*/
class tvtuner {
	var $connection;
	var $database;
	var $debug;

	function __construct($db = channelsDatabase) {
		if ($this->connection = new PDO('sqlite:' . $db)) {
			$this->database = channelsDatabase;
		} else {
			$this->debug[] = "Error: ". $db;
		}
	}

	function getDataArray($query,$type) {
		$result = $this->connection->query($query);
		if (is_object($result)) {

			$result->setFetchMode(PDO :: FETCH_ASSOC);

			switch ($type) {
				case 'json':
					$r = json_encode($result->fetchAll());
					break;
				case 'array':
					$r = $result->fetchAll();
					break;
				default:
					$r = false;
					break;
			}

			return $r;


		}
	}

	function getChannels() {
		$query = 'SELECT * FROM stations ORDER BY number ASC';
		$type = 'json';
		$tvtuner = new tvtuner();
		$result = $tvtuner->getDataArray($query,$type);
		header("Content-type: text/plain");
		return $result;
	}

	

	function setChannel($channel) {

		$channel = explode(',', $channel);

		if (!isset($channel[1])) {
			echo "Incorrect params!";
			exit;
		}

		$freq = explode('.', $channel[1]);
		if (is_numeric($channel[0]) and is_numeric($freq[0]) and is_numeric($freq[1])) {
			$updateClicksString = "UPDATE clicks SET chan_num={$channel[0]} , count=count+1 WHERE id=1";
			$result = $this->connection->exec($updateClicksString);
			$freq = $freq[0].'.'.$freq[1];
			$channelName = $channel[0];
			shell_exec('sudo v4l2-ctl -f '.$freq.' && cvlc -q '.channelUrl.' --no-audio --video-filter scene --scene-format jpg --scene-width '.sceneWidth.' --scene-height '.sceneHeight.' --scene-path '.channelImagesDir.'/ --scene-prefix '.$channelName.' --run-time 0.01 --scene-replace vlc://quit -I dummy -V dummy -A dummy > /dev/null 2>&1');
			return $result;
		} else {
			echo 'Channel number and frequency is empty!';
			exit;
		}
	}

	function setReloadChannelSpeed($settings) {
		$tvtuner = new tvtuner();
		if (is_numeric($settings)) {
			if ($settings >= 0) {
				$settings = $settings;
				$updateChannelReload = "UPDATE clicks SET screen_channel_reload = {$settings} WHERE id=1";
				$selectChannelReload = "SELECT screen_channel_reload FROM clicks WHERE id=1";
				$this->connection->exec($updateChannelReload);
				$type = 'json';
				$result = $tvtuner->getDataArray($selectChannelReload,$type);
				header("Content-type: text/javascript");
				return $result;
			}
			return false;
		} else {
			echo "Go away !";
			exit;
		}
	}

	function getLatestChannel() {
		$query = 'SELECT chan_num FROM clicks WHERE id=1';
		$type = 'array';
		$tvtuner = new tvtuner();
		$result = $tvtuner->getDataArray($query,$type);
		$vlcProcessCount = trim(shell_exec('ps --no-headers -C vlc -o cmd | egrep -cw scene'));
		$channelName = $result[0]['chan_num'];
		if (is_numeric($vlcProcessCount) and $vlcProcessCount == '0') {
			shell_exec('cvlc -q '.channelUrl.' --no-audio --video-filter scene --scene-format jpg --scene-width '.sceneWidth.' --scene-height '.sceneHeight.' --scene-path '.channelImagesDir.'/ --scene-prefix '.$channelName.' --run-time 0.01 --scene-replace vlc://quit -I dummy -V dummy -A dummy > /dev/null 2>&1');
		}

		header("Content-type: text/javascript");
		return json_encode($result);
	}



	function getSettings() {
		$query = 'SELECT * FROM clicks WHERE id=1';
		$type = 'json';
		$tvtuner = new tvtuner();
		$result = $tvtuner->getDataArray($query,$type);
		header("Content-type: text/javascript");
		return $result;
	}
}


?>