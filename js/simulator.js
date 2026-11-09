/* Investment Committee Simulator — flagship. SEMUA EMITEN FIKTIF, angka ILUSTRATIF.
   Kunci builder (terverifikasi):
   A: EV=210*1.04/0.055=3970.9; equity=3370.9; /1375=2451.6→2450; upside=(2450-1800)/1800=36.1%;
      P/E=1800/180=10x; invalidasi: target 1800→equity 2475→EV 3075→FCFF 162.6→turun 22.6%
   B: EV=400*1.02/0.09=4533.3; equity=3733.3; /1131=3300.8→3300; upside=100/3200=3.1%;
      FCFF-12.5%=350→EV 3966.7→equity 3166.7→/1131=2800; MOS30%: 3300*0.7=2310
   C: EV=350*1.03/0.09=4005.6; equity=2505.6; /696=3600.5→3600; downside=(5000-3600)/5000=28%;
      CFO=348*0.4=139.2→139; NI-CFO=209; g utk target 5000: EV=4980→350(1+g)/(0.12-g)=4980→g=4.65%→4.6% */
var STOCKS = {
  A: {
    name: "PT Cahaya Konsumer", sector: "Konsumer defensif",
    nums: [
      ["Harga pasar", 1800, "Rp/saham"], ["FCFF", 210, "Rp miliar"],
      ["WACC", 9.5, "%"], ["g perpetuitas", 4, "%"],
      ["Net debt", 600, "Rp miliar"], ["Saham beredar", 1375, "juta (diluted)"],
      ["EPS", 180, "Rp"], ["Dividen payout", 45, "% (8 thn konsisten)"]
    ],
    qual: ["12 tahun operasi; pangsa pasar 18% dan naik 3 tahun berturut-turut.",
      "Capex distribusi Rp180 M — menjangkau 12 ribu warung baru.",
      "Bauran produk premium naik 15% → 25% pendapatan (margin mengembang).",
      "Manajemen: founder-led, insider ownership 32%."],
    key: { decision: "buy", target: 2450, tol: 60,
           why: "Target DCF Rp2.450 vs Rp1.800 = upside 36,1%; MOS 26,5% — di atas ambang 15–20% untuk bisnis defensif dengan kas terprediksi — sangat memadai." },
    comm: [
      { q: "Upside dari TARGET-MU vs harga pasar Rp1.800? (%)", dyn: "up", tol: 2, why: "Upside = (target-mu − 1.800) ÷ 1.800. Komite menguji matematikamu, bukan hafalan." },
      { q: "P/E di harga pasar? (x) — EPS Rp180", ans: 10, tol: 0.5, why: "1.800 ÷ 180 = 10x; murah atau tidak perlu dibandingkan dengan peers, histori, dan prospek pertumbuhan." },
      { q: "Enterprise value dari DCF? (Rp miliar)", ans: 3971, tol: 60, why: "210 × 1,04 ÷ (0,095 − 0,04) = 3.971." },
      { q: "INVALIDASI: FCFF turun berapa % hingga target = Rp1.800 (upside habis)? (%)", ans: 22.6, tol: 2, inv: true,
        why: "Target 1.800 → equity 2.475 → EV 3.075 → FCFF 162,6 → turun 22,6%. Di bawah itu: JUAL." }
    ]
  },
  B: {
    name: "PT Nusantara Energi", sector: "Energi siklikal",
    nums: [
      ["Harga pasar", 3200, "Rp/saham"], ["FCFF", 400, "Rp miliar"],
      ["WACC", 11, "%"], ["g perpetuitas", 2, "%"],
      ["Net debt", 800, "Rp miliar"], ["Saham beredar", 1131, "juta (diluted)"],
      ["EPS", 300, "Rp"], ["Utang jatuh tempo 2 thn", 500, "Rp miliar"]
    ],
    qual: ["Harga jual mengikuti harga komoditas global — 2 dari 5 tahun terakhir FCFF negatif.",
      "Hedging menutup 40% produksi tahun berjalan saja.",
      "Tidak ada keunggulan biaya vs peers — price taker murni.",
      "Dividen dipotong 2x dalam 5 tahun mengikuti siklus."],
    key: { decision: "hold", target: 3300, tol: 60,
           why: "Target Rp3.300 vs Rp3.200 = upside 3,1% — tidak cukup untuk siklikal (butuh MOS 30%+). Bukan thesis jual (bisnis tidak rusak), tapi bukan thesis beli. Upside 3,1% ini memicu review jual (I3 §1 pemicu 2) — review, bukan jual otomatis: hasil review, bisnis tidak rusak, jadi tahan, jangan tambah." },
    comm: [
      { q: "Upside dari TARGET-MU vs harga pasar Rp3.200? (%)", dyn: "up", tol: 1, why: "Upside = (target-mu − 3.200) ÷ 3.200." },
      { q: "Bila FCFF turun 12,5% (komoditas −20%), target barunya? (Rp)", ans: 2800, tol: 60, why: "FCFF 350 → EV 3.967 → equity 3.167 → ÷1.131 = Rp2.800." },
      { q: "P/E di harga pasar? (x) — EPS Rp300", ans: 10.7, tol: 0.5, why: "3.200 ÷ 300 = 10,7x — wajar, tidak murah." },
      { q: "BATAS BELI: harga beli MAKSIMUM dengan MOS 30% (siklikal)? (Rp)", ans: 2310, tol: 60,
        why: "MOS = (nilai − harga) ÷ nilai. MOS 30% → harga = 3.300 × 0,70 = Rp2.310. Ini batas untuk MEMBUKA posisi, bukan pemicu jual: di atas Rp2.310 kamu membayar tanpa buffer siklus — posisi yang sudah dimiliki tidak otomatis dijual di sini." }
    ],
    /* Ronde 8 G3 — satu pertanyaan konseptual setelah Q4 B: jawaban angka
       Rp2.310 bisa dijawab mekanis; yang diuji di sini adalah pemahaman
       bahwa "batas beli" ≠ "pemicu jual". Konseptual (teks), di luar skor
       10 — vonis dan gerbang PASS ≥7 + keputusan benar TIDAK berubah. */
    concept: { q: "Bila sudah punya posisi dan harga naik di atas Rp2.310, apakah ini otomatis sinyal jual?", ans: "tidak",
      why: "Tidak — Rp2.310 adalah batas untuk MEMBUKA posisi, bukan pemicu jual. Di atas Rp2.310 kamu membayar tanpa buffer siklus, jadi jangan buka posisi baru di sana; posisi yang sudah dimiliki tidak otomatis dijual di sini. Jual hanya bila invalidasi terpicu atau review jual (I3 §1) mendukungnya." }
  },
  C: {
    name: "PT Maju Properti", sector: "Properti",
    nums: [
      ["Harga pasar", 5000, "Rp/saham"], ["FCFF", 350, "Rp miliar"],
      ["WACC", 12, "%"], ["g perpetuitas", 3, "%"],
      ["Net debt", 1500, "Rp miliar"], ["Saham beredar", 696, "juta (diluted)"],
      ["EPS", 500, "Rp"], ["Transaksi afiliasi", 35, "% pendapatan"]
    ],
    qual: ["Transaksi dengan pihak afiliasi 35% pendapatan — transfer pricing tidak transparan.",
      "Auditor ganti 2x dalam 3 tahun.",
      "Tidak pernah membayar dividen padahal 'laba' tiap tahun.",
      "CFO 3 tahun terakhir rata-rata hanya 40% dari laba bersih."],
    key: { decision: "pass", target: 3600, tol: 60,
           why: "Target Rp3.600 vs Rp5.000 = downside 28%. P/E 10x terlihat murah = value trap: CFO 3 tahun hanya 40% dari laba + governance red flag — selisih laba-kas ini wajib ditelusuri sebelum percaya kelipatan murah. Bukan sekadar mahal — tidak investable." },
    comm: [
      { q: "Downside dari TARGET-MU vs harga pasar Rp5.000? (%)", dyn: "down", tol: 2, why: "Downside = (5.000 − target-mu) ÷ 5.000." },
      { q: "CFO rata-rata 3 tahun bila NI 348 dan CFO/NI 40%? (Rp miliar)", ans: 139, tol: 5, why: "348 × 0,4 = 139,2." },
      { q: "Selisih NI − CFO = ? (Rp miliar) — selisih laba dan kas yang perlu ditelusuri", ans: 209, tol: 8, why: "348 − 139 = 209. Ini selisih SATU periode — belum membuktikan kas tidak pernah diterima (bisa perubahan modal kerja/timing). Yang perlu ditelusuri: piutang/persediaan menumpuk atau revenue recognition agresif." },
      { q: "REVERSE-DCF / REQUIRED GROWTH (bagi yang nekat BUY): g berapa agar target = Rp5.000? (%)", ans: 4.6, tol: 0.3, inv: true,
        why: "g tersirat 4,65% adalah batas impas valuasi — pertumbuhan FCFF 4,65% selamanya yang membuat target = harga Rp5.000. Untuk properti siklikal yang CFO-nya hanya 40% dari laba (selisih laba-kas ini wajib ditelusuri sebelum menyimpulkan — I2 §3.1), asumsi itu agresif dan tidak didukung bukti (bandingkan: g 3% yang dipakai di DCF; pertumbuhan ekonomi jangka panjang ±5%) — jadi thesis BUY tidak punya margin: PASS. Invalidasi yang bisa diamati: CFO tetap jauh di bawah laba, atau g terealisasi bertahun-tahun di bawah 4,65%." }
    ]
  }
};
var cur = null, decision = null;

function show(id){ document.getElementById(id).style.display="block"; document.getElementById(id).scrollIntoView({behavior:"smooth",block:"start"}); }

(function renderCards(){
  var h = "";
  Object.keys(STOCKS).forEach(function(k){
    var s = STOCKS[k], st = idLoad("sim_"+k);
    h += '<div class="id-card" style="margin:0"><h3>'+s.name+'</h3>'
      + '<p style="font-size:.85rem;color:var(--ink-soft)">'+s.sector+' · '+(st&&st.score!==undefined?("Skor: <b>"+st.score+"/"+st.max+"</b>"):"Belum dikerjakan")+'</p>'
      + '<button class="id-btn" data-s="'+k+'">Buka paket →</button></div>';
  });
  document.getElementById("stock-cards").innerHTML = h;
  var btns = document.querySelectorAll("#stock-cards button");
  btns.forEach(function(btn){
    btn.addEventListener("click", function(){ openStock(btn.getAttribute("data-s")); });
  });
})();

function openStock(k){
  cur = k; decision = null;
  var s = STOCKS[k];
  document.getElementById("pkg-name").textContent = s.name;
  var h = "<tr><th>Pos</th><th class='num'>Nilai</th><th>Satuan</th></tr>";
  s.nums.forEach(function(n){ h += "<tr><td>"+n[0]+"</td><td class='num'>"+fmtID(n[1], n[1]%1!==0?1:undefined)+"</td><td>"+n[2]+"</td></tr>"; });
  document.getElementById("pkg-tbl").innerHTML = h;
  document.getElementById("pkg-qual").innerHTML = s.qual.map(function(q){return "<li>"+q+"</li>";}).join("");
  ["step-package","step-thesis","step-committee","step-verdict"].forEach(function(id){document.getElementById(id).style.display="none";});
  show("step-package");
}

document.getElementById("to-thesis").addEventListener("click", function(){ show("step-thesis"); });
var pitchBtns = document.querySelectorAll("#pitch-btns .id-opt");

/* Rubrik substansi Step 3 (gap G-1 ronde 6; diperketat ronde 8 S4):
   panjang minimum 20 karakter tidak membuktikan isi — "bisnisnya bagus
   sekali" bisa lolos 20 karakter tanpa satu angka pun. Ronde 8 membuktikan
   cek lama (ada digit + ada satuan) diakali teks berangka kosong:
   "bagus 1x" / "risiko 1 Rp" / "harga 1 Rp" semuanya LOLOS. Maka tiap
   kolom kini divalidasi POLA, bukan sekadar keberadaan angka:
   - bull: angka + satuan DAN (perubahan berarah "18%→22%" ATAU "Rp…"
     ATAU kata konteks target/upside/naik/turun + "%") — "1% saja" ditolak
   - risk: angka PENYEBAB dan angka DAMPAK (min. 2 angka + satuan +
     "→" / "Rp" / "target") — "risiko 1 Rp" ditolak
   - inv: kata pemicu yang teramati (turun/naik/menyentuh/menembus/di
     bawah/di atas/≥/≤/…) terhubung angka + satuan — "harga 1 Rp" ditolak
   Fungsi murni (tanpa DOM) agar bisa diuji di Node. Skor 3+2+3+2=10 dan
   gerbang PASS ≥7 + keputusan benar TIDAK berubah: rubrik ini gerbang
   masuk komite (seperti cek panjang) + ditampilkan kembali di vonis
   sebagai bukti. */
function substanceChecks(bull, risk, inv){
  var hasNum = function(s){ return /\d/.test(s); };
  var hasUnit = function(s){ return /(%|\bRp|miliar|juta|poin|persen|kuartal|→|pp(?![a-z])|bps(?![a-z])|x(?![a-z0-9]))/i.test(s); };
  /* Ronde 9 V-M2 — format rumah "Rp2.450"/"Rp210" (tanpa spasi) adalah
     format yang diajarkan modul sendiri: /\bRp\b/ menuntut word-boundary
     setelah "Rp" dan menolaknya. Pakai /\bRp\s*\d/ (Rp langsung diikuti
     angka, spasi opsional). */
  var bullOk = hasNum(bull) && hasUnit(bull) &&
    (/\d\s*→\s*\d/.test(bull) || /\bRp\s*\d/i.test(bull) ||
     (/(target|upside|naik|turun|tumbuh|margin|pangsa|pendapatan|penjualan)\b/i.test(bull) && /%/.test(bull)));
  /* Ronde 9 V-S4 — nomor daftar ("1."/"2."/"3." di awal poin) dan
     sitasi ("I3", "§4") BUKAN angka substantif: buang dulu sebelum
     menghitung. "→" saja bukan satuan: syaratkan minimal satu angka
     ber-satuan dampak (Rp/%/pp/target) DAN satu penghubung sebab-dampak
     (→/target/kata arah/tanda −/+), supaya tiga harga tanpa
     sebab-dampak ("Rp1.900 / Rp2.500 / Rp3.000") tetap ditolak. */
  var riskCore = (risk || "").replace(/(^|[;\n])\s*\d+\s*[.)]\s*/g, " ")
    .replace(/\bI[1234]\b/g, " ").replace(/§\s*\d+/g, " ");
  var riskNums = (riskCore.match(/\d[\d.,]*/g) || []).length;
  var riskImpact = /(Rp\s*\d|\d[\d.,]*\s*(%|pp|persen|poin|bps)|target[^0-9]{0,10}Rp?\s*\d)/i.test(riskCore);
  var riskLink = /(→|target|turun|naik|jatuh|menyusut|melemah|menguat|−|\+)/i.test(riskCore);
  var riskOk = riskNums >= 2 && riskImpact && riskLink;
  var invOk = hasNum(inv) && hasUnit(inv) &&
    /(turun|naik|menyentuh|menembus|jatuh|sentuh|di\s*bawah|di\s*atas|≤|≥|>=|<=|kurang\s*dari|lebih\s*dari)/i.test(inv);
  return { bull: bullOk, risk: riskOk, inv: invOk };
}
/* Ronde 8 S5 — I1 §1 mensyaratkan 3 risiko terbesar, masing-masing
   dengan dampak ke target price. Simulator menguji ketiganya: textarea
   risiko wajib memuat 3 poin bernomor (1./2./3. atau 1)/2)/3)).
   Ronde 9 V-S4 — penanda bernomor harus "N."/"N)" yang diikuti spasi +
   teks (bukan "N.500" harga ribuan, bukan "Rp1.900"): tiga harga
   "Rp1.900 / 2.500 / Rp3.000" tidak lagi lolos. */
function hasThreeNumberedRisks(s){
  return /(?:^|[\s;])1[.)]\s+\S/.test(s) && /(?:^|[\s;])2[.)]\s+\S/.test(s) && /(?:^|[\s;])3[.)]\s+\S/.test(s);
}
/* Ronde 8 S6 — metode valuasi wajib terikat input utamanya (checklist
   per metode, I2). Memilih DDM lalu menulis narasi DCF = tidak lolos:
   bull case harus menyebut minimal satu input utama metode yang dipilih.
   Fungsi murni (tanpa DOM) agar bisa diuji di Node. */
var METHOD_INPUTS = {
  dcf:  { label: "DCF (FCFF)",
          need: "FCFF, WACC, g, net debt, saham beredar",
          hint: "DCF: sebutkan input utamanya di bull case — FCFF, WACC, g, net debt, dan saham beredar (mis. \"FCFF Rp210 M tumbuh 4%, WACC 9,5%\"). Target harus bisa direplikasi dari input ini.",
          re: /FCFF|WACC/i },
  ddm:  { label: "DDM / Residual income",
          need: "dividen, payout, required return",
          hint: "DDM: sebutkan dividen/payout dan required return di bull case (mis. \"dividen payout 45% konsisten, required return 10%\").",
          re: /dividen|payout|required return/i },
  mult: { label: "Multiples",
          need: "metrik, kelipatan, dasar peer/siklus",
          hint: "Multiples: sebutkan metrik, kelipatan, dan dasar peer/siklus di bull case (mis. \"P/E 10x vs peer 12x\").",
          re: /P\/E|EV\/EBITDA|kelipatan|peer/i }
};
function methodCheck(method, bull){
  var m = METHOD_INPUTS[method];
  if(!m) return { ok: false, hint: "Pilih metode valuasi." };
  return { ok: m.re.test(bull || ""), hint: m.hint };
}
/* Ronde 8 G2 — cek konsistensi ANTAR field thesis (lapisan di atas S4/S6):
   S4 memvalidasi pola PER field (ada angka bermakna); S6 mengikat metode
   ke input utamanya. Yang belum diperiksa: apakah angka-angka itu SELARAS
   satu sama lain — target yang disebut di bull case vs target price yang
   diketik, upside yang ditulis vs upside yang dihitung, target vs input
   DCF / multiples / DDM yang diisi, dampak risiko vs target, invalidasi
   vs target, dan input metode yang disebut di bull case vs yang diisi di
   kolom terstruktur. Fungsi murni (tanpa DOM, tanpa fmtID) agar bisa
   diuji di Node. Hasilnya PERINGATAN, BUKAN BLOKIR: ditampilkan di
   Step 4 + vonis; skor 3+2+3+2=10 dan gerbang PASS ≥7 + keputusan benar
   TIDAK berubah. Ambang longgar (±10% / 5pp / 1pp) supaya pembulatan
   wajar tidak memicu peringatan. Angka "Rp… M / miliar / juta" (mis.
   FCFF Rp210 M) BUKAN harga per saham — dikecualikan dari cek harga. */
function _consFmt(v){
  return String(Math.round(v)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
function _consRpNums(s){
  /* Angka Rp per saham saja: "Rp2.450", "Rp1.900" — bukan "Rp210 M"
     (FCFF jutaan) dan bukan komponen per saham ("Dividen Rp100",
     "EPS Rp180") yang memang bukan harga/target. */
  var out = [], m, re = /Rp\s*([0-9][0-9.,]*)\s*(M\b|miliar|juta)?/g;
  while((m = re.exec(s || "")) !== null){
    if(m[2]) continue;
    /* Ronde 9 V-N6 — "dividen per saham Rp81" / "EPS per saham Rp180":
       kata kunci boleh berjarak beberapa kata dari Rp ("per saham"),
       bukan hanya spasi langsung. */
    if(/(dividen|eps|fcff|payout)[^.]{0,25}$/i.test((s || "").slice(Math.max(0, m.index - 30), m.index))) continue;
    var v = m[1];
    var n = (v.indexOf(",") >= 0) ? parseFloat(v.replace(/\./g, "").replace(",", ".")) : parseFloat(v.replace(/\./g, ""));
    if(!isNaN(n)) out.push(n);
  }
  return out;
}
function _consPctAfter(s, kw){
  var m = new RegExp(kw + "[^0-9]{0,25}([0-9]+[.,]?[0-9]*)\\s*%", "i").exec(s || "");
  return m ? parseFloat(m[1].replace(",", ".")) : NaN;
}
function consistencyWarnings(o){
  var warn = [];
  var target = o.target, mkt = o.mkt;
  if(isNaN(target) || target <= 0 || isNaN(mkt) || mkt <= 0) return warn;
  /* 1. angka Rp di bull case vs target price (Rp harga pasar dikecualikan) */
  _consRpNums(o.bull).forEach(function(v){
    if(Math.abs(v - mkt) / mkt <= 0.02) return;
    if(Math.abs(v - target) / target > 0.10)
      warn.push("Bull case menyebut Rp" + _consFmt(v) + ", jauh dari target price Rp" + _consFmt(target) + " (lebih dari 10%) — angka mana yang benar?");
  });
  /* 2. upside/downside yang ditulis vs yang dihitung dari target-mu */
  var up = _consPctAfter(o.bull, "upside");
  if(!isNaN(up)){
    var upCalc = (target - mkt) / mkt * 100;
    if(Math.abs(up - upCalc) > 5)
      warn.push("Bull case menulis upside " + up + "%, padahal dari target Rp" + _consFmt(target) + " vs harga Rp" + _consFmt(mkt) + " upside-nya " + upCalc.toFixed(1) + "% — hitung ulang.");
  }
  var down = _consPctAfter(o.bull, "downside");
  if(!isNaN(down)){
    var downCalc = (mkt - target) / mkt * 100;
    if(Math.abs(down - downCalc) > 5)
      warn.push("Bull case menulis downside " + down + "%, padahal dari target Rp" + _consFmt(target) + " vs harga Rp" + _consFmt(mkt) + " downside-nya " + downCalc.toFixed(1) + "% — hitung ulang.");
  }
  /* 3. DCF: target bisa direplikasi dari input terstruktur? */
  if(o.method === "dcf" && [o.fcff, o.wacc, o.g, o.debt, o.shares].every(function(x){ return !isNaN(x); })
      && o.wacc > o.g && o.shares > 0){
    var ev = o.fcff * (1 + o.g / 100) / ((o.wacc - o.g) / 100);
    var tgt = (ev - o.debt) / o.shares * 1000;
    if(Math.abs(tgt - target) / target > 0.10)
      warn.push("DCF dari input terstruktur (FCFF Rp" + _consFmt(o.fcff) + " M, WACC " + o.wacc + "%, g " + o.g + "%, net debt Rp" + _consFmt(o.debt) + " M, " + _consFmt(o.shares) + " jt saham) menghasilkan target Rp" + _consFmt(tgt) + ", bukan Rp" + _consFmt(target) + " — periksa input atau target-mu.");
  }
  /* 4. dampak risiko: target setelah risiko tidak boleh ≥ target awal */
  var rm = /target[^0-9]{0,25}Rp\s*([0-9][0-9.,]*)/gi, m2;
  while((m2 = rm.exec(o.risk || "")) !== null){
    /* Ronde 9 V-N5 — "target awal Rp2.450" adalah target AWAL, bukan
       dampak risiko: lewati frasa target awal/semula/sebelumnya. */
    if(/awal|semula|sebelumnya/i.test(m2[0])) continue;
    var rv = m2[1];
    var rn = (rv.indexOf(",") >= 0) ? parseFloat(rv.replace(/\./g, "").replace(",", ".")) : parseFloat(rv.replace(/\./g, ""));
    if(!isNaN(rn) && rn >= target)
      warn.push("Dampak risiko menyebut target Rp" + _consFmt(rn) + " — sama/lebih tinggi dari target awal Rp" + _consFmt(target) + "; risiko seharusnya menurunkan target, bukan menaikkannya.");
  }
  /* 5. invalidasi: pemicu harga di atas target tidak konsisten */
  _consRpNums(o.inv).forEach(function(v){
    if(v > target)
      warn.push("Invalidasi menyebut Rp" + _consFmt(v) + ", di atas target Rp" + _consFmt(target) + " — pemicu jual di atas target tidak konsisten; invalidasi harga biasanya di bawah harga beli.");
  });
  /* 6. Multiples: target = metrik × kelipatan? */
  if(o.method === "mult" && !isNaN(o.eps) && !isNaN(o.mult) && o.eps > 0 && o.mult > 0){
    var implied = o.eps * o.mult;
    if(Math.abs(implied - target) / target > 0.10)
      warn.push("Multiples dari input terstruktur (EPS Rp" + _consFmt(o.eps) + " × " + o.mult + "x) menghasilkan Rp" + _consFmt(implied) + ", bukan target Rp" + _consFmt(target) + " — periksa metrik, kelipatan, atau target-mu.");
  }
  /* 7. DDM: target di bawah nilai dividen tanpa pertumbuhan = terlalu rendah */
  if(o.method === "ddm" && !isNaN(o.div) && !isNaN(o.req) && o.div > 0 && o.req > 0){
    var noGrowth = o.div / (o.req / 100);
    if(target < noGrowth * 0.9)
      warn.push("Target Rp" + _consFmt(target) + " di bawah nilai dividen tanpa pertumbuhan (Rp" + _consFmt(noGrowth) + " = dividen Rp" + _consFmt(o.div) + " ÷ required return " + o.req + "%) — dengan pertumbuhan, nilainya seharusnya lebih tinggi; periksa dividen atau required return-mu.");
  }
  /* 8. input metode di bull case vs kolom terstruktur (lintas field) */
  var waccBull = _consPctAfter(o.bull, "WACC");
  if(!isNaN(waccBull) && !isNaN(o.wacc) && Math.abs(waccBull - o.wacc) > 1)
    warn.push("Bull case menulis WACC " + waccBull + "%, tapi kolom terstruktur diisi " + o.wacc + "% — samakan angkanya.");
  var payBull = _consPctAfter(o.bull, "payout");
  if(!isNaN(payBull) && !isNaN(o.payout) && Math.abs(payBull - o.payout) > 5)
    warn.push("Bull case menulis payout " + payBull + "%, tapi kolom terstruktur diisi " + o.payout + "% — samakan angkanya.");
  return warn;
}
var consWarns = []; /* peringatan G2 untuk sesi ini (tampil di Step 4 + vonis) */
pitchBtns.forEach(function(btn){
  btn.addEventListener("click", function(){
    pitchBtns.forEach(function(b){b.classList.remove("sel");});
    btn.classList.add("sel"); decision = btn.getAttribute("data-dec");
  });
});

/* Ronde 8 S6 — checklist input utama metode, tampil dinamis di Step 3. */
document.getElementById("t-method").addEventListener("change", function(){
  var m = METHOD_INPUTS[this.value];
  var h = document.getElementById("method-hint");
  if(h) h.textContent = m ? ("Checklist " + m.label + ": " + m.need + ".") : "Pilih metode — checklist input utama muncul di sini.";
  /* Ronde 8 G2 — tampilkan kolom angka kunci metode yang dipilih. */
  var show = function(id, on){ var el = document.getElementById(id); if(el) el.style.display = on ? "block" : "none"; };
  show("inputs-dcf", this.value === "dcf");
  show("inputs-mult", this.value === "mult");
  show("inputs-ddm", this.value === "ddm");
  var none = document.getElementById("inputs-none");
  if(none) none.style.display = this.value ? "none" : "block";
});

document.getElementById("to-committee").addEventListener("click", function(){
  if(!decision){ alert("Pilih keputusan dulu (BUY / HOLD / PASS)."); return; }
  var target = parseIDNumber(document.getElementById("t-target").value);
  var targetWarn = parseIDNumber.lastWarning;
  var method = document.getElementById("t-method").value;
  var bull = document.getElementById("t-bull").value.trim();
  var risk = document.getElementById("t-risk").value.trim();
  var inv = document.getElementById("t-inv").value.trim();
  if(isNaN(target)||target<=0){ alert(isNaN(target)?("Target price tidak bisa dibaca: "+(targetWarn||"format angka tidak dikenal.")):"Isi target price (angka lebih dari 0)."); return; }
  if(!method){ alert("Pilih metode valuasi."); return; }
  if(bull.length<20){ alert("Tulis bull case yang serius (min. 20 karakter)."); return; }
  if(risk.length<20){ alert("Tulis 3 risiko terbesar + dampaknya (min. 20 karakter)."); return; }
  if(!hasThreeNumberedRisks(risk)){ alert("Risiko wajib 3 poin BERNOMOR (I1 §1: 3 risiko terbesar, masing-masing dengan dampak ke target) — mis. \"1. Daya beli turun 10% → target Rp1.900; 2. Margin EBIT turun >1,5pp → re-hitung target; 3. …\". Satu risiko utama saja tidak cukup."); return; }
  if(inv.length<20){ alert("Tulis invalidasi yang spesifik — angka/kejadian yang membuatmu JUAL (min. 20 karakter)."); return; }
  var mc = methodCheck(method, bull);
  if(!mc.ok){ alert("Metode dan thesis tidak terikat: "+mc.hint); return; }
  var sub = substanceChecks(bull, risk, inv);
  if(!sub.bull){ alert("Bull case butuh ANGKA yang bisa diuji — target/upside % atau perubahan berarah (mis. \"pangsa pasar 18%→22% dalam 3 tahun\" atau \"target Rp2.450, upside 36%\"). Narasi tanpa angka tidak lolos komite."); return; }
  if(!sub.risk){ alert("Risiko butuh DAMPAK TERUKUR per poin — angka PENYEBAB dan angka DAMPAK (mis. \"1. Daya beli turun 10% → target turun ke Rp1.900\"). Seberapa besar dampaknya, dalam angka?"); return; }
  if(!sub.inv){ alert("Invalidasi butuh PEMICU SPESIFIK yang teramati — harga/level/angka (mis. \"FCFF turun ≥20%\" atau \"harga menyentuh Rp1.400\"). \"Bila keadaan memburuk\" bukan pemicu."); return; }
  /* Ronde 8 G2 — cek konsistensi ANTAR field (peringatan, bukan blokir):
     dihitung SETELAH semua gerbang lolos; tidak ada return/alert di sini,
     jadi jawaban yang sudah lolos sebelumnya tetap lolos apa pun hasilnya. */
  var consIn = function(id){ var el = document.getElementById(id); return el ? parseIDNumber(el.value) : NaN; };
  consWarns = consistencyWarnings({
    target: target, mkt: STOCKS[cur].nums[0][1], method: method,
    bull: bull, risk: risk, inv: inv,
    fcff: consIn("in-fcff"), wacc: consIn("in-wacc"), g: consIn("in-g"),
    debt: consIn("in-debt"), shares: consIn("in-shares"),
    eps: consIn("in-eps"), mult: consIn("in-mult"),
    div: consIn("in-div"), payout: consIn("in-payout"), req: consIn("in-req")
  });
  var cb = document.getElementById("consistency-box");
  if(cb){
    cb.innerHTML = consWarns.length === 0
      ? '<div class="honest" style="margin-bottom:.8rem"><b>Cek konsistensi thesis:</b> ✓ angka-angka thesis selaras (target vs bull case, dampak risiko, invalidasi, dan input metode).</div>'
      : '<div class="id-kunci" style="margin-bottom:.8rem"><b>Cek konsistensi thesis — ' + consWarns.length + ' peringatan (bukan blokir, skor tidak berubah):</b><br>• ' + consWarns.join("<br>• ") + '</div>';
  }
  var s = STOCKS[cur], h = "";
  s.comm.forEach(function(cq,i){
    h += '<div class="id-field" style="margin-bottom:.8rem"><label>'+(i+1)+'. '+cq.q+'</label>'
      + '<input id="cq'+i+'" inputmode="decimal" placeholder="mis. 36,1"></div>';
  });
  /* Ronde 8 G3 — pertanyaan konseptual B setelah Q4 (di luar skor). */
  if(s.concept){
    h += '<div class="id-field" style="margin-bottom:.8rem"><label>5. '+s.concept.q+' (konseptual — di luar skor 10)</label>'
      + '<div class="id-btnrow"><label style="flex:1"><input type="radio" name="cq-concept" value="ya"> Ya</label>'
      + '<label style="flex:1"><input type="radio" name="cq-concept" value="tidak"> Tidak</label></div></div>';
  }
  document.getElementById("comm-qs").innerHTML = h;
  show("step-committee");
});

document.getElementById("to-verdict").addEventListener("click", function(){
  var s = STOCKS[cur], score = 0, max = 10, fb = [];
  /* 1. keputusan (3) — keputusan salah = 0, tanpa partial credit (fix 2026-11-05:
     pola Credit Desk: keputusan salah = gagal; di sini gerbang eksplisit di bawah
     karena max tetap 10 sehingga 7/10 tanpa keputusan benar tetap lolos) */
  var dScore = (decision === s.key.decision) ? 3 : 0;
  score += dScore;
  var dLabel = {buy:"BUY",hold:"HOLD",pass:"PASS"}[decision];
  var kLabel = {buy:"BUY",hold:"HOLD",pass:"PASS"}[s.key.decision];
  fb.push("<b>Keputusan Anda: "+dLabel+"</b> — kunci komite: <b>"+kLabel+"</b> ("+dScore+"/3).<br>"+s.key.why);
  /* 2. target price (2) */
  var target = parseIDNumber(document.getElementById("t-target").value);
  var targetWarn = parseIDNumber.lastWarning;
  var tScore = (!isNaN(target) && Math.abs(target-s.key.target) <= s.key.tol) ? 2 : 0;
  score += tScore;
  fb.push("<b>Target price ("+tScore+"/2):</b> "+(isNaN(target)?("Tidak terbaca — "+targetWarn+" "):("Anda Rp"+fmtID(target)+" — "))+"kunci Rp"+fmtID(s.key.target)+" (±"+s.key.tol+").");
  /* invalidasi tertulis (G2) — ditampilkan kembali di vonis agar diuji terhadap Q4 komite */
  var invTxt = document.getElementById("t-inv").value.trim();
  var invSafe = invTxt.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
  fb.push("<b>Invalidasi tertulis Anda:</b> "+invSafe+" — bandingkan dengan Q4 komite di bawah: apakah angkamu setajam pemicu jual yang diuji di sana?");
  /* Rubrik substansi (G-1) — bukti lolos gerbang, ditampilkan di vonis; skor TIDAK berubah */
  var subV = substanceChecks(document.getElementById("t-bull").value.trim(), document.getElementById("t-risk").value.trim(), invTxt);
  fb.push("<b>Rubrik substansi Step 3:</b> bull case berangka "+(subV.bull?"✓":"✗")+"; risiko berdampak terukur "+(subV.risk?"✓":"✗")+"; invalidasi berpemicu spesifik "+(subV.inv?"✓":"✗")+" — ketiganya lolos gerbang sebelum komite. Rubrik ini gerbang masuk, bukan poin skor: skor tetap 3+2+3+2=10, PASS ≥7 + keputusan benar.");
  /* 3. komite Q1–Q3 (3) — Q1 dinamis dari target-mu (anti-bocor kunci) */
  var cScore = 0, cFb = [];
  for(var i=0;i<3;i++){
    var cq = s.comm[i];
    var v = parseIDNumber(document.getElementById("cq"+i).value);
    var vWarn = parseIDNumber.lastWarning;
    var exp = cq.ans, ok;
    if(cq.dyn && !isNaN(target) && target>0){
      var mkt = s.nums[0][1];
      exp = cq.dyn==="up" ? (target-mkt)/mkt*100 : (mkt-target)/mkt*100;
    }
    ok = !isNaN(v) && Math.abs(v-exp) <= cq.tol; /* tol = ABSOLUT (bukan relatif) */
    if(ok) cScore++;
    cFb.push("Q"+(i+1)+": "+(ok?"✓":"✗")+" — "+(isNaN(v)?("Jawaban tidak terbaca: "+vWarn+" "):"")+cq.why+(cq.dyn?" (target-mu Rp"+fmtID(target)+")":""));
  }
  score += cScore;
  fb.push("<b>Bear challenges ("+cScore+"/3):</b><br>• "+cFb.join("<br>• "));
  /* 4. Q4 (2) — invalidasi (A/C) atau batas beli (B) */
  var iq = s.comm[3];
  var iv = parseIDNumber(document.getElementById("cq3").value);
  var ivWarn = parseIDNumber.lastWarning;
  var iOk = !isNaN(iv) && Math.abs(iv-iq.ans) <= iq.tol;
  var iScore = iOk ? 2 : 0;
  score += iScore;
  var iLabel = iq.q.indexOf("BATAS BELI")===0 ? "Batas beli" : (iq.q.indexOf("REVERSE-DCF")===0 ? "Reverse-DCF / required growth" : "Invalidasi");
  fb.push("<b>"+iLabel+" ("+iScore+"/2):</b> "+(iOk?"✓":"✗")+" — "+(isNaN(iv)?("Jawaban tidak terbaca: "+ivWarn+" "):"")+iq.why);
  /* Ronde 8 G2 — peringatan konsistensi ditampilkan kembali di vonis
     (bukan skor, bukan gerbang): jawaban benar sebelumnya tetap lolos. */
  fb.push("<b>Cek konsistensi thesis (peringatan, di luar skor):</b> " + (consWarns.length === 0 ? "✓ angka-angka thesis selaras." : "• " + consWarns.join("<br>• ")));
  /* Ronde 8 G3 — pertanyaan konseptual B (di luar skor 10). */
  if(s.concept){
    var picked = document.querySelector('input[name="cq-concept"]:checked');
    var cAns = picked ? picked.value : null;
    var cOk = (cAns === s.concept.ans);
    fb.push("<b>Konseptual — batas beli ≠ pemicu jual (di luar skor 10):</b> " + (cAns === null ? "Tidak dijawab — " : (cOk ? "✓ " : "✗ ")) + s.concept.why);
  }
  /* Gerbang keputusan: LULUS wajib skor ≥7 DAN keputusan benar. Tanpa gerbang ini,
     keputusan salah + sisa sempurna = 7/10 tetap lolos (review Instinct 2026-11-05). */
  var decOk = (decision === s.key.decision);
  var verdict = (score>=7 && decOk) ? "LULUS" : "BELUM LULUS";
  var cls = verdict==="LULUS" ? "ok" : "bad";
  var decNote = decOk ? "" : "<br><b>Keputusan salah — LULUS wajib keputusan benar.</b>";
  document.getElementById("verdict-box").innerHTML = '<div class="id-result show '+cls+'"><b>Skor: '+score+'/'+max+' — '+verdict+'</b>'+decNote+'</div>'
    + '<div class="id-kunci"><b>Kunci komite — '+s.name+':</b><br>• '+fb.join('<br><br>• ')+'</div>';
  idSave("sim_"+cur, {score:score, max:max, decision:decision});
  show("step-verdict");
});
document.getElementById("again").addEventListener("click", function(){ openStock(cur); });
document.getElementById("next-stock").addEventListener("click", function(){
  var keys = Object.keys(STOCKS), i = keys.indexOf(cur);
  openStock(keys[(i+1)%keys.length]);
});
