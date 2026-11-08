/* Investment Desk — common helpers. parseIDNumber berasal dari fsa-web/js/modul37.js,
   DIVERGEN sejak fix Ronde 6 (2026-11-08): parser ketat format Indonesia — token malformed
   DITOLAK (bukan disalahartikan diam-diam) dan ribuan valid DITERIMA di semua field. */
function $(s,r){return (r||document).querySelector(s);}
function $$(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s));}
function parseIDNumber(str, isDecimal){
  /* Format Indonesia yang diterima (isDecimal TIDAK lagi membedakan cabang —
     satu parser ketat untuk semua field; "2.500" = 2500 di mana pun):
     - desimal pakai koma: 36,1 — koma desimal maks. 1, wajib ada digit di kedua sisi
     - ribuan pakai titik: 2.500, 1.234.567, 2.500,00 — kelompok pertama 1–3 digit,
       kelompok berikut tepat 3 digit; titik HANYA sebagai pemisah ribuan
     - satu titik + kelompok BUKAN 3 digit tanpa koma = desimal bertitik: 2.26, 10.7
     - tanpa pemisah: 2500, 2062
     Ditolak (NaN + parseIDNumber.lastWarning berisi alasan, dibaca pemanggil):
     "2.0,62" (kelompok ribuan "0" bukan 3 digit), "2,,5" (koma ganda),
     "1.23.456" (kelompok "23" bukan 3 digit), "abc", kosong, "2.", ",5". */
  parseIDNumber.lastWarning = "";
  function fail(msg){ parseIDNumber.lastWarning = msg; return NaN; }
  var raw = String(str||"").trim();
  if(!raw) return fail("Kosong — isi angka (contoh: 2.500 atau 36,1).");
  var s = raw.replace(/\s/g,"");
  if(/[^0-9.,\-+]/.test(s)) return fail("Format \""+raw+"\" tidak dikenal — hanya angka, titik ribuan, koma desimal, dan tanda di depan yang boleh dipakai.");
  var sign = 1;
  if(s.charAt(0)==="-" || s.charAt(0)==="+"){ if(s.charAt(0)==="-") sign = -1; s = s.slice(1); }
  if(!s) return fail("Hanya ada tanda tanpa angka — isi angkanya (contoh: 2.500 atau 36,1).");
  if(/[-+]/.test(s)) return fail("Tanda +/− hanya boleh di depan angka — \""+raw+"\" tidak bisa dibaca.");
  var commas = (s.match(/,/g)||[]).length;
  if(commas > 1) return fail("Koma desimal hanya boleh satu — \""+raw+"\" punya "+commas+" koma.");
  var intPart = s, decPart = null;
  if(commas === 1){
    var cp = s.split(",");
    intPart = cp[0]; decPart = cp[1];
    if(intPart === "") return fail("Koma desimal tanpa angka di depannya — tulis 0,5 bukan ,5.");
    if(decPart === "") return fail("Koma desimal tanpa angka di belakangnya — tulis 2,5 bukan 2,.");
  }
  var out, i, bad = false;
  if(intPart.indexOf(".") >= 0){
    var groups = intPart.split(".");
    for(i=0;i<groups.length;i++){ if(groups[i]===""){ bad = true; break; } }
    if(bad) return fail("Titik ribuan tidak boleh ganda atau di ujung — \""+raw+"\" tidak bisa dibaca.");
    if(groups.length === 2 && groups[1].length !== 3 && commas === 0){
      /* satu titik + kelompok bukan 3 digit = desimal bertitik: 2.26, 10.7, 0.5 */
      out = parseFloat(intPart);
    } else {
      /* ribuan: kelompok pertama 1–3 digit, sisanya tepat 3 digit */
      if(groups[0].length < 1 || groups[0].length > 3)
        return fail("Kelompok ribuan pertama harus 1–3 digit — \""+raw+"\" tidak bisa dibaca.");
      for(i=1;i<groups.length;i++){
        if(groups[i].length !== 3)
          return fail("Setiap kelompok ribuan setelah titik harus tepat 3 digit — \""+raw+"\" tidak bisa dibaca (contoh benar: 2.500 atau 1.234.567).");
      }
      out = parseInt(groups.join(""), 10);
      if(decPart !== null) out += parseFloat("0."+decPart);
    }
  } else {
    out = parseInt(intPart, 10);
    if(decPart !== null) out += parseFloat("0."+decPart);
  }
  if(isNaN(out)) return fail("Format \""+raw+"\" tidak bisa dibaca sebagai angka.");
  return sign*out;
}
parseIDNumber.lastWarning = "";

/* fmtID: format angka gaya Indonesia */
function fmtID(v, dec){
  if(v===null||v===undefined||isNaN(v)) return "—";
  var neg = v<0; v=Math.abs(v);
  var parts = dec? v.toFixed(2).split(".") : [String(Math.round(v))];
  var int = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g,".");
  var out = dec? int+","+parts[1] : int;
  return (neg?"-":"")+out;
}
/* toleransi numerik */
function near(a,b,tol){ return Math.abs(a-b) <= (tol||0.01); } /* ABSOLUT — pola tol*max(1,|b|) = relatif absurd, dilarang */
/* simpan/muat state id_* */
function idSave(key,obj){ try{ localStorage.setItem("id_"+key, JSON.stringify(obj)); }catch(e){} }
function idLoad(key){ try{ var v=localStorage.getItem("id_"+key); return v?JSON.parse(v):null; }catch(e){ return null; } }
