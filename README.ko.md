[English](README.md) · [한국어](README.ko.md)

<p align="center"><img src="docs/icon.svg" width="96" alt="mulbit icon"></p>

<p align="center"><strong><a href="https://github.com/philaxis/mulbit/releases/latest/download/mulbit.exe">⬇ Windows용 mulbit 다운로드</a></strong><br><small><a href="https://github.com/philaxis/mulbit/releases">모든 릴리스</a></small></p>

말하는 대로 커서 자리에 써 주는 Windows 음성 인식 키보드.

- **거의 무료.** [Google AI Studio](https://aistudio.google.com/apikey)에서 Gemini API 키를 받아 쓰세요. 사용량은 Google의 무료 한도와 요금을 따릅니다. 작은 오프라인 모델은 키 없이도 쓸 수 있습니다.
- **말을 끊지 않습니다.** 말하는 내용이 눈앞에 나타납니다. 내가 멈출 때까지 계속 듣습니다. 침묵 자동 종료는 선택 사항이며 기본 꺼짐입니다. Gemini는 실시간으로, 로컬 모델은 발화 구간이 끝날 때 글이 나타납니다.
- **멈추면 바로 붙여넣기.** 전사가 마무리되면 커서 자리에 글이 들어갑니다. 코딩 에이전트에 프롬프트 밀어 넣기, 채팅, 문서 작성. 바이브 코딩할 때 손보다 말이 빠릅니다.
- **마우스가 키보드가 됩니다.** Logitech 같은 마우스 설정에서 남는 버튼에 시작·중지 단축키를 연결하세요. 누르고, 말하고, 누르면 입력 끝.
- **그냥 내 말을 해도 됩니다.** “물빛” 같은 짧은 말을 등록하면 같은 말로 시작하고 멈춥니다.

### 세 단계면 시작

1. **받고 실행하세요.** Windows 10/11에서 [mulbit.exe](https://github.com/philaxis/mulbit/releases/latest/download/mulbit.exe)를 실행합니다.
2. **설정을 여세요.** Gemini 키를 붙여 넣고 저장하거나, 로컬 모델을 받으세요(약 80MB, 처음에는 공용 실행 파일 추가).
3. **Ctrl+Alt+Space → 말하기 → 다시 누르기.** 현재 앱에 글이 붙여넣어집니다. 설정에서 단축키를 바꾸고 마우스 버튼에 연결해도 됩니다.

<details>
<summary>설정과 평소 사용법</summary>

설정은 크기를 조절할 수 있는 별도의 큰 창으로 열립니다. English / 한국어를 바꾸면 앱 전체에 즉시 적용됩니다. 처음에는 Windows 언어를 따릅니다. 첫 화면에는 키와 모델, 마이크 테스트, 시작·중지 단축키가 있습니다.

**고급**에는 인식 언어, 전사 스타일, 붙여넣기 방식, 소리 등록, 고스트 모드, 모든 가상 데스크톱 표시, 침묵 종료, 알림 소리, 음성 감지 조절, 모델 ID 직접 입력, 기록 보관과 진단 설정이 있습니다.

오버레이는 항상 위에 표시되며 이동·크기 조절이 가능합니다. 고스트 모드는 대기 중 창을 흐리게 하고 클릭을 통과시킵니다. 단축키·버튼으로 멈추면 기본으로 자동 붙여넣으며, 음성으로 멈출 때도 붙여넣으려면 고급에서 켜세요. Enter는 누르지 않습니다.

</details>

<details>
<summary>내 말로 시작하고 멈추기</summary>

**고급 → 소리 트리거**에서 짧은 말을 다섯 번 등록하세요. 사용할 때는 말한 뒤 잠시 쉬면 감지됩니다. 같은 소리로 시작·종료하거나 서로 다른 소리를 등록할 수 있습니다.

인식은 기기에서 처리합니다. 시작 소리를 등록하면 대기 중에도 마이크로 듣습니다. 등록 음성 대신 소리 특징만 저장합니다. 종료 소리를 전사에서 빼기 위해 글이 잠시 늦게 나타납니다.

</details>

<details>
<summary>오프라인 모델과 Gemini</summary>

로컬 엔진은 하나의 다국어 **Whisper Base** 모델로 한국어·영어 등 여러 언어를 인식합니다. 모델은 약 **80MB**이며, 처음에는 공용 ONNX·C++ 실행 파일 압축본 약 **21MB**를 추가로 받습니다. 준비 후에는 인터넷 없이 동작합니다. 혼합 발화나 고유명사는 Gemini보다 정확도가 낮습니다.

키와 모델이 모두 있으면 **자동 / Gemini / 로컬**을 선택할 수 있습니다. 자동은 저장된 키가 있으면 Gemini, 없으면 로컬을 사용합니다. Gemini 모델 제공 여부, 한도와 요금은 Google의 약관을 따릅니다.

</details>

<details>
<summary>개인정보, Windows, 확인</summary>

음성은 Gemini 엔진을 사용할 때만 Google Gemini로 전송됩니다. **로컬 엔진은 받아쓰기 음성을 보내지 않으며**, Gemini 키가 저장되어 있어도 준비 후 오프라인으로 동작합니다. 소리 등록과 감지도 기기 안에서 처리합니다.

API 키는 **Windows 자격 증명 관리자**에 저장됩니다. 전사는 `Documents\mulbit`에 Markdown으로, 설정·모델·선택적 로그는 `%LOCALAPPDATA%\mulbit`에 저장됩니다. 내려받은 `.exe`에는 사용자 데이터가 들어 있지 않습니다.

mulbit은 Windows 10/11용 포터블 실행 파일이며 WebView2 Runtime이 필요합니다. 서명되지 않은 파일이므로 SmartScreen이 나타날 수 있습니다. 공식 다운로드와 체크섬을 확인한 뒤 **추가 정보 → 실행**을 선택하세요. SHA-256 체크섬은 해당 [릴리스](https://github.com/philaxis/mulbit/releases)에서 확인할 수 있습니다.

</details>

### 라이선스

무료로 설치하고 사용할 수 있습니다. [LICENSE.md](LICENSE.md)를 보세요. 재배포와 수정은 허용되지 않습니다.

의견: [이 저장소의 Issue](https://github.com/philaxis/mulbit/issues)에 남겨 주세요.

[서드파티 고지](THIRD_PARTY_NOTICES.md) · Copyright © 2026 philaxis · mulbit 이름과 로고는 philaxis의 상표입니다.
