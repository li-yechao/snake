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
    async signRequest({ method, url, query, }) {
        if (!this.options.apiSecret || !this.options.apiKey) {
            throw new Error(`Required options apiSecret is not present`);
        }
        query = removeEmptyValue(query);
        const timestamp = Date.now();
        const qs = buildQueryString({ ...query, timestamp });
        const signature = await hmac(qs, this.options.apiSecret);
        return this.request({
            url,
            method,
            headers: {
                'X-MBX-APIKEY': this.options.apiKey,
            },
            query: `${qs}&signature=${signature}`,
        });
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
    /**
     * 查询杠杆逐仓账户信息 (USER_DATA)
     *
     * 不传 symbols 返回所有杠杆逐仓资产
     */
    isolatedMarginAccount({ symbols, recvWindow = 6000, } = {}) {
        return this.signRequest({
            method: 'GET',
            url: '/sapi/v1/margin/isolated/account',
            query: { symbols: symbols?.join(',') || undefined, recvWindow },
        });
    }
}
const removeEmptyValue = (obj) => {
    if (!(obj instanceof Object))
        return {};
    Object.keys(obj).forEach(key => isEmptyValue(obj[key]) && delete obj[key]);
    return obj;
};
const isEmptyValue = (input) => {
    /**
     * Scope of empty value: falsy value (except for false and 0),
     * string with white space characters only, empty object, empty array
     */
    return ((!input && input !== false && input !== 0) ||
        ((typeof input === 'string' || input instanceof String) && /^\s+$/.test(input.toString())) ||
        (input instanceof Object && !Object.keys(input).length) ||
        (Array.isArray(input) && !input.length));
};
const buildQueryString = (params) => {
    if (!params)
        return '';
    return Object.entries(params).map(stringifyKeyValuePair).join('&');
};
/**
 * NOTE: The array conversion logic is different from usual query string.
 * E.g. symbols=["BTCUSDT","BNBBTC"] instead of symbols[]=BTCUSDT&symbols[]=BNBBTC
 */
const stringifyKeyValuePair = ([key, value]) => {
    const valueString = Array.isArray(value) ? `["${value.join('","')}"]` : value;
    return `${key}=${encodeURIComponent(valueString)}`;
};
function isMargin(v) {
    return v?.margin === true;
}
function isIsolatedMargin(v) {
    return typeof v?.symbol === 'string' && v.isolated === true && v.margin === true;
}
async function hmac(data, key) {
    // 兼容 Browser 和 NodeJS
    const subtle = typeof window !== 'undefined' ? crypto.subtle : require('crypto').webcrypto.subtle;
    const k = await subtle.importKey('raw', new TextEncoder().encode(key), {
        name: 'HMAC',
        hash: { name: 'SHA-256' },
    }, false, ['sign', 'verify']);
    const buffer = await subtle.sign('HMAC', k, new TextEncoder().encode(data));
    return Array.prototype.map
        .call(new Uint8Array(buffer), (x) => x.toString(16).padStart(2, '0'))
        .join('');
}
