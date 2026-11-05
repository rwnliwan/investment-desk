/* Investment Desk I2 — data quiz. */
var ID_QUIZ=[
 {q:"Untuk emiten BANK, metode valuasi yang benar adalah…",
  opts:["DCF (FCFF) seperti emiten biasa","DDM / residual income / P-BV","EV/EBITDA","Liquidation value"],
  ans:1,why:"DCF tidak cocok untuk bank — utang adalah bahan baku, bukan beban. Pakai DDM/residual income/P-BV."},
 {q:"Untuk emiten siklikal (komoditas) di puncak siklus, pendekatan yang benar adalah…",
  opts:["DCF dengan FCFF tahun berjalan","P/E tahun berjalan","Mid-cycle earnings × multiple normal","Jangan pernah sentuh emiten siklikal"],
  ans:2,why:"FCFF/EBITDA puncak membuat valuasi terlihat murah tepat sebelum jatuh. Pakai laba tengah-siklus."},
 {q:"Reverse-DCF berguna untuk…",
  opts:["Menghitung WACC","Menilai emiten growth tanpa laba — pertumbuhan berapa yang sudah dihargai pasar","Menggantikan DCF untuk bank","Menghitung margin of safety"],
  ans:1,why:"Balik pertanyaannya: ekspektasi pertumbuhan apa yang terkandung di harga saat ini? Masuk akal tidak?"},
 {q:"Margin of safety yang benar adalah…",
  opts:["Selalu 30%, angka klasik Graham","Fungsi ketidakpastian — makin tidak pasti, makin besar MOS yang dituntut","Selisih P/E vs rata-rata industri","Diskon 10% dari target price"],
  ans:1,why:"Bisnis stabil cukup 15–20%; siklikal 30–40%; thesis satu-asumsi 40%+ atau jangan beli."},
 {q:"P/E 8x bisa menipu (value trap) bila…",
  opts:["Perusahaan membayar dividen","Labanya tidak menjadi kas (CFO jauh di bawah laba)","Sahamnya likuid","Industrinya defensif"],
  ans:1,why:"Laba tanpa kas = laba kertas. Selalu cek CFO vs laba 3 tahun sebelum percaya kelipatan murah."}
];
var ID_GATE="id_gate_i2";
IDQuiz.init();
