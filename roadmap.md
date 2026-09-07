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

## Logika — Pipa Air (`games/logika/sirkuit-sederhana`)

- [ ] **Model graf penuh (multi-sumber, gerbang fan-in/fan-out) + BFS solve**
  Versi saat ini adalah **pohon**: satu akar (`shared`, opsional) yang bercabang jadi beberapa daun/ember (`branches`) — setiap gerbang hanya punya satu jalur masuk dan menuju satu titik cabang berikutnya. Ide lanjutan dari user:
  - Lebih dari satu **sumber air** (bukan cuma satu akar 🚰).
  - **2 input masuk ke satu gerbang** (gerbang jadi titik pertemuan/merge dari dua jalur berbeda, bukan cuma diteruskan berurutan).
  - **Satu gerbang punya 2 output** (fan-out ke dua cabang independen dari titik yang sama, bukan lewat percabangan implisit paralel/seri).
  Begitu ada merge (fan-in) dan sumber jamak, topologi berubah jadi **DAG**, bukan pohon lagi — pembuktian matematis `assignForTarget` (induksi pada pohon series/parallel) tidak otomatis berlaku karena satu gerbang bisa dipengaruhi oleh lebih dari satu "induk". Perlu:
  - Generator topologi baru yang membangun graf terarah (bukan tree), dengan constraint agar tetap tidak ada siklus.
  - Solver berbasis **BFS/DFS reachability** dari tiap sumber (mirip `isSolvable()` di `labirin-kode`) untuk memastikan tiap kombinasi saklar yang di-generate benar-benar valid dan dapat dicapai, menggantikan pendekatan pembuktian induktif `assignForTarget`.
  - Layout SVG baru yang bisa menggambar merge point (garis masuk dari 2 arah ke satu gerbang) dan split point (satu gerbang, dua garis keluar) — `measure()`/`renderNode()` saat ini asumsikan struktur pohon murni.
  Prioritas: setelah level "banyak ember" (satu akar, banyak daun) stabil dan terasa cukup, karena kompleksitas UI/algoritma jauh lebih tinggi.
