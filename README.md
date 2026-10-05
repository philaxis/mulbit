[English](README.md) · [한국어](README.ko.md)

<p align="center"><img src="docs/icon.svg" width="96" alt="mulbit icon"></p>

<p align="center"><strong><a href="https://github.com/philaxis/mulbit/releases/latest/download/mulbit.exe">⬇ Download mulbit for Windows</a></strong><br><small><a href="https://github.com/philaxis/mulbit/releases">All releases</a></small></p>

A Windows voice keyboard that types what you say right where your cursor is.

- **Nearly free.** Bring a Gemini API key from [Google AI Studio](https://aistudio.google.com/apikey); usage follows Google's free-tier limits and pricing. Or use the small offline model with no key at all.
- **Keep talking.** Watch your words appear as you speak. Recording keeps going until you stop it; silence auto-stop is optional and off by default. Gemini streams live text; the local model adds text after each speech segment.
- **Stop → pasted.** Your words land at the cursor instantly after transcription finishes. Push a prompt into your coding agent, send a chat, draft a document. Vibe coding without the typing.
- **Your mouse becomes a keyboard.** Map the hotkey to a spare mouse button in software such as Logitech's. Press, talk, press. It's typed.
- **Or just say your own word.** Register “물빛” or another short word to start and stop with the same sound.

### Start in three steps

1. **Download and run** [mulbit.exe](https://github.com/philaxis/mulbit/releases/latest/download/mulbit.exe) on Windows 10/11.
2. **Open Settings.** Paste your Gemini key and save, or download the local model (~80 MB, plus runtime on first setup).
3. **Press Ctrl+Alt+Space, talk, press again.** Text is pasted into your focused app. Choose another hotkey in Settings and bind it to your mouse if you like.

<details>
<summary>Settings and everyday use</summary>

Settings opens in its own larger, resizable window. English / 한국어 at the top changes the whole UI immediately; the initial language follows Windows. Key and model, microphone test, and start/stop hotkey are on the first screen.

**Advanced** holds dictation language, transcription style, paste preferences, sound enrollment, ghost mode, all-virtual-desktops display, silence timeout, earcons, audio tuning, model ID override, history retention, and diagnostics.

The overlay stays on top and can be moved or resized. Ghost mode fades it and lets clicks pass through while idle; hover to interact. Auto-paste is enabled for hotkey/button stops; enable it for voice stops in Advanced. Enter is never sent.

</details>

<details>
<summary>Your word as a start/stop button</summary>

In **Advanced → Sound trigger**, enroll a short word and say it five times. During use, pause briefly after the word so it can be detected. You can use the same sound to start and stop, or enroll separate sounds.

Recognition runs locally. Enrolling a start sound enables idle microphone listening; only sound features are saved, not enrollment audio. The stop sound is removed from dictation, so text appears with a short delay.

</details>

<details>
<summary>Offline model and Gemini</summary>

The local engine uses one multilingual **Whisper Base** model for Korean, English, and other languages. Model files are about **80 MB**; first setup downloads another **21 MB** of shared ONNX/C++ runtime archives. After setup, Local works offline. It is less accurate than Gemini, especially for mixed speech and proper names.

When both a key and model exist, choose **Auto / Gemini / Local**. Auto prefers Gemini with a saved key, otherwise Local. Gemini model availability, quotas, and pricing follow Google's terms.

</details>

<details>
<summary>Privacy, Windows, and verification</summary>

Audio is sent to Google Gemini only when you use the Gemini engine. **The local engine sends no dictation audio** and works offline after setup, even if a Gemini key is saved. Sound enrollment and detection stay on your device.

Your API key is stored in **Windows Credential Manager**. Transcripts are local Markdown files in `Documents\mulbit`; settings, models, and optional logs use `%LOCALAPPDATA%\mulbit`. The downloaded `.exe` contains no user data.

mulbit is a portable executable for Windows 10/11 and needs WebView2 Runtime. It is unsigned, so Windows SmartScreen may appear: after confirming the official download and checksum, choose **More info → Run anyway**. Find the SHA-256 checksum in the relevant [release](https://github.com/philaxis/mulbit/releases).

</details>

### License

Free to install and use. See [LICENSE.md](LICENSE.md); redistribution and modification are not permitted.

Feedback: [open an issue in this repository](https://github.com/philaxis/mulbit/issues).

[Third-party notices](THIRD_PARTY_NOTICES.md) · Copyright © 2026 philaxis · The mulbit name and logo are trademarks of philaxis.
