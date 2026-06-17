# Roadmap

## Suara & Audio

- [ ] **Suara lebih ekspresif untuk Conversation**
  Saat ini pakai Web Speech API (pitch/rate saja, terdengar robotik).
  Opsi pengganti:
  - ElevenLabs — free tier 10k chars/bulan, kualitas sangat natural
  - Google Cloud TTS — free tier 1M chars/bulan, support SSML emosi
  - Microsoft Azure TTS — ada style `cheerful`, `sad`, dll
  Perlu API key dan pertimbangan CORS jika client-side.
