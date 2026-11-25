/* SRANGSUK FX — เอฟเฟกต์เบาๆ ใช้ได้ทั้งหน้าแรกและหน้าบริการ */
(function(){
  var d=document, root=d.documentElement;
  var RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var FINE=matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* แถบความคืบหน้า + header */
  var bar=d.createElement('div'); bar.className='fx-progress'; bar.setAttribute('aria-hidden','true'); d.body.appendChild(bar);
  var hdr=d.querySelector('header'), ticking=false;
  function onScroll(){
    if(ticking) return; ticking=true;
    requestAnimationFrame(function(){
      var h=root.scrollHeight-innerHeight;
      bar.style.setProperty('--p', h>0 ? Math.min(1,scrollY/h) : 0);
      if(hdr) hdr.classList.toggle('fx-scrolled', scrollY>10);
      ticking=false;
    });
  }
  addEventListener('scroll',onScroll,{passive:true}); onScroll();

  /* Reveal อัตโนมัติสำหรับหน้าบริการ */
  if(!RM){
    d.querySelectorAll('article h2, .tldr, .local-note, .adv, .steps li, .care li, .faq details, .rel-card, .cta-box').forEach(function(el){
      if(!el.classList.contains('reveal')) el.classList.add('reveal','fx-auto');
    });
  }
  /* ไล่จังหวะในกลุ่มเดียวกัน */
  var counts=new Map();
  d.querySelectorAll('.reveal').forEach(function(el){
    var p=el.parentElement, i=counts.get(p)||0; counts.set(p,i+1);
    if(i) el.style.setProperty('--fx-d', Math.min(i,6)*90+'ms');
    el.addEventListener('transitionend',function f(e){
      if(e.propertyName==='opacity' && el.classList.contains('in')){ el.classList.add('fx-done'); el.removeEventListener('transitionend',f); }
    });
  });
  var io=new IntersectionObserver(function(es){
    es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
  },{threshold:.12, rootMargin:'0px 0px -40px 0px'});
  d.querySelectorAll('.reveal:not(.in)').forEach(function(el){ io.observe(el); });

  /* นับเลขขึ้น */
  function countUp(b){
    var m=b.textContent.trim().match(/^(\d+)(.*)$/); if(!m) return;
    var end=+m[1], suf=m[2], t0=null, dur=1400;
    b.textContent='0'+suf;
    function step(t){
      if(!t0) t0=t; var k=Math.min(1,(t-t0)/dur), e=1-Math.pow(1-k,3);
      b.textContent=Math.round(end*e)+suf; if(k<1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if(!RM){
    var cio=new IntersectionObserver(function(es){
      es.forEach(function(e){ if(e.isIntersecting){ countUp(e.target); cio.unobserve(e.target); } });
    },{threshold:.6});
    d.querySelectorAll('.hero-stats b:not(.stars-b), .rev-badge .pill b').forEach(function(b){ cio.observe(b); });
  }

  if(!FINE || RM) return;

  /* การ์ด: สปอตไลต์ + เอียง 3D */
  d.querySelectorAll('.svc,.doc,.rev,.rel-card,.gal-item,.adv,.value,.info').forEach(function(c){
    c.classList.add('fx-card');
    var tilt=c.matches('.svc,.doc,.rev,.rel-card,.gal-item'), lift=c.matches('.svc,.doc')?6:3;
    c.addEventListener('pointermove',function(e){
      var r=c.getBoundingClientRect(), x=(e.clientX-r.left)/r.width, y=(e.clientY-r.top)/r.height;
      c.style.setProperty('--mx',(x*100).toFixed(1)+'%'); c.style.setProperty('--my',(y*100).toFixed(1)+'%');
      if(tilt){ c.classList.add('fx-tilting'); c.style.transform='perspective(900px) rotateX('+((.5-y)*7).toFixed(2)+'deg) rotateY('+((x-.5)*9).toFixed(2)+'deg) translateY(-'+lift+'px)'; }
    });
    c.addEventListener('pointerleave',function(){ c.classList.remove('fx-tilting'); c.style.transform=''; });
  });

  /* Hero parallax */
  var hero=d.querySelector('.hero'), hv=d.querySelector('.hero-visual');
  if(hero && hv){
    hero.addEventListener('pointermove',function(e){
      var r=hero.getBoundingClientRect();
      hv.style.setProperty('--px',((e.clientX-r.left)/r.width-.5).toFixed(3));
      hv.style.setProperty('--py',((e.clientY-r.top)/r.height-.5).toFixed(3));
    });
    hero.addEventListener('pointerleave',function(){ hv.style.setProperty('--px',0); hv.style.setProperty('--py',0); });
  }

  /* ปุ่มแม่เหล็ก */
  d.querySelectorAll('.btn-gold,.btn-line,.btn-line-big,.btn-line-nav,.fab-line').forEach(function(b){
    b.classList.add('fx-mag');
    b.addEventListener('pointermove',function(e){
      var r=b.getBoundingClientRect();
      b.style.setProperty('--tx',((e.clientX-r.left-r.width/2)*.18).toFixed(1)+'px');
      b.style.setProperty('--ty',((e.clientY-r.top-r.height/2)*.25).toFixed(1)+'px');
    });
    b.addEventListener('pointerleave',function(){ b.style.setProperty('--tx','0px'); b.style.setProperty('--ty','0px'); });
  });
})();
