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

export interface KlineItem {
  /**
   * 这根 K 线的起始时间
   */
  t: number

  /**
   * 这根 K 线的结束时间
   */
  T: number

  /**
   * 这根 K 线期间第一笔成交价
   */
  o: string

  /**
   * 这根 K 线期间末一笔成交价
   */
  c: string

  /**
   * 这根 K 线期间最高成交价
   */
  h: string

  /**
   * 这根 K 线期间最低成交价
   */
  l: string

  /**
   * 这根 K 线期间成交量
   */
  v: string

  /**
   * 这根 K 线期间成交额
   */
  q: string
}
