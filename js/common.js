/* Investment Desk — common helpers. parseIDNumber disalin BYTE-IDENTIK dari fsa-web/js/modul37.js */
function $(s,r){return (r||document).querySelector(s);}
function $$(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s));}
function parseIDNumber(str, isDecimal){
  var s = String(str||"").trim().replace(/\s/g,"");
  if(!s) return NaN;
  /* F3: validasi token penuh */
  if(/[^0-9.,\-+]/.test(s)) return NaN;  // karakter ilegal
  if(/--/.test(s) || /\+\+/.test(s)) return NaN;  // tanda ganda
  if(/\d-\d/.test(s) || /\d\+\d/.test(s)) return NaN;  // tanda di tengah (1-2)
  var dots = (s.match(/\./g)||[]).length;
  var commas = (s.match(/,/g)||[]).length;
  if(isDecimal){
    /* R17-F1: format Indonesia penuh — titik ribuan valid (diikuti kelipatan 3 digit + koma desimal) dilucuti dulu */
    s = s.replace(/\.(?=\d{3}(?:\.\d{3})*,)/g, "");
    var d2 = (s.match(/\./g)||[]).length, c2 = (s.match(/,/g)||[]).length;
    if(d2 + c2 > 1) return NaN;  // R1/F3: max 1 pemisah desimal
    s = s.replace(",",".");
  } else {
    if(s.indexOf(",")>=0){
      /* format Indonesia: 1.234,56 */
      if(dots > 0 && commas !== 1) return NaN;
      s = s.replace(/\./g,"").replace(",",".");
    } else if(/^-?0\./.test(s)){
      /* 0.xxx selalu desimal */
      if(dots !== 1) return NaN;
    } else {
      var parts = s.split(".");
      if(parts.length > 2) return NaN;  // F3: 1.2.3 ditolak
      if(parts.length === 2 && parts[1].length === 3 && parts[0] !== "0" && parts[0] !== "-0"){
        s = parts.join("");  // ribuan: 1.000 -> 1000
      } else if(parts.length === 2 && parts[1].length !== 3){
        /* desimal biasa: 2.26 tetap */
      } else if(parts.length === 2){
        return NaN;  // ambiguous
      }
    }
  }
  /* tanda hanya di depan */
  if(/-/.test(s.slice(1)) || /\+/.test(s.slice(1))) return NaN;
  var v = parseFloat(s);
  return isNaN(v) ? NaN : v;
}

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
