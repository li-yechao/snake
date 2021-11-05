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
import { useEffect, useRef } from 'react'
import { useState } from 'react'
import useKline, { UseKlineRendererOptions } from './useKline'

export interface KlineRendererProps extends UseKlineRendererOptions {}

const KlineRenderer = (props: KlineRendererProps) => {
  const containerRef = useRef<HTMLDivElement>(null)

  const { svg } = useKline(props)

  useEffect(() => {
    containerRef.current?.appendChild(svg.node()!)
  }, [])

  return <div ref={containerRef} />
}

function withSize<P extends { width: number; height: number }>(C: React.ComponentType<P>) {
  return (props: Omit<P, 'width' | 'height'>) => {
    const ref = useRef<HTMLDivElement>(null)
    const [size, setSize] = useState<{ width: number; height: number }>()

    useEffect(() => {
      const observer = new ResizeObserver(([entry]) => {
        if (entry) {
          const { width, height } = entry.contentRect
          setSize({ width, height })
        }
      })

      ref.current && observer.observe(ref.current)

      return () => observer.disconnect()
    }, [])

    return (
      <_SizeBox ref={ref}>
        {size && <C {...(props as any)} width={size.width} height={size.height} />}
      </_SizeBox>
    )
  }
}

const _SizeBox = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
`

export default withSize(KlineRenderer)
