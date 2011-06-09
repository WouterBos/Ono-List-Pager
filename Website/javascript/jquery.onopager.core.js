/**
 * @fileOverview Ono pager (jQuery plugin)
 * @author Wouter Bos, Web developer at Estate Internet (www.estate.nl). Code
 *    for swiping based on the QuickGestures jQuery plugin of Anders Zakrisson.
 * @since 0.1 - 2011-3-28
 * @version 0.5 - 2011-6-9
 */

// TODO:
// - Manage the number of visible items in pageByNumber
// - Build support for scroll wheel
// - Highlight arrow key when pressing an arrow key on keyboard
// - onHandleDrag assumes margin-*. Must handle possible left/top as well
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
   * @param {Boolean} animationConfig.doesLoop If true, the pager scrolls back
   *    to the first item after the last item.
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
   * @param {String} animationConfig.autoPage.autoPageAnimationType The type
   *    of animation that will indicate the time the time between transitions.
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
   * @param {Boolean} animationConfig.scroller.active Activates a Javascript
   *    scrollbar. Default is true.
   * @param {Number} animationConfig.pixelMove The amount of pixels the pager
   *    scrolls after each frame.
   * @param {Boolean} animationConfig.pageByNumber.active Activates the bar with
   *    all pages, defined by number. Default is true.
   * @param {Boolean} animationConfig.pageByNumber.enableClick Disables paging
   *    behaviour onclick. The makes the 'Page by number'-box essentially a
   *    status box rather than a navigation control. Default is true.
   * @param {Boolean} animationConfig.pageByArrowKey.active Enables paging by
   *    using the keyboard arrow keys. Default is false.
   * @param {Boolean} animationConfig.pageByArrowKey.preventDefault Disables or
   *    activates the default behaviour of the arrow key. If set to true, the
   *    user won't be able to scroll the page or a textarea with the arrow keys.
   *    Default is false for that reason.
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
   *    objects can be created and used after the plugin is loaded. Default
   *    value is 'linear'.
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
   *    doesLoop: true,
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
   *    scroller: {
   *      active: false,
   *      pixelMove: 2
   *    },
   *    pageByNumber: {
   *      active: true,
   *      enableClick: true
   *    },
   *    pageByArrowKey: {
   *      active: false,
   *      preventDefault: false
   *    },
   *    swipeTriggersPage: false,
   *    swipePlatforms: 'touch',
   *    animationType: 'linear',
   *    animationEasing: 'linear',
   *    orientation: 'horizontal',
   *    animationSpeed: 1000
   * });
   */
  jQuery.fn.onoPager = function(arg_config, animationConfig) {
    var config = {
      pagePerItem: true,
      doesLoop: true,
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
        interval: 2000,
        autoPageAnimationType: ''
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
      scroller: {
        active: false,
        pixelMove: 2
      },
      pageByNumber: {
        active: true,
        enableClick: true,
        labels: []
      },
      pageByArrowKey: {
        active: false,
        preventDefault: false
      },
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
    var autoPageContainer; // Box that gives feedback about the autopage status




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
      if (config.pageByNumber.active == true) {
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
      if (config.autoPage.autoPageAnimationType) {
        newHTML += '<div class="' + ONOPAGER + '_autoPageContainer"></div>';
      }
      root.append(
        '<div class="' + ONOPAGER + '_controls">' + newHTML + '</div>'
      );

      pageNext = root.find('> * > a.' + ONOPAGER + '_next');
      pagePrevious = root.find('> * > a.' + ONOPAGER + '_previous');
      pageByNumber = root.find('> * > div.' + ONOPAGER + '_pageByNumber');
      pageStatus = root.find('> * > div.' + ONOPAGER + '_status');
      pageScroller = root.find('> * > div.' + ONOPAGER + '_scroller');
      autoPageContainer = root.find(
        '> * > div.' + ONOPAGER + '_autoPageContainer'
      );
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
          config.doesLoop,
          {
            next: pageNext,
            previous: pagePrevious,
            gotoLinks: pageByNumber,
            status: pageStatus
          },
          config.status
        );
      } else {
        pageNext.hide();
        pagePrevious.hide();
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
                            autoPageContainer);
      }
    }

    function setPageByNumber() {
      var pageTotal = animation.getPagesLength();
      var html = '';
      var label;

      for (var i = 0; i < pageTotal; i++) {
        if (config.pageByNumber.labels &&
            config.pageByNumber.labels.length > i) {
          label = config.pageByNumber.labels[i];
        } else {
          label = i + 1;
        }
        html += '<a' + EMPTY_HREF + '>' + label + '</a>';
      }

      pageByNumber.html(html);

      if (config.pageByNumber.enableClick == true) {
        pageByNumber.find('a').each(function(index) {
          $(this).click(function() {
            page(index);
          });
        });
      } else {
        pageByNumber.find('a').addClass('onoPager_readonly');
      }
    }

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
            page(pager.getIndex() - 1);
            if (config.pageByArrowKey.preventDefault == true) {
              event.preventDefault();
            }
          }
          // Page forward
          if ((config.orientation == VERTICAL && key == DOWN) ||
            (config.orientation == HORIZONTAL && key == RIGHT)) {
            page(pager.getIndex() + 1);
            if (config.pageByArrowKey.preventDefault == true) {
              event.preventDefault();
            }
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
})(jQuery);






/**
 * @namespace Root namespace for the Ono Pager
 */
var onoPager = {};
