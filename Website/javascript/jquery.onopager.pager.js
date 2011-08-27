/**
 * @namespace Paging logic.
 *
 * @constructor
 * @param {Number} arg_index Initial index position.
 * @param {Number} arg_length Number of items in list.
 * @param {Boolean} arg_doesLoop If set to true, the pager will loop
 *    from the last item back to the first.
 * @param {Object} arg_controls Object that contains certain elements in the
 *    pager, wrapped in a jQuery object.
 * @param {Object} arg_status Configuration object for the status box.
 * @param {Number} arg_gotoLinks_hideThreshold Controls the number of links
 *    before and after the active link that are visible.
 */
onoPager.pager = function(arg_index,
                          arg_length,
                          arg_doesLoop,
                          arg_controls,
                          arg_status,
                          arg_gotoLinks_hideThreshold) {
  var index = arg_index || 0;
  var length = arg_length || 0;
  var doesLoop = (typeof(arg_doesLoop) == 'boolean') ? arg_doesLoop : true;
  var gotoLinks_hideThreshold = arg_gotoLinks_hideThreshold || -1;

  // Set autopager variables
  var autoPageConfig = {};  // Autopage configuration object
  var autoPageInterval;     // The interval between transitions in milliseconds
  var autoPageAnimation;    // The auto page animation object
  var autoPageContainer;    // The element in which the page animation happens
  var listContainer;        // The element that holds the list
  var animationSpeed;       // The speed of the transitions in milliseconds
  var orientation;          // The orientation
  var lockDuringTransition; // Determines of a user can make a page before the
                            //    current transition is finished
  var list;                 // The pager list. Most of the time that's a UL.

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
    if (doesLoop == true) {
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
      if (gotoLinks_hideThreshold >= 0) {
        toggleGotoLinks();
      }
    }

    if (controls.previous && doesLoop == false) {
      if (index == 0) {
        controls.previous.addClass(DISABLED);
      } else {
        controls.previous.removeClass(DISABLED);
      }
    }
    if (controls.next && doesLoop == false) {
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

    function toggleGotoLinks() {
      controls.gotoLinks.find('a').hide();
      //activeLink.show();

      var firstVisibleItem = index - gotoLinks_hideThreshold;
      var totalVisibleItems = (gotoLinks_hideThreshold * 2) + 1;
      if (firstVisibleItem < 0) {
        firstVisibleItem = 0;
      }
      if (firstVisibleItem > (length - totalVisibleItems)) {
        firstVisibleItem = (length - totalVisibleItems);
      }

      for (var i = firstVisibleItem;
           i < firstVisibleItem + totalVisibleItems;
           i++) {
        controls.gotoLinks.find('a:eq(' + i + ')').show();
      }
    }
  }

  // Set active index and check if the it's out of bounds
  function setIndex(arg_index) {
    index = indexCheckBounds(arg_index);
    setPagerButtons(index);
    return index;
  }

  // Set index by adding or substracting to the active item index
  function move(move) {
    index += move;
    index = indexCheckBounds(index);
    setPagerButtons(index);
    return index;
  }

  // Initializes autopage
  function startAutopager() {
    if (!autoPageAnimation) {
      autoPageAnimation = setAnimation();
    } else {
      autoPageAnimation.start();
    }
    autoPageInterval = setInterval(autoPager, autoPageConfig.interval);
  }

  // Starts a page transition (triggered by interval)
  function autoPager() {
    var canPage = onoPager.tools.canPage(
      listContainer.closest('div.onoPager'),
      lockDuringTransition,
      list,
      list.find('> *.onoPager_listItem')
    );

    if (canPage) {
      if (doesLoop == false && (index == (length - 1))) {
        clearInterval(autoPageInterval);
      }
      autoPageConfig.animation._page(index, move(1), 1);
      if (autoPageAnimation) {
        autoPageAnimation._start();
      }
    }
  }

  // Create autopage animation object
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
        },
        autoPageConfig.extraConfig
      );
      // In some cases onoPager.autopageAnimation.createAnimation returns
      // an undefined object because the animation object is not compatible
      // with the browser it runs in.
      if (newAnimation) {
        newAnimation._init();
        return newAnimation;
      } else {
        autoPageConfig.autoPageAnimationType = '';
        return null;
      }
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
   * @param {Number} arg_animationSpeed The time a transition will take in
   *    milliseconds.
   * @param {Object} arg_animation Animation instance.
   * @param {Object} arg_orientation Determines on what axis the
   *    animation moves. Possible values are 'horizontal' and 'vertical' though
   *    it's possible to use other values as long as the animation object
   *    supports that value. Default value is 'horizontal'.
   * @param {Object} arg_listContainer Element that holds the list.
   * @param {Object} arg_list Element that is the root of the list. That's the
   *  &lt;ul&gt; most of the time.
   * @param {Object} arg_autoPageContainer The element in which the auto page
   *    animation will take place.
   * @param {Boolean} arg_lockDuringTransition Determines of a user can make a
   *    page before the current transition is finished.
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
                                arg_autoPageContainer,
                                arg_lockDuringTransition) {
    var tools = onoPager.tools;

    // Setting local private variables
    animationSpeed = arg_animationSpeed;
    listContainer = arg_listContainer;
    orientation = arg_orientation;
    autoPageContainer = arg_autoPageContainer;
    lockDuringTransition = arg_lockDuringTransition;
    list = arg_list;
    jQuery.extend(true,
                  autoPageConfig,
                  arg_autoPageConfig,
                  {animation: arg_animation});
    var listSize = 0;
    list.find('*.onoPager_listItem').each(function() {
      listSize += tools.getInnerSize(orientation, jQuery(this));
    });
    var overflow = tools.getInnerSize(orientation, listContainer) - listSize;
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
