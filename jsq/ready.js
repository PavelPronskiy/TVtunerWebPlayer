// created by pp--
$(document).ready(function(){

	var checker = { s: navigator.userAgent.match(/(iPhone|iPod|iPad|BlackBerry|Android)/) };
	var objDist = [];
	var screenChannelReload = [];

	// screen channel resolution
	objDist.w = 212;
	objDist.h = 160;

	//var screenChannelReload = 5000;


	// execute settings and styles
	var scripts = [
		'jsq/styles.js',
		'jsq/htmlElements.js',
		'jsq/jquery.cookie.js',
		'jsq/jquery.easing.1.3.js',
		'jsq/jquery.vgrid.js'
	];

	$.each(scripts, function() {
		$.getScript(this);
	})

	// get settings from sqlite
	$.ajax({ type: 'GET', url: "get/settings.js", async: false, dataType: 'json',
		success: function(j) { settings = j[0]; }
	});

	if (settings)
		screenChannelReload = settings.screen_channel_reload
	else
		screenChannelReload = 10000

	
	//console.log(screenChannelReload);

	//if ($cookie(''))
	$.getJSON("/get/channels", function(data){
		var incr = 0;
		var items = [];
		var preloadImagesArray = [];
		var forBrowsers = '<div id="core"></div>';
		$('<div/>', { 'id': 'main-container', html: forBrowsers }).appendTo('body');

		var globImgWidth = []
		var globImgHeight = [];

		var stationList = $('<ul/>');
		stationList.addClass('stationList');
		stationList.appendTo("#core");
		var tax = 0;
		$.each(data, function(key, val) {
			var imgSrc = '/ChannelIcons/' + val.number + '.jpg';
			var _li = '<li><img src="/img/waiting.gif" num="' + val.number + '" alt="' + val.freq + '" width="' + objDist.w + '" height="' + objDist.h + '" /><small>'+val.name+'</small></li>';
			
			stationList.append(_li);
			$("<img>").attr("src", imgSrc).load(function() {
				stationList.find('img').each(function() {
					if ($(this).attr('num') == val.number) {
						$(this).attr('src', imgSrc);
						//$(this).parent().css({'visibility':'visible'});
					}
				});
			});
		});

	
		var stationListLi = stationList.find('li');
		var stationListLiSmall = stationListLi.find('small');
		var stationListLiImg = stationListLi.find('img');


		stationListLi.each(
			function() {
				/*
				$(this).width(objDist.w);
				$(this).height(objDist.h);
				$(this).find('img').width(objDist.w-2);
				$(this).find('img').height(objDist.h-2);
				*/

				if ($.cookie('station_cookie') == $(this).find('img').attr('alt')) {
					var chanName = $(this).find('small').text();
					$("ul.prev-info li.channel-name").text('Name: '+chanName);
				}

			}
		);

		stationListLi.click(function(){
			var $this = $(this);
			var get_freq_str = $this.find('img').attr('alt');
			if (get_freq_str) {
				var mg = $this.find('img');
				var st = mg.attr('src');
				mg.attr('src', '/img/waiting.gif');
				var chan_num = st.replace(/\?.*/, '').replace('/ChannelIcons/', '').replace('.jpg','');
				var jqxhr = $.getJSON("/setChannel/"+chan_num+','+get_freq_str, function(d,s) {
					mg.attr('src', st +  '?' + (new Date()).getTime());
					$this.css({'cursor':'pointer'});
					stationListLi.css(css_stationList_li_normal);
					stationListLiSmall.css(css_stationList_li_small_normal);
					$this.find('small').css(css_stationList_li_small_hover);
					$this.css(css_stationList_li_hover);
					$.cookie('chan_num_cookie', chan_num);
					$.cookie('station_cookie', get_freq_str);
				});
			}
		});


		var vg = stationList.vgrid({
			easing: "easeOutQuint",
			useLoadImageEvent: true,
			useFontSizeListener: true,
			time: 20,
			delay: 1,
			fadeIn: {
				time: 300,
				delay: 50
			}
		});


		stationListLi.hover(
			function() {
				if ($.cookie('station_cookie') != $(this).find('img').attr('alt')) {
					$(this).css(css_stationList_li_hover);
					$(this).find('small').css(css_stationList_li_small_hover);
				}
			},
			function() {
				if ($.cookie('station_cookie') != $(this).find('img').attr('alt')) {
					$(this).css(css_stationList_li_normal);
					$(this).find('small').css(css_stationList_li_small_normal);
				}
			}
		);



		function getChan() {
			var chanNumCookie = $.cookie('chan_num_cookie');

			$.getJSON("/get/channelJson", function(d,s) {
				stationListLi.each(
					function() {
						var $this = $(this);
						var mg = $this.find('img');
						var sm = $this.find('small');
						var st = mg.attr('src');

						if (chanNumCookie !== d[0].chan_num) {
							if (mg.attr('num') == d[0].chan_num) {
								stationListLi.css(css_stationList_li_normal);
								stationListLiSmall.css(css_stationList_li_small_normal);
								$this.css(css_stationList_li_hover);
								sm.css(css_stationList_li_small_hover);
								mg.attr('src', st.replace(/\?.*/, '') +  '?' + (new Date()).getTime());
								var chan_num = st.replace(/\?.*/, '').replace('/ChannelIcons/', '').replace('.jpg','');
								$.cookie('chan_num_cookie', chan_num);
							}
						} else {
							if (mg.attr('num') == d[0].chan_num) {
								var smallText = $this.find('small').text();
								$("title").text(smallText);
								stationListLi.css(css_stationList_li_normal);
								stationListLiSmall.css(css_stationList_li_small_normal);
								$this.css(css_stationList_li_hover);
								sm.css(css_stationList_li_small_hover);
								mg.attr('src', st.replace(/\?.*/, '') +  '?' + (new Date()).getTime());
							}
						}
					}
				);
			});
		}
		
		getChan();
		//setInterval(getChan, speedScreenReloadChannelVal); // change active every time

		// settings 
		$('<ul/>', { 'class': 'stationSettings', html: stationSettings }).appendTo('#core');
		var stationSettingsEl = $("#core").find('ul.stationSettings');
		var stationSettingsLiEl = stationSettingsEl.find('li');
		var stationSettingsLiDivEl = stationSettingsLiEl.find('div');

		// window
		$('<div/>', {
			'id' : 'stationSettingsWindow'
		}).appendTo('#core');

		// form
		$('<form/>', {
			'id' : 'settings',
			html : settingsFormHTML,
		}).appendTo('#stationSettingsWindow');

		var speedScreenReloadChannelEl = $("input#speedScreenReloadChannel");

		var speedScreenReloadChannelVal = parseInt(settings.screen_channel_reload);
		speedScreenReloadChannelEl.attr('value', speedScreenReloadChannelVal/1000);

		$("div.minus").click(function() {
			speedScreenReloadChannelVal = speedScreenReloadChannelVal + 1000;
			if (speedScreenReloadChannelVal < 20000) {
				speedScreenReloadChannelEl.attr('value', (speedScreenReloadChannelVal/1000));
				$.getJSON('/setReloadChannelSpeed/' + speedScreenReloadChannelVal);
				clearInterval(chanInterval);
				chanInterval = setInterval(getChan, speedScreenReloadChannelVal);
				$(this).css({'cursor':'pointer'});
			}
			if (speedScreenReloadChannelVal >= 20000) {
				$(this).css({'cursor':'default'});
				speedScreenReloadChannelVal = speedScreenReloadChannelVal - 1000;
			}

			console.log('speedScreenReloadChannelVal: ' + speedScreenReloadChannelVal);

		});

		$("div.plus").click(function() {
			speedScreenReloadChannelVal = speedScreenReloadChannelVal - 1000;
			if (speedScreenReloadChannelVal > 0) {
				speedScreenReloadChannelEl.attr('value', (speedScreenReloadChannelVal/1000));
				$.getJSON('/setReloadChannelSpeed/' + speedScreenReloadChannelVal);
				clearInterval(chanInterval);
				chanInterval = setInterval(getChan, speedScreenReloadChannelVal);
				$(this).css({'cursor':'pointer'});
			}

			if (speedScreenReloadChannelVal < 0) {
				clearInterval(chanInterval);
				$.getJSON('/setReloadChannelSpeed/' + '0');
				speedScreenReloadChannelEl.attr('value', '0');
				$(this).css({'cursor':'default'});
				speedScreenReloadChannelVal = speedScreenReloadChannelVal + 1000;
			}

			console.log('speedScreenReloadChannelVal: ' + speedScreenReloadChannelVal);

		});

		if (speedScreenReloadChannelVal > 0)
			chanInterval = setInterval(getChan, speedScreenReloadChannelVal);


		$("#settingsForm").submit(function () {
			return false;
		});


		var stationSettingsWindow = $("#stationSettingsWindow");

		stationSettingsLiEl.toggle(
			function() {
				$(this).css({'background-color':'#303030'});
				$(this).attr('stationSettingsWindow','true');
				stationSettingsWindow.show();
			},
			function() {
				$(this).css({'background-color':'#000000'});
				$(this).attr('stationSettingsWindow','false');
				stationSettingsWindow.hide();
			}
		)

		stationSettingsLiEl.hover(
			function() {
				if ($(this).attr('stationSettingsWindow') == false)
					$(this).css(css_stationSettingsLiDivEl_hover)
			},
			function() {
				if ($(this).attr('stationSettingsWindow') == false)
					$(this).css(css_stationSettingsLiDivEl_normal)
			}
		)



		var objResize = [];
		var objDefImgSize = [];

		objDefImgSize.w = stationListLi.width();
		objDefImgSize.h = stationListLi.height();
		
		var stationListLiSmallFontSize = parseInt(stationListLiSmall.css('font-size').replace(/[a-z]+/, ''));
		
		// width display
		function __resizeChanImages() {
			
			var objD = [];
			objD.a = true;
			objD.b = true;
			objD.c = true;
			objD.d = true;
			objD.e = true;
			
			switch (true) {
				case 640 > $(document).width():
					if (objD.a) {
						var __w = parseInt(objDefImgSize.w / 5);
						var __h = parseInt(objDefImgSize.h / 5);
						var __f = stationListLiSmallFontSize - 4;
						stationListLi.width(__w); stationListLi.height(__h);
						stationListLiImg.width(__w - 2); stationListLiImg.height(__h - 2);
						stationListLiSmall.css({'font-size' : __f + 'px'});
						objD.a = false;objD.b = true;objD.c = true;objD.d = true;objD.e = true;
					}
				break;
				case 800 > $(document).width():
					if (objD.b) {
						var __w = parseInt(objDefImgSize.w / 4);
						var __h = parseInt(objDefImgSize.h / 4);
						var __f = stationListLiSmallFontSize - 2;
						stationListLi.width(__w); stationListLi.height(__h);
						stationListLiImg.width(__w - 2); stationListLiImg.height(__h - 2);
						stationListLiSmall.css({'font-size' : __f + 'px'});
						objD.a = true;objD.b = false;objD.c = true;objD.d = true;objD.e = true;
					}
				break;
				case 1024 > $(document).width():
					if (objD.c) {
						var __w = parseInt(objDefImgSize.w / 3);
						var __h = parseInt(objDefImgSize.h / 3);
						var __f = stationListLiSmallFontSize;
						stationListLi.width(__w); stationListLi.height(__h);
						stationListLiImg.width(__w - 2); stationListLiImg.height(__h - 2);
						stationListLiSmall.css({'font-size' : __f + 'px'});
						objD.a = true;objD.b = true;objD.c = false;objD.d = true;objD.e = true;
					}
				break;
				case 1600 > $(document).width():
					if (objD.d) {
						var __w = parseInt(objDefImgSize.w / 2);
						var __h = parseInt(objDefImgSize.h / 2);
						var __f = stationListLiSmallFontSize + 3;
						stationListLi.width(__w); stationListLi.height(__h);
						stationListLiImg.width(__w-2); stationListLiImg.height(__h-2);
						stationListLiSmall.css({'font-size' : __f + 'px'});
						objD.a = true;objD.b = true;objD.c = true;objD.d = false;objD.e = true;

					}
				break;
				case 2000 > $(document).width():
					if (objD.e) {
						var __w = parseInt(objDefImgSize.w);
						var __h = parseInt(objDefImgSize.h);
						var __f = stationListLiSmallFontSize + 8;
						console.log(__f);
						stationListLi.width(__w); stationListLi.height(__h);
						stationListLiImg.width(__w - 2); stationListLiImg.height(__h - 2);
						stationListLiSmall.css({'font-size' : __f + 'px'});
						objD.a = true;objD.b = true;objD.c = true;objD.d = true;objD.e = false;
					}
				break;

			}
			vg.vgrefresh();
		}


		__resizeChanImages();
		stationListLi.find('img').show();
		//vg.vgrefresh();


		$(window).resize(
			function() {
				__resizeChanImages();
			}
		);



	});
});
