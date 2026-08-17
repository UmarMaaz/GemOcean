/* ==========================================================================
   GEMOCEAN — Site behaviour (vanilla JS, no dependencies)
   ========================================================================== */
(function(){

  /* ---- Header scroll state ---- */
  var header = document.getElementById('siteHeader');
  function onScroll(){
    if(!header) return;
    if(window.scrollY > 24){ header.classList.add('scrolled'); }
    else{ header.classList.remove('scrolled'); }
  }
  window.addEventListener('scroll', onScroll, { passive:true });
  onScroll();

  /* ---- Mobile menu ---- */
  var hamburger = document.getElementById('hamburgerBtn');
  var panel = document.getElementById('mobilePanel');
  var scrim = document.getElementById('scrim');

  function toggleMenu(){
    var isOpen = panel.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    scrim.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }
  if(hamburger && panel && scrim){
    hamburger.addEventListener('click', toggleMenu);
    scrim.addEventListener('click', toggleMenu);
    panel.querySelectorAll('a, button').forEach(function(el){
      el.addEventListener('click', function(){
        if(panel.classList.contains('open')) toggleMenu();
      });
    });
  }

  /* ---- Active nav link, driven by body[data-page] ---- */
  var page = document.body.getAttribute('data-page');
  if(page){
    document.querySelectorAll('[data-nav]').forEach(function(link){
      if(link.getAttribute('data-nav') === page){
        link.classList.add('active');
      }
    });
  }

  /* ---- Reveal on scroll ---- */
  var revealEls = document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window && revealEls.length){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold:0.12, rootMargin:'0px 0px -60px 0px' });
    revealEls.forEach(function(el){ io.observe(el); });
  } else {
    revealEls.forEach(function(el){ el.classList.add('in'); });
  }

  /* ---- Contact form (static site — no backend) ---- */
  var form = document.getElementById('enquiryForm');
  if(form){
    form.addEventListener('submit', function(e){
      e.preventDefault();
      var note = document.getElementById('formNote');
      var name = form.querySelector('#fName').value.trim();
      note.textContent = 'Thank you' + (name ? ', ' + name : '') + ' — your enquiry has been noted. We will respond by email or phone shortly.';
      note.classList.add('success');
      form.reset();
    });
  }

})();
