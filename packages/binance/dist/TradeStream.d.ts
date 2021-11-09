import { ReservedOrUserEventNames, ReservedOrUserListener, StrictEventEmitter } from './StrictEventEmitter';
import { TradeStreamEvents } from './types';
export interface TradeStreamOptions {
    sendMessageRetryTimeout?: number;
    proxy?: string;
}
export default class TradeStream extends StrictEventEmitter<TradeStreamEvents, {}, TradeStreamEvents> {
    private options;
    constructor(options?: TradeStreamOptions);
    on<Ev extends ReservedOrUserEventNames<TradeStreamEvents, TradeStreamEvents>>(ev: Ev, listener: ReservedOrUserListener<TradeStreamEvents, TradeStreamEvents, Ev>): this;
    off<Ev extends ReservedOrUserEventNames<TradeStreamEvents, TradeStreamEvents>>(ev: Ev, listener: ReservedOrUserListener<TradeStreamEvents, TradeStreamEvents, Ev>): this;
    private ensureSubscrbes;
    private messageId;
    private get nextMessageId();
    private ws;
    private recv;
    private send;
}
