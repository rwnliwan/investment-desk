#!/usr/bin/env python3
"""Harness verifikasi fix Investment Desk ronde 9 (dibuat 2026-11-09).

Scope: 2 must + 4 should + 6 nit + 2 gap (laporan
kelontong-review/reviews10/r9-investment-report.md, terverifikasi +
second opinion Terra; V-M1 must DIPERTAHANKAN koordinator 2-1 atas
dissent Terra must->should; fix mengikuti varian Terra: nyatakan
perbedaan eksplisit, pertahankan label "2" yang dikunci guard S1d).

Guard gap yang dikunci (perintah Septian 00:23, AGENTS.md):
  GG-29 (BARU) — fungsi validasi/peringatan baru ronde 8 (S4/S5/G2)
    tidak diuji terhadap frasa/format rumah: matriks format rumah
    untuk substanceChecks / hasThreeNumberedRisks /
    consistencyWarnings, DIEKSEKUSI di Node atas kode sumber persis:
    (a) contoh sah format rumah HARUS lolos ("Rp2.450"/"Rp210" tanpa
    spasi, "Rp 2.450", "pangsa pasar 18%->22%");
    (b) contoh kosong berangka HARUS ditolak ("1. A -> B; 2. C -> D;
    3. E -> F", "risiko 1 Rp", "Rp1.900 / Rp2.500 / Rp3.000" tanpa
    sebab-dampak, nomor daftar/sitasi "I3"/"§4" bukan angka substantif);
    (c) frasa rumah yang menyerupai pola HARUS dikecualikan dari
    peringatan ("target awal Rp...", "dividen per saham Rp...",
    "EPS per saham Rp...").
  GG-4 (diperkuat) — aturan lesson sendiri dilanggar (R9 V-S3/V-N2):
    tiap kalimat "Keputusan:" di i2 §5 yang menyebut MOS/upside WAJIB
    dibandingkan dengan ambang §2 sesuai jenis emitennya (KELAS, bukan
    hanya string V-S3/V-N2): memadai / belum memadai / PASS / di bawah
    lantai. Plus cek spesifik §5.1 (MOS 13% di bawah lantai 15-20%)
    dan §5.3 (MOS 25%/20% di bawah ambang siklikal 30-40%).
  GG-14 (diperkuat) — vonis kualitas-laba (R9 V-S1/V-N1): daftar
    terlarang R8 berbasis string bolong ("Labanya tidak menjadi kas"
    lolos karena "Labanya" != "laba"; "laba tanpa kas" tidak ada di
    daftar). Perbaikan: normalisasi sebelum pencocokan (lowercase +
    "labanya"->"laba") + "laba tanpa kas" masuk daftar + aturan
    kualifikasi: frasa terlarang HANYA lolos bila chunk yang sama
    memuat kualifikasi ("kecuali"/"telusuri"/"dapat dijelaskan").
    KETERBATASAN (jujur): normalisasi + daftar tumbuh tetap berbasis
    string — parafrasa baru ("labanya tak pernah jadi duit") bisa
    lolos; mitigasi: daftar tumbuh + sertakan ke prompt review
    ronde berikut. CATATAN: pemindaian semua-string ini juga menangkap
    satu instans kelas-yang-sama di luar 14 item R9 — why Q4 emiten C
    simulator ("labanya tidak jadi kas", tanpa kualifikasi) — difix
    bersama V-S1/V-N1 sebagai temuan kelas-yang-sama guard ini
    (bukan item DeepSeek/Terra).
Checks (14 item R9: 2 must + 4 should + 6 nit + 2 gap):
  V-M1  i4 "2 risiko" vs I1/simulator "3 risiko": nyatakan perbedaan
        eksplisit di i4 (pitch 2 menit vs thesis komite), label "2"
        tetap (guard S1d bertahan)
  V-M2  regex \\bRp\\b -> \\bRp\\s*\\d di bullOk + riskOk (GG-29)
  V-S1  kunci kuis i2.js Q5: "Labanya tidak menjadi kas" -> rumusan
        red flag (perlu ditelusuri)
  V-S2  ujung 20% diskon holding dihitung (§5.1): EV 3.264, target
        Rp2.464 < harga Rp2.500 -> PASS
  V-S3  vonis §5.3: MOS 25%/20% di bawah ambang siklikal 30-40% (§2)
  V-S4  angka risiko: buang nomor daftar/sitasi sebelum menghitung;
        "->" bukan satu-satunya satuan (GG-29)
  V-N1  why kuis i1.js Q4: "laba tanpa kas" + klausa kualifikasi
  V-N2  "tetap menarik" MOS ~13% -> "di bawah lantai MOS (15-20%)"
  V-N3  notasi "3.280 ÷ 1.000 = 3.280" -> "3.280 M ÷ 1.000 jt saham
        = Rp3.280/saham"
  V-N4  kotak sensitivitas §6: bobot tetap dinyatakan + nilai iterasi
        titik-tetap (≈Rp1.826, WACC ≈10,07%)
  V-N5  cek 4 consistencyWarnings: "target awal Rp..." tidak memicu
        peringatan palsu (GG-29)
  V-N6  _consRpNums: "dividen per saham Rp81" dikecualikan (GG-29)
  V-G1  prosedur memilih/menjustifikasi kelipatan (§5.1 + §5.3)
  V-G2  kriteria panjang jendela siklus (§5.3)
Plus: guard R9 di-re-run sebagai subprocess (36/36 harus bertahan,
yang di dalamnya me-re-run R8 152/152 + R7 49/49) + node --check
semua JS. Angka kanonis TIDAK berubah (WACC Opsi A 9,39%, EV
Rp2.417 M, target Rp2.062, invalidasi Rp1.400).
Jalankan: python3 qa/qa_investment_r10.py  (dari root repo investment-desk)
Exit 0 = semua PASS.
"""
import json, re, subprocess, sys, tempfile
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

i1 = read("i1/index.html")
i2 = read("i2/index.html")
i4 = read("i4/index.html")
i1js = read("js/i1.js")
i2js = read("js/i2.js")
sim = read("js/simulator.js")
simhtml = read("simulator/index.html")

def section(html, start_marker, end_marker):
    s = html.find(start_marker)
    e = html.find(end_marker, s + 1) if s != -1 else -1
    if s == -1 or e == -1:
        return None
    return html[s:e]

s51 = section(i2, "5.1 · SOTP", "5.2 · DDM")
s53 = section(i2, "5.3 · Mid-cycle", "5.4 · Reverse-DCF")
s6 = section(i2, "6 · Dari mana WACC", "Quiz — gate 80%")

def extract_fn(src, name):
    m = re.search(r"function " + re.escape(name) + r"\s*\(", src)
    if not m:
        return None
    i = src.index("{", m.start())
    depth, j = 0, i
    while j < len(src):
        if src[j] == "{":
            depth += 1
        elif src[j] == "}":
            depth -= 1
            if depth == 0:
                return src[m.start():j + 1]
        j += 1
    return None

def run_node(fn_name, fn_src, cases):
    driver = fn_src + "\nvar __out = " + json.dumps(cases) + ".map(function(a){ return " \
        + fn_name + ".apply(null, a); });\nconsole.log(JSON.stringify(__out));\n"
    with tempfile.NamedTemporaryFile("w", suffix=".js", delete=False) as f:
        f.write(driver)
        path = f.name
    try:
        r = subprocess.run(["node", path], capture_output=True, text=True, timeout=30)
        if r.returncode != 0:
            return None, r.stderr.strip()[:200]
        return json.loads(r.stdout.strip()), ""
    except Exception as e:
        return None, str(e)[:200]
    finally:
        Path(path).unlink(missing_ok=True)

# ============================================================
# GG-29 — matriks format rumah, dieksekusi di Node atas kode
# sumber persis (V-M2, V-S4, V-N5, V-N6).
# ============================================================
_sim_nocomment = re.sub(r"/\*.*?\*/", "", sim, flags=re.S)
_sim_nocomment = re.sub(r"//[^\n]*", "", _sim_nocomment)
check("GG29a regex lama \\bRp\\b HILANG dari kode js/simulator.js (komentar dikecualikan)",
      r"\bRp\b" not in _sim_nocomment)
check("GG29b regex baru \\bRp\\s*\\d hadir (bullOk + riskOk)",
      sim.count(r"\bRp\s*\d") >= 2)
check("GG29c hasUnit tetap menerima Rp tanpa spasi (\\bRp tanpa \\b akhir)",
      r"/(%|\bRp|miliar" in sim)

fn_sub = extract_fn(sim, "substanceChecks")
check("GG29d substanceChecks terdefinisi", fn_sub is not None)
RISK3 = ("1. Daya beli turun 10% → target Rp1.900; "
         "2. Margin EBIT turun >1,5pp → re-hitung target; "
         "3. Utang naik 50% → WACC naik")
INV_OK = "harga menyentuh Rp1.400"
if fn_sub:
    cases = [
        # (a) contoh sah format rumah HARUS lolos
        ["FCFF Rp210 M, WACC 9,5%", RISK3, INV_OK],
        ["Target Rp2.450 dari harga Rp1.800", RISK3, "FCFF turun ≥20%"],
        ["Target Rp 2.450, upside 36%", RISK3, INV_OK],
        ["Pangsa pasar 18%→22% dalam 3 tahun", RISK3, INV_OK],
        # (b) contoh kosong berangka HARUS ditolak
        ["bagus 1x", "risiko 1 Rp", "harga 1 Rp"],
        ["1% saja", RISK3, INV_OK],
        ["Target 2450", "risiko 1 Rp", "CFO tetap jauh di bawah laba"],
        ["Target Rp2.450, upside 36%", "1. A → B; 2. C → D; 3. E → F", INV_OK],
        ["Target Rp2.450, upside 36%", "Rp1.900 / Rp2.500 / Rp3.000", INV_OK],
        # risiko substantif 1 poin (tanpa nomor) tetap lolos per-field;
        # penomoran 3 poin diuji hasThreeNumberedRisks, bukan di sini
        ["Target Rp2.450, upside 36%", "SSS −8% bikin target Rp1.815", INV_OK],
    ]
    res, err = run_node("substanceChecks", fn_sub, cases)
    if res is None:
        check("GG29e eksekusi Node substanceChecks", False, err)
    else:
        check("GG29f bull 'FCFF Rp210 M, WACC 9,5%' lolos",
              res[0] == {"bull": True, "risk": True, "inv": True}, f"dapat {res[0]}")
        check("GG29g bull 'Target Rp2.450 dari harga Rp1.800' (tanpa spasi) lolos",
              res[1]["bull"] is True, f"dapat {res[1]}")
        check("GG29h bull 'Target Rp 2.450' (dengan spasi) tetap lolos",
              res[2]["bull"] is True, f"dapat {res[2]}")
        check("GG29i bull 'pangsa pasar 18%->22%' lolos",
              res[3]["bull"] is True, f"dapat {res[3]}")
        check("GG29j 'bagus 1x / risiko 1 Rp / harga 1 Rp' SEMUA ditolak",
              res[4] == {"bull": False, "risk": False, "inv": False}, f"dapat {res[4]}")
        check("GG29k '1% saja' bull ditolak",
              res[5]["bull"] is False, f"dapat {res[5]}")
        check("GG29l 'Target 2450' tanpa satuan ditolak",
              res[6]["bull"] is False and res[6]["inv"] is False, f"dapat {res[6]}")
        check("GG29m risiko '1. A -> B; 2. C -> D; 3. E -> F' (nomor daftar + panah saja) ditolak",
              res[7]["risk"] is False, f"dapat {res[7]}")
        check("GG29n risiko 'Rp1.900 / Rp2.500 / Rp3.000' (tiga harga tanpa sebab-dampak) ditolak",
              res[8]["risk"] is False, f"dapat {res[8]}")
        check("GG29o risiko substantif 1 poin 'SSS -8% bikin target Rp1.815' lolos",
              res[9]["risk"] is True, f"dapat {res[9]}")

fn_risk3 = extract_fn(sim, "hasThreeNumberedRisks")
check("GG29p hasThreeNumberedRisks terdefinisi", fn_risk3 is not None)
if fn_risk3:
    cases = [["1. a 2. b 3. c"], ["1) a 2) b 3) c"], [RISK3],
             ["Rp1.900 / 2.500 / Rp3.000"], ["1. a 2. b"],
             ["Daya beli turun 10% → target Rp1.900"],
             ["lihat I3 §4 untuk risiko"]]
    res, err = run_node("hasThreeNumberedRisks", fn_risk3, cases)
    if res is None:
        check("GG29q eksekusi Node hasThreeNumberedRisks", False, err)
    else:
        check("GG29r '1./2./3.' lolos", res[0] is True, f"dapat {res[0]}")
        check("GG29s '1)/2)/3)' lolos", res[1] is True, f"dapat {res[1]}")
        check("GG29t contoh kanonis 3 poin lolos", res[2] is True, f"dapat {res[2]}")
        check("GG29u 'Rp1.900 / 2.500 / Rp3.000' (tiga harga) DITOLAK",
              res[3] is False, f"dapat {res[3]}")
        check("GG29v dua poin ditolak", res[4] is False, f"dapat {res[4]}")
        check("GG29w satu risiko ditolak", res[5] is False, f"dapat {res[5]}")
        check("GG29x sitasi 'I3 §4' saja ditolak", res[6] is False, f"dapat {res[6]}")

# --- consistencyWarnings: frasa rumah yang menyerupai pola ---
fn_cons = extract_fn(sim, "consistencyWarnings")
fn_cfmt = extract_fn(sim, "_consFmt")
fn_crp = extract_fn(sim, "_consRpNums")
fn_cpct = extract_fn(sim, "_consPctAfter")
check("GG29y consistencyWarnings + helper terdefinisi",
      fn_cons is not None and fn_crp is not None and fn_cpct is not None)
if fn_cons and fn_cfmt and fn_crp and fn_cpct:
    _src = fn_cfmt + "\n" + fn_crp + "\n" + fn_cpct + "\n" + fn_cons
    _base = {"target": 2450, "mkt": 1800, "method": "dcf",
             "bull": "FCFF Rp210 M tumbuh 4% (WACC 9,5%) — target Rp2.450, upside 36%",
             "risk": RISK3, "inv": "harga menyentuh Rp1.400",
             "fcff": 210, "wacc": 9.5, "g": 4, "debt": 600, "shares": 1375,
             "eps": None, "mult": None, "div": None, "payout": None, "req": None}
    def _o(**kw):
        d = dict(_base)
        d.update(kw)
        return d
    _cases = [
        ("lolos penuh (A benar)", _o(), 0),
        ("bull Rp salah (Rp3.000) tetap diperingatkan", _o(bull="target Rp3.000, upside 36%"), 1),
        ("risiko target >= target awal (Rp2.600) tetap diperingatkan",
         _o(risk="1. Daya beli turun 10% → target Rp2.600; 2. x; 3. y"), 1),
        ("V-N5 'target awal Rp2.450, dampak risiko Rp1.900' TIDAK diperingatkan",
         _o(risk="target awal Rp2.450, dampak risiko Rp1.900"), 0),
        ("V-N6 'dividen per saham Rp81' TIDAK diperingatkan",
         _o(bull="Dividen per saham Rp81 — target Rp2.450, upside 36%"), 0),
        ("V-N6 'EPS per saham Rp180' TIDAK diperingatkan",
         _o(bull="EPS per saham Rp180 — target Rp2.450, upside 36%"), 0),
        ("'Dividen Rp81' (tanpa 'per saham') tetap dikecualikan",
         _o(bull="Dividen Rp81 — target Rp2.450, upside 36%"), 0),
    ]
    _driver_cases = json.dumps([c[1] for c in _cases]).replace("null", "NaN")
    _driver = _src + "\nvar __out = " + _driver_cases + \
        ".map(function(a){ return consistencyWarnings(a).length; });\nconsole.log(JSON.stringify(__out));\n"
    with tempfile.NamedTemporaryFile("w", suffix=".js", delete=False) as f:
        f.write(_driver)
        _p = f.name
    try:
        _r = subprocess.run(["node", _p], capture_output=True, text=True, timeout=30)
        _res = json.loads(_r.stdout.strip()) if _r.returncode == 0 else None
        _err = _r.stderr.strip()[:200]
    except Exception as e:
        _res, _err = None, str(e)[:200]
    finally:
        Path(_p).unlink(missing_ok=True)
    if _res is None:
        check("GG29z eksekusi Node consistencyWarnings", False, _err)
    else:
        for (_name, _o_dict, _want), _got in zip(_cases, _res):
            check(f"GG29z-{_name}: {_want} peringatan",
                  _got == _want, f"dapat {_got}")

# ============================================================
# GG-14 (diperkuat) — vonis kualitas-laba: normalisasi +
# daftar terlarang diperluas + aturan kualifikasi (V-S1, V-N1, V-M1)
# ============================================================
def _norm(s):
    s = s.lower()
    s = re.sub(r"\blaba\w*", "laba", s)  # labanya/laba -> laba
    return re.sub(r"\s+", " ", s)

FORBIDDEN_N = ["laba tidak menjadi kas", "laba tidak jadi kas",
               "laba kertas", "value trap klasik", "laba tanpa kas"]
QUALIFIERS = ["kecuali", "telusuri", "dapat dijelaskan",
              "dijelaskan oleh", "bisa jadi", "belum membuktikan",
              "bukan bukti"]

def _js_answer_strings(txt):
    return re.findall(r'(?:a|why):"((?:[^"\\]|\\.)*)"', txt)

def _js_all_strings(txt):
    # Semua string literal JS (bukan hanya a:/why:) — opsi kuis (opts[])
    # juga membawa vonis, dan R9 V-S1 justru bersembunyi di opts[].
    return re.findall(r'"((?:[^"\\]|\\.)*)"', txt)

def _html_chunks(txt):
    out = re.findall(r"<(?:p|li)[^>]*>(.*?)</(?:p|li)>", txt, re.S)
    return [re.sub(r"<[^>]+>", " ", c) for c in out]

_unqual = []
for _name, _txt in ALL.items():
    _chunks = (_js_all_strings(_txt) if _name.endswith(".js")
               else _html_chunks(_txt))
    for _c in _chunks:
        _n = _norm(_c)
        for _f in FORBIDDEN_N:
            if _f in _n and not any(q in _n for q in QUALIFIERS):
                _unqual.append(f"{_name}: {_f} :: {_c[:70]}")
check("GG14a frasa terlarang TANPA kualifikasi: 0 kemunculan repo-wide (normalisasi labanya->laba)",
      not _unqual, "; ".join(_unqual)[:250])

q5 = re.search(r'q:"P/E 8x bisa menipu[^"]*",\s*opts:\[(.*?)\],\s*ans:1,\s*why:"([^"]*)"', i2js, re.S)
check("GG14b kunci kuis i2.js Q5 ditemukan", q5 is not None)
if q5:
    _opts, _why = q5.group(1), q5.group(2)
    check("GG14c opsi kunci Q5 TIDAK lagi 'Labanya tidak menjadi kas'",
          "tidak menjadi kas" not in _opts and "tidak jadi kas" not in _opts)
    check("GG14d opsi kunci Q5 menyebut CFO jauh di bawah laba + perlu ditelusuri",
          "CFO jauh di bawah laba" in _opts and "telusuri" in _opts)
    check("GG14e why Q5 tetap 'telusuri penyebabnya'",
          "telusuri penyebabnya" in _why)

q4 = re.search(r'q:"Dalam thesis testing 3 lensa[^"]*",\s*opts:\[.*?\],\s*ans:1,\s*why:"([^"]*)"', i1js, re.S)
check("GG14f why kuis i1.js Q4 ditemukan", q4 is not None)
if q4:
    _w = q4.group(1)
    check("GG14g why Q4 mengualifikasi 'laba tanpa kas' (kecuali + waktu kas/modal kerja)",
          "laba tanpa kas" in _w and "kecuali" in _w
          and ("waktu kas" in _w or "modal kerja" in _w))
    check("GG14h why Q4 mewajibkan telusur dulu",
          "ditelusuri" in _w or "telusuri" in _w)

# --- V-M1: kontradiksi 2 vs 3 risiko dinyatakan eksplisit (GG-14) ---
check("V-M1a i4 §1 menyatakan perbedaan eksplisit (pitch 2 menit vs thesis komite)",
      "2 risiko" in i4 and "3 risiko terbesar" in i4
      and "pitch" in i4.lower() and "simulator" in i4.lower())
check("V-M1b i4 menyebut gerbang simulator menolak < 3 poin bernomor",
      "simulator" in i4 and "3 poin" in i4)
check("V-M1c label '2 risiko terbesar' TETAP di i4 (guard S1d bertahan)",
      "2 risiko terbesar" in i4)
check("V-M1d I1 §1 tetap '3 risiko terbesar'",
      "3 risiko terbesar" in i1)
check("V-M1e simulator tetap '3 risiko terbesar' (label + gerbang)",
      "3 risiko terbesar" in simhtml and "hasThreeNumberedRisks(risk)" in sim)

# ============================================================
# GG-4 (diperkuat) — aturan lesson sendiri: verdict contoh vs
# ambang MOS §2 (V-S3, V-N2 + KELAS atas semua Keputusan §5)
# ============================================================
check("GG4a ambang §2 tetap: stabil 15-20%, siklikal 30-40%",
      "MOS 15–20%" in i2 and "MOS 30–40%" in i2)
check("GG4b §5.1: MOS ~13% (diskon 10%) dinyatakan di bawah lantai MOS",
      s51 is not None and "di bawah lantai MOS" in s51)
check("GG4c §5.1: label 'tetap menarik' untuk MOS ~13% HILANG",
      s51 is not None and "tetap menarik" not in s51)
check("GG4d §5.3: MOS 25%/20% dinyatakan di bawah ambang siklikal + belum memadai",
      s53 is not None and "belum memadai" in s53 and "30–40%" in s53)
# KELAS: tiap paragraf "Keputusan:" di §5 yang menyebut MOS wajib
# memuat vonis (memadai / belum memadai / PASS / di bawah).
sec5 = section(i2, "5 · Contoh kerja", "6 · Dari mana WACC")
_mos_no_verdict = []
if sec5:
    for _p in re.findall(r"<p>(.*?)</p>", sec5, re.S):
        _t = re.sub(r"<[^>]+>", " ", _p)
        if "Keputusan" in _t and "MOS" in _t:
            if not re.search(r"memadai|PASS|di bawah", _t):
                _mos_no_verdict.append(_t[:80])
check("GG4e KELAS: tiap Keputusan §5 yang menyebut MOS memuat vonis",
      not _mos_no_verdict, "; ".join(_mos_no_verdict)[:200])

# ============================================================
# V-S2 — ujung 20% diskon holding (§5.1)
# ============================================================
check("V-S2a kasus 20% hadir: EV 4.080 x 0,8 = 3.264",
      s51 is not None and "4.080 × 0,8 = 3.264" in s51)
check("V-S2b target 20% Rp2.464 di bawah harga Rp2.500 -> PASS",
      s51 is not None and "Rp2.464" in s51 and "PASS" in s51)
check("V-S2c hitung ulang: 4080*0,8=3264; 3264-800=2464; upside -1,4%",
      4080 * 0.8 == 3264 and 3264 - 800 == 2464
      and abs((2464 - 2500) / 2500 * 100 + 1.44) < 0.01)
check("V-S2d kasus 10% tetap: EV 3.672 -> target Rp2.872",
      s51 is not None and "4.080 × 0,9 = 3.672" in s51 and "Rp2.872" in s51)

# ============================================================
# V-N3 — notasi pembagian unit (§5.1)
# ============================================================
check("V-N3a notasi baru: '3.280 M ÷ 1.000 jt saham = Rp3.280/saham'",
      s51 is not None and "3.280 M ÷ 1.000 jt saham = Rp3.280/saham" in s51)
check("V-N3b notasi lama '3.280 ÷ 1.000 = 3.280' HILANG",
      "3.280 ÷ 1.000 = 3.280" not in i2)

# ============================================================
# V-N4 — kotak sensitivitas §6: bobot tetap + nilai iterasi
# ============================================================
check("V-N4a asumsi bobot tetap dinyatakan",
      s6 is not None and "bobot ditahan 69,1%/30,9%" in s6)
check("V-N4b nilai iterasi titik-tetap hadir (WACC ~10,07%, target ~Rp1.826)",
      s6 is not None and "10,07%" in s6 and "≈Rp1.826" in s6)
check("V-N4c angka bobot-tetap tetap: WACC 10,22% -> target ~Rp1.778 (-14%)",
      s6 is not None and "10,22%" in s6 and "≈Rp1.778" in s6)
# Hitung ulang independen iterasi titik-tetap (CoE 12%, CoD 6,24%,
# utang bruto 900, net debt 400, FCFF 150, g 3%, saham 978 jt).
_w = 0.1022
for _ in range(20):
    _ev = 154.5 / (_w - 0.03)
    _eq = _ev - 400
    _w = (_eq / (_eq + 900)) * 0.12 + (900 / (_eq + 900)) * 0.0624
_tgt = _eq / 0.978
check("V-N4d hitung ulang iterasi: WACC 10,07% / EV 2.185 / target 1.826",
      abs(_w * 100 - 10.07) < 0.02 and abs(_ev - 2185) < 2
      and abs(_tgt - 1826) < 2, f"WACC {_w*100:.2f}% EV {_ev:.0f} target {_tgt:.0f}")

# ============================================================
# V-G1 — prosedur memilih/menjustifikasi kelipatan (§5.1 + §5.3)
# ============================================================
check("V-G1a §5.1: prosedur kelipatan hadir (median peer sejenis)",
      s51 is not None and "median" in s51.lower() and "peer" in s51.lower())
check("V-G1b §5.1: penyesuaian growth/ROE/risiko vs peer disebut",
      s51 is not None and ("pertumbuhan" in s51.lower() or "growth" in s51.lower())
      and "ROE" in s51)
check("V-G1c §5.1: cross-check kelipatan dengan DCF disebut",
      s51 is not None and "cross-check" in s51.lower() and "DCF" in s51)
check("V-G1d §5.3: cara memilih kelipatan normal 8x hadir (median historis/peer)",
      s53 is not None and ("median historis" in s53.lower() or "median peer" in s53.lower()))

# ============================================================
# V-G2 — kriteria panjang jendela siklus (§5.3)
# ============================================================
check("V-G2a §5.3: jendela wajib mencakup satu siklus penuh",
      s53 is not None and "satu siklus penuh" in s53)
check("V-G2b §5.3: satu puncak dan satu palung disebut",
      s53 is not None and "puncak" in s53 and "palung" in s53)
check("V-G2c §5.3: deret 10 tahun tetap (rata-rata 400, median 375)",
      s53 is not None and "Rp400" in s53 and "Rp375" in s53)

# ============================================================
# Struktur + jangkar kanonis BERTAHAN + gerbang simulator TIDAK berubah
# ============================================================
check("S1a <p> seimbang di i2 (buka == tutup, termasuk <p ...>)",
      len(re.findall(r"<p(?:\s[^>]*)?>", i2)) == i2.count("</p>"))
check("S1b <p> seimbang di i4",
      len(re.findall(r"<p(?:\s[^>]*)?>", i4)) == i4.count("</p>"))
check("K1 WACC Opsi A 9,39% hadir (angka lama 9,97% hanya di catatan koreksi)",
      "9,39%" in i2 and i2.count("9,97%") == 1)
check("K2 target Rp2.062 + EV Rp2.417 M hadir", "Rp2.062" in i2 and "Rp2.417 M" in i2)
check("K3 invalidasi Rp1.400 hadir", "Rp1.400" in read("i3/index.html"))
check("K4 MOS ≈27% hadir", "MOS ≈27%" in i2)
check("K5 gerbang simulator TIDAK berubah (skor 3+2+3+2=10, PASS ≥7)",
      'var verdict = (score>=7 && decOk) ? "LULUS" : "BELUM LULUS";' in sim
      and "score = 0, max = 10" in sim)

# ============================================================
# Sintaks JS + guard R9 bertahan (36/36; di dalamnya R8 152/152 + R7 49/49)
# ============================================================
for js in sorted((ROOT / "js").glob("*.js")):
    r = subprocess.run(["node", "--check", str(js)], capture_output=True, text=True)
    check(f"JS node --check {js.name}", r.returncode == 0, r.stderr.strip()[:120])

r9 = subprocess.run([sys.executable, str(ROOT / "qa" / "qa_investment_r9.py")],
                    capture_output=True, text=True)
check("R9 guard bertahan 36/36", r9.returncode == 0,
      r9.stdout.strip().splitlines()[-1] if r9.stdout else r9.stderr[:120])

print(f"PASS {len(passes)}/{len(passes)+len(fails)}")
for f in fails:
    print("FAIL:", f)
sys.exit(1 if fails else 0)
