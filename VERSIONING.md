# Versioning Aksara Sunda

## Versi 1

Snapshot awal sebelum refactor flow besar disimpan di:

`D:\GAME\arsip-versi\aksara-sunda-app-versi-1`

## Versi 2

Kondisi `aksara-sunda-app` sebelum penyelarasan penuh ke project
`aksara-sunda` disimpan sebagai:

- arsip fisik:
  `D:\GAME\arsip-versi\aksara-sunda-app-v2`
- git branch lokal:
  `version-2-snapshot`
- git tag lokal:
  `version-2-snapshot`

Versi ini adalah titik balik aman jika nanti ingin kembali ke tampilan dan flow
yang sekarang.

## Versi 3

Versi aktif berikutnya akan dikerjakan di folder:

`D:\GAME\aksara-sunda-app`

Target versi 3:

- flow layar dibuat sedekat mungkin dengan `D:\GAME\aksara-sunda`
- UI dibuat mengikuti gaya visual `D:\GAME\aksara-sunda`
- backend Supabase, auth, dan deploy Vercel dari `aksara-sunda-app` tetap
  dipertahankan

## Catatan

Strategi kerja yang dipakai:

1. `aksara-sunda-app` tetap menjadi project utama produksi
2. `aksara-sunda` dipakai sebagai acuan flow dan UI
3. snapshot `versi 2` tidak diubah lagi agar rollback mudah
