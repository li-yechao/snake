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
var https_proxy_agent_1 = require("https-proxy-agent");
var isomorphic_ws_1 = __importDefault(require("isomorphic-ws"));
var MAX_MESSAGE_ID = 1 << 16;
var SEND_MESSAGE_RETRY_TIMEOUT = 300;
var BinanceStream = /** @class */ (function () {
    function BinanceStream(options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        this.options = options;
        this._listeners = {};
        this.messageId = 0;
        this.socket = new isomorphic_ws_1.default('wss://stream.binance.com/stream', {
            agent: options.proxy ? new https_proxy_agent_1.HttpsProxyAgent(options.proxy) : undefined,
        });
        this.socket.onmessage = function (e) {
            _this.recv(e.data.toString());
        };
        this.socket.onerror = function (e) {
            console.error('error', e);
        };
        this.socket.onclose = function (e) {
            console.log('close', e.code, e.reason);
        };
    }
    Object.defineProperty(BinanceStream.prototype, "nextMessageId", {
        get: function () {
            this.messageId = (this.messageId + 1) % MAX_MESSAGE_ID;
            return this.messageId;
        },
        enumerable: false,
        configurable: true
    });
    BinanceStream.prototype.recv = function (s) {
        var _a;
        var m = JSON.parse(s);
        // Error
        if (m.error) {
            console.error(new Error(m.error.msg));
            return;
        }
        // 请求成功的响应数据
        if (m.result === null) {
            return;
        }
        var _b = m.stream.split('@'), symbol = _b[0], type = _b[1];
        var set = (_a = this._listeners[type]) === null || _a === void 0 ? void 0 : _a.get(symbol);
        if (set) {
            set.forEach(function (cb) { return cb(m.data); });
            return;
        }
        console.error('Invalid recv message', s);
    };
    BinanceStream.prototype.send = function (message) {
        return __awaiter(this, void 0, void 0, function () {
            var error_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!true) return [3 /*break*/, 5];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 2, , 4]);
                        this.socket.send(JSON.stringify(__assign(__assign({}, message), { id: this.nextMessageId })));
                        return [2 /*return*/];
                    case 2:
                        error_1 = _a.sent();
                        return [4 /*yield*/, new Promise(function (resolve) {
                                return setTimeout(resolve, _this.options.sendMessageRetryTimeout || SEND_MESSAGE_RETRY_TIMEOUT);
                            })];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 4: return [3 /*break*/, 0];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    BinanceStream.prototype._subscribe = function (type, symbol) {
        this.send({ method: 'SUBSCRIBE', params: [symbol + "@" + type] });
    };
    BinanceStream.prototype._unsubscribe = function (type, symbol) {
        this.send({ method: 'UNSUBSCRIBE', params: [symbol + "@" + type] });
    };
    BinanceStream.prototype.subscribe = function (type, symbol, cb) {
        var _this = this;
        var _a;
        symbol = symbol.toLowerCase();
        var map = this._listeners[type];
        if (!map) {
            map = new Map();
            this._listeners[type] = map;
        }
        var set = (_a = map.get(symbol)) !== null && _a !== void 0 ? _a : new Set();
        if (!map.has(symbol)) {
            map.set(symbol, set);
        }
        if (set.size === 0) {
            this._subscribe(type, symbol);
        }
        set.add(cb);
        return {
            cancel: function () {
                if ((set === null || set === void 0 ? void 0 : set.delete(cb)) && set.size === 0) {
                    _this._unsubscribe(type, symbol);
                }
            },
        };
    };
    return BinanceStream;
}());
exports.default = BinanceStream;
