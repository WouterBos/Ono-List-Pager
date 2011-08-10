/**
 * @namespace Helper methods for the animation objects.
 */
onoPager.tools = (function() {
  var HORIZONTAL = 'horizontal';
  var VERTICAL = 'vertical';

  return {
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
      if (root.hasClass('onoPager_disabled') == false &&
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
    }
  };
})();
