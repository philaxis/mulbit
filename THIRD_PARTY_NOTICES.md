# Third-party notices

mulbit is freeware, Copyright © 2026 philaxis, licensed under [LICENSE.md](LICENSE.md). Third-party components retain their own licences.

- **Google speech_embedding v1 — Apache-2.0, Google.** Obtained directly from [Google's TF Hub module](https://tfhub.dev/google/speech_embedding/1?tf-hub-format=compressed), independently converted to ONNX; the log-mel frontend is implemented in Rust. [Official metadata](https://www.kaggle.com/api/v1/models/google/speech-embedding/get) specifies Apache 2.0. The original archive contains no NOTICE file. [Licence text](crates/sound-trigger/assets/LICENSE.Google), [provenance, modifications and hashes](crates/sound-trigger/assets/README.md).
- **OpenAI Whisper large-v3-turbo — MIT** ([model card](https://huggingface.co/openai/whisper-large-v3-turbo), [licence](https://github.com/openai/whisper/blob/main/LICENSE)). **OpenAI whisper-small — Apache-2.0 per its [model card](https://huggingface.co/openai/whisper-small).** ONNX Community exports: [large-v3-turbo](https://huggingface.co/onnx-community/whisper-large-v3-turbo/tree/360ebcde2559d60bb474678be3c1de9ef347d01a), [small](https://huggingface.co/onnx-community/whisper-small/tree/36050c46d777d46dc4b5f43f6d90574fc38f8732). File sizes and SHA-256 values are pinned in `crates/local-asr/src/whisper.rs`.
- **Microsoft ONNX Runtime 1.30.0 — MIT, Microsoft.** [Licence](https://github.com/microsoft/onnxruntime/blob/v1.30.0/LICENSE); DLLs come from the verified [Microsoft PyPI Windows wheel](https://pypi.org/project/onnxruntime/1.30.0/).
- **Microsoft Visual C++ desktop runtime 14.0.33321.0 — Microsoft [C++ runtime licence terms](https://visualstudio.microsoft.com/license-terms/vs2022-cruntime/).** App-local runtime DLL archives, hashes and sizes are pinned in `crates/local-asr/src/lib.rs`.
- **Rust crates and JavaScript development dependencies.** Tauri, tokio, tract-onnx, cpal, serde, rustfft, ort/ort-sys and other dependencies retain their upstream licences, predominantly MIT and/or Apache-2.0; `libloading` is ISC, `zip` is MIT, test-only `hound` is Apache-2.0. `cargo metadata`, `cargo tree` and the lockfiles identify exact versions; upstream source packages contain licence texts. Rust Kaldi-style fbank follows [kaldi-native-fbank](https://github.com/csukuangfj/kaldi-native-fbank) and [sherpa-onnx](https://github.com/k2-fsa/sherpa-onnx) conventions (Apache-2.0); these native libraries are not shipped.

ASR models and Microsoft runtime DLLs are downloaded at the user's request, rather than bundled. The Google feature model is embedded in the executable. Gemini uses the user's API key under [Gemini API Additional Terms](https://ai.google.dev/gemini-api/terms). Settings → Advanced → 오픈소스 고지 / Licenses displays model attribution and licence names.

- **Lucide toolbar icons — ISC, Lucide Contributors; square and x also retain Feather’s MIT licence, Cole Bemis.** Settings, mic, square, folder, x and lightbulb SVG geometry from [Lucide 0.468.0](https://github.com/lucide-icons/lucide/tree/0.468.0), rendered with a shared stroke style.

```text
ISC License

Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2022 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2022.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
```
