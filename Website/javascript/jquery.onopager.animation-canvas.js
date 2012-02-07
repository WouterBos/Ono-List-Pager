/**
 * @fileOverview Extra animation objects pack. that use canvas
 */






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
    var frames = 100;
    var counter = 0;
    var interval = 5
    var drawClockInterval;
    var theCanvas;
    var context;
    var canvasWidth;
    var canvasHeight;

    this._config.listItems.hide();
    jQuery(this._config.listItems[oldIndex]).show();
    
    init();
    
    function init() {
      console.log('init');
      if (typeof(theCanvas) == 'undefined') {
        var containerWidth = onoPager.animation.listContainer.outerWidth();
        var containerHeight = onoPager.animation.listContainer.outerHeight();
        square1Instance._config.listContainer.append('<canvas width="' + containerWidth + '" height="' + containerHeight + '"></canvas>');
      }
      theCanvas = square1Instance._config.listContainer.find('canvas')[0];
      context = theCanvas.getContext("2d");
      canvasWidth = context.canvas.width;
      canvasHeight = context.canvas.height;
      drawClockInterval = setInterval(draw, interval);
    }

    function draw() {
      if (counter <= frames) {
        context.fillStyle = '#ff00ff';
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
      }
    }

    //jQuery(this._config.listItems[newIndex]).show();
    //jQuery(this._config.listItems[oldIndex]).show();
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