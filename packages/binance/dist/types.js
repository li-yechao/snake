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
Object.defineProperty(exports, "__esModule", { value: true });
exports.StreamEventDataType = void 0;
var StreamEventDataType;
(function (StreamEventDataType) {
    function isTrade(d) {
        return d.e === 'trade';
    }
    StreamEventDataType.isTrade = isTrade;
    function isAggTrade(d) {
        return d.e === 'aggTrade';
    }
    StreamEventDataType.isAggTrade = isAggTrade;
    function isDepthUpdate(d) {
        return d.e === 'depthUpdate';
    }
    StreamEventDataType.isDepthUpdate = isDepthUpdate;
    function isDepth(d) {
        return typeof d.lastUpdateId === 'number';
    }
    StreamEventDataType.isDepth = isDepth;
    function isTicker(d) {
        return d.e === '24hrTicker';
    }
    StreamEventDataType.isTicker = isTicker;
    function isMiniTicker(d) {
        return d.e === '24hrMiniTicker';
    }
    StreamEventDataType.isMiniTicker = isMiniTicker;
    function isBokTicker(d) {
        return typeof d.u === 'number';
    }
    StreamEventDataType.isBokTicker = isBokTicker;
    function isKline(d) {
        return d.e === 'kline';
    }
    StreamEventDataType.isKline = isKline;
})(StreamEventDataType = exports.StreamEventDataType || (exports.StreamEventDataType = {}));
