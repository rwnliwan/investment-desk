# QA — Investment Desk

Guard repo untuk fix ronde 7 Terra (dibuat 2026-11-08) + ronde 8 (2026-11-09).

## File

- `qa_investment_r7.py` — harness verifikasi 10 item R7 (2 must + 6 should + 2 nit):
  M1 (ROE × retensi = pertumbuhan nilai buku), M2 (likuidasi Rp0 hanya dalam
  skenario), S1–S6, N1 (markup SOTP), N2 (batas eksak Rp1.874,55) + jangkar
  kanonis (WACC Opsi A 9,39%, target Rp2.062, invalidasi Rp1.400, FCFF −20%,
  parseIDNumber ketat) + `node --check` semua JS.
- `qa_investment_r8.py` — harness verifikasi 13 item R8 (1 must + 7 should +
  5 nit) + 2 guard gap:
  - GG-14 (kontradiksi lintas-lesson / kelas cacat di file luar cakupan fix):
    pemindaian silang KELAS — tiap saran "tambah" di file mana pun wajib
    bergerbang invalidasi; semua angka Rp di bank soal/kuis wajib kanonis;
    daftar terlarang vonis kualitas-laba + aturan umum "CFO + red flag →
    telusuri". Plus cek spesifik M1 (jangkar Rp1.200/Rp1.400/jual).
  - GG-10 (parser numerik dua arah): parseIDNumber DIEKSEKUSI di Node —
    kasus terima (termasuk "10.000.000" Credit MF-1) + kasus tolak +
    properti round-trip fmtID→parse + definisi tunggal repo-wide.
  - Item R8: M1, S1–S7, N1–N5 (S4/S5/S6 dieksekusi di Node atas kode
    sumber persis) + re-run guard R7 sebagai subprocess (49/49) +
    `node --check` semua JS.

## Jalankan

```bash
python3 qa/qa_investment_r7.py   # dari root repo investment-desk
python3 qa/qa_investment_r8.py   # dari root repo investment-desk
```

Exit 0 = semua PASS. WAJIB PASS sebelum commit perubahan apa pun yang
menyentuh kalimat-kalimat yang dikunci guard ini.
