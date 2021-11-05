import { AggTradeItem, HistoricalTradeItem, KlineInterval, KlineItem, TradeItem } from './types';
export interface BinanceApiOptions {
    api?: string;
    apiKey?: string;
    proxy?: string;
}
export default class BinanceApi {
    private options;
    constructor(options?: BinanceApiOptions);
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
}
