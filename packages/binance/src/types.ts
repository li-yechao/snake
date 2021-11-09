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

export interface AggTrade {
  /**
   * 事件类型
   */
  e: 'aggTrade'

  /**
   * 事件时间
   */
  E: number

  /**
   * 交易对
   */
  s: string

  /**
   * 归集交易 ID
   */
  a: number

  /**
   * 成交价格
   */
  p: string

  /**
   * 成交笔数
   */
  q: string

  /**
   * 被归集的首个交易 ID
   */
  f: number

  /**
   * 被归集的末次交易 ID
   */
  l: number

  /**
   * 成交时间
   */
  T: number

  /**
   * 买方是否是做市方
   * 如 true，则此次成交是一个主动卖出单，否则是一个主动买入单。
   */
  m: boolean
}

export interface Trade {
  /**
   * 事件类型
   */
  e: 'trade'

  /**
   * 事件时间
   */
  E: number

  /**
   * 交易对
   */
  s: string

  /**
   * 交易 ID
   */
  t: number

  /**
   * 成交价格
   */
  p: string

  /**
   * 成交笔数
   */
  q: string

  /**
   * 买方的订单 ID
   */
  b: number

  /**
   * 卖方的订单 ID
   */
  a: number

  /**
   * 成交时间
   */
  T: number

  /**
   * 买方是否是做市方
   * 如 true，则此次成交是一个主动卖出单，否则是一个主动买入单。
   */
  m: boolean
}

export interface Depth {
  /**
   * Last update ID
   */
  lastUpdateId: number

  /**
   * 买单深度
   */
  bids: [
    /**
     * 价格档位
     */
    string,
    /**
     * 数量
     */
    string
  ][]

  /**
   * 卖单深度
   */
  asks: [
    /**
     * 价格档位
     */
    string,
    /**
     * 数量
     */
    string
  ][]
}

export interface DepthUpdate {
  /**
   * 事件类型
   */
  e: 'depthUpdate'

  /**
   * 事件时间
   */
  E: number

  /**
   * 交易对
   */
  s: string

  /**
   * 从上次推送至今新增的第一个 update Id
   */
  U: number

  /**
   * 从上次推送至今新增的最后一个 update Id
   */
  u: 160

  /**
   * 变动的买单深度
   */
  b: [
    /**
     * 变动的价格档位
     */
    string,

    /**
     * 数量
     */
    string
  ][]

  /**
   * 变动的卖单深度
   */
  a: [
    /**
     * 变动的价格档位
     */
    string,

    /**
     * 数量
     */
    string
  ][]
}

export interface Ticker {
  /**
   * 事件类型
   */
  e: '24hrTicker'

  /**
   * 事件时间
   */
  E: number

  /**
   * 交易对
   */
  s: string

  /**
   * 24 小时价格变化
   */
  p: string

  /**
   * 24 小时价格变化(百分比)
   */
  P: string

  /**
   * 平均价格
   */
  w: string

  /**
   * 整整 24 小时之前，向前数的最后一次成交价格
   */
  x: string

  /**
   * 最新成交价格
   */
  c: string

  /**
   * 最新成交交易的成交量
   */
  Q: string

  /**
   * 目前最高买单价
   */
  b: string

  /**
   * 目前最高买单价的挂单量
   */
  B: string

  /**
   * 目前最低卖单价
   */
  a: string

  /**
   * 目前最低卖单价的挂单量
   */
  A: string

  /**
   * 整整 24 小时前，向后数的第一次成交价格
   */
  o: string

  /**
   * 24 小时内最高成交价
   */
  h: string

  /**
   * 24 小时内最低成交价
   */
  l: string

  /**
   * 24 小时内成交量
   */
  v: string

  /**
   * 24 小时内成交额
   */
  q: string

  /**
   * 统计开始时间
   */
  O: number

  /**
   * 统计结束时间
   */
  C: number

  /**
   * 24 小时内第一笔成交交易 ID
   */
  F: number

  /**
   * 24 小时内最后一笔成交交易 ID
   */
  L: number

  /**
   * 24 小时内成交数
   */
  n: number
}

export interface MiniTicker {
  /**
   * 事件类型
   */
  e: '24hrMiniTicker'

  /**
   * 事件时间
   */
  E: number

  /**
   * 交易对
   */
  s: string

  /**
   * 最新成交价格
   */
  c: string

  /**
   * 24 小时前开始第一笔成交价格
   */
  o: string

  /**
   * 24 小时内最高成交价
   */
  h: string

  /**
   * 24 小时内最低成交价
   */
  l: string

  /**
   * 成交量
   */
  v: string

  /**
   * 成交额
   */
  q: string
}

export interface BookTicker {
  /**
   * order book updateId
   */
  u: number

  /**
   * 交易对
   */
  s: string

  /**
   * 买单最优挂单价格
   */
  b: string

  /**
   * 买单最优挂单数量
   */
  B: string

  /**
   * 卖单最优挂单价格
   */
  a: string

  /**
   * 卖单最优挂单数量
   */
  A: string
}

export type KlineInterval =
  | '1m'
  | '3m'
  | '5m'
  | '15m'
  | '30m'
  | '1h'
  | '2h'
  | '4h'
  | '6h'
  | '8h'
  | '12h'
  | '1d'
  | '3d'
  | '1w'
  | '1M'

export interface Kline {
  /**
   * 事件类型
   */
  e: 'kline'

  /**
   * 事件时间
   */
  E: number

  /**
   * 交易对
   */
  s: string

  /**
   * 最新一根 K 线的更新
   */
  k: {
    /**
     * 这根 K 线的起始时间
     */
    t: number

    /**
     * 这根 K 线的结束时间
     */
    T: number

    /**
     * 交易对
     */
    s: string

    /**
     * K 线间隔
     */
    i: KlineInterval

    /**
     * 这根 K 线期间第一笔成交 ID
     */
    f: number

    /**
     * 这根 K 线期间末一笔成交 ID
     */
    L: number

    /**
     * 这根 K 线期间第一笔成交价
     */
    o: string

    /**
     * 这根 K 线期间末一笔成交价
     */
    c: string

    /**
     * 这根 K 线期间最高成交价
     */
    h: string

    /**
     * 这根 K 线期间最低成交价
     */
    l: string

    /**
     * 这根 K 线期间成交量
     */
    v: string

    /**
     * 这根 K 线期间成交笔数
     */
    n: number

    /**
     * 这根 K 线是否完结(是否已经开始下一根 K 线)
     */
    x: boolean

    /**
     * 这根 K 线期间成交额
     */
    q: string

    /**
     * 主动买入的成交量
     */
    V: string

    /**
     * 主动买入的成交额
     */
    Q: string
  }
}

export interface TradeItem {
  id: number
  price: string
  qty: string
  time: number
  isBuyerMaker: boolean
  isBestMatch: boolean
}

export interface AggTradeItem {
  /**
   * 归集成交 ID
   */
  a: number

  /**
   * 成交价
   */
  p: string

  /**
   * 成交量
   */
  q: string

  /**
   * 被归集的首个成交 ID
   */
  f: number

  /**
   * 被归集的末个成交 ID
   */
  l: number

  /**
   *
   */
  T: number // 成交时间

  /**
   * 是否为主动卖出单
   */
  m: boolean

  /**
   * 是否为最优撮合单(可忽略，目前总为最优撮合)
   */
  M: boolean
}

export interface HistoricalTradeItem {
  id: number
  price: string
  qty: string
  quoteQty: string
  time: number
  isBuyerMaker: boolean
  isBestMatch: boolean
}

export type KlineItem = Array<any> & {
  /**
   * 开盘时间
   */
  0: number

  /**
   * 开盘价
   */
  1: string

  /**
   * 最高价
   */
  2: string

  /**
   * 最低价
   */
  3: string

  /**
   * 收盘价(当前 K 线未结束的即为最新价)
   */
  4: string

  /**
   * 成交量
   */
  5: string

  /**
   * 收盘时间
   */
  6: number

  /**
   * 成交额
   */
  7: string

  /**
   * 成交笔数
   */
  8: number

  /**
   * 主动买入成交量
   */
  9: string

  /**
   * 主动买入成交额
   */
  10: string
}

type TradeStreamEventMap = {
  trade: (e: Trade) => void
  aggTrade: (e: AggTrade) => void
  depth: (e: DepthUpdate) => void
  depth5: (e: Depth) => void
  depth10: (e: Depth) => void
  depth20: (e: Depth) => void
  ticker: (e: Ticker) => void
  miniTicker: (e: MiniTicker) => void
  bookTicker: (e: BookTicker) => void
  kline_1m: (e: Kline) => void
  kline_3m: (e: Kline) => void
  kline_5m: (e: Kline) => void
  kline_15m: (e: Kline) => void
  kline_30m: (e: Kline) => void
  kline_1h: (e: Kline) => void
  kline_2h: (e: Kline) => void
  kline_4h: (e: Kline) => void
  kline_6h: (e: Kline) => void
  kline_8h: (e: Kline) => void
  kline_12h: (e: Kline) => void
  kline_1d: (e: Kline) => void
  kline_3d: (e: Kline) => void
  kline_1w: (e: Kline) => void
  kline_1M: (e: Kline) => void
}

export type TradeStreamEvents = {
  [K in keyof TradeStreamEventMap as `${string}@${K}`]: TradeStreamEventMap[K]
}

/**
 * 订单类型
 * https://www.binance.com/cn/support/articles/360033779452-Types-of-Order
 *
 * LIMIT: 限价单
 * MARKET: 市价单
 * STOP_LOSS: 止损单
 * STOP_LOSS_LIMIT: 限价止损单
 * TAKE_PROFIT: 止盈单
 * TAKE_PROFIT_LIMIT: 限价止盈单
 * LIMIT_MAKER: 限价只挂单
 */
export type OrderType =
  | 'LIMIT'
  | 'MARKET'
  | 'STOP_LOSS'
  | 'STOP_LOSS_LIMIT'
  | 'TAKE_PROFIT'
  | 'TAKE_PROFIT_LIMIT'
  | 'LIMIT_MAKER'

/**
 * 订单方向
 */
export type OrderSide = 'BUY' | 'SELL'

/**
 * 有效方式
 *
 * GTC: 成交为止。订单会一直有效，直到被成交或者取消。
 * IOC: 无法立即成交的部分就撤销。订单在失效前会尽量多的成交。
 * FOK: 无法全部立即成交就撤销。如果无法全部成交，订单会失效。
 */
export type TimeInForce = 'GTC' | 'IOC' | 'FOK'

/**
 * 订单执行类型
 *
 * NEW: 新订单
 * CANCELED: 订单被取消
 * REPLACED: (保留字段，当前未使用)
 * REJECTED: 新订单被拒绝
 * TRADE: 订单有新成交
 * EXPIRED: 订单失效(根据订单的Time In Force参数)
 */
export type ExecutionType = 'NEW' | 'CANCELED' | 'REPLACED' | 'REJECTED' | 'TRADE' | 'EXPIRED'

/**
 * 订单状态
 *
 * NEW: 订单被交易引擎接受
 * PARTIALLY_FILLED: 部分订单被成交
 * FILLED: 订单完全成交
 * CANCELED: 用户撤销了订单
 * PENDING_CANCEL: 撤销中(目前并未使用)
 * REJECTED: 订单没有被交易引擎接受，也没被处理
 * EXPIRED: 订单被交易引擎取消, 比如 LIMIT FOK 订单没有成交、市价单没有完全成交、强平期间被取消的订单、交易所维护期间被取消的订单
 */
export type OrderStatus =
  | 'NEW'
  | 'PARTIALLY_FILLED'
  | 'FILLED'
  | 'CANCELED'
  | 'PENDING_CANCEL'
  | 'REJECTED'
  | 'EXPIRED'

/**
 * 账户更新事件
 */
export interface OutboundAccountPositionEvent {
  /**
   * 事件类型
   */
  e: 'outboundAccountPosition'

  /**
   * 事件时间
   */
  E: number

  /**
   * 账户末次更新时间戳
   */
  u: number

  /**
   * 余额
   */
  B: [
    {
      /**
       * 资产名称
       */
      a: string

      /**
       * 可用余额
       */
      f: string

      /**
       * 冻结余额
       */
      l: string
    }
  ]
}

/**
 * 余额更新事件
 */
export interface BalanceUpdateEvent {
  /**
   * 余额更新事件
   */
  e: 'balanceUpdate'

  /**
   * 事件时间
   */
  E: number

  /**
   * 资产名称
   */
  a: string

  /**
   * 变动值
   * +100 或 -100
   */
  d: string

  /**
   * Clear Time
   */
  T: number
}

/**
 * 订单更新事件
 */
export interface ExecutionReportEvent {
  /**
   * 事件类型
   */
  e: 'executionReport'

  /**
   * 事件时间
   */
  E: number

  /**
   * 交易对
   */
  s: string

  /**
   * 自定义订单 ID
   */
  c: string

  /**
   * 订单方向
   */
  S: OrderSide

  /**
   * 订单类型
   */
  o: OrderType

  /**
   * 有效方式
   */
  f: TimeInForce

  /**
   * 订单原始数量
   */
  q: string

  /**
   * 订单原始价格
   */
  p: string

  /**
   * 止盈止损单触发价格
   */
  P: string

  /**
   * 冰山订单数量
   */
  F: string

  /**
   * OCO 订单 OrderListId
   */
  g: number

  /**
   * 原始订单自定义 ID (原始订单，指撤单操作的对象。撤单本身被视为另一个订单)
   */
  C: string

  /**
   * 本次事件的具体执行类型
   */
  x: ExecutionType

  /**
   * 订单的当前状态
   */
  X: OrderStatus

  /**
   * 订单被拒绝的原因
   */
  r: string

  /**
   * 订单 ID
   */
  i: number

  /**
   * 订单末次成交量
   */
  l: string

  /**
   * 订单累计已成交量
   */
  z: string

  /**
   * 订单末次成交价格
   */
  L: string

  /**
   * 手续费数量
   */
  n: string

  /**
   * 手续费资产类别
   */
  N: null

  /**
   * 成交时间
   */
  T: number

  /**
   * 成交 ID
   */
  t: number

  /**
   * 订单是否在订单簿上？
   */
  w: boolean

  /**
   * 该成交是作为挂单成交吗？
   */
  m: boolean

  /**
   * 订单创建时间
   */
  O: number

  /**
   * 订单累计已成交金额
   */
  Z: string

  /**
   * 订单末次成交金额
   */
  Y: string

  /**
   * Quote Order Qty
   */
  Q: string
}
