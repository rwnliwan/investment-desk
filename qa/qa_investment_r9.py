#!/usr/bin/env python3
"""Harness verifikasi gap Investment Desk ronde 7 Terra (dibuat 2026-11-09).

Guard gap yang dikunci (perintah Septian 00:23, AGENTS.md):
  G1 — bridge SOTP belum menyatakan cakupan klaim atas tiap segmen
    (i2 §5.1): contoh mengasumsikan EV segmen dan net debt dapat
    dijumlahkan/dikurangkan langsung tanpa menyatakan asumsi kepemilikan
    penuh dan net debt konsolidasi yang sesuai. Guard mengunci:
    (a) asumsi eksplisit di §5.1; (b) checklist penyesuaian bila asumsi
    tidak berlaku (kepemilikan parsial / klaim non-controlling, utang
    tingkat segmen vs holding tanpa double count, klaim lain di atas
    ekuitas); (c) KELAS: tiap tabel SOTP yang menjumlahkan EV segmen
    lalu mengurangkan net debt wajib disertai pernyataan asumsi cakupan
    klaim di bagian yang sama (bukan hanya string G1 kali ini).
  G2 — skenario likuidasi tidak menjelaskan klaim dan biaya yang
    diabaikan (i2 §5.5): hitungan "550 - 900 = -350 -> ekuitas Rp0"
    tidak menyebut biaya likuidasi / kewajiban lain, dan urutan klaim
    tidak dijelaskan. Guard mengunci: (a) asumsi eksplisit biaya dan
    klaim lain diabaikan atau sudah tercakup; (b) urutan klaim harus
    diperiksa sebelum menghitung recovery ekuitas; (c) KELAS: tiap
    skenario likuidasi yang menghitung recovery ekuitas wajib menyebut
    biaya likuidasi DAN urutan klaim di bagian yang sama.
Plus: guard R8 di-re-run sebagai subprocess (152/152 harus bertahan,
yang di dalamnya me-re-run R7 49/49) + node --check semua JS.
Jalankan: python3 qa/qa_investment_r9.py  (dari root repo investment-desk)
Exit 0 = semua PASS.
"""
import re, subprocess, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
fails, passes = [], []

def check(name, ok, detail=""):
    (passes if ok else fails).append(name + (f" — {detail}" if detail and not ok else ""))

def read(p):
    return (ROOT / p).read_text(encoding="utf-8")

i2 = read("i2/index.html")

def section(html, start_marker, end_marker):
    """Potong teks antar dua heading; None bila penanda tidak ketemu."""
    s = html.find(start_marker)
    e = html.find(end_marker, s + 1) if s != -1 else -1
    if s == -1 or e == -1:
        return None
    return html[s:e]

s51 = section(i2, "5.1 · SOTP", "5.2 · DDM")
s55 = section(i2, "5.5 · Distress", "6 · Dari mana WACC")

# ============================================================
# G1 — SOTP: asumsi cakupan klaim + checklist penyesuaian
# ============================================================
check("G1a seksi §5.1 ditemukan", s51 is not None)
if s51:
    check("G1b asumsi kepemilikan penuh dinyatakan",
          "kepemilikan penuh" in s51)
    check("G1c asumsi net debt konsolidasi yang sesuai dinyatakan",
          "net debt konsolidasi" in s51)
    check("G1d penjumlahan EV + pengurangan net debt dikaitkan ke asumsi",
          "hanya sah di bawah asumsi itu" in s51)
    check("G1e checklist kepemilikan parsial hadir",
          "Kepemilikan parsial" in s51)
    check("G1f klaim non-controlling disebut",
          "non-controlling" in s51)
    check("G1g utang tingkat segmen vs holding disebut",
          "Utang tingkat segmen vs holding" in s51)
    check("G1h larangan double count utang disebut",
          "double count" in s51)
    check("G1i klaim lain di atas ekuitas disebut (preferen/konvertibel/opsi)",
          "Klaim lain di atas ekuitas" in s51
          and "saham preferen" in s51 and "utang konvertibel" in s51)
    check("G1j checklist berupa daftar (3 butir <li>)",
          s51.count("<li>") >= 3)

# --- KELAS (bukan hanya string G1): tiap tabel SOTP yang menjumlahkan
# EV segmen lalu mengurangkan net debt wajib disertai pernyataan asumsi
# cakupan klaim di bagian yang sama. Deteksi: blok <table> yang memuat
# "EV segmen" dan "Net debt" di §5.1 harus berada di seksi yang juga
# memuat "kepemilikan penuh" + "net debt konsolidasi".
check("G1k KELAS: tabel SOTP + asumsi cakupan klaim di seksi yang sama",
      s51 is not None and "EV segmen" in s51 and "Net debt" in s51
      and "kepemilikan penuh" in s51 and "net debt konsolidasi" in s51)

# ============================================================
# G2 — Likuidasi: biaya/klaim yang diabaikan + urutan klaim
# ============================================================
check("G2a seksi §5.5 ditemukan", s55 is not None)
if s55:
    check("G2b biaya likuidasi disebut sebagai asumsi",
          "biaya likuidasi" in s55)
    check("G2c biaya diabaikan atau sudah tercakup dinyatakan",
          "biaya likuidasi diabaikan atau sudah tercakup" in s55)
    check("G2d tidak ada kewajiban/klaim lain di luar utang dinyatakan",
          "tidak ada kewajiban atau klaim lain" in s55)
    check("G2e contoh klaim lain disebut (hukum/pajak/gaji)",
          "biaya hukum" in s55 and "pajak" in s55 and "gaji" in s55)
    check("G2f urutan klaim harus diperiksa sebelum recovery ekuitas",
          "Urutan klaim harus diperiksa sebelum menghitung recovery ekuitas" in s55)
    check("G2g pemegang saham biasa dibayar terakhir",
          "pemegang saham biasa dibayar terakhir" in s55)
    check("G2h langkah berurutan recovery -> klaim -> sisa ekuitas",
          "baru hitung sisa untuk ekuitas" in s55)
check("G2i hitungan kanonis TIDAK berubah: 550 − 900 = −350 → Rp0",
      "550 − 900 = −350" in i2 and "ekuitas <strong>Rp0</strong>" in i2)
check("G2j hitung ulang: 100+140+150+160 = 550; 550-900 = -350",
      100 + 140 + 150 + 160 == 550 and 550 - 900 == -350)

# --- KELAS (bukan hanya string G2): tiap skenario likuidasi yang
# menghitung recovery ekuitas wajib menyebut biaya likuidasi DAN urutan
# klaim di bagian yang sama. Deteksi: seksi yang memuat "Nilai likuidasi"
# dan "Nilai ekuitas" harus juga memuat kedua frasa kunci.
check("G2k KELAS: tabel likuidasi + biaya + urutan klaim di seksi yang sama",
      s55 is not None and "Nilai likuidasi" in s55 and "Nilai ekuitas" in s55
      and "biaya likuidasi" in s55 and "Urutan klaim" in s55)

# ============================================================
# Struktur + jangkar kanonis BERTAHAN
# ============================================================
check("S1a <p> seimbang di i2 (buka == tutup, termasuk <p ...>)",
      len(re.findall(r"<p(?:\s[^>]*)?>", i2)) == i2.count("</p>"))
check("K1 WACC Opsi A 9,39% hadir", "9,39%" in i2)
check("K2 target Rp2.062 hadir", "Rp2.062" in i2)
check("K3 invalidasi Rp1.400 hadir", "Rp1.400" in read("i3/index.html"))
check("K4 MOS ≈27% hadir", "MOS ≈27%" in i2)
check("K5 gerbang simulator TIDAK berubah (skor 3+2+3+2=10, PASS ≥7)",
      'var verdict = (score>=7 && decOk) ? "LULUS" : "BELUM LULUS";' in read("js/simulator.js")
      and "score = 0, max = 10" in read("js/simulator.js"))

# ============================================================
# Sintaks JS + guard R8 bertahan (152/152; di dalamnya R7 49/49)
# ============================================================
for js in sorted((ROOT / "js").glob("*.js")):
    r = subprocess.run(["node", "--check", str(js)], capture_output=True, text=True)
    check(f"JS node --check {js.name}", r.returncode == 0, r.stderr.strip()[:120])

r8 = subprocess.run([sys.executable, str(ROOT / "qa" / "qa_investment_r8.py")],
                    capture_output=True, text=True)
check("R8 guard bertahan 152/152", r8.returncode == 0,
      r8.stdout.strip().splitlines()[-1] if r8.stdout else r8.stderr[:120])

print(f"PASS {len(passes)}/{len(passes)+len(fails)}")
for f in fails:
    print("FAIL:", f)
sys.exit(1 if fails else 0)
