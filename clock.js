(function($) {

	FlipClock = function() {

		this.flipInterval = {};
		this.flipDegree = {};

		this.renewTime();

		this.updateInterval = setInterval($.proxy(function() {

			this.refreshClock();
			// console.log(this.getTimeString());

		}, this), 800);

	}

	FlipClock.prototype.log = function(data) {
		if (typeof console != "undefined") {
				console.log(data);
		}
	}

	FlipClock.prototype.renewTime = function() {
		this.date = new Date();

		this.hours = this.date.getHours();
		this.minutes = this.date.getMinutes();

		return this.getTimeObject();		
	}

	FlipClock.prototype.getTimeString = function() {
		return this.hours+':'+((this.minutes < 10) ? '0'+this.minutes : this.minutes);
	}

	FlipClock.prototype.getTimeObject = function() {
		return {
			hours: this.hours,
			minutes: this.minutes
		};
	}

	FlipClock.prototype.flipPart = function(digitID, selector, degree) {

		var degree = (typeof degree != "number") ? 0 : degree;
		var digitID = (typeof digitID != "undefined") ? ((digitID.match(/^\#.*$/)) ? digitID : "#" + digitID) + ".flip" : ".flip";
		var $flipper = (typeof selector != "undefined") ? $(digitID).find(".part").filter(selector) : $(digitID).find(".part");
		var $def = jQuery.Deferred();

		if (typeof this.flipInterval[digitID+'__'+selector] == "undefined") {
			this.flipDegree[digitID+'__'+selector] = degree - 90;
			this.flipInterval[digitID+'__'+selector] = setInterval($.proxy(function() {
				if (this.flipDegree[digitID+'__'+selector] < degree) {
					this.flipDegree[digitID+'__'+selector] += 5;
					$flipper.css("transform", "rotateX("+this.flipDegree[digitID+'__'+selector]+"deg)");
				} else {
					// Заканчиваем переворачивать предыдущую цифру
					clearInterval(this.flipInterval[digitID+'__'+selector]);
					delete(this.flipInterval[digitID+'__'+selector]);
					delete(this.flipDegree[digitID+'__'+selector]);
					$def.resolve();
				}
			}, this), 1);
		}

		return $def;
	}

	FlipClock.prototype.flipDigit = function(digitID, value) {
		var digitID = (digitID.match(/^\#.*$/)) ? digitID : "#" + digitID;
		$(digitID).prepend('<div class="part lower"><div class="flipper"><div class="container">0</div></div></div><div class="part upper"><div class="flipper"><div class="container">0</div></div></div>');
		$(digitID).find(".part").filter(":lt(2)").addClass("next");
		$(digitID).find(".part").filter(":gt(1)").addClass("prev");
		$(digitID).find(".part.next").find(".container").text(value);

		$(digitID).find(".upper.next").css("opacity", 0.5).stop().animate({
			opacity: 1
		}, 10);

		this.flipPart(digitID, '.upper.prev', 90).then($.proxy(function() {
			// ...
			this.flipPart(digitID, '.lower.next', 0).then($.proxy(function() {
				// this.log($(digitID));
				$(digitID).find(".part.prev").remove();
				$(digitID).find(".part.next").removeClass("next");
			}, this));

			$(digitID).find(".lower.prev").stop().animate({
				opacity: 0.5
			}, 10);	

		}, this));
	}	

	FlipClock.prototype.flipHours = function(hours) {
		this.flipDigit('hours', hours);
		// this.log("FlipClock: set hours to "+hours);
	}

	FlipClock.prototype.flipMinutes = function(minutes) {
		this.flipDigit('minutes', minutes);
		// this.log("FlipClock: set minutes to "+minutes);
	}

	FlipClock.prototype.flipTime = function(time) {
		if (typeof time == "string") {
			time = time.split(/\:/);		
		}

		if (typeof time[0] != "undefined") {
			var h = time[0];
			var m = time[1];				
		}

		if (typeof time.hours != "undefined") {
			var h = time.hours;
			var m = time.minutes;
		}

		this.flipHours(h);
		this.flipMinutes(m);
		// this.log("FlipClock: set time to "+h+":"+m);
	}

	FlipClock.prototype.refreshClock = function() {
		// var time = $("#hours").find(".container").text() + ":" + $("#minutes").find(".container").text();
		// if (time != this.getTimeString()) {
		// 	this.flipTime(this.getTimeString());
		// }

		this.renewTime();		

		var time = this.getTimeString().split(':');

		if ($("#hours").find(".container:first").text() != time[0]) { this.flipHours(time[0]); }
		if ($("#minutes").find(".container:first").text() != time[1]) { this.flipMinutes(time[1]); }
	}


	Alarm = function() {
		this.main_alarm = document.getElementById('main_alarm');
		this.main_alarm.currentTime = 101; // 1m41s
	}

	function getCurrentRotation( elid ) {
	  var el = document.getElementById(elid);
	  var st = window.getComputedStyle(el, null);
	  var tr = st.getPropertyValue("-webkit-transform") ||
	       st.getPropertyValue("-moz-transform") ||
	       st.getPropertyValue("-ms-transform") ||
	       st.getPropertyValue("-o-transform") ||
	       st.getPropertyValue("transform") ||
	       "fail...";

	  if( tr !== "none") {
	    console.log('Matrix: ' + tr);

	    var values = tr.split('(')[1];
	      values = values.split(')')[0];
	      values = values.split(',');
	    var a = values[0];
	    var b = values[1];
	    var c = values[2];
	    var d = values[3];

	    var scale = Math.sqrt(a*a + b*b);

	    // First option, don't check for negative result
	    // Second, check for the negative result
	    /**/
	    var radians = Math.atan2(b, a);
	    var angle = Math.round( radians * (180/Math.PI));
	    /*/
	    var radians = Math.atan2(b, a);
	    if ( radians < 0 ) {
	      radians += (2 * Math.PI);
	    }
	    var angle = Math.round( radians * (180/Math.PI));
	    /**/
	    
	  } else {
	    var angle = 0;
	  }

	  // works!
	  console.log('Rotate: ' + angle + 'deg');
	  $('#results').append('<p>Rotate: ' + angle + 'deg</p>');
	}

	function getCurrentRotationFixed( elid ) {
	  var el = document.getElementById(elid);
	  var st = window.getComputedStyle(el, null);
	  var tr = st.getPropertyValue("-webkit-transform") ||
	       st.getPropertyValue("-moz-transform") ||
	       st.getPropertyValue("-ms-transform") ||
	       st.getPropertyValue("-o-transform") ||
	       st.getPropertyValue("transform") ||
	       "fail...";

	  if( tr !== "none") {
	    console.log('Matrix: ' + tr);

	    var values = tr.split('(')[1];
	      values = values.split(')')[0];
	      values = values.split(',');
	    var a = values[0];
	    var b = values[1];
	    var c = values[2];
	    var d = values[3];

	    var scale = Math.sqrt(a*a + b*b);

	    // First option, don't check for negative result
	    // Second, check for the negative result
	    /** /
	    var radians = Math.atan2(b, a);
	    var angle = Math.round( radians * (180/Math.PI));
	    /*/
	    var radians = Math.atan2(b, a);
	    if ( radians < 0 ) {
	      radians += (2 * Math.PI);
	    }
	    var angle = Math.round( radians * (180/Math.PI));
	    /**/
	    
	  } else {
	    var angle = 0;
	  }

	  // works!
	  console.log('Rotate: ' + angle + 'deg');
	  // $('#results').append('<p>Rotate: ' + angle + 'deg</p>');
	}

	
	$(document).ready(function() {

		Panasonic = {};

		Panasonic.clock = new FlipClock();
		Panasonic.alarm = new Alarm();
	

	});
	
})(jQuery);