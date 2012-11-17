// created by pp--

(function( $ ){
	$.fn.changeChannel = function(keyCode) {
		//var settings = $.extend( {
		//	'':''
		var getChanActive = [];

		var css_stationList_li_hover = {
			'border':'1px solid #00a2ff'
		}

		var css_stationList_li_normal = {
			'border':'1px solid #464746'
		}

		var css_stationList_li_small_normal = {
			"background-color":"#000000",
			"color":"#a0a0a0"
		}

		var css_stationList_li_small_hover = {
			"background-color":"#00a2ff",
			"color":"#000000"
		}


		$.ajax({
			type: 'GET',
			url: "/get/channelJson",
			async: false,
			dataType: 'json',
			success: function(j) {
				getChanActive = j[0].chan_num;
			}
		});



		// channel changer by vars
		function setChannel($this) {

			if ($this.nodeType != 1)
				return false

			var $el = $this.getElementsByTagName('img')[0];
			//var $el = $imgElement[0];

			var $elSrc = $el.getAttribute('src').replace(/\?.*/, '');
			var $elFreq = $el.getAttribute('alt');
			var $elNum = $el.getAttribute('num');

			console.log($this.parentNode);

			//console.log($getChanActive + ' - ' + $channelNumber + ' - ' + $channelFreq);

			// set style
			//console.log($el.parentNode());

			//$el.parent().getElementsByTagName('li').css(css_stationList_li_normal);
			//$el.parent().find('li').find('small').css(css_stationList_li_small_normal);
			//$el.find('small').css(css_stationList_li_small_hover);
			//$el.css(css_stationList_li_hover);
			//$el.find('img').attr('src', '/img/waiting.gif');
			
			//var $channelNumber = $st.replace(/\?.*/, '')
			//	.replace('/ChannelIcons/', '')
			//	.replace('.jpg','');

			//var jqxhr = $.getJSON('/setChannel/' + $channelNumber + ',' + $getFreqStr, function(d,s) {
			//	$mg.attr('src', st +  '?' + (new Date()).getTime());
			//	$.cookie('chan_num_cookie', $channelNumber);
			//	$.cookie('station_cookie', $getFreqStr);
			//});
		}

		return this.each(function() {
			var $this = $(this);
			if ($this.find('img').attr('num') == getChanActive) {
				switch (keyCode) {
					case "left":
						if ($this.prev().find('img').attr('src'))
							setChannel(this);

					break
					case "right":
						if ($this.next().find('img').attr('src')) {
							//setChannel($this);
						}
					break
					case "up":
						var tr = 1;
						var tTop = null;
						var trSum = 1;
						var ptr = null;
						var atr = [];
						var countVertTr = [];
						
						// get position
						$this.parent().find('li').each(function() {
							if ($(this).css('top') != tTop) {
								countVertTr = trSum;
								ptr = tr-1;
								tr = 1;
								trSum++;
							}
							if ($this.find('img').attr('num') == $(this).find('img').attr('num')) {
								atr = [ countVertTr, tr ];
							}
							
							tTop = $(this).css('top');
							tr++
						});
						
						tr = 1; trSum = 1; tTop = null; ptr = null;
						
						// chage position
						$this.parent().find('li').each(function() {
							if ($(this).css('top') != tTop) {
								tr = 1;
								trSum++;
							}
							
							if (atr[0] == trSum) {
								if (tr == atr[1]) {
									var $thisEach = $(this);
									var $mg = $thisEach.find('img');
									var $st = $mg.attr('src').replace(/\?.*/, '');
									var $getFreqStr = $thisEach.find('img').attr('alt');
									
									//var getImgSrc = $(this).find('img').attr('src').replace(/\?.*/, '');

									// set style
									$thisEach.parent().find('li').css(css_stationList_li_normal);
									$thisEach.parent().find('li').find('small').css(css_stationList_li_small_normal);
									$thisEach.find('small').css(css_stationList_li_small_hover);
									$thisEach.css(css_stationList_li_hover);
									$thisEach.find('img').attr('src', '/img/waiting.gif');
									
									var $channelNumber = $st.replace(/\?.*/, '').replace('/ChannelIcons/', '').replace('.jpg','');
									var jqxhr = $.getJSON("/setChannel/"+$channelNumber+','+$getFreqStr, function(d,s) {
										$mg.attr('src', st +  '?' + (new Date()).getTime());
										$.cookie('chan_num_cookie', $channelNumber);
										$.cookie('station_cookie', $getFreqStr);
									});

									return false;
								}
							}
							
							tTop = $thisEach.css('top');
							tr++

						});
						
						tr = 1; trSum = 1; tTop = null; ptr = null; t = null;
						
					break
					case "down":
						var tr = 1;
						var tTop = null;
						var trSum = 1;
						var ptr = null;
						var atr = [];
						var countVertTr = [];
						
						// get position
						$this.parent().find('li').each(function() {
							if ($(this).css('top') != tTop) {
								countVertTr = trSum;
								ptr = tr-1;
								tr = 1;
								trSum++;
							}
							if ($this.find('img').attr('num') == $(this).find('img').attr('num')) {
								atr = [ countVertTr, tr ];
							}
							
							tTop = $(this).css('top');
							tr++
						});
						
						tr = 1; trSum = 0; tTop = null; ptr = null;
						
						// chage position
						$this.parent().find('li').each(function() {
							if ($(this).css('top') != tTop) {
								tr = 1;
								trSum++;
							}
							if (atr[0]+1 == trSum) {
								if (tr == atr[1]) {
									$t = $(this);
									var getFreq = $(this).find('img').attr('alt');
									var getImgSrc = $(this).find('img').attr('src').replace(/\?.*/, '');
									$t.parent().find('li').css(css_stationList_li_normal);
									$t.parent().find('li').find('small').css(css_stationList_li_small_normal);
									$t.find('small').css(css_stationList_li_small_hover);
									$t.css(css_stationList_li_hover);
									$t.find('img').attr('src', '/img/waiting.gif');
									
									$.post("/tvtuner.php", { freq: getFreq }, function(d) {
										$t.find('img').attr('src', getImgSrc +  '?' + (new Date()).getTime());
										var chan_num = getImgSrc.replace('/ChannelIcons/', '').replace('.png','');
										$.cookie('chan_num_cookie', chan_num);
										$.cookie('station_cookie', getFreq);
									});

									return false;
								}
							}
							
							tTop = $(this).css('top');
							tr++

						});
						
						tr = 1; trSum = 1; tTop = null; ptr = null; t = null;
					break
				}
			}

			/*
			var checker = { s: navigator.userAgent.match(/(iPhone|iPod|iPad|BlackBerry|Android)/) };
			if (!checker.s) {
				var chanName = $this.find('small').text();
				var chanFreq = $this.find('img').attr('alt');
				$(".channel-name").text('Name: '+chanName);
				$(".channel-freq").text('Freq: '+chanFreq);
			}
			*/


		});
	};
})( jQuery );
