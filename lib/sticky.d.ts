export interface Iconfig {
    scrollContainer: any;
    throttle: boolean;
    zIndex: number;
    top: number;
}
export declare type TElements = string | HTMLElement | HTMLCollectionOf<HTMLElement> | NodeListOf<HTMLElement>;
declare class Sticky {
    el: TElements;
    customCfg?: Partial<Iconfig>;
    constructor(el: TElements, customCfg?: Partial<Iconfig>);
    config: Iconfig;
    targets: HTMLElement;
    scrollContainer: Window | HTMLElement;
    currentEleOffsetTop: number;
    listener: () => void;
    static defaultConfig: Iconfig;
    private _init;
    private _setCssSticky;
    private _scrollListener;
    private _setScrollPosition;
    private _setInnerScrollPosition;
    private _throttle;
    destory(): void;
    private _resetStyle;
}
export default Sticky;
