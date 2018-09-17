<h1 align=center>IoT Shared Platform</h1>
<p align=center>IoT 공유 플랫폼</p>



## Overview
>나만의 IoT 구성도를 공유하고 토론할 수 있는 소셜 웹 플랫폼

IoT의 성장이 생각보다 더딘 이유 중 하나는 IoT에 대한 접근성에 있다고 볼 수 있다. 사람들은 본인이 관심 있어 하지 않는 분야는 크게 관심을 두지 않고 잘 안 알아보려는 성향을 보인다. IoT는 아직 명확히 통일된 플랫폼이 존재하지 않는다. IFTTT나 SmartThings처럼 여러 회사의 제품을 하나의 플랫폼으로 컨트롤 할 수 있도록 방안은 나오고 있으나 일반인들은 해당 서비스에 대해 자세히 알지 못해서 활용하지 못하는 경우를 볼 수 있다.

따라서 우리는 IoT의 성장을 뒷받침해주고 보다 많은 사람이 자신만의 IoT 생태계 구축을 도와주고자 해당 서비스를 기획하였다. 본인의 집에 IoT 생태계를 잘 구성하고 생활하고 있는 사람은 많지 않으나 분명히 존재한다. 이런 사람들이 본인이 어떤 제품을 사용하고, 어떤 플랫폼(앱 등)을 사용하여 기기들을 컨트롤한다는 등의 정보를 공유한다. 또한, 전등 on/off, TV 채널 조정, 에어컨 온도 조절 등 어떤 Capability를 조정할 수 있다 등의 정보도 공유한다. 이렇게 입력된 정보들을 설계도로 그릴 수 있게 하여 한눈에 볼 수 있도록 기능을 제공한다.

또한, 공유된 구성도에 리뷰와 댓글을 달 수 있게 하여 활발한 토론의 장을 열 수 있게 하고, 별점이 높은 구성도를 상위에 노출하는 등의 방식도 제공할 수 있다.

이를 통해 얻을 수 있는 이점은 일반 사용자는 본인이 IoT를 어떻게 구성해야 하는지 처음부터 찾을 필요가 없다는 것이다. 이미 잘 구성한 사람들의 구성도를 보고 똑같은 제품과 똑같은 플랫폼을 사용하여 본인의 집에 설치하면 손쉽게 IoT 생태계를 구축하는 것이 가능해진다.

비즈니스적인 관점에서도 본인이 어떤 동작을 IoT로 조정하고 싶은데 어떤 제품이 좋을지를 검색하면 사람들이 많이 사용하는 제품을 추천할 수 있고, 또한 광고를 통한 추천을 제공해 광고 수익을 얻을 수 있다. 다른 하나는 IoT 제조사가 직접 구성도와 제품 등을 작성하여 공유하게 하여 해당 회사가 만든 제품을 이런 방식으로 활용할 수 있다 등의 정보를 공유하게 하여 광고 수익을 얻을 수도 있다.

<br>

## Features
<ul>
  <li>설계도, 사용된 제품, 사용된 플랫폼, 사용 가능한 Capability 작성 및 공유</li>
  <li>구성도에 대한 댓글, 사용자 평가, 추천, 비추천 기능</li>
  <li>전체 구성도 모아보기 기능</li>
  <li>제품 추천 기능</li>
  <li>구성도 추천 기능</li>
  <li>많은 추천을 받은 구성도 상위 노출</li>
  <li>많이 사용되는 제품 상위 노출</li>
  <li>많이 사용되는 플랫폼 상위 노출</li>
  <li>more</li>
</ul>

<br>

## Platforms
<ul>
  <li>Responsive Web</li>
  <li>Android (Hybrid mobile app)</li>
  <li>iOS (Hybrid mobile app)</li>
</ul>

<br>

## Languages and Frameworks
<ul>
  <li>Node.js + Express.js</li>
  <li>Vue.js</li>
  <li>Vuetify Framework</li>
  <li>Javascript</li>
  <li>Java</li>
  <li>Swift 4</li>
  <li>Python 3</li>
  <li>MySQL</li>
</ul>

<br>

## Server and Development Tools
<ul>
  <li>Amazon Web Service (AWS)</li>
  <li>AWS Route 53 (for https)</li>
  <li>Amazon Certificate Manager (for https)</li>
</ul>
<ul>
  <li>JetBrains WebStorm</li>
  <li>JetBrains PyCharm</li>
  <li>Android Studio</li>
  <li>Xcode</li>
</ul>

<br>

## Development Period
> Using test-driven development (TDD)

~ 2018.10.31 (2 months)

<br>

## Used
> This project requires config files.

> Install dependency packages. You can see dependency packages <a href="https://github.com/pooi/IoTSharedPlatform/blob/master/package.json">here</a>.
```
 npm install
```


<br>

## License
```
    Copyright 2018 pooi

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
```