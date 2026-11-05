/* Investment Desk I3 — data quiz. */
var ID_QUIZ=[
 {q:"Alasan jual yang SAH adalah…",
  opts:["Harga turun 15% dari harga beli","Thesis rusak — invalidasi yang ditulis sebelum beli terpicu","Butuh uang untuk keperluan lain","Bosan karena harga stagnan 6 bulan"],
  ans:1,why:"Tiga alasan sah: thesis rusak, harga mencapai nilai, ada yang lebih baik. Sisanya emosi atau masalah kas."},
 {q:"\"Profit taking\" 20% padahal target belum tercapai adalah…",
  opts:["Disiplin yang baik","Alasan jual yang sah","Keputusan tanpa thesis — tidak sah","Wajib bila sudah untung"],
  ans:2,why:"Menjual tanpa target tercapai = keputusan tanpa thesis. Target tertulis yang menentukan, bukan perasaan untung."},
 {q:"Aturan batas per posisi (maks 10–15%) bertujuan…",
  opts:["Memaksimalkan return","Memastikan satu thesis yang salah tidak membunuh portfolio","Mengikuti aturan regulator","Memudahkan pajak"],
  ans:1,why:"Sizing tidak membuat thesis benar — ia membatasi kerusakan dari thesis yang salah."},
 {q:"Diversifikasi yang benar berarti…",
  opts:["Punya minimal 20 ticker","Thesis-thesis yang tidak berkorelasi","Beli semua sektor","Satu saham per sektor"],
  ans:1,why:"Tiga saham beda di sektor sama = satu taruhan. Diversifikasi = thesis yang tidak bergerak bersama."},
 {q:"Jurnal investasi ditulis…",
  opts:["Setelah jual, untuk evaluasi","Sebelum membeli — 5 baris, <10 menit","Setiap hari","Hanya untuk posisi yang rugi"],
  ans:1,why:"Jurnal adalah kontrak dengan diri sendiri SEBELUM uang keluar: thesis, target, invalidasi, ukuran, tanggal review."}
];
var ID_GATE="id_gate_i3";
IDQuiz.init();
