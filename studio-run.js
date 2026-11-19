// studio-run.js — turns a player's game code into a safe page for a sandboxed <iframe>.
// The page can't reach the internet or this site (no cookies, no account, no outside images),
// and errors are reported back so the studio can show which line is wrong.
const CSP = `<meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src data: blob:; media-src data: blob:; font-src data:">`;
// games can't use the site's real storage, so localStorage works in memory instead of crashing
const REPORT = `<script>window.onerror=function(m,s,l){try{parent.postMessage({ghErr:String(m).slice(0,200),line:l},"*")}catch(e){}};try{window.localStorage}catch(e){var gm={},gs={getItem:function(k){return k in gm?gm[k]:null},setItem:function(k,v){gm[k]=String(v)},removeItem:function(k){delete gm[k]},clear:function(){gm={}},key:function(i){return Object.keys(gm)[i]||null},get length(){return Object.keys(gm).length}};try{Object.defineProperty(window,"localStorage",{value:gs,configurable:true});Object.defineProperty(window,"sessionStorage",{value:gs,configurable:true})}catch(x){}}<\/script>`;
export function buildDoc(code) {
    code = String(code || "");
    // keep line numbers the same: add our two tags at the end of the first line
    const nl = code.indexOf("\n");
    const first = nl < 0 ? code : code.slice(0, nl), rest = nl < 0 ? "" : code.slice(nl);
    if (/^\s*<!doctype/i.test(first)) return first + CSP + REPORT + rest;
    return CSP + REPORT + first + rest;
}
