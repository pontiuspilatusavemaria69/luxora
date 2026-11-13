/*
 * Luxora E – Consent-Banner mit Google Analytics 4 (Basic Consent Mode v2).
 * Mess-ID: G-DSZ75EZW9M
 * Ohne ausdrückliches Opt-in werden weder gtag.js geladen noch GA4-Daten übertragen.
 * Einwilligungswahl in localStorage, Altersabfrage in sessionStorage (Bestand).
 * Datenschutztext/Betreiberangaben müssen vor Livegang rechtlich vervollständigt werden.
 */
(function () {
  'use strict';
  const MEASUREMENT_ID = 'G-DSZ75EZW9M';
  const CONSENT_KEY = 'luxora_analytics_consent_v2';
  const VALID_VALUES = new Set(['granted', 'denied']);
  let choice = null;
  let analyticsLoaded = false;
  let banner;
  let settings;
  let toggle;

  try {
    const stored = window.localStorage.getItem(CONSENT_KEY);
    if (VALID_VALUES.has(stored)) choice = stored;
  } catch (_e) { /* Private-Browsing/Storage-Sperre: immer erneut fragen */ }

  function ageAccepted() {
    if (!document.getElementById('ageAccept')) return true;
    try { return window.sessionStorage.getItem('et_age_ok') === 'yes'; }
    catch (_e) { return !document.getElementById('ageOverlay')?.classList.contains('open'); }
  }

  function setGtagConsent(value) {
    if (typeof window.gtag === 'function') {
      window.gtag('consent', 'update', {
        analytics_storage: value,
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied'
      });
    }
  }

  function startAnalytics() {
    if (analyticsLoaded || choice !== 'granted' || !ageAccepted()) return;
    // Weitere lokale GA4-Installation/GTM-Container dürfen nicht parallel aktiv sein.
    analyticsLoaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
    window.gtag('consent', 'default', {
      analytics_storage: 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied'
    });
    setGtagConsent('granted');
    window.gtag('js', new Date());
    window.gtag('config', MEASUREMENT_ID, {
      page_location: window.location.origin + window.location.pathname,
      allow_google_signals: false,
      allow_ad_personalization_signals: false
    });
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(MEASUREMENT_ID);
    script.setAttribute('data-luxora-ga4', '');
    document.head.appendChild(script);
  }

  function removeAnalyticsCookies() {
    // Best effort: kann keine fremden Partitionen, abweichenden Pfade oder HTTP-only-Cookies löschen.
    const names = ['_ga', '_ga_' + MEASUREMENT_ID.substring(2)];
    const domains = ['', '; domain=luxora-e.com', '; domain=.luxora-e.com'];
    for (const name of names) {
      for (const domain of domains) {
        document.cookie = name + '=; Max-Age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax' + domain;
      }
    }
  }

  function saveConsent(granted) {
    const wasLoaded = analyticsLoaded;
    choice = granted ? 'granted' : 'denied';
    try { window.localStorage.setItem(CONSENT_KEY, choice); } catch (_e) {}
    if (banner) banner.hidden = true;
    if (settings?.open) settings.close();
    if (granted) {
      window['ga-disable-' + MEASUREMENT_ID] = false;
      startAnalytics();
    } else {
      // Schon geladenes Analytics stoppen und per Reload das Google-Skript entfernen.
      window['ga-disable-' + MEASUREMENT_ID] = true;
      setGtagConsent('denied');
      removeAnalyticsCookies();
      if (wasLoaded) window.location.reload();
    }
  }

  function showBannerIfNeeded() {
    if (!banner || choice !== null || !ageAccepted()) return;
    banner.hidden = false;
  }

  function openSettings() {
    if (!settings) return;
    toggle.checked = choice === 'granted';
    if (!settings.open) settings.showModal();
  }

  function mountUI() {
    if (document.getElementById('luxoraCookieBanner')) return;
    const css = document.createElement('style');
    css.textContent = `
      #luxoraCookieBanner[hidden]{display:none!important}
      #luxoraCookieBanner{position:fixed;bottom:max(14px,env(safe-area-inset-bottom));left:50%;transform:translateX(-50%);width:min(940px,calc(100% - 28px));z-index:2147483000;background:#1e1920;color:#fff;border:1px solid #ae8862;border-radius:17px;box-shadow:0 14px 60px #0009;padding:20px;font-family:inherit}
      #luxoraCookieBanner h2{font-size:1.14rem;margin:0 0 8px;line-height:1.4;color:#f4d8a4}
      #luxoraCookieBanner p{font-size:.92rem;line-height:1.55;color:#ece6e9;margin:0 0 14px}
      #luxoraCookieBanner a,#luxoraCookieDialog a{color:#f4d8a4;text-decoration:underline;text-underline-offset:3px}
      .luxora-cookie-actions{display:flex;flex-wrap:wrap;gap:10px}
      .luxora-cookie-button{cursor:pointer;font:inherit;font-size:.94rem;font-weight:650;line-height:1.25;min-height:44px;border-radius:9px;padding:11px 16px;border:1px solid #dbb778;background:#dbb778;color:#171317;flex:1 1 170px}
      .luxora-cookie-button:focus-visible,.luxora-cookie-foot:focus-visible{outline:3px solid #fff;outline-offset:3px}
      .luxora-cookie-button.luxora-cookie-outline{color:#f6e4c1;background:transparent}
      #luxoraCookieDialog{box-sizing:border-box;max-width:530px;width:calc(100% - 28px);max-height:min(85vh,760px);overflow:auto;background:#1e1920;border:1px solid #dbb778;color:#fff;border-radius:16px;padding:25px;box-shadow:0 20px 90px #000a;font-family:inherit}
      #luxoraCookieDialog::backdrop{background:rgba(0,0,0,.72)}
      #luxoraCookieDialog h2{color:#f4d8a4;font-size:1.3rem;margin:0 0 12px}
      #luxoraCookieDialog p{font-size:.95rem;line-height:1.65;color:#eee8ed;margin:0 0 15px}
      .luxora-cookie-category{display:flex;gap:14px;justify-content:space-between;align-items:center;border:1px solid #665566;border-radius:10px;padding:12px;margin:12px 0}
      .luxora-cookie-category strong{display:block;color:#fff}
      .luxora-cookie-category small{display:block;color:#d7cfd7;line-height:1.5;margin-top:3px}
      #luxoraAnalyticsToggle{height:23px;width:23px;accent-color:#dbb778;flex:none}
      .luxora-cookie-foot{background:none;border:none;color:inherit;text-decoration:underline;text-underline-offset:3px;cursor:pointer;font:inherit;padding:4px}
      .luxora-cookie-dialog-actions{display:flex;flex-wrap:wrap;gap:10px;margin-top:17px}
      @media(max-width:600px){#luxoraCookieBanner{padding:16px;bottom:max(8px,env(safe-area-inset-bottom))}#luxoraCookieDialog{padding:19px}#luxoraCookieBanner p{font-size:.87rem}.luxora-cookie-button{flex-basis:120px}}
    `;
    document.head.appendChild(css);

    banner = document.createElement('section');
    banner.id = 'luxoraCookieBanner';
    banner.setAttribute('role', 'region');
    banner.setAttribute('aria-label', 'Çerez tercihleri');
    banner.hidden = true;
    banner.innerHTML = `
      <h2>Çerez ve gizlilik tercihleri</h2>
      <p>Siteyi çalıştırmak ve yaş tercihinizi hatırlamak için gerekli tarayıcı depolamasını kullanıyoruz. İzin verirseniz, ziyaretleri ölçmek için Google Analytics çerezleri kullanılır. İzin vermeseniz de siteyi kullanabilirsiniz. <a href="bilgilendirme.html">Gizlilik bilgileri</a></p>
      <div class="luxora-cookie-actions">
        <button type="button" class="luxora-cookie-button" id="luxoraCookieAccept">Tümünü kabul et</button>
        <button type="button" class="luxora-cookie-button luxora-cookie-outline" id="luxoraCookieReject">Tümünü reddet</button>
        <button type="button" class="luxora-cookie-button luxora-cookie-outline" id="luxoraCookieManage">Tercihleri ayarla</button>
      </div>`;
    document.body.appendChild(banner);

    settings = document.createElement('dialog');
    settings.id = 'luxoraCookieDialog';
    settings.setAttribute('aria-labelledby', 'luxoraCookieDialogTitle');
    settings.innerHTML = `
      <h2 id="luxoraCookieDialogTitle">Gizlilik ayarları</h2>
      <p>Hangi isteğe bağlı analiz teknolojilerine izin vereceğinize siz karar verirsiniz. Tercihinizi istediğiniz zaman değiştirebilirsiniz.</p>
      <div class="luxora-cookie-category"><span><strong>Zorunlu depolama</strong><small>Yaş onayının oturum boyunca hatırlanması ve çerez tercihinizin kaydedilmesi. Kapatılamaz.</small></span><span aria-label="Her zaman etkin">Açık</span></div>
      <label class="luxora-cookie-category" for="luxoraAnalyticsToggle"><span><strong>Google Analytics 4</strong><small>Ziyaret ve sayfa görüntüleme analizi. Google'a kullanım verileri aktarılabilir; isteğe bağlıdır.</small></span><input type="checkbox" id="luxoraAnalyticsToggle"></label>
      <p>Devam etmek için analiz izni vermek zorunda değilsiniz. <a href="bilgilendirme.html">Ayrıntılı gizlilik bilgileri</a></p>
      <div class="luxora-cookie-dialog-actions">
        <button type="button" class="luxora-cookie-button" id="luxoraCookieSave">Seçimi kaydet</button>
        <button type="button" class="luxora-cookie-button luxora-cookie-outline" id="luxoraCookieClose">Kapat</button>
      </div>`;
    document.body.appendChild(settings);
    toggle = settings.querySelector('#luxoraAnalyticsToggle');

    banner.querySelector('#luxoraCookieAccept').addEventListener('click', function () { saveConsent(true); });
    banner.querySelector('#luxoraCookieReject').addEventListener('click', function () { saveConsent(false); });
    banner.querySelector('#luxoraCookieManage').addEventListener('click', openSettings);
    settings.querySelector('#luxoraCookieSave').addEventListener('click', function () { saveConsent(toggle.checked); });
    settings.querySelector('#luxoraCookieClose').addEventListener('click', function () { settings.close(); });
    settings.addEventListener('click', function (event) { if (event.target === settings) settings.close(); });

    const privacyButton = document.createElement('button');
    privacyButton.className = 'luxora-cookie-foot';
    privacyButton.textContent = 'Çerez ayarları';
    privacyButton.type = 'button';
    privacyButton.addEventListener('click', openSettings);
    const footer = document.querySelector('.footer-links') || document.querySelector('footer .container') || document.querySelector('footer');
    if (footer) footer.appendChild(privacyButton);

    if (!ageAccepted()) {
      document.getElementById('ageAccept')?.addEventListener('click', function () {
        window.setTimeout(function () {
          showBannerIfNeeded();
          startAnalytics();
        }, 0);
      });
    }
    showBannerIfNeeded();
    startAnalytics();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mountUI);
  else mountUI();
})();
