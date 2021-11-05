import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { BinanceModule } from './binance/binance.module'
import { Config } from './config'

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [() => Config.shared],
    }),
    BinanceModule,
  ],
})
export class AppModule {}
