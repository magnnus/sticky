export interface Iconfig {
    mode: 'affix' | 'sticky';
    direction: 'vertical' | 'horizontal';
    scrollRefer: Window | Document | string | Element;
    offsetParent?: string | Element;
    throttle: boolean;
    zIndex?: number;
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
    style?: any;
    holderStyle?: any;
}
declare class Sticky {
    el: string | HTMLElement;
    customCfg?: Partial<Iconfig>;
    constructor(el: string | HTMLElement, customCfg?: Partial<Iconfig>);
    static defaultConfig: Iconfig;
    config: Iconfig;
    target: HTMLElement;
    targetHolder: HTMLElement | null;
    scrollRefer: Window | Element;
    offsetParent: Element | null;
    listener: () => void;
    private _init;
    createTargetHolder(): void;
    private removeTagetHolder;
    private _initAffixMode;
    private _affixListener;
    private _initNativeStickyMode;
    private _initFallbackStickyMode;
    setStyleForTarget(): void;
    setStyleForHolder(): void;
    private _fallbackStickyListener;
    targetInfo: any;
    private _getTopDist;
    private _getLeftDist;
    private _initTargetInfo;
    private _setPosOnWindowSticky;
    private _setPosOnInnerSticky;
    private _throttle;
    destory(): void;
    resetStyle(): void;
}
export default Sticky;
