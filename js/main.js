/* ==========================================================================
   GEMOCEAN — Core JavaScript Engine
   Vanilla JS • Performance Optimized • Fast Search • WhatsApp Integration (+923338021790)
   ========================================================================== */

(function(){
  'use strict';

  var WA_PHONE = '923338021790';
  var WA_BASE = 'https://wa.me/' + WA_PHONE;

  /* ==========================================================================
     1. SERVICE WORKER REGISTRATION (Performance & Caching)
     ========================================================================== */
  if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
    window.addEventListener('load', function() {
      navigator.serviceWorker.register('./sw.js').catch(function(err) {
        // SW registration silently ignored on unsupported protocols
      });
    });
  }

  /* ==========================================================================
     2. HEADER SCROLL EFFECT (60fps requestAnimationFrame)
     ========================================================================== */
  var header = document.getElementById('siteHeader');
  var ticking = false;

  function updateHeader() {
    if (!header) return;
    if (window.scrollY > 24) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    ticking = false;
  }

  window.addEventListener('scroll', function() {
    if (!ticking) {
      window.requestAnimationFrame(updateHeader);
      ticking = true;
    }
  }, { passive: true });
  updateHeader();

  /* ==========================================================================
     3. MOBILE DRAWER MENU
     ========================================================================== */
  var hamburger = document.getElementById('hamburgerBtn');
  var panel = document.getElementById('mobilePanel');
  var scrim = document.getElementById('scrim');

  function toggleMenu(forceClose) {
    if (!panel || !hamburger || !scrim) return;
    var isOpen = forceClose ? false : !panel.classList.contains('open');
    panel.classList.toggle('open', isOpen);
    hamburger.classList.toggle('open', isOpen);
    scrim.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  if (hamburger && panel && scrim) {
    hamburger.addEventListener('click', function(e) {
      e.stopPropagation();
      toggleMenu();
    });
    scrim.addEventListener('click', function() {
      toggleMenu(true);
    });
    panel.querySelectorAll('a').forEach(function(el) {
      el.addEventListener('click', function() {
        toggleMenu(true);
      });
    });
  }

  /* ==========================================================================
     4. ACTIVE NAVIGATION LINK
     ========================================================================== */
  var page = document.body.getAttribute('data-page');
  if (page) {
    document.querySelectorAll('[data-nav]').forEach(function(link) {
      if (link.getAttribute('data-nav') === page) {
        link.classList.add('active');
      }
    });
  }

  /* ==========================================================================
     5. SCROLL REVEAL (IntersectionObserver)
     ========================================================================== */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function(el) { io.observe(el); });
  } else {
    revealEls.forEach(function(el) { el.classList.add('in'); });
  }

  /* ==========================================================================
     6. CONTACT FORM & DIRECT WHATSAPP SUBMIT
     ========================================================================== */
  var form = document.getElementById('enquiryForm');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      var note = document.getElementById('formNote');
      var name = (document.getElementById('fName') ? document.getElementById('fName').value : '').trim();
      var email = (document.getElementById('fEmail') ? document.getElementById('fEmail').value : '').trim();
      var phone = (document.getElementById('fPhone') ? document.getElementById('fPhone').value : '').trim();
      var interestEl = document.getElementById('fInterest');
      var interest = interestEl ? interestEl.value : 'General';
      var message = (document.getElementById('fMessage') ? document.getElementById('fMessage').value : '').trim();

      if (note) {
        note.textContent = 'Thank you' + (name ? ', ' + name : '') + ' — your enquiry is recorded. Opening WhatsApp directly...';
        note.classList.add('success');
      }

      // Build WhatsApp message and open in new tab
      var waMsg = 'Hello Gemocean,\n\nI would like to make an enquiry:\n' +
                  '• Name: ' + (name || 'Client') + '\n' +
                  '• Email: ' + (email || 'Not provided') + '\n' +
                  '• Phone: ' + (phone || 'Not provided') + '\n' +
                  '• Gemstone: ' + interest.toUpperCase() + '\n' +
                  '• Details: ' + (message || 'Looking for available stones');

      var waUrl = WA_BASE + '?text=' + encodeURIComponent(waMsg);
      setTimeout(function() {
        window.open(waUrl, '_blank', 'noopener,noreferrer');
      }, 400);

      form.reset();
    });
  }

  /* ==========================================================================
     7. LIVE INSTANT SEARCH ENGINE & MODAL
     ========================================================================== */
  var SEARCH_INDEX = [
    {
      id: 'ruby',
      title: 'Natural Ruby',
      category: 'ruby',
      categoryLabel: 'Corundum · Red',
      url: 'ruby.html',
      thumb: 'assets/ruby.jpg',
      snippet: 'Prized for a saturated red (Pigeon’s Blood) that holds under any light. Sourced from Mogok, Mozambique & Sri Lanka. Mohs 9 hardness.',
      keywords: 'ruby rubies corundum red pigeon blood mogok mozambique burma untreated heated gems faceted cushion oval round mohs 9'
    },
    {
      id: 'emerald',
      title: 'Natural Emerald',
      category: 'emerald',
      categoryLabel: 'Beryl · Green',
      url: 'emerald.html',
      thumb: 'assets/emerald.jpg',
      snippet: 'Known for vivid bluish-green hues and distinctive jardin inclusions. Sourced from Colombia, Panjshir Valley & Swat, Pakistan. Mohs 7.5-8.',
      keywords: 'emerald emeralds beryl green jardin panjshir swat colombia zambia cut oiling minor oil natural certified mohs 8'
    },
    {
      id: 'sapphire',
      title: 'Natural Sapphire',
      category: 'sapphire',
      categoryLabel: 'Corundum · Blue',
      url: 'sapphire.html',
      thumb: 'assets/sapphire.jpg',
      snippet: 'Corundum in velvety royal and cornflower blues. Sourced from Sri Lanka (Ceylon), Kashmir & Madagascar. Mohs 9 hardness.',
      keywords: 'sapphire sapphires blue corundum ceylon kashmir madagascar royal blue cornflower unheated cushion oval mohs 9'
    },
    {
      id: 'collection',
      title: 'The Gemstone Collection',
      category: 'gems',
      categoryLabel: 'Full Catalog',
      url: 'collection.html',
      thumb: 'assets/collection-trio.jpg',
      snippet: 'Explore our curated inventory of natural ruby, emerald and sapphire. Every stone independently certified with origin provenance.',
      keywords: 'collection all gemstones catalog list ruby emerald sapphire spinels aquamarine buy gemstones price enquiry'
    },
    {
      id: 'provenance-origins',
      title: 'Origins & Provenance Guide',
      category: 'origins',
      categoryLabel: 'Origins & Mining',
      url: 'about.html',
      thumb: 'assets/collection-trio.jpg',
      snippet: 'Learn how our gemstones move directly through a short chain from mine to cutter to us across Pakistan and international sources.',
      keywords: 'origins provenance peshawar swat valley panjshir kashmir burma ceylon ethical mining history sourcing'
    },
    {
      id: 'certification-guide',
      title: 'Gemological Certification & Reports',
      category: 'guides',
      categoryLabel: 'Standards & Quality',
      url: 'about.html',
      thumb: 'assets/emerald.jpg',
      snippet: 'Independent lab certification disclosures on treatments, origin verification, and transparent assessment standards.',
      keywords: 'certification certificate lab report gemology gia ssef grs authenticity genuine natural treatments disclosed'
    },
    {
      id: 'private-enquiry',
      title: 'Private Enquiry & Bespoke Sourcing',
      category: 'guides',
      categoryLabel: 'Enquiries',
      url: 'contact.html',
      thumb: 'assets/ruby.jpg',
      snippet: 'Connect directly with our gemologists for customized requests, specific carat sizes, pricing discussions, and worldwide shipping.',
      keywords: 'contact enquiry whatsapp phone call talk order custom sourcing asad gems peshawar price quotation'
    },
    {
      id: 'about-us',
      title: 'About Gemocean',
      category: 'guides',
      categoryLabel: 'Our Story',
      url: 'about.html',
      thumb: 'assets/collection-trio.jpg',
      snippet: 'A dedicated gemstone house bridging the distance between mine origins and passionate collectors worldwide.',
      keywords: 'about gemocean story team heritage values peshawar pakistan gemstone dealers'
    }
  ];

  var searchBackdrop = document.getElementById('searchModalBackdrop');
  var searchInput = document.getElementById('searchInput');
  var searchClear = document.getElementById('searchClear');
  var searchClose = document.getElementById('searchClose');
  var searchResultsList = document.getElementById('searchResultsList');
  var searchFilterChips = document.querySelectorAll('.search-filter-chip');
  var currentFilter = 'all';
  var selectedIndex = -1;
  var currentMatches = [];

  function openSearchModal() {
    if (!searchBackdrop || !searchInput) return;
    searchBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
    setTimeout(function(){
      searchInput.focus();
      searchInput.select();
    }, 50);
    renderSearchResults();
  }

  function closeSearchModal() {
    if (!searchBackdrop) return;
    searchBackdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  function escapeRegExp(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function highlightText(text, query) {
    if (!query) return text;
    var words = query.trim().split(/\s+/).filter(Boolean);
    if (!words.length) return text;
    var regex = new RegExp('(' + words.map(escapeRegExp).join('|') + ')', 'gi');
    return text.replace(regex, '<span class="search-highlight">$1</span>');
  }

  function filterAndSearch(query) {
    var q = (query || '').toLowerCase().trim();
    var qTokens = q.split(/\s+/).filter(Boolean);

    return SEARCH_INDEX.filter(function(item) {
      // Category filter match
      if (currentFilter !== 'all') {
        if (currentFilter === 'ruby' && item.category !== 'ruby') return false;
        if (currentFilter === 'emerald' && item.category !== 'emerald') return false;
        if (currentFilter === 'sapphire' && item.category !== 'sapphire') return false;
        if (currentFilter === 'origins' && item.category !== 'origins') return false;
        if (currentFilter === 'guides' && item.category !== 'guides') return false;
      }

      if (!qTokens.length) return true;

      var fullHaystack = (item.title + ' ' + item.categoryLabel + ' ' + item.snippet + ' ' + item.keywords).toLowerCase();
      return qTokens.every(function(token) {
        return fullHaystack.indexOf(token) !== -1;
      });
    });
  }

  function renderSearchResults() {
    if (!searchResultsList || !searchInput) return;
    var query = searchInput.value.trim();
    currentMatches = filterAndSearch(query);
    selectedIndex = -1;

    if (searchClear) {
      searchClear.classList.toggle('visible', query.length > 0);
    }

    if (currentMatches.length === 0) {
      searchResultsList.innerHTML =
        '<div class="search-empty">' +
          '<svg class="search-empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>' +
          '<h3>No matching gemstones found</h3>' +
          '<p>Try searching for Ruby, Emerald, Sapphire, Swat, Panjshir, Kashmir, or certification.</p>' +
          '<div class="search-quick-tags">' +
            '<button class="search-quick-tag" data-tag="Ruby">Ruby</button>' +
            '<button class="search-quick-tag" data-tag="Emerald">Emerald</button>' +
            '<button class="search-quick-tag" data-tag="Sapphire">Sapphire</button>' +
            '<button class="search-quick-tag" data-tag="Certification">Certification</button>' +
            '<button class="search-quick-tag" data-tag="Origins">Origins</button>' +
          '</div>' +
        '</div>';

      searchResultsList.querySelectorAll('.search-quick-tag').forEach(function(tagBtn) {
        tagBtn.addEventListener('click', function() {
          searchInput.value = this.getAttribute('data-tag');
          renderSearchResults();
        });
      });
      return;
    }

    var html = '';
    currentMatches.forEach(function(item, idx) {
      var thumbHtml = item.thumb
        ? '<img src="' + item.thumb + '" alt="' + item.title + '" class="search-result-thumb" loading="lazy" decoding="async">'
        : '<div class="search-result-thumb-placeholder">💎</div>';

      html +=
        '<li>' +
          '<a href="' + item.url + '" class="search-result-card" data-idx="' + idx + '">' +
            thumbHtml +
            '<div class="search-result-info">' +
              '<div class="search-result-header">' +
                '<span class="search-result-title">' + highlightText(item.title, query) + '</span>' +
                '<span class="search-result-badge">' + item.categoryLabel + '</span>' +
              '</div>' +
              '<p class="search-result-snippet">' + highlightText(item.snippet, query) + '</p>' +
            '</div>' +
            '<div class="search-result-action">' +
              '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>' +
            '</div>' +
          '</a>' +
        '</li>';
    });

    searchResultsList.innerHTML = html;
  }

  function updateSelectedCard() {
    var cards = searchResultsList.querySelectorAll('.search-result-card');
    cards.forEach(function(card, idx) {
      card.classList.toggle('selected', idx === selectedIndex);
    });
    if (selectedIndex >= 0 && cards[selectedIndex]) {
      cards[selectedIndex].scrollIntoView({ block: 'nearest' });
    }
  }

  // Event Listeners for Search
  document.querySelectorAll('.search-desktop, .search-btn, [data-search-trigger]').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      openSearchModal();
    });
  });

  if (searchClose) {
    searchClose.addEventListener('click', closeSearchModal);
  }

  if (searchBackdrop) {
    searchBackdrop.addEventListener('click', function(e) {
      if (e.target === searchBackdrop) {
        closeSearchModal();
      }
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', function() {
      renderSearchResults();
    });

    searchInput.addEventListener('keydown', function(e) {
      if (!currentMatches.length) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        selectedIndex = (selectedIndex + 1) % currentMatches.length;
        updateSelectedCard();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        selectedIndex = (selectedIndex - 1 + currentMatches.length) % currentMatches.length;
        updateSelectedCard();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        var targetIndex = selectedIndex >= 0 ? selectedIndex : 0;
        if (currentMatches[targetIndex]) {
          window.location.href = currentMatches[targetIndex].url;
        }
      }
    });
  }

  if (searchClear) {
    searchClear.addEventListener('click', function() {
      if (searchInput) {
        searchInput.value = '';
        searchInput.focus();
        renderSearchResults();
      }
    });
  }

  searchFilterChips.forEach(function(chip) {
    chip.addEventListener('click', function() {
      searchFilterChips.forEach(function(c){ c.classList.remove('active'); });
      this.classList.add('active');
      currentFilter = this.getAttribute('data-filter') || 'all';
      renderSearchResults();
    });
  });

  // Global Keyboard Shortcuts (Ctrl+K or / or Esc)
  window.addEventListener('keydown', function(e) {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (searchBackdrop && searchBackdrop.classList.contains('open')) {
        closeSearchModal();
      } else {
        openSearchModal();
      }
    } else if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
      e.preventDefault();
      openSearchModal();
    } else if (e.key === 'Escape') {
      if (searchBackdrop && searchBackdrop.classList.contains('open')) {
        closeSearchModal();
      }
      var waContainer = document.getElementById('whatsappFloatContainer');
      if (waContainer && waContainer.classList.contains('popup-open')) {
        waContainer.classList.remove('popup-open');
      }
    }
  });

  /* ==========================================================================
     8. WHATSAPP LIVE FLOATING WIDGET & TALK / CHAT ACTIONS (+923338021790)
     ========================================================================== */
  var waContainer = document.getElementById('whatsappFloatContainer');
  var waFloatBtn = document.getElementById('whatsappFloatBtn');
  var waPopupClose = document.getElementById('whatsappPopupClose');

  if (waFloatBtn && waContainer) {
    waFloatBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      waContainer.classList.toggle('popup-open');
    });

    if (waPopupClose) {
      waPopupClose.addEventListener('click', function(e) {
        e.stopPropagation();
        waContainer.classList.remove('popup-open');
      });
    }

    // Close popup if clicked outside
    document.addEventListener('click', function(e) {
      if (waContainer.classList.contains('popup-open') && !waContainer.contains(e.target)) {
        waContainer.classList.remove('popup-open');
      }
    });
  }

  // Pre-configured Quick Action prompts for WhatsApp (+923338021790)
  document.querySelectorAll('[data-wa-topic]').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      var topic = this.getAttribute('data-wa-topic') || 'General';
      var customText = '';

      switch(topic.toLowerCase()) {
        case 'ruby':
          customText = 'Hello Gemocean, I would like to inquire about your Natural Ruby collection (sizes, origin & availability).';
          break;
        case 'emerald':
          customText = 'Hello Gemocean, I am interested in inquiring about your Natural Emeralds (Panjshir, Swat & Colombia stones).';
          break;
        case 'sapphire':
          customText = 'Hello Gemocean, I would like details about your Natural Sapphire collection (Ceylon / Kashmir blues).';
          break;
        case 'certification':
          customText = 'Hello Gemocean, I would like information regarding gemological lab certificates and origin verification reports.';
          break;
        case 'custom':
          customText = 'Hello Gemocean, I am looking for custom gemstone sourcing for a private collector / bespoke jewellery project.';
          break;
        default:
          customText = 'Hello Gemocean, I would like to speak directly with a gemologist regarding natural gemstones.';
          break;
      }

      var targetUrl = WA_BASE + '?text=' + encodeURIComponent(customText);
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
      if (waContainer) waContainer.classList.remove('popup-open');
    });
  });

})();
