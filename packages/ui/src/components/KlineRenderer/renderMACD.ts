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
import { KlineItem } from './type'

export interface MACD {
  ema12: number
  ema26: number
  diff: number
  dea: number
  bar: number
}

export interface RenderMACDOptions {
  height: number
  group: d3.Selection<SVGGElement, any, any, any>
  transform: d3.ZoomTransform
  data: KlineItem[]
  startIndex: number
  endIndex: number
  barWidth: number
  xScale: d3.ScaleLinear<number, number>
  riseColor: string
  fallColor: string
  deaColor: string
  diffColor: string
  verticalMargin: number
}

export default function renderMACD({
  height,
  group,
  transform,
  data,
  startIndex,
  endIndex,
  barWidth,
  xScale,
  riseColor,
  fallColor,
  deaColor,
  diffColor,
  verticalMargin,
}: RenderMACDOptions) {
  const _barWidth = barWidth * transform.k
  const barPadding = _barWidth / 10
  const rectWidth = _barWidth - barPadding * 2
  const halfHeight = height / 2

  const macd = computeMACD(data, startIndex, endIndex)

  const barScale = d3
    .scaleLinear()
    .domain([
      Number(d3.min(macd, d => (d ? Math.abs(d.bar) : 0))) || 0,
      Number(d3.max(macd, d => (d ? Math.abs(d.bar) : 0))) || 0,
    ])
    .range([0, halfHeight - verticalMargin])

  const lineScale = d3
    .scaleLinear()
    .domain([
      Number(d3.max(macd, d => (d ? Math.max(d.dea, d.diff) : 0))) || 0,
      Number(d3.min(macd, d => (d ? Math.min(d.dea, d.diff) : 0))) || 0,
    ])
    .range([verticalMargin, height - verticalMargin])

  const barGroup = group
    .selectAll('g.bar')
    .data([null])
    .join(enter => enter.append('g').attr('class', 'bar'))
  const lineGroup = group
    .selectAll('g.line')
    .data([null])
    .join(enter => enter.append('g').attr('class', 'line'))

  lineGroup
    .selectAll('path.diff')
    .data([macd])
    .join(
      enter => enter.append('path').attr('class', 'diff'),
      undefined,
      exit => exit.remove()
    )
    .attr('d', d =>
      d3
        .line<MACD | null>(
          (_, i) => xScale(i + startIndex) * transform.k + transform.x,
          v => (v ? lineScale(v.diff) : 0)
        )
        .defined(v => !!v)(d)
    )
    .style('stroke-width', 1)
    .style('stroke', diffColor)
    .style('fill', 'none')

  lineGroup
    .selectAll('path.dea')
    .data([macd])
    .join(
      enter => enter.append('path').attr('class', 'dea'),
      undefined,
      exit => exit.remove()
    )
    .attr('d', d =>
      d3
        .line<MACD | null>(
          (_, i) => xScale(i + startIndex) * transform.k + transform.x,
          v => (v ? lineScale(v.dea) : 0)
        )
        .defined(v => !!v)(d)
    )
    .style('stroke-width', 1)
    .style('stroke', deaColor)
    .style('fill', 'none')

  barGroup
    .selectAll('rect.bar')
    .data(macd)
    .join(
      enter => enter.append('rect').attr('class', 'bar'),
      undefined,
      exit => exit.remove()
    )
    .attr('width', rectWidth)
    .attr('height', d => (d ? barScale(Math.abs(d.bar)) : 0))
    .attr('transform', (d, i) => {
      const _tx = xScale(i + startIndex) * transform.k + transform.x - _barWidth / 2
      const _ty = d ? (d.bar > 0 ? halfHeight - barScale(d.bar) : halfHeight) : 0
      return `translate(${_tx}, ${_ty})`
    })
    .attr('fill', d => (d && d.bar > 0 ? riseColor : fallColor))

  const last = macd[macd.length - 1]
  group
    .selectAll('text.macd-legend')
    .data([null])
    .join(
      e => e.append('text').attr('class', 'macd-legend').attr('transform', 'translate(10,12)'),
      undefined,
      exit => exit.remove()
    )
    .selectAll('tspan')
    .data([
      { text: 'MACD(12,26,9)    ', color: '#fff' },
      { text: `DIFF(${last?.diff.toFixed(2) || '--'})    `, color: diffColor },
      { text: `DEA(${last?.dea.toFixed(2) || '--'})    `, color: deaColor },
      {
        text: `MACD(${last?.bar.toFixed(2) || '--'})    `,
        color: last && last?.bar > 0 ? riseColor : fallColor,
      },
    ])
    .join(
      enter => enter.append('tspan'),
      undefined,
      exit => exit.remove()
    )
    .text(d => d.text)
    .attr('fill', d => d.color)
    .style('font-size', 10)
}

const computeMACD = (data: KlineItem[], s?: number, e?: number) => {
  const macd: (MACD | null)[] = []

  let previous: MACD | undefined = undefined

  for (let i = s ?? 0; i < (e ?? data.length); i++) {
    if (i < 1) {
      macd.push(null)
      continue
    }

    const c = data[i]!
    const p = data[i - 1]!

    const ema12 = ((previous?.ema12 ?? Number(p.c)) * 11 + Number(c.c) * 2) / 13
    const ema26 = ((previous?.ema26 ?? Number(p.c)) * 25 + Number(c.c) * 2) / 27
    const diff = ema12 - ema26
    const dea = ((previous?.dea ?? 0) * 8 + diff * 2) / 10

    const current: MACD = {
      ema12,
      ema26,
      diff,
      dea,
      bar: 2 * (diff - dea),
    }

    macd.push(current)
    previous = current
  }

  return macd
}
