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
import fetch from 'cross-fetch';
import { HttpsProxyAgent } from 'https-proxy-agent';
import QueryString from 'qs';
const API = 'https://api.binance.com';
export default class Api {
    options;
    constructor(options = {}) {
        this.options = options;
    }
    get agentOptions() {
        const { proxy } = this.options;
        if (!proxy) {
            return {};
        }
        return { agent: new HttpsProxyAgent(proxy) };
    }
    request({ url, method = 'GET', headers, query, }) {
        if (url.startsWith('/')) {
            url = `${this.options.api ?? API}${url}`;
        }
        const qs = typeof query === 'string'
            ? query.startsWith('?')
                ? query
                : `?${query}`
            : QueryString.stringify(query, { addQueryPrefix: true });
        return fetch(`${url}${qs}`, {
            method,
            headers,
            ...this.agentOptions,
        }).then(res => res.json());
    }
    /**
     * 获取服务器时间
     */
    time() {
        return this.request({ url: '/api/v3/time' });
    }
    /**
     * 获取 K 线数据
     */
    klines(query) {
        return this.request({ url: '/api/v3/klines', query });
    }
    /**
     * 获取近期成交列表
     */
    trades(query) {
        return this.request({ url: '/api/v3/trades', query });
    }
    /**
     * 获取近期成交列表（归集）
     */
    aggTrades(query) {
        return this.request({ url: '/api/v3/aggTrades', query });
    }
    /**
     * 获取历史成交
     *
     * 该接口需要设置 apiKey
     */
    historicalTrades(query) {
        if (!this.options.apiKey) {
            throw new Error('This api require apiKey set');
        }
        return this.request({
            url: '/api/v3/historicalTrades',
            query,
            headers: { 'X-MBX-APIKEY': this.options.apiKey },
        });
    }
    userDataStreamListenKeyUrl(args) {
        return isIsolatedMargin(args)
            ? '/sapi/v1/userDataStream/isolated'
            : isMargin(args)
                ? '/sapi/v1/userDataStream'
                : '/api/v3/userDataStream';
    }
    createUserDataStream(args) {
        if (!this.options.apiKey) {
            throw new Error('This api require apiKey set');
        }
        return this.request({
            method: 'POST',
            url: this.userDataStreamListenKeyUrl(args),
            query: isIsolatedMargin(args) ? { symbol: args.symbol } : {},
            headers: { 'X-MBX-APIKEY': this.options.apiKey },
        });
    }
    updateUserDataStream(args) {
        if (!this.options.apiKey) {
            throw new Error('This api require apiKey set');
        }
        return this.request({
            method: 'PUT',
            url: this.userDataStreamListenKeyUrl(args),
            query: isIsolatedMargin(args)
                ? { symbol: args.symbol, listenKey: args.listenKey }
                : { listenKey: args.listenKey },
            headers: { 'X-MBX-APIKEY': this.options.apiKey },
        });
    }
    deleteUserDataStream(args) {
        if (!this.options.apiKey) {
            throw new Error('This api require apiKey set');
        }
        return this.request({
            method: 'DELETE',
            url: this.userDataStreamListenKeyUrl(args),
            query: isIsolatedMargin(args)
                ? { symbol: args.symbol, listenKey: args.listenKey }
                : { listenKey: args.listenKey },
            headers: { 'X-MBX-APIKEY': this.options.apiKey },
        });
    }
}
function isMargin(v) {
    return v?.margin === true;
}
function isIsolatedMargin(v) {
    return typeof v?.symbol === 'string' && v.isolated === true && v.margin === true;
}
