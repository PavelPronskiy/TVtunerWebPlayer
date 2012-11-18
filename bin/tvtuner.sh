#!/bin/bash

ROOT_PATH="/home/tvtuner-player/www"
ROUTER_IP="10.0.0.13"
ROUTER_ETH_IP="46.242.25.172"
ROUTER_PORT_VLC="8887"
ROUTER_PORT_V320="8888"
ROUTER_PORT_V640="8889"
CHANNEL_ICONS_DIR="ChannelIcons"
ROUTER_DOMAIN="tv.pronskiy.ru"
PID_PATH="/var/run/vlc"
PID_FILE="${PID_PATH}/${2}.pid"
VERBOSE_OPTIONS="--syslog --daemon -q --pidfile ${PID_FILE}"
#VERBOSE_OPTIONS="-v"

# AverTV settings
V4L2_VIDEO_STANDARD=(secam 0x00ff0000)

# transcode 320x340 settings
V320_WIDTH="320"
V320_HEIGHT="240"
V320_MUX="ts"
V320_BITRATE="2048"

#cvlc -q http://${ROUTER_IP}:${ROUTER_PORT_VLC} --sout='#transcode{vcodec=mp1v,vfilter=canvas{width=320,height=240},acodec=mpga,vb=512,deinterlace,fps=25,ab=128}:#std{access=http,mux=asf,dst=:'${ROUTER_PORT_V320}'}' --syslog --daemon
#cvlc -q http://${ROUTER_IP}:${ROUTER_PORT_VLC} --sout='#transcode{vcodec=mp1v,vfilter=canvas{width=320,height=240},acodec=mpga,vb=512,deinterlace,fps=25,ab=128}:rtp{port=8888,sdp=rtsp://'${ROUTER_DOMAIN}':'${ROUTER_PORT_V320}'/stream.sdp}' --syslog --daemon
#cvlc http://${ROUTER_IP}:${ROUTER_PORT_VLC} --sout '#transcode{vcodec=mp1v,acodec=mpga,vb='$V320_BITRATE',ab=128,width='$V320_WIDTH',height='$V320_HEIGHT'}:standard{access=http,mux=ts,dst='${ROUTER_ETH_IP}':'$ROUTER_PORT_V320'/video.mp1v}' ${VERBOSE_OPTIONS}
#cvlc -v http://${ROUTER_IP}:${ROUTER_PORT_VLC} --sout '#transcode{vcodec=mp4v,vfilter=canvas{width=320,height=240},acodec=mp4a}:std{access=http,mux=mp4,dst='${ROUTER_DOMAIN}':'$ROUTER_PORT_V320'/stream.m4v}'

[ -d "$PID_PATH" ] || mkdir -p "$PID_PATH"

# libs
_e() { echo -e "$@" ;}

__v4l2_set_standard() {

	if [ -n "${V4L2_VIDEO_STANDARD[0]}" ] && [ -n "${V4L2_VIDEO_STANDARD[1]}" ]
	then
		v4l2-ctl -S | grep -wq "${V4L2_VIDEO_STANDARD[1]}" || v4l2-ctl -s ${V4L2_VIDEO_STANDARD[0]}
	else
		_e "[crit]: V4L2_VIDEO_STANDARD not defined"
		return 1
	fi
	
}

__kill() {

	# $1 -- vlc,v320,v640
	if [ -f "$PID_FILE" ]
	then
		local pid=`cat $PID_FILE`
		if [ -n "$pid" ]
		then
			_e "[info]: shutdown process $1, pid $pid"
			kill $pid
		else
			_e "[crit]: pid file is empty"
			exit 1
		fi
	else
		return 1
	fi
}

__run_tvtuner() {
	case "$1" in
		start)
		
			if [ -f "$PID_FILE" ]
			then
				local pid=`cat $PID_FILE`
				if [ -n "$pid" ]
				then
					_e "[info]: service $1 already started, pid: $pid"
					return 1
				fi
			fi

			# methods
			case "$2" in
				vlc)
					_e "[info]: Starting process $2"
					cvlc \
						v4l2:///dev/video0 \
						:input-slave=alsa://hw:0,0 \
						:v4l2-caching=300 \
						--sout '#std{access=http,mux=asf,dst=:'$ROUTER_PORT_VLC'}' \
						${VERBOSE_OPTIONS}
					return $?
				;;
				v320)
					_e "[info]: Starting process $2"
					cvlc \
						http://${ROUTER_IP}:${ROUTER_PORT_VLC} \
						--sout '#transcode{vcodec=FLV1,acodec=mp3,vb=1024,fps=25,width=320,height=240,samplerate=44100,ab=128}:duplicate{dst=std{access=http{mime=video/x-flv},mux=ffmpeg{mux=flv},dst='${ROUTER_IP}':'${ROUTER_PORT_V320}'/video.flv}}' \
						${VERBOSE_OPTIONS}
					return $?
				;;
				v640)
					_e "[info]: Starting process $2"
					cvlc \
						http://${ROUTER_IP}:${ROUTER_PORT_VLC} \
						--sout '#transcode{vcodec=FLV1,acodec=mp3,vb=6144,fps=25,width=640,height=480,samplerate=44100,ab=256}:duplicate{dst=std{access=http{mime=video/x-flv},mux=ffmpeg{mux=flv},dst='${ROUTER_IP}':'$ROUTER_PORT_V640'/video.flv}}' \
						${VERBOSE_OPTIONS}
					return $?
				;;
				*)
					__run_tvtuner help
				;;
			esac
		;;
		stop)
			case "$2" in
				vlc)  __kill $2 ;;
				v320) __kill $2 ;;
				v640) __kill $2 ;;
				*) 	  __run_tvtuner help ;;
			esac
		;;
		restart)
			case "$2" in
				vlc)
					__run_tvtunerr stop vlc
					__run_tvtuner start vlc
				;;
				v320)
					__run_tvtuner stop v320
					__run_tvtuner start v320
				;;
				v640)
					__run_tvtuner stop v640
					__run_tvtuner start v640
				;;
				*)	__run_tvtuner restart vlc ;;
			esac
		;;
		-h|help|*)
			_e "$0 service commands: vlc, v320, v640"
			_e "$0 start vlc - capture video0 device "
			_e "$0 stop vlc - close capture"
			_e "$0 -h|help - this message"
			return 1
		;;
	esac
}

__v4l2_set_standard
__run_tvtuner $1 $2
