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

import fetch from 'cross-fetch'
import { HttpsProxyAgent } from 'https-proxy-agent'
import QueryString from 'qs'
import { AggTradeItem, HistoricalTradeItem, KlineInterval, KlineItem, TradeItem } from './types'

const API = 'https://api.binance.com'

export interface BinanceApiOptions {
  api?: string
  apiKey?: string
  proxy?: string
}

export default class BinanceApi {
  constructor(private options: BinanceApiOptions = {}) {}

  private get agentOptions(): RequestInit {
    const { proxy } = this.options

    if (!proxy) {
      return {}
    }

    return { agent: new HttpsProxyAgent(proxy) } as any
  }

  private request({
    url,
    method = 'GET',
    headers,
    query,
  }: {
    url: string
    method?: 'GET' | 'POST'
    headers?: HeadersInit
    query?: { [key: string]: string | number }
  }) {
    if (url.startsWith('/api')) {
      url = `${this.options.api ?? API}${url}`
    }

    return fetch(`${url}?${QueryString.stringify(query)}`, {
      method,
      headers,
      ...this.agentOptions,
    }).then(res => res.json())
  }

  /**
   * 获取服务器时间
   */
  time(): Promise<{ serverTime: number }> {
    return this.request({ url: '/api/v3/time' })
  }

  /**
   * 获取 K 线数据
   */
  klines(query: {
    symbol: string
    interval: KlineInterval
    startTime?: number
    endTime?: number
    /**
     * 默认 500，最大 1000
     */
    limit?: number
  }): Promise<KlineItem[]> {
    return this.request({ url: '/api/v3/klines', query })
  }

  /**
   * 获取近期成交列表
   */
  trades(query: {
    symbol: string

    /**
     * 默认 500，最大 1000
     */
    limit?: number
  }): Promise<TradeItem[]> {
    return this.request({ url: '/api/v3/trades', query })
  }

  /**
   * 获取近期成交列表（归集）
   */
  aggTrades(query: {
    symbol: string
    /**
     * 从包含 fromId 的成交 id 开始返回结果
     */
    fromId?: string
    startTime?: number
    endTime?: number
    /**
     * 默认 500，最大 1000
     */
    limit?: number
  }): Promise<AggTradeItem[]> {
    return this.request({ url: '/api/v3/aggTrades', query })
  }

  /**
   * 获取历史成交
   *
   * 该接口需要设置 apiKey
   */
  historicalTrades(query: {
    symbol: string
    /**
     * 默认 500，最大 1000
     */
    limit?: number
    /**
     * 从哪一条成交id开始返回. 缺省返回最近的成交记录
     */
    fromId?: number
  }): Promise<HistoricalTradeItem[]> {
    if (!this.options.apiKey) {
      throw new Error('This api require apiKey set')
    }

    return this.request({
      url: '/api/v3/historicalTrades',
      query,
      headers: {
        'X-MBX-APIKEY': this.options.apiKey,
      },
    })
  }
}
