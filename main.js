// Vercel Web Analytics
import { inject } from '@vercel/analytics';

inject();

// Existing functionality
(function(){
  var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Reveal on scroll */
  var cover=document.querySelector('.s-cover');
  requestAnimationFrame(function(){cover.classList.add('in')});
  var items=document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){
      es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}});
    },{threshold:.15});
    items.forEach(function(el){io.observe(el)});
  }else{items.forEach(function(el){el.classList.add('in')})}

  /* Video: play while at least half visible, pause otherwise */
  var video=document.getElementById('demoVideo');
  if('IntersectionObserver' in window){
    new IntersectionObserver(function(es){
      es.forEach(function(e){
        if(e.isIntersecting){var p=video.play();if(p&&p.catch)p.catch(function(){})}
        else video.pause();
      });
    },{threshold:.5}).observe(video);
  }

  /* Before / after slider */
  var cmp=document.getElementById('cmp'),handle=document.getElementById('cmpHandle');
  var pos=50,dragging=false,introDone=false;
  function setPos(p){
    pos=Math.max(0,Math.min(100,p));
    cmp.style.setProperty('--p',pos+'%');
    handle.setAttribute('aria-valuenow',Math.round(pos));
  }
  function fromEvent(e){var r=cmp.getBoundingClientRect();setPos((e.clientX-r.left)/r.width*100)}
  cmp.addEventListener('pointerdown',function(e){
    if(e.button!==undefined&&e.button!==0)return;
    dragging=true;introDone=true;
    cmp.classList.add('dragging');
    cmp.setPointerCapture(e.pointerId);
    fromEvent(e);
  });
  cmp.addEventListener('pointermove',function(e){if(dragging)fromEvent(e)});
  function stop(e){
    if(!dragging)return;
    dragging=false;cmp.classList.remove('dragging');
    try{cmp.releasePointerCapture(e.pointerId)}catch(_){}
  }
  cmp.addEventListener('pointerup',stop);
  cmp.addEventListener('pointercancel',stop);
  handle.addEventListener('keydown',function(e){
    var step=e.shiftKey?10:3;
    if(e.key==='ArrowLeft'||e.key==='ArrowDown'){setPos(pos-step);e.preventDefault()}
    else if(e.key==='ArrowRight'||e.key==='ArrowUp'){setPos(pos+step);e.preventDefault()}
    else if(e.key==='Home'){setPos(0);e.preventDefault()}
    else if(e.key==='End'){setPos(100);e.preventDefault()}
    introDone=true;
  });

  /* One-time intro: handle glides in from the right when the slider scrolls into view */
  function intro(){
    if(introDone||reduce)return;
    introDone=true;
    var from=94,to=50,dur=1400,t0=null;
    setPos(from);
    function ease(t){return 1-Math.pow(1-t,4)}
    function step(ts){
      if(dragging)return;
      if(t0===null)t0=ts;
      var k=Math.min(1,(ts-t0)/dur);
      setPos(from+(to-from)*ease(k));
      if(k<1)requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if('IntersectionObserver' in window){
    var io2=new IntersectionObserver(function(es){
      es.forEach(function(e){if(e.isIntersecting){setTimeout(intro,500);io2.disconnect()}});
    },{threshold:.6});
    io2.observe(cmp);
  }
  setPos(50);
})();
