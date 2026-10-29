const C="cerny-dul-2026-v1";
const A=["./","./index.html","./manifest.webmanifest","./icon-192.png","./icon-512.png","./apple-touch-icon.png",
"./img/p1.jpg","./img/p2.jpg","./img/p3.jpg","./img/v1-auto.jpg","./img/v1-pesky.jpg","./img/v2-auto.jpg","./img/v2-pesky.jpg","./img/v3-auto.jpg"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(A)).then(()=>self.skipWaiting()));});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()));});
self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET")return;
  e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(r=>r||fetch(e.request).then(resp=>{
    const cp=resp.clone();caches.open(C).then(c=>c.put(e.request,cp));return resp;
  }).catch(()=>caches.match("./index.html"))));
});
