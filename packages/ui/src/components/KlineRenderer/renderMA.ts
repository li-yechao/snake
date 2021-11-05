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

export interface MA {
  times: number
  color: string
}

export interface RenderMAOptions {
  ma: MA[]
  group: d3.Selection<SVGGElement, any, any, any>
  transform: d3.ZoomTransform
  data: KlineItem[]
  startIndex: number
  endIndex: number
  xScale: d3.ScaleLinear<number, number>
  yScale: d3.ScaleLinear<number, number>
}

export default function renderMA({
  ma,
  group,
  transform,
  data,
  startIndex,
  endIndex,
  xScale,
  yScale,
}: RenderMAOptions) {
  const list = ma.map(i => ({
    ...i,
    data: computeMA(data, i.times, startIndex, endIndex),
  }))

  group
    .selectAll('path.ma')
    .data(list)
    .join(
      enter => enter.append('path').attr('class', 'ma'),
      undefined,
      exit => exit.remove()
    )
    .attr('d', d =>
      d3
        .line<number | null>(
          (_, i) => xScale(i + startIndex) * transform.k + transform.x,
          v => (v ? yScale(v) : 0)
        )
        .defined(v => typeof v === 'number')(d.data)
    )
    .style('stroke-width', 1)
    .style('stroke', d => d.color)
    .style('fill', 'none')

  group
    .selectAll('text.ma-legend')
    .data([null])
    .join(
      e => e.append('text').attr('class', 'ma-legend').attr('transform', 'translate(10,20)'),
      undefined,
      exit => exit.remove()
    )
    .selectAll('tspan')
    .data(list)
    .join(
      enter => enter.append('tspan'),
      undefined,
      exit => exit.remove()
    )
    .text(d => {
      const v = d.data[d.data.length - 1]?.toFixed(2) ?? '--'
      return `MA${d.times}: ${v}    `
    })
    .attr('fill', d => d.color)
}

const computeMA = (data: KlineItem[], t: number, s?: number, e?: number) => {
  const ma: (number | null)[] = []

  for (let i = s ?? 0; i < (e ?? data.length); i++) {
    if (i < t - 1) {
      ma.push(null)
      continue
    }

    let amount = 0
    for (let j = i - t + 1; j <= i; j++) {
      amount += Number(data[j]!.c)
    }
    ma.push(amount / t)
  }

  return ma
}
