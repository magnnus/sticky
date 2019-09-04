let isSupportCssSticky = false;
let stickyVendor;
(function () {
    const vendorList = ['', '-webkit-', '-ms-', '-moz-', '-o-'];
    const vendorListLength = vendorList.length;
    const stickyElement = document.createElement('div');
    for (let i = 0; i < vendorListLength; i++) {
        stickyElement.style.position = vendorList[i] + 'sticky';
        if (stickyElement.style.position !== '') {
            isSupportCssSticky = true;
            stickyVendor = vendorList[i];
            return;
        }
    }
    isSupportCssSticky = false;
})();
class Sticky {
    constructor(el, customCfg) {
        this.el = el;
        this.customCfg = customCfg;
        this._scrollListener = () => {
            this.targets.forEach(el => {
                this._setScrollPosition(el);
            });
        };
        this._throttle = (fn, delay = 16) => {
            let now;
            let pre;
            let timer;
            let ctx;
            let args;
            function execute() {
                fn.apply(ctx, args);
                pre = now;
            }
            return function (...rest) {
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
                const diff = delay - (now - pre);
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
            this.targets = Array.prototype.slice.apply(document.querySelectorAll(el));
        }
        else if (el instanceof HTMLElement) {
            this.targets = [el];
        }
        else if (el.length) {
            this.targets = Array.prototype.slice.call(el);
        }
        if (!this.targets || !this.targets.length) {
            console.error(new Error('Sticky 初始化失败，无法获取到有效的被监听元素'));
            return;
        }
        this.config = Object.assign(Object.assign({}, Sticky.defaultConfig), customCfg);
        this._init();
    }
    // decide to use css or scroll event
    _init() {
        if (isSupportCssSticky) {
            this._setCssSticky();
            return;
        }
        if (this.config.throttle) {
            this.listener = this._throttle(this._scrollListener);
        }
        else {
            this.listener = this._scrollListener;
        }
        window.addEventListener('scroll', this.listener, false);
    }
    _setCssSticky() {
        const config = this.config;
        this.targets.forEach(el => {
            el.style.position = `${stickyVendor}sticky`;
            el.style.top = typeof config.top === 'string' ? config.top : (config.top + 'px');
            el.style.zIndex = config.zIndex.toString();
        });
    }
    _setScrollPosition(currentEle) {
        const childEle = currentEle.firstElementChild;
        const config = this.config;
        const currentEleOffsetTop = currentEle.offsetTop;
        const currentEleBoundingTop = currentEle.getBoundingClientRect().top;
        const parentEleHeight = currentEle.offsetParent.offsetHeight;
        const childEleStyle = childEle.style;
        if (currentEleBoundingTop <= config.top) {
            const tmpHeight = parseInt(currentEle.style.height);
            if (!tmpHeight || tmpHeight !== childEle.offsetHeight) {
                currentEle.style.height = `${childEle.offsetHeight}px`;
            }
            if (parentEleHeight - currentEleOffsetTop - currentEle.offsetHeight - Math.abs(currentEleBoundingTop) < 0) {
                childEleStyle.position = 'absolute';
                childEleStyle.bottom = '0px';
                childEleStyle.top = '';
            }
            else {
                childEleStyle.position = 'fixed';
                childEleStyle.bottom = '';
                childEleStyle.top = `${config.top}px`;
            }
            childEleStyle.zIndex = config.zIndex.toString();
        }
        else {
            childEleStyle.position = 'static';
        }
    }
    destory() {
        if (this.listener) {
            window.removeEventListener('scroll', this.listener, false);
        }
        setTimeout(() => {
            this._resetStyle(this.targets);
        }, 100);
    }
    _resetStyle(targets) {
        targets.forEach(el => {
            if (isSupportCssSticky) {
                el.style.position = '';
                el.style.top = '';
                el.style.zIndex = '';
            }
            else {
                const childEle = el.firstElementChild;
                el.style.height = '';
                childEle.style.position = '';
                childEle.style.top = '';
                childEle.style.bottom = '';
                childEle.style.zIndex = '';
            }
        });
    }
    unbind(el) {
        let unbindTargets;
        if (typeof el === 'string') {
            unbindTargets = Array.prototype.slice.apply(document.querySelectorAll(el));
        }
        else if (el instanceof HTMLElement) {
            unbindTargets = [el];
        }
        else if (el.length) {
            unbindTargets = Array.prototype.slice.call(el);
        }
        this.targets = this.targets.filter(target => {
            for (let i = 0; i < unbindTargets.length; i++) {
                if (unbindTargets[i] === target) {
                    this._resetStyle([unbindTargets[i]]);
                    return false;
                }
            }
            return true;
        });
    }
}
Sticky.defaultConfig = {
    top: 0,
    zIndex: 100,
    throttle: false,
};
export default Sticky;
//# sourceMappingURL=sticky.js.map