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

import * as d3 from 'd3'
import { useEffect, useMemo } from 'react'

export default function useSvg({
  verticalMargin,
  width,
  height,
  xAxisHeight,
  yAxisWidth,
  macdHeight = 0,
}: {
  verticalMargin: number
  width: number
  height: number
  xAxisHeight: number
  yAxisWidth: number
  macdHeight?: number
}) {
  const svg = useMemo(() => {
    return d3
      .select(document.createElementNS('http://www.w3.org/2000/svg', 'svg'))
      .attr('width', width)
      .attr('height', height)
  }, [])

  useEffect(() => {
    e.svg.attr('width', width).attr('height', height)
  }, [width, height])

  const e = useMemo(() => {
    const klineGroupWidth = width - yAxisWidth
    const klineGroupHeight = height - xAxisHeight - macdHeight - verticalMargin * 2

    const xGroup = svg
      .selectAll<SVGGElement, unknown>('g.x-axis')
      .data([null])
      .join(enter => enter.append('g').attr('class', 'x-axis'))
      .attr('transform', `translate(0, ${height - xAxisHeight})`)

    const yGroup = svg
      .selectAll<SVGGElement, unknown>('g.y-axis')
      .data([null])
      .join(enter => enter.append('g').attr('class', 'y-axis'))
      .attr('transform', `translate(${width - yAxisWidth}, ${verticalMargin})`)

    const kGroup = svg
      .selectAll<SVGGElement, unknown>('g.k')
      .data([null])
      .join(enter => enter.append('g').attr('class', 'k'))
      .attr('clip-path', `url(#k-group-clip)`)

    kGroup
      .selectAll('clipPath#k-group-clip')
      .data([null])
      .join(enter => {
        const c = enter.append('clipPath').attr('id', 'k-group-clip')
        c.append('rect')
        return c
      })
      .select('rect')
      .attr('width', klineGroupWidth)
      .attr('height', klineGroupHeight)
      .attr('transform', `translate(0, ${verticalMargin})`)

    const klineGroup = kGroup
      .selectAll<SVGGElement, unknown>('g.kline')
      .data([null])
      .join(enter => enter.append('g').attr('class', 'kline'))
      .attr('transform', `translate(0, ${verticalMargin})`)

    const maGroup = kGroup
      .selectAll<SVGGElement, unknown>('g.ma')
      .data([null])
      .join(enter => enter.append('g').attr('class', 'ma'))
      .attr('transform', `translate(0, ${verticalMargin})`)

    const macdGroup =
      macdHeight > 0
        ? svg
            .selectAll<SVGGElement, unknown>('g.macd')
            .data([null])
            .join(enter => enter.append('g').attr('class', 'macd'))
            .attr('transform', `translate(0, ${height - xAxisHeight - macdHeight})`)
            .attr('clip-path', `url(#macd-group-clip)`)
        : null

    macdGroup
      ?.selectAll('clipPath#macd-group-clip')
      .data([null])
      .join(enter => {
        const c = enter.append('clipPath').attr('id', 'macd-group-clip')
        c.append('rect')
        return c
      })
      .select('rect')
      .attr('width', klineGroupWidth)
      .attr('height', macdHeight)

    return { svg, xGroup, yGroup, klineGroup, maGroup, macdGroup }
  }, [verticalMargin, width, height, xAxisHeight, yAxisWidth, macdHeight])

  return e
}
