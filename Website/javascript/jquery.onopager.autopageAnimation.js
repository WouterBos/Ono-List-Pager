/**
 * @namespace Handles animation that gives a time indication of the intervals
 *    between paging.
 */
onoPager.autopageAnimation = (function() {
  // Throws an error if the created animation object does not comply to the
  // interface.
  function interfaceCheck(animation, publicMethods) {
    var hasMethod;
    for (var i = 0; i < publicMethods.length; i++) {
      hasMethod = false;
      for (object in animation) {
        if (object == publicMethods[i]) {
          hasMethod = true;
        }
      }
      if (hasMethod == false) {
        throw new Error('Animation object does not implement ' +
          'public method "' + publicMethods[i] + '"');
      }
      if (typeof(animation[object]) != 'function') {
        throw new Error('animation.' + publicMethods[i] + ' is not of type' +
          '"function", but "' + typeof(animation[object]) + '"');
      }
    }
  }

  return {
    /**
     * This method creates and returns an animation object.
     *
     * @param {Object} config Configuration object.
     * @return {object} The animation object.
     */
    createAnimation: function(config, extraConfig) {
      if (typeof(onoPager.autopageAnimation[config.autoPageAnimationType]) !=
          'function') {
        throw new Error('autoPageAnimationType "' +
          config.autoPageAnimationType + '" is not of type function, but ' +
          typeof(onoPager.autopageAnimation[config.autoPageAnimationType])
        );
      }
      
      var animation
      
      config.root.addClass('onoPager_autopageAnimation_' +
        config.autoPageAnimationType);
            
      var animationSupport = true;
      if ('isSupportedByBrowser' in
          onoPager.autopageAnimation[config.autoPageAnimationType]) {
        if (onoPager.autopageAnimation[config.autoPageAnimationType]
            .isSupportedByBrowser() == false) {
          animationSupport = false;
        }
      }
      
      if (animationSupport == true) {
        animation = onoPager.autopageAnimation[
          config.autoPageAnimationType](config, extraConfig);
        interfaceCheck(
          animation,
          [
            'init',
            'start'
          ]
        );
      }

      return animation;
    }
  };
})();






/**
 * @namespace Base component of all autopage animation objects. All properties
 * and methods defined here are available to all animation objects. All private
 * properties and methods are designated by an underscore prefix.
 *
 * @constructor
 * @param {Object} newConfig Standard configuration object.
 * @param {Object} newConfig.listContainer jQuery object. References to
 *    the element that is the container for the list from which the pager is
 *    built.
 * @param {Number} newConfig.animationSpeed Determines the speed at
 *    which the animations take place. Time value is set in milliseconds.
 * @param {String} newConfig.orientation Determines on what axis the
 *    animation moves. Possible values are 'horizontal' and 'vertical' though
 *    it's possible to use other values as long as the animation object
 *    supports that value. Default value is 'horizontal'.
 * @param {Object} newConfig.root The DOM element in which all animation must
 *    take place.
 * @param {Number} newConfig.autoPageInterval The interval between
 *    autopaging. Time value is set in milliseconds.
 */
onoPager.autopageAnimation._standard = function(newConfig) {
  this._config = {
    listContainer: null, /* The element of the list */
    animationSpeed: 0, /* Time the animation takes */
    orientation: null, /* 'horizontal' or 'vertical' */
    root: null, /* The DOM element in which all animation must take place. */
    autoPageInterval: 0 /* The interval between autopaging */
  };
  jQuery.extend(true, this._config, newConfig);

  /**
   * This method is run when the animation object is initialized. This method
   * is not implemented in the base animation object, but is part of the
   * interface. Failing to implement this method will result in an error.
   */
  this.init = function() {}
  delete this.init;

  this._init = function() {
    this.init();
  }

  /**
   * Starts the page animation. This method is not implemented in the base
   * animation object, but is part of the interface. Failing to implement this
   * method will result in an error.
   */
  this.start = function() {}
  delete this.page;

  this._start = function() {
    this.start();
  }
};






/**
 * @namespace Autopage animation object. This object will create a simple
 * timeline
 *
 * @param {Object} newConfig Standard configuration object.
 * @return {Object} instance of an animation object.
 */
onoPager.autopageAnimation.timeline = function(newConfig) {
  /**
   * New animation object.
   * @memberOf onoPager.autopageAnimation.timeline
   */
  var timelineInstance = new onoPager.autopageAnimation._standard(newConfig);
  var tools = onoPager.tools;
  var bar = jQuery([]);
  var root = timelineInstance._config.root;
  var listContainer = timelineInstance._config.listContainer;

  /**
   * @see onoPager.autopageAnimation._standard#init
   * @memberOf onoPager.autopageAnimation.timeline
   * @this
   */
  timelineInstance.init = function() {
    root.html('<div class="onoPager_autoPageBar"></div>');
    bar = root.find('div.onoPager_autoPageBar');
    root.css(
      {
        width: listContainer.innerWidth(),
        position: 'absolute',
        /* left: listContainer.position().left + 'px', */
        top: listContainer.position().top +
               listContainer.innerHeight(true) + 'px'
      }
    );

    bar.css('width', 0);
    bar.animate(
      {
        width: root.innerWidth() + 'px'
      },
      {
        duration: this._config.autoPageInterval,
        easing: 'linear'
      }
    );
  }

  /**
   * @see onoPager.autopageAnimation._standard#start
   * @memberOf onoPager.autopageAnimation.timeline
   * @this
   */
  timelineInstance.start = function() {
    var interval = this._config.autoPageInterval - this._config.animationSpeed;

    bar.stop(true, true);
    bar.css('width', 0);
    bar.delay(this._config.animationSpeed).animate(
      {
        width: root.innerWidth() + 'px'
      },
      {
        duration: interval,
        easing: 'linear'
      }
    );
  }

  return timelineInstance;
};






/**
 * @namespace Autopage animation object. This object will create a pie chart
 * representing a clock.
 *
 * @param {Object} newConfig Standard configuration object.
 * @param {Object} arg_extraConfig Extra configuration options that are
 *    specific to this animation object.
 * @param {Number} arg_extraConfig.widthHeight The width and height of the
 *    clock.
 * @param {String} arg_extraConfig.color The hex color of the clock.
 * @param {Number} arg_extraConfig.shadowBlur The blur range of the shadow in
 *    pixels. Default value is 5.
 * @param {Number} arg_extraConfig.shadowOffsetX The X-axis offset of the
 *    shadow. A positive value will cast a shadow to the right, a negative to
 *    the left. Default value is 2.
 * @param {Number} arg_extraConfig.shadowOffsetY The Y-axis offset of the
 *    shadow. A positive value will cast a shadow above the clock, a negative
 *    one below. Default value is 2.
 * @param {String} arg_extraConfig.shadowBackgroundColor The hex color of the
 *    shadow.
 * @param {Number} arg_extraConfig.intervalPrecision Determines the number of
 *    frames in the animation. A value of 1 will give the maximum smoothness
 *    to the animation, but the clock might then not be able to keep up with
 *    the pager's speed. A higher number will create a more responsive
 *    animation, but also creates less frames.. The default value is 4.
 * @return {Object} instance of an animation object.
 */
onoPager.autopageAnimation.clock = function(newConfig, arg_extraConfig) {
  /**
   * New animation object.
   * @memberOf onoPager.autopageAnimation.clock
   */
  var clockInstance = new onoPager.autopageAnimation._standard(newConfig);
  var extraConfig = {
    widthHeight: 16,
    color: '#ffffff',
    shadowBlur: 5,
    shadowOffsetX: 2,
    shadowOffsetY: 2,
    shadowBackgroundColor: '#999999',
    intervalPrecision: 4
  };
  jQuery.extend(true, extraConfig, arg_extraConfig);
  var canvasWidth = extraConfig.widthHeight + extraConfig.shadowBlur;
  if (extraConfig.shadowOffsetX < 0) {
    canvasWidth += -extraConfig.shadowOffsetX;
  } else {
    canvasWidth += extraConfig.shadowOffsetX;
  }

  var canvasHeight = extraConfig.widthHeight + extraConfig.shadowBlur;
  if (extraConfig.shadowOffsetY < 0) {
    canvasHeight += -extraConfig.shadowOffsetY;
  } else {
    canvasHeight += extraConfig.shadowOffsetY;
  }

  var degrees;
  var root = clockInstance._config.root;
  var canvas;
  var context;
  var drawClockInterval;
  var drawClockTimeout;
  var listContainer = clockInstance._config.listContainer;
  var interval;

  function drawClock() {
      degrees += extraConfig.intervalPrecision;

      var centerX = Math.floor((extraConfig.widthHeight / 2) +
                               extraConfig.shadowOffsetX);
      var centerY = Math.floor((extraConfig.widthHeight / 2) +
                               extraConfig.shadowOffsetY);
      var radius = Math.floor(extraConfig.widthHeight / 2);

      context.clearRect(0, 0, canvasWidth + 10, canvasHeight + 10);
      context.beginPath();
      context.moveTo(centerX, centerY);
      context.arc(centerX,
                  centerY,
                  radius,
                  (Math.PI / 180) * -90,
                  (Math.PI / 180) * degrees,
                  false);
      context.lineTo(centerX, centerY);
      context.closePath();

      context.fillStyle = extraConfig.color;
      context.shadowColor = extraConfig.shadowBackgroundColor;
      context.shadowBlur = extraConfig.shadowBlur;
      context.shadowOffsetX = extraConfig.shadowOffsetX;
      context.shadowOffsetY = extraConfig.shadowOffsetY;
      context.fill();
  };

  /**
   * @see onoPager.autopageAnimation._standard#init
   * @memberOf onoPager.autopageAnimation.timeline
   * @this
   */
  clockInstance.init = function() {
    interval = this._config.autoPageInterval - this._config.animationSpeed;
    root.html('<canvas width="' + canvasWidth + '" height="' +
              canvasHeight + '"></canvas>');
    canvas = root.find('canvas')[0];
    context = canvas.getContext('2d');
    this.start();
  }

  /**
   * @see onoPager.autopageAnimation._standard#start
   * @memberOf onoPager.autopageAnimation.timeline
   * @this
   */
  clockInstance.start = function() {
    clearInterval(drawClockInterval);
    degrees = -80;
    context.clearRect(0, 0, canvasWidth, canvasHeight);
    drawClockTimeout = setTimeout(
      function() {
        drawClockInterval = setInterval(
          drawClock,
          Math.floor(interval / (360 / extraConfig.intervalPrecision))
        );
      },
      this._config.animationSpeed);
  }
  
  return clockInstance;
};


/**
 * @namespace Checks browser support for the clock animation object.
 *
 * @param {Object} config Configuration object.
 * @return {object} The animation object.
 */
onoPager.autopageAnimation.clock.isSupportedByBrowser = function() {
  var canvas = document.createElement('canvas');
  if (canvas.getContext) {
    return true;
  } else {
    return false;
  }
}