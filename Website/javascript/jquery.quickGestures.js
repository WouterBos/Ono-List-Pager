(function($) {
	$(document).ready(function() {
	   /* quickGestures jQuery plugin
		* Copyright Anders Zakrisson 2010
		* http://anders.zakrisson.se
		* This software is released under the GPL V.3 License, http://www.gnu.org/licenses/gpl.html
		*/
		$.fn.quickGestures = function(options) {
		/** jQuery(element).quickGestures(options-object)
		
			Binds touch/click gestures and functions defined in the options object to element. Currently supported gestures are drag left, drag right, click in the left and right half of the element, tap (when nothing is bound to click left or right) and hold. The plugin works in two modes, "normal" using mouse clicks and mobile where it captures touch events. It returns the element so that it can be chained.
			
			For example, to bind clicks on the left side of an image to hide itself:
			
			$("#img-hide").quickGestures({
				clickLeft: function() {$(this).hide()}
			});
			
			Options (default):
			dragLeft (null): Function to perform if the mouse is clicked and dragged to the left (or left swipe)
			dragRight (null): Function to perform if the mouse is clicked and dragged to the right (or right swipe)
			clickLeft (null): Function to perform if the mouse is clicked on the left side of the element
			clickRight (null): Function to perform if the mouse is clicked on the right side of the element
			tap (null): Function to perform if no clickLeft or clickRight action is defined and mouse is clicked (or user taps) inside the element
			hold (null): Function to perform if the mousebutton is pressed down for HoldTime or longer
			holdtime (800): The time in milliseconds used for hold
			threshold (50): The number of pixels used for threshold for dragLeft and dragRight
			platformMode ("auto"): If platformMode is set to auto (which is the default) the user agent string is checked for mobile touch 	platforms, if set to "mobile" it captures touch events instead of mouse clicks

		 **/
			var settings = $.extend({
        eventNameSpace: "quickGesture",
				dragLeft: null,
				dragRight: null,
        dragUp: null,
        dragDown: null,
				clickLeft: null,
				clickRight: null,
				tap: null,
				hold: null,
				holdTime: 800,
				threshold: 50,
				platformMode: "auto"
			}, options);

			this.each(function() {
				var data = {
					x: 0,
					y: 0,
					t: null,
					time: null
				};

				if (settings.platformMode == "auto" && ((navigator.platform.indexOf("iPhone") != -1) || (navigator.platform.indexOf("iPod") != -1) || (navigator.userAgent.indexOf("iPad") != -1) || (navigator.userAgent.indexOf("Android") != -1))) {
					settings.platformMode = "mobile";
				}
				
				/* Events for desktop */
				if (settings.platformMode != "mobile") {
				$(this).mousedown(function(e) {
					var offsetLeft = ($(window).width()-$(this).outerWidth(true))/2;
					var offsetTop = ($(window).height()-$(this).outerHeight(true))/2;
					data.x = e.pageX - offsetLeft;
					data.y = e.pageY - offsetTop;
					data.time = new Date();
					
					// Hold events
					if ($.isFunction(settings.hold)) {
						data.t = setTimeout("settings.hold()",settings.holdTime);
					}

					// Tap events
					$(this).mouseup(function() {
						if (data.t != null) clearTimeout(data.t);
						var diffX = (e.pageX - offsetLeft) - data.x;
						var now = new Date();

						if (now.getTime() - data.time.getTime() < settings.holdTime && diffX < settings.threshold) {
							if (data.x < $(this).width()/2 && $.isFunction(settings.clickLeft)) {
								settings.clickLeft();
							} else if (data.x >= $(this).width()/2 && $.isFunction(settings.clickRight)) {
								settings.clickRight();
							} else if ($.isFunction(settings.tap)) {
								settings.tap();
							}
						}
						$(this).unbind("mouseup");
						$(this).unbind("mousemove");
					});
					
					// Click and drag events
					$(this).bind("mousemove." + settings.eventNameSpace, function(e) {
						// unbind mousemove if the button is released (or finger is lifted)
						$(this).bind("mouseup." + settings.eventNameSpace, function() {
							$(this).unbind("mousemove." + settings.eventNameSpace);
						});
            // Handle horizontal swipes
						var diffX = (e.pageX - offsetLeft) - data.x;
            var diffY = (e.pageY - offsetTop) - data.y;

						if (diffX <= -settings.threshold) {
							$(this).unbind("mousemove." + settings.eventNameSpace);
              console.log("left")
							if ($.isFunction(settings.dragLeft)) {
                settings.dragLeft();
              }
						} else if (diffX >= settings.threshold) {
							$(this).unbind("mousemove." + settings.eventNameSpace);
							console.log("right")
              if ($.isFunction(settings.dragRight)) {
                settings.dragRight();
              }
						}
            // Handle vertical swipes
            if (diffY <= -settings.threshold) {
              $(this).unbind("mousemove." + settings.eventNameSpace);
              console.log("up")
              if ($.isFunction(settings.dragUp)) {
                settings.dragUp();
              }
            } else if (diffY >= settings.threshold) {
              $(this).unbind("mousemove." + settings.eventNameSpace);
              console.log("down")
              if ($.isFunction(settings.dragDown)) {
                settings.dragDown();
              }
            }
					});
				});
				} else {
					/* Events for mobile browsers */
					var lastPageX, lastPageY, offsetLeft, offsetTop;
					
					this.addEventListener("touchstart", function(e) {
						e.preventDefault();
						offsetLeft = ($(window).width()-$(this).outerWidth(true))/2;
						offsetTop = ($(window).height()-$(this).outerHeight(true))/2;
						data.x = e.targetTouches[0].pageX - offsetLeft;
						data.y = e.targetTouches[0].pageY - offsetTop;
						data.time = new Date();
						
						// Start timer for hold event
						if ($.isFunction(settings.hold)) {
							data.t = setTimeout("settings.hold()",settings.holdTime);
						}
					}, false);
					
					this.addEventListener("touchmove", function(e) {
						e.preventDefault();
						lastPageX = e.targetTouches[0].pageX - offsetLeft;
						lastPageY = e.targetTouches[0].pageY - offsetTop;
					}, false);
					
					this.addEventListener("touchend", function(e) {
						e.preventDefault();
						var diffX = (lastPageX - offsetLeft) - data.x;
						if (data.t != null) clearTimeout(data.t); // End timer for hold event if it hasn't been triggered
						
						if (diffX <= -settings.threshold) {
							if ($.isFunction(settings.dragLeft)) settings.dragLeft();
						} else if (diffX >= settings.threshold) {
							if ($.isFunction(settings.dragRight)) settings.dragRight();
						}
					}, false);
					
				}
			});

			return this;
		};
	});
})(jQuery);