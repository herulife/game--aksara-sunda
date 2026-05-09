# Asset Spec Aksara Sunda

## Tujuan
Dokumen ini menjadi acuan produksi aset visual agar tampilan web bisa sedekat mungkin dengan mockup.

Fokus utama:
- splash screen
- menu utama
- pilih level
- belajar huruf
- quiz
- progres

## Gaya Visual Umum
- nuansa ramah anak
- warna hangat, hijau alam, krem, coklat kayu
- ilustrasi lembut dan cerah
- latar desa Sunda, pegunungan, pepohonan, dan rumah adat
- karakter tampak sopan, bersih, dan ekspresif
- hindari style gelap, neon, cyber, atau realistis keras

## Standar File
- ilustrasi karakter atau objek terpisah: `PNG` transparan
- background besar: `WEBP` atau `JPG`
- ikon sederhana: `PNG` transparan atau `SVG`
- gunakan nama file lowercase dengan dash

## Struktur Folder
- [backgrounds](D:/GAME/aksara-sunda-app/public/assets/backgrounds)
- [characters](D:/GAME/aksara-sunda-app/public/assets/characters)
- [buildings](D:/GAME/aksara-sunda-app/public/assets/buildings)
- [icons](D:/GAME/aksara-sunda-app/public/assets/icons)
- [ornaments](D:/GAME/aksara-sunda-app/public/assets/ornaments)
- [ui](D:/GAME/aksara-sunda-app/public/assets/ui)
- [references](D:/GAME/aksara-sunda-app/public/assets/references)

## Prioritas Produksi
1. splash screen
2. menu utama
3. pilih level
4. belajar huruf
5. quiz
6. progres

## Asset List

### Splash Screen

#### `backgrounds/splash-background.webp`
- Ukuran: `1600x900`
- Format: `WEBP` atau `JPG`
- Isi:
  - langit cerah
  - awan lembut
  - pegunungan biru kehijauan
  - pepohonan dan semak
  - area tanah atau rumput di bagian bawah
- Catatan:
  - sisakan ruang kosong cukup di tengah untuk judul
  - jangan terlalu ramai di area tombol tengah

#### `characters/character-boy-sunda.png`
- Ukuran: `700x900`
- Format: `PNG` transparan
- Isi:
  - anak laki-laki Sunda
  - pakaian adat Sunda
  - pose ramah, berdiri menghadap depan
  - ekspresi ceria
- Catatan:
  - cocok diletakkan di kiri bawah layar

#### `characters/character-girl-sunda.png`
- Ukuran: `700x900`
- Format: `PNG` transparan
- Isi:
  - anak perempuan Sunda
  - pakaian tradisional bernuansa kuning atau hijau
  - ekspresi ramah
  - pose berdiri menghadap depan

#### `buildings/rumah-adat-sunda.png`
- Ukuran: `900x700`
- Format: `PNG` transparan
- Isi:
  - rumah adat Sunda sudut 3/4
  - detail kayu dan atap alami
  - pencahayaan siang hari
- Catatan:
  - cocok diletakkan di kanan bawah layar

#### `icons/icon-petunjuk.png`
- Ukuran: `128x128`
- Format: `PNG` transparan
- Isi:
  - ikon buku atau petunjuk

#### `icons/icon-musik.png`
- Ukuran: `128x128`
- Format: `PNG` transparan
- Isi:
  - ikon not musik

### Menu Utama

#### `backgrounds/menu-background.webp`
- Ukuran: `1600x900`
- Format: `WEBP` atau `JPG`
- Isi:
  - versi background desa Sunda yang lebih tenang
  - ruang tengah kosong untuk logo dan tombol

#### `characters/avatar-player-default.png`
- Ukuran: `300x300`
- Format: `PNG` transparan
- Isi:
  - avatar anak netral untuk player card

### Pilih Level

#### `ui/level-card-bg.png`
- Ukuran: `500x700`
- Format: `PNG`
- Isi:
  - panel kartu level gaya krem kayu

#### `icons/lock-icon.png`
- Ukuran: `128x128`
- Format: `PNG` transparan

#### `icons/star-icon.png`
- Ukuran: `128x128`
- Format: `PNG` transparan

### Belajar Huruf

#### `ui/letter-card-bg.png`
- Ukuran: `800x600`
- Format: `PNG`
- Isi:
  - panel krem bersih
  - cocok untuk menampilkan 1 huruf besar

#### `icons/speaker-icon.png`
- Ukuran: `128x128`
- Format: `PNG` transparan

### Quiz

#### `ui/question-card-bg.png`
- Ukuran: `900x500`
- Format: `PNG`
- Isi:
  - panel soal terang

#### `ui/option-button-bg.png`
- Ukuran: `500x180`
- Format: `PNG`
- Isi:
  - tombol jawaban gaya mockup

#### `icons/correct-badge.png`
- Ukuran: `256x256`
- Format: `PNG` transparan

#### `icons/wrong-badge.png`
- Ukuran: `256x256`
- Format: `PNG` transparan

### Progres

#### `ui/progress-panel-bg.png`
- Ukuran: `1000x700`
- Format: `PNG`
- Isi:
  - panel statistik krem hangat

## Ornamen Tambahan

#### `ornaments/leaf-corner-top-left.png`
- Ukuran: `400x400`
- Format: `PNG` transparan

#### `ornaments/leaf-corner-top-right.png`
- Ukuran: `400x400`
- Format: `PNG` transparan

#### `ornaments/leaf-corner-bottom-left.png`
- Ukuran: `400x400`
- Format: `PNG` transparan

#### `ornaments/leaf-corner-bottom-right.png`
- Ukuran: `400x400`
- Format: `PNG` transparan

## Naming Rules
- gunakan lowercase
- pisahkan kata dengan dash
- jangan gunakan spasi
- contoh:
  - `character-boy-sunda.png`
  - `splash-background.webp`
  - `icon-musik.png`

## Checklist Implementasi
- aset splash siap
- aset menu utama siap
- aset level card siap
- ikon suara, musik, petunjuk siap
- ornamen sudut siap

## Saran Workflow
1. simpan mockup referensi di folder [references](D:/GAME/aksara-sunda-app/public/assets/references)
2. produksi aset prioritas splash
3. pasang ke halaman awal
4. lanjut ke menu utama
5. lanjut ke level dan quiz
