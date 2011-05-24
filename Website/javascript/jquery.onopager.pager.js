/**
 * @namespace Paging logic.
 *
 * @constructor
 * @param {Number|Null} arg_index Initial index position.
 * @param {Number|Null} arg_length Number of items in list.
 * @param {Boolean|Null} arg_pageLoop If set to true, the pager will loop
 *  from the last item back to the first.
 * @param {Object} arg_controls Object that contains certain elements in the
 *  pager, wrapped in a jQuery object.
 * @param {Object} arg_status Configuration object for the status box.
 */
onoPager.pager = function(arg_index,
                          arg_length,
                          arg_pageLoop,
                          arg_controls,
                          arg_status) {
  var index = arg_index || 0;
  var length = arg_length || 0;
  var pageLoop = (typeof(arg_pageLoop) == 'boolean') ? arg_pageLoop : true;

  // Set autopager variables
  var autoPageConfig = {};
  var autoPageInterval;
  var autoPageAnimation;
  var autoPageContainer;
  var listContainer;
  var animationSpeed;
  var orientation;

  // Set pager controls
  var controls = {
    previous: null,
    next: null,
    gotoLinks: null,
    status: null
  };
  jQuery.extend(true, controls, arg_controls);
  var status = {
    active: null,
    prependText: null,
    seperationText: null,
    appendText: null
  };
  jQuery.extend(true, status, arg_status);
  setPagerButtons(index);



  // Handle index values that are out of bounds
  function indexCheckBounds(arg_index) {
    if (pageLoop == true) {
      return indexCheckBounds_loop(arg_index);
    } else {
      return indexCheckBounds_noLoop(arg_index);
    }
  }

  // Handle index values that are out of bounds in a looping pager
  function indexCheckBounds_loop(arg_index) {
    if (arg_index < 0) {
      return (length - 1);
    } else if (arg_index > (length - 1)) {
      return 0;
    } else {
      return arg_index;
    }
  }

  // Handle index values that are out of bounds pager without looping
  function indexCheckBounds_noLoop(arg_index) {
    if (arg_index < 0) {
      return 0;
    } else if (arg_index > (length - 1)) {
      return (length - 1);
    } else {
      return arg_index;
    }
  }

  // Update the paging controls
  function setPagerButtons(index) {
    var DISABLED = 'disabled';
    if (controls.gotoLinks) {
      var activeLink = controls.gotoLinks.find('a:eq(' + index + ')');
      activeLink.siblings().removeClass('onoPager_active');
      activeLink.addClass('onoPager_active');
    }

    if (controls.previous && pageLoop == false) {
      if (index == 0) {
        controls.previous.addClass(DISABLED);
      } else {
        controls.previous.removeClass(DISABLED);
      }
    }
    if (controls.next && pageLoop == false) {
      if (index == (length - 1)) {
        controls.next.addClass(DISABLED);
      } else {
        controls.next.removeClass(DISABLED);
      }
    }
    if (controls.status) {
      controls.status.html(
        status.prependText + (index + 1) + status.seperationText +
        length + status.appendText
      );
    }
  }

  function setIndex(arg_index) {
    index = arg_index;
    index = indexCheckBounds(index);
    setPagerButtons(index);
    return index;
  }

  function move(move) {
    index += move;
    index = indexCheckBounds(index);
    setPagerButtons(index);
    return index;
  }

  function startAutopager() {
    autoPageInterval = setInterval(autoPager, autoPageConfig.interval);
    autoPageAnimation = setAnimation();
  }

  function autoPager() {
    if (pageLoop == false && (index == (length - 1))) {
      clearInterval(autoPageInterval);
    }
    autoPageConfig.animation._page(index, move(1));
    autoPageAnimation._start();
  }

  function setAnimation() {
    if (autoPageConfig.autoPageAnimationType != '') {
      var newAnimation = onoPager.autopageAnimation.createAnimation(
        {
          listContainer: listContainer,
          animationSpeed: animationSpeed,
          orientation: orientation,
          root: autoPageContainer,
          autoPageAnimationType: autoPageConfig.autoPageAnimationType,
          autoPageInterval: autoPageConfig.interval
        }
      );
      newAnimation._init();
      return newAnimation;
    } else {
      return null;
    }
  }



  /**
   * Returns index of currently active page
   * @return {Number} Index of currently active page.
   */
  this.getIndex = function() {
    return index;
  }

  /**
   * Sets index by assigning it.
   * @param {Number} arg_index The new index.
   * @return {Number} Returns the current index.
   */
  this.setIndex = function(arg_index) {
    return setIndex(arg_index);
  }

  /**
   * Sets index adding move value to index
   * @param {Number} arg_move The number the pager has to move.
   * @return {Number} index Returns the current index.
   */
  this.move = function(arg_move) {
    return move(arg_move);
  }

  /**
   * Sets index adding move value to index
   * @param {Object} arg_autoPageConfig AutoPage configuration.
   * @param {Object} arg_animation Animation instance.
   * @param {Object} orientation Determines on what axis the
   *    animation moves. Possible values are 'horizontal' and 'vertical' though
   *    it's possible to use other values as long as the animation object
   *    supports that value. Default value is 'horizontal'.
   * @param {Object} listContainer Element that holds the list.
   * @param {Object} list Element that is the root of the list. That's the
   *  &lt;ul&gt; most of the time.
   * @example
   * instance.initAutoPager(
   *    {
   *      active: true,
   *      interval: 2000
   *    }
   * );
   */
  this.initAutopager = function(arg_autoPageConfig,
                                arg_animationSpeed,
                                arg_animation,
                                arg_orientation,
                                arg_listContainer,
                                arg_list,
                                arg_autoPageContainer) {
    var tools = onoPager.tools;
    animationSpeed = arg_animationSpeed;
    listContainer = arg_listContainer;
    orientation = arg_orientation;
    autoPageContainer = arg_autoPageContainer;
    var overflow = tools.getInnerSize(orientation, listContainer) -
                     tools.getInnerSize(orientation, arg_list);
    jQuery.extend(true,
                  autoPageConfig,
                  arg_autoPageConfig,
                  {animation: arg_animation});
    if (overflow < 0) {
      startAutopager();
    }
  }

  /**
   * Sets index adding move value to index
   * @example
   * instance.initAutoPager(
   *    {
   *      active: true,
   *      interval: 2000
   *    }
   * );
   */
  this.resetAutopager = function() {
    clearInterval(autoPageInterval);
    startAutopager();
  }
};






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
     * @param {String} animationType Name of the animation that must be loaded.
     * @param {Object} config Configuration object.
     *   animation object.
     */
    createAnimation: function(config) {
      if (typeof(onoPager.autopageAnimation[config.autoPageAnimationType]) != 'function') {
        throw new Error('autoPageAnimationType "' + config.autoPageAnimationType + '" is not of ' +
          'type function, but ' + typeof(onoPager.autopageAnimation[config.autoPageAnimationType]));
      }
      config.root.addClass('onoPager_onoPager.autopageAnimation_' + config.autoPageAnimationType);

      var animation = onoPager.autopageAnimation[config.autoPageAnimationType](config);

      interfaceCheck(
        animation,
        [
          'init',
          'start'
        ]
      );

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
 */
onoPager.autopageAnimation._standard = function(newConfig) {
  this._config = {
    listContainer: null,
    animationSpeed: 0,
    orientation: null,
    root: null,
    autoPageInterval: 0
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
        left: listContainer.position().left + 'px',
        top: listContainer.position().top + listContainer.innerHeight(true) + 'px'
      }
    );

    bar.css('width', 0);
    bar.animate(
      {
        width: listContainer.innerWidth() + 'px'
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
        width: listContainer.innerWidth() + 'px'
      },
      {
        duration: interval,
        easing: 'linear'
      }
    );
  }

  return timelineInstance;
};
