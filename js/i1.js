/* Investment Desk I1 — data quiz. */
var ID_QUIZ=[
 {q:"Blok thesis mana yang ditulis SEBELUM membeli dan menentukan kapan kamu menjual?",
  opts:["Bull case","Valuasi","Risiko","Invalidasi"],
  ans:3,why:"Invalidasi = angka/kejadian spesifik yang membatalkan thesis. Ditulis sebelum beli — kalau tidak ada, itu harapan, bukan thesis."},
 {q:"Bull case yang layak dibawa ke komite adalah…",
  opts:["Daftar keunggulan perusahaan yang sudah diketahui pasar","Argumen perubahan yang belum dihargai pasar, masing-masing dengan angka","Proyeksi harga saham 12 bulan ke depan","Ringkasan laporan tahunan"],
  ans:1,why:"Komite membayar untuk perubahan yang belum dihargai (mis. pangsa pasar 18%→22%), bukan untuk fakta yang sudah tercermin di harga."},
 {q:"Risiko yang benar dalam thesis adalah risiko yang…",
  opts:["Bersifat umum seperti kondisi makro","Ditulis agar terlihat lengkap","Spesifik dengan dampak ke target price","Dihindari agar thesis terlihat kuat"],
  ans:2,why:"Risiko generik = belum mikir. Risiko benar: 'daya beli turun → volume −10% = target turun ke Rp2.050'."},
 {q:"Dalam thesis testing 3 lensa, pertanyaan lensa FORENSIK adalah…",
  opts:["Bisakah perusahaan bangkrut sebelum thesis terbukti?","Apakah labanya jadi kas (CFO vs laba)?","Apa yang harus terjadi agar thesis benar?","Berapa target price-nya?"],
  ans:1,why:"Lensa forensik = kualitas laba: apakah laba berubah menjadi kas. Value trap paling umum = laba tanpa kas."},
 {q:"Thesis tanpa harga beli (\"beli di bawah RpX\") adalah…",
  opts:["Tetap valid selama analisisnya dalam","Opini, bukan keputusan","Cukup untuk komite","Strategi long-term yang sah"],
  ans:1,why:"Keputusan investasi = thesis + harga. Tanpa harga beli tidak ada keputusan — hanya opini."}
];
var ID_GATE="id_gate_i1";
IDQuiz.init();
