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
           why: "Target DCF Rp2.450 vs Rp1.800 = upside 36%. Bisnis defensif, kas terprediksi, MOS 15–20% sudah cukup — 36% sangat memadai." },
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
           why: "Target Rp3.300 vs Rp3.200 = upside 3,1% — tidak cukup untuk siklikal (butuh MOS 30%+). Bukan thesis jual (bisnis tidak rusak), tapi bukan thesis beli." },
    comm: [
      { q: "Upside dari TARGET-MU vs harga pasar Rp3.200? (%)", dyn: "up", tol: 1, why: "Upside = (target-mu − 3.200) ÷ 3.200." },
      { q: "Bila FCFF turun 12,5% (komoditas −20%), target barunya? (Rp)", ans: 2800, tol: 60, why: "FCFF 350 → EV 3.967 → equity 3.167 → ÷1.131 = Rp2.800." },
      { q: "P/E di harga pasar? (x) — EPS Rp300", ans: 10.7, tol: 0.5, why: "3.200 ÷ 300 = 10,7x — wajar, tidak murah." },
      { q: "INVALIDASI: harga beli MAKSIMUM dengan MOS 30% (siklikal)? (Rp)", ans: 2310, tol: 60, inv: true,
        why: "MOS = (nilai − harga) ÷ nilai. MOS 30% → harga = 3.300 × 0,70 = Rp2.310. Di atas itu = membayar tanpa buffer siklus." }
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
      { q: "Selisih NI − CFO = ? (Rp miliar) — inilah laba kertasnya", ans: 209, tol: 8, why: "348 − 139 = 209. Laba yang tidak pernah jadi kas." },
      { q: "INVALIDASI (bagi yang nekat BUY): g berapa agar target = Rp5.000? (%)", ans: 4.6, tol: 0.3, inv: true,
        why: "Butuh g 4,65% perpetuitas untuk properti siklikal — tidak masuk akal. Thesis BUY mati di sini." }
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
pitchBtns.forEach(function(btn){
  btn.addEventListener("click", function(){
    pitchBtns.forEach(function(b){b.classList.remove("sel");});
    btn.classList.add("sel"); decision = btn.getAttribute("data-dec");
  });
});

document.getElementById("to-committee").addEventListener("click", function(){
  if(!decision){ alert("Pilih keputusan dulu (BUY / HOLD / PASS)."); return; }
  var target = parseIDNumber(document.getElementById("t-target").value,false);
  var method = document.getElementById("t-method").value;
  var bull = document.getElementById("t-bull").value.trim();
  var risk = document.getElementById("t-risk").value.trim();
  if(isNaN(target)||target<=0){ alert("Isi target price (angka)."); return; }
  if(!method){ alert("Pilih metode valuasi."); return; }
  if(bull.length<20){ alert("Tulis bull case yang serius (min. 20 karakter)."); return; }
  if(risk.length<20){ alert("Tulis risiko utama + dampaknya (min. 20 karakter)."); return; }
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
  /* 1. keputusan (3) */
  var dScore = 0;
  if(decision === s.key.decision) dScore = 3;
  else if(cur==="B" && decision==="buy") dScore = 1;
  else if(cur==="C" && decision==="hold") dScore = 1;
  score += dScore;
  var dLabel = {buy:"BUY",hold:"HOLD",pass:"PASS"}[decision];
  var kLabel = {buy:"BUY",hold:"HOLD",pass:"PASS"}[s.key.decision];
  fb.push("<b>Keputusan Anda: "+dLabel+"</b> — kunci komite: <b>"+kLabel+"</b> ("+dScore+"/3).<br>"+s.key.why);
  /* 2. target price (2) */
  var target = parseIDNumber(document.getElementById("t-target").value,false);
  var tScore = (!isNaN(target) && Math.abs(target-s.key.target) <= s.key.tol) ? 2 : 0;
  score += tScore;
  fb.push("<b>Target price ("+tScore+"/2):</b> Anda Rp"+fmtID(target)+" — kunci Rp"+fmtID(s.key.target)+" (±"+s.key.tol+").");
  /* 3. komite Q1–Q3 (3) — Q1 dinamis dari target-mu (anti-bocor kunci) */
  var cScore = 0, cFb = [];
  for(var i=0;i<3;i++){
    var cq = s.comm[i];
    var v = parseIDNumber(document.getElementById("cq"+i).value, true);
    var exp = cq.ans, ok;
    if(cq.dyn && !isNaN(target) && target>0){
      var mkt = s.nums[0][1];
      exp = cq.dyn==="up" ? (target-mkt)/mkt*100 : (mkt-target)/mkt*100;
    }
    ok = !isNaN(v) && Math.abs(v-exp) <= cq.tol; /* tol = ABSOLUT (bukan relatif) */
    if(ok) cScore++;
    cFb.push("Q"+(i+1)+": "+(ok?"✓":"✗")+" — "+cq.why+(cq.dyn?" (target-mu Rp"+fmtID(target)+")":""));
  }
  score += cScore;
  fb.push("<b>Bear challenges ("+cScore+"/3):</b><br>• "+cFb.join("<br>• "));
  /* 4. invalidasi Q4 (2) */
  var iq = s.comm[3];
  var iv = parseIDNumber(document.getElementById("cq3").value, true);
  var iOk = !isNaN(iv) && Math.abs(iv-iq.ans) <= iq.tol;
  var iScore = iOk ? 2 : 0;
  score += iScore;
  fb.push("<b>Invalidasi ("+iScore+"/2):</b> "+(iOk?"✓":"✗")+" — "+iq.why);
  var verdict = score>=7 ? "LULUS" : "BELUM LULUS";
  var cls = verdict==="LULUS" ? "ok" : "bad";
  document.getElementById("verdict-box").innerHTML = '<div class="id-result show '+cls+'"><b>Skor: '+score+'/'+max+' — '+verdict+'</b></div>'
    + '<div class="id-kunci"><b>Kunci komite — '+s.name+':</b><br>• '+fb.join('<br><br>• ')+'</div>';
  idSave("sim_"+cur, {score:score, max:max, decision:decision});
  show("step-verdict");
});
document.getElementById("again").addEventListener("click", function(){ openStock(cur); });
document.getElementById("next-stock").addEventListener("click", function(){
  var keys = Object.keys(STOCKS), i = keys.indexOf(cur);
  openStock(keys[(i+1)%keys.length]);
});
