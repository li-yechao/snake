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

import styled from '@emotion/styled'
import { Box } from '@mui/material'
import { KlineInterval, KlineItem, TradeStreamEvents } from '@snake/binance'
import produce from 'immer'
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import { Route, Routes, useParams } from 'react-router-dom'
import { useUpdate } from 'react-use'
import { io, Socket } from 'socket.io-client'
import KlineRenderer from '../../components/KlineRenderer'
import NetworkIndicator from '../../components/NetworkIndicator'
import { SnakeSocketGateway } from '../../constants'
import useAsync from '../../utils/useAsync'

export default function TradeView() {
  return (
    <Routes>
      <Route path=":symbol" element={<_TradeView />} />
    </Routes>
  )
}

function _TradeView() {
  const symbol = useParams<'symbol'>().symbol?.toUpperCase()
  if (!symbol) {
    throw new Error(`Required params symbol is not present`)
  }

  const socket = useMemo(() => {
    const s: Socket<
      {
        stream: <T extends keyof TradeStreamEvents, D = Parameters<TradeStreamEvents[T]>[0]>(
          stream: T,
          data: D
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
    > = io(SnakeSocketGateway)

    return s
  }, [])

  const klines = useAsync(async () => {
    const list = await new Promise<KlineItem[]>(resolve => {
      socket.emit('klines', { symbol, interval: '1m' }, resolve)
    })
    return list.map(i => ({
      t: i[0],
      T: i[6],
      o: i[1],
      c: i[4],
      h: i[2],
      l: i[3],
      v: i[5],
      q: i[7],
    }))
  }, [symbol, socket])

  if (klines.error) {
    throw klines.error
  }

  const data = useRef<NonNullable<typeof klines['value']>>([])
  const update = useUpdate()
  const setData = useCallback((d: typeof data.current) => {
    data.current = d
    update()
  }, [])

  useLayoutEffect(() => {
    setData(klines.value ?? [])
  }, [klines.value])

  useEffect(() => {
    const stream = `${symbol.toLowerCase()}@kline_1m` as const
    socket.emit('subscribe', [stream])

    socket.on('stream', (s, n) => {
      if (s === stream) {
        const d = n as unknown as Parameters<TradeStreamEvents[typeof stream]>[0]
        window.document.title = `${symbol} ${d.k.c}`

        if (!data.current.length) {
          return
        }

        setData(
          produce(data.current, draft => {
            const last = draft[data.current.length - 1]

            if (last.t === d.k.t) {
              last.o = d.k.o
              last.c = d.k.c
              last.h = d.k.h
              last.l = d.k.l
              last.v = d.k.v
              last.q = d.k.q
            } else if (last.T + 1 === d.k.t) {
              draft.push({
                t: d.k.t,
                T: d.k.T,
                o: d.k.o,
                c: d.k.c,
                h: d.k.h,
                l: d.k.l,
                v: d.k.v,
                q: d.k.q,
              })
            } else {
              throw new Error('Invalid last kline item')
            }
          })
        )
      }
    })
  }, [socket])

  if (klines.loading) {
    return <NetworkIndicator in />
  }

  return (
    <_Container>
      <KlineRenderer
        data={data.current}
        riseColor="grey"
        fallColor="#aaa"
        ma={[
          { times: 7, color: '#ac7338' },
          { times: 25, color: '#9636a0' },
          { times: 99, color: '#5db9ba' },
        ]}
        macd={{
          deaColor: '#9636a0',
          diffColor: '#ac7338',
        }}
        scale={0.4}
      />
    </_Container>
  )
}

const _Container = styled(Box)`
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  width: 80%;
  height: 80%;
  margin: auto;
`
