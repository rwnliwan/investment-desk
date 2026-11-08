#!/usr/bin/env python3
"""Harness verifikasi fix Investment Desk ronde 7 Terra (dibuat 2026-11-08).

Checks (10 item R7: 2 must + 6 should + 2 nit):
  M1. ROE < CoE tidak otomatis menyusutkan nilai buku (i2 §3 butir 2)
  M2. Likuidasi Rp0 hanya dalam skenario likuidasi (i2 §5.5)
  S1. Kuis I1 samakan SSS -8% -> FCFF -10% dengan prose (js/i1.js)
  S2. "Laba kertas" -> red flag yang ditelusuri (i2 §3 + js/i2.js)
  S3. Nilai tetap tidak pasti, MOS 15-20% ilustratif (i2 §2)
  S4. Holding discount: basis EV + asumsi ilustratif + larangan double-count (i2 §5.1)
  S5. Aturan multiples ulangi pengecualian SOTP/mid-cycle (i2 §3)
  S6. Beranda jujur: keputusan dilatih via contoh kerja + simulator (index.html)
  N1. Markup paragraf SOTP seimbang (i2 §5.1)
  N2. Batas eksak Rp1.874,55 tertulis sekali di I3 §1 (nit, ambang Rp1.875 BENAR)
Plus: jangkar kanonis BERTAHAN (WACC Opsi A 9,39%, target Rp2.062,
invalidasi Rp1.400, FCFF -20% -> JUAL, parseIDNumber ketat) + node --check.
Jalankan: python3 qa/qa_investment_r7.py  (dari root repo investment-desk)
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

ALL = {}
for p in sorted(ROOT.rglob("*")):
    if p.suffix in (".html", ".js") and p.is_file() and "node_modules" not in p.parts:
        ALL[str(p.relative_to(ROOT))] = p.read_text(encoding="utf-8")
BLOB = "\n".join(ALL.values())

i2 = read("i2/index.html")
i3 = read("i3/index.html")
home = read("index.html")

# --- M1: nilai buku tumbuh ROE x retensi bila ROE positif ---
check("M1a frasa lama hilang: 'bukunya menyusut'", "bukunya menyusut" not in BLOB)
check("M1b mekanisme ROE x retensi hadir", "ROE × retensi" in i2)
check("M1c contoh 5% x 50% -> 2,5%/tahun", "2,5%/tahun" in i2 and "ROE 5%" in i2)
check("M1d syarat susut benar: rugi / payout > 100%",
      "rugi (ROE negatif)" in i2 and "payout &gt; 100%" in i2)
check("M1e hitung ulang: 0,05 x 0,50 = 0,025", abs(0.05 * 0.50 - 0.025) < 1e-12)

# --- M2: likuidasi Rp0 hanya dalam skenario ---
check("M2a frasa lama hilang: 'berapapun harga pasarnya'",
      "berapapun harga pasarnya" not in BLOB)
check("M2b skenario dibatasi: 'Dalam skenario likuidasi ini'",
      "Dalam skenario likuidasi ini" in i2)
check("M2c PASS bersyarat pada skenario",
      "PASS</strong> pada harga positif bila skenario likuidasi ini" in i2)
check("M2d nilai opsi/restrukturisasi di luar skenario",
      "Nilai opsi ekuitas / restrukturisasi berada di luar skenario ini" in i2)
check("M2e hitung ulang: 550-900=-350 -> Rp0",
      100 + 140 + 150 + 160 == 550 and 550 - 900 == -350)

# --- S1: kuis I1 samakan dengan prose ---
i1js = read("js/i1.js")
check("S1a why kuis: SSS -8% -> FCFF -10%",
      "same-store sales −8% → asumsi FCFF −10%" in i1js)
check("S1b 'volume −10%' hilang dari kuis", "volume −10%" not in i1js)
check("S1c prose I1 §2 tetap SSS -8%",
      "same-store sales −8%" in read("i1/index.html"))

# --- S2: laba kertas -> red flag ---
check("S2a 'laba kertas' hilang repo-wide", "laba kertas" not in BLOB)
check("S2b i2: CFO jauh di bawah laba = red flag, telusuri penyebab",
      "red flag — telusuri penyebabnya" in i2)
check("S2c i2: penyebab sah disebut (waktu kas / modal kerja)",
      "perbedaan waktu penerimaan kas dan perubahan modal kerja" in i2)
check("S2d why kuis i2: red flag + telusuri",
      "red flag; telusuri penyebabnya" in read("js/i2.js"))

# --- S3: nilai tetap tidak pasti ---
check("S3a 'hanya harga, bukan nilai' hilang",
      "yang tidak pasti hanya harga, bukan nilai" not in BLOB)
check("S3b nilai relatif dapat diperkirakan tapi tetap tidak pasti",
      "nilai relatif lebih dapat diperkirakan, tetapi tetap tidak pasti" in i2)
check("S3c ambang ilustratif, bukan jaminan",
      "ambang ilustratif, bukan jaminan" in i2)

# --- S4: holding discount ---
check("S4a 'biasanya diperdagangkan 10–20%' hilang",
      "biasanya diperdagangkan 10–20%" not in BLOB)
check("S4b rentang = asumsi ilustratif", "asumsi ilustratif diskon 10–20%" in i2)
check("S4c basis diskon = EV segmen", "atas <strong>EV segmen</strong>" in i2)
check("S4d larangan double-count", "jangan menghitung pengurang yang sama dua kali" in i2)
check("S4e hitung ulang: 4080x0,9-800=2872", abs(4080 * 0.9 - 800 - 2872) < 1e-9)

# --- S5: pengecualian multiples diulang di aturan praktis ---
check("S5a aturan praktis ulangi pengecualian SOTP/mid-cycle",
      "Pengecualiannya SOTP dan mid-cycle earnings" in i2)
check("S5b 'tanpa justifikasi' di penutup aturan",
      'hanya karena "P/E-nya 8x" tanpa justifikasi' in i2)

# --- S6: beranda jujur soal tugas keputusan ---
check("S6a 'berakhir dengan keputusan' hilang", "berakhir dengan" not in home)
check("S6b keputusan dilatih via contoh kerja + simulator komite",
      "simulator komite" in home and "contoh kerja" in home)
check("S6c klaim I4 tetap (pitch + paket lamaran)",
      "stock pitch 2 menit" in home)

# --- N1: markup SOTP seimbang ---
check("N1a '<p>Satu pertimbangan' hadir", "<p>Satu pertimbangan" in i2)
check("N1b tidak ada '</p> Satu pertimbangan' (teks tanpa pembuka)",
      "</p> Satu pertimbangan" not in i2)
check("N1c <p> seimbang di i2 (buka == tutup, termasuk <p ...>)",
      len(re.findall(r"<p(?:\s[^>]*)?>", i2)) == i2.count("</p>"))

# --- N2: batas eksak Rp1.874,55 ---
check("N2a batas eksak tertulis di I3 §1", "batas eksak Rp1.874,55" in i3)
check("N2b hanya sekali di I3", i3.count("batas eksak Rp1.874,55") == 1)
check("N2c hitung ulang: 2062/1,10 = 1874,55",
      abs(2062 / 1.10 - 1874.5454545454545) < 1e-9)
check("N2d upside di Rp1.875 = 9,97% < 10% (pemicu aktif)",
      abs(187 / 1875 - 0.09973333333333333) < 1e-12 and 187 / 1875 < 0.10)

# --- Jangkar kanonis BERTAHAN ---
check("K1 WACC Opsi A 9,39% hadir", "9,39%" in i2)
check("K2 target Rp2.062 hadir", "Rp2.062" in i2 and "Rp2.062" in i3)
check("K3 invalidasi Rp1.400 hadir", "Rp1.400" in i3)
check("K4 FCFF -20% -> JUAL hadir", "FCFF turun ≥20%" in i3)
check("K5 parseIDNumber ketat (peringatan ribuan)",
      "Setiap kelompok ribuan setelah titik harus tepat 3 digit" in read("js/common.js"))

# --- Sintaks JS ---
for js in sorted((ROOT / "js").glob("*.js")):
    r = subprocess.run(["node", "--check", str(js)], capture_output=True, text=True)
    check(f"JS node --check {js.name}", r.returncode == 0, r.stderr.strip()[:120])

print(f"PASS {len(passes)}/{len(passes)+len(fails)}")
for f in fails:
    print("FAIL:", f)
sys.exit(1 if fails else 0)
