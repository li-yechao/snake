// Copyright 2021 LiYechao
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
import { HttpsProxyAgent } from 'https-proxy-agent';
import { WebSocket } from 'ws';
import { StrictEventEmitter } from './StrictEventEmitter';
export default class UserDataStream extends StrictEventEmitter {
    constructor(options) {
        super();
        this.ws = new WebSocket(`wss://stream.binance.com/stream?streams=${options.listenKey}`, {
            agent: options.proxy ? new HttpsProxyAgent(options.proxy) : undefined,
        });
        this.ws.onmessage = e => {
            const json = JSON.parse(e.data.toString());
            switch (json.e) {
                case 'outboundAccountPosition':
                    this.emitReserved('outboundAccountPosition', json);
                    break;
                case 'balanceUpdate':
                    this.emitReserved('balanceUpdate', json);
                    break;
                case 'executionReport':
                    this.emitReserved('executionReport', json);
                    break;
                default:
                    console.warn('Unknown user data stream event', json);
                    break;
            }
        };
        this.ws.onerror = e => {
            console.error('error', e);
        };
        this.ws.onclose = e => {
            console.log('close', e.code, e.reason);
        };
        this.ws.on('ping', () => {
            this.ws.pong();
        });
    }
    ws;
}
