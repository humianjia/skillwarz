(function () {
    var LOCALES = [
        { code: 'en', dir: '', lang: 'en', switchLabel: 'EN', languageLabel: 'Language' },
        { code: 'hi', dir: 'hi', lang: 'hi', switchLabel: 'HI', languageLabel: 'भाषा' },
        { code: 'ur', dir: 'ur', lang: 'ur', switchLabel: 'UR', languageLabel: 'زبان' },
        { code: 'tr', dir: 'tr', lang: 'tr', switchLabel: 'TR', languageLabel: 'Dil' },
        { code: 'pt-br', dir: 'pt-br', lang: 'pt-BR', switchLabel: 'PT', languageLabel: 'Idioma' },
        { code: 'it', dir: 'it', lang: 'it', switchLabel: 'IT', languageLabel: 'Lingua' }
    ];

    var LOCALE_BY_CODE = Object.create(null);
    var LOCALE_BY_DIR = Object.create(null);

    LOCALES.forEach(function (locale) {
        LOCALE_BY_CODE[locale.code] = locale;
        if (locale.dir) {
            LOCALE_BY_DIR[locale.dir] = locale;
        }
    });

    var MESSAGES = {
        en: {
            common: {
                searchGames: 'Search games...'
            },
            categories: {
                labels: {
                    all: 'All Games',
                    io: '.IO Games',
                    adventure: 'Adventure',
                    agility: 'Agility',
                    art: 'Art',
                    basketball: 'Basketball',
                    battle: 'Battle',
                    boardgames: 'Boardgames',
                    'bubble-shooter': 'Bubble Shooter',
                    cards: 'Cards',
                    care: 'Care',
                    casual: 'Casual',
                    cooking: 'Cooking',
                    'dress-up': 'Dress-up',
                    educational: 'Educational',
                    football: 'Football',
                    jigsaw: 'Jigsaw',
                    'mahjong-connect': 'Mahjong & Connect',
                    'match-3': 'Match-3',
                    merge: 'Merge',
                    puzzle: 'Puzzle',
                    quiz: 'Quiz',
                    racing: 'Racing',
                    shooter: 'Shooter',
                    simulation: 'Simulation',
                    sports: 'Sports',
                    strategy: 'Strategy',
                    fps: 'First-Person Shooters',
                    'battle-royale': 'Battle Royale',
                    sniper: 'Sniper Games',
                    multiplayer: 'Multiplayer Shooters',
                    action: 'Action Shooters'
                },
                gameSingular: 'Game',
                gamePlural: 'Games'
            },
            home: {
                launchingBrowser: 'Launching in browser...',
                loadingSelectedGame: 'Loading selected game...',
                genericGame: 'Game',
                genericGameIcon: 'Game icon'
            },
            play: {
                browserGame: 'Browser Game',
                gameDistribution: 'GameDistribution',
                loadingGame: 'Loading Game',
                moreGames: 'More Games',
                whatIs: 'WHAT IS {name}?',
                howToPlay: 'How to play: {instruction}',
                recommendations: '{category} Recommendations',
                expandedSelection: '{name} is part of our expanded {category} selection powered by GameDistribution.',
                detailTitle: '{name} - Play Free Online | skillwarz',
                detailDescription: 'Play {name} online for free on skillwarz.'
            }
        },
        hi: {
            common: {
                searchGames: 'गेम खोजें...'
            },
            categories: {
                labels: {
                    all: 'सभी गेम',
                    io: '.IO गेम्स',
                    adventure: 'साहसिक',
                    agility: 'चपलता',
                    art: 'कला',
                    basketball: 'बास्केटबॉल',
                    battle: 'युद्ध',
                    boardgames: 'बोर्ड गेम्स',
                    'bubble-shooter': 'बबल शूटर',
                    cards: 'कार्ड्स',
                    care: 'देखभाल',
                    casual: 'कैज़ुअल',
                    cooking: 'कुकिंग',
                    'dress-up': 'ड्रेस-अप',
                    educational: 'शैक्षिक',
                    football: 'फ़ुटबॉल',
                    jigsaw: 'जिगसॉ',
                    'mahjong-connect': 'माहजोंग और कनेक्ट',
                    'match-3': 'मैच-3',
                    merge: 'मर्ज',
                    puzzle: 'पहेली',
                    quiz: 'क्विज़',
                    racing: 'रेसिंग',
                    shooter: 'शूटर',
                    simulation: 'सिमुलेशन',
                    sports: 'खेल',
                    strategy: 'रणनीति',
                    fps: 'फर्स्ट-पर्सन शूटर्स',
                    'battle-royale': 'बैटल रॉयल',
                    sniper: 'स्नाइपर गेम्स',
                    multiplayer: 'मल्टीप्लेयर शूटर्स',
                    action: 'एक्शन शूटर्स'
                },
                gameSingular: 'गेम',
                gamePlural: 'गेम्स'
            },
            home: {
                launchingBrowser: 'ब्राउज़र में शुरू किया जा रहा है...',
                loadingSelectedGame: 'चयनित गेम लोड हो रहा है...',
                genericGame: 'गेम',
                genericGameIcon: 'गेम आइकन'
            },
            play: {
                browserGame: 'ब्राउज़र गेम',
                gameDistribution: 'GameDistribution',
                loadingGame: 'गेम लोड हो रहा है',
                moreGames: 'और गेम',
                whatIs: '{name} क्या है?',
                howToPlay: 'कैसे खेलें: {instruction}',
                recommendations: '{category} सुझाव',
                expandedSelection: '{name}, GameDistribution द्वारा समर्थित हमारी विस्तृत {category} सूची का हिस्सा है।',
                detailTitle: '{name} - मुफ्त ऑनलाइन खेलें | skillwarz',
                detailDescription: 'skillwarz पर {name} मुफ्त ऑनलाइन खेलें।'
            }
        },
        ur: {
            common: {
                searchGames: 'گیم تلاش کریں...'
            },
            categories: {
                labels: {
                    all: 'تمام گیمز',
                    io: '.IO گیمز',
                    adventure: 'ایڈونچر',
                    agility: 'چستی',
                    art: 'آرٹ',
                    basketball: 'باسکٹ بال',
                    battle: 'جنگ',
                    boardgames: 'بورڈ گیمز',
                    'bubble-shooter': 'ببل شوٹر',
                    cards: 'کارڈز',
                    care: 'دیکھ بھال',
                    casual: 'کژوال',
                    cooking: 'کھانا پکانا',
                    'dress-up': 'ڈریس اپ',
                    educational: 'تعلیمی',
                    football: 'فٹبال',
                    jigsaw: 'جیگسا',
                    'mahjong-connect': 'مہجونگ اور کنیکٹ',
                    'match-3': 'میچ-3',
                    merge: 'مرج',
                    puzzle: 'پہیلی',
                    quiz: 'کوئز',
                    racing: 'ریسنگ',
                    shooter: 'شوٹر',
                    simulation: 'سمولیشن',
                    sports: 'کھیل',
                    strategy: 'حکمت عملی',
                    fps: 'فرسٹ پرسن شوٹرز',
                    'battle-royale': 'بیٹل روئیل',
                    sniper: 'سنائپر گیمز',
                    multiplayer: 'ملٹی پلیئر شوٹرز',
                    action: 'ایکشن شوٹرز'
                },
                gameSingular: 'گیم',
                gamePlural: 'گیمز'
            },
            home: {
                launchingBrowser: 'براؤزر میں شروع کیا جا رہا ہے...',
                loadingSelectedGame: 'منتخب گیم لوڈ ہو رہی ہے...',
                genericGame: 'گیم',
                genericGameIcon: 'گیم آئیکن'
            },
            play: {
                browserGame: 'براؤزر گیم',
                gameDistribution: 'GameDistribution',
                loadingGame: 'گیم لوڈ ہو رہی ہے',
                moreGames: 'مزید گیمز',
                whatIs: '{name} کیا ہے؟',
                howToPlay: 'کیسے کھیلیں: {instruction}',
                recommendations: '{category} تجاویز',
                expandedSelection: '{name} ہماری وسیع {category} فہرست کا حصہ ہے جسے GameDistribution سپورٹ کرتا ہے۔',
                detailTitle: '{name} - مفت آن لائن کھیلیں | skillwarz',
                detailDescription: 'skillwarz پر {name} مفت آن لائن کھیلیں۔'
            }
        },
        tr: {
            common: {
                searchGames: 'Oyun ara...'
            },
            categories: {
                labels: {
                    all: 'Tüm Oyunlar',
                    io: '.IO Oyunları',
                    adventure: 'Macera',
                    agility: 'Çeviklik',
                    art: 'Sanat',
                    basketball: 'Basketbol',
                    battle: 'Savaş',
                    boardgames: 'Tahta Oyunları',
                    'bubble-shooter': 'Balon Patlatma',
                    cards: 'Kart Oyunları',
                    care: 'Bakım',
                    casual: 'Rahat',
                    cooking: 'Yemek Pişirme',
                    'dress-up': 'Giydirme',
                    educational: 'Eğitici',
                    football: 'Futbol',
                    jigsaw: 'Yapboz',
                    'mahjong-connect': 'Mahjong ve Bağla',
                    'match-3': 'Eşleştirme-3',
                    merge: 'Birleştir',
                    puzzle: 'Bulmaca',
                    quiz: 'Bilgi Yarışması',
                    racing: 'Yarış',
                    shooter: 'Nişancı',
                    simulation: 'Simülasyon',
                    sports: 'Spor',
                    strategy: 'Strateji',
                    fps: 'Birinci Sahıs Nişan Oyunları',
                    'battle-royale': 'Battle Royale',
                    sniper: 'Keskin Nişancı Oyunları',
                    multiplayer: 'Çok Oyunculu Nişan Oyunları',
                    action: 'Aksiyon Nişan Oyunları'
                },
                gameSingular: 'Oyun',
                gamePlural: 'Oyunlar'
            },
            home: {
                launchingBrowser: 'Tarayıcıda başlatılıyor...',
                loadingSelectedGame: 'Seçilen oyun yükleniyor...',
                genericGame: 'Oyun',
                genericGameIcon: 'Oyun simgesi'
            },
            play: {
                browserGame: 'Tarayıcı Oyunu',
                gameDistribution: 'GameDistribution',
                loadingGame: 'Oyun Yükleniyor',
                moreGames: 'Daha Fazla Oyun',
                whatIs: '{name} Nedir?',
                howToPlay: 'Nasıl oynanır: {instruction}',
                recommendations: '{category} Önerileri',
                expandedSelection: '{name}, GameDistribution destekli genişletilmiş {category} seçiminin bir parçasıdır.',
                detailTitle: '{name} - Ücretsiz Online Oyna | skillwarz',
                detailDescription: '{name} oyununu skillwarz üzerinde ücretsiz online oynayın.'
            }
        },
        'pt-br': {
            common: {
                searchGames: 'Pesquisar jogos...'
            },
            categories: {
                labels: {
                    all: 'Todos os Jogos',
                    io: 'Jogos .IO',
                    adventure: 'Aventura',
                    agility: 'Agilidade',
                    art: 'Arte',
                    basketball: 'Basquete',
                    battle: 'Batalha',
                    boardgames: 'Jogos de tabuleiro',
                    'bubble-shooter': 'Bubble Shooter',
                    cards: 'Jogos de cartas',
                    care: 'Cuidado',
                    casual: 'Casual',
                    cooking: 'Cozinha',
                    'dress-up': 'Vestir',
                    educational: 'Educativo',
                    football: 'Futebol',
                    jigsaw: 'Quebra-cabeça',
                    'mahjong-connect': 'Mahjong e Conectar',
                    'match-3': 'Combinar-3',
                    merge: 'Unir',
                    puzzle: 'Quebra-cabeça',
                    quiz: 'Quiz',
                    racing: 'Corrida',
                    shooter: 'Tiro',
                    simulation: 'Simulação',
                    sports: 'Esportes',
                    strategy: 'Estratégia',
                    fps: 'Jogos de Tiro em Primeira Pessoa',
                    'battle-royale': 'Battle Royale',
                    sniper: 'Jogos de Sniper',
                    multiplayer: 'Tiros Multijogador',
                    action: 'Tiros de Ação'
                },
                gameSingular: 'jogo',
                gamePlural: 'jogos'
            },
            home: {
                launchingBrowser: 'Iniciando no navegador...',
                loadingSelectedGame: 'Carregando o jogo selecionado...',
                genericGame: 'Jogo',
                genericGameIcon: 'Ícone do jogo'
            },
            play: {
                browserGame: 'Jogo de Navegador',
                gameDistribution: 'GameDistribution',
                loadingGame: 'Carregando jogo',
                moreGames: 'Mais Jogos',
                whatIs: 'O que é {name}?',
                howToPlay: 'Como jogar: {instruction}',
                recommendations: 'Recomendações de {category}',
                expandedSelection: '{name} faz parte da nossa seleção ampliada de {category}, com tecnologia da GameDistribution.',
                detailTitle: '{name} - Jogue Online Grátis | skillwarz',
                detailDescription: 'Jogue {name} online grátis no skillwarz.'
            }
        },
        it: {
            common: {
                searchGames: 'Cerca giochi...'
            },
            categories: {
                labels: {
                    all: 'Tutti i Giochi',
                    io: 'Giochi .IO',
                    adventure: 'Avventura',
                    agility: 'Agilità',
                    art: 'Arte',
                    basketball: 'Basket',
                    battle: 'Battaglia',
                    boardgames: 'Giochi da tavolo',
                    'bubble-shooter': 'Bubble Shooter',
                    cards: 'Carte',
                    care: 'Cura',
                    casual: 'Casual',
                    cooking: 'Cucina',
                    'dress-up': 'Vestire',
                    educational: 'Educativo',
                    football: 'Calcio',
                    jigsaw: 'Rompicapo',
                    'mahjong-connect': 'Mahjong e Connetti',
                    'match-3': 'Match-3',
                    merge: 'Unire',
                    puzzle: 'Rompicapo',
                    quiz: 'Quiz',
                    racing: 'Corsa',
                    shooter: 'Sparatutto',
                    simulation: 'Simulazione',
                    sports: 'Sport',
                    strategy: 'Strategia',
                    fps: 'Sparatutto in Prima Persona',
                    'battle-royale': 'Battle Royale',
                    sniper: 'Giochi di Cecchini',
                    multiplayer: 'Sparatutto Multiplayer',
                    action: "Sparatutto d'Azione"
                },
                gameSingular: 'gioco',
                gamePlural: 'giochi'
            },
            home: {
                launchingBrowser: 'Avvio nel browser...',
                loadingSelectedGame: 'Caricamento del gioco selezionato...',
                genericGame: 'Gioco',
                genericGameIcon: 'Icona del gioco'
            },
            play: {
                browserGame: 'Gioco per Browser',
                gameDistribution: 'GameDistribution',
                loadingGame: 'Caricamento gioco',
                moreGames: 'Altri Giochi',
                whatIs: 'Che cos’è {name}?',
                howToPlay: 'Come si gioca: {instruction}',
                recommendations: 'Consigli su {category}',
                expandedSelection: '{name} fa parte della nostra selezione estesa di {category} offerta da GameDistribution.',
                detailTitle: '{name} - Gioca Online Gratis | skillwarz',
                detailDescription: 'Gioca a {name} online gratis su skillwarz.'
            }
        }
    };

    function normalizeLocaleCode(value) {
        var raw = String(value || '').trim().toLowerCase().replace(/_/g, '-');
        if (!raw) {
            return 'en';
        }
        if (raw.indexOf('pt-br') === 0 || raw === 'pt') {
            return 'pt-br';
        }
        if (raw.indexOf('hi') === 0) {
            return 'hi';
        }
        if (raw.indexOf('ur') === 0) {
            return 'ur';
        }
        if (raw.indexOf('tr') === 0) {
            return 'tr';
        }
        if (raw.indexOf('it') === 0) {
            return 'it';
        }
        return LOCALE_BY_CODE[raw] ? raw : 'en';
    }

    function stripLocalePrefix(pathname) {
        var cleanPath = String(pathname || '').replace(/\\/g, '/').replace(/^\/+/, '');
        var parts = cleanPath.split('/').filter(Boolean);

        if (parts.length && LOCALE_BY_DIR[parts[0].toLowerCase()]) {
            parts = parts.slice(1);
        }

        return parts.join('/');
    }

    function stripLocaleSuffix(pagePath) {
        return String(pagePath || '').replace(/-((?:pt-br)|hi|ur|tr|it)\.html$/i, '.html');
    }

    function getCurrentLocaleCode() {
        var pathname = String(window.location.pathname || '').replace(/\\/g, '/');
        var normalized = pathname.replace(/^\/+/, '');
        var parts = normalized.split('/').filter(Boolean);

        if (parts.length && LOCALE_BY_DIR[parts[0].toLowerCase()]) {
            return normalizeLocaleCode(parts[0]);
        }

        var fileName = parts.length ? parts[parts.length - 1] : 'index.html';
        var suffixMatch = fileName.match(/-((?:pt-br)|hi|ur|tr|it)\.html$/i);
        if (suffixMatch) {
            return normalizeLocaleCode(suffixMatch[1]);
        }

        return normalizeLocaleCode(document.documentElement.lang);
    }

    function getCurrentPagePath() {
        var pathname = String(window.location.pathname || '').replace(/\\/g, '/');
        var normalized = pathname.replace(/^\/+/, '');
        var stripped = stripLocalePrefix(normalized);

        if (!stripped) {
            return 'index.html';
        }

        return stripLocaleSuffix(stripped);
    }

    function formatTemplate(template, values) {
        return String(template || '').replace(/\{(\w+)\}/g, function (match, key) {
            return Object.prototype.hasOwnProperty.call(values || {}, key) ? values[key] : match;
        });
    }

    function splitPathAndSuffix(value) {
        var stringValue = String(value || '');
        var queryIndex = stringValue.indexOf('?');
        var hashIndex = stringValue.indexOf('#');
        var cutIndex = -1;

        if (queryIndex >= 0 && hashIndex >= 0) {
            cutIndex = Math.min(queryIndex, hashIndex);
        } else if (queryIndex >= 0) {
            cutIndex = queryIndex;
        } else if (hashIndex >= 0) {
            cutIndex = hashIndex;
        }

        return cutIndex >= 0
            ? {
                path: stringValue.slice(0, cutIndex),
                suffix: stringValue.slice(cutIndex)
            }
            : {
                path: stringValue,
                suffix: ''
            };
    }

    function buildLocalePageHref(localeCode, pagePath) {
        var locale = LOCALE_BY_CODE[normalizeLocaleCode(localeCode)] || LOCALE_BY_CODE.en;
        var cleanPagePath = stripLocaleSuffix(String(pagePath || 'index.html').replace(/^\/+/, ''));

        if (locale.code === 'en' && (cleanPagePath === 'index.html' || cleanPagePath === '')) {
            return '/';
        }

        if (locale.code === 'en') {
            return '/' + cleanPagePath;
        }

        return '/' + locale.code + '/' + cleanPagePath;
    }

    function resolveGameImageUrl(value) {
        var pathValue = String(value || '').trim();

        if (!pathValue) {
            return '/img/icon/veckIo.jpg';
        }

        if (/^(?:https?:)?\/\//i.test(pathValue) || pathValue.indexOf('data:') === 0) {
            return pathValue;
        }

        if (pathValue.charAt(0) === '/') {
            return pathValue;
        }

        return '/' + pathValue.replace(/^(\.\/|\.\.\/)+/, '').replace(/^\/+/, '');
    }

    function resolvePageLink(value) {
        var raw = String(value || '').trim();

        if (!raw || raw.charAt(0) === '#' || /^(?:https?:)?\/\//i.test(raw) || /^(?:mailto|tel|javascript):/i.test(raw)) {
            return raw;
        }

        if (raw.charAt(0) === '/') {
            return raw;
        }

        var parts = splitPathAndSuffix(raw);
        var cleanPath = parts.path.replace(/^(\.\/|\.\.\/)+/, '').replace(/^\/+/, '');

        if (!cleanPath || cleanPath === '.') {
            return buildLocalePageHref(getCurrentLocaleCode(), 'index.html') + parts.suffix;
        }

        if (/\.html$/i.test(cleanPath)) {
            return buildLocalePageHref(getCurrentLocaleCode(), cleanPath) + parts.suffix;
        }

        return raw;
    }

    function refreshLanguageSwitchLinks() {
        var currentPagePath = getCurrentPagePath();
        var suffix = String(window.location.search || '') + String(window.location.hash || '');
        var currentLocaleCode = getCurrentLocaleCode();

        document.querySelectorAll('.site-language-switch [data-locale]').forEach(function (link) {
            var localeCode = normalizeLocaleCode(link.getAttribute('data-locale'));
            link.setAttribute('href', buildLocalePageHref(localeCode, currentPagePath) + suffix);

            if (localeCode === currentLocaleCode) {
                link.setAttribute('aria-current', 'page');
            } else {
                link.removeAttribute('aria-current');
            }
        });
    }

    function getMessages() {
        return MESSAGES[getCurrentLocaleCode()] || MESSAGES.en;
    }

    function translate(section, key, values) {
        var messages = getMessages();
        var template = messages && messages[section] ? messages[section][key] : '';
        var fallbackTemplate = MESSAGES.en && MESSAGES.en[section] ? MESSAGES.en[section][key] : '';
        return formatTemplate(template || fallbackTemplate || '', values || {});
    }

    var currentLocaleCode = getCurrentLocaleCode();
    var currentLocale = LOCALE_BY_CODE[currentLocaleCode] || LOCALE_BY_CODE.en;

    var api = {
        locales: LOCALES.slice(),
        locale: currentLocale,
        code: currentLocaleCode,
        messages: getMessages(),
        getCurrentPagePath: getCurrentPagePath,
        buildLocalePageHref: buildLocalePageHref,
        resolveGameImageUrl: resolveGameImageUrl,
        resolvePageLink: resolvePageLink,
        refreshLanguageSwitchLinks: refreshLanguageSwitchLinks,
        t: translate
    };

    window.SkillWarzLocale = api;

    document.documentElement.lang = currentLocale.lang;
    if (currentLocale.dir && LOCALE_BY_DIR[currentLocale.dir] && currentLocale.code === 'ur') {
        document.documentElement.setAttribute('dir', 'rtl');
    } else {
        document.documentElement.removeAttribute('dir');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', refreshLanguageSwitchLinks);
    } else {
        refreshLanguageSwitchLinks();
    }
}());
