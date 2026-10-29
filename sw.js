const C="cerny-dul-2026-v10";
const A=["./","./index.html","./manifest.webmanifest","./icon-192.png","./icon-512.png","./apple-touch-icon.png",
"./img/p1.jpg","./img/p2.jpg","./img/p3.jpg","./img/v1-auto.jpg","./img/v1-pesky.jpg","./img/v2-auto.jpg","./img/v2-pesky.jpg","./img/v3-auto.jpg","./img/qr.png","./img/p4.jpg","./img/p5.jpg","./img/p6.jpg","./img/v4-auto.jpg","./img/v5-auto.jpg","./img/v6-auto.jpg","./img/p7-auto.jpg"];
// cache:"reload" = stáhnout ze sítě, ne ze staré paměti prohlížeče
self.addEventListener("install",e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(A.map(u=>new Request(u,{cache:"reload"})))).then(()=>self.skipWaiting()));});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()));});
self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET")return;
  if(new URL(e.request.url).origin!==self.location.origin)return; // počasí apod. jde rovnou na internet
  const isPage=e.request.mode==="navigate"||e.request.url.endsWith("/index.html")||e.request.url.endsWith("/");
  if(isPage){
    // stránka: nejdřív internet (čerstvá verze), bez signálu uložená kopie
    e.respondWith(fetch(e.request,{cache:"no-cache"}).then(resp=>{
      const cp=resp.clone();caches.open(C).then(c=>c.put("./index.html",cp));return resp;
    }).catch(()=>caches.match("./index.html")));
    return;
  }
  e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(r=>r||fetch(e.request).then(resp=>{
    const cp=resp.clone();caches.open(C).then(c=>c.put(e.request,cp));return resp;
  }).catch(()=>caches.match("./index.html"))));
});
