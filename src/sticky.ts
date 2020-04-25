export interface Iconfig {
  mode: 'affix' | 'sticky';
  direction: 'vertical' | 'horizontal' | 'both';
  scrollRefer: Window | Document | string | Element | NodeListOf<Element> | HTMLCollectionOf<Element>;
  throttle: boolean;
  offsetParent?: string | Element;
  zIndex?: number;
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
  style?: any;
}

export type TElements = string | HTMLElement | HTMLCollectionOf<HTMLElement> | NodeListOf<HTMLElement>;
export type size = 'offsetWidth' | 'offsetHeight';
export type scrollDist = 'scrollTop' | 'scrollLeft';
export type offsetDist = 'offsetTop' | 'offsetLeft';
export type position = 'top' | 'bottom' | 'left' | 'right';

enum pos {
  TOP = 'top',
  BOTTOM = 'bottom',
  LEFT = 'left',
  RIGHT = 'right',
}

let supportSticky = false;
let stickyVendor: string;
(function (): void {
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

function getClientHeight (): number {
  return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
}

function getClientWidth (): number {
  return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
}

class Sticky {
  constructor (public el: string | HTMLElement, public customCfg?: Partial<Iconfig>) {
    if (!el) {
      console.error(new Error('Sticky Init Error: missing necessary first param'));
      return;
    }

    if (typeof el === 'string') {
      this.target = document.querySelector(el);
    } else if (el instanceof HTMLElement) {
      this.target = el;
    }

    if (!this.target) {
      console.error(el, new Error('Sticky Init Error: unable to get a valid listening element'));
      return;
    }

    this.config = {
      ...Sticky.defaultConfig,
      ...customCfg,
    };

    this._init();
  }

  static defaultConfig: Iconfig;

  public config: Iconfig;

  public target: HTMLElement;

  public targetHolder: HTMLElement | null;

  public scrollRefer: Window | Element;

  public offsetParent: Element | null;

  public currElOffsetTop: number;

  public targetPosInfo: object;

  public listener: () => void;

  private _init (): void {
    const cfg = this.config;

    // check `mode` firstly
    if (cfg.mode === 'affix') {
      if (cfg.direction === 'vertical') {
        this._setVerticalAffix(typeof cfg.top === 'number' ? 'top' : 'bottom');
      } else {
        this._setVerticalAffix(typeof cfg.left === 'number' ? 'left' : 'right');
      }
      return;
    }

    if (supportSticky) {
      this._setCssSticky();
      return;
    }

    if (cfg.throttle) {
      this.listener = this._throttle(this._scrollListener);
    } else {
      this.listener = this._scrollListener;
    }

    let tmpRefer: Window | Element;
    const { scrollRefer, offsetParent } = cfg;
    const globalArr: any[] = [window, document, document.body];
    console.log(scrollRefer, globalArr.indexOf(scrollRefer));
    if (globalArr.indexOf(scrollRefer) !== -1) {
      tmpRefer = window;
    } else if (typeof scrollRefer === 'string') {
      tmpRefer = document.querySelector(scrollRefer);
    } else if (scrollRefer instanceof Element) {
      tmpRefer = scrollRefer;
    } else if (scrollRefer instanceof NodeList || scrollRefer instanceof HTMLCollection) {
      const tmp: Element[] = Array.prototype.slice.apply(scrollRefer);
      for (const el of tmp) {
        if (el.contains(this.target)) {
          tmpRefer = el;
          break;
        }
      }
    }
    if (!tmpRefer) {
      console.error(new Error('Add Sticky Scroll Listener Error: invalid scrollRefer param'), cfg);
      return;
    }
    this.scrollRefer = tmpRefer;

    let tmpParent = null;
    if (offsetParent) {
      if (typeof offsetParent === 'string') {
        tmpParent = (this.scrollRefer === window ? document : this.scrollRefer as Element).querySelector(offsetParent);
      } else if (offsetParent instanceof Element) {
        tmpParent = offsetParent;
      }
    } else {
      tmpParent = this.target.offsetParent;
    }
    this.offsetParent = tmpParent;

    tmpRefer.addEventListener('scroll', this.listener, false);
  }

  private scrollListenerPool: Array<() => void> = [];

  private _affixListener (tag: position = 'top'): void {
    const { target, targetHolder, config } = this;

    const targetRect = (targetHolder || target).getBoundingClientRect();
    const style = target.style;
    let clientRect = 0;
    if (tag === 'bottom') {
      clientRect = getClientHeight();
    } else if (tag === 'right') {
      clientRect = getClientWidth();
    }

    if (targetRect[tag] < Math.abs(clientRect - config[tag])) {
      if (!targetHolder) {
        const holder = document.createElement('div');
        holder.style.cssText = `width: ${target.offsetWidth}px; height: ${target.offsetHeight}px`;
        target.insertAdjacentElement('beforebegin', holder);
        this.targetHolder = holder;
      }
      this._setStyleCssText();
      style.position = 'fixed';
      style[tag] = config[tag] + 'px';
    } else {
      if (targetHolder) {
        targetHolder.parentNode.removeChild(targetHolder);
        this.targetHolder = null;
      }
      // style.removeProperty('position');
      // style.removeProperty(tag);
      target.removeAttribute('style');
    }
  }

  private _setVerticalAffix (tag: position = 'top'): void {
    this.listener = this._affixListener.bind(this, tag);
    window.addEventListener('scroll', this.listener, false);
  }

  private _setCssSticky (): void {
    const { config, target } = this;
    const { style } = config;

    for (const attr of Object.keys(style)) {
      target.style[attr as any] = style[attr as any];
    }
    target.style.position = `${stickyVendor}sticky`;
    target.style.top = config.top + 'px';
    target.style.zIndex = config.zIndex.toString();
  }

  private _setStyleCssText (): void {
    const { config, target } = this;
    const { style } = config;
    for (const attr of Object.keys(style)) {
      target.style[attr as any] = style[attr];
    }
  }

  private _scrollListener = (): void => {
    if (this.scrollRefer === window) {
      this._setScrollPosition(this.target);
      return;
    }
    let currElOffsetTop = 0;
    let cur = this.target;
    while (cur !== this.scrollRefer && cur !== null) {
      currElOffsetTop += cur.offsetTop;
      cur = cur.offsetParent as HTMLElement;
    }
    this.currElOffsetTop = currElOffsetTop;
    this._setVerticalPos('top');
  }

  private _setScrollPosition (currentEle: HTMLElement): void {
    const childEle = currentEle.firstElementChild as HTMLElement;
    const config = this.config;

    const currentEleOffsetTop = currentEle.offsetTop;
    const currentEleBoundingTop = currentEle.getBoundingClientRect().top;

    const parentEleHeight = (currentEle.offsetParent as HTMLElement).offsetHeight;
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
      } else {
        childEleStyle.position = 'fixed';
        childEleStyle.bottom = '';
        childEleStyle.top = `${config.top}px`;
      }

      childEleStyle.zIndex = config.zIndex.toString();
    } else {
      childEleStyle.position = 'static';
    }
  }

  private _setVerticalPos (offsetTag: 'top' | 'bottom' = 'top'): void {
    const { direction, top, bottom } = this.config;
    const reverseTag = offsetTag === 'top' ? 'bottom' : 'top';
    let size: size = 'offsetHeight';
    let dist: scrollDist = 'scrollTop';
    if (direction === 'vertical') {

    } else if (direction === 'horizontal') {
      size = 'offsetWidth';
      dist = 'scrollLeft';
    } else {

    }
    const parentEle = this.offsetParent as HTMLElement;
    const childEle = this.target.firstElementChild as HTMLElement;
    const scrollEle = this.scrollRefer as HTMLElement;

    const currElSize = this.target[size];
    const parentElSize = parentEle[size];
    const scrollDist = scrollEle[dist];
    const offsetDist = this.currElOffsetTop;

    if (scrollDist <= offsetDist - this.config[offsetTag]) {
      childEle.style.position = '';
    } else if (scrollDist < parentElSize - currElSize + offsetDist) {
      childEle.style.position = 'absolute';
      childEle.style[offsetTag] = scrollDist - offsetDist + this.config[offsetTag] + 'px';
      childEle.style[reverseTag] = '';
    } else if (scrollDist < parentElSize + offsetDist) {
      childEle.style.position = 'absolute';
      childEle.style[reverseTag] = '0px';
      childEle.style[offsetTag] = '';
    } else {
      childEle.style.position = '';
    }
    childEle.style.zIndex = this.config.zIndex.toString();
  }

  private _throttle = (fn: (...args: any[]) => void, delay = 16): () => void => {
    let now: number;
    let pre: number;
    let timer: NodeJS.Timeout;
    let ctx: any;
    let args: any[];

    function execute (): void {
      fn.apply(ctx, args);
      pre = now;
    }

    return function (...rest: any[]): void {
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
  }

  public destory (): void {
    if (this.listener) {
      window.removeEventListener('scroll', this.listener, false);
    }
    setTimeout(() => {
      this._resetStyle();
    }, 100);
  }

  private _resetStyle (): void {
    const el = this.target;
    if (supportSticky) {
      el.style.position = '';
      el.style.top = '';
      el.style.zIndex = '';
    } else {
      const childEle = el.firstElementChild as HTMLElement;
      el.style.height = '';
      childEle.style.position = '';
      childEle.style.top = '';
      childEle.style.bottom = '';
      childEle.style.zIndex = '';
    }
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
  zIndex: 100,
  throttle: false,
};

export default Sticky;
