# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository purpose

Koleksi game edukasi berbasis web (HTML/CSS/JS murni) untuk anak-anak, di-host via GitHub Pages. Tidak ada build step, bundler, atau framework — setiap game adalah file statis yang langsung bisa dibuka di browser.

## Structure

```
index.html                        ← root hub (pilih pelajaran)
games/
  math/
    index.html                    ← hub topik math
    tambahkali/
      index.html / style.css / script.js
  english/
    index.html                    ← hub topik english
    words/
      index.html                  ← hub sub-topik kosakata
      my-body/
        index.html
```

URL GitHub Pages mengikuti struktur folder:
`https://fatah-bm.github.io/edu/games/<kategori>/<materi>/`

### Pola navigasi hub

Setiap halaman hub menggunakan pola kartu yang sama:
- **Root** (`index.html`): tanpa tombol Back, warna aksen per mata pelajaran (math=merah `#ff6b6b`, english=teal `#4ecdc4`)
- **Hub mata pelajaran** (`games/<kategori>/index.html`): tombol Back ke `../../`
- **Hub materi** (`games/<kategori>/<materi>/index.html`): tombol Back ke `../`
- **Halaman konten** (`games/<kategori>/<materi>/<topik>/index.html`): tombol Back ke `../`

Setiap kartu di hub: gambar dari Icons8 (`https://img.icons8.com/color/96/<name>.png`) + judul + subtitle. Jika gambar gagal load, sembunyikan (`onerror="this.style.display='none'"`).

### Menambah materi baru

1. Buat folder dan `index.html` di path yang sesuai
2. Tambahkan kartu link di halaman hub induknya
3. Pastikan tombol Back mengarah ke folder induk yang benar (`../` atau `../../`)

## Git & deployment

- Remote: `git@github.com-mfaa98.bm:fatah-bm/edu.git` (SSH host alias untuk akun `mfaa98.bm@gmail.com`)
- Branch utama: `main`
- Deploy: GitHub Pages — tidak ada CI/CD, push ke `main` langsung live

## Section: `games/english/conversation`

Percakapan bahasa Inggris untuk anak SD 1-2. Masing-masing topik dalam subfolder sendiri.

**Topik yang sudah ada:**
- `greetings/` — 7 situasi (good morning/afternoon/evening/night, how are you, nice to meet you, see you). Format dialog bubble: A kiri (biru), B kanan (hijau), 1 situasi per halaman.
- `do-you-have/` — pola "Do you have a ___? / Yes, I do. / No, I don't. / I have n ___.". Count=1 → singular, count>1 → plural. numWords array untuk angka 1-20.
- `what-time/` — "What time is it? / It's ___ o'clock." Emoji jam 🕐–🕛, 1 jam per halaman, 12 halaman.

**Pola desain conversation:** dialog bubble (klik untuk dengar), warna ungu (#9b59b6) sebagai aksen, navigasi ◀ ▶ per situasi/halaman.

---

## Section: `games/english/words`

Kumpulan halaman kosakata bahasa Inggris untuk anak SD 1-2. Setiap topik adalah subfolder dengan `index.html` berisi kartu-kartu kata.

**Pola struktur:**
```
games/english/words/
  index.html           ← hub daftar topik (kartu link ke subfolder)
  <nama-topik>/
    index.html         ← kartu kosakata topik tersebut
```

**Pola kartu:** emoji besar + teks kata, klik untuk mendengar pelafalan via Web Speech API (`lang: 'en-US'`, `rate: 0.85`, `pitch: 1.2`). Kartu berubah warna saat sedang dibunyikan (class `playing`). Semua CSS & JS inline dalam satu file, tidak ada file terpisah.

**Menambah topik baru:**
1. Buat folder `games/english/words/<nama-topik>/index.html`
2. Tambahkan kartu link di `games/english/words/index.html`

**Topik yang sudah ada:**
- `my-body/`
- `my-family/`
- `numbers-1-20/` — tidak pakai gambar, angka sebagai visual utama, grid 5 kolom
- `alphabet/` — tidak pakai gambar, huruf kapital + lowercase sebagai visual, grid 5 kolom
- `days/` — tidak pakai gambar, badge warna bulat + singkatan (SUN/MON/...), grid 4 kolom, tanpa pagination
- `months/` — tidak pakai gambar, badge warna kotak + singkatan (JAN/FEB/...), grid 3 kolom, 6 per halaman
- `singular-plural/` — layout 2 kolom (kiri=singular/biru, kanan=plural/ungu), 3 pasang per halaman; plural ditampilkan dengan 2 gambar kecil

---

## Game: `games/math/nilai-tempat`

Game drag-and-drop nilai tempat untuk anak SD kelas 1-2. Suara mengucapkan angka dalam bahasa Indonesia, anak mendrag kartu digit 0–9 ke kotak Ratusan/Puluhan/Satuan yang tepat.

**Flow layar:** `screen-level` → `screen-game` → `screen-result`

**Level & range angka:**
- `'mudah'`: 1–20 — kotak Satuan saja (1–9) atau Puluhan+Satuan (10–20)
- `'sedang'`: 21–99 — kotak Puluhan + Satuan
- `'sulit'`: 100–999 — kotak Ratusan + Puluhan + Satuan

Jumlah kotak ditentukan otomatis oleh jumlah digit angka (`getPositions()` baca `currentQ.number`), bukan dari level.

**Interaksi:** drag kartu digit dari tray → lepas di atas kotak posisi. Tap kotak yang sudah terisi → kosongkan. Implementasi via Pointer Events (`pointerdown`/`pointermove`/`pointerup`) agar bekerja di mouse & touchscreen.

**Speech:** `numberToWords(n)` mengubah angka ke kata Indonesia ("sebelas", "dua puluh tiga", "seratus lima belas"), diucapkan via Web Speech API (`lang: 'id-ID'`, `rate: 0.85`). Voice Indonesia dipilih eksplisit dari `speechSynthesis.getVoices()`.

**Scoring:** +10 benar, -5 salah (minimum 0). Kotak yang benar dikunci (`lockedBoxes`), kotak salah direset untuk dicoba ulang. 10 soal per sesi.

**Dependensi eksternal:** `canvas-confetti` (CDN jsdelivr). Semua CSS & JS inline dalam satu `index.html`.

---

## Game: `games/math/tambahkali`

Game pilihan ganda matematika (penjumlahan & perkalian) untuk anak SD.

**Flow layar:** `screen-type` → `screen-operation` → `screen-level` → `screen-game` → `screen-result`

**State game** dikelola via variabel global di `script.js`:
- `gameType`: `'practice'` | `'challenge'` — practice tanpa timer, challenge 120 detik
- `currentOperation`: `'add'` | `'mul'` | `'mix'`
- `currentLevel`: `'easy'` | `'medium'` | `'hard'`
- `currentQuestionData`: object state soal aktif (`qText`, `trueAns`, `mistakes`, `solved`)
- `gameHistory`: array soal yang sudah selesai, dipakai untuk layar review

**Scoring:** +10 jawaban benar, -5 jawaban salah (minimum 0). Soal tidak diganti saat salah — anak bisa mencoba lagi sampai benar.

**Audio:** BGM via `<audio>` tag (Wikimedia), SFX benar/salah via Web Audio API oscillator. Toggle dengan `toggleAudio()`.

**Dependensi eksternal:** `canvas-confetti` (CDN jsdelivr), avatar dari `api.dicebear.com`.
