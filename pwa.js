// Install DICE as an app: service worker, install button (Chrome, Edge, Android, Windows, Linux, macOS)
// and add-to-home-screen help for Safari on iPhone, iPad and Mac.
(function () {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () { navigator.serviceWorker.register('/sw.js').catch(function () {}); });
  }
  var standalone = (window.matchMedia && matchMedia('(display-mode: standalone)').matches) || navigator.standalone === true;
  if (standalone) return;
  var ua = navigator.userAgent, KEY = 'dice_install_hide';
  var hidden = function () { try { return Date.now() - (+localStorage.getItem(KEY) || 0) < 1209600000; } catch (_) { return false; } };
  var hide = function () { try { localStorage.setItem(KEY, String(Date.now())); } catch (_) {} };
  var css = '#dice-install{position:fixed;z-index:70;left:50%;transform:translateX(-50%);bottom:16px;width:min(calc(100% - 32px),440px);background:#0B4A2A;color:#fff;border-radius:16px;box-shadow:0 12px 32px rgba(0,0,0,.25);padding:14px 14px 14px 16px;display:flex;gap:12px;align-items:center;font:15px/1.4 "Public Sans",system-ui,sans-serif}'
    + '#dice-install img{width:44px;height:44px;border-radius:10px;flex-shrink:0;box-shadow:0 0 0 2px rgba(255,255,255,.25)}'
    + '#dice-install p{margin:0;flex:1;min-width:0}#dice-install b{display:block;font-size:15px}#dice-install span{font-size:13px;opacity:.9}'
    + '#dice-install button{font:inherit;font-weight:700;border:0;border-radius:999px;cursor:pointer;min-height:40px}'
    + '#dice-install .go{background:#F2B91C;color:#2B2105;padding:0 16px}#dice-install .x{background:transparent;color:#fff;width:36px;font-size:20px;line-height:1}'
    + '#dice-install button:focus-visible{outline:3px solid #F2B91C;outline-offset:2px}';
  function bar(title, text, action) {
    if (document.getElementById('dice-install') || hidden()) return;
    var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
    var d = document.createElement('div'); d.id = 'dice-install'; d.setAttribute('role', 'dialog'); d.setAttribute('aria-label', 'Install the DICE app');
    d.innerHTML = '<img src="/icon-192.png" alt=""><p><b>' + title + '</b><span>' + text + '</span></p>' + (action ? '<button type="button" class="go">Install</button>' : '') + '<button type="button" class="x" aria-label="Not now">×</button>';
    document.body.appendChild(d);
    d.querySelector('.x').addEventListener('click', function () { hide(); d.remove(); });
    if (action) d.querySelector('.go').addEventListener('click', function () { action(d); });
  }
  // Chrome, Edge, Samsung Internet, Opera: Android, Windows, Linux, macOS, ChromeOS.
  var deferred = null;
  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault(); deferred = e;
    setTimeout(function () {
      bar('Install the DICE app', 'Open election data from your home screen or desktop, even on a weak connection.', function (d) {
        if (!deferred) return; deferred.prompt();
        deferred.userChoice.then(function (c) { if (c.outcome !== 'accepted') hide(); deferred = null; d.remove(); });
      });
    }, 4000);
  });
  window.addEventListener('appinstalled', function () { var d = document.getElementById('dice-install'); if (d) d.remove(); hide(); });
  // Safari has no install prompt, so explain the menu steps.
  var iOS = /iPhone|iPad|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  var safari = /Safari/.test(ua) && !/Chrome|CriOS|FxiOS|EdgiOS|EdgA|Edg\/|OPR|SamsungBrowser|Android/.test(ua);
  var macSafari = safari && !iOS && /Macintosh/.test(ua) && /Version\/(1[7-9]|[2-9]\d)/.test(ua);
  if (iOS && safari) setTimeout(function () { bar('Add DICE to your Home Screen', 'Tap the Share button ↑ then “Add to Home Screen”.'); }, 4000);
  else if (macSafari) setTimeout(function () { bar('Add DICE to your Dock', 'In Safari choose File › Add to Dock.'); }, 4000);
})();
