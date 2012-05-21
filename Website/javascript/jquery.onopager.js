/**
 * @fileOverview Ono pager (jQuery plugin)
 * @author Wouter Bos, Web developer at Estate Internet (www.estate.nl). Code
 *    for swiping based on the QuickGestures jQuery plugin of Anders Zakrisson.
 *
 * Demos an documentation on http://www.thebrightlines.com/onopager/website/
 *
 * @since 0.1 - 2011-3-28
 * @version 1.2 - 2012-2-19
 */

/*
TODO:
- Offer some interface to control OnoPager after the UI object is created.
- Cancel loading of images until (almost) needed.
- Option to hide navigation controls altogether
- Play/pause-button for autopager
- pageByNumber should have a 'last' and 'first'-link.
- Build support for scroll wheel
- Highlight arrow key when pressing an arrow key on keyboard
*/

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
   * <code>onoPager.animation</code> namespace.<br />
   * The onoPager library consist of many types of animations like "slides",
   * "linear" and "linearScroller". The onoPager is built in such a way that
   * it's easy to add your own animation objects without having to rewrite the
   * basic paging functionality.<br />
   * Check out some <a href="http://www.thebrightlines.com/onopager/website/">
   * configuration examples</a>.
   *
   * @param {Object} arg_config Configuration object.
   *
   * @param {Object} animationConfig Optional extra configuration object for
   *    the animation object.
   *
   * @param {String} arg_config.cssClass Ads CSS class to the root of the pager.
   *
   * @param {Boolean} arg_config.pagePerItem If true, each page will be as long
   *    as one list item. If false, each page will be as long as the list
   *    container, which may span multiple list items.
   *
   * @param {Boolean} arg_config.lockDuringTransition Disable paging controls
   *    during a transition when true. Default is false.
   *
   * @param {Boolean} arg_config.doesLoop If true, the pager scrolls back
   *    to the first item after the last item.
   *
   * @param {String} arg_config.listContainer.width Width of list
   *    container, like '200px'.
   *
   * @param {String} arg_config.listContainer.height Height of list
   *    container, like '200px'.
   *
   * @param {String} arg_config.listContainer.maxHeight Maximum height of list
   *    container, like '200px'. The maximum height will also be applied to all
   *    list Items.
   *
   * @param {Boolean} arg_config.listContainer.adjustHeightToListItem.active If
   *    you also set pagePerItem to true, the height of the list container will
   *    adjust to the height of the visible list item. Default value is true.
   *
   * @param {Boolean} arg_config.listContainer.adjustHeightToListItem.animate If
   *    true, the container will animatie to its new height. Default value is
   *    true.
   *
   * @param {String} arg_config.ListItems.width Width of list items, like
   *    '200px'.
   *
   * @param {String} arg_config.ListItems.height Height of list items,
   *    like '200px'.
   *
   * @param {Number} arg_config.activeIndex Sets initial visible page. By
   *    default the pager starts at index 0.
   *
   * @param {Boolean} arg_config.autoPage.active Activates auto pager.
   *
   * @param {Number} arg_config.autoPage.interval The interval between
   *    autopaging. Time value is set in milliseconds.
   *
   * @param {Boolean} arg_config.autoPage.active Activates auto pager.
   *
   * @param {String} arg_config.autoPage.autoPageAnimationType The type
   *    of animation that will indicate the time the time between transitions.
   *
   * @param {Object} arg_config.autoPage.extraConfig A configuration object
   *    for the autopage indicator.
   *
   * @param {Boolean} arg_config.autoPage.pauseOnHover Stops the pager when
   *    the mouse cursor hovers above the pager.
   *
   * @param {String} arg_config.labels.next text for the 'next'-button.
   *
   * @param {String} arg_config.labels.previous Text for the
   *    'previous'-button.
   *
   * @param {Boolean} arg_config.status.active Activates the status box.
   *
   * @param {String} arg_config.status.prependText Text that appears before
   *    the page index number.
   *
   * @param {String} arg_config.status.seperationText Text that appears
   *    between the page index number and the total pages number.
   *
   * @param {String} arg_config.status.appendText Text that appears after
   *    the total pages number.
   *
   * @param {Boolean} arg_config.scroller.active Activates a Javascript
   *    scrollbar. Default is true.
   *
   * @param {Number} arg_config.pixelMove The amount of pixels the pager
   *    scrolls after each frame.
   *
   * @param {Boolean} arg_config.pageByNumber.active Activates the bar with
   *    all pages, defined by number. Default is true.
   *
   * @param {Boolean} arg_config.pageByNumber.enableClick Disables paging
   *    behaviour onclick. The makes the 'Page by number'-box essentially a
   *    status box rather than a navigation control. Default is true.
   *
   * @param {Array} arg_config.pageByNumber.labels Replaces the default
   *    content of the page-by-number links with the string values in the array.
   *
   * @param {Number} arg_config.pageByNumber.hideThreshold Defines how many
   *    links may appear in the pageByNumber box. If you set the value to 2,
   *    you'll see 2 links on the left and 2 on the right of the active item. A
   *    negative value cancels this functionality. Default value is -1.
   *
   * @param {Array} arg_config.pageByNumber.links Overrides the default click
   *    behavior of the page-by-number links. If you supply an array of URL's,
   *    they will behave like standard links that point to an URL.
   *
   * @param {Boolean} arg_config.pageByNumber.enableHover Initiates a page
   *    when the mouse is hovered over a page by number item.
   *
   * @param {Boolean} arg_config.pageByArrowKey.active Enables paging by
   *    using the keyboard arrow keys. Default is false.
   *
   * @param {Boolean} arg_config.pageByArrowKey.preventDefault Disables or
   *    activates the default behaviour of the arrow key. If set to true, the
   *    user won't be able to scroll the page or a textarea with the arrow keys.
   *    Default is false for that reason.
   *
   * @param {Boolean} arg_config.swipeTriggersPage Activates page
   *    navigation by swiping on the screen. Default is true.
   *
   * @param {String} arg_config.swipePlatforms Determines on what platforms
   *    the user is able to page by swiping. 'touch' activates swiping only on
   *    touch devices. 'all' will activates swiping on touch devices and
   *    desktop. Swiping on the desktop is done with mouse gestures. Default
   *    value is 'touch'.
   *
   * @param {String} arg_config.animationType Determines which animation
   *    object will be used. The following animation types are available by
   *    default: 'linear', 'linearScroller' and 'slides'. Custom animation
   *    objects can be created and used after the plugin is loaded. Default
   *    value is 'linear'.
   *
   * @param {String} arg_config.animationEasing Determines the easing type
   *    to be used by the animation object. Default value is 'linear'. If
   *    'easeOutCubic' is available, it will use that as default value.
   *
   * @param {String} arg_config.orientation Determines on what axis the
   *    animation moves. Possible values are 'horizontal' and 'vertical' though
   *    it's possible to use other values as long as the animation object
   *    supports that value. Default value is 'horizontal'.
   *
   * @param {Number} arg_config.animationSpeed Determines the speed at
   *    which the animations take place.
   *
   * @return {jQuery} chainable jQuery class.
   * @memberOf jQuery.fn
   *
   * @example
   * // Simple example:
   * // More examples on: http://www.thebrightlines.com/onopager/website/
   * jQuery('#list1').onoPager({
   *   cssClass: 'onoPager_greyscale',
   *   pagePerItem: true,
   *   doesLoop: false,
   *   listContainer: {
   *     width: '280px',
   *     height: ''
   *   },
   *   listItems: {
   *     width: '260px',
   *     height: '80px'
   *   },
   *   status: {
   *     active: false
   *   },
   *   pageByArrowKey: {
   *     active: true,
   *     preventDefault: false
   *   },
   *   pageByNumber: {
   *     hideThreshold: 1
   *   },
   *   swipeTriggersPage: true,
   *   animationType: 'linear',
   *   animationEasing: 'easeOutCubic',
   *   orientation: 'horizontal',
   *   animationSpeed: 1000
   * });
   */
  jQuery.fn.onoPager = function(arg_config, animationConfig) {
    var config = {
      cssClass: 'onoPager_greyscale',
      pagePerItem: true,
      lockDuringTransition: false,
      doesLoop: true,
      listContainer: {
        width: '280px',
        height: '',
        maxHeight: '',
        adjustHeightToListItem: {
          active: false,
          animate: false
        }
      },
      listItems: {
        width: '260px',
        height: '',
        triggersPagingOnClick: false
      },
      activeIndex: 0,
      autoPage: {
        active: false,
        interval: 2000,
        autoPageAnimationType: '',
        pauseOnHover: false,
        extraConfig: {}
      },
      labels: {
        next: 'next',
        previous: 'previous'
      },
      status: {
        active: false,
        prependText: '',
        seperationText: ' / ',
        appendText: ''
      },
      scroller: {
        active: false,
        pixelMove: 2
      },
      pageByNumber: {
        active: true,
        enableClick: true,
        labels: [],
        links: [],
        enableHover: false,
        hideThreshold: -1
      },
      pageByArrowKey: {
        active: false,
        preventDefault: false
      },
      swipeTriggersPage: true,
      swipePlatforms: 'touch',
      animationType: 'linear',
      animationEasing: 'linear',
      orientation: 'horizontal',
      animationSpeed: 1000
    };
    config = $.extend(true, config, arg_config);
    if (typeof(jQuery.easing.easeOutCubic) == 'function') {
      config.animationEasing = 'easeOutCubic';
    }
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
    var autoPageContainer; // Box that gives feedback about the autopage status




    // Set initial styling (mainly the dimensions of the boxes) of the list
    // with config values.
    function setStyles() {
      if (typeof(config.listItems.width) == 'string' &&
          config.listItems.width.length > 0) {
        listItems.css('width', config.listItems.width);
      }

      if (typeof(config.listItems.maxHeight) == 'string' &&
          config.listItems.maxHeight.length > 0) {
        listItems.css('max-height', config.listItems.maxHeight);
        listContainer.css('max-height', config.listContainer.maxHeight);
      } else if (typeof(config.listItems.height) == 'string' &&
          config.listItems.height.length > 0) {
        listItems.css('height', config.listItems.height);
      }

      if (typeof(config.listContainer.width) == 'string' &&
          config.listContainer.width.length > 0) {
        listContainer.css('width', config.listContainer.width);
      }

      if (typeof(config.listContainer.height) == 'string' &&
          config.listContainer.height.length > 0) {
        listContainer.css('height', config.listContainer.height);
      }
    }

    // Creates pager controls like 'next' and 'previous'.
    function createControls() {
      var newHTML = '';
      if (config.autoPage.autoPageAnimationType && config.autoPage.active) {
        newHTML += '<div class="' + ONOPAGER + '_autoPageContainer"></div>';
      }
      newHTML += '<a' + EMPTY_HREF + ' class="' + ONOPAGER + '_previous ' +
        ONOPAGER + '_step"><span>' + config.labels.previous + '</span></a>';
      if (config.pageByNumber.active == true) {
        newHTML += '<div class="' + ONOPAGER + '_pageByNumber"/>';
      }
      newHTML += '<a' + EMPTY_HREF + ' class="' + ONOPAGER + '_next ' +
        ONOPAGER + '_step"><span>' + config.labels.next + '</span></a>';
      if (config.status.active == true) {
        newHTML += '<div class="' + ONOPAGER + '_status"><span></span></div>';
      }
      if (config.scroller.active == true) {
        newHTML += '<div class="' + ONOPAGER + '_scroller"><div class="' +
          ONOPAGER + '_scrollerHandle"></div></div>';
      }
      root.append(
        '<div class="' + ONOPAGER + '_controlsContainer">' +
        ' <div class="' + ONOPAGER + '_controls">' + newHTML + '</div>' +
        '</div>'
      );

      pageNext = root.find(
        'div.' + ONOPAGER + '_controls > a.' + ONOPAGER + '_next'
      );
      pagePrevious = root.find(
        'div.' + ONOPAGER + '_controls > a.' + ONOPAGER + '_previous'
      );
      pageByNumber = root.find(
        'div.' + ONOPAGER + '_controls > div.' + ONOPAGER + '_pageByNumber'
      );
      pageStatus = root.find(
        'div.' + ONOPAGER + '_controls > div.' + ONOPAGER + '_status span'
      );
      pageScroller = root.find(
        'div.' + ONOPAGER + '_controls > div.' + ONOPAGER + '_scroller'
      );
      autoPageContainer = root.find(
        'div.' + ONOPAGER + '_controls > div.' + ONOPAGER + '_autoPageContainer'
      );
      if (config.listContainer.width) {
        root.find('.' + ONOPAGER + '_controls').css(
          'width',
          config.listContainer.width
        );
        pageByNumber.css('width', config.listContainer.width);
        pageStatus.css('width', config.listContainer.width);
      }
    }

    // Initialize the animation object.
    function setAnimation() {
      animation = onoPager.animation.createAnimation(
        config.animationType,
        {
          root: root,
          list: list,
          listContainer: listContainer,
          listContainerHeight: config.listContainer.height,
          adjustHeightToListItem: config.listContainer.adjustHeightToListItem,
          listItems: listItems,
          animationSpeed: config.animationSpeed,
          orientation: config.orientation,
          pagePerItem: config.pagePerItem,
          pageNext: pageNext,
          pagePrevious: pagePrevious,
          activeIndex: config.activeIndex,
          animationEasing: config.animationEasing,
          autoPage: config.autoPage
        },
        animationConfig
      );
      animation._init();
    }

    // Creates pager object (onoPager.pager)
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
          config.doesLoop,
          {
            next: pageNext,
            previous: pagePrevious,
            gotoLinks: pageByNumber,
            status: pageStatus
          },
          config.status,
          config.pageByNumber.hideThreshold
        );
      } else {
        pageNext.hide();
        pagePrevious.hide();
        pageByNumber.hide();
        pageScroller.hide();
        autoPageContainer.hide();
      }
      animation.extendConfig({pager: pager});
      animation._onPagerCreated();
      if (config.autoPage.active == true && pageTotal > 1) {
        pager.initAutopager(config.autoPage,
                            config.animationSpeed,
                            animation,
                            config.orientation,
                            listContainer,
                            list,
                            autoPageContainer,
                            config.lockDuringTransition);
      }
    }

    // Creates a list of quicklinks to navigate to a specific list item
    function setPageByNumber() {
      var pageTotal = animation.getPagesLength();
      var html = '';
      var label;
      var href;
      var hrefVoid = 'javascript:void(0)';

      for (var i = 0; i < pageTotal; i++) {
        // Set label text
        if (config.pageByNumber.labels &&
            config.pageByNumber.labels.length > i) {
          label = config.pageByNumber.labels[i];
        } else {
          label = i + 1;
        }

        // Set label link
        if (config.pageByNumber.links &&
            config.pageByNumber.links.length > i &&
            config.pageByNumber.links[i] != '') {
          href = config.pageByNumber.links[i];
        } else {
          href = hrefVoid;
        }

        html += '<a href="' + href + '"><span>' + label + '</span></a>';
      }

      pageByNumber.html(html);

      setPageEvent();

      function setPageEvent() {
        var eventTypes = '';
        // TODO: change 'enableClick' into something like: interactive
        if (config.pageByNumber.enableClick == true) {
          pageByNumber.find('a').each(function(index) {
            $(this).click(function(event) {
              var isActive = $(this).hasClass('onoPager_active');
              if (isActive == false && $(this).attr('href') == hrefVoid) {
                page(index);
              }
            });
          });
        }
        if (config.pageByNumber.enableHover == true) {
          pageByNumber.find('a').each(function(index) {
            $(this).mouseenter(function(event) {
              if ($(this).hasClass('onoPager_active') == false) {
                page(index);
              }
            });
          });
        }

        if (config.pageByNumber.enableClick == false &&
            config.pageByNumber.enableHover == false) {
          pageByNumber.find('a').addClass('onoPager_readonly');
        }
      }
    }

    // Attach events to the navigation controls. Without it, they won't respond.
    function setControlEvents() {
      // Page with scroller
      if (config.scroller.active == true) {

        var scroller = new onoPager.scroller(pageScroller,
                                             listContainer,
                                             list,
                                             config.orientation);
        scroller.init(animation, pageNext, pagePrevious);
        animation.extendConfig({scroller: scroller});
      }

      // Page by clicking on paging button
      pageNext.click(function() {
        page((pager.getIndex() + 1), 1);
      });
      pagePrevious.click(function() {
        page((pager.getIndex() - 1), -1);
      });
      if (config.listItems.triggersPagingOnClick == true) {
        listContainer.find(' > li, .onoPager_listItem').click(function() {
          var currentIndex = pager.getIndex();
          var newIndex = parseInt(jQuery(this)
                                  .attr('data-onopager-list-index'));
          var direction = 1;
          if (jQuery(this).attr('data-onopager-list-direction')) {
            direction = jQuery(this).attr('data-onopager-list-direction');
          } else if (newIndex < currentIndex) {
            direction = -1;
          }
          page(newIndex, direction);
        });
      }

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
      if (config.pageByArrowKey.active == true) {
        $(document).keydown(function(event) {
          var key = event.which;
          var UP = 38;
          var DOWN = 40;
          var LEFT = 37;
          var RIGHT = 39;
          // Page back
          if ((config.orientation == VERTICAL && key == UP) ||
            (config.orientation == HORIZONTAL && key == LEFT)) {
            if (preventPage() == false) {
              page((pager.getIndex() - 1), -1);
            }
            if (preventDefaultKeyEvent() == true) {
              event.preventDefault();
            }
          }
          // Page forward
          if ((config.orientation == VERTICAL && key == DOWN) ||
            (config.orientation == HORIZONTAL && key == RIGHT)) {
            if (preventPage() == false) {
              page((pager.getIndex() + 1), 1);
            }
            if (preventDefaultKeyEvent() == true) {
              event.preventDefault();
            }
          }
        });
      }

      function preventDefaultKeyEvent() {
        if (config.pageByArrowKey.preventDefault == true) {
          return true;
        }
        return false;
      }

      // No paging when the cursor is in a form field,
      function preventPage() {
        if (jQuery('textarea:focus, select:focus, input:focus').size() > 0) {
          return true;
        }
        return false;
      }

      // Page with swiping
      if (config.swipeTriggersPage == true) {
        if (config.orientation == HORIZONTAL) {
          listContainer.onoPagerSwipe(
            {
              dragRight: function() {
                page((pager.getIndex() - 1), -1);
              },
              dragLeft: function() {
                page((pager.getIndex() + 1), 1);
              },
              platform: config.swipePlatforms,
              pageDirection: config.orientation
            }
          );
        } else if (config.orientation == VERTICAL) {
          listContainer.onoPagerSwipe(
            {
              dragDown: function() {
                page((pager.getIndex() - 1), -1);
              },
              dragUp: function() {
                page((pager.getIndex() + 1), 1);
              },
              platform: config.swipePlatforms,
              pageDirection: config.orientation
            }
          );
        }
      }
    }

    // Keeps track of the index of the active list item and passes the page
    // call to the pager method of the animation instance.
    function page(arg_newIndex, arg_direction) {
      var canPage = onoPager.tools.canPage(root,
                                           config.lockDuringTransition,
                                           list,
                                           listItems);
      if (canPage) {
        if (config.autoPage.active == true) {
          pager.resetAutopager();
        }
        var oldIndex = pager.getIndex();
        var newIndex = pager.setIndex(arg_newIndex);
        animation._page(oldIndex, newIndex, arg_direction);
      }
    }

    // Detect browser so you can write CSS fallbacks for MSIE. Yeah, I know
    // browser detection feels dirty, but I know you'll thank me in the end :)
    function addBrowserClass() {
      var uaClass = '';
      if (navigator.appName == 'Microsoft Internet Explorer') {
        uaClass = 'msie' + getInternetExplorerVersion();
      }
      root.addClass(uaClass);

      function getInternetExplorerVersion() {
        var rv = -1;
        if (navigator.appName == 'Microsoft Internet Explorer') {
          if (document.documentMode) {
            rv = document.documentMode;
          } else {
            var ua = navigator.userAgent;
            var re = new RegExp('MSIE ([0-9]{1,}[\.0-9]{0,})');
            if (re.exec(ua) != null) {
              rv = parseFloat(RegExp.$1);
            }
          }
        }
        return rv;
      }
    }

    // Handles hovering over pager controls. Some animation objects like the
    // scroller depend on it.
    function pagerHover(moveIndex) {
      animation._pagerHover(moveIndex);
    }



    return this.each(function() {
      // create list wrappers and references
      list = $(this);
      listItems = list.find(' > li, .' + ONOPAGER + '_listItem');

      if (listItems.size() > 0) {
        list.removeClass(ONOPAGER + '_noJs');
        list.addClass(ONOPAGER + '_list');
        list.wrap('<div class="' + ONOPAGER + '_listContainer"></div>');
        listContainer = list.parent();
        listContainer.wrap('<div class="' + ONOPAGER + ' ' +
                           config.cssClass + '"/>');
        root = listContainer.parent();
        root.addClass(config.animationType);
        listItems.addClass(ONOPAGER + '_listItem');
        listItems.each(function(index) {
          jQuery(this).attr('data-onopager-list-index', index);
        });

        // Set up ono pager
        setStyles();
        createControls();
        setAnimation();
        setPageByNumber();
        setPager();
        setControlEvents();
        addBrowserClass();
      }
    });
  }
})(jQuery);






/**
 * @namespace Root namespace for the Ono Pager
 */
var onoPager = {};
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
      platform: 'touch',
      pageDirection: ''
    };
    config = $.extend(true, config, arg_config);

    return this.each(function() {
      var data = {
        x: 0,
        y: 0,
        t: null
      };

      if (config.platform == 'touch') {
        // Check if browser supports touch events
        var el = document.createElement('div');
        el.setAttribute('ontouchstart', '');
        el.setAttribute('ontouchmove', '');
        el.setAttribute('ontouchend', '');
        if (typeof (el.ontouchstart) != 'function' ||
            typeof (el.ontouchmove) != 'function' ||
            typeof (el.ontouchend) != 'function') {
          config.platform = '';
        }
      }

      if (config.platform == 'touch' || config.platform == 'all') {
        // Handle swipes on mobile browsers
        var lastPageX, lastPageY, offsetLeft, offsetTop;

        this.addEventListener('touchstart', function(e) {
          offsetLeft = ($(window).width() - $(this).outerWidth(true)) / 2;
          offsetTop = ($(window).height() - $(this).outerHeight(true)) / 2;
          data.x = e.targetTouches[0].pageX - offsetLeft;
          data.y = e.targetTouches[0].pageY - offsetTop;
        }, false);

        this.addEventListener('touchmove', function(e) {
          lastPageX = e.targetTouches[0].pageX - offsetLeft;
          lastPageY = e.targetTouches[0].pageY - offsetTop;

          var diffX = lastPageX - data.x;
          var diffY = lastPageY - data.y;
          if (diffX < 0) {
            diffX = -diffX;
          }
          if (diffY < 0) {
            diffY = -diffY;
          }
          if (config.pageDirection == 'horizontal' && diffX > diffY ||
              config.pageDirection == 'vertical' && diffY > diffX) {
            // prevents either horizontal or vertical scrolling through swiping
            // The orientation it cancels depends on the orientation in
            // the config.
            e.preventDefault();
            jQuery('preventDefault');
          } else {
            jQuery('default');
          }
        }, false);

        this.addEventListener('touchend', function(e) {
          e.preventDefault();
          var diffX = lastPageX - data.x;
          var diffY = lastPageY - data.y;

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
        }, false);
      }
      if (config.platform == 'all') {
        // Handles swipes on desktop
        $(this).mousedown(function(e) {
          var offsetLeft = ($(window).width() - $(this).outerWidth(true)) / 2;
          var offsetTop = ($(window).height() - $(this).outerHeight(true)) / 2;
          data.x = e.pageX - offsetLeft;
          data.y = e.pageY - offsetTop;

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
 * @fileOverview UI for scrolling in a pager.
 */






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
    var listSize = tools.getOuterSize(orientation, list, false);
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
 * @param {Object} arg_handle The handle of the scroller.
 * @param {String} arg_orientation The orientation of the paer, which is either
 *    'horizontal' or 'vertical'.
 * @param {Number} arg_totalScroll The amount of pixels the handle may move
 *    (which is the size of the scroller minus the size of the handle).
 * @param {Object} arg_animation The animation object.
 * @param {Object} arg_pageNext The 'next' button, which has to be disabled when
 *    you reach the end of the scroller.
 * @param {Object} arg_pagePrevious The 'previous' button, which has to be
 *    disabled when you reach the begin of the scroller.
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
      jQuery(handle[0]).closest('div.onoPager_scroller')
                       .addClass('active');
      jQuery(handle[0]).closest('div.onoPager_controls')
                       .addClass('active');

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
      pagePrevious.addClass('onoPager_disabled');
    } else if (offset > totalScroll) {
      offset = totalScroll;
      pageNext.addClass('onoPager_disabled');
    } else {
      pageNext.removeClass('onoPager_disabled');
      pagePrevious.removeClass('onoPager_disabled');
    }

    return offset;
  }

  function onMouseUp(e) {
    handle[0].ondragstart = null;
    document.onselectstart = null;
    jQuery(document).unbind('mousemove.scroller', onMouseMove);
    jQuery(document).unbind('mouseup.scroller', onMouseUp);
    jQuery(handle[0]).closest('div.onoPager_scroller')
                     .removeClass('active');
    jQuery(handle[0]).closest('div.onoPager_controls')
                     .removeClass('active');

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
 * @fileOverview Holds pager object. The pager keeps track of the index of the
 *               active list item and controls the autopager and autopager
 *               animations.
 */






/**
 * @namespace Paging logic. The pager keeps track of the index of the active
              list item and controls the autopager and autopager animations.
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
    var DISABLED = 'onoPager_disabled';
    var ENABLED = 'onoPager_enabled';
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
        controls.previous.addClass(DISABLED).removeClass(ENABLED);
      } else {
        controls.previous.removeClass(DISABLED).addClass(ENABLED);
      }
    }
    if (controls.next && doesLoop == false) {
      if (index == (length - 1)) {
        controls.next.addClass(DISABLED).removeClass(ENABLED);
      } else {
        controls.next.removeClass(DISABLED).addClass(ENABLED);
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
    // If the root element of the onoPager is removed in the DOM, the interval
    // has to be removed.
    if (listContainer.closest('div.onoPager').size() == 0) {
      clearInterval(autoPageInterval);
    }

    var canPage = onoPager.tools.canPage(
      listContainer.closest('div.onoPager'),
      lockDuringTransition,
      list,
      list.find('> *.onoPager_listItem')
    );
    var canAutoPage = onoPager.tools.canAutoPage(
      listContainer.closest('div.onoPager')
    );

    if (canPage == true && canAutoPage == true) {
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
      listSize += tools.getOuterSize(orientation, jQuery(this), false);
    });
    var overflow = tools.getOuterSize(orientation,
                                      listContainer,
                                      false) - listSize;
    if (overflow < 0) {
      startAutopager();
    }

    if (autoPageConfig.pauseOnHover == true) {
      arg_listContainer.closest('.onoPager').mouseenter(function() {
        jQuery(this).addClass('onoPager_autoPageDisabled');
      });
      arg_listContainer.closest('.onoPager').mouseleave(function() {
        jQuery(this).removeClass('onoPager_autoPageDisabled');
      });
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
 * @fileOverview Animation objects factory. These animations are used to
 *    indicate the time between 2 transitions
 */






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

      var animation;

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
 * timeline.
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
  var bar = jQuery([]);
  var root = timelineInstance._config.root;
  var listContainer = timelineInstance._config.listContainer;
  var startTimeout;

  /**
   * @see onoPager.autopageAnimation._standard#init
   * @memberOf onoPager.autopageAnimation.timeline
   * @this
   */
  timelineInstance.init = function() {
    // Setup pager markup and reference.
    root.html('<div class="onoPager_autoPageBar"></div>');
    bar = root.find('div.onoPager_autoPageBar');

    // Setup styling
    root.css(
      {
        width: listContainer.outerWidth(),
        position: 'absolute',
        top: listContainer.position().top +
               listContainer.outerHeight() + 'px'
      }
    );
    bar.css('width', 0);

    // Run animation
    bar.animate(
      {
        width: root.outerWidth() + 'px'
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
    var intervalTime = this._config.autoPageInterval -
                       this._config.animationSpeed; // interval time minus
                                                    // transition time
    var animationSpeed = this._config.animationSpeed;

    bar.stop(true, true); // End all current animations
    clearTimeout(startTimeout); // Remove any pending animations
    bar.css('width', 0); // Reset the timeline bar

    // Schedule start for timeline animation
    startTimeout = setTimeout(
      function() {
        bar.animate(
          {
            width: root.outerWidth() + 'px'
          },
          {
            duration: intervalTime,
            easing: 'linear'
          }
        );
      },
      animationSpeed
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
    intervalPrecision: 4,
    type: 'pie'
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
  var intervalTime;

  function drawClock() {
      degrees += extraConfig.intervalPrecision;

      var centerX = Math.floor((extraConfig.widthHeight / 2) +
                               extraConfig.shadowOffsetX);
      var centerY = Math.floor((extraConfig.widthHeight / 2) +
                               extraConfig.shadowOffsetY);
      var radius = Math.floor(extraConfig.widthHeight / 2);

      context.clearRect(0, 0, canvasWidth + 10, canvasHeight + 10);
      if (extraConfig.type == 'pie') {
        context.beginPath();
      }
      context.moveTo(centerX, centerY);
      if (extraConfig.type == 'circle') {
        context.beginPath();
      }
      context.arc(centerX,
                  centerY,
                  radius,
                  (Math.PI / 180) * -90,
                  (Math.PI / 180) * degrees,
                  false);
      if (extraConfig.type == 'pie') {
        context.lineTo(centerX, centerY);
      }

      context.shadowColor = extraConfig.shadowBackgroundColor;
      context.shadowBlur = extraConfig.shadowBlur;
      context.shadowOffsetX = extraConfig.shadowOffsetX;
      context.shadowOffsetY = extraConfig.shadowOffsetY;

      switch (extraConfig.type) {
        case 'circle':
          context.strokeStyle = extraConfig.color;
          context.lineWidth = 2;
          context.stroke();
          context.closePath();
        break;
        default:
          context.fillStyle = extraConfig.color;
          context.fill();
      }

  };

  /**
   * @see onoPager.autopageAnimation._standard#init
   * @memberOf onoPager.autopageAnimation.timeline
   * @this
   */
  clockInstance.init = function() {
    root.html('<canvas width="' + canvasWidth + '" height="' +
              canvasHeight + '"></canvas>');
    canvas = root.find('canvas')[0];
    context = canvas.getContext('2d');
    this.start(this._config.autoPageInterval);
  }

  /**
   * @see onoPager.autopageAnimation._standard#start
   * @memberOf onoPager.autopageAnimation.timeline
   * @this
   */
  clockInstance.start = function(autoPageInterval) {
    var intervalTime;
    var animationSpeed;
    if (autoPageInterval) {
      intervalTime = autoPageInterval;
      animationSpeed = 0;
    } else {
      intervalTime = this._config.autoPageInterval -
                         this._config.animationSpeed; // interval time minus
                                                      // transition time
      animationSpeed = this._config.animationSpeed;
    }
    clearInterval(drawClockInterval);
    degrees = -80;
    context.clearRect(0, 0, canvasWidth, canvasHeight);
    drawClockTimeout = setTimeout(
      function() {
        drawClockInterval = setInterval(
          drawClock,
          Math.floor(intervalTime / (360 / extraConfig.intervalPrecision))
        );
      },
      animationSpeed);
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
  return onoPager.tools.supportsCanvas();
};
/**
 * @fileOverview Animation objects factory. These animations are used to create
 *               the transitions between one slide and the other.
 */






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
          listContainerHeight: config.listContainerHeight,
          adjustHeightToListItem: config.adjustHeightToListItem,
          listItems: config.listItems,
          animationSpeed: config.animationSpeed,
          orientation: config.orientation,
          pagePerItem: config.pagePerItem,
          pageNext: config.pageNext,
          pagePrevious: config.pagePrevious,
          activeIndex: config.activeIndex,
          animationEasing: config.animationEasing,
          autoPage: config.autoPage
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
 * @param {Object} newConfig.list jQuery object. References to the UL, OL
 *    or any element that is the parent of list items.
 * @param {Object} newConfig.listContainer jQuery object. References to
 *    the element that is the container for the list from which the pager is
 *    built.
 * @param {String} newConfig.listContainerHeight If you can check if the height
 *    of the list container is specifically set.
 * @param {Boolean} newConfig.adjustHeightToListItem.active. If true, the
 *    list container will adjust itself to the height of the active list item.
 * @param {Boolean} newConfig.adjustHeightToListItem.animate. If
 *    true, the container will animatie to its new height. Default value is
 *    true.
 * @param {Object} newConfig.listItems jQuery object. Collection of all list
 *    items. If the listContainer is an unordered list (UL), the lsitItems will
 *    be the LI-elements.
 * @param {Number} newConfig.animationSpeed Determines the speed at
 *    which the animations take place.
 * @param {String} newConfig.orientation Determines on what axis the
 *    animation moves. Possible values are 'horizontal' and 'vertical' though
 *    it's possible to use other values as long as the animation object
 *    supports that value. Default value is 'horizontal'.
 * @param {Boolean} newConfig.pagePerItem If true, each page will be as long
 *    as one list item. If false, each page will be as long as the list
 *    container, which may span multiple list items.
 * @param {Object} newConfig.pageNext jQuery object. References to the page link
 *    'next'.
 * @param {Object} newConfig.pagePrevious jQuery object. References to the page
 *     link 'previous'.
 * @param {Number} newConfig.activeIndex Sets initial visible page. By
 *    default the pager starts at index 0.
 * @param {Object} newConfig.pager Reference to the pager instance.
 * @param {Object} newConfig.scroller Reference to the scroller instance.
 *    If it exists.
 * @param {Boolean} newConfig.autoPage.active Activates auto pager.
 * @param {Boolean} newConfig.autoPage.interval The interval between
 *    autopaging. Time value is set in milliseconds.
 * @param {Object|Null} extraConfig Optional extra configuration object.
 */
onoPager.animation._standard = function(newConfig, extraConfig) {
  this._config = {
    list: null,
    listContainer: null,
    listContainerHeight: '',
    adjustHeightToListItem: {},
    listItems: null,
    animationSpeed: 1000,
    orientation: null,
    pagePerItem: true,
    pageNext: null,
    pagePrevious: null,
    activeIndex: 0,
    pager: {},
    scroller: {},
    autoPage: {},
    extraConfig: {}
  };
  var containerHeightSetCount = 0;

  jQuery.extend(true, this._config, newConfig);
  if (typeof(extraConfig) == 'object') {
    jQuery.extend(true, this._config.extraConfig, extraConfig);
  }

  function setContainerHeight(_config, newIndex, isInit, parentFunction) {
    if (_config.adjustHeightToListItem.active == false) {
      if (isInit && _config.listContainer.height() == 0) {
        parentFunction._setListContainerHeight(_config.listContainer,
                                               _config.listItems);
      }
      return false;
    }

    var itemHeight = 0;
    if (typeof(newIndex) == 'number') {
      itemHeight = jQuery(_config.listItems[newIndex]).outerHeight();
    } else {
      itemHeight = _config.listItems.filter('.active').outerHeight();
    }

    if (containerHeightSetCount == 0) {
      // Set height during init
      if (_config.adjustHeightToListItem.active == true) {
        if (_config.listContainerHeight == '') {
          _config.listContainer.css(
            {
              height: itemHeight
            }
          );
        } else {
          _config.listContainer.css(
            {
              height: _config.listContainerHeight
            }
          );
        }
      }
    } else if (_config.adjustHeightToListItem.active == true) {
      // Set height after paging
      if (_config.adjustHeightToListItem.animate == true) {
        _config.listContainer.stop(true, true);
        _config.listContainer.animate(
          {
            height: itemHeight
          },
          {
            duration: _config.animationSpeed,
            easing: _config.animationEasing
          }
        );
      } else {
        _config.listContainer.css(
          {
            height: itemHeight
          }
        );
      }
    }
    containerHeightSetCount++;
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
   *    value.
   * @this
   */
  this._checkMaxScroll = function(arg_scroll) {
    var tools = onoPager.tools;
    var orientation = this._config.orientation;
    var listSize = tools.getOuterSize(orientation, this._config.list, false);
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
   *    return value is calculated with the private function _getPagesLength().
   * @this
   */
  this.getPagesLength = function() {
    var listContainer = this._config.listContainer;
    var listItems = this._config.listItems;
    var tools = onoPager.tools;
    var orientation = this._config.orientation;

    if (this._config.pagePerItem == true) {
      return this._config.listItems.size();
    } else {
      var listItemsSize = 0;
      listItems.each(function() {
        listItemsSize += tools.getInnerSize(orientation, jQuery(this));
      });
      return Math.ceil(listItemsSize /
                       tools.getInnerSize(orientation, listContainer));
    }
  }

  /**
   * Set list container height to the list item with the most height.
   *
   * @param {Object} listContainer The list container.
   * @param {Object} listItems All items in the list (typically &lt;li&gt;).
   * @this
   */
  this._setListContainerHeight = function(listContainer, listItems) {
    if (listItems.size() > 1 && this._config.listContainerHeight == '') {
      var maxHeight = 0;
      listItems.each(function() {
        if (maxHeight < jQuery(this).outerHeight()) {
          maxHeight = jQuery(this).outerHeight();
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
    if (this._config.pagePerItem == true) {
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
  }

  /**
   * Extend config object
   *
   * @param {Object} arg_newconfig The new config object that has to extend the
   *    existing config object.
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
    var listSize = tools.getOuterSize(orientation, list, false);
    var listContainerSize = tools.getOuterSize(orientation,
                                               listContainer,
                                               false);
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

  // _init is a wrapper method for animationinstance.init()
  this._init = function() {
    this.init();
    setContainerHeight(this._config, this._config.activeIndex, true, this);
  }

  /**
   * Makes the transition from one slide to the next. This method is not
   * implemented in the base animation object, but is part of the interface.
   * Failing to implement this method will result in an error.
   *
   * @param {Number} oldIndex Index of the current active item.
   * @param {Number} newIndex Index of the item that will be active.
   * @param {Number} direction The direction the pager will move to. Valid
   *    values are 1, 0 and -1.
   */
  this.page = function(oldIndex, newIndex, direction) {}
  delete this.page;

  // _page is a wrapper method for animationinstance.page()
  this._page = function(oldIndex, newIndex, direction) {
    setContainerHeight(this._config, newIndex);
    this.page(oldIndex, newIndex, direction);
  }

  /**
   * Event that is called when the pager is created. This method is not
   * implemented in the base animation object, but is part of the interface.
   * Failing to implement this method will result in an error.
   */
  this.onPagerCreated = function() {}
  delete this.onPagerCreated;

  // _onPagerCreated is a wrapper method for animationinstance.onPagerCreated()
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
   *    animation.
   */
  this.pagerHover = function(move) {}
  delete this.pagerHover;

  // _pagerHover is a wrapper method for animationinstance.pagerHover()
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
  slidesInstance.page = function(oldIndex, newIndex, direction) {
    var oldItemLeft = 0;
    var newItemLeft = 0;
    var pageSize = tools.getOuterSize(
      slidesInstance._config.orientation,
      slidesInstance._config.listItems,
      false
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
      {
        duration: this._config.animationSpeed,
        easing: this._config.animationEasing
      }
    );

    var newAni = {};
    newAni[topLeft] = '0';
    jQuery(this._config.listItems[newIndex])
      .delay(this._config.animationSpeed / this._config.extraConfig.delay)
      .animate(
        newAni,
        {
          duration: this._config.animationSpeed,
          easing: this._config.animationEasing
        }
      );
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
 * @namespace Animation object. Animation object only in name. It wil just
 *    switch page elements without any transition.
 *
 * @param {Object} newConfig Standard configuration object.
 * @param {Object|Null} extraConfig Optional extra configuration object.
 * @return {Object} instance of an animation object.
 */
onoPager.animation.snap = function(newConfig, extraConfig) {
  /**
   * New animation object.
   * @memberOf onoPager.animation.slides
   */
  var snapInstance = new onoPager.animation._standard(newConfig, extraConfig);

  /**
   * @see onoPager.animation._standard#init
   * @memberOf onoPager.animation.snap
   * @this
   */
  snapInstance.init = function() {
    this._config.listItems.hide();
    jQuery(this._config.listItems[0]).show();
  }

  /**
   * @see onoPager.animation._standard#page
   * @memberOf onoPager.animation.snap
   * @this
   */
  snapInstance.page = function(oldIndex, newIndex, direction) {
    jQuery(this._config.listItems[oldIndex]).hide();
    jQuery(this._config.listItems[newIndex]).show();
  }

  /**
   * @see onoPager.animation._standard#pagerHover
   * @memberOf onoPager.animation.snap
   * @this
   */
  snapInstance.pagerHover = function(move) {
    // Not implemented
  }

  return snapInstance;
};






/**
 * @namespace Animation object. The old item fades away, while the new one fades
 * in at the same time.
 *
 * @param {Object} newConfig Standard configuration object.
 * @param {Object|Null} extraConfig Optional extra configuration object.
 * @return {Object} instance of an animation object.
 */
onoPager.animation.fade = function(newConfig, extraConfig) {
  /**
   * New animation object.
   * @memberOf onoPager.animation.fade
   */
  var fadeInstance = new onoPager.animation._standard(newConfig, extraConfig);
  var tools = onoPager.tools;

  /**
   * @see onoPager.animation._standard#init
   * @memberOf onoPager.animation.fade
   * @this
   */
  fadeInstance.init = function() {
    this._config.listItems.hide();
    this._config.listItems.css(
      {
        position: 'absolute',
        top: 0,
        left: 0
      }
    );
    jQuery(this._config.listItems[0]).show();
  }

  /**
   * @see onoPager.animation._standard#page
   * @memberOf onoPager.animation.fade
   * @this
   */
  fadeInstance.page = function(oldIndex, newIndex, direction) {
    var oldItem = jQuery(this._config.listItems[oldIndex]);
    var newItem = jQuery(this._config.listItems[newIndex]);

    // End all current animations.
    oldItem.stop(true, true);
    newItem.stop(true, true);

    // Hide all items except the two that will animate in the page transition.
    this._config.listItems.each(function(index) {
      if (index != oldIndex && index != newIndex) {
        var item = jQuery(this);
        item.hide();
        item.css('z-index', 0);
      }
    });

    // Set order stack for animation.
    oldItem.css(
      {
        zIndex: 1,
        display: 'block',
        opacity: 1
      }
    );
    newItem.css(
      {
        zIndex: 2,
        display: 'block',
        opacity: 0
      }
    );

    oldItem.animate(
      {
        opacity: 0
      },
      {
        duration: this._config.animationSpeed,
        easing: this._config.animationEasing,
        complete: function() {
          jQuery(this).hide();
        }
      }
    );
    newItem.animate(
      {
        opacity: 1
      },
      {
        duration: this._config.animationSpeed,
        easing: this._config.animationEasing,
        complete: function() {
          jQuery(this).css('filter', '');
        }
      }
    );
  }

  /**
   * @see onoPager.animation._standard#pagerHover
   * @memberOf onoPager.animation.fade
   * @this
   */
  fadeInstance.pagerHover = function(move) {
    // Not implemented
  }

  return fadeInstance;
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

  /**
   * @see onoPager.animation._standard#init
   * @memberOf onoPager.animation.linear
   * @this
   */
  linearInstance.init = function() {
    // This animation only works with horizontal and vertical orientation.
    if (this._config.orientation != 'horizontal' &&
        this._config.orientation != 'vertical') {
      throw new Error('Orientation must be either horizontal ' +
        'or vertical. It\'s now ' + this._config.orientation);
    }

    var listBounds = 0;

    // Set class 'active' to the visible list item if the pager is set to page
    // per list item.
    linearInstance._setActiveClass(linearInstance._config.activeIndex, true);

    // Set list container width
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

    // Set list container height
    this._setListContainerHeight(
      this._config.listContainer,
      this._config.listItems
    );

    // set initial offset
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
  linearInstance.page = function(oldIndex, newIndex, direction) {
    var offset;

    // Remove active class from old list item before animating
    if (oldIndex != newIndex) {
      linearInstance._setActiveClass(oldIndex, false);
    }

    // Stop all current animations
    this._config.list.stop(true, false);

    // Determine new offset for the list
    if (this._config.pagePerItem == true) {
      offset = tools.getPosition(
        this._config.orientation,
        jQuery(this._config.listItems[newIndex])
      );
    } else {
      var size = tools.getOuterSize(
        linearInstance._config.orientation,
        this._config.listContainer,
        false
      );
      offset = size * newIndex;
    }

    // Adjust the list offset to make sure that the list container is filled
    // with list items at all times. This might not be the case when
    // pagePerItem in the pager config is not set to true
    if (this._config.adjustHeightToListItem.animate != true &&
        this._config.adjustHeightToListItem.active != true &&
        this._config.orientation == 'vertical') {
      offset = this._checkMaxScroll(offset);
    }

    // Set animate style properties
    var cssObj = {};
    var topLeft = tools.getTopLeft(this._config.orientation);
    cssObj[topLeft] = '-' + offset + 'px';

    // Run animation
    this._config.list.animate(
      cssObj,
      {
        duration: this._config.animationSpeed,
        easing: this._config.animationEasing,
        complete: function() {
          // Set active class on visible list item
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
 * Many private variables are defined in the onPagerCreated method.
 *
 * @param {Object} newConfig Standard configuration object.
 * @param {Object|Null} extraConfig Optional extra configuration object.
 * @return {Object} instance of an animation object.
 */
onoPager.animation.linearContinuous = function(newConfig, extraConfig) {
  /**
   * New animation object.
   * @memberOf onoPager.animation.linearContinuous
   * @this
   */
  // Create animation object instance.
  var linearContinuousInstance = new onoPager.animation._standard(newConfig,
                                                                 extraConfig);
  // Shortcut to tools.
  var tools = onoPager.tools;

  // Width or height of all unique list items, so bar the items that are
  // prepended and appended.
  var listItemSize = tools.getOuterSize(
    linearContinuousInstance._config.orientation,
    linearContinuousInstance._config.listItems,
    false
  );

  // If list items have a div with the class
  // 'onoPager_linearContinuous_background', this value will be set to true.
  var hasCenterBackground = false;

  // Contains the list items, after duplication took place in onPagerCreated.
  var newListItems;

  var BACKGROUND_SELECTOR = '*.onoPager_linearContinuous_background';

  // The width or height of extra items that are prepended to the list.
  var prependFill = 0;

  // The width or height of the original set of items before duplication.
  var listItemsSize = 0;

  // The width or height of the box that is a container for the list.
  var containerSize = tools.getOuterSize(
    linearContinuousInstance._config.orientation,
    linearContinuousInstance._config.listContainer,
    false
  );

  // The space in pixels between the left border of the container box and the
  // left border of its parent box.
  var idleSpace = 0;

  // The total amount of page action a user has to make to reach the end
  var listSize = linearContinuousInstance.getPagesLength();

  // Reference to the parent of the list container.
  var rootSize;



  // Appends and prepends items until the list always fills the screen.
  function fillIdleSpace(idleSpace) {
    var list = linearContinuousInstance._config.list;
    var listItems = linearContinuousInstance._config.listItems;

    fillBefore();
    fillAfter();

    function fillBefore() {
      // Add items to the begin of the list
      var prependItems = jQuery([]);
      var prependItemsArray = [];
      var prependSpace = 0;
      var itemSize = 0;

      for (var i = 1; i <= listItems.size(); i++) {
        if (prependSpace < (idleSpace * 2)) {
          prependItemsArray.push(jQuery(listItems.get(-i)).clone(true));
          itemSize = tools.getOuterSize(
            linearContinuousInstance._config.orientation,
            jQuery(listItems.get(-i)),
            false
          );
          prependFill += itemSize;
          if (i > 1) {
            prependSpace += itemSize;
          }
          prependSpace += tools.getOuterSize(
            linearContinuousInstance._config.orientation,
            jQuery(listItems.get(-i)),
            false
          );
        } else {
          break;
        }
      }
      for (var i = 0; i < prependItemsArray.length; i++) {
        list.prepend(
          jQuery(prependItemsArray[i]).clone(true)
        );
        list.find('li:first').attr('data-onopager-list-direction', -1);
      }
    }

    function fillAfter() {
      // Add items at the end of the list
      var appendItems = jQuery([]);
      var appendSpace = 0;

      for (var i = 0; i < listItems.size(); i++) {
        if (appendSpace < (idleSpace * 2)) {
          appendItems = appendItems.add(
            jQuery(listItems.get(i)).clone(true)
                                    .attr('data-onopager-list-direction', 1)
          );
        } else {
          break;
        }
      }
      list.append(appendItems);
    }
  }

  /**
   * @see onoPager.animation._standard#init
   * @memberOf onoPager.animation.linearContinuous
   * @this
   */
  linearContinuousInstance.init = function() {
    if (this._config.orientation != 'horizontal' &&
        this._config.orientation != 'vertical') {
      throw new Error('Orientation must be either horizontal ' +
        'or vertical. It\'s now ' + this._config.orientation);
    }

    if (this._config.list.find(BACKGROUND_SELECTOR).size() > 0) {
      hasCenterBackground = true;
    }

    if (linearContinuousInstance._config.pagePerItem == true &&
        hasCenterBackground == true) {
      this._config.listContainer.addClass('onoPager_backgroundAnimation');
    }
  }

  /**
   * @see onoPager.animation._standard#init
   * @memberOf onoPager.animation.linearContinuous
   * @this
   */
  linearContinuousInstance.page = function(oldIndex, newIndex, direction) {
    if (oldIndex != newIndex) {
      linearContinuousInstance._setActiveClass(oldIndex, false);
    }
    this._config.list.stop(true, false);

    var topLeft = tools.getTopLeft(this._config.orientation);
    var oldItem = resetPosition(oldIndex, newIndex);

    var offset;
    if (this._config.pagePerItem == true) {
      offset = tools.getPosition(
        this._config.orientation,
        jQuery(this._config.listItems[newIndex])
      );
    } else {
      var currentOffset = this._config.list.css(topLeft).replace('px', '');
      currentOffset = parseInt(currentOffset);
      var indexMove = 0;
      if (oldIndex == 0 && newIndex == (listSize - 1) && direction == -1) {
        indexMove = -1;
      } else if (oldIndex == (listSize - 1) &&
                 newIndex == 0 && direction == 1) {
        indexMove = 1;
      } else {
        indexMove = newIndex - oldIndex;
      }
      offset = currentOffset - (containerSize * indexMove);
      offset = -offset;
    }

    animateBackground(oldIndex, newIndex, oldItem);

    // Start paging animation
    var cssObj = {};
    cssObj[topLeft] = '-' + offset + 'px';
    this._config.list.animate(
      cssObj,
      {
        duration: this._config.animationSpeed,
        easing: this._config.animationEasing,
        complete: function() {
          linearContinuousInstance._setActiveClass(newIndex, true);
        }
      }
    );

    // Show the item's background if the item dead centered in the
    // list container.
    function animateBackground(oldIndex, newIndex, oldItem) {
      if (linearContinuousInstance._config.pagePerItem == false ||
          hasCenterBackground == false) {
        // Background animation only works if paging is done per list item.
        return;
      }

      // Set variables and styling
      var newItem = jQuery(
        linearContinuousInstance._config.listItems[newIndex]
      );
      var oldItem2 = jQuery(
        linearContinuousInstance._config.listItems[oldIndex]
      );
      var containerWidth = linearContinuousInstance.
                             _config.listContainer.innerWidth();
      if (oldItem.index() != oldItem2.index()) {
        oldItem2.find(BACKGROUND_SELECTOR).css(
          {width: 0}
        );
      }

      // Animate backgrounds
      linearContinuousInstance._config.list.each(function(index) {
        jQuery(this).find(BACKGROUND_SELECTOR).stop(true, true);
        if (index != newItem.index()) {
          jQuery(this).find(BACKGROUND_SELECTOR).css({width: 0});
        }
      });

      if (direction > 0) {
        oldItem.find(BACKGROUND_SELECTOR).css(
          {
            left: 'auto',
            right: 0,
            width: containerWidth + 'px',
            backgroundPosition: 'top right'
          }
        );
        oldItem.find(BACKGROUND_SELECTOR).animate(
          {width: 0},
          {
            duration: linearContinuousInstance._config.animationSpeed,
            easing: linearContinuousInstance._config.animationEasing
          }
        );
        newItem.find(BACKGROUND_SELECTOR).css(
          {
            left: 0,
            right: 'auto',
            width: 0,
            backgroundPosition: 'top left'
          }
        );
        newItem.find(BACKGROUND_SELECTOR).animate(
          {width: containerWidth + 'px'},
          {
            duration: linearContinuousInstance._config.animationSpeed,
            easing: linearContinuousInstance._config.animationEasing
          }
        );
      } else {
        oldItem.find(BACKGROUND_SELECTOR).css(
          {
            left: 0,
            right: 'auto',
            width: containerWidth + 'px',
            backgroundPosition: 'top left'
          }
        );
        oldItem.find(BACKGROUND_SELECTOR).animate(
          {width: 0},
          {
            duration: linearContinuousInstance._config.animationSpeed,
            easing: linearContinuousInstance._config.animationEasing
          }
        );
        newItem.find(BACKGROUND_SELECTOR).css(
          {
            left: 'auto',
            right: 0,
            width: 0,
            backgroundPosition: 'top right'
          }
        );
        newItem.find(BACKGROUND_SELECTOR).animate(
          {width: containerWidth + 'px'},
          {
            duration: linearContinuousInstance._config.animationSpeed,
            easing: linearContinuousInstance._config.animationEasing
          }
        );
      }
    }

    // To create the appearence of a list that repeats itself infinitely, the
    // list is repositioned just before it threatens to get out of bounds.
    function resetPosition(oldIndex, newIndex) {
      var pageOverflow = 0;
      var topLeft = tools.getTopLeft(
        linearContinuousInstance._config.orientation
      );
      var offset;
      var oldItem = jQuery(
        linearContinuousInstance._config.listItems[oldIndex]
      );

      if (oldIndex > newIndex && direction == 1) {
        // If user pages from last page to first page, position to the page
        // *before* the first page.
        var firstIndex = newListItems.index(
          linearContinuousInstance._config.listItems[newIndex]
        );

        if (linearContinuousInstance._config.pagePerItem == true) {
          oldItem = jQuery(newListItems[firstIndex -
                                        (newIndex + (listSize - oldIndex))]);
          offset = tools.getPosition(
            linearContinuousInstance._config.orientation,
            oldItem
          );
          offset = -Math.round(offset);
        } else {
          var maxOffset = prependFill + listItemsSize;
          var currentOffset = tools.getPosition(
            linearContinuousInstance._config.orientation,
            linearContinuousInstance._config.list
          );
          pageOverflow = currentOffset + maxOffset;
          offset = -(prependFill - containerSize +
                     (containerSize - pageOverflow));
          if (offset < -listItemsSize) {
            offset += listItemsSize;
          }
        }
      } else if (newIndex > oldIndex && direction == -1) {
        // If user pages from the first item to last item, position on the item
        // *after* the last item.
        var lastIndex = newListItems.index(
          linearContinuousInstance._config.listItems[newIndex]
        );

        if (linearContinuousInstance._config.pagePerItem == true) {
          oldItem = jQuery(newListItems[lastIndex +
                                        ((listSize - newIndex) + oldIndex)]);
          offset = tools.getPosition(
            linearContinuousInstance._config.orientation,
            oldItem
          );
          offset = -Math.round(offset);
        } else {
          var currentOffset = tools.getPosition(
            linearContinuousInstance._config.orientation,
            linearContinuousInstance._config.list
          );
          pageOverflow = currentOffset + prependFill;
          offset = -(prependFill + listItemsSize - containerSize +
                      (containerSize - pageOverflow));
          if (offset > -((rootSize * 2) - containerSize)) {
            offset -= listItemsSize;
          }
        }
      }

      if (offset) {
        linearContinuousInstance._config.list.css(topLeft, offset + 'px');
      }

      return oldItem;
    }
  }

  /**
   * @see onoPager.animation._standard#pagerHover
   * @memberOf onoPager.animation.linearContinuous
   * @this
   */
  linearContinuousInstance.pagerHover = function(move) {
    // Not implemented
  }

  linearContinuousInstance.onPagerCreated = function(move) {
    var root = this._config.listContainer.parent();
    rootSize = tools.getOuterSize(
      linearContinuousInstance._config.orientation,
      root,
      false
    );
    var listContainerSize = tools.getOuterSize(
      linearContinuousInstance._config.orientation,
      this._config.listContainer,
      false
    );
    if (this._config.pagePerItem == true) {
      idleSpace = (rootSize / 2) + listContainerSize;
    } else {
      idleSpace = rootSize + (listContainerSize * 2);
    }
    var listBounds = 0;

    // Creates extra items to fill the idle space in the list container.
    fillIdleSpace(idleSpace);

    // Set active item
    linearContinuousInstance._setActiveClass(
      linearContinuousInstance._config.activeIndex,
      true
    );

    // Set list width/height
    newListItems = this._config.list.find('> .onoPager_listItem');
    newListItems.each(function(index) {
      listBounds += tools.getOuterSize(
        linearContinuousInstance._config.orientation,
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

    // Position list
    var offset = tools.getPosition(
      this._config.orientation,
      jQuery(this._config.listItems[this._config.activeIndex])
    );
    if (this._config.orientation == 'horizontal') {
      this._config.list.css({ 'left': '-' + offset + 'px' });
    } else {
      this._config.list.css({ 'top': '-' + offset + 'px' });
    }
    if (this._config.pagePerItem == true) {
      jQuery(this._config.listItems[this._config.activeIndex])
        .find(BACKGROUND_SELECTOR).css(
        {
          left: 0,
          right: 'auto',
          width: '100%'
        }
      );
    }

    linearContinuousInstance._config.listItems.each(
      function() {
        listItemsSize += tools.getOuterSize(
          linearContinuousInstance._config.orientation,
          jQuery(this),
          false
        );
      }
    );
  }

  return linearContinuousInstance;
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
    var listSize = tools.getOuterSize(
      linearScrollerInstance._config.orientation,
      jQuery(list),
      false
    );
    var viewportSize = tools.getInnerSize(
      linearScrollerInstance._config.orientation,
      jQuery(list).parent()
    );
    var maxMarginBound = listSize - viewportSize;
    var newMargin = currentMargin - move;
    var DISABLED = 'onoPager_disabled';

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
  linearScrollerInstance.page = function(oldIndex, newIndex, direction) {
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
/**
 * @fileOverview Shared helper methods
 */






/**
 * @namespace Helper methods for the animation objects.
 */
onoPager.tools = (function() {
  var HORIZONTAL = 'horizontal';
  var VERTICAL = 'vertical';

  return {
    /**
     * Checks if browser supports canvas
     * @return {Boolean} If true, the browser supports canvas.
     */
    supportsCanvas: function() {
      var canvas = document.createElement('canvas');
      if (canvas.getContext) {
        return true;
      } else {
        return false;
      }
    },

    /**
     * Determines wether a page action is allowed
     * @return {Boolean} A page action can be done if return value is true.
     * @param {Object} root The root object of a pager (div.onoPager).
     * @param {Boolean} arg_lockDuringTransition Determines of a user can make a
     *    page before the current transition is finished.
     * @param {Object} list The list, most of the times that's a UL.
     * @param {Object} listItems The collection of the list items, most of the
     *    the times it is a collection of LI's.
     */
    canPage: function(root,
                      lockDuringTransition,
                      list,
                      listItems) {
      if (root.size() > 0 &&
          root.hasClass('onoPager_disabled') == false &&
          (lockDuringTransition == false ||
          lockDuringTransition == true &&
          list.is(':animated') == false &&
          listItems.is(':animated') == false)) {
        return true;
      } else {
        return false;
      }
    },

    /**
     * Determines wether the onoPager may do an auto page
     * @return {Boolean} An auto page can be done if return value is true.
     * @param {Object} root The root object of a pager (div.onoPager).
     */
    canAutoPage: function(root) {
      if (root.size() > 0 &&
          root.hasClass('onoPager_autoPageDisabled') == false) {
        return true;
      } else {
        return false;
      }
    },

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
    getOuterSize: function(orientation, selector, withMargin) {
      if (orientation == HORIZONTAL) {
        return jQuery(selector).outerWidth(withMargin);
      } else if (orientation == VERTICAL) {
        return jQuery(selector).outerHeight(withMargin);
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
        return jQuery(selector).innerWidth();
      } else if (orientation == VERTICAL) {
        return jQuery(selector).innerHeight();
      }
    },

    /**
     * Returns a canvas string, ready to insert into the DOM.
     * @param {Number} width Canvas width.
     * @param {Number} height Canvas height.
     * @return {String} Either width or height in pixels.
     */
    createCanvas: function(width, height) {
      return '<canvas width="' + width + '" height="' + height + '"></canvas>'
    }
  };
})();
