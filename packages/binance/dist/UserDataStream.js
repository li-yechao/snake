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
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var https_proxy_agent_1 = require("https-proxy-agent");
var ws_1 = require("ws");
var StrictEventEmitter_1 = require("./StrictEventEmitter");
var UserDataStream = /** @class */ (function (_super) {
    __extends(UserDataStream, _super);
    function UserDataStream(options) {
        var _this = _super.call(this) || this;
        _this.ws = new ws_1.WebSocket("wss://stream.binance.com/stream?streams=" + options.listenKey, {
            agent: options.proxy ? new https_proxy_agent_1.HttpsProxyAgent(options.proxy) : undefined,
        });
        _this.ws.onmessage = function (e) {
            var json = JSON.parse(e.data.toString());
            switch (json.e) {
                case 'outboundAccountPosition':
                    _this.emitReserved('outboundAccountPosition', json);
                    break;
                case 'balanceUpdate':
                    _this.emitReserved('balanceUpdate', json);
                    break;
                case 'executionReport':
                    _this.emitReserved('executionReport', json);
                    break;
                default:
                    console.warn('Unknown user data stream event', json);
                    break;
            }
        };
        _this.ws.onerror = function (e) {
            console.error('error', e);
        };
        _this.ws.onclose = function (e) {
            console.log('close', e.code, e.reason);
        };
        _this.ws.on('ping', function () {
            _this.ws.pong();
        });
        return _this;
    }
    return UserDataStream;
}(StrictEventEmitter_1.StrictEventEmitter));
exports.default = UserDataStream;
