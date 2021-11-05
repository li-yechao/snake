export interface AggTrade {
    /**
     * 事件类型
     */
    e: 'aggTrade';
    /**
     * 事件时间
     */
    E: number;
    /**
     * 交易对
     */
    s: string;
    /**
     * 归集交易 ID
     */
    a: number;
    /**
     * 成交价格
     */
    p: string;
    /**
     * 成交笔数
     */
    q: string;
    /**
     * 被归集的首个交易 ID
     */
    f: number;
    /**
     * 被归集的末次交易 ID
     */
    l: number;
    /**
     * 成交时间
     */
    T: number;
    /**
     * 买方是否是做市方
     * 如 true，则此次成交是一个主动卖出单，否则是一个主动买入单。
     */
    m: boolean;
}
export interface Trade {
    /**
     * 事件类型
     */
    e: 'trade';
    /**
     * 事件时间
     */
    E: number;
    /**
     * 交易对
     */
    s: string;
    /**
     * 交易 ID
     */
    t: number;
    /**
     * 成交价格
     */
    p: string;
    /**
     * 成交笔数
     */
    q: string;
    /**
     * 买方的订单 ID
     */
    b: number;
    /**
     * 卖方的订单 ID
     */
    a: number;
    /**
     * 成交时间
     */
    T: number;
    /**
     * 买方是否是做市方
     * 如 true，则此次成交是一个主动卖出单，否则是一个主动买入单。
     */
    m: boolean;
}
export interface Depth {
    /**
     * Last update ID
     */
    lastUpdateId: number;
    /**
     * 买单深度
     */
    bids: [
        /**
         * 价格档位
         */
        string,
        /**
         * 数量
         */
        string
    ][];
    /**
     * 卖单深度
     */
    asks: [
        /**
         * 价格档位
         */
        string,
        /**
         * 数量
         */
        string
    ][];
}
export interface DepthUpdate {
    /**
     * 事件类型
     */
    e: 'depthUpdate';
    /**
     * 事件时间
     */
    E: number;
    /**
     * 交易对
     */
    s: string;
    /**
     * 从上次推送至今新增的第一个 update Id
     */
    U: number;
    /**
     * 从上次推送至今新增的最后一个 update Id
     */
    u: 160;
    /**
     * 变动的买单深度
     */
    b: [
        /**
         * 变动的价格档位
         */
        string,
        /**
         * 数量
         */
        string
    ][];
    /**
     * 变动的卖单深度
     */
    a: [
        /**
         * 变动的价格档位
         */
        string,
        /**
         * 数量
         */
        string
    ][];
}
export interface Ticker {
    /**
     * 事件类型
     */
    e: '24hrTicker';
    /**
     * 事件时间
     */
    E: number;
    /**
     * 交易对
     */
    s: string;
    /**
     * 24 小时价格变化
     */
    p: string;
    /**
     * 24 小时价格变化(百分比)
     */
    P: string;
    /**
     * 平均价格
     */
    w: string;
    /**
     * 整整 24 小时之前，向前数的最后一次成交价格
     */
    x: string;
    /**
     * 最新成交价格
     */
    c: string;
    /**
     * 最新成交交易的成交量
     */
    Q: string;
    /**
     * 目前最高买单价
     */
    b: string;
    /**
     * 目前最高买单价的挂单量
     */
    B: string;
    /**
     * 目前最低卖单价
     */
    a: string;
    /**
     * 目前最低卖单价的挂单量
     */
    A: string;
    /**
     * 整整 24 小时前，向后数的第一次成交价格
     */
    o: string;
    /**
     * 24 小时内最高成交价
     */
    h: string;
    /**
     * 24 小时内最低成交价
     */
    l: string;
    /**
     * 24 小时内成交量
     */
    v: string;
    /**
     * 24 小时内成交额
     */
    q: string;
    /**
     * 统计开始时间
     */
    O: number;
    /**
     * 统计结束时间
     */
    C: number;
    /**
     * 24 小时内第一笔成交交易 ID
     */
    F: number;
    /**
     * 24 小时内最后一笔成交交易 ID
     */
    L: number;
    /**
     * 24 小时内成交数
     */
    n: number;
}
export interface MiniTicker {
    /**
     * 事件类型
     */
    e: '24hrMiniTicker';
    /**
     * 事件时间
     */
    E: number;
    /**
     * 交易对
     */
    s: string;
    /**
     * 最新成交价格
     */
    c: string;
    /**
     * 24 小时前开始第一笔成交价格
     */
    o: string;
    /**
     * 24 小时内最高成交价
     */
    h: string;
    /**
     * 24 小时内最低成交价
     */
    l: string;
    /**
     * 成交量
     */
    v: string;
    /**
     * 成交额
     */
    q: string;
}
export interface BookTicker {
    /**
     * order book updateId
     */
    u: number;
    /**
     * 交易对
     */
    s: string;
    /**
     * 买单最优挂单价格
     */
    b: string;
    /**
     * 买单最优挂单数量
     */
    B: string;
    /**
     * 卖单最优挂单价格
     */
    a: string;
    /**
     * 卖单最优挂单数量
     */
    A: string;
}
export declare type KlineInterval = '1m' | '3m' | '5m' | '15m' | '30m' | '1h' | '2h' | '4h' | '6h' | '8h' | '12h' | '1d' | '3d' | '1w' | '1M';
export interface Kline {
    /**
     * 事件类型
     */
    e: 'kline';
    /**
     * 事件时间
     */
    E: number;
    /**
     * 交易对
     */
    s: string;
    /**
     * 最新一根 K 线的更新
     */
    k: {
        /**
         * 这根 K 线的起始时间
         */
        t: number;
        /**
         * 这根 K 线的结束时间
         */
        T: number;
        /**
         * 交易对
         */
        s: string;
        /**
         * K 线间隔
         */
        i: KlineInterval;
        /**
         * 这根 K 线期间第一笔成交 ID
         */
        f: number;
        /**
         * 这根 K 线期间末一笔成交 ID
         */
        L: number;
        /**
         * 这根 K 线期间第一笔成交价
         */
        o: string;
        /**
         * 这根 K 线期间末一笔成交价
         */
        c: string;
        /**
         * 这根 K 线期间最高成交价
         */
        h: string;
        /**
         * 这根 K 线期间最低成交价
         */
        l: string;
        /**
         * 这根 K 线期间成交量
         */
        v: string;
        /**
         * 这根 K 线期间成交笔数
         */
        n: number;
        /**
         * 这根 K 线是否完结(是否已经开始下一根 K 线)
         */
        x: boolean;
        /**
         * 这根 K 线期间成交额
         */
        q: string;
        /**
         * 主动买入的成交量
         */
        V: string;
        /**
         * 主动买入的成交额
         */
        Q: string;
    };
}
export interface TradeItem {
    id: number;
    price: string;
    qty: string;
    time: number;
    isBuyerMaker: boolean;
    isBestMatch: boolean;
}
export interface AggTradeItem {
    /**
     * 归集成交 ID
     */
    a: number;
    /**
     * 成交价
     */
    p: string;
    /**
     * 成交量
     */
    q: string;
    /**
     * 被归集的首个成交 ID
     */
    f: number;
    /**
     * 被归集的末个成交 ID
     */
    l: number;
    /**
     *
     */
    T: number;
    /**
     * 是否为主动卖出单
     */
    m: boolean;
    /**
     * 是否为最优撮合单(可忽略，目前总为最优撮合)
     */
    M: boolean;
}
export interface HistoricalTradeItem {
    id: number;
    price: string;
    qty: string;
    quoteQty: string;
    time: number;
    isBuyerMaker: boolean;
    isBestMatch: boolean;
}
export declare type KlineItem = Array<any> & {
    /**
     * 开盘时间
     */
    0: number;
    /**
     * 开盘价
     */
    1: string;
    /**
     * 最高价
     */
    2: string;
    /**
     * 最低价
     */
    3: string;
    /**
     * 收盘价(当前 K 线未结束的即为最新价)
     */
    4: string;
    /**
     * 成交量
     */
    5: string;
    /**
     * 收盘时间
     */
    6: number;
    /**
     * 成交额
     */
    7: string;
    /**
     * 成交笔数
     */
    8: number;
    /**
     * 主动买入成交量
     */
    9: string;
    /**
     * 主动买入成交额
     */
    10: string;
};
export interface StreamEventMap {
    trade: (e: Trade) => void;
    aggTrade: (e: AggTrade) => void;
    depth: (e: DepthUpdate) => void;
    depth5: (e: Depth) => void;
    depth10: (e: Depth) => void;
    depth20: (e: Depth) => void;
    ticker: (e: Ticker) => void;
    miniTicker: (e: MiniTicker) => void;
    bookTicker: (e: BookTicker) => void;
    kline_1m: (e: Kline) => void;
    kline_3m: (e: Kline) => void;
    kline_5m: (e: Kline) => void;
    kline_15m: (e: Kline) => void;
    kline_30m: (e: Kline) => void;
    kline_1h: (e: Kline) => void;
    kline_2h: (e: Kline) => void;
    kline_4h: (e: Kline) => void;
    kline_6h: (e: Kline) => void;
    kline_8h: (e: Kline) => void;
    kline_12h: (e: Kline) => void;
    kline_1d: (e: Kline) => void;
    kline_3d: (e: Kline) => void;
    kline_1w: (e: Kline) => void;
    kline_1M: (e: Kline) => void;
}
export declare type StreamEventType = keyof StreamEventMap;
export declare type StreamEventData = Parameters<StreamEventMap[keyof StreamEventMap]>[0];
export declare namespace StreamEventDataType {
    function isTrade(d: StreamEventData): d is Trade;
    function isAggTrade(d: StreamEventData): d is AggTrade;
    function isDepthUpdate(d: StreamEventData): d is DepthUpdate;
    function isDepth(d: StreamEventData): d is Depth;
    function isTicker(d: StreamEventData): d is Ticker;
    function isMiniTicker(d: StreamEventData): d is MiniTicker;
    function isBokTicker(d: StreamEventData): d is BookTicker;
    function isKline(d: StreamEventData): d is Kline;
}
