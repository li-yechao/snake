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

import * as React from 'react'
import NetworkIndicator from '../NetworkIndicator'

export default function LazyView<P>(C: React.LazyExoticComponent<React.ComponentType<P>>) {
  return (props: P) => {
    return (
      <React.Suspense fallback={<Loading />}>
        <C {...(props as any)} />
      </React.Suspense>
    )
  }
}

const Loading = () => {
  return <NetworkIndicator in />
}
