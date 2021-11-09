import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Api, Kline, KlineInterval, TradeStream } from '@snake/binance'
import Decimal from 'decimal.js'

@Injectable()
export class BinanceService {
  constructor(private configService: ConfigService) {
    const proxy = this.configService.get<string>('proxy')
    this.api = new Api({ proxy })
    this.tradeStream = new TradeStream({ proxy })
    test(this.api, this.tradeStream)
  }

  readonly api: Api

  readonly tradeStream: TradeStream
}

async function test(api: Api, tradeStream: TradeStream) {
  const grid = new Grid()
  ;(grid as any).api = api
  ;(grid as any).tradeStream = tradeStream
  await grid.init()
}

export abstract class Strategy {
  private api!: Api

  private tradeStream!: TradeStream

  abstract init(): Promise<void> | void

  abstract update(k: Kline): Promise<void> | void

  get klines() {
    return this.api.klines.bind(this.api)
  }

  subscribe(symbol: string, interval: KlineInterval) {
    this.tradeStream.on(`${symbol.toLowerCase()}@kline_${interval}`, k => this.update(k))
  }
}

export class Grid extends Strategy {
  private symbol = 'BTCUSDT'

  private center!: Decimal

  private grid = 0

  // private volume = 0.001

  private gap!: Decimal

  async init() {
    const klines = await this.klines({
      symbol: this.symbol,
      interval: '1m',
      limit: 1,
    })
    if (!klines.length) {
      throw new Error(`Got empty klines`)
    }
    const last = klines[klines.length - 1]
    this.center = new Decimal(last[4])
    this.gap = this.center.mul(0.001)
    this.subscribe(this.symbol, '1m')
  }

  async update(k: Kline) {
    const currentPrice = new Decimal(k.k.c)
    const newGrid = currentPrice.sub(this.center).divToInt(this.gap).toNumber()
    if (newGrid === this.grid) {
      return
    }
    this.grid = newGrid
    console.log(newGrid)
  }
}
