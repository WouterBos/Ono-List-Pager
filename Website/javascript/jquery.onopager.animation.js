/**
 * @namespace Animation namespace
 */
onoPager.animation = (function() {
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
     * @param {Object} extraConfig Extra, custom configuration object for the
     *   animation object.
     * @return {object} The animation object.
     */
    createAnimation: function(animationType, config, extraConfig) {
      if (typeof(onoPager.animation[animationType]) != 'function') {
        throw new Error('animationType "' + animationType + '" is not of ' +
          'type function, but ' + typeof(onoPager.animation[animationType]));
      }
      config.root.addClass('onoPager_animation_' + animationType);

      var animation = onoPager.animation[animationType](
        {
          list: config.list,
          listContainer: config.listContainer,
          listItems: config.listItems,
          animationSpeed: config.animationSpeed,
          orientation: config.orientation,
          pagePerItem: config.pagePerItem,
          pageNext: config.pageNext,
          pagePrevious: config.pagePrevious,
          activeIndex: config.activeIndex,
          animationEasing: config.animationEasing
        },
        extraConfig
      );

      interfaceCheck(
        animation,
        [
          'page',
          'init',
          'pagerHover'
        ]
      );

      return animation;
    }
  };
})();






/**
 * @namespace Base component of all animation objects. All properties and
 * methods defined here are available to all animation objects like "linear",
 * "linearScroller" and "slides". All private properties and methods are
 * designated by an underscore prefix. For example: "_checkMaxScroll" is
 * designated as a private method.
 *
 * @constructor
 * @param {Object} newConfig Standard configuration object.
 * @param {Object|Null} extraConfig Optional extra configuration object.
 */
onoPager.animation._standard = function(newConfig, extraConfig) {
  this._config = {
    list: null,
    listContainer: null,
    listItems: null,
    animationSpeed: 1000,
    orientation: null,
    pagePerItem: true,
    pageNext: null,
    pagePrevious: null,
    activeIndex: 0,
    pager: {},
    scroller: {},
    custom: {}
  };

  jQuery.extend(true, this._config, newConfig);
  if (typeof(extraConfig) == 'object') {
    jQuery.extend(true, this._config.custom, extraConfig);
  }

  /**
   * Checks if arg_scroll is not out of bounds. Use this method if you want to
   * make sure that the list makes use of the whole space of the viewport. The
   * argument arg_scroll is expected to be the offset of the list, like a
   * margin. If the offset is too high or too low, it wil return the maximum
   * or minimum scroll value. In other instances it will just return the
   * arg_scroll value.
   *
   * @param {Number} arg_scroll The offset of the list in pixels.
   * @return {Number} Returns either arg_scroll or the maximum or minimum scroll
   * value.
   * @this
   */
  this._checkMaxScroll = function(arg_scroll) {
    var tools = onoPager.tools;
    var orientation = this._config.orientation;
    var listSize = tools.getInnerSize(orientation, this._config.list);
    var listContainerSize = tools.getInnerSize(
      orientation,
      this._config.listContainer
    );

    maxScroll = listSize - listContainerSize;
    var scroll = arg_scroll;
    if (scroll > maxScroll) {
      scroll = maxScroll;
    }
    if (scroll < 0) {
      scroll = 0;
    }
    return scroll;
  }

  /**
   * Calculates how many times a user must page to reach the end.
   *
   * @return {Number} Total number of available pages. Most of the times the
   * return value is calculated with the private function _getPagesLength().
   * @this
   */
  this.getPagesLength = function() {
    var listContainer = this._config.listContainer;
    var listItems = this._config.listItems;

    if (this._config.pagePerItem == true) {
      return this._config.listItems.size();
    } else {
      var listItemsWidth = (listItems.size() * listItems.outerWidth(true));
      return Math.ceil(listItemsWidth / listContainer.innerWidth());
    }
  }

  /**
   * Set list container height to the list item with the most height.
   *
   * @param {Object} listContainer The list container.
   * @param {Object} listItems All items in the list (typically &lt;li&gt;).
   */
  this._setListContainerHeight = function(listContainer, listItems) {
    if (listItems.size() > 1) {
      var maxHeight = 0;
      listItems.each(function() {
        if (maxHeight < jQuery(this).innerHeight(true)) {
          maxHeight = jQuery(this).innerHeight(true);
        }
      });
      listContainer.height(maxHeight);
    }
  }

  /**
   * Add or remove the class 'active' to a list item.
   *
   * @param {Object|Null} index The index number of the item. If Null, the
   *    action is applied to all list items.
   * @param {Boolean} add true adds the class, false removes it.
   * @this
   */
  this._setActiveClass = function(index, add) {
    var item;
    if (typeof(index) == 'number') {
      item = jQuery(this._config.listItems[index]);
    } else {
      item = jQuery(this._config.listItems);
    }
    if (add) {
      item.addClass('active');
    } else {
      item.removeClass('active');
    }
  }

  /**
   * Extend config object
   *
   * @param {Object} arg_newconfig The new config object that has to extend the
   * existing config object.
   * @this
   */
  this.extendConfig = function(arg_newconfig) {
    jQuery.extend(true, this._config, arg_newconfig);
  }

  /**
   * Handles drag event of the scroller handle.
   *
   * @param {Number} percentage The position of the handle relative to the
   * scroller in percentage.
   * @this
   */
  this.onHandleDrag = function(percentage) {
    var list = this._config.list;
    var listContainer = this._config.listContainer;
    var orientation = this._config.orientation;
    var tools = onoPager.tools;
    var listSize = tools.getInnerSize(orientation, list);
    var listContainerSize = tools.getInnerSize(orientation, listContainer);
    var listScrollSize = listSize - listContainerSize;
    var listScrollPosition = Math.round(-((listScrollSize / 100) * percentage));
    var offsetKey = tools.getTopLeft(orientation);
    var css = {};

    css['margin-' + offsetKey] = listScrollPosition + 'px';
    list.css(css);
  }

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
   * Makes the transition from one slide to the next. This method is not
   * implemented in the base animation object, but is part of the interface.
   * Failing to implement this method will result in an error.
   *
   * @param {Number} oldIndex Index of the current active item.
   * @param {Number} newIndex Index of the item that will be active.
   */
  this.page = function(oldIndex, newIndex) {}
  delete this.page;

  this._page = function(oldIndex, newIndex) {
    this.page(oldIndex, newIndex);
  }

  /**
   * Event that is called when the pager is created. This method is not
   * implemented in the base animation object, but is part of the interface.
   * Failing to implement this method will result in an error.
   */
  this.onPagerCreated = function() {}
  delete this.onPagerCreated;

  this._onPagerCreated = function() {
    if (typeof(this.onPagerCreated) == 'function') {
      this.onPagerCreated();
    }
  }

  /**
   * Handles mouseenter and mouseleave event on the "previous" and "next"-links.
   * This method is not implemented in the base animation object, but is part of
   * the interface. Failing to implement this method will result in an error.
   *
   * @param {Number} move Suggested move integer if this method will do some
   * animation.
   */
  this.pagerHover = function(move) {}
  delete this.pagerHover;

  this._pagerHover = function(move) {
    if (this._config.scroller.updateHandle) {
      // update the handle of the scroller if one exists.
      this._config.scroller.updateHandle();
    }
    this.pagerHover(move);
  }
};






/**
 * @namespace Animation object. Incoming and outgoing slides will always appear
 *    next to each other. Even if they are not next to each other in the list,
 *    like the first and last item in the list.
 *
 * @param {Object} newConfig Standard configuration object.
 * @param {Object|Null} extraConfig Optional extra configuration object.
 * @return {Object} instance of an animation object.
 */
onoPager.animation.slides = function(newConfig, extraConfig) {
  /**
   * New animation object.
   * @memberOf onoPager.animation.slides
   */
  var slidesInstance = new onoPager.animation._standard(newConfig, extraConfig);
  var tools = onoPager.tools;

  /**
   * @see onoPager.animation._standard#init
   * @memberOf onoPager.animation.slides
   * @this
   */
  slidesInstance.init = function() {
    this._config.listItems.hide();
    this._config.listItems.css(
      {
        'position': 'absolute'
      }
    );
    jQuery(this._config.listItems[0]).show();
  }

  /**
   * @see onoPager.animation._standard#page
   * @memberOf onoPager.animation.slides
   * @this
   */
  slidesInstance.page = function(oldIndex, newIndex) {
    var oldItemLeft = 0;
    var newItemLeft = 0;
    var pageSize = tools.getInnerSize(
      slidesInstance._config.orientation,
      slidesInstance._config.listItems
    );

    if (oldIndex < newIndex) {
      // Next
      oldItemLeft = pageSize;
      newItemLeft = -pageSize;
    }
    if (oldIndex > newIndex) {
      // Previous
      oldItemLeft = -pageSize;
      newItemLeft = pageSize;
    }

    jQuery(this._config.listItems[oldIndex]).stop(true, true);
    jQuery(this._config.listItems[newIndex]).stop(true, true);

    this._config.listItems.each(function() {
      var item = jQuery(this);
      if (item.index() != oldIndex && item.index() != newIndex) {
        item.hide();
      }
    });

    var newCss = {};
    var topLeft = tools.getTopLeft(slidesInstance._config.orientation);
    newCss['display'] = 'block';
    newCss[topLeft] = oldItemLeft + 'px';
    jQuery(this._config.listItems[newIndex]).css(newCss);

    var oldAni = {};
    oldAni[topLeft] = newItemLeft + 'px';
    jQuery(this._config.listItems[oldIndex]).animate(
      oldAni,
      this._config.animationSpeed
    );

    var newAni = {};
    newAni[topLeft] = '0';
    jQuery(this._config.listItems[newIndex])
      .delay(this._config.animationSpeed / 8)
      .animate(newAni, this._config.animationSpeed);
  }

  /**
   * @see onoPager.animation._standard#pagerHover
   * @memberOf onoPager.animation.slides
   * @this
   */
  slidesInstance.pagerHover = function(move) {
    // Not implemented
  }

  return slidesInstance;
};






/**
 * @namespace Animation object. Moves through the list item in a linear manner.
 *
 * @param {Object} newConfig Standard configuration object.
 * @param {Object|Null} extraConfig Optional extra configuration object.
 * @return {Object} instance of an animation object.
 */
onoPager.animation.linear = function(newConfig, extraConfig) {
  /**
   * New animation object.
   * @memberOf onoPager.animation.linear
   * @this
   */
  var linearInstance = new onoPager.animation._standard(newConfig, extraConfig);
  var tools = onoPager.tools;

  linearInstance._setListContainerHeight = function(listContainer, listItems) {
    if (listItems.size() > 1) {
      var maxHeight = 0;
      listItems.each(function() {
        if (maxHeight < jQuery(this).innerHeight(true)) {
          maxHeight = jQuery(this).innerHeight(true);
        }
      });
      listContainer.height(maxHeight);
    }
  }

  /**
   * @see onoPager.animation._standard#init
   * @memberOf onoPager.animation.linear
   * @this
   */
  linearInstance.init = function() {
    if (this._config.orientation != 'horizontal' &&
        this._config.orientation != 'vertical') {
      throw new Error('Orientation must be either horizontal ' +
        'or vertical. It\'s now ' + this._config.orientation);
    }

    linearInstance._setActiveClass(linearInstance._config.activeIndex, true);
    var listBounds = 0;
    this._config.listItems.each(function(index) {
      listBounds += tools.getOuterSize(
        linearInstance._config.orientation,
        jQuery(this)
      );
    });
    this._config.listItems.css('float', 'left');
    this._config.list.css('position', 'relative');
    this._config.list.css(
      tools.getWidthHeight(this._config.orientation), listBounds + 'px'
    );
    this._setListContainerHeight(
      this._config.listContainer,
      this._config.listItems
    );
    this._config.listContainer.css({
        'position': 'relative'
    });

    var offset = tools.getPosition(
      this._config.orientation,
      jQuery(this._config.listItems[this._config.activeIndex])
    );
    if (this._config.orientation == 'horizontal') {
      this._config.list.css({ 'left': '-' + offset + 'px' });
    } else {
      this._config.list.css({ 'top': '-' + offset + 'px' });
    }
  }

  /**
   * @see onoPager.animation._standard#init
   * @memberOf onoPager.animation.linear
   * @this
   */
  linearInstance.page = function(oldIndex, newIndex) {
    if (oldIndex != newIndex) {
      linearInstance._setActiveClass(oldIndex, false);
    }
    this._config.list.stop(true, false);
    var offset;
    if (this._config.pagePerItem == true) {
      offset = tools.getPosition(
        this._config.orientation,
        jQuery(this._config.listItems[newIndex])
      );
    } else {
      var size = tools.getInnerSize(
        linearInstance._config.orientation,
        this._config.listContainer
      );
      offset = size * newIndex;
    }

    offset = this._checkMaxScroll(offset);

    var cssObj = {};
    var topLeft = tools.getTopLeft(this._config.orientation);
    cssObj[topLeft] = '-' + offset + 'px';
    this._config.list.animate(
      cssObj,
      {
        duration: 1000,
        easing: this._config.animationEasing,
        complete: function() {
          linearInstance._setActiveClass(newIndex, true);
        }
      }
    );
  }

  /**
   * @see onoPager.animation._standard#pagerHover
   * @memberOf onoPager.animation.linear
   * @this
   */
  linearInstance.pagerHover = function(move) {
    // Not implemented
  }

  return linearInstance;
};






/**
 * @namespace Animation object. Moves through the list item in a linear manner.
 *
 * @param {Object} newConfig Standard configuration object.
 * @param {Object|Null} extraConfig Optional extra configuration object.
 * @return {Object} instance of an animation object.
 */
onoPager.animation.linearContinous = function(newConfig, extraConfig) {
  /**
   * New animation object.
   * @memberOf onoPager.animation.linearContinous
   * @this
   */
  var linearContinousInstance = new onoPager.animation._standard(newConfig,
                                                                 extraConfig);
  var tools = onoPager.tools;
  var listItemSize = tools.getInnerSize(
    linearContinousInstance._config.orientation,
    linearContinousInstance._config.listItems
  );
  var newListItems; // contains the new list of items, after duplication
                    // takes place in onPagerCreated

  // Appends and prepends items until the list always fills the screen.
  function fillIdleSpace(idleSpace) {
    var list = linearContinousInstance._config.list;
    var listItems = linearContinousInstance._config.listItems;

    fillBefore();
    fillAfter();

    function fillBefore() {
      // Add items to the begin of the list
      var prependItems = jQuery([]);
      var prependItemsArray = [];
      var prependSpace = 0;

      for (var i = 1; i <= listItems.size(); i++) {
        if (prependSpace < idleSpace) {
          prependItemsArray.push(jQuery(listItems.get(-i)).clone(true));
          if (i > 1) {
            prependSpace += tools.getInnerSize(
              linearContinousInstance._config.orientation,
              jQuery(listItems.get(-i))
            );
          }
        } else {
          break;
        }
      }
      for (var i = 0; i < prependItemsArray.length; i++) {
        list.prepend(jQuery(prependItemsArray[i]).clone(true));
      }
    }

    function fillAfter() {
      // Add items at the end of the list
      var appendItems = jQuery([]);
      var appendSpace = 0;

      for (var i = 0; i < listItems.size(); i++) {
        if (appendSpace < idleSpace) {
          appendItems = appendItems.add(jQuery(listItems.get(i)).clone(true));
          if (i > 0) {
            appendSpace += tools.getInnerSize(
              linearContinousInstance._config.orientation,
              jQuery(listItems.get(i))
            );
          }
        } else {
          break;
        }
      }
      list.append(appendItems);
    }
  }

  linearContinousInstance._setListContainerHeight = function(listContainer,
                                                             listItems) {
    if (listItems.size() > 1) {
      var maxHeight = 0;
      listItems.each(function() {
        if (maxHeight < jQuery(this).innerHeight(true)) {
          maxHeight = jQuery(this).innerHeight(true);
        }
      });
      listContainer.height(maxHeight);
    }
  }

  /**
   * @see onoPager.animation._standard#init
   * @memberOf onoPager.animation.linearContinous
   * @this
   */
  linearContinousInstance.init = function() {
    if (this._config.orientation != 'horizontal' &&
        this._config.orientation != 'vertical') {
      throw new Error('Orientation must be either horizontal ' +
        'or vertical. It\'s now ' + this._config.orientation);
    }
  }

  /**
   * @see onoPager.animation._standard#init
   * @memberOf onoPager.animation.linearContinous
   * @this
   */
  linearContinousInstance.page = function(oldIndex, newIndex) {
    if (oldIndex != newIndex) {
      linearContinousInstance._setActiveClass(oldIndex, false);
    }
    this._config.list.stop(true, false);

    resetPosition(oldIndex, newIndex);

    var offset;
    if (this._config.pagePerItem == true) {
      offset = tools.getPosition(
        this._config.orientation,
        jQuery(this._config.listItems[newIndex])
      );
    }// else {
    //  var size = tools.getInnerSize(
    //    linearContinousInstance._config.orientation,
    //    this._config.listContainer
    //  );
    //  offset = size * jQuery(this._config.listItems[newIndex]).index();
    //}

    offset = this._checkMaxScroll(offset);

    var cssObj = {};
    var topLeft = tools.getTopLeft(this._config.orientation);
    cssObj[topLeft] = '-' + offset + 'px';
    this._config.list.animate(
      cssObj,
      {
        duration: 1000,
        easing: this._config.animationEasing,
        complete: function() {
          linearContinousInstance._setActiveClass(newIndex, true);
        }
      }
    );

    // To create the appearence of a list that repeats itself infinitely, the
    // list is repositioned just before it threatens to get out of bounds. 
    function resetPosition(oldIndex, newIndex) {
      var listSize = linearContinousInstance._config.listItems.size();
      var topLeft = tools.getTopLeft(
        linearContinousInstance._config.orientation
      );
      var offset;

      // If user pages from last item to first item, position on the item
      // *before* the first item.
      if (oldIndex == (listSize - 1) && newIndex == 0) {
        var firstIndex = newListItems.index(
          linearContinousInstance._config.listItems[newIndex]
        );

        if (linearContinousInstance._config.pagePerItem == true) {
          offset = tools.getPosition(
            linearContinousInstance._config.orientation,
            jQuery(newListItems[firstIndex - 1])
          );
          offset = Math.round(offset);
        }// else {
        //  var size = tools.getInnerSize(
        //    linearContinousInstance._config.orientation,
        //    linearContinousInstance._config.listContainer
        //  );
        //  offset = size * jQuery(
        //      linearContinousInstance._config.listItems[newIndex]
        //    ).index();
        //}
        return jQuery(newListItems[firstIndex - 1]);
      }

      // If user pages from the first item to last item, position on the item
      // *after* the last item.
      if (oldIndex == 0 && newIndex == (listSize - 1)) {
        var lastIndex = newListItems.index(
          linearContinousInstance._config.listItems[newIndex]
        );

        if (linearContinousInstance._config.pagePerItem == true) {
          offset = tools.getPosition(
            linearContinousInstance._config.orientation,
            jQuery(newListItems[lastIndex + 1])
          );
          offset = Math.round(offset);
        }// else {
        //  var size = tools.getInnerSize(
        //    linearContinousInstance._config.orientation,
        //    linearContinousInstance._config.listContainer
        //  );
        //  offset = size * jQuery(
        //    linearContinousInstance._config.listItems[newIndex]
        //  ).index();
        //}
        return jQuery(newListItems[lastIndex + 1]);
      }

      if (offset) {
        linearContinousInstance._config.list.css(topLeft, '-' + offset + 'px');
      }
    }
  }

  /**
   * @see onoPager.animation._standard#pagerHover
   * @memberOf onoPager.animation.linearContinous
   * @this
   */
  linearContinousInstance.pagerHover = function(move) {
    // Not implemented
  }

  linearContinousInstance.onPagerCreated = function(move) {
    var root = this._config.listContainer.parent();
    var rootSize = tools.getInnerSize(
      linearContinousInstance._config.orientation,
      root
    );
    var listContainerSize = tools.getInnerSize(
      linearContinousInstance._config.orientation,
      this._config.listContainer
    );
    var idleSpace = (rootSize - listContainerSize) / 2;
    var listBounds = 0;

    // Creates extra items to fill the idle space in the list container.
    fillIdleSpace(idleSpace);

    // Set active item
    linearContinousInstance._setActiveClass(
      linearContinousInstance._config.activeIndex,
      true
    );

    // Set list width/height
    newListItems = this._config.list.find('> .onoPager_listItem');
    newListItems.each(function(index) {
      listBounds += tools.getOuterSize(
        linearContinousInstance._config.orientation,
        jQuery(this)
      );
    });
    newListItems.css('float', 'left');
    this._config.list.css('position', 'relative');
    this._config.list.css(
      tools.getWidthHeight(this._config.orientation), listBounds + 'px'
    );
    this._setListContainerHeight(
      this._config.listContainer,
      newListItems
    );
    this._config.listContainer.css({
        'position': 'relative'
    });

    var offset = tools.getPosition(
      this._config.orientation,
      jQuery(this._config.listItems[this._config.activeIndex])
    );
    if (this._config.orientation == 'horizontal') {
      this._config.list.css({ 'left': '-' + offset + 'px' });
    } else {
      this._config.list.css({ 'top': '-' + offset + 'px' });
    }
  }

  return linearContinousInstance;
};






/**
 * @namespace Animation object. Moves through the list item in a linear manner.
 *    It also slowly scrolls when the user hovers over the "previous" or
 *    "next"-button.
 * @namespace
 * @param {Object} newConfig Standard configuration object.
 * @param {Object|Null} extraConfig Optional extra configuration object.
 * @return {Object} instance of an animation object.
 */
onoPager.animation.linearScroller = function(newConfig, extraConfig) {
  /**
   * New animation object.
   * @memberOf onoPager.animation.linearScroller
   * @this
   */
  var linearScrollerInstance = new onoPager.animation._standard(
    newConfig, extraConfig
  );
  var tools = onoPager.tools;
  var topLeft = tools.getTopLeft(linearScrollerInstance._config.orientation);

  function checkBounds(currentMargin, list, move) {
    var pagePrevious = linearScrollerInstance._config.pagePrevious;
    var pageNext = linearScrollerInstance._config.pageNext;
    var listSize = tools.getInnerSize(
      linearScrollerInstance._config.orientation,
      jQuery(list)
    );
    var viewportSize = tools.getInnerSize(
      linearScrollerInstance._config.orientation,
      jQuery(list).parent()
    );
    var maxMarginBound = listSize - viewportSize;
    var newMargin = currentMargin - move;
    var DISABLED = 'disabled';

    if (newMargin >= 0) {
      pagePrevious.addClass(DISABLED);
      return false;
    } else if ((newMargin - 1) <= (-maxMarginBound)) {
      pageNext.addClass(DISABLED);
      return false;
    } else {
      pagePrevious.removeClass(DISABLED);
      pageNext.removeClass(DISABLED);
      return true;
    }
  }

  function currentOffset() {
    var currentMargin = linearScrollerInstance._config.list.css(
                          'margin-' + topLeft);
    currentMargin = currentMargin.replace('px', '');
    currentMargin = parseInt(currentMargin);
    return currentMargin;
  }

  /**
   * @see onoPager.animation._standard#init
   * @memberOf onoPager.animation.linearScroller
   * @this
   */
  linearScrollerInstance.init = function() {
    var listSize = 0;
    if (this._config.orientation == 'horizontal') {
      this._config.listItems.css('float', 'left');
      this._config.listItems.each(function(index) {
        listSize += jQuery(this).outerWidth(true);
      });
      this._config.list.css(
        {
          'width': listSize + 'px',
          'position': 'relative'
        }
      );
    this._config.listContainer.css('position', 'relative');
    }
    var viewport = tools.getInnerSize(
      this._config.orientation,
      this._config.list.parent()
    );

    if (listSize > viewport) {
      this._config.pageNext.show();
    }

    checkBounds(currentOffset(), this._config.list, 0);
  }

  /**
   * @see onoPager.animation._standard#page
   * @memberOf onoPager.animation.linearScroller
   * @this
   */
  linearScrollerInstance.page = function(oldIndex, newIndex) {
    // Not implemented
  }

  /**
   * @see onoPager.animation._standard#pagerHover
   * @memberOf onoPager.animation.linearScroller
   * @this
   */
  linearScrollerInstance.pagerHover = function(move) {
    var speed = 5;
    if (move != 0) {
      var list = this._config.list;
      this._moveInterval = setInterval(
        function() {
          var currentMargin = currentOffset();
          if (!checkBounds(currentMargin, list, move)) {
            return;
          }
          list.css('margin-' + topLeft, (-move) + currentMargin + 'px');
        },
        speed
      );
    } else {
      clearInterval(this._moveInterval);
    }
  }

  return linearScrollerInstance;
};
