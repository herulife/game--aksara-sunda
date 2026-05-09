# Setup Supabase untuk Aksara Sunda

## Status Lokal
- `.env.local` sudah dibuat
- App `Next.js` sudah berhasil `build`
- Auth flow `register`, `login`, `dashboard`, `logout` sudah siap

## Yang Harus Dilakukan di Dashboard Supabase

### 1. Jalankan schema SQL
1. Buka project Supabase
2. Masuk ke `SQL Editor`
3. Buat query baru
4. Salin isi file berikut dan jalankan:

[supabase-schema-aksara-sunda.sql](D:/GAME/supabase-schema-aksara-sunda.sql)

### 2. Aktifkan login Email
1. Buka `Authentication`
2. Buka `Providers`
3. Pastikan `Email` aktif

### 3. Matikan email confirmation untuk testing cepat
Jika ingin langsung bisa login setelah daftar:
1. Buka `Authentication`
2. Cari setting konfirmasi email
3. Nonaktifkan email confirmation sementara

### 4. Opsional: buat bucket storage
Kalau nanti mulai pakai audio dan gambar:
1. Buka `Storage`
2. Buat bucket `audio`
3. Buat bucket `images`

## Menjalankan App
Di folder berikut:

[aksara-sunda-app](D:/GAME/aksara-sunda-app)

Isi juga `.env.local` bila ingin reward suara AI yang lebih natural:

```env
OPENAI_API_KEY=...
OPENAI_TTS_MODEL=gpt-4o-mini-tts
OPENAI_TTS_VOICE=marin
```

Jalankan:

```bash
npm run dev
```

Lalu buka:

```txt
http://localhost:3000
```

## Halaman yang Sudah Ada
- `/`
- `/register`
- `/login`
- `/dashboard`

## Catatan
- Login memakai `email + password`
- `username` dan `display_name` otomatis masuk ke tabel `profiles`
- Jika schema belum dijalankan, register/login belum akan bekerja penuh
