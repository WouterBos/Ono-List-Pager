/**
 * @fileOverview Extra animation objects pack. that use canvas
 */



/*
IDEAS
- Arc animation





/**
 * @namespace Animation object. Incoming and outgoing slides will always appear
 *    next to each other. Even if they are not next to each other in the list,
 *    like the first and last item in the list.
 *
 * @param {Object} newConfig Standard configuration object.
 * @param {Object} extraConfig Optional extra configuration object.
 * @param {String} extraConfig.color Fill color. Default is '#EB7D2C'.
 * @return {Object} instance of an animation object.
 */
onoPager.animation.canvas2d_square1 = function(newConfig, extraConfig) {
  /**
   * New animation object.
   * @memberOf onoPager.animation.slides
   */
  var square1Instance = new onoPager.animation._standard(newConfig, extraConfig);
  if (!square1Instance._config.extraConfig.color) {
    square1Instance._config.extraConfig.color = '#EB7D2C';
  }
  var tools = onoPager.tools;
  var drawInterval = null;
  var theCanvas;
  var interval = 10;
  var frames = square1Instance._config.animationSpeed / interval;

  /**
   * @see onoPager.animation._standard#init
   * @memberOf onoPager.animation.slides
   * @this
   */
  square1Instance.init = function() {
    this._config.listItems.css(
      {
        display: 'none',
        position: 'absolute',
        top: 0,
        left: 0
      }
    );
    jQuery(this._config.listItems[0]).show();
  }

  /**
   * @see onoPager.animation._standard#page
   * @memberOf onoPager.animation.slides
   * @this
   */
  square1Instance.page = function(oldIndex, newIndex, direction) {
    var counter = 0;
    var context;
    var canvasWidth;
    var canvasHeight;

    this._config.listItems.hide();
    jQuery(this._config.listItems[oldIndex]).show();
    
    init();
    
    function init() {
      if (typeof(theCanvas) == 'undefined') {
        var containerWidth = square1Instance._config.listContainer.outerWidth();
        var containerHeight = square1Instance._config.listContainer.outerHeight();
        square1Instance._config.listContainer.append('<canvas width="' + containerWidth + '" height="' + containerHeight + '" style="position: relative;"></canvas>');
      }
      theCanvas = square1Instance._config.listContainer.find('canvas')[0];
      context = theCanvas.getContext("2d");
      canvasWidth = context.canvas.width;
      canvasHeight = context.canvas.height;
      if (drawInterval != null) {
        resetStage();
      }
      drawInterval = setInterval(draw, interval);
    }
    
    function resetStage() {
      clearInterval(drawInterval);
      counter = (frames - 1);
      context.clearRect(0, 0, canvasWidth, canvasHeight);
    }

    function draw() {
      if (counter <= frames) {
        context.fillStyle = square1Instance._config.extraConfig.color;
        var width = parseInt((canvasWidth/frames) * counter);
        var height = parseInt((canvasHeight/frames) * counter);
        context.fillRect(
          parseInt(canvasWidth/2) - parseInt(width/2),
          parseInt(canvasHeight/2) - parseInt(height/2),
          width,
          height
        );
        counter++;
      } else {
        clearInterval(drawInterval);
        counter = 0;
        jQuery(square1Instance._config.listItems[oldIndex]).hide();
        jQuery(square1Instance._config.listItems[newIndex]).show();
        drawInterval = setInterval(clearDraw, interval);
      }
    }
    
    function clearDraw() {
      if (counter <= frames) {
        var width = parseInt((canvasWidth/frames) * counter);
        var height = parseInt((canvasHeight/frames) * counter);
        context.clearRect(
          parseInt(canvasWidth/2) - parseInt(width/2),
          parseInt(canvasHeight/2) - parseInt(height/2),
          width,
          height
        );
        counter++;
      } else {
        clearInterval(drawInterval);
        drawInterval = null;
      }
    }
  }

  /**
   * @see onoPager.animation._standard#pagerHover
   * @memberOf onoPager.animation.slides
   * @this
   */
  square1Instance.pagerHover = function(move) {
    // Not implemented
  }

  return square1Instance;
};






/**
 * @namespace Animation object. Incoming and outgoing slides will always appear
 *    next to each other. Even if they are not next to each other in the list,
 *    like the first and last item in the list.
 *
 * @param {Object} newConfig Standard configuration object.
 * @param {Object} extraConfig Optional extra configuration object.
 * @param {String} extraConfig.color Fill color. Default is '#EB7D2C'.
 * @return {Object} instance of an animation object.
 */
onoPager.animation.canvas2d_clock = function(newConfig, extraConfig) {
  /**
   * New animation object.
   * @memberOf onoPager.animation.slides
   */
  var clockInstance = new onoPager.animation._standard(newConfig, extraConfig);
  var extraConfig = clockInstance._config.extraConfig
  if (!clockInstance._config.extraConfig.color) {
    clockInstance._config.extraConfig.color = '#EB7D2C';
  }
  var tools = onoPager.tools;
  var drawClockInterval = null;
  var theCanvas;
  var interval = 10;
  var frames = clockInstance._config.animationSpeed / interval;

  /**
   * @see onoPager.animation._standard#init
   * @memberOf onoPager.animation.slides
   * @this
   */
  clockInstance.init = function() {
    this._config.listItems.css(
      {
        display: 'none',
        position: 'absolute',
        top: 0,
        left: 0
      }
    );
    jQuery(this._config.listItems[0]).show();
  }

  /**
   * @see onoPager.animation._standard#page
   * @memberOf onoPager.animation.slides
   * @this
   */
  clockInstance.page = function(oldIndex, newIndex, direction) {
    var counter = 0;
    var context;
    var canvasWidth;
    var canvasHeight;
    var degrees;

    this._config.listItems.hide();
    jQuery(this._config.listItems[oldIndex]).show();
    
    init();
    
    function init() {
      if (typeof(theCanvas) == 'undefined') {
        var containerWidth = clockInstance._config.listContainer.outerWidth();
        var containerHeight = clockInstance._config.listContainer.outerHeight();
        clockInstance._config.listContainer.append('<canvas width="' + containerWidth + '" height="' + containerHeight + '" style="position: relative;"></canvas>');
      }
      theCanvas = clockInstance._config.listContainer.find('canvas')[0];
      context = theCanvas.getContext("2d");
      canvasWidth = context.canvas.width;
      canvasHeight = context.canvas.height;
      if (drawClockInterval != null) {
        resetStage();
      }
      
      degrees = -80;
      drawClockInterval = setInterval(draw, interval);
    }
    
    function resetStage() {
      clearInterval(drawClockInterval);
      counter = (frames - 1);
      context.clearRect(0, 0, canvasWidth, canvasHeight);
    }

    function draw() {
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
    }
    
    function clearDraw() {
      if (counter <= frames) {
        var width = parseInt((canvasWidth/frames) * counter);
        var height = parseInt((canvasHeight/frames) * counter);
        context.clearRect(
          parseInt(canvasWidth/2) - parseInt(width/2),
          parseInt(canvasHeight/2) - parseInt(height/2),
          width,
          height
        );
        counter++;
      } else {
        clearInterval(drawClockInterval);
        drawClockInterval = null;
      }
    }
  }

  /**
   * @see onoPager.animation._standard#pagerHover
   * @memberOf onoPager.animation.slides
   * @this
   */
  clockInstance.pagerHover = function(move) {
    // Not implemented
  }

  return clockInstance;
};