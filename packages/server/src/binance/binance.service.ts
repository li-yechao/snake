import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { BinanceApi, BinanceStream } from '@snake/binance'

@Injectable()
export class BinanceService {
  constructor(private configService: ConfigService) {
    const proxy = this.configService.get<string>('proxy')
    this.api = new BinanceApi({ proxy })
    this.stream = new BinanceStream({ proxy })
  }

  readonly api: BinanceApi

  readonly stream: BinanceStream
}
