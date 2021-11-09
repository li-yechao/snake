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
import WebSocket from 'isomorphic-ws';
import { StrictEventEmitter, } from './StrictEventEmitter';
const MAX_MESSAGE_ID = 1 << 16;
const SEND_MESSAGE_RETRY_TIMEOUT = 300;
export default class TradeStream extends StrictEventEmitter {
    options;
    constructor(options = {}) {
        super();
        this.options = options;
        this.ws = new WebSocket('wss://stream.binance.com/stream', {
            agent: options.proxy ? new HttpsProxyAgent(options.proxy) : undefined,
        });
        this.ws.onmessage = e => {
            this.recv(e.data.toString());
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
    on(ev, listener) {
        super.on(ev, listener);
        this.ensureSubscrbes(ev);
        return this;
    }
    off(ev, listener) {
        super.off(ev, listener);
        this.ensureSubscrbes(ev);
        return this;
    }
    ensureSubscrbes(ev) {
        if (this.listeners(ev).length) {
            this.send({ method: 'SUBSCRIBE', params: [ev] });
        }
        else {
            this.send({ method: 'UNSUBSCRIBE', params: [ev] });
        }
    }
    messageId = 0;
    get nextMessageId() {
        this.messageId = (this.messageId + 1) % MAX_MESSAGE_ID;
        return this.messageId;
    }
    ws;
    recv(s) {
        const m = JSON.parse(s);
        // Error
        if (m.error) {
            console.error(new Error(m.error.msg));
            return;
        }
        // 请求成功的响应数据
        if (m.result === null) {
            return;
        }
        this.emitReserved(m.stream, m.data);
    }
    async send(message) {
        while (true) {
            try {
                this.ws.send(JSON.stringify({ ...message, id: this.nextMessageId }));
                return;
            }
            catch (error) {
                await new Promise(resolve => setTimeout(resolve, this.options.sendMessageRetryTimeout || SEND_MESSAGE_RETRY_TIMEOUT));
            }
        }
    }
}
