/**
 * @fileOverview Swiping code for mobile browsers. Lots of code comes from the
 *               QuickGestures jQuery plugin of Anders Zakrisson.
 */






(function($) {
  /**
   * Handles swipe events on mobile phones and desktops. The code is based on
   * the QuickGestures jQuery plugin of Anders Zakrisson.
   *
   * @return {Object} chainable jQuery class.
   * @memberOf jQuery.fn
   * @param {Object|Null} arg_config Swipe config.
   * @param {Function} arg_config.dragLeft Handles drag left event.
   * @param {Function} arg_config.dragRight Handles drag right event.
   * @param {Function} arg_config.dragUp Handles drag up event.
   * @param {Function} arg_config.dragDown Handles drag down event.
   * @param {Number} arg_config.threshold Number of pixels that have to be
   *    dragged before something is considered a swipe.
   * @param {String} arg_config.platform Determines on what platforms
   *    the user is able to page by swiping. 'touch' activates swiping only on
   *    touch devices. 'all' will activates swiping on touch devices and
   *    desktop. Swiping on the desktop is done with mouse gestures. Default
   *    value is 'touch'.
   */
  jQuery.fn.onoPagerSwipe = function(arg_config) {
    var config = {
      dragLeft: null,
      dragRight: null,
      dragUp: null,
      dragDown: null,
      threshold: 75,
      platform: 'touch'
    };
    config = $.extend(true, config, arg_config);

    return this.each(function() {
      var data = {
        x: 0,
        y: 0,
        t: null,
        time: null
      };

      if (config.platform == 'touch') {
        // Check if browser supports touch events
        var el = document.createElement('div');
        el.setAttribute('ontouchstart', '');
        el.setAttribute('ontouchmove', '');
        el.setAttribute('ontouchend', '');
        if (typeof(el.ontouchstart) != 'function' ||
            typeof(el.ontouchmove) != 'function' ||
            typeof(el.ontouchend) != 'function') {
          config.platform = '';
        }
      }

      if (config.platform == 'touch' || config.platform == 'all') {
        // Handle swipes on mobile browsers
        var lastPageX, lastPageY, offsetLeft, offsetTop;

        this.addEventListener(
          'touchstart',
          function(e) {
            //e.preventDefault();
            offsetLeft = ($(window).width() - $(this).outerWidth(true)) / 2;
            offsetTop = ($(window).height() - $(this).outerHeight(true)) / 2;
            data.x = e.targetTouches[0].pageX - offsetLeft;
            data.y = e.targetTouches[0].pageY - offsetTop;
            data.time = new Date();
          },
          false
        );

        this.addEventListener(
          'touchmove',
          function(e) {
            e.preventDefault();
            //e.stopPropagation();
            lastPageX = e.targetTouches[0].pageX - offsetLeft;
            lastPageY = e.targetTouches[0].pageY - offsetTop;
          },
          false
        );

        this.addEventListener(
          'touchend',
          function(e) {
            e.preventDefault();
            var diffX = lastPageX - data.x;
            var diffY = lastPageY - data.y;
            if (data.t != null) {
              // End timer for hold event if it hasn't been triggered
              clearTimeout(data.t);
            }

            if (diffX <= -config.threshold) {
              if ($.isFunction(config.dragLeft)) {
                config.dragLeft();
              }
            } else if (diffX >= config.threshold) {
              if ($.isFunction(config.dragRight)) {
                config.dragRight();
              }
            }

            if (diffY <= -config.threshold) {
              if ($.isFunction(config.dragUp)) {
                config.dragUp();
              }
            } else if (diffY >= config.threshold) {
              if ($.isFunction(config.dragDown)) {
                config.dragDown();
              }
            }
          },
          false
        );
      }
      if (config.platform == 'all') {
        // Handles swipes on desktop
        $(this).mousedown(function(e) {
          var offsetLeft = ($(window).width() - $(this).outerWidth(true)) / 2;
          var offsetTop = ($(window).height() - $(this).outerHeight(true)) / 2;
          data.x = e.pageX - offsetLeft;
          data.y = e.pageY - offsetTop;
          data.time = new Date();

          $(this).bind('mousemove', function(e) {
            $(this).bind('mouseup', function() {
              $(this).unbind('mousemove');
            });

            // Handles horizontal swipes
            var diffX = (e.pageX - offsetLeft) - data.x;
            var diffY = (e.pageY - offsetTop) - data.y;

            if (diffX <= -config.threshold) {
              $(this).unbind('mousemove');
              if ($.isFunction(config.dragLeft)) {
                config.dragLeft();
              }
            } else if (diffX >= config.threshold) {
              $(this).unbind('mousemove');
              if ($.isFunction(config.dragRight)) {
                config.dragRight();
              }
            }

            // Handle vertical swipes
            if (diffY <= -config.threshold) {
              $(this).unbind('mousemove');
              if ($.isFunction(config.dragUp)) {
                config.dragUp();
              }
            } else if (diffY >= config.threshold) {
              $(this).unbind('mousemove');
              if ($.isFunction(config.dragDown)) {
                config.dragDown();
              }
            }
          });
        });
      }
    });
  };
})(jQuery);
