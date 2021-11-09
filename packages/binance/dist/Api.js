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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var cross_fetch_1 = __importDefault(require("cross-fetch"));
var https_proxy_agent_1 = require("https-proxy-agent");
var qs_1 = __importDefault(require("qs"));
var API = 'https://api.binance.com';
var Api = /** @class */ (function () {
    function Api(options) {
        if (options === void 0) { options = {}; }
        this.options = options;
    }
    Object.defineProperty(Api.prototype, "agentOptions", {
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
    Api.prototype.request = function (_a) {
        var _b;
        var url = _a.url, _c = _a.method, method = _c === void 0 ? 'GET' : _c, headers = _a.headers, query = _a.query;
        if (url.startsWith('/')) {
            url = "" + ((_b = this.options.api) !== null && _b !== void 0 ? _b : API) + url;
        }
        var qs = typeof query === 'string'
            ? query.startsWith('?')
                ? query
                : "?" + query
            : qs_1.default.stringify(query, { addQueryPrefix: true });
        return (0, cross_fetch_1.default)("" + url + qs, __assign({ method: method, headers: headers }, this.agentOptions)).then(function (res) { return res.json(); });
    };
    Api.prototype.signRequest = function (_a) {
        var method = _a.method, url = _a.url, query = _a.query;
        return __awaiter(this, void 0, void 0, function () {
            var timestamp, qs, signature;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!this.options.apiSecret || !this.options.apiKey) {
                            throw new Error("Required options apiSecret is not present");
                        }
                        query = removeEmptyValue(query);
                        timestamp = Date.now();
                        qs = buildQueryString(__assign(__assign({}, query), { timestamp: timestamp }));
                        return [4 /*yield*/, hmac(qs, this.options.apiSecret)];
                    case 1:
                        signature = _b.sent();
                        return [2 /*return*/, this.request({
                                url: url,
                                method: method,
                                headers: {
                                    'X-MBX-APIKEY': this.options.apiKey,
                                },
                                query: qs + "&signature=" + signature,
                            })];
                }
            });
        });
    };
    /**
     * 获取服务器时间
     */
    Api.prototype.time = function () {
        return this.request({ url: '/api/v3/time' });
    };
    /**
     * 获取 K 线数据
     */
    Api.prototype.klines = function (query) {
        return this.request({ url: '/api/v3/klines', query: query });
    };
    /**
     * 获取近期成交列表
     */
    Api.prototype.trades = function (query) {
        return this.request({ url: '/api/v3/trades', query: query });
    };
    /**
     * 获取近期成交列表（归集）
     */
    Api.prototype.aggTrades = function (query) {
        return this.request({ url: '/api/v3/aggTrades', query: query });
    };
    /**
     * 获取历史成交
     *
     * 该接口需要设置 apiKey
     */
    Api.prototype.historicalTrades = function (query) {
        if (!this.options.apiKey) {
            throw new Error('This api require apiKey set');
        }
        return this.request({
            url: '/api/v3/historicalTrades',
            query: query,
            headers: { 'X-MBX-APIKEY': this.options.apiKey },
        });
    };
    Api.prototype.userDataStreamListenKeyUrl = function (args) {
        return isIsolatedMargin(args)
            ? '/sapi/v1/userDataStream/isolated'
            : isMargin(args)
                ? '/sapi/v1/userDataStream'
                : '/api/v3/userDataStream';
    };
    Api.prototype.createUserDataStream = function (args) {
        if (!this.options.apiKey) {
            throw new Error('This api require apiKey set');
        }
        return this.request({
            method: 'POST',
            url: this.userDataStreamListenKeyUrl(args),
            query: isIsolatedMargin(args) ? { symbol: args.symbol } : {},
            headers: { 'X-MBX-APIKEY': this.options.apiKey },
        });
    };
    Api.prototype.updateUserDataStream = function (args) {
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
    };
    Api.prototype.deleteUserDataStream = function (args) {
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
    };
    /**
     * 查询杠杆逐仓账户信息 (USER_DATA)
     *
     * 不传 symbols 返回所有杠杆逐仓资产
     */
    Api.prototype.isolatedMarginAccount = function (_a) {
        var _b = _a === void 0 ? {} : _a, symbols = _b.symbols, _c = _b.recvWindow, recvWindow = _c === void 0 ? 6000 : _c;
        return this.signRequest({
            method: 'GET',
            url: '/sapi/v1/margin/isolated/account',
            query: { symbols: (symbols === null || symbols === void 0 ? void 0 : symbols.join(',')) || undefined, recvWindow: recvWindow },
        });
    };
    return Api;
}());
exports.default = Api;
var removeEmptyValue = function (obj) {
    if (!(obj instanceof Object))
        return {};
    Object.keys(obj).forEach(function (key) { return isEmptyValue(obj[key]) && delete obj[key]; });
    return obj;
};
var isEmptyValue = function (input) {
    /**
     * Scope of empty value: falsy value (except for false and 0),
     * string with white space characters only, empty object, empty array
     */
    return ((!input && input !== false && input !== 0) ||
        ((typeof input === 'string' || input instanceof String) && /^\s+$/.test(input.toString())) ||
        (input instanceof Object && !Object.keys(input).length) ||
        (Array.isArray(input) && !input.length));
};
var buildQueryString = function (params) {
    if (!params)
        return '';
    return Object.entries(params).map(stringifyKeyValuePair).join('&');
};
/**
 * NOTE: The array conversion logic is different from usual query string.
 * E.g. symbols=["BTCUSDT","BNBBTC"] instead of symbols[]=BTCUSDT&symbols[]=BNBBTC
 */
var stringifyKeyValuePair = function (_a) {
    var key = _a[0], value = _a[1];
    var valueString = Array.isArray(value) ? "[\"" + value.join('","') + "\"]" : value;
    return key + "=" + encodeURIComponent(valueString);
};
function isMargin(v) {
    return (v === null || v === void 0 ? void 0 : v.margin) === true;
}
function isIsolatedMargin(v) {
    return typeof (v === null || v === void 0 ? void 0 : v.symbol) === 'string' && v.isolated === true && v.margin === true;
}
function hmac(data, key) {
    return __awaiter(this, void 0, void 0, function () {
        var subtle, k, buffer;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    subtle = typeof window !== 'undefined' ? crypto.subtle : require('crypto').webcrypto.subtle;
                    return [4 /*yield*/, subtle.importKey('raw', new TextEncoder().encode(key), {
                            name: 'HMAC',
                            hash: { name: 'SHA-256' },
                        }, false, ['sign', 'verify'])];
                case 1:
                    k = _a.sent();
                    return [4 /*yield*/, subtle.sign('HMAC', k, new TextEncoder().encode(data))];
                case 2:
                    buffer = _a.sent();
                    return [2 /*return*/, Array.prototype.map
                            .call(new Uint8Array(buffer), function (x) { return x.toString(16).padStart(2, '0'); })
                            .join('')];
            }
        });
    });
}
