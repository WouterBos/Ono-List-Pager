/**
 * @fileOverview Ono pager (jQuery plugin)
 * @author Wouter Bos. Code for swiping based on the QuickGestures jQuery plugin
 *    of Anders Zakrisson.
 * @since 0.1 - 2011-3-28
 * @version 0.3 - 2011-5-7
 */

// TODO:
// - Build support for scroll wheel
// - Highlight arrow key when pressing an arrow key on keyboard
// - onHandleDrag assumes margin-*. Must handle possible left/top as well
// - Slider does not manage the disabled class on 'next' and 'previous'.
// Next release:
//  - Should 'page' still be mandatory?
//  - Do something with handleResize()
//    - Standard: Run method when either list container or list has dynamic size
//    - Standard: Wait until resize is finished
//    - Ani object: Reposition list
//    - Redraw paging by numbers links
//  - Temporary disable pager by adding class onoPager_disabled
//  - Make other animation objects like the linear scroller

(function($) {
  /**
   * Root jQuery namespace. See www.jquery.com.
   * @name jQuery
   * @class jQuery Library (www.jquery.com)
   */

  /**
   * jQuery functions namespace.
   * @name fn
   * @class jQuery Library (www.jquery.com)
   * @memberOf jQuery
   */

  /**
   * Creates a widget that enables the user to navigate through a list of
   * elements (like an <code>&lt;ul&gt;</code>). It provides different types of
   * paging navigation. These are called animation objects and reside in the
   * <code>onoPager.animation</code> namespace. The onoPager library consist
   * now of 3 types of animations: "slides", "linear" and "linearScroller".
   * The onoPager is built in such a way that it's easy to add your own
   * animation objects without having to rewrite the basic paging functionality.
   *
   * @param {Object} arg_config Configuration object.
   * @param {Object} animationConfig Optional extra configuration object for
   *    the animation object.
   * @param {Boolean} animationConfig.pagePerItem Page per item.
   * @param {String} animationConfig.ListContainer.width Width of list
   *    container, like '200px'.
   * @param {String} animationConfig.ListContainer.height Height of list
   *    container, like '200px'.
   * @param {String} animationConfig.ListItems.width Width of list items, like
   *    '200px'.
   * @param {String} animationConfig.ListItems.height Height of list items,
   *    like '200px'.
   * @param {Number} animationConfig.activeIndex Sets initial visible page. By
   *    default the pager starts at index 0.
   * @param {Boolean} animationConfig.autoPage.active Activates auto pager.
   * @param {Number} animationConfig.autoPage.interval The interval between
   *    autopaging. Time value is set in milliseconds.
   * @param {String} animationConfig.labels.next text for the 'next'-button.
   * @param {String} animationConfig.labels.previous Text for the
   *    'previous'-button.
   * @param {Boolean} animationConfig.status.active Activates the status box.
   * @param {String} animationConfig.status.prependText Text that appears before
   *    the page index number.
   * @param {String} animationConfig.status.seperationText Text that appears
   *    between the page index number and the total pages number.
   * @param {String} animationConfig.status.appendText Text that appears after
   *    the total pages number.
   * @param {Boolean} animationConfig.scroller Activates a Javascript scrollbar.
   *    Default is true.
   * @param {Boolean} animationConfig.keyTriggersPage Activates page navigation
   *    by using the arrow keys on the keyboard. Default is false.
   * @param {Boolean} animationConfig.swipeTriggersPage Activates page
   *    navigation by swiping on the screen. Default is false.
   * @param {String} animationConfig.swipePlatforms Determines on what platforms
   *    the user is able to page by swiping. 'touch' activates swiping only on
   *    touch devices. 'all' will activates swiping on touch devices and
   *    desktop. Swiping on the desktop is done with mouse gestures. Default
   *    value is 'touch'.
   * @param {String} animationConfig.animationType Determines which animation
   *    object will be used. The following animation types are available by
   *    default: 'linear', 'linearScroller' and 'slides'. Custom animation
   *    objects can be created and used after the plugin is loaded.
   * @param {String} animationConfig.animationEasing Determines the easing type
   *    to be used by the animation object. Default value is 'linear'.
   * @param {String} animationConfig.orientation Determines on what axis the
   *    animation moves. Possible values are 'horizontal' and 'vertical' though
   *    it's possible to use other values as long as the animation object
   *    supports that value. Default value is 'horizontal'.
   * @param {Number} animationConfig.animationSpeed Determines the speed at
   *    which the animations take place.
   * @return {jQuery} chainable jQuery class.
   * @memberOf jQuery.fn
   * @example
   * // Simple example:
   * jQuery('#list1').onoPager({
   *   pagePerItem: false,
   *   listContainer: {
   *     width: '700px',
   *     height: '100px'
   *   },
   *   listItems: {
   *     width: '300px'
   *   },
   *   animationType: 'linear',
   *   animationSpeed: 1000
   * });
   *
   * // Advanced example:
   * jQuery('#list1').onoPager({
   *    pagePerItem: true,
   *    pageLoop: true,
   *    listContainer: {
   *      width: '300px',
   *      height: '100px'
   *    },
   *    listItems: {
   *      width: '300px',
   *      height: '100px'
   *    },
   *    activeIndex: 2,
   *    autoPage: {
   *      active: true,
   *      interval: 2000,
   *    },
   *    labels: {
   *      next: 'next',
   *      previous: 'previous'
   *    },
   *    status: {
   *      active: true,
   *      prependText: 'page ',
   *      seperationText: ' of ',
   *      appendText: ' pages'
   *    },
   *    scroller: true,
   *    keyTriggersPage: false,
   *    swipeTriggersPage: false,
   *    swipePlatforms: 'touch',
   *    animationType: 'linear',
   *    animationEasing: 'linear',
   *    orientation: 'horizontal',
   *    animationSpeed: 1000
   * });
   */
  $.fn.onoPager = function(arg_config, animationConfig) {
    var config = {
      pagePerItem: true,
      pageLoop: true,
      listContainer: {
        width: '',
        height: ''
      },
      listItems: {
        width: '',
        height: ''
      },
      activeIndex: 0,
      autoPage: {
        active: false,
        interval: 2000
      },
      labels: {
        next: 'next',
        previous: 'previous'
      },
      status: {
        active: true,
        prependText: '',
        seperationText: ' / ',
        appendText: ''
      },
      scroller: { // TODO JSDOC
        active: false,
        pixelMove: 2
      },
      pageByNumber: true,
      keyTriggersPage: false,
      swipeTriggersPage: false,
      swipePlatforms: 'touch',
      animationType: 'linear',
      animationEasing: 'linear',
      orientation: 'horizontal',
      animationSpeed: 1000
    };
    config = $.extend(true, config, arg_config);
    var EMPTY_HREF = ' href="javascript:void(0)"';
    var ONOPAGER = 'onoPager';
    var HORIZONTAL = 'horizontal';
    var VERTICAL = 'vertical';

    var root; // The root element of the container
    var listContainer; // The div that contains the list element
    var list; // The list element
    var listItems; // The list items
    var pager; // The pager object
    var animation; // The animation object
    var pageNext; // The 'next'-link
    var pagePrevious; // The 'previous'-link
    var pageByNumber; // Container with list of links of available pages
    var pageStatus; // Container with feedback for user about the paging status
    var pageScroller; // Page by using the scroller




    // Set initial styling of the list with config values
    function setStyles() {
      if (config.listItems.width) {
        listItems.css('width', config.listItems.width);
      }
      if (config.listItems.height) {
        listItems.css('height', config.listItems.height);
      }
      if (config.listContainer.width) {
        listContainer.css('width', config.listContainer.width);
      }
      if (config.listContainer.height) {
        listContainer.css('height', config.listContainer.height);
      }
    }

    // Create pager controls like 'next' and 'previous'
    function createControls() {
      var newHTML = '';
      newHTML += '<a' + EMPTY_HREF +
        ' class="' + ONOPAGER + '_previous ' + ONOPAGER + '_step" title="' +
        config.labels.previous + '">' + config.labels.previous + '</a>';
      if (config.pageByNumber == true) {
        newHTML += '<div class="' + ONOPAGER + '_pageByNumber"/>';
      }
      newHTML += '<a' + EMPTY_HREF + ' class="' + ONOPAGER + '_next ' +
        ONOPAGER + '_step" ' + 'title="' + config.labels.next + '">' +
        config.labels.next + '</a>';
      if (config.status.active == true) {
        newHTML += '<div class="' + ONOPAGER + '_status" />';
      }
      if (config.scroller.active == true) {
        newHTML += '<div class="' + ONOPAGER + '_scroller"><div class="' +
          ONOPAGER + '_scrollerHandle"></div></div>';
      }
      root.append(
        '<div class="' + ONOPAGER + '_controls">' + newHTML + '</div>'
      );

      pageNext = root.find('> * > a.' + ONOPAGER + '_next');
      pagePrevious = root.find('> * > a.' + ONOPAGER + '_previous');
      pageByNumber = root.find('> * > div.' + ONOPAGER + '_pageByNumber');
      pageStatus = root.find('> * > div.' + ONOPAGER + '_status');
      pageScroller = root.find('> * > div.' + ONOPAGER + '_scroller');
    }

    // Initialize the animation object.
    function setAnimation() {
      animation = onoPager.animation.createAnimation(
        config.animationType,
        {
          root: root,
          list: list,
          listContainer: listContainer,
          listItems: listItems,
          animationSpeed: config.animationSpeed,
          orientation: config.orientation,
          pagePerItem: config.pagePerItem,
          pageNext: pageNext,
          pagePrevious: pagePrevious,
          activeIndex: config.activeIndex,
          animationEasing: config.animationEasing
        },
        animationConfig
      );
      animation._init();
    }

    function setPager() {
      var pageTotal = animation.getPagesLength();
      if (typeof(pageTotal) != 'number') {
        throw new Error(
          'getPagesLength() does not return a number but ' +
          typeof(pageTotal)
        );
      }
      if (pageTotal < 0) {
        throw new Error('getPagesLength() must not return a negative number');
      }
      if (pageTotal > 1) {
        pager = new onoPager.pager(
          config.activeIndex,
          pageTotal,
          config.pageLoop,
          {
            next: pageNext,
            previous: pagePrevious,
            gotoLinks: pageByNumber,
            status: pageStatus
          },
          config.status
        );
        if (config.autoPage.active == true) {
          pager.initAutopager(config.autoPage,
                              animation,
                              config.orientation,
                              listContainer,
                              list);
        }
      } else {
        pageNext.hide();
        pagePrevious.hide();
      }
      animation.extendConfig({pager: pager});
      animation._onPagerCreated();
    }

    function setPageByNumber() {
      var pageTotal = animation.getPagesLength();
      var html = '';

      for (var i = 0; i < pageTotal; i++) {
        html += '<a' + EMPTY_HREF + '>' + (i + 1) + '</a>';
      }

      pageByNumber.html(html);
      pageByNumber.find('a').each(function(index) {
        $(this).click(function() {
          page(index);
        });
      });
    }

    function setControlEvents() {
      // Page with scroller
      if (config.scroller.active == true) {
        var scroller = new onoPager.scroller(pageScroller,
                                             listContainer,
                                             list,
                                             config.orientation);
        scroller.init(animation);
        animation.extendConfig({scroller: scroller});
      }

      // Page by clicking on paging button
      pageNext.click(function() {
        page(pager.getIndex() + 1);
      });
      pagePrevious.click(function() {
        page(pager.getIndex() - 1);
      });

      // Set hover events on paging buttons
      pageNext.mouseenter(function() {
        pagerHover(config.scroller.pixelMove);
      });
      pageNext.mouseleave(function() {
        pagerHover(0);
      });
      pagePrevious.mouseenter(function() {
        pagerHover(-config.scroller.pixelMove);
      });
      pagePrevious.mouseleave(function() {
        pagerHover(0);
      });

      // Page with arrow keys on keyboard
      if (config.keyTriggersPage == true) {
        $(document).keydown(function(event) {
          var key = event.which;
          var UP = 38;
          var DOWN = 40;
          var LEFT = 37;
          var RIGHT = 39;
          // Page back
          if ((config.orientation == VERTICAL && key == UP) ||
            (config.orientation == HORIZONTAL && key == LEFT)) {
            page(pager.getIndex() - 1);
            event.preventDefault();
            event.stopPropagation();
          }
          // Page forward
          if ((config.orientation == VERTICAL && key == DOWN) ||
            (config.orientation == HORIZONTAL && key == RIGHT)) {
            page(pager.getIndex() + 1);
            event.preventDefault();
            event.stopPropagation();
          }
        });
      }

      // Page with swiping
      if (config.swipeTriggersPage == true) {
        if (config.orientation == HORIZONTAL) {
          listContainer.onoPagerSwipe(
            {
              dragRight: function() {
                page(pager.getIndex() - 1);
              },
              dragLeft: function() {
                page(pager.getIndex() + 1);
              },
              platform: config.swipePlatforms
            }
          );
        } else if (config.orientation == VERTICAL) {
          listContainer.onoPagerSwipe(
            {
              dragDown: function() {
                page(pager.getIndex() - 1);
              },
              dragUp: function() {
                page(pager.getIndex() + 1);
              },
              platform: config.swipePlatforms
            }
          );
        }
      }
    }

    function page(arg_newIndex) {
      if (config.autoPage.active == true) {
        pager.resetAutopager();
      }
      var oldIndex = pager.getIndex();
      var newIndex = pager.setIndex(arg_newIndex);
      animation._page(oldIndex, newIndex);
    }

    function pagerHover(moveIndex) {
      // TODO: update paging index
      animation._pagerHover(moveIndex);
    }

    function setResizeEvent() {
      $(window).resize(handleResize);
    }

    function handleResize() {
      // TODO: code window resizing handling.
    }



    return this.each(function() {
      // create list wrappers and references
      list = $(this);
      list.removeClass('' + ONOPAGER + '_noJs');
      list.addClass(ONOPAGER + '_list');
      list.wrap('<div class="' + ONOPAGER + '_listContainer"></div>');
      listContainer = list.parent();
      listContainer.wrap('<div class="' + ONOPAGER + '"/>');
      root = listContainer.parent();
      root.addClass(config.animationType);
      listItems = $(this).find(' > li, .' + ONOPAGER + '_listItem');
      listItems.addClass(ONOPAGER + '_listItem');

      // Set up ono pager
      setStyles();
      createControls();
      setAnimation();
      setPageByNumber();
      setPager();
      setControlEvents();
      setResizeEvent();
    });
  }






  /**
   * Handles swipe events on mobile phones and desktops. The code is based on
   * the QuickGestures jQuery plugin of Anders Zakrisson.
   *
   * @return {jQuery} chainable jQuery class.
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
  $.fn.onoPagerSwipe = function(arg_config) {
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
            e.preventDefault();
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






/**
 * @namespace Root namespace for the Ono Pager
 */
var onoPager = {};






/**
 * @namespace Manages the scroller control.
 *
 * @constructor
 * @param {Object} arg_pageScroller The scroller, wrapped in a jQuery object.
 * @param {Object} arg_listContainer The element that contains the list, wrapped
 *    in a jQuery object.
 * @param {Object} arg_list The element that contains the list, wrapped
 *    in a jQuery object.
 * @param {String} arg_orientation Determines on what axis the animation moves.
 * Possible values are 'horizontal' and 'vertical' though it's possible to use
 * other values as long as the animation object supports that value. Default
 * value is 'horizontal'.
 */
onoPager.scroller = function(arg_pageScroller,
                             arg_listContainer,
                             arg_list,
                             arg_orientation) {
  var pageScroller = arg_pageScroller;
  var pageHandle = pageScroller.find('> div.onoPager_scrollerHandle');
  var listContainer = arg_listContainer;
  var list = arg_list;
  var totalScroll;
  var updateInterval;
  var orientation = arg_orientation;
  var noChangeCount = 0;
  var previousOffset = 0;
  var tools = onoPager.tools;
  var listContainerSize = 0;
  var listScrollSize = 0;
  var interval = 10;
  var topLeft = tools.getTopLeft(orientation);

  function _updateHandle() {
    var positionList = tools.getOffset(orientation, list);
    var positionListContainer = tools.getOffset(orientation, listContainer);
    var offset = -(positionList - positionListContainer);
    clearIntervalIfNoChange(offset);
    var scrollPercentage = Math.round((offset / listScrollSize) * 100);
    pageHandle.css(topLeft, ((totalScroll / 100) * scrollPercentage) + 'px');
  }

  function clearIntervalIfNoChange(arg_offset) {
    if (arg_offset == previousOffset) {
      noChangeCount++;
      if (noChangeCount > 10) {
        clearInterval(updateInterval);
      }
    } else {
      noChangeCount = 0;
    }
    previousOffset = arg_offset;
  }



  this.init = function(animation, pageNext, pagePrevious) {
    var listSize = tools.getInnerSize(orientation, list);
    listContainerSize = tools.getInnerSize(orientation, listContainer);
    listScrollSize = listSize - listContainerSize;
    var sizeKey = tools.getWidthHeight(orientation);
    var pageScrollerCss = {};
    pageScrollerCss[sizeKey] = listContainerSize + 'px';
    if (orientation == 'horizontal') {
      pageScrollerCss['height'] = pageHandle.outerHeight();
    } else {
      pageScrollerCss['width'] = pageHandle.outerWidth();
    }
    pageScroller.css(pageScrollerCss);

    totalScroll = tools.getInnerSize(orientation, pageScroller) -
                    tools.getOuterSize(orientation, pageHandle);
    var dragHandler = new onoPager.scroller.dragHandle(pageHandle,
                                                       orientation,
                                                       totalScroll,
                                                       animation,
                                                       pageNext,
                                                       pagePrevious);
    dragHandler.init();
  }

  this.updateHandle = function() {
    clearInterval(updateInterval);
    noChangeCount = 0;
    updateInterval = setInterval(_updateHandle, interval, totalScroll);
  }
};






/**
 * @namespace Code for making the scroller handle draggable.
 *
 * @constructor
 */
onoPager.scroller.dragHandle = function(arg_handle,
                                        arg_orientation,
                                        arg_totalScroll,
                                        arg_animation,
                                        arg_pageNext,
                                        arg_pagePrevious) {
  var startSize = 0;
  var offsetSize = 0;
  var previousSize = 0;
  var dragElement;
  var HORIZONTAL = 'horizontal';
  var VERTICAL = 'vertical';
  var handle = arg_handle;
  var orientation = arg_orientation;
  var totalScroll = arg_totalScroll;
  var animation = arg_animation;
  var pageNext = arg_pageNext;
  var pagePrevious = arg_pagePrevious;

  function onMouseDown(e) {
    var target = e.target;
    if ((e.button == 1 && window.event != null ||
      e.button == 0)) {

      if (orientation == HORIZONTAL) {
        startSize = e.pageX;
        offsetSize = extractNumber(target.style.left);
      } else if (orientation == VERTICAL) {
        startSize = e.pageY;
        offsetSize = extractNumber(target.style.top);
      }
      previousSize = startSize;

      jQuery(document).bind('mousemove.scroller', onMouseMove);
      jQuery(document).bind('mouseup.scroller', onMouseUp);

      // prevent text selection or image drag
      document.onselectstart = function() {return false;};
      handle[0].ondragstart = function() {return false;};
      //document.body.focus();
      return false;
    }
  }

  function onMouseMove(e) {
    var offset = 0;
    if (orientation == HORIZONTAL) {
      offset = setBoundsToOffset(offsetSize + e.pageX - startSize);
      handle.css('left', offset + 'px');
    } else if (orientation == VERTICAL) {
      offset = setBoundsToOffset(offsetSize + e.pageY - startSize);
      handle.css('top', offset + 'px');
    }
    animation.onHandleDrag(Math.round((offset / totalScroll) * 100));
  }

  function setBoundsToOffset(arg_offset) {
    var offset = arg_offset;

    if (offset < 0) {
      offset = 0;
      pagePrevious.addClass('disabled');
    } else if (offset > totalScroll) {
      offset = totalScroll;
      pageNext.addClass('disabled');
    } else {
      pageNext.removeClass('disabled');
      pagePrevious.removeClass('disabled');
    }

    return offset;
  }

  function onMouseUp(e) {
    handle[0].ondragstart = null;
    document.onselectstart = null;
    jQuery(document).unbind('mousemove.scroller', onMouseMove);
    jQuery(document).unbind('mouseup.scroller', onMouseUp);
  }

  function extractNumber(value) {
    var n = parseInt(value);
    return n == null || isNaN(n) ? 0 : n;
  }



  this.init = function() {
    handle.mousedown(onMouseDown);

    if (orientation == HORIZONTAL) {
      handle.css('cursor', 'w-resize');
    } else if (orientation == VERTICAL) {
      handle.css('cursor', 'n-resize');
    }
  }
};






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
    autoPageInterval = setInterval(
      function() {
        if (pageLoop == false && (index == (length - 1))) {
          clearInterval(autoPageInterval);
        }
        autoPageConfig.animation._page(index, move(1));
      },
      autoPageConfig.interval
    );
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
                                arg_animation,
                                orientation,
                                listContainer,
                                list) {
    var tools = onoPager.tools;
    var overflow = tools.getInnerSize(orientation, listContainer) -
                     tools.getInnerSize(orientation, list);
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
    // TODO: remove
    // Start custom
    if (typeof(linearInstance._config.custom.background) != 'undefined') {
      linearInstance._config.custom.background.change(newIndex);
    }
    // End custom
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

    //TODO: _checkMaxScroll check does not work in Estate 15 years
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
          // TODO: remove
          // Start custom
          if (typeof(linearInstance._config.custom.background) != 'undefined') {
            linearInstance._config.custom.background.show();
          }
          // End custom
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
    var topLeft = tools.getTopLeft(this._config.orientation)
    var speed = 5;
    if (move >= 1 || move <= -1) {
      var list = this._config.list;
      var pagePrevious = this._config.pagePrevious;
      var pageNext = this._config.pageNext;

      this._moveInterval = setInterval(
        function() {
          var currentMargin = list.css('margin-' + topLeft);
          currentMargin = currentMargin.replace('px', '');
          currentMargin = parseInt(currentMargin);
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

    var checkBounds = function(currentMargin, list, move) {
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

      if (newMargin > 0) {
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
  }

  return linearScrollerInstance;
};






/**
 * @namespace Helper methods for the animation objects.
 */
onoPager.tools = (function() {
  var HORIZONTAL = 'horizontal';
  var VERTICAL = 'vertical';

  return {
    /**
     * Returns either left or top position in pixels relative to the page.
     * @param {Object} orientation Either 'horizontal' or 'vertical'.
     * @param {Object} selector jQuery selector.
     * @return {Number} Left or top offset in pixels.
     */
    getOffset: function(orientation, selector) {
      if (orientation == HORIZONTAL) {
        return jQuery(selector).offset().left;
      } else if (orientation == VERTICAL) {
        return jQuery(selector).offset().top;
      }
    },

    /**
     * Returns either left or top position in pixels relative to its offset
     * parent.
     * @param {Object} orientation Either 'horizontal' or 'vertical'.
     * @param {Object} selector jQuery selector.
     * @return {Number} Left or top position in pixels.
     */
    getPosition: function(orientation, selector) {
      if (orientation == HORIZONTAL) {
        return jQuery(selector).position().left;
      } else if (orientation == VERTICAL) {
        return jQuery(selector).position().top;
      }
    },

    /**
     * Returns either the string 'width' or 'height'.
     * @param {Object} orientation Either 'horizontal' or 'vertical'.
     * @return {String} Either 'width or 'height'.
     */
    getWidthHeight: function(orientation) {
      if (orientation == HORIZONTAL) {
        return 'width';
      } else if (orientation == VERTICAL) {
        return 'height';
      }
    },

    /**
     * Returns either the string 'left' or 'top'.
     * @param {Object} orientation Either 'horizontal' or 'vertical'.
     * @return {String} Either 'left or 'top'.
     */
    getTopLeft: function(orientation) {
      if (orientation == HORIZONTAL) {
        return 'left';
      } else if (orientation == VERTICAL) {
        return 'top';
      }
    },

    /**
     * Returns either the width or height of an element in pixels. Padding,
     *   border and margin included.
     * @param {Object} orientation Either 'horizontal' or 'vertical'.
     * @param {Object} selector jQuery selector.
     * @return {String} Either width or height in pixels.
     */
    getOuterSize: function(orientation, selector) {
      if (orientation == HORIZONTAL) {
        return jQuery(selector).outerWidth(true);
      } else if (orientation == VERTICAL) {
        return jQuery(selector).outerHeight(true);
      }
    },

    /**
     * Returns either the width or height of an element in pixels. Padding
     *   included.
     * @param {Object} orientation Either 'horizontal' or 'vertical'.
     * @param {Object} selector jQuery selector.
     * @return {String} Either width or height in pixels.
     */
    getInnerSize: function(orientation, selector) {
      if (orientation == HORIZONTAL) {
        return jQuery(selector).innerWidth(true);
      } else if (orientation == VERTICAL) {
        return jQuery(selector).innerHeight(true);
      }
    },
  };
})();
