(function () {
    function ensureSwitchStyles() {
        if (document.getElementById('site-language-switch-styles')) {
            return;
        }

        var style = document.createElement('style');
        style.id = 'site-language-switch-styles';
        style.textContent = [
            '.site-language-switch-floating{position:fixed;right:16px;bottom:16px;z-index:9999;display:flex;align-items:center;gap:8px;padding:10px 12px;border-radius:999px;background:rgba(8,12,24,0.92);border:1px solid rgba(255,255,255,0.12);backdrop-filter:blur(12px);box-shadow:0 10px 30px rgba(0,0,0,0.28);font-family:inherit;}',
            '.site-language-switch-floating .site-language-switch-label{font-size:12px;color:rgba(255,255,255,0.72);white-space:nowrap;}',
            '.site-language-switch-floating .site-language-switch-links{display:flex;align-items:center;gap:6px;flex-wrap:wrap;}',
            '.site-language-switch-floating .site-language-switch-link{display:inline-flex;align-items:center;justify-content:center;min-width:42px;padding:6px 10px;border-radius:999px;background:rgba(255,255,255,0.08);color:#fff;text-decoration:none;font-size:12px;border:1px solid transparent;transition:all .2s ease;}',
            '.site-language-switch-floating .site-language-switch-link:hover{background:rgba(255,140,0,0.18);border-color:rgba(255,140,0,0.3);}',
            '.site-language-switch-floating .site-language-switch-link[aria-current="page"]{background:rgba(255,140,0,0.22);border-color:rgba(255,140,0,0.42);color:#fff7ed;}',
            'html[dir="rtl"] .site-language-switch-floating{left:16px;right:auto;}',
            '@media (max-width: 640px){.site-language-switch-floating{left:12px;right:12px;bottom:12px;justify-content:space-between;padding:10px;}.site-language-switch-floating .site-language-switch-links{justify-content:flex-end;}}'
        ].join('');
        document.head.appendChild(style);
    }

    function buildSwitch() {
        var localeApi = window.SkillWarzLocale;

        if (!localeApi || document.querySelector('.site-language-switch-floating')) {
            return;
        }

        ensureSwitchStyles();

        var wrapper = document.createElement('div');
        wrapper.className = 'site-language-switch site-language-switch-floating';
        wrapper.setAttribute('aria-label', localeApi.locale && localeApi.locale.languageLabel ? localeApi.locale.languageLabel : 'Language');

        var label = document.createElement('span');
        label.className = 'site-language-switch-label';
        label.textContent = localeApi.locale && localeApi.locale.languageLabel ? localeApi.locale.languageLabel : 'Language';
        wrapper.appendChild(label);

        var links = document.createElement('div');
        links.className = 'site-language-switch-links';

        localeApi.locales.forEach(function (locale) {
            var link = document.createElement('a');
            link.className = 'site-language-switch-link';
            link.setAttribute('data-locale', locale.code);
            link.setAttribute('lang', locale.lang);
            link.href = localeApi.buildLocalePageHref(locale.code, localeApi.getCurrentPagePath()) + window.location.search + window.location.hash;
            link.textContent = locale.switchLabel;
            if (locale.code === localeApi.code) {
                link.setAttribute('aria-current', 'page');
            }
            links.appendChild(link);
        });

        wrapper.appendChild(links);
        document.body.appendChild(wrapper);
        localeApi.refreshLanguageSwitchLinks();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', buildSwitch);
    } else {
        buildSwitch();
    }
}());
