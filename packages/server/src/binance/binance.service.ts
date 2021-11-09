import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Api, TradeStream } from '@snake/binance'

@Injectable()
export class BinanceService {
  constructor(private configService: ConfigService) {
    const proxy = this.configService.get<string>('proxy')
    this.api = new Api({ proxy })
    this.tradeStream = new TradeStream({ proxy })
  }

  readonly api: Api

  readonly tradeStream: TradeStream
}
