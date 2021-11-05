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
import * as dayjs from 'dayjs'
import { useEffect, useMemo, useRef } from 'react'
import renderKline from './renderKline'
import renderMA, { MA } from './renderMA'
import renderMACD, { RenderMACDOptions } from './renderMACD'
import { KlineItem } from './type'
import useSvg from './useSvg'

const DEFAULT_MACD_HEIGHT = 50
const DEFAULT_BAR_WIDTH = 10
const DEFAULT_X_AXIS_HEIGHT = 30
const DEFAULT_Y_AXIS_WIDTH = 60
const DEFAULT_VERTICAL_MARGIN = 4
const DEFAULT_HORIZONTAL_PADDING = 100
const DEFAULT_RISE_COLOR = '#25ca83'
const DEFAULT_UNCHANGED_COLOR = '#7f8895'
const DEFAULT_FALL_COLOR = '#f34860'
const DEFAULT_SCALE = 1

export interface UseKlineRendererOptions {
  data: KlineItem[]
  width: number
  height: number
  barWidth?: number
  xAxisHeight?: number
  yAxisWidth?: number
  verticalMargin?: number
  horizontalPadding?: number
  riseColor?: string
  unchangedColor?: string
  fallColor?: string
  scale?: number
  ma?: MA[]
  macd?: Pick<RenderMACDOptions, 'deaColor' | 'diffColor'> & { height?: number }
  postRender?: (
    eles: ReturnType<typeof useSvg> & {
      xScale: d3.ScaleLinear<number, number>
      yScale: d3.ScaleLinear<number, number>
    }
  ) => void
}

const useKline = ({
  data,
  width,
  height,
  barWidth = DEFAULT_BAR_WIDTH,
  xAxisHeight = DEFAULT_X_AXIS_HEIGHT,
  yAxisWidth = DEFAULT_Y_AXIS_WIDTH,
  verticalMargin = DEFAULT_VERTICAL_MARGIN,
  horizontalPadding = DEFAULT_HORIZONTAL_PADDING,
  riseColor = DEFAULT_RISE_COLOR,
  unchangedColor = DEFAULT_UNCHANGED_COLOR,
  fallColor = DEFAULT_FALL_COLOR,
  scale = DEFAULT_SCALE,
  ma,
  macd,
  postRender,
}: UseKlineRendererOptions) => {
  const macdHeight = macd ? macd.height ?? DEFAULT_MACD_HEIGHT : 0

  const dataRef = useRef(data)
  dataRef.current = data

  const { svg, xGroup, yGroup, klineGroup, maGroup, macdGroup } = useSvg({
    verticalMargin,
    width,
    height,
    xAxisHeight,
    yAxisWidth,
    macdHeight,
  })

  const { xScale, xAxis } = useXAxis({
    group: xGroup,
    dataCount: data.length,
    width,
    yAxisWidth,
    barWidth,
    horizontalPadding,
  })

  xAxis.tickFormat(v => {
    const i = dataRef.current[v.valueOf()]
    if (!i) {
      return '--'
    }
    return dayjs(i.t).format('MM-DD/HH:mm')
  })

  const render = () => {
    requestAnimationFrame(() => {
      const transform = d3.zoomTransform(svg.node()!)

      const startIndex = Math.max(Math.ceil(xScale.invert(-transform.x / transform.k)), 0)
      const count = Math.floor(width / transform.k / barWidth)
      const endIndex = Math.min(startIndex + count, dataRef.current.length)
      const list = dataRef.current.slice(startIndex, endIndex)

      const { yScale } = renderYAxis({
        group: yGroup,
        min: Number(d3.min(list, i => i.l)) || 0,
        max: Number(d3.max(list, i => i.h)) || 0,
        height,
        xAxisHeight,
        macdHeight,
        verticalMargin,
      })

      renderKline({
        group: klineGroup,
        transform,
        data: dataRef.current,
        startIndex,
        endIndex,
        barWidth,
        xScale,
        yScale,
        riseColor,
        unchangedColor,
        fallColor,
      })

      if (ma) {
        renderMA({
          ma,
          group: maGroup,
          transform,
          data: dataRef.current,
          startIndex,
          endIndex,
          xScale,
          yScale,
        })
      }

      if (macd && macdGroup) {
        renderMACD({
          ...macd,
          height: macdHeight,
          group: macdGroup,
          transform,
          data: dataRef.current,
          startIndex,
          endIndex,
          barWidth,
          xScale,
          riseColor,
          fallColor,
          verticalMargin,
        })
      }

      postRender?.({ svg, xGroup, yGroup, klineGroup, maGroup, macdGroup, xScale, yScale })
    })
  }

  useZoom({
    selection: svg,
    xScale,
    xGroup,
    xAxis,
    horizontalPadding,
    yAxisWidth,
    scale,
    render,
  })

  useEffect(() => {
    render()
  }, [data, postRender])

  return { svg }
}

export default useKline

function useXAxis({
  group,
  dataCount,
  width,
  yAxisWidth,
  barWidth,
  horizontalPadding,
}: {
  group: d3.Selection<SVGGElement, any, any, any>
  dataCount: number
  width: number
  yAxisWidth: number
  barWidth: number
  horizontalPadding: number
}) {
  return useMemo(() => {
    const klineGroupWidth = width - yAxisWidth
    const minWidth = Math.max(dataCount * barWidth + horizontalPadding * 2, klineGroupWidth)
    const leftX = -(minWidth - klineGroupWidth)
    const rightX = klineGroupWidth

    const xScale = d3.scaleLinear().domain([0, dataCount]).range([leftX, rightX])
    const xAxis = d3.axisBottom(xScale)
    group.call(xAxis)

    return { xScale, xAxis }
  }, [group, width, yAxisWidth, dataCount, barWidth, horizontalPadding])
}

function renderYAxis({
  group,
  min,
  max,
  height,
  xAxisHeight,
  macdHeight,
  verticalMargin,
}: {
  group: d3.Selection<SVGGElement, any, any, any>
  min: number
  max: number
  height: number
  xAxisHeight: number
  macdHeight: number
  verticalMargin: number
}) {
  const klineGroupHeight = height - xAxisHeight - macdHeight - verticalMargin * 2
  const yScale = d3.scaleLinear().domain([min, max]).range([klineGroupHeight, 0]).nice()

  const yAxis = d3.axisRight(yScale)

  group.call(yAxis)

  return { yScale, yAxis }
}

function useZoom({
  selection,
  xScale,
  xGroup,
  xAxis,
  horizontalPadding,
  yAxisWidth,
  scale,
  render,
}: {
  selection: d3.Selection<any, any, any, any>
  xScale: d3.ScaleLinear<number, number>
  xGroup: d3.Selection<SVGGElement, any, any, any>
  xAxis: d3.Axis<d3.NumberValue>
  horizontalPadding: number
  yAxisWidth: number
  scale: number
  render?: () => void
}) {
  const transformRef = useRef<d3.ZoomTransform>()

  const zoom = useMemo(() => {
    const [leftX = 0, rightX = 0] = xScale.range()
    const zoom = d3
      .zoom<SVGElement, unknown>()
      .scaleExtent([0.2, 10])
      .translateExtent([
        [leftX - horizontalPadding / scale, 0],
        [rightX + (horizontalPadding + yAxisWidth) / scale, 0],
      ])
      .on('zoom', ({ transform }: { transform: d3.ZoomTransform }) => {
        if (transformRef.current?.k !== transform.k) {
          zoom.translateExtent([
            [leftX - horizontalPadding / transform.k, 0],
            [rightX + (horizontalPadding + yAxisWidth) / transform.k, 0],
          ])
        }

        transformRef.current = transform
        xGroup.call(xAxis.scale(transform.rescaleX(xScale)))
        render?.()
      })

    selection
      .call(zoom)
      .call(
        zoom.transform,
        transformRef.current ??
          d3.zoomIdentity.translate(rightX - rightX * scale - horizontalPadding, 0).scale(scale)
      )

    return zoom
  }, [selection, xScale, xGroup, xAxis, horizontalPadding, horizontalPadding, yAxisWidth])

  useEffect(() => {
    zoom.translateBy(selection, 0.1, 0)
  }, [xScale])

  useEffect(() => {
    zoom.scaleTo(selection, scale)
  }, [scale])
}
