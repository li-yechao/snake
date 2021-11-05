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

export interface RenderKlineOptions {
  group: d3.Selection<SVGGElement, any, any, any>
  transform: d3.ZoomTransform
  data: KlineItem[]
  startIndex: number
  endIndex: number
  barWidth: number
  xScale: d3.ScaleLinear<number, number>
  yScale: d3.ScaleLinear<number, number>
  riseColor: string
  unchangedColor: string
  fallColor: string
}

export default function renderKline({
  group,
  transform,
  data,
  startIndex,
  endIndex,
  barWidth,
  xScale,
  yScale,
  riseColor,
  unchangedColor,
  fallColor,
}: RenderKlineOptions) {
  const list = data.slice(startIndex, endIndex)

  const _barWidth = barWidth * transform.k
  const lineWidth = _barWidth / 5
  const barPadding = lineWidth / 2
  const rectWidth = _barWidth - barPadding * 2

  const gBars = group
    .selectAll('g.bar')
    .data(list)
    .join(
      enter => {
        const g = enter.append('g').attr('class', 'bar')
        g.append('rect').attr('class', 'bar')
        g.append('rect').attr('class', 'line')
        return g
      },
      undefined,
      exit => exit.remove()
    )
    .attr('transform', (d, i) => {
      const _tx = xScale(i + startIndex) * transform.k + transform.x - _barWidth / 2
      const _ty = yScale(Number(d.h))
      return `translate(${_tx}, ${_ty})`
    })

  gBars
    .select('rect.bar')
    .attr('width', rectWidth)
    .attr('height', d => Math.max(Math.abs(yScale(Number(d.c)) - yScale(Number(d.o))), 1))
    .attr(
      'transform',
      d =>
        `translate(${barPadding}, ${Math.abs(
          yScale(Number(d.h)) - yScale(Math.max(Number(d.o), Number(d.c)))
        )})`
    )
    .attr('fill', d => (d.o > d.c ? fallColor : d.o === d.c ? unchangedColor : riseColor))

  gBars
    .select('rect.line')
    .attr('width', lineWidth)
    .attr('height', d => Math.abs(yScale(Number(d.h)) - yScale(Number(d.l))))
    .attr('transform', `translate(${(_barWidth - lineWidth) / 2}, 0)`)
    .attr('fill', d => (d.o > d.c ? fallColor : d.o === d.c ? unchangedColor : riseColor))
}
