# Third-party notices

mulbit itself is licensed under [LICENSE.md](LICENSE.md).

## Sound-trigger feature models

The sound-trigger feature models come from [openWakeWord](https://github.com/dscripka/openWakeWord) v0.5.1. The embedding backbone is based on Google's [speech_embedding](https://www.kaggle.com/models/google/speech-embedding) model (Apache-2.0). The openWakeWord README states that its included pre-trained models are licensed under CC BY-NC-SA 4.0, so these files are for noncommercial use and will be replaced before any commercial licensing.

## Rust and JavaScript dependencies

mulbit is built with Tauri, tokio, tract, cpal, tokio-tungstenite, serde and other crates under MIT and/or Apache-2.0 licenses. `cargo tree` lists the full dependency set; each crate's license ships with its source.

## Speech recognition and runtime

Gemini transcription uses your own API key, under the [Gemini API Additional Terms](https://ai.google.dev/gemini-api/terms).

Local multilingual transcription uses **OpenAI Whisper Base**. Whisper's code and model weights are released under the **[MIT license](https://github.com/openai/whisper/blob/main/LICENSE)**, copyright (c) 2022 OpenAI. Model files are downloaded only at the user's request and are not bundled with mulbit.

The [ONNX Community int8 export](https://huggingface.co/onnx-community/whisper-base/tree/1846881b6b3a3024392c1eea3ad983695bc23925) is pinned to revision `1846881b6b3a3024392c1eea3ad983695bc23925`. Rust feature extraction follows [Whisper's log-mel frontend](https://github.com/openai/whisper/blob/main/whisper/audio.py) and the Slaney filterbank used by [librosa](https://github.com/librosa/librosa) (ISC).

The CPU runtime is **Microsoft ONNX Runtime 1.30.0**, [MIT license](https://github.com/microsoft/onnxruntime/blob/v1.30.0/LICENSE). Its two DLLs are extracted from Microsoft's pinned [PyPI Windows wheel](https://pypi.org/project/onnxruntime/1.30.0/) after archive and DLL verification; they are downloaded on request, not bundled. No Python installation is required. The same download extracts four app-local DLLs from Microsoft Visual C++ desktop runtime package 14.0.33321.0, under Microsoft’s [C++ runtime license terms](https://visualstudio.microsoft.com/license-terms/vs2022-cruntime/). These Microsoft DLLs are downloaded only at user request, not bundled in mulbit.

Direct dependencies include `ort` / `ort-sys`, `rustfft`, `sha2` and `serde_json` (MIT OR Apache-2.0), `zip` (MIT), `libloading` (ISC), and the test/example-only WAV reader `hound` (Apache-2.0). Transitive dependencies and their licenses are identified by crate metadata.
