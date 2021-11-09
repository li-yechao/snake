import { AggTradeItem, HistoricalTradeItem, KlineInterval, KlineItem, TradeItem } from './types';
export interface ApiOptions {
    api?: string;
    apiKey?: string;
    apiSecret?: string;
    proxy?: string;
}
export default class Api {
    private options;
    constructor(options?: ApiOptions);
    private get agentOptions();
    private request;
    /**
     * 获取服务器时间
     */
    time(): Promise<{
        serverTime: number;
    }>;
    /**
     * 获取 K 线数据
     */
    klines(query: {
        symbol: string;
        interval: KlineInterval;
        startTime?: number;
        endTime?: number;
        /**
         * 默认 500，最大 1000
         */
        limit?: number;
    }): Promise<KlineItem[]>;
    /**
     * 获取近期成交列表
     */
    trades(query: {
        symbol: string;
        /**
         * 默认 500，最大 1000
         */
        limit?: number;
    }): Promise<TradeItem[]>;
    /**
     * 获取近期成交列表（归集）
     */
    aggTrades(query: {
        symbol: string;
        /**
         * 从包含 fromId 的成交 id 开始返回结果
         */
        fromId?: string;
        startTime?: number;
        endTime?: number;
        /**
         * 默认 500，最大 1000
         */
        limit?: number;
    }): Promise<AggTradeItem[]>;
    /**
     * 获取历史成交
     *
     * 该接口需要设置 apiKey
     */
    historicalTrades(query: {
        symbol: string;
        /**
         * 默认 500，最大 1000
         */
        limit?: number;
        /**
         * 从哪一条成交id开始返回. 缺省返回最近的成交记录
         */
        fromId?: number;
    }): Promise<HistoricalTradeItem[]>;
    private userDataStreamListenKeyUrl;
    createUserDataStream(args?: {
        symbol?: undefined;
        margin?: undefined;
        isolated?: undefined;
    } | {
        symbol?: undefined;
        margin: true;
        isolated?: undefined;
    } | {
        symbol: string;
        margin: true;
        isolated: true;
    }): Promise<{
        listenKey: string;
    }>;
    updateUserDataStream(args: {
        symbol?: undefined;
        listenKey: string;
        margin?: undefined;
        isolated?: undefined;
    } | {
        symbol?: undefined;
        listenKey: string;
        margin: true;
        isolated?: undefined;
    } | {
        symbol: string;
        listenKey: string;
        margin: true;
        isolated: true;
    }): Promise<{}>;
    deleteUserDataStream(args: {
        symbol?: undefined;
        listenKey: string;
        margin?: undefined;
        isolated?: undefined;
    } | {
        symbol?: undefined;
        listenKey: string;
        margin: true;
        isolated?: undefined;
    } | {
        symbol: string;
        listenKey: string;
        margin: true;
        isolated: true;
    }): Promise<{}>;
}
