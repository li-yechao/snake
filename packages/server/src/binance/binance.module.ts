import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { BinanceGateway } from './binance.gateway'
import { BinanceService } from './binance.service'

@Module({
  imports: [ConfigModule],
  providers: [BinanceGateway, BinanceService],
})
export class BinanceModule {}
