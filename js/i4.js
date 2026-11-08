/* Investment Desk I4 — bank soal Q&A accordion. */
var ID_QA=[
{cat:"TEKNIS",q:"Walk me through a DCF.",
 a:"Proyeksikan free cash flow 5–10 tahun, tentukan terminal value (perpetuity growth atau exit multiple), diskontokan dengan WACC, kurangi net debt, bagi dengan saham beredar → target price per saham.",
 r:"Rubrik: sebutkan FCFF (bukan laba), WACC sebagai discount rate, net debt dikurangi, saham diluted. Nilai plus: menyebut sensitivitas (tabel WACC × g) dan kapan DCF tidak cocok (bank)."},
{cat:"TEKNIS",q:"Kenapa EV/EBITDA dipakai, bukan P/E?",
 a:"EV/EBITDA netral terhadap struktur modal (EV mencakup utang, EBITDA sebelum bunga) — bisa membandingkan perusahaan dengan leverage berbeda. P/E terdistorsi oleh leverage dan pos non-operasional.",
 r:"Rubrik: 'netral struktur modal' adalah kata kunci. Nilai plus: menyebut kapan EV/EBITDA menipu (puncak siklus, capex besar)."},
{cat:"TEKNIS",q:"Kapan kamu TIDAK memakai DCF?",
 a:"Bank/finansial (pakai DDM/residual income/P-BV — utang adalah bahan baku), emiten tanpa arus kas yang bisa diproyeksikan secara kredibel, dan distress (ekuitas = opsi, bukan DCF).",
 r:"Rubrik: jawaban 'bank' wajib ada. Ini tes metode-mengikuti-emiten (I2)."},
{cat:"TEKNIS",q:"Apa itu margin of safety dan berapa yang kamu tuntut?",
 a:"Selisih antara nilai dan harga — buffer untuk kesalahan analisisku. Besarnya fungsi ketidakpastian: bisnis stabil 15–20%, siklikal 30–40%, thesis satu-asumsi 40%+ atau skip.",
 r:"Rubrik: menolak angka magis tunggal (mis. 'selalu 30%'). Menunjukkan MOS sebagai fungsi risiko."},
{cat:"TEKNIS",q:"Bagaimana kamu menentukan WACC?",
 a:"Cost of equity via CAPM (risk-free + beta × equity risk premium), cost of debt after-tax, dibobot target capital structure — bukan struktur saat ini bila berbeda jauh.",
 r:"Rubrik: menyebut CAPM, after-tax, dan target (bukan current) capital structure."},
{cat:"TEKNIS",q:"CFO jauh di bawah laba bersih 3 tahun — apa artinya?",
 a:"CFO yang konsisten jauh di bawah laba adalah red flag kualitas laba — telusuri penyebabnya: perbedaan waktu penerimaan kas dan perubahan modal kerja dapat menjelaskannya secara sah, atau masalah kualitas laba (piutang/persediaan menumpuk, revenue recognition agresif, capex dikapitalisasi). P/E murah pada laba yang tidak menjadi kas bisa jadi value trap — buktikan dulu lewat penelusuran.",
 r:"Rubrik: red flag yang ditelusuri, bukan vonis otomatis. Menyebut minimal 2 penyebab mekanis + penyebab sah (timing/modal kerja)."},
{cat:"TEKNIS",q:"Jelaskan perbedaan enterprise value dan equity value.",
 a:"EV = nilai seluruh perusahaan untuk semua pemilik modal (ekuitas + utang − kas). Equity value = EV − net debt = milik pemegang saham. Target price per saham dari equity value, bukan EV.",
 r:"Rubrik: jawaban presisi + menyebut kesalahan umum (membagi EV dengan saham)."},
{cat:"TEKNIS",q:"Kapan multiples lebih tepat daripada DCF?",
 a:"Umumnya bukan metode utama — multiples untuk screening dan cross-check; DCF/DDM untuk keputusan. Pengecualian: mid-cycle earnings × multiple normal (siklikal) dan SOTP (EBITDA × kelipatan segmen) — di sana multiple ADALAH metode utama, tapi kelipatannya wajib dijustifikasi dan di-cross-check dengan metode absolut.",
 r:"Rubrik: 'multiples untuk screening, DCF untuk keputusan' — kecuali mid-cycle/SOTP, di mana multiple adalah metode utama (tetap minta justifikasi kelipatan + cross-check). Menolak thesis yang hanya berdasar P/E murah."},
{cat:"STOCK PITCH",q:"Pitch me a stock. (2 menit)",
 a:"Pakai struktur 4 blok I1: (1) thesis 1 kalimat — apa yang pasar lewatkan; (2) angka — target, metode, upside; (3) 2 risiko terbesar + dampak; (4) invalidasi — kapan kamu jual. Jangan company profile.",
 r:"Rubrik: 30 detik per blok. Nilai tertinggi: risiko & invalidasi disebut TANPA ditanya — sinyal kejujuran analis."},
{cat:"STOCK PITCH",q:"Kenapa pasar salah menghargai saham ini? Apa variant perception-mu?",
 a:"Variant perception = pandangan yang berbeda dari konsensus DAN benar. Contoh: pasar melihat margin tertekan siklikal, saya melihat bauran produk permanen bergeser ke premium (bukti: 3 kuartal berturut-turut).",
 r:"Rubrik: harus ada 'konsensus bilang X, saya bilang Y karena bukti Z'. Tanpa ini = bukan thesis, cuma opini."},
{cat:"STOCK PITCH",q:"Apa yang bisa membuat thesis-mu salah?",
 a:"Jawab dengan invalidasi tertulis: angka spesifik (mis. same-store sales turun 2 kuartal, FCFF turun ≥20%, atau harga menyentuh Rp1.400) — bukan 'risiko makro'. Lalu: dampaknya ke target price.",
 r:"Rubrik: jawaban generik ('kondisi ekonomi') = gagal. Spesifik + terukur = lolos."},
{cat:"STOCK PITCH",q:"Saham ini turun 20% setelah kamu beli. Apa yang kamu lakukan?",
 a:"Untuk Sinar Ritel, turun 20% dari Rp1.500 = Rp1.200 — sudah menembus invalidasi Rp1.400 (I3 §4) → jual, catat 1 kalimat alasannya. Secara umum: buka jurnal (I3) — bila invalidasi TIDAK terpicu dan thesis masih hidup, baru pertimbangkan tambah (bila MOS makin besar). Tidak ada opsi 'tunggu dan berharap'.",
 r:"Rubrik: merujuk ke invalidasi tertulis, bukan emosi. Menyebut jurnal = nilai plus. Jangkar kanonis: turun 20% dari Rp1.500 = Rp1.200 < Rp1.400 → jual, bukan tambah."},
{cat:"STOCK PITCH",q:"Kapan kamu menjual saham yang naik 50%?",
 a:"Saya review jual bila: (1) harga mencapai nilai — target tertulis Rp2.062 tercapai, atau upside tersisa <10% (harga ≳Rp1.875 — batas eksak Rp1.874,55; sebelum target tercapai) — atau (2) ada kesempatan dengan thesis lebih kuat (perbandingan thesis-vs-thesis), atau (3) thesis rusak. Saya menjual bila hasil review mendukung — kecuali thesis rusak (invalidasi I1), yang berarti jual langsung. 'Profit taking' tanpa pemicu tertulis = tidak sah.",
 r:"Rubrik: tiga pemicu review jual I3 §1 — dan bedakan review vs jual langsung (hanya invalidasi = jual langsung). Menolak jawaban 'ambil untung dulu'."},
{cat:"STOCK PITCH",q:"Bagaimana kamu me-sizing posisi?",
 a:"Maks 10–15% per thesis; ukuran mengikuti keyakinan × ketidakpastian; korelasi dihitung (3 saham 1 sektor = 1 taruhan). Sizing membatasi kerusakan, bukan membuat thesis benar.",
 r:"Rubrik: menyebut batas eksplisit + korelasi. Sinyal manajemen risiko."},
{cat:"BEHAVIORAL",q:"Ceritakan keputusan investasi terburukmu dan pelajarannya.",
 a:"Struktur: (1) thesis saat itu, (2) apa yang salah — spesifik, (3) perubahan proses setelahnya (mis. 'sejak itu saya selalu tulis invalidasi sebelum beli'). Jangan salahkan pasar.",
 r:"Rubrik: kejujuran + perubahan PROSES (bukan sekadar 'lebih hati-hati'). Menyalahkan pasar = red flag."},
{cat:"BEHAVIORAL",q:"Kenapa buy-side, bukan sell-side / IB?",
 a:"Jawaban jujur lebih baik dari jawaban 'benar'. Contoh baik: 'Saya mau dibayar untuk benar tentang bisnis, bukan untuk menutup deal — dan saya mau hidup dengan konsekuensi thesis saya sendiri.'",
 r:"Rubrik: menunjukkan pemahaman beda insentif buy-side vs sell-side."},
{cat:"BEHAVIORAL",q:"Saham apa yang kamu ikuti saat ini di luar pitch-mu?",
 a:"Tunjukkan rasa ingin tahu yang hidup: 1–2 nama + 1 kalimat thesis masing-masing + apa yang kamu tunggu (katalis/invalidasi). Analis yang tidak mengikuti apa-apa di luar tugas = tidak punya hasrat.",
 r:"Rubrik: ada jawaban spontan dengan angka, bukan 'belum sempat mengikuti'."},
{cat:"BEHAVIORAL",q:"Bagaimana kamu tetap update tanpa tenggelam noise?",
 a:"Sistem: baca filing primer dulu (laporan keuangan), berita kedua; jurnal + tanggal review (I3); daftar pantau kecil (5–8 nama) dengan thesis 1 kalimat masing-masing. Noise diabaikan bila thesis tidak berubah.",
 r:"Rubrik: 'filing primer dulu' adalah sinyal disiplin. Punya sistem, bukan sekadar 'baca berita'."},
{cat:"BEHAVIORAL",q:"Atasanmu tidak setuju dengan thesis-mu. Apa yang kamu lakukan?",
 a:"Pisahkan ego dari thesis: (1) dengarkan — mungkin ia melihat risiko yang saya lewatkan; (2) uji ulang angka, bukan berdebat narasi; (3) bila angka tetap mendukung, sampaikan dengan data + akui ketidakpastiannya. Komite ada untuk menantang, bukan menyetujui.",
 r:"Rubrik: tidak defensif, tidak mengalah tanpa uji. Menunjukkan kedewasaan komite."},
{cat:"BEHAVIORAL",q:"Pertanyaan apa yang kamu ajukan ke kami?",
 a:"Tanya yang menunjukkan kamu berpikir seperti pemilik: 'Bagaimana proses komite di sini — siapa yang boleh membunuh thesis?' atau 'Keputusan terbaik yang pernah diambil tim ini dan kenapa?' Hindari tanya gaji/jam kerja di putaran awal.",
 r:"Rubrik: pertanyaan tentang PROSES keputusan = sinyal culture-fit buy-side."}
];
(function(){
  var h="";
  ID_QA.forEach(function(item,i){
    h+='<div class="qa"><button data-i="'+i+'"><span><span class="cat">'+item.cat+'</span><br>'+item.q+'</span><span class="n">Q'+(i+1)+'</span></button>'
      +'<div class="a hidden"><p>'+item.a+'</p><div class="rubrik"><b>Rubrik pewawancara:</b> '+item.r+'</div></div></div>';
  });
  document.getElementById("qa-list").innerHTML=h;
  var btns=document.querySelectorAll("#qa-list .qa > button");
  btns.forEach(function(b){
    b.addEventListener("click",function(){
      var a=b.nextElementSibling, open=!a.classList.contains("hidden");
      document.querySelectorAll("#qa-list .qa .a").forEach(function(x){x.classList.add("hidden");});
      if(!open) a.classList.remove("hidden");
    });
  });
  try{ idSave("i4_visited",{t:Date.now()}); }catch(e){}
})();
