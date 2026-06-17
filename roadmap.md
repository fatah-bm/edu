# Roadmap

## Suara & Audio

- [ ] **Suara lebih ekspresif untuk Conversation**
  Saat ini pakai Web Speech API (pitch/rate saja, terdengar robotik).
  Opsi pengganti:
  - ElevenLabs — free tier 10k chars/bulan, kualitas sangat natural
  - Google Cloud TTS — free tier 1M chars/bulan, support SSML emosi
  - Microsoft Azure TTS — ada style `cheerful`, `sad`, dll
  Perlu API key dan pertimbangan CORS jika client-side.

## Profil & Gamifikasi

- [ ] **User login & history per akun**
  Setiap anak punya akun sendiri, progress tersimpan di cloud.
  - Kandidat backend: **Firebase** (Auth + Firestore) — gratis untuk skala kecil, cocok untuk static site karena SDK-nya berjalan di browser langsung tanpa perlu server. **Kompatibel dengan GitHub Pages.**
  - Data yang disimpan: topik yang sudah dikunjungi, kata yang sudah dilatih, skor quiz, tanggal terakhir belajar.
  - Login bisa pakai Google Sign-In (mudah untuk orang tua) atau email/password.
  - **Concern GitHub Pages:** Domain `fatah-bm.github.io` harus didaftarkan sebagai *Authorized Domain* di Firebase Console (Authentication → Settings) agar Google Sign-In tidak diblokir. Firebase config (API key, project ID) akan terekspos di JS — ini normal dan aman selama Firestore Security Rules dikonfigurasi dengan benar (baca/tulis hanya untuk user yang login).

- [ ] **Sistem leveling & XP**
  - Setiap aktivitas menghasilkan XP (misalnya: klik pronunciation = +1 XP, selesaikan halaman = +5 XP, quiz benar = +10 XP).
  - Level naik setelah akumulasi XP tertentu (Level 1 → 2 di 50 XP, dst).
  - Tampilkan level + progress bar XP di header atau halaman profil.

- [ ] **Badge & pencapaian**
  - Contoh badge: "Sudah hafal My Body", "Streak 7 hari", "Bintang Matematika".
  - Muncul animasi/konfeti saat badge baru dibuka.

- [ ] **Leaderboard (opsional)**
  - Ranking antar pemain berdasarkan total XP.
  - Bisa dibatasi per kelas/grup agar lebih relevan.
