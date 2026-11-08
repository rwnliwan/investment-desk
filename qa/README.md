# QA — Investment Desk

Guard repo untuk fix ronde 7 Terra (dibuat 2026-11-08).

## File

- `qa_investment_r7.py` — harness verifikasi 10 item R7 (2 must + 6 should + 2 nit):
  M1 (ROE × retensi = pertumbuhan nilai buku), M2 (likuidasi Rp0 hanya dalam
  skenario), S1–S6, N1 (markup SOTP), N2 (batas eksak Rp1.874,55) + jangkar
  kanonis (WACC Opsi A 9,39%, target Rp2.062, invalidasi Rp1.400, FCFF −20%,
  parseIDNumber ketat) + `node --check` semua JS.

## Jalankan

```bash
python3 qa/qa_investment_r7.py   # dari root repo investment-desk
```

Exit 0 = semua PASS. WAJIB PASS sebelum commit perubahan apa pun yang
menyentuh kalimat-kalimat yang dikunci guard ini.
