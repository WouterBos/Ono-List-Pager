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
 * @param {Object|Null} extraConfig Optional extra configuration object.
 * @return {Object} instance of an animation object.
 */
onoPager.animation.canvas2d_square1 = function(newConfig, extraConfig) {
  /**
   * New animation object.
   * @memberOf onoPager.animation.slides
   */
  var square1Instance = new onoPager.animation._standard(newConfig, extraConfig);
  var tools = onoPager.tools;
  var drawClockInterval = null;
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
      if (drawClockInterval != null) {
        resetStage();
      }
      drawClockInterval = setInterval(draw, interval);
    }
    
    function resetStage() {
      clearInterval(drawClockInterval);
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
        clearInterval(drawClockInterval);
        counter = 0;
        jQuery(square1Instance._config.listItems[oldIndex]).hide();
        jQuery(square1Instance._config.listItems[newIndex]).show();
        drawClockInterval = setInterval(clearDraw, interval);
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
  square1Instance.pagerHover = function(move) {
    // Not implemented
  }

  return square1Instance;
};