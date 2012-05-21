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
      console.log(root.attr('class'))
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
