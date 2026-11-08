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
      { q: "P/E di harga pasar? (x) — EPS Rp180", ans: 10, tol: 0.5, why: "1.800 ÷ 180 = 10x — murah untuk konsumer defensif." },
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
    ]
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
           why: "Target Rp3.600 vs Rp5.000 = downside 28%. P/E 10x terlihat murah = value trap: laba tidak jadi kas + governance red flag. Bukan sekadar mahal — tidak investable." },
    comm: [
      { q: "Downside dari TARGET-MU vs harga pasar Rp5.000? (%)", dyn: "down", tol: 2, why: "Downside = (5.000 − target-mu) ÷ 5.000." },
      { q: "CFO rata-rata 3 tahun bila NI 348 dan CFO/NI 40%? (Rp miliar)", ans: 139, tol: 5, why: "348 × 0,4 = 139,2." },
      { q: "Selisih NI − CFO = ? (Rp miliar) — selisih laba dan kas yang perlu ditelusuri", ans: 209, tol: 8, why: "348 − 139 = 209. Ini selisih SATU periode — belum membuktikan kas tidak pernah diterima (bisa perubahan modal kerja/timing). Yang perlu ditelusuri: piutang/persediaan menumpuk atau revenue recognition agresif." },
      { q: "INVALIDASI (bagi yang nekat BUY): g berapa agar target = Rp5.000? (%)", ans: 4.6, tol: 0.3, inv: true,
        why: "g tersirat 4,65% adalah batas impas valuasi — pertumbuhan FCFF 4,65% selamanya yang membuat target = harga Rp5.000. Untuk properti siklikal yang labanya tidak jadi kas, asumsi itu agresif dan tidak didukung bukti (bandingkan: g 3% yang dipakai di DCF; pertumbuhan ekonomi jangka panjang ±5%) — jadi thesis BUY tidak punya margin: PASS. Invalidasi yang bisa diamati: CFO tetap jauh di bawah laba, atau g terealisasi bertahun-tahun di bawah 4,65%." }
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

/* Rubrik substansi Step 3 (gap G-1 ronde 6): panjang minimum 20 karakter tidak
   membuktikan isi — "bisnisnya bagus sekali" bisa lolos 20 karakter tanpa satu
   angka pun. Setiap kolom harus memuat ANGKA yang bisa diuji komite:
   - bull: target/upside numerik (angka + satuan: %, Rp, miliar, poin, "→", x)
   - risk: dampak terkuantifikasi — angka + satuan dampak (%, Rp, miliar, pp, bps)
   - inv: pemicu spesifik yang teramati — angka (harga/level/%) yang memicu JUAL
   Fungsi murni (tanpa DOM) agar bisa diuji di Node. Skor 3+2+3+2=10 dan gerbang
   PASS ≥7 + keputusan benar TIDAK berubah: rubrik ini gerbang masuk komite
   (seperti cek panjang) + ditampilkan kembali di vonis sebagai bukti. */
function substanceChecks(bull, risk, inv){
  var hasNum = function(s){ return /\d/.test(s); };
  var hasUnit = function(s){ return /(%|\bRp|miliar|juta|poin|persen|→|pp(?![a-z])|bps(?![a-z])|x(?![a-z0-9]))/i.test(s); };
  return {
    bull: hasNum(bull) && hasUnit(bull),
    risk: hasNum(risk) && hasUnit(risk),
    inv: hasNum(inv) && hasUnit(inv)
  };
}
pitchBtns.forEach(function(btn){
  btn.addEventListener("click", function(){
    pitchBtns.forEach(function(b){b.classList.remove("sel");});
    btn.classList.add("sel"); decision = btn.getAttribute("data-dec");
  });
});

document.getElementById("to-committee").addEventListener("click", function(){
  if(!decision){ alert("Pilih keputusan dulu (BUY / HOLD / PASS)."); return; }
  var target = parseIDNumber(document.getElementById("t-target").value,false);
  var targetWarn = parseIDNumber.lastWarning;
  var method = document.getElementById("t-method").value;
  var bull = document.getElementById("t-bull").value.trim();
  var risk = document.getElementById("t-risk").value.trim();
  var inv = document.getElementById("t-inv").value.trim();
  if(isNaN(target)||target<=0){ alert(isNaN(target)?("Target price tidak bisa dibaca: "+(targetWarn||"format angka tidak dikenal.")):"Isi target price (angka lebih dari 0)."); return; }
  if(!method){ alert("Pilih metode valuasi."); return; }
  if(bull.length<20){ alert("Tulis bull case yang serius (min. 20 karakter)."); return; }
  if(risk.length<20){ alert("Tulis risiko utama + dampaknya (min. 20 karakter)."); return; }
  if(inv.length<20){ alert("Tulis invalidasi yang spesifik — angka/kejadian yang membuatmu JUAL (min. 20 karakter)."); return; }
  var sub = substanceChecks(bull, risk, inv);
  if(!sub.bull){ alert("Bull case butuh ANGKA yang bisa diuji — target, upside %, atau level (mis. \"pangsa pasar 18%→22% dalam 3 tahun\"). Narasi tanpa angka tidak lolos komite."); return; }
  if(!sub.risk){ alert("Risiko butuh DAMPAK TERUKUR — angka + satuan (mis. \"daya beli turun 10% → target turun ke Rp1.900\"). Seberapa besar dampaknya, dalam angka?"); return; }
  if(!sub.inv){ alert("Invalidasi butuh PEMICU SPESIFIK yang teramati — harga/level/angka (mis. \"FCFF turun ≥20%\" atau \"harga menyentuh Rp1.400\"). \"Bila keadaan memburuk\" bukan pemicu."); return; }
  var s = STOCKS[cur], h = "";
  s.comm.forEach(function(cq,i){
    h += '<div class="id-field" style="margin-bottom:.8rem"><label>'+(i+1)+'. '+cq.q+'</label>'
      + '<input id="cq'+i+'" inputmode="decimal" placeholder="mis. 36,1"></div>';
  });
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
  var target = parseIDNumber(document.getElementById("t-target").value,false);
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
    var v = parseIDNumber(document.getElementById("cq"+i).value, true);
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
  var iv = parseIDNumber(document.getElementById("cq3").value, true);
  var ivWarn = parseIDNumber.lastWarning;
  var iOk = !isNaN(iv) && Math.abs(iv-iq.ans) <= iq.tol;
  var iScore = iOk ? 2 : 0;
  score += iScore;
  var iLabel = iq.q.indexOf("BATAS BELI")===0 ? "Batas beli" : "Invalidasi";
  fb.push("<b>"+iLabel+" ("+iScore+"/2):</b> "+(iOk?"✓":"✗")+" — "+(isNaN(iv)?("Jawaban tidak terbaca: "+ivWarn+" "):"")+iq.why);
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
