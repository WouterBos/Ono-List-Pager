/**
 * @fileOverview Extra animation objects pack. They all make use of canvas.
 */



/*
IDEAS
- Arc animation
*/




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
   * @memberOf onoPager.animation.canvas2d_square1
   */
  var square1Instance = new onoPager.animation._standard(newConfig,
                                                         extraConfig);
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
   * @memberOf onoPager.animation.canvas2d_square1
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
   * @memberOf onoPager.animation.canvas2d_square1
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
        square1Instance._config.listContainer.append(
          onoPager.tools.createCanvas(square1Instance._config.listContainer
                                                             .outerWidth(),
                                      square1Instance._config.listContainer
                                                             .outerHeight()
          )
        );
      }
      theCanvas = square1Instance._config.listContainer.find('canvas')[0];
      context = theCanvas.getContext('2d');
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
        var width = parseInt((canvasWidth / frames) * counter);
        var height = parseInt((canvasHeight / frames) * counter);
        context.fillRect(
          parseInt(canvasWidth / 2) - parseInt(width / 2),
          parseInt(canvasHeight / 2) - parseInt(height / 2),
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
        var width = parseInt((canvasWidth / frames) * counter);
        var height = parseInt((canvasHeight / frames) * counter);
        context.clearRect(
          parseInt(canvasWidth / 2) - parseInt(width / 2),
          parseInt(canvasHeight / 2) - parseInt(height / 2),
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
   * @memberOf onoPager.animation.canvas2d_square1
   * @this
   */
  square1Instance.pagerHover = function(move) {
    // Not implemented
  }

  return square1Instance;
};






/**
 * @namespace Animation object. A solid color, swiping clockwise, will obscure
 *    the viewport. After it recedes, the new slide appears.
 *
 * @param {Object} newConfig Standard configuration object.
 * @param {Object} extraConfig Optional extra configuration object.
 * @param {String} extraConfig.color Fill color. Default is '#EB7D2C'.
 * @param {Number} extraConfig.interval The time in milliseconds between screen
 *    drawings.
 * @return {Object} instance of an animation object.
 */
onoPager.animation.canvas2d_clock = function(newConfig, extraConfig) {
  /**
   * New animation object.
   * @memberOf onoPager.animation.canvas2d_clock
   */
  var clockInstance = new onoPager.animation._standard(newConfig, extraConfig);
  var extraConfig = clockInstance._config.extraConfig;
  if (!clockInstance._config.extraConfig.color) {
    clockInstance._config.extraConfig.color = '#EB7D2C';
  }
  if (!clockInstance._config.extraConfig.interval) {
    clockInstance._config.extraConfig.interval = 10;
  }
  var tools = onoPager.tools;
  var drawClockInterval = null;
  var theCanvas;
  var interval = clockInstance._config.extraConfig.interval;
  var frames = (clockInstance._config.animationSpeed / 2) / interval;

  /**
   * @see onoPager.animation._standard#init
   * @memberOf onoPager.animation.canvas2d_clock
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
   * @memberOf onoPager.animation.canvas2d_clock
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
        clockInstance._config.listContainer.append(
          onoPager.tools.createCanvas(clockInstance._config.listContainer
                                                           .outerWidth(),
                                      clockInstance._config.listContainer
                                                           .outerHeight()
          )
        );
      }
      theCanvas = clockInstance._config.listContainer.find('canvas')[0];
      context = theCanvas.getContext('2d');
      canvasWidth = context.canvas.width;
      canvasHeight = context.canvas.height;
      if (drawClockInterval != null) {
        resetStage();
      }

      degrees = -90;
      drawClockInterval = setInterval(function() { draw(false) }, interval);
      jQuery(clockInstance._config.listItems.filter(':visible')).hide();
      jQuery(clockInstance._config.listItems[oldIndex]).show();
    }

    function resetStage() {
      clearInterval(drawClockInterval);
      counter = (frames - 1);
      context.clearRect(0, 0, canvasWidth, canvasHeight);
    }

    function draw(oppositeDirection) {
      degrees += 360 / ((clockInstance._config.animationSpeed / 2) / interval);

      if (degrees >= 269) {
        clearInterval(drawClockInterval);
        if (oppositeDirection == false) {
          degrees = -90;
          drawClockInterval = setInterval(function() { draw(true) }, interval);
          jQuery(clockInstance._config.listItems[oldIndex]).hide();
          jQuery(clockInstance._config.listItems[newIndex]).show();
        } else {
          resetStage();
        }
        return;
      }

      var centerX = Math.floor(canvasWidth / 2);
      var centerY = Math.floor(canvasHeight / 2);
      var radius = Math.floor(canvasWidth);
      var radian = (Math.PI / 180) * degrees;

      context.clearRect(0, 0, canvasWidth, canvasHeight);
      context.beginPath();
      context.moveTo(centerX, centerY);
      context.arc(centerX,
                  centerY,
                  radius,
                  (Math.PI / 180) * -90,
                  radian,
                  oppositeDirection);
      context.lineTo(centerX, centerY);
      context.closePath();

      context.fillStyle = extraConfig.color;
      context.fill();
    }

    function clearDraw() {
      if (counter <= frames) {
        var width = parseInt((canvasWidth / frames) * counter);
        var height = parseInt((canvasHeight / frames) * counter);
        context.clearRect(
          parseInt(canvasWidth / 2) - parseInt(width / 2),
          parseInt(canvasHeight / 2) - parseInt(height / 2),
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
   * @memberOf onoPager.animation.canvas2d_clock
   * @this
   */
  clockInstance.pagerHover = function(move) {
    // Not implemented
  }

  return clockInstance;
};






/**
 * @namespace Animation object. A solid color, appearing from the borders, will
 *    obscure the viewport. After it recedes, the new slide appears.
 *
 * @param {Object} newConfig Standard configuration object.
 * @param {Object} extraConfig Optional extra configuration object.
 * @param {String} extraConfig.color Fill color. Default is '#EB7D2C'.
 * @return {Object} instance of an animation object.
 */
onoPager.animation.canvas2d_frost = function(newConfig, extraConfig) {
  /**
   * New animation object.
   * @memberOf onoPager.animation.canvas2d_frost
   */
  var frostInstance = new onoPager.animation._standard(newConfig, extraConfig);
  var extraConfig = frostInstance._config.extraConfig;
  if (!frostInstance._config.extraConfig.color) {
    frostInstance._config.extraConfig.color = '235,125,44';
  }
  if (!frostInstance._config.extraConfig.interval) {
    frostInstance._config.extraConfig.interval = 10;
  }
  var tools = onoPager.tools;
  var drawFrostInterval = null;
  var theCanvas;
  var interval = frostInstance._config.extraConfig.interval;
  var color = frostInstance._config.extraConfig.color;
  var frames = (frostInstance._config.animationSpeed / 2) / interval;

  /**
   * @see onoPager.animation._standard#init
   * @memberOf onoPager.animation.canvas2d_frost
   * @this
   */
  frostInstance.init = function() {
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
   * @memberOf onoPager.animation.canvas2d_frost
   * @this
   */
  frostInstance.page = function(oldIndex, newIndex, direction) {
    var counter = 0;
    var context;
    var canvasWidth;
    var canvasHeight;
    var diagonalLength;

    this._config.listItems.hide();
    jQuery(this._config.listItems[oldIndex]).show();

    init();

    function init() {
      if (typeof(theCanvas) == 'undefined') {
        frostInstance._config.listContainer.append(
          onoPager.tools.createCanvas(frostInstance._config.listContainer
                                                           .outerWidth(),
                                      frostInstance._config.listContainer
                                                           .outerHeight()
          )
        );
      }
      theCanvas = frostInstance._config.listContainer.find('canvas')[0];
      context = theCanvas.getContext('2d');
      canvasWidth = context.canvas.width;
      canvasHeight = context.canvas.height;
      diagonalLength = Math.max(context.canvas.height, context.canvas.width);
      if (drawFrostInterval != null) {
        resetStage();
      }
      
      drawFrostInterval = setInterval(
        function() {
          draw(false)
        },
        interval
      );
      jQuery(frostInstance._config.listItems.filter(':visible')).hide();
      jQuery(frostInstance._config.listItems[oldIndex]).show();
    }

    function resetStage() {
      clearInterval(drawFrostInterval);
      context.clearRect(0, 0, canvasWidth, canvasHeight);
    }

    function draw(oppositeDirection) {
      if (counter <= frames && counter >= 0) {
        if (oppositeDirection == true) {
          counter--;
        } else {
          counter++;
        }
        var centerX = Math.floor(canvasWidth / 2);
        var centerY = Math.floor(canvasHeight / 2);
        var percentage = (counter / frames) * 100;
        if (percentage > 100) {
          percentage = 100;
        }
        if (percentage < 0) {
          percentage = 0;
        }
        var stopPosition = 1-(percentage/100);
        if (stopPosition == 0) {
          stopPosition = 0.001;
        }
        
        context.clearRect(0, 0, canvasWidth, canvasHeight);
        var gr = context.createRadialGradient(centerX,centerY,25,centerX,centerY,diagonalLength/2);
        opacityEased = (((percentage/100) / 100) * percentage);
        gr.addColorStop(0, 'rgba(' + color + ', ' + opacityEased + ')');
        gr.addColorStop(stopPosition, 'rgba(' + color + ', ' + opacityEased + ')');
        gr.addColorStop(1, 'rgba(' + color + ', 1)');
  
        context.fillStyle = gr;
        context.fillRect(0, 0, canvasWidth, canvasHeight);
      } else {
        clearInterval(drawFrostInterval);
        if (oppositeDirection == false) {
          jQuery(frostInstance._config.listItems[oldIndex]).hide();
          jQuery(frostInstance._config.listItems[newIndex]).show();
          counter = frames;
          drawFrostInterval = setInterval(
            function() {
              draw(true)
            },
            interval
          );
        } else {
          context.clearRect(0, 0, canvasWidth, canvasHeight);
        }
      }
    }
  }

  /**
   * @see onoPager.animation._standard#pagerHover
   * @memberOf onoPager.animation.canvas2d_frost
   * @this
   */
  frostInstance.pagerHover = function(move) {
    // Not implemented
  }

  return frostInstance;
};
