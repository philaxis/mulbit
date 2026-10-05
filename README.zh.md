[English](README.md) · [한국어](README.ko.md) · [中文](README.zh.md)

<p align="center"><img src="docs/icon.svg" width="96" alt="mulbit"></p>

<p align="center"><strong><a href="https://github.com/philaxis/mulbit/releases/latest/download/mulbit.exe">⬇ 下载 Windows 版 mulbit</a></strong></p>

<p align="center">说出的话，自动输入到光标处。</p>

---

**免费使用。** 下载后直接运行，无需注册或付费。

**在本机转写。** 无需联网，声音留在你的电脑里。

**想说多久就说多久。** 文字随说随显示，由你决定何时停止。

**停止后自动粘贴。** 聊天框、文档、编程工具，都能输入到原来的光标处。

**一个按键就够。** 按住 `G` 键开始，再按住一次停止。短按仍会正常输入 g。

**鼠标也能当键盘。** 将快捷键绑定到闲置的鼠标按钮。Logitech 手势还可以绑定 Enter、粘贴和复制。

**用自己设定的词开始和停止。** 在“设置 → 我的声音”录入提示词，说一声就能控制。

## 开始使用

1. 点击上方按钮下载并运行。
2. 首次启动会一步步引导你：打个招呼，然后检查麦克风。
3. 选择“在我的电脑上（免费、离线）”或“Gemini API 密钥”。
4. 使用本地转写时，下载一次语音模型（约 250 MB 或 1.1 GB）；使用 Gemini 时，输入密钥。
5. 跟着引导试一试：按住 `G` 键说话，再按住一次停止。文字会自动粘贴到光标处。

## 想要更准确？

没有密钥也可以**免费体验 Gemini 10 秒**（每天 3 次），在首次引导或设置中点击即可。

在设置中添加 Gemini API 密钥即可使用 Google 的语音识别。[Google AI Studio](https://aistudio.google.com/apikey) 可免费获取密钥，用量遵循 Google 的免费额度和收费标准。此模式会将声音发送给 Google。

<details>
<summary>常见问题</summary>

**在中国大陆能用吗？** 可以。选择“在我的电脑上”即可完全离线使用；语音模型下载失败时会自动改用镜像站。Gemini 和“10 秒体验”需要能访问 Google 的网络，在中国大陆通常无法使用。

**Windows 阻止运行？** 应用未签名，首次运行可能出现提示。点击**更多信息 → 仍要运行**。

**文字和声音保存在哪里？** 转写文字以 Markdown 保存到你选择的记录文件夹，默认是 `Documents\mulbit`。默认不保存声音。

**能换成 G 以外的按键吗？** 可以在设置中更改，也可以设置 `Alt+Shift+V` 等快捷键，再用 Logitech 等鼠标软件将它绑定到按钮。

**支持哪些 Windows 版本？** Windows 10 和 11。

</details>

---

免费使用，不允许再分发或修改。[许可](LICENSE.md) · [开源声明](THIRD_PARTY_NOTICES.md) · 欢迎通过 [Issues](https://github.com/philaxis/mulbit/issues) 反馈。

© 2026 philaxis
