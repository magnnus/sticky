export interface Iconfig {
  scrollContainer: any;
  throttle: boolean;
  zIndex: number;
  top: number | string;
}

export type TElements = string | HTMLElement | HTMLCollectionOf<HTMLElement> | NodeListOf<HTMLElement>;

let isSupportCssSticky = false;
let stickyVendor: string;
(function (): void {
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
  constructor (public el: TElements, public customCfg?: Partial<Iconfig>) {
    if (!el) {
      console.error(new Error('Sticky 初始化错误，缺少必要的选择器参数'));
      return;
    }

    if (typeof el === 'string') {
      this.targets = document.querySelector(el);
    } else if (el instanceof HTMLElement) {
      this.targets = el;
    } else if ((el instanceof HTMLCollection || el instanceof NodeList) && el.length) {
      this.targets = el[0];
    }

    if (!this.targets) {
      console.error(new Error('Sticky 初始化失败，无法获取到有效的被监听元素'));
      return;
    }

    this.config = {
      ...Sticky.defaultConfig,
      ...customCfg,
    };

    this._init();
  }

  public config: Iconfig;

  public targets: HTMLElement;

  public scrollContainer: Window | HTMLElement;

  public listener: () => void;

  static defaultConfig: Iconfig = {
    scrollContainer: window,
    top: 0,
    zIndex: 100,
    throttle: false,
  }

  // decide to use css or scroll event
  private _init (): void {
    const config = this.config;

    if (isSupportCssSticky) {
      this._setCssSticky();
      return;
    }
    if (config.throttle) {
      this.listener = this._throttle(this._scrollListener);
    } else {
      this.listener = this._scrollListener;
    }

    let scrollContainer: any;
    if (config.scrollContainer === window || config.scrollContainer === document) {
      scrollContainer = window;
    } else if (typeof config.scrollContainer === 'string') {
      scrollContainer = document.querySelector(config.scrollContainer);
    } else if (config.scrollContainer instanceof HTMLElement) {
      scrollContainer = config.scrollContainer;
    } else if (config.scrollContainer instanceof NodeList || config.scrollContainer instanceof HTMLCollection) {
      const tmp = Array.prototype.slice.apply(config.scrollContainer);
      tmp.forEach(el => {
        if (el.contains(this.targets)) {
          scrollContainer = el;
        }
      });
    }
    if (!scrollContainer) {
      console.error(new Error('无效的 scrollContainer'));
    }
    this.scrollContainer = scrollContainer;
    scrollContainer.addEventListener('scroll', this.listener, false);
  }

  private _setCssSticky (): void {
    const config = this.config;
    const el = this.targets;
    el.style.position = `${stickyVendor}sticky`;
    el.style.top = typeof config.top === 'string' ? config.top : (config.top + 'px');
    el.style.zIndex = config.zIndex.toString();
  }

  private _scrollListener = (): void => {
    if (this.scrollContainer === window) {
      this._setScrollPosition(this.targets);
    } else {
      this._setInnerScrollPosition(this.targets);
    }
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

  private _setInnerScrollPosition (currentEle: HTMLElement): void {
    const parentEle = currentEle.offsetParent as HTMLElement;
    const childEle = currentEle.firstElementChild as HTMLElement;
    const scrollEle = this.scrollContainer as HTMLElement;

    const currentEleHeight = currentEle.offsetHeight;
    const parentEleHeight = parentEle.offsetHeight;
    const scrollTop = scrollEle.scrollTop;

    if (scrollTop < parentEleHeight - currentEleHeight) {
      childEle.style.position = 'absolue';
      childEle.style.top = scrollTop + 'px';
      childEle.style.bottom = '';
    } else if (scrollTop < parentEleHeight) {
      childEle.style.position = 'absolute';
      childEle.style.bottom = '0px';
      childEle.style.top = '';
    } else {
      childEle.style.position = '';
    }
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
    const el = this.targets;
    if (isSupportCssSticky) {
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

export default Sticky;
