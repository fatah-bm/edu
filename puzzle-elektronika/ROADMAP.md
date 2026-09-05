# Roadmap — Puzzle Elektronika (Proyek Terpisah)

> **Status: ide/brainstorm, belum dikerjakan.** Proyek ini SENGAJA dipisah dari
> repo `edu` (situs belajar SD kelas 1-2) karena target audiens, gaya
> penyampaian, dan model bisnisnya berbeda total. Rencana detail & implementasi
> akan digarap di sesi terpisah yang lebih formal (riset kompetitor, pemilihan
> tech stack, setup monetisasi, dsb) — file ini cuma menangkap ide awal supaya
> tidak hilang.

## Konsep

Puzzle game simulasi rangkaian elektronika untuk **audiens umum** (bukan
anak SD), menggabungkan dua lapis materi:

1. **Gerbang logika** — AND, OR, NOT, XOR (dan turunannya: NAND, NOR, XNOR)
   sebagai blok bangunan puzzle.
2. **Komponen elektronika nyata** — resistor, kapasitor, transistor — sebagai
   lapisan berikutnya yang lebih kompleks (transistor bisa berperan sebagai
   gerbang logika juga, jadi ada jembatan konseptual dari lapis 1 ke lapis 2).

Gaya permainan: **simulasi rangkaian visual** (bukan kuis pilihan ganda) —
pemain menyambungkan komponen di sebuah papan/kanvas, lalu menjalankan
simulasi untuk melihat hasilnya (lampu nyala/mati, dsb).

## Kenapa terpisah dari repo `edu`

- Audiens & nada bicara beda: `edu` = anak SD 1-2 + orang tua/guru, bahasa
  sangat sederhana. Ini = umum/hobbyist, boleh pakai istilah teknis asli.
- Model bisnis beda: `edu` murni gratis tanpa iklan/monetisasi. Ini
  direncanakan ada monetisasi.
- Kemungkinan besar butuh tech stack berbeda dari static-HTML-tanpa-build
  yang dipakai `edu` (lihat bagian Tech Stack di bawah).

## Progresi materi (draf kasar)

1. **Level pengantar** — satu saklar + satu lampu, konsep sirkuit tertutup.
2. **Gerbang dasar** — AND (seri) & OR (paralel) lewat 2 saklar, divisualkan
   sebagai sambungan kabel, baru diberi nama formalnya setelah pemain paham
   secara intuitif.
3. **NOT & XOR** — konsep saklar terbalik (normally-closed) dan kombinasi
   ekslusif.
4. **Kombinasi gerbang** — puzzle yang butuh menyusun beberapa gerbang untuk
   mencapai tabel kebenaran target.
5. **Komponen nyata** — perkenalkan resistor (pembagi arus/tegangan),
   kapasitor (simpan & lepas muatan — delay/timing puzzle), transistor
   (sebagai saklar elektronik & sebagai pengganti gerbang logika).
6. **Puzzle campuran/level lanjutan** — gabungan gerbang + komponen nyata,
   makin dekat ke rangkaian elektronika sungguhan (mis. rangkaian timer
   sederhana pakai resistor+kapasitor+transistor).

## Mekanik inti (draf)

- Papan berbasis **grid** (bukan gambar kabel bebas/freeform) — komponen
  ditempatkan di sel grid, kabel otomatis nyambung ke sel bertetangga. Ini
  pilihan sengaja: freeform wire-dragging susah presisi di layar sentuh kecil
  (pelajaran dari `games/logika/labirin-kode` & `nilai-tempat` di repo `edu`
  yang sudah dites bekerja baik di HP dengan pendekatan grid/chip, bukan
  freeform).
- Evaluasi rangkaian: graph traversal sederhana (mirip BFS `isSolvable()` di
  `labirin-kode`) untuk cek apakah ada jalur "hidup" dari sumber daya ke
  keluaran melalui komponen yang dalam kondisi menghantarkan.
- Loop skor/level mengikuti pola yang sudah terbukti di `edu` (soal
  bertahap, skor, layar hasil) — tapi UI/copy-nya di-rewrite total untuk nada
  bicara umum, bukan nada anak SD.

## Ide monetisasi (mentah, perlu divalidasi)

- **Freemium level pack** — level awal gratis, paket level lanjutan
  (komponen nyata, puzzle kompleks) berbayar sekali beli.
- **Iklan opsional** — tonton iklan untuk hint/skip, bukan iklan paksa.
- **Versi tanpa iklan** — pembelian sekali untuk hilangkan iklan.
- **Kosmetik** — skin papan/komponen (tema retro, neon, dll) — kosmetik
  murni, tidak pay-to-win.
- Perlu riset kompetitor (game puzzle circuit yang sudah ada di app store)
  sebelum memutuskan model mana yang realistis.

## Tech stack — pertimbangan (belum diputuskan)

Repo `edu` sengaja pakai HTML/CSS/JS murni tanpa build step karena itu situs
edukasi gratis tanpa monetisasi. Untuk proyek berbayar dengan target audiens
umum, pertimbangan berbeda:
- Kalau target web + mobile app: framework seperti React/Vue + Capacitor
  (bungkus jadi app Android/iOS) mungkin lebih masuk akal daripada HTML murni.
- Kalau cuma web (PWA): masih bisa vanilla JS, tapi butuh build step untuk
  bundling & minifikasi kalau kompleksitas naik banyak (banyak level, state
  management sirkuit yang lebih rumit dari game-game di `edu`).
- Butuh keputusan soal backend (kalau ada login/progress/leaderboard/IAP)
  sebelum mulai — ini akan dibahas di sesi perencanaan terpisah.

## Yang belum diputuskan (dibahas nanti)

- Nama produk & branding.
- Platform prioritas (web dulu, atau langsung mobile app).
- Cakupan MVP (berapa banyak level/gerbang untuk versi pertama yang dirilis).
- Riset kompetitor & diferensiasi.
- Struktur monetisasi final.
