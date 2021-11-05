import { StreamEventMap } from './types';
export interface TradeStreamOptions {
    sendMessageRetryTimeout?: number;
    proxy?: string;
}
export default class BinanceStream {
    private options;
    constructor(options?: TradeStreamOptions);
    private readonly _listeners;
    private messageId;
    private get nextMessageId();
    private socket;
    private recv;
    private send;
    private _subscribe;
    private _unsubscribe;
    subscribe<K extends keyof StreamEventMap, E = (e: Parameters<StreamEventMap[K]>[0]) => void>(type: K, symbol: string, cb: E): {
        cancel: () => void;
    };
}
