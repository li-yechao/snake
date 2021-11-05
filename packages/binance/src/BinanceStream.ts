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

import { HttpsProxyAgent } from 'https-proxy-agent'
import WebSocket from 'isomorphic-ws'
import { StreamEventMap, StreamEventType } from './types'

const MAX_MESSAGE_ID = 1 << 16
const SEND_MESSAGE_RETRY_TIMEOUT = 300

export interface TradeStreamOptions {
  sendMessageRetryTimeout?: number
  proxy?: string
}

export default class BinanceStream {
  constructor(private options: TradeStreamOptions = {}) {
    this.socket = new WebSocket('wss://stream.binance.com/stream', {
      agent: options.proxy ? new HttpsProxyAgent(options.proxy) : undefined,
    })

    this.socket.onmessage = e => {
      this.recv(e.data.toString())
    }

    this.socket.onerror = e => {
      console.error('error', e)
    }

    this.socket.onclose = e => {
      console.log('close', e.code, e.reason)
    }
  }

  private readonly _listeners: {
    [k in keyof StreamEventMap]?: Map<string, Set<(e: Parameters<StreamEventMap[k]>[0]) => void>>
  } = {}

  private messageId = 0
  private get nextMessageId() {
    this.messageId = (this.messageId + 1) % MAX_MESSAGE_ID
    return this.messageId
  }

  private socket: WebSocket

  private recv(s: string) {
    const m = JSON.parse(s)

    // Error
    if (m.error) {
      console.error(new Error(m.error.msg))
      return
    }

    // 请求成功的响应数据
    if (m.result === null) {
      return
    }

    const [symbol, type]: [string, StreamEventType] = m.stream.split('@')

    const set = this._listeners[type]?.get(symbol)
    if (set) {
      set.forEach(cb => cb(m.data))
      return
    }

    console.error('Invalid recv message', s)
  }

  private async send(message: { method: 'SUBSCRIBE' | 'UNSUBSCRIBE'; params: string[] }) {
    while (true) {
      try {
        this.socket.send(JSON.stringify({ ...message, id: this.nextMessageId }))
        return
      } catch (error) {
        await new Promise(resolve =>
          setTimeout(resolve, this.options.sendMessageRetryTimeout || SEND_MESSAGE_RETRY_TIMEOUT)
        )
      }
    }
  }

  private _subscribe(type: keyof StreamEventMap, symbol: string) {
    this.send({ method: 'SUBSCRIBE', params: [`${symbol}@${type}`] })
  }

  private _unsubscribe(type: keyof StreamEventMap, symbol: string) {
    this.send({ method: 'UNSUBSCRIBE', params: [`${symbol}@${type}`] })
  }

  subscribe<K extends keyof StreamEventMap, E = (e: Parameters<StreamEventMap[K]>[0]) => void>(
    type: K,
    symbol: string,
    cb: E
  ) {
    symbol = symbol.toLowerCase()

    let map = this._listeners[type]
    if (!map) {
      map = new Map()
      this._listeners[type] = map
    }

    const set: Set<any> = map.get(symbol) ?? new Set()
    if (!map.has(symbol)) {
      map.set(symbol, set)
    }

    if (set.size === 0) {
      this._subscribe(type, symbol)
    }

    set.add(cb)

    return {
      cancel: () => {
        if (set?.delete(cb) && set.size === 0) {
          this._unsubscribe(type, symbol)
        }
      },
    }
  }
}
