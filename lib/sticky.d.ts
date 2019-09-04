export interface Iconfig {
    throttle: boolean;
    zIndex: number;
    top: number | string;
}
export declare type TElements = string | HTMLElement | HTMLCollectionOf<HTMLElement> | NodeListOf<HTMLElement>;
declare class Sticky {
    el: TElements;
    customCfg?: Partial<Iconfig>;
    constructor(el: TElements, customCfg?: Partial<Iconfig>);
    config: Iconfig;
    targets: HTMLElement[];
    listener: () => void;
    static defaultConfig: Iconfig;
    private _init;
    private _setCssSticky;
    private _scrollListener;
    private _setScrollPosition;
    private _throttle;
    destory(): void;
    private _resetStyle;
    unbind(el: TElements): void;
}
export default Sticky;
