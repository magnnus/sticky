/*!
 * @autots/sticky v0.0.1
 * Last Modified @ 2019-9-5 10:08:57 AM
 * Released under the MIT License.
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Sticky"] = factory();
	else
		root["AutoTs"] = root["AutoTs"] || {}, root["AutoTs"]["Sticky"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var isSupportCssSticky = false;
var stickyVendor;
(function () {
    var vendorList = ['', '-webkit-', '-ms-', '-moz-', '-o-'];
    var vendorListLength = vendorList.length;
    var stickyElement = document.createElement('div');
    for (var i = 0; i < vendorListLength; i++) {
        stickyElement.style.position = vendorList[i] + 'sticky';
        if (stickyElement.style.position !== '') {
            isSupportCssSticky = true;
            stickyVendor = vendorList[i];
            return;
        }
    }
    isSupportCssSticky = false;
})();
var Sticky = /** @class */ (function () {
    function Sticky(el, customCfg) {
        var _this = this;
        this.el = el;
        this.customCfg = customCfg;
        this._scrollListener = function () {
            if (_this.scrollContainer === window) {
                _this._setScrollPosition(_this.targets);
            }
            else {
                var currentEleOffsetTop = 0;
                var cur = _this.targets;
                while (cur !== _this.scrollContainer && cur !== null) {
                    currentEleOffsetTop += cur.offsetTop;
                    cur = cur.offsetParent;
                }
                _this.currentEleOffsetTop = currentEleOffsetTop;
                _this._setInnerScrollPosition(_this.targets);
            }
        };
        this._throttle = function (fn, delay) {
            if (delay === void 0) { delay = 16; }
            var now;
            var pre;
            var timer;
            var ctx;
            var args;
            function execute() {
                fn.apply(ctx, args);
                pre = now;
            }
            return function () {
                var rest = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    rest[_i] = arguments[_i];
                }
                ctx = this;
                args = rest;
                now = Date.now();
                if (timer) {
                    clearTimeout(timer);
                    timer = null;
                }
                if (!pre) {
                    execute();
                    return;
                }
                var diff = delay - (now - pre);
                if (diff < 0) {
                    execute();
                    return;
                }
                timer = setTimeout(function () {
                    execute();
                }, diff);
            };
        };
        if (!el) {
            console.error(new Error('Sticky 初始化错误，缺少必要的选择器参数'));
            return;
        }
        if (typeof el === 'string') {
            this.targets = document.querySelector(el);
        }
        else if (el instanceof HTMLElement) {
            this.targets = el;
        }
        else if ((el instanceof HTMLCollection || el instanceof NodeList) && el.length) {
            this.targets = el[0];
        }
        if (!this.targets) {
            console.error(new Error('Sticky 初始化失败，无法获取到有效的被监听元素'));
            return;
        }
        this.config = __assign(__assign({}, Sticky.defaultConfig), customCfg);
        this._init();
    }
    // decide to use css or scroll event
    Sticky.prototype._init = function () {
        var _this = this;
        var config = this.config;
        if (isSupportCssSticky) {
            this._setCssSticky();
            return;
        }
        if (config.throttle) {
            this.listener = this._throttle(this._scrollListener);
        }
        else {
            this.listener = this._scrollListener;
        }
        var scrollContainer;
        if (config.scrollContainer === window || config.scrollContainer === document) {
            scrollContainer = window;
        }
        else if (typeof config.scrollContainer === 'string') {
            scrollContainer = document.querySelector(config.scrollContainer);
        }
        else if (config.scrollContainer instanceof HTMLElement) {
            scrollContainer = config.scrollContainer;
        }
        else if (config.scrollContainer instanceof NodeList || config.scrollContainer instanceof HTMLCollection) {
            var tmp = Array.prototype.slice.apply(config.scrollContainer);
            tmp.forEach(function (el) {
                if (el.contains(_this.targets)) {
                    scrollContainer = el;
                }
            });
        }
        if (!scrollContainer) {
            console.error(new Error('无效的 scrollContainer'));
        }
        this.scrollContainer = scrollContainer;
        scrollContainer.addEventListener('scroll', this.listener, false);
    };
    Sticky.prototype._setCssSticky = function () {
        var config = this.config;
        var el = this.targets;
        el.style.position = stickyVendor + "sticky";
        el.style.top = config.top + 'px';
        el.style.zIndex = config.zIndex.toString();
    };
    Sticky.prototype._setScrollPosition = function (currentEle) {
        var childEle = currentEle.firstElementChild;
        var config = this.config;
        var currentEleOffsetTop = currentEle.offsetTop;
        var currentEleBoundingTop = currentEle.getBoundingClientRect().top;
        var parentEleHeight = currentEle.offsetParent.offsetHeight;
        var childEleStyle = childEle.style;
        if (currentEleBoundingTop <= config.top) {
            var tmpHeight = parseInt(currentEle.style.height);
            if (!tmpHeight || tmpHeight !== childEle.offsetHeight) {
                currentEle.style.height = childEle.offsetHeight + "px";
            }
            if (parentEleHeight - currentEleOffsetTop - currentEle.offsetHeight - Math.abs(currentEleBoundingTop) < 0) {
                childEleStyle.position = 'absolute';
                childEleStyle.bottom = '0px';
                childEleStyle.top = '';
            }
            else {
                childEleStyle.position = 'fixed';
                childEleStyle.bottom = '';
                childEleStyle.top = config.top + "px";
            }
            childEleStyle.zIndex = config.zIndex.toString();
        }
        else {
            childEleStyle.position = 'static';
        }
    };
    Sticky.prototype._setInnerScrollPosition = function (currentEle) {
        var parentEle = currentEle.offsetParent;
        var childEle = currentEle.firstElementChild;
        var scrollEle = this.scrollContainer;
        var currentEleHeight = currentEle.offsetHeight;
        // let currentEleOffsetTop = 0;
        // let cur = currentEle;
        // while (cur !== scrollEle) {
        //   currentEleOffsetTop += cur.offsetTop;
        //   cur = cur.offsetParent as HTMLElement;
        // }
        var parentEleHeight = parentEle.offsetHeight;
        var scrollTop = scrollEle.scrollTop;
        if (scrollTop <= this.currentEleOffsetTop) {
            childEle.style.position = '';
        }
        else if (scrollTop < parentEleHeight - currentEleHeight + this.currentEleOffsetTop) {
            childEle.style.position = 'absolute';
            childEle.style.top = scrollTop - this.currentEleOffsetTop + this.config.top + 'px';
            childEle.style.bottom = '';
        }
        else if (scrollTop < parentEleHeight + this.currentEleOffsetTop) {
            childEle.style.position = 'absolute';
            childEle.style.bottom = '0px';
            childEle.style.top = '';
        }
        else {
            childEle.style.position = '';
        }
        childEle.style.zIndex = this.config.zIndex.toString();
    };
    Sticky.prototype.destory = function () {
        var _this = this;
        if (this.listener) {
            window.removeEventListener('scroll', this.listener, false);
        }
        setTimeout(function () {
            _this._resetStyle();
        }, 100);
    };
    Sticky.prototype._resetStyle = function () {
        var el = this.targets;
        if (isSupportCssSticky) {
            el.style.position = '';
            el.style.top = '';
            el.style.zIndex = '';
        }
        else {
            var childEle = el.firstElementChild;
            el.style.height = '';
            childEle.style.position = '';
            childEle.style.top = '';
            childEle.style.bottom = '';
            childEle.style.zIndex = '';
        }
    };
    Sticky.defaultConfig = {
        scrollContainer: window,
        top: 0,
        zIndex: 100,
        throttle: false,
    };
    return Sticky;
}());
exports.default = Sticky;


/***/ })
/******/ ])["default"];
});