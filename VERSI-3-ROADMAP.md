# Roadmap Versi 3

Target utama versi 3 adalah membuat `D:\GAME\aksara-sunda-app` semirip mungkin
dengan `D:\GAME\aksara-sunda` pada dua area:

1. flow layar
2. UI visual

Namun fondasi produksi dari `aksara-sunda-app` tetap dipertahankan:

- Supabase auth
- penyimpanan progres
- deploy Vercel
- struktur route Next.js

## Area yang Akan Diselaraskan

### 1. Flow Utama

Urutan target:

1. Splash
2. Input nama pemain
3. Menu utama
4. Pilih level
5. Belajar
6. Kuis
7. Menulis
8. Membaca
9. Hasil
10. Progres
11. Pengaturan

### 2. Bahasa dan Copy

Yang akan ditiru:

- judul layar
- label tombol
- copy feedback
- istilah progres dan level

### 3. UI Visual

Yang akan ditiru:

- komposisi frame
- panel
- badge level dan skor
- tombol utama dan tombol sekunder
- layout hasil
- kartu progres

## Strategi Implementasi

### Fase 1

- samakan struktur flow
- samakan judul layar
- samakan tombol navigasi

### Fase 2

- samakan layout dan panel
- samakan state kuis, menulis, membaca, hasil

### Fase 3

- polish visual
- audit mobile dan desktop
- audit istilah agar konsisten

## Titik Balik Aman

Jika perlu rollback:

- gunakan arsip `D:\GAME\arsip-versi\aksara-sunda-app-v2`
- atau checkout branch/tag `version-2-snapshot`
