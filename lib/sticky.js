let supportSticky = false;
let stickyVendor;
(function () {
    const vendorList = ['', '-webkit-', '-ms-', '-moz-', '-o-'];
    const vendorsLen = vendorList.length;
    const tmpEl = document.createElement('div');
    for (let i = 0; i < vendorsLen; i++) {
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
class Sticky {
    constructor(el, customCfg) {
        this.el = el;
        this.customCfg = customCfg;
        this._affixListener = () => {
            const { target, targetHolder, config } = this;
            const tag = isNaN(config.top) && !isNaN(config.bottom) ? "bottom" /* BOTTOM */ : "top" /* TOP */;
            const targetRect = (targetHolder || target).getBoundingClientRect();
            const style = target.style;
            let clientRect = 0;
            if (tag === 'bottom') {
                clientRect = getClientHeight();
            }
            // else if (tag === 'right') {
            //   // ! Not Used!!!
            //   clientRect = getClientWidth();
            // }
            if (targetRect[tag] < Math.abs(clientRect - config[tag])) {
                this.createTargetHolder();
                this.setStyleForTarget();
                style.position = 'fixed';
                style[tag] = config[tag] + 'px';
            }
            else {
                this.removeTagetHolder();
                target.removeAttribute('style');
            }
        };
        this._fallbackStickyListener = () => {
            if (this.scrollRefer === window) {
                this._setPosOnWindowSticky();
                return;
            }
            this._setPosOnInnerSticky();
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
        this.config = Object.assign(Object.assign({}, Sticky.defaultConfig), customCfg);
        this._init();
    }
    _init() {
        const cfg = this.config;
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
    }
    createTargetHolder() {
        const { target, targetHolder } = this;
        if (targetHolder) {
            return;
        }
        const holder = document.createElement('div');
        const s = getComputedStyle(target, null);
        holder.style.cssText = `float: ${s.cssFloat}; display: ${s.display}; width: ${target.offsetWidth}px; height: ${target.offsetHeight}px; margin: ${s.marginTop} ${s.marginRight} ${s.marginBottom} ${s.marginLeft};`;
        target.insertAdjacentElement('beforebegin', holder);
        this.targetHolder = holder;
        this.setStyleForHolder();
    }
    removeTagetHolder() {
        const { targetHolder } = this;
        if (targetHolder) {
            targetHolder.parentNode.removeChild(targetHolder);
            this.targetHolder = null;
        }
    }
    _initAffixMode() {
        const { config } = this;
        if (config.throttle) {
            this.listener = this._throttle(this._affixListener);
        }
        else {
            this.listener = this._affixListener;
        }
        this._initTargetInfo();
        window.addEventListener('scroll', this.listener, false);
    }
    _initNativeStickyMode() {
        const { config: { top, bottom }, target } = this;
        this.setStyleForTarget();
        target.style.position = `${stickyVendor}sticky`;
        if (!isNaN(top)) {
            target.style.top = top + 'px';
        }
        else if (!isNaN(bottom)) {
            target.style.bottom = bottom + 'px';
        }
    }
    _initFallbackStickyMode() {
        const { config } = this;
        let tmpRefer;
        const { scrollRefer, offsetParent } = config;
        const globalArr = [window, document, document.body];
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
        let tmpParent = null;
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
    }
    setStyleForTarget() {
        const { config, target } = this;
        const { style } = config;
        for (const attr of Object.keys(style)) {
            target.style[attr] = style[attr];
        }
    }
    setStyleForHolder() {
        const { config, targetHolder } = this;
        const { holderStyle } = config;
        for (const attr of Object.keys(holderStyle)) {
            targetHolder.style[attr] = holderStyle[attr];
        }
    }
    _getTopDist(refer) {
        let top = 0;
        let cur = this.target;
        while (cur !== refer && cur !== null) {
            top += cur.offsetTop;
            if (cur !== this.target) {
                top += parseInt(getComputedStyle(cur).borderTopWidth, 10);
            }
            cur = cur.offsetParent;
        }
        return top;
    }
    _getLeftDist(refer) {
        let left = 0;
        let cur = this.target;
        while (cur !== refer && cur !== null) {
            left += cur.offsetLeft;
            if (cur !== this.target) {
                left += parseInt(getComputedStyle(cur).borderLeftWidth, 10);
            }
            cur = cur.offsetParent;
        }
        return left;
    }
    _initTargetInfo() {
        const { target, scrollRefer, offsetParent } = this;
        const rect = target.getBoundingClientRect();
        this.targetInfo = {
            topToRefer: this._getTopDist(scrollRefer),
            topToParent: this._getTopDist(offsetParent),
            leftToRefer: this._getLeftDist(scrollRefer),
            leftToParent: this._getLeftDist(offsetParent),
            height: target.offsetHeight,
            width: target.offsetWidth,
            leftToClient: rect.left,
        };
    }
    _setPosOnWindowSticky() {
        const { target, targetHolder, config, targetInfo } = this;
        const targetBoundingTop = (targetHolder || target).getBoundingClientRect().top;
        const parentEleHeight = this.offsetParent.offsetHeight;
        const targetStyle = target.style;
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
                targetStyle.top = `${config.top}px`;
                targetStyle.left = targetInfo.leftToClient + 'px';
                targetStyle.removeProperty('bottom');
            }
        }
        else {
            target.removeAttribute('style');
            this.removeTagetHolder();
        }
    }
    _setPosOnInnerSticky() {
        const { target, targetInfo, scrollRefer, offsetParent, config } = this;
        let offsetTag = 'top';
        let reverseTag = 'bottom';
        if (isNaN(config.top) && !isNaN(config.bottom)) {
            offsetTag = 'bottom';
            reverseTag = 'top';
        }
        const size = "offsetHeight" /* Height */;
        const dist = "scrollTop" /* Top */;
        // if (direction === 'horizontal') {
        //   size = 'offsetWidth';
        //   dist = 'scrollLeft';
        // }
        const targetSize = target[size];
        const parentElSize = offsetParent[size];
        const scrollDist = scrollRefer[dist];
        const targetDist = targetInfo.topToRefer;
        const targetStyle = target.style;
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
    }
    destory() {
        if (this.listener) {
            window.removeEventListener('scroll', this.listener, false);
        }
        setTimeout(() => {
            this.resetStyle();
            this.removeTagetHolder();
        }, 100);
    }
    resetStyle() {
        const el = this.target;
        el.removeAttribute('style');
        // if (supportSticky) {
        //   el.removeAttribute('style');
        // } else {
        //   const childEle = el.firstElementChild as HTMLElement;
        //   el.style.height = '';
        //   childEle.removeAttribute('style');
        // }
    }
}
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
export default Sticky;
//# sourceMappingURL=sticky.js.map