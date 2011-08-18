/**
 * @fileOverview Ono pager (jQuery plugin)
 * @author Wouter Bos, Web developer at Estate Internet (www.estate.nl). Code
 *    for swiping based on the QuickGestures jQuery plugin of Anders Zakrisson.
 * @since 0.1 - 2011-3-28
 * @version 0.8 - 2011-08-10
 */

// TODO:
// - Click on list item to go to that item
// - Build support for scroll wheel
// - Highlight arrow key when pressing an arrow key on keyboard

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
   * @param {String} arg_config.cssClass Ads CSS class to the root of the pager.
   * @param {Boolean} arg_config.pagePerItem Page per item.
   * @param {Boolean} arg_config.lockDuringTransition Disable paging controls
   *    during a transition when true. Default is false.
   * @param {Boolean} arg_config.doesLoop If true, the pager scrolls back
   *    to the first item after the last item.
   * @param {String} arg_config.listContainer.width Width of list
   *    container, like '200px'.
   * @param {String} arg_config.listContainer.height Height of list
   *    container, like '200px'.
   * @param {String} arg_config.listContainer.adjustHeightToListItem.active If
   *    you also set pagePerItem to true, the height of the list container will
   *    adjust to the height of the visible list item. Default value is true.
   * @param {String} arg_config.listContainer.adjustHeightToListItem.animate If
   *    true, the container will animatie to its new height. Default value is
   *    true.
   * @param {String} arg_config.ListItems.width Width of list items, like
   *    '200px'.
   * @param {String} arg_config.ListItems.height Height of list items,
   *    like '200px'.
   * @param {Number} arg_config.activeIndex Sets initial visible page. By
   *    default the pager starts at index 0.
   * @param {Boolean} arg_config.autoPage.active Activates auto pager.
   * @param {Number} arg_config.autoPage.interval The interval between
   *    autopaging. Time value is set in milliseconds.
   * @param {String} arg_config.autoPage.autoPageAnimationType The type
   *    of animation that will indicate the time the time between transitions.
   * @param {Object} arg_config.autoPage.extraConfig A configuration object
   *    for the autopage indicator.
   * @param {String} arg_config.labels.next text for the 'next'-button.
   * @param {String} arg_config.labels.previous Text for the
   *    'previous'-button.
   * @param {Boolean} arg_config.status.active Activates the status box.
   * @param {String} arg_config.status.prependText Text that appears before
   *    the page index number.
   * @param {String} arg_config.status.seperationText Text that appears
   *    between the page index number and the total pages number.
   * @param {String} arg_config.status.appendText Text that appears after
   *    the total pages number.
   * @param {Boolean} arg_config.scroller.active Activates a Javascript
   *    scrollbar. Default is true.
   * @param {Number} arg_config.pixelMove The amount of pixels the pager
   *    scrolls after each frame.
   * @param {Boolean} arg_config.pageByNumber.active Activates the bar with
   *    all pages, defined by number. Default is true.
   * @param {Boolean} arg_config.pageByNumber.enableClick Disables paging
   *    behaviour onclick. The makes the 'Page by number'-box essentially a
   *    status box rather than a navigation control. Default is true.
   * @param {Array} arg_config.pageByNumber.labels Replaces the default
   *    content of the page-by-number links with the string values in the array.
   * @param {Number} arg_config.pageByNumber.hideThreshold Defines how many
   *    links may appear in the pageByNumber box. If you set the value to 2,
   *    you'll see 2 links on the left and 2 on the right of the active item. A
   *    negative value cancels this functionality. Default value is -1.
   * @param {Boolean} arg_config.pageByArrowKey.active Enables paging by
   *    using the keyboard arrow keys. Default is false.
   * @param {Boolean} arg_config.pageByArrowKey.preventDefault Disables or
   *    activates the default behaviour of the arrow key. If set to true, the
   *    user won't be able to scroll the page or a textarea with the arrow keys.
   *    Default is false for that reason.
   * @param {Boolean} arg_config.swipeTriggersPage Activates page
   *    navigation by swiping on the screen. Default is false.
   * @param {String} arg_config.swipePlatforms Determines on what platforms
   *    the user is able to page by swiping. 'touch' activates swiping only on
   *    touch devices. 'all' will activates swiping on touch devices and
   *    desktop. Swiping on the desktop is done with mouse gestures. Default
   *    value is 'touch'.
   * @param {String} arg_config.animationType Determines which animation
   *    object will be used. The following animation types are available by
   *    default: 'linear', 'linearScroller' and 'slides'. Custom animation
   *    objects can be created and used after the plugin is loaded. Default
   *    value is 'linear'.
   * @param {String} arg_config.animationEasing Determines the easing type
   *    to be used by the animation object. Default value is 'linear'.
   * @param {String} arg_config.orientation Determines on what axis the
   *    animation moves. Possible values are 'horizontal' and 'vertical' though
   *    it's possible to use other values as long as the animation object
   *    supports that value. Default value is 'horizontal'.
   * @param {Number} arg_config.animationSpeed Determines the speed at
   *    which the animations take place.
   * @return {jQuery} chainable jQuery class.
   * @memberOf jQuery.fn
   * @example
   * // Simple example:<br />
   * jQuery('#list1').onoPager({<br />
   *   pagePerItem: false,<br />
   *   listContainer: {<br />
   *     width: '700px',<br />
   *     height: '100px'<br />
   *   },<br />
   *   listItems: {<br />
   *     width: '300px'<br />
   *   },<br />
   *   animationType: 'linear',<br />
   *   animationSpeed: 1000<br />
   * });<br />
   *<br />
   * // Advanced example:<br />
   * jQuery('#list1').onoPager({<br />
   *    cssClass: 'onopager_theme1',<br />
   *    pagePerItem: true,<br />
   *    lockDuringTransition: false,<br />
   *    doesLoop: true,<br />
   *    listContainer: {<br />
   *      width: '300px',<br />
   *      height: '100px',<br />
   *      adjustHeightToListItem: {<br />
   *        active: true,<br />
   *        animate: true<br />
   *      }<br />
   *    },<br />
   *    listItems: {<br />
   *      width: '300px',<br />
   *      height: '100px'<br />
   *    },<br />
   *    activeIndex: 2,<br />
   *    autoPage: {<br />
   *      active: true,<br />
   *      interval: 2000,<br />
   *    },<br />
   *    labels: {<br />
   *      next: 'next',<br />
   *      previous: 'previous'<br />
   *    },<br />
   *    status: {<br />
   *      active: true,<br />
   *      prependText: 'page ',<br />
   *      seperationText: ' of ',<br />
   *      appendText: ' pages'<br />
   *    },<br />
   *    scroller: {<br />
   *      active: false,<br />
   *      pixelMove: 2<br />
   *    },<br />
   *    pageByNumber: {<br />
   *      active: true,<br />
   *      enableClick: true,<br />
   *      labels: []<br />
   *    },<br />
   *    pageByArrowKey: {<br />
   *      active: false,<br />
   *      preventDefault: false<br />
   *    },<br />
   *    swipeTriggersPage: false,<br />
   *    swipePlatforms: 'touch',<br />
   *    animationType: 'linear',<br />
   *    animationEasing: 'linear',<br />
   *    orientation: 'horizontal',<br />
   *    animationSpeed: 1000<br />
   * });
   */
  jQuery.fn.onoPager = function(arg_config, animationConfig) {
    var config = {
      cssClass: '',
      pagePerItem: true,
      lockDuringTransition: false,
      doesLoop: true,
      listContainer: {
        width: '',
        height: '',
        adjustHeightToListItem: {
          active: false,
          animate: false
        }
      },
      listItems: {
        width: '',
        height: '',
        triggersPagingOnClick: false
      },
      activeIndex: 0,
      autoPage: {
        active: false,
        interval: 2000,
        autoPageAnimationType: '',
        extraConfig: {}
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
        labels: [],
        hideThreshold: -1
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
      if (typeof(config.listItems.width) == 'string' &&
          config.listItems.width.length > 0) {
        listItems.css('width', config.listItems.width);
      }
      if (typeof(config.listItems.height) == 'string' &&
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

    // Create pager controls like 'next' and 'previous'
    function createControls() {
      var newHTML = '';
      if (config.autoPage.autoPageAnimationType && config.autoPage.active) {
        newHTML += '<div class="' + ONOPAGER + '_autoPageContainer"></div>';
      }
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
            if ($(this).hasClass('onoPager_active') == false) {
              page(index, 0);
            }
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
            page((pager.getIndex() - 1), -1);
            if (config.pageByArrowKey.preventDefault == true) {
              event.preventDefault();
            }
          }
          // Page forward
          if ((config.orientation == VERTICAL && key == DOWN) ||
            (config.orientation == HORIZONTAL && key == RIGHT)) {
            page((pager.getIndex() + 1), 1);
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
                page((pager.getIndex() - 1), -1);
              },
              dragLeft: function() {
                page((pager.getIndex() + 1), 1);
              },
              platform: config.swipePlatforms
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
              platform: config.swipePlatforms
            }
          );
        }
      }
    }

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

    function pagerHover(moveIndex) {
      // TODO: update paging index
      animation._pagerHover(moveIndex);
    }



    return this.each(function() {
      // create list wrappers and references
      list = $(this);
      list.removeClass(ONOPAGER + '_noJs');
      list.addClass(ONOPAGER + '_list');
      list.wrap('<div class="' + ONOPAGER + '_listContainer"></div>');
      listContainer = list.parent();
      listContainer.wrap('<div class="' + ONOPAGER + ' ' +
                         config.cssClass + '"/>');
      root = listContainer.parent();
      root.addClass(config.animationType);
      listItems = $(this).find(' > li, .' + ONOPAGER + '_listItem');
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
    });
  }
})(jQuery);






/**
 * @namespace Root namespace for the Ono Pager
 */
var onoPager = {};
