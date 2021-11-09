import { StrictEventEmitter } from './StrictEventEmitter';
import { BalanceUpdateEvent, ExecutionReportEvent, OutboundAccountPositionEvent } from './types';
interface UserDataStreamEvents {
    outboundAccountPosition: (e: OutboundAccountPositionEvent) => void;
    balanceUpdate: (e: BalanceUpdateEvent) => void;
    executionReport: (e: ExecutionReportEvent) => void;
}
export default class UserDataStream extends StrictEventEmitter<UserDataStreamEvents, {}, UserDataStreamEvents> {
    constructor(options: {
        listenKey: string;
        proxy?: string;
    });
    private ws;
}
export {};
