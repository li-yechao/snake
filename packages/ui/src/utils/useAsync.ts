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

import { DependencyList } from 'react'
import { useAsync } from 'react-use'
import { FunctionReturningPromise, PromiseType } from 'react-use/lib/misc/types'

export type AsyncState<T> =
  | {
      loading: true
      error?: Error | undefined
      value?: T
    }
  | {
      loading: false
      error: Error
      value?: undefined
    }
  | {
      loading: false
      error?: undefined
      value: T
    }

export default useAsync as <T extends FunctionReturningPromise>(
  fn: T,
  deps?: DependencyList
) => AsyncState<PromiseType<ReturnType<T>>>
