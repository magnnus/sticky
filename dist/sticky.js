/*!
 * @autots/sticky v0.0.2
 * Last Modified @ 2020-4-30 14:31:21
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
var supportSticky = false;
var stickyVendor;
(function () {
    var vendorList = ['', '-webkit-', '-ms-', '-moz-', '-o-'];
    var vendorsLen = vendorList.length;
    var tmpEl = document.createElement('div');
    for (var i = 0; i < vendorsLen; i++) {
        tmpEl.style.position = vendorList[i] + 'sticky';
        if (tmpEl.style.position !== '') {
            supportSticky = true;
            stickyVendor = vendorList[i];
            return;
        }
    }
    supportSticky = false;
})();
function getClientHeight() {
    return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
}
// function getClientWidth (): number {
//   return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
// }
var Sticky = /** @class */ (function () {
    function Sticky(el, customCfg) {
        var _this = this;
        this.el = el;
        this.customCfg = customCfg;
        this._affixListener = function () {
            var _a = _this, target = _a.target, targetHolder = _a.targetHolder, config = _a.config;
            var tag = isNaN(config.top) && !isNaN(config.bottom) ? "bottom" /* BOTTOM */ : "top" /* TOP */;
            var targetRect = (targetHolder || target).getBoundingClientRect();
            var style = target.style;
            var clientRect = 0;
            if (tag === 'bottom') {
                clientRect = getClientHeight();
            }
            // else if (tag === 'right') {
            //   // ! Not Used!!!
            //   clientRect = getClientWidth();
            // }
            if (targetRect[tag] < Math.abs(clientRect - config[tag])) {
                _this.createTargetHolder();
                _this.setStyleForTarget();
                style.position = 'fixed';
                style[tag] = config[tag] + 'px';
            }
            else {
                _this.removeTagetHolder();
                target.removeAttribute('style');
            }
        };
        this._fallbackStickyListener = function () {
            if (_this.scrollRefer === window) {
                _this._setPosOnWindowSticky();
                return;
            }
            _this._setPosOnInnerSticky();
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
            console.error(new Error('Sticky Init Error: missing necessary first param'));
            return;
        }
        if (typeof el === 'string') {
            this.target = document.querySelector(el);
        }
        else if (el instanceof HTMLElement) {
            this.target = el;
        }
        if (!this.target) {
            console.error(el, new Error('Sticky Init Error: unable to get a valid listening element'));
            return;
        }
        this.config = __assign(__assign({}, Sticky.defaultConfig), customCfg);
        this._init();
    }
    Sticky.prototype._init = function () {
        var cfg = this.config;
        // check `mode` firstly
        if (cfg.mode === 'affix') {
            if (supportSticky && this.target.parentElement === document.body) {
                this._initNativeStickyMode();
                return;
            }
            this._initAffixMode();
            return;
        }
        // then apply `native sticky` func
        if (supportSticky) {
            this._initNativeStickyMode();
            return;
        }
        this._initFallbackStickyMode();
    };
    Sticky.prototype.createTargetHolder = function () {
        var _a = this, target = _a.target, targetHolder = _a.targetHolder;
        if (targetHolder) {
            return;
        }
        var holder = document.createElement('div');
        var s = getComputedStyle(target, null);
        holder.style.cssText = "float: " + s.cssFloat + "; display: " + s.display + "; width: " + target.offsetWidth + "px; height: " + target.offsetHeight + "px; margin: " + s.marginTop + " " + s.marginRight + " " + s.marginBottom + " " + s.marginLeft + ";";
        target.insertAdjacentElement('beforebegin', holder);
        this.targetHolder = holder;
        this.setStyleForHolder();
    };
    Sticky.prototype.removeTagetHolder = function () {
        var targetHolder = this.targetHolder;
        if (targetHolder) {
            targetHolder.parentNode.removeChild(targetHolder);
            this.targetHolder = null;
        }
    };
    Sticky.prototype._initAffixMode = function () {
        var config = this.config;
        if (config.throttle) {
            this.listener = this._throttle(this._affixListener);
        }
        else {
            this.listener = this._affixListener;
        }
        this._initTargetInfo();
        window.addEventListener('scroll', this.listener, false);
    };
    Sticky.prototype._initNativeStickyMode = function () {
        var _a = this, _b = _a.config, top = _b.top, bottom = _b.bottom, target = _a.target;
        this.setStyleForTarget();
        target.style.position = stickyVendor + "sticky";
        if (!isNaN(top)) {
            target.style.top = top + 'px';
        }
        else if (!isNaN(bottom)) {
            target.style.bottom = bottom + 'px';
        }
    };
    Sticky.prototype._initFallbackStickyMode = function () {
        var config = this.config;
        var tmpRefer;
        var scrollRefer = config.scrollRefer, offsetParent = config.offsetParent;
        var globalArr = [window, document, document.body];
        if (globalArr.indexOf(scrollRefer) !== -1) {
            tmpRefer = window;
        }
        else if (typeof scrollRefer === 'string') {
            tmpRefer = document.querySelector(scrollRefer);
        }
        else if (scrollRefer instanceof Element) {
            tmpRefer = scrollRefer;
        }
        if (!tmpRefer) {
            console.error(new Error('Add Sticky Scroll Listener Error: invalid scrollRefer param'), config);
            return;
        }
        this.scrollRefer = tmpRefer;
        var tmpParent = null;
        if (offsetParent) {
            if (typeof offsetParent === 'string') {
                tmpParent = (this.scrollRefer === window ? document : this.scrollRefer).querySelector(offsetParent);
            }
            else if (offsetParent instanceof Element) {
                tmpParent = offsetParent;
            }
        }
        else {
            tmpParent = this.target.offsetParent;
        }
        this.offsetParent = tmpParent;
        if (config.throttle) {
            this.listener = this._throttle(this._fallbackStickyListener);
        }
        else {
            this.listener = this._fallbackStickyListener;
        }
        this._initTargetInfo();
        this.scrollRefer.addEventListener('scroll', this.listener, false);
    };
    Sticky.prototype.setStyleForTarget = function () {
        var _a = this, config = _a.config, target = _a.target;
        var style = config.style;
        for (var _i = 0, _b = Object.keys(style); _i < _b.length; _i++) {
            var attr = _b[_i];
            target.style[attr] = style[attr];
        }
    };
    Sticky.prototype.setStyleForHolder = function () {
        var _a = this, config = _a.config, targetHolder = _a.targetHolder;
        var holderStyle = config.holderStyle;
        for (var _i = 0, _b = Object.keys(holderStyle); _i < _b.length; _i++) {
            var attr = _b[_i];
            targetHolder.style[attr] = holderStyle[attr];
        }
    };
    Sticky.prototype._getTopDist = function (refer) {
        var top = 0;
        var cur = this.target;
        while (cur !== refer && cur !== null) {
            top += cur.offsetTop;
            if (cur !== this.target) {
                top += parseInt(getComputedStyle(cur).borderTopWidth, 10);
            }
            cur = cur.offsetParent;
        }
        return top;
    };
    Sticky.prototype._getLeftDist = function (refer) {
        var left = 0;
        var cur = this.target;
        while (cur !== refer && cur !== null) {
            left += cur.offsetLeft;
            if (cur !== this.target) {
                left += parseInt(getComputedStyle(cur).borderLeftWidth, 10);
            }
            cur = cur.offsetParent;
        }
        return left;
    };
    Sticky.prototype._initTargetInfo = function () {
        var _a = this, target = _a.target, scrollRefer = _a.scrollRefer, offsetParent = _a.offsetParent;
        var rect = target.getBoundingClientRect();
        this.targetInfo = {
            topToRefer: this._getTopDist(scrollRefer),
            topToParent: this._getTopDist(offsetParent),
            leftToRefer: this._getLeftDist(scrollRefer),
            leftToParent: this._getLeftDist(offsetParent),
            height: target.offsetHeight,
            width: target.offsetWidth,
            leftToClient: rect.left,
        };
    };
    Sticky.prototype._setPosOnWindowSticky = function () {
        var _a = this, target = _a.target, targetHolder = _a.targetHolder, config = _a.config, targetInfo = _a.targetInfo;
        var targetBoundingTop = (targetHolder || target).getBoundingClientRect().top;
        var parentEleHeight = this.offsetParent.offsetHeight;
        var targetStyle = target.style;
        if (targetBoundingTop <= config.top) {
            this.createTargetHolder();
            this.setStyleForTarget();
            if (parentEleHeight - targetInfo.topToParent - targetInfo.height - config.top < Math.abs(targetBoundingTop)) {
                targetStyle.position = 'absolute';
                targetStyle.bottom = '0px';
                targetStyle.left = targetInfo.leftToParent + 'px';
                targetStyle.removeProperty('top');
            }
            else {
                targetStyle.position = 'fixed';
                targetStyle.top = config.top + "px";
                targetStyle.left = targetInfo.leftToClient + 'px';
                targetStyle.removeProperty('bottom');
            }
        }
        else {
            target.removeAttribute('style');
            this.removeTagetHolder();
        }
    };
    Sticky.prototype._setPosOnInnerSticky = function () {
        var _a = this, target = _a.target, targetInfo = _a.targetInfo, scrollRefer = _a.scrollRefer, offsetParent = _a.offsetParent, config = _a.config;
        var offsetTag = 'top';
        var reverseTag = 'bottom';
        if (isNaN(config.top) && !isNaN(config.bottom)) {
            offsetTag = 'bottom';
            reverseTag = 'top';
        }
        var size = "offsetHeight" /* Height */;
        var dist = "scrollTop" /* Top */;
        // if (direction === 'horizontal') {
        //   size = 'offsetWidth';
        //   dist = 'scrollLeft';
        // }
        var targetSize = target[size];
        var parentElSize = offsetParent[size];
        var scrollDist = scrollRefer[dist];
        var targetDist = targetInfo.topToRefer;
        var targetStyle = target.style;
        if (scrollDist <= targetDist - config[offsetTag]) {
            target.removeAttribute('style');
            this.removeTagetHolder();
        }
        else if (scrollDist < parentElSize + targetDist - targetSize - targetInfo.topToParent - config[offsetTag]) {
            this.createTargetHolder();
            this.setStyleForTarget();
            targetStyle.position = 'absolute';
            targetStyle[offsetTag] = scrollDist - targetDist + config[offsetTag] + 'px';
            targetStyle.removeProperty(reverseTag);
        }
        else if (scrollDist < parentElSize + targetDist - targetInfo.topToParent) {
            this.createTargetHolder();
            this.setStyleForTarget();
            targetStyle.position = 'absolute';
            targetStyle[reverseTag] = '0px';
            targetStyle.removeProperty(offsetTag);
        }
        else {
            target.removeAttribute('style');
            this.removeTagetHolder();
        }
    };
    Sticky.prototype.destory = function () {
        var _this = this;
        if (this.listener) {
            window.removeEventListener('scroll', this.listener, false);
        }
        setTimeout(function () {
            _this.resetStyle();
            _this.removeTagetHolder();
        }, 100);
    };
    Sticky.prototype.resetStyle = function () {
        var el = this.target;
        el.removeAttribute('style');
        // if (supportSticky) {
        //   el.removeAttribute('style');
        // } else {
        //   const childEle = el.firstElementChild as HTMLElement;
        //   el.style.height = '';
        //   childEle.removeAttribute('style');
        // }
    };
    return Sticky;
}());
Sticky.defaultConfig = {
    mode: 'sticky',
    direction: 'vertical',
    scrollRefer: window,
    offsetParent: null,
    style: {
        zIndex: '100',
    },
    holderStyle: {},
    zIndex: 100,
    throttle: false,
};
exports.default = Sticky;


/***/ })
/******/ ])["default"];
});