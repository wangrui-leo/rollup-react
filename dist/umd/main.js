(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('../../../../../RenderForm'), require('../../../../../Title')) :
  typeof define === 'function' && define.amd ? define(['exports', '../../../../../RenderForm', '../../../../../Title'], factory) :
  (global = global || self, factory(global.Main = {}, global.RenderForm, global.Title));
}(this, (function (exports, RenderForm, Title) { 'use strict';

  RenderForm = RenderForm && Object.prototype.hasOwnProperty.call(RenderForm, 'default') ? RenderForm['default'] : RenderForm;



  exports.RenderForm = RenderForm;
  Object.defineProperty(exports, 'DTitle', {
    enumerable: true,
    get: function () {
      return Title.DTitle;
    }
  });
  Object.defineProperty(exports, 'FTitle', {
    enumerable: true,
    get: function () {
      return Title.FTitle;
    }
  });

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=main.js.map
