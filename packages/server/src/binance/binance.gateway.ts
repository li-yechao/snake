import { Inject } from '@nestjs/common'
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets'
import { KlineInterval, KlineItem, TradeStreamEvents } from '@snake/binance'
import { Server, Socket } from 'socket.io'
import { BinanceService } from './binance.service'

@WebSocketGateway({ cors: true })
export class BinanceGateway {
  constructor() {
    setTimeout(() => this.init())
  }

  @Inject()
  binanceService!: BinanceService

  @WebSocketServer()
  server!: Server<
    {},
    {
      stream: <T extends keyof TradeStreamEvents>(
        stream: T,
        data: Parameters<TradeStreamEvents[T]>[0]
      ) => void
    },
    {
      subscribe: (payload: (keyof TradeStreamEvents)[]) => void
      unsubscribe: (payload: (keyof TradeStreamEvents)[]) => void
      klines: (
        payload: {
          symbol: string
          interval: KlineInterval
          startTime?: number
          endTime?: number
          /**
           * 默认 500，最大 1000
           */
          limit?: number
        },
        cb?: (res: KlineItem[]) => void
      ) => void
    }
  >

  @SubscribeMessage('subscribe')
  async subscribe(
    @ConnectedSocket() socket: Socket,
    @MessageBody() streams: (keyof TradeStreamEvents)[]
  ) {
    await socket.join(streams)
  }

  @SubscribeMessage('unsubscribe')
  async unsubscribe(
    @ConnectedSocket() socket: Socket,
    @MessageBody() streams: (keyof TradeStreamEvents)[]
  ) {
    for (const stream of streams) {
      await socket.leave(stream)
    }
  }

  @SubscribeMessage('klines')
  async klines(
    @MessageBody()
    payload: {
      symbol: string
      interval: KlineInterval
      startTime?: number
      endTime?: number
      /**
       * 默认 500，最大 1000
       */
      limit?: number
    }
  ): Promise<KlineItem[]> {
    return this.binanceService.api.klines(payload)
  }

  private subscribers: Map<
    keyof TradeStreamEvents,
    (data: Parameters<TradeStreamEvents[keyof TradeStreamEvents]>[0]) => void
  > = new Map()

  private init() {
    this.server.sockets.adapter
      .on('create-room', (room: string) => {
        if (room.match(/^(?<symbol>[a-zA-Z0-9]+)@(?<type>[a-zA-Z0-9_]+)$/)) {
          const ev = room as keyof TradeStreamEvents
          if (this.subscribers.has(ev)) {
            return
          }

          const cb = (data: Parameters<TradeStreamEvents[typeof ev]>[0]) => {
            this.server.in(room).emit('stream', ev, data)
          }
          this.subscribers.set(ev, cb)
          this.binanceService.tradeStream.on(ev, cb)
        }
      })
      .on('delete-room', (room: string) => {
        if (room.match(/^(?<symbol>[a-zA-Z0-9]+)@(?<type>[a-zA-Z0-9_]+)$/)) {
          const ev = room as keyof TradeStreamEvents
          const cb = this.subscribers.get(ev)
          if (cb) {
            this.subscribers.delete(ev)
            this.binanceService.tradeStream.off(ev, cb)
          }
        }
      })
  }
}
