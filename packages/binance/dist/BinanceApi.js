"use strict";
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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var cross_fetch_1 = __importDefault(require("cross-fetch"));
var https_proxy_agent_1 = require("https-proxy-agent");
var qs_1 = __importDefault(require("qs"));
var API = 'https://api.binance.com';
var BinanceApi = /** @class */ (function () {
    function BinanceApi(options) {
        if (options === void 0) { options = {}; }
        this.options = options;
    }
    Object.defineProperty(BinanceApi.prototype, "agentOptions", {
        get: function () {
            var proxy = this.options.proxy;
            if (!proxy) {
                return {};
            }
            return { agent: new https_proxy_agent_1.HttpsProxyAgent(proxy) };
        },
        enumerable: false,
        configurable: true
    });
    BinanceApi.prototype.request = function (_a) {
        var _b;
        var url = _a.url, _c = _a.method, method = _c === void 0 ? 'GET' : _c, headers = _a.headers, query = _a.query;
        if (url.startsWith('/api')) {
            url = "" + ((_b = this.options.api) !== null && _b !== void 0 ? _b : API) + url;
        }
        return (0, cross_fetch_1.default)(url + "?" + qs_1.default.stringify(query), __assign({ method: method, headers: headers }, this.agentOptions)).then(function (res) { return res.json(); });
    };
    /**
     * 获取服务器时间
     */
    BinanceApi.prototype.time = function () {
        return this.request({ url: '/api/v3/time' });
    };
    /**
     * 获取 K 线数据
     */
    BinanceApi.prototype.klines = function (query) {
        return this.request({ url: '/api/v3/klines', query: query });
    };
    /**
     * 获取近期成交列表
     */
    BinanceApi.prototype.trades = function (query) {
        return this.request({ url: '/api/v3/trades', query: query });
    };
    /**
     * 获取近期成交列表（归集）
     */
    BinanceApi.prototype.aggTrades = function (query) {
        return this.request({ url: '/api/v3/aggTrades', query: query });
    };
    /**
     * 获取历史成交
     *
     * 该接口需要设置 apiKey
     */
    BinanceApi.prototype.historicalTrades = function (query) {
        if (!this.options.apiKey) {
            throw new Error('This api require apiKey set');
        }
        return this.request({
            url: '/api/v3/historicalTrades',
            query: query,
            headers: {
                'X-MBX-APIKEY': this.options.apiKey,
            },
        });
    };
    return BinanceApi;
}());
exports.default = BinanceApi;
