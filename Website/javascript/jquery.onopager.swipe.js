(function($) {
  $.fn.quickGestures = function(options) {
    var settings = $.extend({
      eventNameSpace: 'quickGesture',
      dragLeft: null,
      dragRight: null,
      dragUp: null,
      dragDown: null,
      holdTime: 800,
      threshold: 50,
      platformMode: 'auto'
    }, options);

    this.each(function() {
      var data = {
        x: 0,
        y: 0,
        t: null,
        time: null
      };
      
      var platform = navigator.platform;
      var userAgent = navigator.userAgent;
      if (settings.platformMode == 'auto' &&
           (
             (platform.indexOf('iPhone') != -1) ||
             (platform.indexOf('iPod') != -1) ||
             (userAgent.indexOf('iPad') != -1) ||
             (userAgent.indexOf('Android') != -1)
           )
         ) {
        settings.platformMode = 'mobile';
      }
      
      // Handle swipes on desktop
      if (settings.platformMode != 'mobile') {
        $(this).mousedown(function(e) {
          var offsetLeft = ($(window).width()-$(this).outerWidth(true))/2;
          var offsetTop = ($(window).height()-$(this).outerHeight(true))/2;
          data.x = e.pageX - offsetLeft;
          data.y = e.pageY - offsetTop;
          data.time = new Date();
          
          $(this).bind('mousemove.' + settings.eventNameSpace, function(e) {
            $(this).bind('mouseup.' + settings.eventNameSpace, function() {
              $(this).unbind('mousemove.' + settings.eventNameSpace);
            });

            // Handle horizontal swipes
            var diffX = (e.pageX - offsetLeft) - data.x;
            var diffY = (e.pageY - offsetTop) - data.y;
  
            if (diffX <= -settings.threshold) {
              $(this).unbind('mousemove.' + settings.eventNameSpace);
              if ($.isFunction(settings.dragLeft)) {
                settings.dragLeft();
              }
            } else if (diffX >= settings.threshold) {
              $(this).unbind('mousemove.' + settings.eventNameSpace);
              if ($.isFunction(settings.dragRight)) {
                settings.dragRight();
              }
            }

            // Handle vertical swipes
            if (diffY <= -settings.threshold) {
              $(this).unbind('mousemove.' + settings.eventNameSpace);
              if ($.isFunction(settings.dragUp)) {
                settings.dragUp();
              }
            } else if (diffY >= settings.threshold) {
              $(this).unbind('mousemove.' + settings.eventNameSpace);
              if ($.isFunction(settings.dragDown)) {
                settings.dragDown();
              }
            }
          });
        });
      } else {
        // Handle swipes on mobile browsers
        var lastPageX, lastPageY, offsetLeft, offsetTop;
        
        this.addEventListener('touchstart', function(e) {
          e.preventDefault();
          offsetLeft = ($(window).width()-$(this).outerWidth(true))/2;
          offsetTop = ($(window).height()-$(this).outerHeight(true))/2;
          data.x = e.targetTouches[0].pageX - offsetLeft;
          data.y = e.targetTouches[0].pageY - offsetTop;
          data.time = new Date();
        }, false);
        
        this.addEventListener('touchmove', function(e) {
          e.preventDefault();
          lastPageX = e.targetTouches[0].pageX - offsetLeft;
          lastPageY = e.targetTouches[0].pageY - offsetTop;
        }, false);
        
        this.addEventListener('touchend', function(e) {
          e.preventDefault();
          var diffX = (lastPageX - offsetLeft) - data.x;
          if (data.t != null) {
            // End timer for hold event if it hasn't been triggered
            clearTimeout(data.t);
          }
          
          if (diffX <= -settings.threshold) {
            if ($.isFunction(settings.dragLeft)) {
              settings.dragLeft();
            }
          } else if (diffX >= settings.threshold) {
            if ($.isFunction(settings.dragRight)) {
              settings.dragRight();
            }
          }
        }, false);
      }
    });

    return this;
  };
})(jQuery);