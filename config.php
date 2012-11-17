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

?>