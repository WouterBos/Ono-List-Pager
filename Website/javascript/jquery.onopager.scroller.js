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
