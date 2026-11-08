#!/usr/bin/env python3
"""Harness verifikasi fix Investment Desk ronde 8 Terra (dibuat 2026-11-09).

Guard gap yang dikunci (perintah Septian 00:23, AGENTS.md):
  GG-14 — cacat kelas sama di file di luar cakupan fix / kontradiksi
    lintas-lesson: R8 S2 mengulang kelas cacat R7 S2 ("laba kertas" ->
    red flag) di js/i4.js yang tak tercakup fix R7; R8 M1 = kontradiksi
    I4 vs I3 §4 (turun 20% -> tambah vs jual). Guard ini memindai silang
    konsistensi lintas-lesson (jangkar kanonis, rumusan red flag, jumlah
    risiko, label invalidasi).
  GG-10 — parser numerik, uji kedua arah + eksekusi: R7 hanya mengunci
    penolakan (parser ketat); Credit R8 MF-1 menunjukkan tepi penerimaan
    ("10.000.000" valid) bisa lolos dari guard. Guard ini MENGEKSEKUSI
    parseIDNumber dari js/common.js di Node: kasus terima DAN tolak,
    termasuk kasus Credit MF-1, + kunci definisi tunggal repo-wide.
Checks (13 item R8: 1 must + 7 should + 5 nit):
  M1  jawaban I4 "turun 20%" dijangkar kanonis (Rp1.200 < Rp1.400 -> JUAL)
  S1  contoh risiko pitch I4 memuat 2 risiko
  S2  jawaban CFO I4 = rumusan red flag R7 (telusuri, bukan vonis)
  S3  template jurnal I3 memuat formula + contoh MOS
  S4  substanceChecks() validasi pola per field (dieksekusi di Node)
  S5  simulator: 3 risiko bernomor (I1 §1), bukan 1 risiko utama
  S6  metode valuasi terikat input utama (checklist per metode, dieksekusi)
  S7  label C Q4 = Reverse-DCF / required growth, bukan INVALIDASI
  N1  batas eksak Rp1.874,55 di js/i4.js:40 (I3 tetap 1x — guard R7)
  N2  toleransi ±60 TIDAK membalik keputusan (kunci no-change: tol absolut)
  N3  parameter isDecimal dihapus (higiene; call site dibersihkan)
  N4  "P/E 10x murah" -> butuh pembanding peer/histori/pertumbuhan
  N5  quiz.js membersihkan class right/wrong sebelum grading ulang
Plus: guard R7 di-re-run sebagai subprocess (49/49 harus bertahan) +
node --check semua JS.
Jalankan: python3 qa/qa_investment_r8.py  (dari root repo investment-desk)
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

i3 = read("i3/index.html")
i4 = read("i4/index.html")
i4js = read("js/i4.js")
sim = read("js/simulator.js")
simhtml = read("simulator/index.html")
common = read("js/common.js")
quiz = read("js/quiz.js")

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

def extract_fn(src, name):
    """Ambil definisi 'function name(...){...}' (brace-matching) + var
    METHOD_INPUTS bila diminta."""
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

# ============================================================
# GG-10 — parser dua arah, dieksekusi (kasus terima + tolak)
# ============================================================
ACCEPT = {"10.000.000": 10000000, "1.234.567": 1234567, "2.500": 2500,
          "2.500,00": 2500, "2.26": 2.26, "10.7": 10.7, "36,1": 36.1,
          "2500": 2500, "2062": 2062, "1.800": 1800, "0,5": 0.5}
REJECT = ["2.0,62", "1.23.456", "2.", ",5", "2,,5", "abc", "", "2.500.00,5"]
fn_parse = extract_fn(common, "parseIDNumber")
check("GG10a parseIDNumber terdefinisi di js/common.js", fn_parse is not None)
check("GG10b definisi parseIDNumber tunggal repo-wide",
      len(re.findall(r"function parseIDNumber\s*\(", BLOB)) == 1,
      f"ketemu {len(re.findall(chr(102)+chr(117)+chr(110)+chr(99)+chr(116)+chr(105)+chr(111)+chr(110)+chr(32)+chr(112)+chr(97)+chr(114)+chr(115)+chr(101)+chr(73)+chr(68)+chr(78)+chr(117)+chr(109)+chr(98)+chr(101)+chr(114), BLOB))}")
if fn_parse:
    cases = [[k] for k in list(ACCEPT) + REJECT]
    res, err = run_node("parseIDNumber", fn_parse, cases)
    if res is None:
        check("GG10c eksekusi Node parseIDNumber", False, err)
    else:
        for k, want in ACCEPT.items():
            got = res[list(ACCEPT).index(k)]
            check(f"GG10-terima {k!r} -> {want}",
                  got is not None and abs(got - want) < 1e-9, f"dapat {got}")
        for k in REJECT:
            got = res[len(ACCEPT) + REJECT.index(k)]
            check(f"GG10-tolak {k!r} -> NaN", got is None, f"dapat {got}")
        # "10.000.000" (Credit R8 MF-1) secara eksplisit:
        check("GG10d kasus Credit MF-1 '10.000.000' diterima",
              res[list(ACCEPT).index("10.000.000")] == 10000000)
    # Properti umum kelas parser (bukan hanya kasus terdaftar): angka valid
    # Indonesia harus round-trip fmtID -> parseIDNumber tanpa berubah.
    fn_fmt = extract_fn(common, "fmtID")
    check("GG10e fmtID terdefinisi di js/common.js", fn_fmt is not None)
    if fn_parse and fn_fmt:
        rt_src = fn_parse + "\n" + fn_fmt + "\nvar __vals = [0,5,100,999,1000,2500,10000,123456,1000000,10000000,2062,1875,1400];\nconsole.log(JSON.stringify(__vals.map(function(v){ return parseIDNumber(fmtID(v)); })));\n"
        with tempfile.NamedTemporaryFile("w", suffix=".js", delete=False) as f:
            f.write(rt_src)
            _p = f.name
        try:
            r = subprocess.run(["node", _p], capture_output=True, text=True, timeout=30)
            _rt = json.loads(r.stdout.strip()) if r.returncode == 0 else None
        except Exception:
            _rt = None
        finally:
            Path(_p).unlink(missing_ok=True)
        check("GG10f round-trip fmtID->parseIDNumber (13 nilai)",
              _rt == [0, 5, 100, 999, 1000, 2500, 10000, 123456, 1000000,
                      10000000, 2062, 1875, 1400], f"dapat {_rt}")

# ============================================================
# GG-14 — pemindaian silang konsistensi lintas-lesson (KELAS, bukan
# string spesifik — perintah Septian 2026-11-09 00:53).
# Kelas yang dikunci:
#  (a) "tambah" tanpa gerbang invalidasi: SETIAP saran tambah/beli
#      di jawaban bank soal / why kuis / prose, di file mana pun,
#      wajib menyebut invalidasi (atau negasi "jangan tambah", atau
#      enumerasi 3 hasil review "tahan/tambah/jual").
#  (b) angka Rp di bank soal/kuis: SETIAP angka Rp di js/i1.js..i4.js
#      wajib anggota himpunan kanonis (bukan hanya angka M1).
#  (c) vonis kualitas-laba tanpa telusur: daftar terlarang (tumbuh)
#      + aturan umum: tiap chunk yang menyebut CFO + red flag wajib
#      menyebut "telusuri" di chunk yang sama.
#  (d) jangkar kanonis sama di semua permukaan (target/invalidasi/
#      FCFF -20% -> JUAL; angka lama tidak berlaku).
# KETERBATASAN (jujur): (a) tidak menangkap cacat reachability M1 —
# jawaban M1 SUDAH menyebut invalidasi, cacatnya cabang "tambah" tak
# pernah tercapai untuk contoh kanonis; itu dikunci cek M1 spesifik
# (Rp1.200/Rp1.400/jual). (c) daftar terlarang berbasis string — parafrasa
# baru bisa lolos; mitigasi: daftar tumbuh + sertakan ke prompt review
# ronde berikut. (b) hanya mencakup js/*.js; angka prose HTML (mis.
# contoh sizing I3) domain berbeda, tidak dipindai di sini.
# ============================================================
# Jangkar kanonis harus sama di semua permukaan:
check("GG14a target Rp2.062 konsisten (i2/i3/i4)",
      "Rp2.062" in read("i2/index.html") and "Rp2.062" in i3
      and "Rp2.062" in i4js)
check("GG14b invalidasi Rp1.400 konsisten (i3/i4)",
      "Rp1.400" in i3 and "Rp1.400" in i4js)
check("GG14c FCFF -20% -> JUAL konsisten (i3/i4)",
      "FCFF turun ≥20%" in i3 and "FCFF turun ≥20%" in i4js)
check("GG14d angka lama hanya di catatan koreksi I2 §6 (bukan sebagai nilai berlaku)",
      read("i2/index.html").count("9,97%") == 1
      and "itu keliru secara textbook" in read("i2/index.html")
      and read("i2/index.html").count("Rp1.850") == 1
      and "Koreksi ini menaikkan target dari Rp1.850 ke Rp2.062" in read("i2/index.html")
      and "2.207" not in BLOB and "Rp1.848" not in BLOB)

# --- (a) saran "tambah" wajib bergerbang invalidasi, di file mana pun ---
def _js_answer_strings(txt):
    return re.findall(r'(?:a|why):"((?:[^"\\]|\\.)*)"', txt)

def _html_chunks(txt):
    out = re.findall(r"<(?:p|li)[^>]*>(.*?)</(?:p|li)>", txt, re.S)
    return [re.sub(r"<[^>]+>", " ", c) for c in out]

_tambah_bad = []
for _name, _txt in ALL.items():
    _chunks = (_js_answer_strings(_txt) if _name.endswith(".js")
               else _html_chunks(_txt))
    for _c in _chunks:
        if re.search(r"\btambah\b", _c, re.I):
            _low = _c.lower()
            _gated = ("invalidasi" in _low or "jangan tambah" in _low
                      or ("tahan" in _low and "jual" in _low))
            if not _gated:
                _tambah_bad.append(f"{_name}: {_c[:80]}")
check("GG14e tiap saran 'tambah' bergerbang invalidasi (semua file)",
      not _tambah_bad, "; ".join(_tambah_bad)[:200])

# --- (b) semua angka Rp di js/i1..i4.js anggota himpunan kanonis ---
CANON = {2062, 1875, 1874.55, 1400, 1200, 1500, 1568, 1815, 1800}
def _rp_value(raw):
    s = raw.rstrip(".,")
    if "," in s:
        return float(s.replace(".", "").replace(",", "."))
    return float(s.replace(".", ""))
_rp_bad = []
for _f in ("js/i1.js", "js/i2.js", "js/i3.js", "js/i4.js"):
    for _m in re.finditer(r"Rp([0-9][0-9.,]*)", read(_f)):
        _v = _rp_value(_m.group(1))
        if _v not in CANON:
            _rp_bad.append(f"{_f}: Rp{_m.group(1)}")
check("GG14f semua angka Rp di bank soal/kuis kanonis",
      not _rp_bad, "; ".join(_rp_bad)[:200])

# --- (c) vonis kualitas-laba: daftar terlarang + aturan umum ---
FORBIDDEN_VERDICTS = ["laba tidak menjadi kas", "laba tidak jadi kas",
                      "laba kertas", "Value trap klasik"]
_fv = [p for p in FORBIDDEN_VERDICTS if p in BLOB]
check("GG14g daftar terlarang vonis kualitas-laba: 0 kemunculan repo-wide",
      not _fv, f"ketemu: {_fv}")
_cfo_bad = []
for _name, _txt in ALL.items():
    _chunks = (_js_answer_strings(_txt) if _name.endswith(".js")
               else _html_chunks(_txt))
    for _c in _chunks:
        _low = _c.lower()
        if "cfo" in _low and "red flag" in _low and "telusuri" not in _low:
            _cfo_bad.append(f"{_name}: {_c[:80]}")
check("GG14h tiap chunk 'CFO + red flag' wajib 'telusuri' (semua file)",
      not _cfo_bad, "; ".join(_cfo_bad)[:200])
# Rumusan red flag R7 dipakai di i4.js (S2) — dicek juga di § S2.

# ============================================================
# M1 — jawaban I4 "turun 20%" dijangkar kanonis
# ============================================================
m1 = re.search(r'q:"Saham ini turun 20%[^"]*",\s*a:"([^"]*)"', i4js)
check("M1a jawaban 'turun 20%' ditemukan", m1 is not None)
if m1:
    a = m1.group(1)
    check("M1b menyebut Rp1.200 (20% dari Rp1.500)", "Rp1.200" in a)
    check("M1c menyebut invalidasi Rp1.400", "Rp1.400" in a)
    check("M1d vonis JUAL untuk Sinar Ritel", "jual" in a.lower())
    check("M1e cabang 'pertimbangkan tambah' HANYA bila invalidasi tidak terpicu",
          "pertimbangkan tambah" not in a or "TIDAK terpicu" in a)
    check("M1f hitung ulang: 1500 x 0,80 = 1200 < 1400",
          abs(1500 * 0.80 - 1200) < 1e-9 and 1200 < 1400)
check("M1g 'tunggu dan berharap' tetap ditolak", "tunggu dan berharap" in i4js)

# ============================================================
# S1 — contoh risiko pitch I4 memuat 2 risiko
# ============================================================
risk_cell = re.search(r"<td><strong>3\. Risiko</strong></td>.*?</tr>", i4, re.S)
check("S1a baris Risiko ditemukan", risk_cell is not None)
if risk_cell:
    cell = risk_cell.group(0)
    check("S1b risiko pertama: SSS -8% -> target Rp1.815",
          "same-store sales −8%" in cell and "Rp1.815" in cell)
    check("S1c risiko kedua hadir (margin EBIT >1,5pp)",
          "margin EBIT turun" in cell and "1,5pp" in cell)
    check("S1d label tetap '2 risiko terbesar'", "2 risiko terbesar" in cell)

# ============================================================
# S2 — jawaban CFO I4 = rumusan red flag R7
# ============================================================
cfo = re.search(r'q:"CFO jauh di bawah laba bersih 3 tahun[^"]*",\s*a:"([^"]*)"', i4js)
check("S2a jawaban CFO ditemukan", cfo is not None)
if cfo:
    a = cfo.group(1)
    check("S2b 'red flag' + 'telusuri penyebabnya'", "red flag" in a and "telusuri" in a)
    check("S2c penyebab sah disebut (waktu kas / modal kerja)",
          "waktu penerimaan kas" in a or "modal kerja" in a)
    check("S2d vonis otomatis hilang", "laba tidak menjadi kas" not in a
          and "Value trap klasik" not in a)
    check("S2e 'value trap' hanya bersyarat ('bisa jadi')",
          "value trap" not in a or "bisa jadi value trap" in a)

# ============================================================
# S3 — template jurnal I3: formula + contoh MOS
# ============================================================
check("S3a formula MOS di I3 §3",
      "MOS = (target − harga beli) / target" in i3)
check("S3b contoh Sinar Ritel (Rp2.062 − Rp1.500) / Rp2.062 ≈ 27%",
      "(Rp2.062 − Rp1.500) / Rp2.062 ≈ 27%" in i3)
check("S3c hitung ulang: 562/2062 = 27,26% -> 27%",
      abs(562 / 2062 - 0.27255) < 1e-4)

# ============================================================
# S4 — substanceChecks() pola per field, dieksekusi di Node
# ============================================================
fn_sub = extract_fn(sim, "substanceChecks")
check("S4a substanceChecks terdefinisi", fn_sub is not None)
if fn_sub:
    adv = [["bagus 1x", "risiko 1 Rp", "harga 1 Rp"],
           ["1% saja", "risiko 1 Rp", "harga 1 Rp"],
           ["target Rp2.450 upside 36%", "Daya beli turun 10% → target turun ke Rp1.900",
            "FCFF turun ≥20%"],
           ["Pangsa pasar 18%→22% dalam 3 tahun",
            "1. Daya beli turun 10% → target Rp1.900; 2. Margin EBIT turun >1,5pp → re-hitung target; 3. Utang naik 50% → WACC naik",
            "harga menyentuh Rp1.400"],
           ["Upside 36%", "SSS −8% bikin target Rp1.815", "SSS turun 2 kuartal"],
           ["Target 2450", "risiko 1 Rp", "CFO tetap jauh di bawah laba"]]
    res, err = run_node("substanceChecks", fn_sub, adv)
    if res is None:
        check("S4b eksekusi Node substanceChecks", False, err)
    else:
        check("S4c 'bagus 1x / risiko 1 Rp / harga 1 Rp' SEMUA ditolak",
              res[0] == {"bull": False, "risk": False, "inv": False}, f"dapat {res[0]}")
        check("S4d '1% saja' bull ditolak (angka tanpa makna)",
              res[1]["bull"] is False, f"dapat {res[1]}")
        check("S4e thesis berangka lolos (target/upside + risiko 2 angka + inv)",
              res[2] == {"bull": True, "risk": True, "inv": True}, f"dapat {res[2]}")
        check("S4f panah berarah + 3 risiko bernomor + inv harga lolos",
              res[3] == {"bull": True, "risk": True, "inv": True}, f"dapat {res[3]}")
        check("S4g 'Upside 36%' + risiko 2 angka + 'SSS turun 2 kuartal' lolos",
              res[4] == {"bull": True, "risk": True, "inv": True}, f"dapat {res[4]}")
        check("S4h 'Target 2450' tanpa satuan ditolak; inv tanpa angka ditolak",
              res[5]["bull"] is False and res[5]["inv"] is False, f"dapat {res[5]}")

# ============================================================
# S5 — simulator: 3 risiko bernomor (I1 §1)
# ============================================================
fn_risk3 = extract_fn(sim, "hasThreeNumberedRisks")
check("S5a hasThreeNumberedRisks terdefinisi", fn_risk3 is not None)
check("S5b gerbang 3-risiko dipakai di to-committee",
      "hasThreeNumberedRisks(risk)" in sim)
check("S5c label Step 3: '3 risiko terbesar'",
      "3 risiko terbesar" in simhtml)
check("S5d hint: simulator menguji 3 risiko (subset I1 dinyatakan)",
      "3 risiko bernomor" in simhtml)
check("S5e placeholder contoh 3 poin bernomor",
      "1. Daya beli turun 10%" in simhtml)
if fn_risk3:
    res, err = run_node("hasThreeNumberedRisks", fn_risk3,
                        [["1. a 2. b 3. c"], ["Daya beli turun 10% → target Rp1.900"],
                         ["1. a 2. b"], ["1) a 2) b 3) c"]])
    if res is None:
        check("S5f eksekusi Node hasThreeNumberedRisks", False, err)
    else:
        check("S5g '1./2./3.' lolos", res[0] is True, f"dapat {res[0]}")
        check("S5h satu risiko ditolak", res[1] is False, f"dapat {res[1]}")
        check("S5i dua poin ditolak", res[2] is False, f"dapat {res[2]}")
        check("S5j '1)/2)/3)' lolos", res[3] is True, f"dapat {res[3]}")

# ============================================================
# S6 — metode valuasi terikat input utama
# ============================================================
fn_method = extract_fn(sim, "methodCheck")
m_inputs = re.search(r"var METHOD_INPUTS = \{.*?\n\};", sim, re.S)
check("S6a METHOD_INPUTS terdefinisi", m_inputs is not None)
check("S6b methodCheck terdefinisi", fn_method is not None)
check("S6c gerbang methodCheck dipakai di to-committee",
      "methodCheck(method, bull)" in sim)
check("S6d checklist DCF menyebut FCFF/WACC/g/net debt/saham",
      m_inputs is not None and all(x in m_inputs.group(0)
      for x in ("FCFF", "WACC", "net debt", "saham")))
check("S6e checklist multiples menyebut metrik/kelipatan/peer",
      m_inputs is not None and "kelipatan" in m_inputs.group(0)
      and "peer" in m_inputs.group(0))
check("S6f checklist DDM menyebut dividen/payout/required return",
      m_inputs is not None and "payout" in m_inputs.group(0)
      and "required return" in m_inputs.group(0))
check("S6g hint metode dinamis ada di HTML", 'id="method-hint"' in simhtml)
if fn_method and m_inputs:
    src = m_inputs.group(0) + "\n" + fn_method
    res, err = run_node("methodCheck", src, [
        ["dcf", "FCFF Rp210 M tumbuh 4%, WACC 9,5%"],
        ["dcf", "P/E 10x murah, peer 12x"],
        ["ddm", "Dividen payout 45% konsisten, required return 10%"],
        ["ddm", "FCFF naik 10%"],
        ["mult", "P/E 10x vs peer 12x"],
        ["mult", "FCFF Rp210 M"],
        ["", "FCFF Rp210 M"]])
    if res is None:
        check("S6h eksekusi Node methodCheck", False, err)
    else:
        check("S6i DCF + FCFF/WACC lolos", res[0]["ok"] is True, f"dapat {res[0]}")
        check("S6j DCF + narasi multiples ditolak (metode tak terikat)",
              res[1]["ok"] is False, f"dapat {res[1]}")
        check("S6k DDM + payout/required return lolos", res[2]["ok"] is True)
        check("S6l DDM + narasi FCFF ditolak", res[3]["ok"] is False)
        check("S6m Multiples + P/E vs peer lolos", res[4]["ok"] is True)
        check("S6n Multiples + narasi FCFF ditolak", res[5]["ok"] is False)
        check("S6o metode kosong ditolak", res[6]["ok"] is False)

# ============================================================
# S7 — label C Q4 = Reverse-DCF, bukan INVALIDASI
# ============================================================
check("S7a label C Q4 'REVERSE-DCF / REQUIRED GROWTH'",
      "REVERSE-DCF / REQUIRED GROWTH (bagi yang nekat BUY)" in sim)
check("S7b 'INVALIDASI (bagi yang nekat BUY)' hilang",
      "INVALIDASI (bagi yang nekat BUY)" not in sim)
check("S7c kunci g 4,6% tetap", 'ans: 4.6' in sim)
check("S7d why C Q4 tetap memuat invalidasi operasional yang teramati",
      "Invalidasi yang bisa diamati: CFO tetap jauh di bawah laba" in sim)
check("S7e label vonis membedakan reverse-DCF dari invalidasi",
      "Reverse-DCF / required growth" in sim)
check("S7f hint Step 4: Q terakhir C = reverse-DCF",
      "reverse-DCF (C)" in simhtml)
check("S7g hitung ulang: g tersirat 4,65% -> 4,6%",
      abs(350 * 1.0465 / (0.12 - 0.0465) - 4980) < 60)

# ============================================================
# N1 — batas eksak di js/i4.js:40
# ============================================================
check("N1a batas eksak Rp1.874,55 di js/i4.js",
      "batas eksak Rp1.874,55" in i4js)
check("N1b simbol ≳ tetap (aproksimasi ditandai)",
      "≳Rp1.875" in i4js)

# ============================================================
# N2 — toleransi ±60: kunci no-change (tidak membalik keputusan)
# ============================================================
check("N2a tol A tetap 60 (tidak diubah diam-diam)",
      "target: 2450, tol: 60" in sim)
check("N2b vonis pakai tol ABSOLUT", "Math.abs(target-s.key.target) <= s.key.tol" in sim)
check("N2c rentang lolos A 2390-2510 tetap BUY (upside 32,8%-39,4%)",
      abs((2390 - 1800) / 1800 - 0.3278) < 1e-3
      and abs((2510 - 1800) / 1800 - 0.3944) < 1e-3)

# ============================================================
# N3 — parameter isDecimal dihapus
# ============================================================
check("N3a 'isDecimal' hilang repo-wide", "isDecimal" not in BLOB)
check("N3b definisi parseIDNumber(str) tanpa param kedua",
      "function parseIDNumber(str){" in common)
check("N3c call site simulator tanpa argumen kedua",
      "parseIDNumber(document.getElementById(\"t-target\").value)" in sim
      and "parseIDNumber(document.getElementById(\"cq\"+i).value)" in sim
      and "parseIDNumber(document.getElementById(\"cq3\").value)" in sim)

# ============================================================
# N4 — "P/E 10x murah" butuh pembanding
# ============================================================
check("N4a 'murah untuk konsumer defensif' hilang",
      "murah untuk konsumer defensif" not in sim)
check("N4b why Q2 A: banding peers/histori/pertumbuhan",
      "peers, histori, dan prospek pertumbuhan" in sim)
check("N4c hitungan 10x tetap benar", "1.800 ÷ 180 = 10x" in sim)

# ============================================================
# N5 — quiz.js bersihkan class right/wrong sebelum grading ulang
# ============================================================
check("N5a remove('right') hadir di grade()", 'remove("right")' in quiz)
check("N5b remove('wrong') hadir di grade()", 'remove("wrong")' in quiz)
check("N5c pembersihan terjadi SEBELUM penandaan baru",
      'remove("right")' in quiz and 'classList.add("right")' in quiz
      and quiz.index('remove("right")') < quiz.index('classList.add("right")'))
check("N5d skor tetap dihitung dari jawaban aktual",
      "if(picked === Q[i].ans) score++;" in quiz)

# ============================================================
# GAP RONDE 8 (perintah Septian 2026-11-09 01:53 "klo gap, kerjakan aja")
# G1 — contoh jurnal Sinar Ritel terisi penuh (I3 §3)
# G2 — cek konsistensi target vs angka thesis (simulator, peringatan)
# G3 — pertanyaan konseptual B: batas beli != pemicu jual
# ============================================================
# --- G1: contoh jurnal terisi ---
g1 = re.search(r"Contoh terisi — Sinar Ritel.*?</div>\s*<p>Template kosong", i3, re.S)
check("G1a contoh jurnal terisi Sinar Ritel hadir di I3 §3", g1 is not None)
if g1:
    ex = g1.group(0)
    check("G1b thesis 1 kalimat (gerai 120→150, margin 12%→14%)",
          "gerai naik 120→150" in ex and "margin EBIT 12%→14%" in ex)
    check("G1c target Rp2.062 + beli Rp1.500 + MOS ≈27%",
          "target Rp2.062" in ex and "beli di Rp1.500" in ex and "MOS ≈27%" in ex)
    check("G1d invalidasi Rp1.400 + FCFF ≥20% (target ≈Rp1.568)",
          "Rp1.400" in ex and "FCFF turun ≥20%" in ex and "≈Rp1.568" in ex)
    check("G1e sizing 10.000 lembar (15% portfolio, risiko Rp1 jt)",
          "10.000 lembar" in ex and "15% portfolio" in ex and "Rp1 jt" in ex)
    check("G1f tanggal review konkret (13 April 2026, kuartalan Q1)",
          "13 April 2026" in ex)
check("G1g hitung ulang MOS: 562/2062 = 27,26% -> ≈27%",
      abs(562 / 2062 - 0.27255) < 1e-4)
check("G1h sizing konsisten §2: 10.000 x 1.500 = Rp15 jt = 15% dari Rp100 jt",
      10000 * 1500 == 15000000 and abs(15000000 / 100000000 - 0.15) < 1e-9)
check("G1i template kosong tetap tersedia", "target Rp____" in i3)
check("G1j contoh tidak mengulang 'batas eksak' (R7 N2 tetap 1x di I3)",
      i3.count("batas eksak Rp1.874,55") == 1)

# --- G2: cek konsistensi (peringatan, bukan blokir) ---
fn_cons = extract_fn(sim, "consistencyWarnings")
fn_cfmt = extract_fn(sim, "_consFmt")
fn_crp = extract_fn(sim, "_consRpNums")
fn_cpct = extract_fn(sim, "_consPctAfter")
check("G2a consistencyWarnings terdefinisi (murni, tanpa DOM)",
      fn_cons is not None)
check("G2b helper _consRpNums/_consPctAfter terdefinisi",
      fn_crp is not None and fn_cpct is not None)
check("G2c field terstruktur ada di simulator HTML (DCF 5 + mult 2 + DDM 3)",
      all(x in simhtml for x in ('id="in-fcff"', 'id="in-wacc"', 'id="in-g"',
      'id="in-debt"', 'id="in-shares"', 'id="in-eps"', 'id="in-mult"',
      'id="in-div"', 'id="in-payout"', 'id="in-req"'))
      and all(x in simhtml for x in ('id="inputs-dcf"', 'id="inputs-mult"',
      'id="inputs-ddm"')))
check("G2d kotak peringatan ada di Step 4", 'id="consistency-box"' in simhtml)
check("G2e cek dipanggil di to-committee SETELAH semua gerbang",
      "consWarns = consistencyWarnings({" in sim
      and sim.index("consWarns = consistencyWarnings({") > sim.index('if(!sub.inv)'))
_seg = sim[sim.index("consWarns = consistencyWarnings({"):sim.index('var cb = document.getElementById("consistency-box")')]
check("G2f peringatan TIDAK memblokir (tanpa alert/return di jalur cek)",
      "alert(" not in _seg and "return" not in _seg)
check("G2g gerbang PASS ≥7 + keputusan benar TIDAK berubah",
      'var verdict = (score>=7 && decOk) ? "LULUS" : "BELUM LULUS";' in sim)
check("G2h skor tetap 3+2+3+2=10", "score = 0, max = 10" in sim)
check("G2i vonis menampilkan kembali peringatan konsistensi",
      "Cek konsistensi thesis (peringatan, di luar skor)" in sim)
if fn_cons and fn_cfmt and fn_crp and fn_cpct:
    _src = fn_cfmt + "\n" + fn_crp + "\n" + fn_cpct + "\n" + fn_cons
    _base = {"target": 2450, "mkt": 1800, "method": "dcf",
             "bull": "FCFF Rp210 M tumbuh 4% (WACC 9,5%) — target Rp2.450, upside 36%",
             "risk": "1. Daya beli turun 10% → target Rp1.900; 2. Margin EBIT turun >1,5pp → re-hitung target; 3. Utang naik 50% → WACC naik",
             "inv": "harga menyentuh Rp1.400",
             "fcff": 210, "wacc": 9.5, "g": 4, "debt": 600, "shares": 1375,
             "eps": None, "mult": None, "div": None, "payout": None, "req": None}
    _nan = float("nan")
    def _o(**kw):
        d = dict(_base)
        d.update(kw)
        return d
    _cases = [
        ("lolos penuh (A benar)", _o(), 0),
        ("bull Rp salah (Rp3.000)", _o(bull="target Rp3.000, upside 36%"), 1),
        ("upside salah (50%)",
         _o(bull="FCFF Rp210 M tumbuh 4% — target Rp2.450, upside 50%"), 1),
        ("DCF salah (FCFF 100)", _o(fcff=100), 1),
        ("risiko target >= target awal",
         _o(risk="1. Daya beli turun 10% → target Rp2.600; 2. x; 3. y"), 1),
        ("invalidasi di atas target", _o(inv="harga menyentuh Rp2.600"), 1),
        ("multiples salah (180x10 vs 2450)",
         _o(method="mult", eps=180, mult=10), 1),
        ("multiples benar (245x10)", _o(method="mult", eps=245, mult=10), 0),
        ("DDM target di bawah no-growth",
         {"target": 800, "mkt": 1800, "method": "ddm",
          "bull": "Dividen Rp100, payout 45%, required return 10% — target Rp800",
          "risk": "1. Daya beli turun 10% → target Rp700; 2. x; 3. y",
          "inv": "harga menyentuh Rp600",
          "fcff": None, "wacc": None, "g": None, "debt": None, "shares": None,
          "eps": None, "mult": None, "div": 100, "payout": 45, "req": 10}, 1),
        ("DDM ok", _o(method="ddm", div=81, req=10), 0),
        ("WACC bull vs kolom beda",
         _o(bull="FCFF Rp210 M tumbuh 4% (WACC 12%) — target Rp2.450, upside 36%"), 1),
        ("kolom kosong semua tetap lolos",
         _o(fcff=None, wacc=None, g=None, debt=None, shares=None), 0),
        ("FCFF Rp210 M di bull tidak picu cek harga",
         _o(bull="FCFF Rp210 M, WACC 9,5%"), 0),
    ]
    # None -> NaN di driver JS (JSON null = null; ganti NaN via string)
    _js_cases = []
    for _name, _o_dict, _want in _cases:
        _js_cases.append(_o_dict)
    _driver_cases = json.dumps(_js_cases).replace("null", "NaN")
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
        check("G2j eksekusi Node consistencyWarnings", False, _err)
    else:
        for (_name, _o_dict, _want), _got in zip(_cases, _res):
            check(f"G2j-{_name}: {_want} peringatan",
                  _got == _want, f"dapat {_got}")

# --- G3: pertanyaan konseptual B ---
_b_concept = re.search(r'concept:\s*\{\s*q:\s*"([^"]*)",\s*ans:\s*"([^"]*)",\s*why:\s*"([^"]*)"', sim)
check("G3a concept B terdefinisi (q + ans + why)", _b_concept is not None)
if _b_concept:
    check("G3b pertanyaan: harga di atas Rp2.310, otomatis sinyal jual?",
          "Rp2.310" in _b_concept.group(1) and "otomatis sinyal jual" in _b_concept.group(1))
    check("G3c kunci: tidak", _b_concept.group(2) == "tidak")
    check("G3d why: batas MEMBUKA posisi, bukan pemicu jual",
          "batas untuk MEMBUKA posisi, bukan pemicu jual" in _b_concept.group(3))
    check("G3e why: posisi lama tidak otomatis dijual",
          "tidak otomatis dijual di sini" in _b_concept.group(3))
check("G3f concept hanya di B (1x repo-wide, kunci Rp2.310 = B)",
      sim.count("concept:") == 1)
check("G3g radio Ya/Tidak dirender setelah Q4 (name=cq-concept)",
      'name="cq-concept"' in sim and 'value="ya"' in sim and 'value="tidak"' in sim)
check("G3h vonis menampilkan hasil konseptual (di luar skor 10)",
      "Konseptual — batas beli ≠ pemicu jual (di luar skor 10)" in sim)
check("G3i Step 4 menyebut pertanyaan konseptual B",
      "pertanyaan konseptual (batas beli ≠ pemicu jual)" in simhtml)

# ============================================================
# Sintaks JS + guard R7 bertahan
# ============================================================
for js in sorted((ROOT / "js").glob("*.js")):
    r = subprocess.run(["node", "--check", str(js)], capture_output=True, text=True)
    check(f"JS node --check {js.name}", r.returncode == 0, r.stderr.strip()[:120])

r7 = subprocess.run([sys.executable, str(ROOT / "qa" / "qa_investment_r7.py")],
                    capture_output=True, text=True)
check("R7 guard bertahan 49/49", r7.returncode == 0, r7.stdout.strip().splitlines()[-1] if r7.stdout else r7.stderr[:120])

print(f"PASS {len(passes)}/{len(passes)+len(fails)}")
for f in fails:
    print("FAIL:", f)
sys.exit(1 if fails else 0)
