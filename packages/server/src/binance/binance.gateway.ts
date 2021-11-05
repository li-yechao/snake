import { Inject } from '@nestjs/common'
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets'
import { KlineInterval, KlineItem, StreamEventData, StreamEventType } from '@snake/binance'
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
    {
      subscribe: (payload: { type: StreamEventType; symbol: string }) => void
      unsubscribe: (payload: { type: StreamEventType; symbol: string }) => void
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
    },
    {
      stream: (data: StreamEventData) => void
    }
  >

  @SubscribeMessage('subscribe')
  async subscribe(
    @ConnectedSocket() socket: Socket,
    @MessageBody() { type, symbol }: { type: StreamEventType; symbol: string }
  ) {
    await socket.join(`${symbol}@${type}`)
  }

  @SubscribeMessage('unsubscribe')
  async unsubscribe(
    @ConnectedSocket() socket: Socket,
    @MessageBody() { type, symbol }: { type: StreamEventType; symbol: string }
  ) {
    await socket.leave(`${symbol}@${type}`)
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

  private subscribers: Map<string, () => void> = new Map()

  private init() {
    this.server.sockets.adapter
      .on('create-room', (room: string) => {
        const m = room.match(/^(?<symbol>[a-zA-Z0-9]+)@(?<type>[a-zA-Z0-9_]+)$/)
        if (m) {
          const { symbol, type } = m.groups!
          const { cancel } = this.binanceService.stream.subscribe(
            type as StreamEventType,
            symbol,
            data => {
              this.server.in(room).emit('stream', data)
            }
          )
          this.subscribers.set(room, cancel)
        }
      })
      .on('delete-room', (room: string) => {
        this.subscribers.get(room)?.()
        this.subscribers.delete(room)
      })
  }
}
