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

### Interaksi mobile-first (wajib untuk semua game baru)

Seluruh permainan di project ini ditargetkan untuk perangkat **mobile** (HP/tablet layar sentuh) sebagai perangkat utama. Setiap halaman game baru — bukan hanya satu kategori tertentu — wajib mengikuti konvensi berikut:

- **Viewport:** `<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">` di setiap halaman.
- **Interaksi sentuh:** gunakan **Pointer Events** (`pointerdown`/`pointermove`/`pointerup`/`pointercancel`), bukan hanya mouse/`click`, untuk drag, gambar, atau interaksi geser — selalu tangani `pointercancel` (plus fallback di level `document`) untuk membersihkan state saat gesture sistem (notifikasi, ganti app) menyela di tengah sentuhan. Lihat pola ghost-element di `games/math/nilai-tempat` atau pola menggambar kanvas di `games/indonesia/menulis-huruf`.
- **`touch-action`:** `manipulation` pada elemen yang di-tap (tombol, kartu), `none` pada elemen yang di-drag/digambar.
- **`-webkit-tap-highlight-color: transparent`** pada elemen interaktif.
- **`user-select: none`** pada kartu/chip/elemen draggable.
- **Target sentuh ≥ 40–50px** — tombol dan kartu jangan terlalu kecil untuk jari anak-anak.
- **Feedback tekan:** `:active { transform: translateY(Npx); box-shadow: none; }` di semua tombol/kartu bergaya "3D press".
- **Font:** `'Comic Sans MS', 'Chalkboard SE', sans-serif` (kecuali root `index.html` yang sudah pakai skema font sendiri).

Ini bukan checklist opsional — game baru yang belum diuji/dioptimalkan untuk sentuhan mobile dianggap belum selesai.

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

---

## Section: `games/logika`

Game logika/computational thinking untuk anak SD kelas 1-2, **berjenjang dari pemula sampai mahir**. Hub (`games/logika/index.html`) mengelompokkan kartu materi ke dalam 3 tier (`.tier` blocks dengan `.tier-badge` pemula/menengah/mahir), bukan grid datar seperti hub kategori lain — lihat juga struktur jenjang di `kurikulum.md` bagian "9. Logika".

**Pola desain umum semua game logika:** aksen ungu (`#9b59b6`), top-bar (Back + judul + tombol audio 🔊), `.container` card putih dengan shadow, skor "Skor: x/y", tombol "Soal Berikutnya" → layar `showFinish()` (persentase + emoji semangat + Main Lagi/Kembali). Audio SFX (correct/wrong/finish, kadang tick) via Web Audio API oscillator inline — pola identik di semua file, tidak diimpor dari file bersama. Semua CSS & JS inline dalam satu `index.html` per game, tidak ada file terpisah atau bank soal JSON eksternal.

**Pola soal:** kebanyakan game gabungkan bank soal *curated* (array literal tangan) + soal *procedural* (generator acak) yang di-shuffle jadi satu ronde — lihat `pola-urutan` dan `tebak-berikutnya` untuk contoh pola `CURATED_COUNT`/`PROCEDURAL_COUNT`.

### Jenjang 1 — Pemula (mengenali & mencocokkan)
- `cocokkan-pasangan/` — memory matching, mengenali kesamaan bentuk/warna
- `pola-urutan/` — melanjutkan pola berulang sederhana (AB-AB, AAB); soal curated + 3 generator prosedural (`genCyclePattern`, `genAABPattern`, `genArithmeticPattern`)

### Jenjang 2 — Menengah (memprediksi & menyusun urutan)
- `tebak-berikutnya/` — melengkapi pola/barisan yang lebih variatif
- `labirin-kode/` — sequencing dasar: susun chip perintah (⬆️⬇️⬅️➡️) lewat `program-row`, jalankan (`runProgram()`) untuk menuntun 🤖 ke 🏁 di `board` grid. Labirin dibuat prosedural (`generateMaze` + BFS `isSolvable`) sehingga selalu bisa diselesaikan; kesulitan naik per soal dalam 1 ronde (`mazeParamsForIndex`: Mudah → Sedang → Sulit, 8 soal/ronde). Saat berhasil, feedback menampilkan jumlah langkah (`program.length`) dan anak bisa pilih "🔁 Ulangi Lagi" (coba maze yang sama dengan langkah lebih sedikit, tanpa menambah skor lagi via flag `questionScored`) atau "Soal Berikutnya"

### Jenjang 3 — Mahir (loop, sebab-akibat, klasifikasi bertingkat)
- `labirin-kode-lanjutan/` — sama seperti `labirin-kode` tapi labirin lebih besar (5x5–6x6, lebih banyak rintangan) dan menambah chip `🔁` (repeat): mengulang arah nyata terakhir (`resolvedDirAt()`), pengenalan konsep loop lewat "ulangi langkah terakhir". Feedback jumlah langkah dan tombol "Ulangi Lagi" sama seperti `labirin-kode`
- `jika-maka/` — pilihan ganda sebab-akibat: kondisi (`rule-condition`) → pilih tindakan yang tepat. Bank soal `categories` (cuaca, lalu-lintas, rutinitas, perasaan, aman-sehat), pengecoh diambil dari kategori yang sama (`buildQuestion()`) supaya tetap masuk akal tapi salah konteks
- `klasifikasi/` — "Cari yang Beda": 5 item ditampilkan, 4 dari kelompok sama + 1 beda (kategori benda via `genCategoryQuestion()`, atau warna via `genColorQuestion()`), anak tap yang beda sendiri

---

## Section: `games/indonesia`

Game membaca & menulis Bahasa Indonesia untuk anak SD kelas 1-2, sejalan dengan `kurikulum.md` bab 1 kelas 1 ("Bunyi Apa Itu?" — mengenal huruf, bunyi, ejaan dasar; vokal & konsonan). Hub (`games/indonesia/index.html`) adalah grid datar (flat) seperti `games/english` — tanpa layer "materi" tambahan — 3 kartu langsung ke game.

**Pola desain umum:** aksen hijau (`#2ecc71`, shadow `#27ae60`), top-bar (Back + judul), pola kartu & tombol identik dengan game lain (border 4px, box-shadow 6px, `:active` translateY). Semua CSS & JS inline dalam satu `index.html` per game, tidak ada file terpisah.

- `mengenal-huruf/` — pengenalan huruf A-Z: grid kartu (kapital+kecil, mirip `games/english/words/alphabet`) dengan contoh kata + emoji per huruf, dibedakan visual vokal vs konsonan (badge warna). Tap kartu → ucapkan huruf lalu contoh kata via Web Speech API `id-ID` (`speakSequence()`, dirangkai lewat `utterance.onend` — bukan dua panggilan `speak()` beruntun, karena tiap panggilan memanggil `speechSynthesis.cancel()`).
- `menulis-huruf/` — melacak (tracing) huruf kapital A-Z di atas kanvas: dua `<canvas>` bertumpuk (`guideCanvas` = huruf pudar terisi penuh, `drawCanvas` = lapisan goresan pengguna), digambar via Pointer Events (`touch-action:none`, `setPointerCapture`). Validasi "cakupan kasar" dengan `coverageFraction()`: downsample kedua kanvas ke grid 48×48 lalu bandingkan sel-per-sel dengan toleransi dilatasi 1-sel tetangga, ambang lulus ~55% — pendekatan ini menghindari masalah `devicePixelRatio` karena grid selalu berukuran tetap. Tombol Hapus/Cek/Lanjut; gagal cek tidak menghapus goresan (anak bisa menambah tinta), retry diperbolehkan. Skor membedakan lulus langsung (+10) vs setelah retry (+5), 26 huruf/sesi, `showFinish()` di akhir.
- `suku-kata/` — menyusun suku kata jadi kata (contoh "i-bu", "ka-kek") berdasarkan gambar/emoji yang ditampilkan (kata tidak ditebak, hanya disusun). Bank suku kata acak → ketuk untuk memindah ke baris susunan (pola chip mirip `labirin-kode`'s `program-row`, termasuk placeholder `:empty::before`). Identitas tiap chip pakai index posisi suku kata yang benar (bukan teks) — `{id, text}` di mana `id` = urutan benar — sehingga kata dengan suku kata berulang (mis. "kupu-kupu") tetap tervalidasi urutannya dengan benar (`placedOrder.every((id, i) => id === i)`). 8 soal/ronde, benar → konfeti + ucapkan kata lengkap, salah → goyang lalu kembali ke bank untuk dicoba lagi.
