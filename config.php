<?php

error_reporting(9);

putenv("PATH=" .$_ENV["PATH"]. ':/sbin:/usr/bin:/usr/sbin');


$docRoot = $_SERVER["DOCUMENT_ROOT"];

define('channelsDatabaseName', 'channels.sqlite3');
define('systemExecutes', 'ps --no-headers -C vlc -o cmd | egrep -v "v4l2" | wc -l'); // linux
define('channelUrl','http://10.0.0.13:8887');
define('sceneWidth','212');
define('sceneHeight','160');
define('channelImagesDir', $docRoot.'ChannelIcons');
define('channelsDatabase', $docRoot.channelsDatabaseName);

$absolute_path = "/home/tvtuner-player/www";
$icons_dir = "ChannelIcons";
$station_db = "stationlist.db";
$clicks_db = "clicks.db";

$scene_width = '212';
$scene_height = '160';

//$channel_url = 'rtsp://tv.pronskiy.ru:8888/stream.sdp';
$channel_url = 'http://10.0.0.13:8887';
// list channel sorter
$h_channels_count = '30';

require($docRoot.'/classes/tvtuner.class.php');


?>