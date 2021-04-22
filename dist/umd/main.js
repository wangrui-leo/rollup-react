(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('react')) :
  typeof define === 'function' && define.amd ? define(['react'], factory) :
  (global = global || self, global.Main = factory(global.React));
}(this, (function (React) { 'use strict';

  React = React && Object.prototype.hasOwnProperty.call(React, 'default') ? React['default'] : React;

  var Comp = function Comp(_ref) {
    var model = _ref.model,
        loading = _ref.loading,
        location = _ref.location,
        dispatch = _ref.dispatch;
    return /*#__PURE__*/React.createElement("div", null);
  };

  return Comp;

})));
