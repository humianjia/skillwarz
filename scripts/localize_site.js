const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const ROOT_DIR = path.resolve(__dirname, '..');
const TMP_DIR = path.join(ROOT_DIR, '.tmp');
const CACHE_FILE = path.join(TMP_DIR, 'site_translation_cache.json');
const LOCALES = [
    { code: 'hi', lang: 'hi', rtl: false, keepNativeScript: 'Devanagari' },
    { code: 'ur', lang: 'ur', rtl: true, keepNativeScript: 'Arabic' },
    { code: 'tr', lang: 'tr', rtl: false },
    { code: 'pt-br', lang: 'pt-BR', rtl: false },
    { code: 'it', lang: 'it', rtl: false }
];

const SKIP_TAGS = new Set(['script', 'style', 'noscript', 'svg', 'code', 'pre']);
const TRANSLATABLE_META = new Set([
    'description',
    'keywords',
    'og:title',
    'og:description',
    'twitter:title',
    'twitter:description'
]);
const TRANSLATABLE_ATTRS = new Set(['title', 'alt', 'placeholder', 'aria-label', 'aria-description', 'value']);
const SEP = '[[[SWZSEP]]]';
const REQUEST_DELAY_MS = 1200;
const RETRY_BASE_MS = 5000;
const CHUNK_MAX_ITEMS = 8;
const CHUNK_MAX_CHARS = 900;
const cache = loadCache();
let lastRequestAt = 0;
const IS_CI = ['1', 'true'].includes(String(process.env.CI || '').toLowerCase()) || process.env.VERCEL === '1';
const ALLOW_REMOTE_TRANSLATION = process.env.ALLOW_REMOTE_TRANSLATION === '1' || (!IS_CI && process.env.ALLOW_REMOTE_TRANSLATION !== '0');

if (!process.env.NODE_OPTIONS || !process.env.NODE_OPTIONS.includes('--dns-result-order=ipv4first')) {
    const current = process.env.NODE_OPTIONS ? `${process.env.NODE_OPTIONS} ` : '';
    process.env.NODE_OPTIONS = `${current}--dns-result-order=ipv4first`.trim();
}

const FALLBACK_TRANSLATIONS = {
    hi: {
        'Home': 'होम',
        'Guides': 'गाइड्स',
        'Categories': 'श्रेणियाँ',
        'Support contact': 'सहायता संपर्क',
        'Browser catalog': 'ब्राउज़र कैटलॉग',
        'Search games...': 'गेम खोजें...',
        'Loading Game': 'गेम लोड हो रहा है',
        'More Games': 'और गेम',
        'Browser Game': 'ब्राउज़र गेम',
        'GameDistribution': 'GameDistribution',
        'Browse categories': 'श्रेणियाँ ब्राउज़ करें',
        'Return to homepage': 'होमपेज पर लौटें',
        'About SkillWarz': 'SkillWarz के बारे में',
        'Contact SkillWarz': 'SkillWarz से संपर्क करें',
        'Privacy Policy': 'गोपनीयता नीति',
        'Terms of Service': 'सेवा की शर्तें',
        'DMCA Notice and Takedown Policy': 'DMCA सूचना और हटाने की नीति',
        'Play Game | skillwarz': 'गेम खेलें | skillwarz',
        'Play free browser games on skillwarz. Explore extra GameDistribution shooter, battle royale, sniper, multiplayer, and action games.': 'skillwarz पर मुफ्त ब्राउज़र गेम खेलें। अतिरिक्त GameDistribution शूटर, बैटल रॉयल, स्नाइपर, मल्टीप्लेयर और एक्शन गेम देखें।',
        'Play free browser games on skillwarz with more shooter and action recommendations.': 'skillwarz पर अधिक शूटर और एक्शन सुझावों के साथ मुफ्त ब्राउज़र गेम खेलें।',
        'Play a hand-picked browser game from our expanded GameDistribution collection.': 'हमारे विस्तृत GameDistribution संग्रह से चुना हुआ ब्राउज़र गेम खेलें।',
        'WHAT IS THIS GAME?': 'यह गेम क्या है?',
        'Loading game details...': 'गेम विवरण लोड हो रहा है...',
        '{category} Recommendations': '{category} सुझाव',
        'How to play: {instruction}': 'कैसे खेलें: {instruction}',
        'Updated': 'अपडेट किया गया',
        'Email': 'ईमेल',
        'What To Include': 'क्या शामिल करें',
        'Typical Topics': 'सामान्य विषय',
        'SkillWarz Beginner Guide': 'SkillWarz शुरुआती गाइड',
        'SkillWarz Controls And Movement Tips': 'SkillWarz नियंत्रण और मूवमेंट टिप्स',
        'Battle Royale Beginner Mistakes In Browser Games': 'ब्राउज़र गेम्स में बैटल रॉयल शुरुआती गलतियाँ',
        'Best Browser Shooter Modes For Different Players': 'अलग-अलग खिलाड़ियों के लिए सर्वश्रेष्ठ ब्राउज़र शूटर मोड',
        'Best Browser Sniper Games: What Makes Them Fun?': 'सर्वश्रेष्ठ ब्राउज़र स्नाइपर गेम: इन्हें मज़ेदार क्या बनाता है?',
        'Browser FPS Vs Battle Royale: Which Format Fits You?': 'ब्राउज़र FPS बनाम बैटल रॉयल: कौन सा फॉर्मेट आपके लिए सही है?',
        'How To Improve Aim In Browser FPS Games': 'ब्राउज़र FPS गेम्स में निशाना कैसे बेहतर करें',
        'How To Choose The Right Browser Shooter For You': 'अपने लिए सही ब्राउज़र शूटर कैसे चुनें'
    },
    ur: {
        'Home': 'ہوم',
        'Guides': 'گائیڈز',
        'Categories': 'زمرے',
        'Support contact': 'سپورٹ رابطہ',
        'Browser catalog': 'براؤزر کیٹلاگ',
        'Search games...': 'گیمز تلاش کریں...',
        'Loading Game': 'گیم لوڈ ہو رہی ہے',
        'More Games': 'مزید گیمز',
        'Browser Game': 'براؤزر گیم',
        'GameDistribution': 'GameDistribution',
        'Browse categories': 'زمرے براؤز کریں',
        'Return to homepage': 'ہوم پیج پر واپس جائیں',
        'About SkillWarz': 'SkillWarz کے بارے میں',
        'Contact SkillWarz': 'SkillWarz سے رابطہ کریں',
        'Privacy Policy': 'رازداری کی پالیسی',
        'Terms of Service': 'سروس کی شرائط',
        'DMCA Notice and Takedown Policy': 'DMCA نوٹس اور ہٹانے کی پالیسی',
        'Play Game | skillwarz': 'گیم کھیلیں | skillwarz',
        'Play free browser games on skillwarz. Explore extra GameDistribution shooter, battle royale, sniper, multiplayer, and action games.': 'skillwarz پر مفت براؤزر گیمز کھیلیں۔ اضافی GameDistribution شوٹر، بیٹل رائل، سنائپر، ملٹی پلیئر اور ایکشن گیمز دریافت کریں۔',
        'Play free browser games on skillwarz with more shooter and action recommendations.': 'skillwarz پر مزید شوٹر اور ایکشن تجاویز کے ساتھ مفت براؤزر گیمز کھیلیں۔',
        'Play a hand-picked browser game from our expanded GameDistribution collection.': 'ہماری توسیع شدہ GameDistribution کلیکشن سے منتخب براؤزر گیم کھیلیں۔',
        'WHAT IS THIS GAME?': 'یہ گیم کیا ہے؟',
        'Loading game details...': 'گیم کی تفصیلات لوڈ ہو رہی ہیں...',
        '{category} Recommendations': '{category} تجاویز',
        'How to play: {instruction}': 'کیسے کھیلیں: {instruction}',
        'Updated': 'اپ ڈیٹ کیا گیا',
        'Email': 'ای میل',
        'What To Include': 'کیا شامل کریں',
        'Typical Topics': 'عام موضوعات',
        'SkillWarz Beginner Guide': 'SkillWarz ابتدائی گائیڈ',
        'SkillWarz Controls And Movement Tips': 'SkillWarz کنٹرول اور موومنٹ ٹپس',
        'Battle Royale Beginner Mistakes In Browser Games': 'براؤزر گیمز میں بیٹل رائل ابتدائی غلطیاں',
        'Best Browser Shooter Modes For Different Players': 'مختلف کھلاڑیوں کے لیے بہترین براؤزر شوٹر موڈز',
        'Best Browser Sniper Games: What Makes Them Fun?': 'بہترین براؤزر سنائپر گیمز: انہیں مزے دار کیا بناتا ہے؟',
        'Browser FPS Vs Battle Royale: Which Format Fits You?': 'براؤزر FPS بمقابلہ بیٹل رائل: کون سا فارمیٹ آپ کے لیے بہتر ہے؟',
        'How To Improve Aim In Browser FPS Games': 'براؤزر FPS گیمز میں نشانہ کیسے بہتر کریں',
        'How To Choose The Right Browser Shooter For You': 'اپنے لیے درست براؤزر شوٹر کیسے چنیں'
    },
    tr: {
        'Home': 'Ana Sayfa',
        'Guides': 'Rehberler',
        'Categories': 'Kategoriler',
        'Support contact': 'Destek iletişimi',
        'Browser catalog': 'Tarayıcı kataloğu',
        'Search games...': 'Oyun ara...',
        'Loading Game': 'Oyun yükleniyor',
        'More Games': 'Daha Fazla Oyun',
        'Browser Game': 'Tarayıcı Oyunu',
        'GameDistribution': 'GameDistribution',
        'Browse categories': 'Kategorilere göz at',
        'Return to homepage': 'Ana sayfaya dön',
        'About SkillWarz': 'SkillWarz hakkında',
        'Contact SkillWarz': 'SkillWarz ile iletişime geç',
        'Privacy Policy': 'Gizlilik Politikası',
        'Terms of Service': 'Hizmet Şartları',
        'DMCA Notice and Takedown Policy': 'DMCA bildirimi ve kaldırma politikası',
        'Play Game | skillwarz': 'Oyunu Oyna | skillwarz',
        'Play free browser games on skillwarz. Explore extra GameDistribution shooter, battle royale, sniper, multiplayer, and action games.': 'skillwarz üzerinde ücretsiz tarayıcı oyunları oynayın. Ek GameDistribution nişancı, battle royale, sniper, çok oyunculu ve aksiyon oyunlarını keşfedin.',
        'Play free browser games on skillwarz with more shooter and action recommendations.': 'skillwarz üzerinde daha fazla nişancı ve aksiyon önerisiyle ücretsiz tarayıcı oyunları oynayın.',
        'Play a hand-picked browser game from our expanded GameDistribution collection.': 'Genişletilmiş GameDistribution koleksiyonumuzdan seçilmiş bir tarayıcı oyunu oynayın.',
        'WHAT IS THIS GAME?': 'BU OYUN NEDİR?',
        'Loading game details...': 'Oyun ayrıntıları yükleniyor...',
        '{category} Recommendations': '{category} önerileri',
        'How to play: {instruction}': 'Nasıl oynanır: {instruction}',
        'Updated': 'Güncellendi',
        'Email': 'E-posta',
        'What To Include': 'Neler eklenmeli',
        'Typical Topics': 'Yaygın konular',
        'SkillWarz Beginner Guide': 'SkillWarz başlangıç rehberi',
        'SkillWarz Controls And Movement Tips': 'SkillWarz kontrol ve hareket ipuçları',
        'Battle Royale Beginner Mistakes In Browser Games': 'Tarayıcı oyunlarında battle royale başlangıç hataları',
        'Best Browser Shooter Modes For Different Players': 'Farklı oyuncular için en iyi tarayıcı nişancı modları',
        'Best Browser Sniper Games: What Makes Them Fun?': 'En iyi tarayıcı sniper oyunları: Onları eğlenceli yapan ne?',
        'Browser FPS Vs Battle Royale: Which Format Fits You?': 'Tarayıcı FPS mi battle royale mi: Hangi format sana uygun?',
        'How To Improve Aim In Browser FPS Games': 'Tarayıcı FPS oyunlarında nişan nasıl geliştirilir',
        'How To Choose The Right Browser Shooter For You': 'Sana uygun tarayıcı nişancı nasıl seçilir'
    },
    'pt-br': {
        'Home': 'Início',
        'Guides': 'Guias',
        'Categories': 'Categorias',
        'Support contact': 'Contato de suporte',
        'Browser catalog': 'Catálogo do navegador',
        'Search games...': 'Pesquisar jogos...',
        'Loading Game': 'Carregando jogo',
        'More Games': 'Mais jogos',
        'Browser Game': 'Jogo de navegador',
        'GameDistribution': 'GameDistribution',
        'Browse categories': 'Navegar por categorias',
        'Return to homepage': 'Voltar para a página inicial',
        'About SkillWarz': 'Sobre a SkillWarz',
        'Contact SkillWarz': 'Fale com a SkillWarz',
        'Privacy Policy': 'Política de privacidade',
        'Terms of Service': 'Termos de serviço',
        'DMCA Notice and Takedown Policy': 'Aviso DMCA e política de remoção',
        'Play Game | skillwarz': 'Jogar | skillwarz',
        'Play free browser games on skillwarz. Explore extra GameDistribution shooter, battle royale, sniper, multiplayer, and action games.': 'Jogue jogos de navegador grátis na skillwarz. Explore jogos extras de tiro, battle royale, sniper, multiplayer e ação da GameDistribution.',
        'Play free browser games on skillwarz with more shooter and action recommendations.': 'Jogue jogos de navegador grátis na skillwarz com mais recomendações de tiro e ação.',
        'Play a hand-picked browser game from our expanded GameDistribution collection.': 'Jogue um jogo de navegador escolhido a dedo da nossa coleção ampliada da GameDistribution.',
        'WHAT IS THIS GAME?': 'O QUE É ESTE JOGO?',
        'Loading game details...': 'Carregando detalhes do jogo...',
        '{category} Recommendations': 'Recomendações de {category}',
        'How to play: {instruction}': 'Como jogar: {instruction}',
        'Updated': 'Atualizado',
        'Email': 'E-mail',
        'What To Include': 'O que incluir',
        'Typical Topics': 'Tópicos comuns',
        'SkillWarz Beginner Guide': 'Guia para iniciantes da SkillWarz',
        'SkillWarz Controls And Movement Tips': 'Controles e dicas de movimento da SkillWarz',
        'Battle Royale Beginner Mistakes In Browser Games': 'Erros comuns de iniciante em battle royale nos jogos de navegador',
        'Best Browser Shooter Modes For Different Players': 'Melhores modos de tiro para diferentes jogadores',
        'Best Browser Sniper Games: What Makes Them Fun?': 'Melhores jogos de sniper para navegador: o que os torna divertidos?',
        'Browser FPS Vs Battle Royale: Which Format Fits You?': 'FPS de navegador ou battle royale: qual formato combina com você?',
        'How To Improve Aim In Browser FPS Games': 'Como melhorar a mira em jogos FPS de navegador',
        'How To Choose The Right Browser Shooter For You': 'Como escolher o tiro de navegador certo para você'
    },
    it: {
        'Home': 'Home',
        'Guides': 'Guide',
        'Categories': 'Categorie',
        'Support contact': 'Contatto di supporto',
        'Browser catalog': 'Catalogo del browser',
        'Search games...': 'Cerca giochi...',
        'Loading Game': 'Caricamento gioco',
        'More Games': 'Altri giochi',
        'Browser Game': 'Gioco per browser',
        'GameDistribution': 'GameDistribution',
        'Browse categories': 'Sfoglia le categorie',
        'Return to homepage': 'Torna alla homepage',
        'About SkillWarz': 'Informazioni su SkillWarz',
        'Contact SkillWarz': 'Contatta SkillWarz',
        'Privacy Policy': 'Informativa sulla privacy',
        'Terms of Service': 'Termini di servizio',
        'DMCA Notice and Takedown Policy': 'Avviso DMCA e politica di rimozione',
        'Play Game | skillwarz': 'Gioca | skillwarz',
        'Play free browser games on skillwarz. Explore extra GameDistribution shooter, battle royale, sniper, multiplayer, and action games.': 'Gioca gratis ai giochi per browser su skillwarz. Scopri altri giochi GameDistribution di tiro, battle royale, sniper, multiplayer e azione.',
        'Play free browser games on skillwarz with more shooter and action recommendations.': 'Gioca gratis ai giochi per browser su skillwarz con più consigli di tiro e azione.',
        'Play a hand-picked browser game from our expanded GameDistribution collection.': 'Gioca a un gioco per browser selezionato dalla nostra collezione ampliata di GameDistribution.',
        'WHAT IS THIS GAME?': 'CHE COSA È QUESTO GIOCO?',
        'Loading game details...': 'Caricamento dettagli del gioco...',
        '{category} Recommendations': 'Consigli su {category}',
        'How to play: {instruction}': 'Come si gioca: {instruction}',
        'Updated': 'Aggiornato',
        'Email': 'Email',
        'What To Include': 'Cosa includere',
        'Typical Topics': 'Argomenti tipici',
        'SkillWarz Beginner Guide': 'Guida per principianti di SkillWarz',
        'SkillWarz Controls And Movement Tips': 'Controlli e consigli di movimento di SkillWarz',
        'Battle Royale Beginner Mistakes In Browser Games': 'Errori da principiante nel battle royale nei giochi per browser',
        'Best Browser Shooter Modes For Different Players': 'I migliori modi di gioco shooter per diversi giocatori',
        'Best Browser Sniper Games: What Makes Them Fun?': 'I migliori giochi sniper per browser: cosa li rende divertenti?',
        'Browser FPS Vs Battle Royale: Which Format Fits You?': 'FPS per browser o battle royale: quale formato fa per te?',
        'How To Improve Aim In Browser FPS Games': 'Come migliorare la mira nei giochi FPS per browser',
        'How To Choose The Right Browser Shooter For You': 'Come scegliere lo shooter per browser giusto per te'
    }
};

function getFallbackTranslation(source, locale) {
    const localeMap = FALLBACK_TRANSLATIONS[locale.code];
    if (!localeMap) {
        return null;
    }

    return Object.prototype.hasOwnProperty.call(localeMap, source) ? localeMap[source] : null;
}

function ensureDir(dirPath) {
    fs.mkdirSync(dirPath, { recursive: true });
}

function loadCache() {
    try {
        return JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
    } catch {
        return {};
    }
}

function saveCache() {
    ensureDir(TMP_DIR);
    fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2), 'utf8');
}

function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function normalizeText(value) {
    return String(value || '').replace(/\s+/g, ' ').trim();
}

function isUrlLike(value) {
    return /^(?:https?:)?\/\//i.test(value) ||
        /^(?:mailto|tel|javascript):/i.test(value) ||
        value.startsWith('/') ||
        value.includes('://') ||
        value.includes('@');
}

function isShortInvariant(value) {
    return /^[A-Z0-9 ._-]{2,10}$/.test(value) || /^(?:SkillWarz|GameDistribution|DMCA|SEO|HTML|CSS|JS|API|FAQ|FPS|IO)$/i.test(value);
}

function hasEnoughLetters(value) {
    return /[A-Za-z\u00C0-\u024F\u0400-\u04FF\u0600-\u06FF\u0900-\u097F]/.test(value);
}

function scriptCounts(value) {
    return {
        latin: (value.match(/[A-Za-z\u00C0-\u024F]/g) || []).length,
        arabic: (value.match(/[\u0600-\u06FF]/g) || []).length,
        devanagari: (value.match(/[\u0900-\u097F]/g) || []).length
    };
}

function shouldTranslateText(value, locale) {
    const text = normalizeText(value);

    if (!text || !hasEnoughLetters(text) || isUrlLike(text) || /^[\d\s.,:;()\-+/%|]+$/.test(text)) {
        return false;
    }

    if (isShortInvariant(text)) {
        return false;
    }

    const counts = scriptCounts(text);
    if (locale.keepNativeScript === 'Devanagari' && counts.devanagari > counts.latin && counts.devanagari > 0) {
        return false;
    }

    if (locale.keepNativeScript === 'Arabic' && counts.arabic > counts.latin && counts.arabic > 0) {
        return false;
    }

    return true;
}

function splitTrailingWhitespace(value) {
    const match = String(value || '').match(/^(\s*)([\s\S]*?)(\s*)$/);
    return {
        leading: match ? match[1] : '',
        core: match ? match[2] : String(value || ''),
        trailing: match ? match[3] : ''
    };
}

function looksUntranslated(source, translated) {
    const normalizedSource = normalizeText(source);
    const normalizedTranslated = normalizeText(translated);

    if (!normalizedSource || !normalizedTranslated) {
        return true;
    }

    if (normalizedSource !== normalizedTranslated) {
        return false;
    }

    const wordCount = normalizedSource.split(/\s+/).length;
    return normalizedSource.length >= 18 || wordCount >= 3;
}

function getLocaleWords(locale) {
    return FALLBACK_TRANSLATIONS[locale.code] || {};
}

function applyTextFallback(source, locale) {
    const words = getLocaleWords(locale);

    if (Object.prototype.hasOwnProperty.call(words, source)) {
        return words[source];
    }

    return null;
}

function rebasePlayTemplateAssets($) {
    const assetPrefixes = ['css/', 'js/', 'img/'];

    $('link[href], script[src], img[src]').each((_, element) => {
        const $element = $(element);
        const attrName = element.name === 'script' ? 'src' : 'href' in (element.attribs || {}) ? 'href' : 'src';
        const value = String($element.attr(attrName) || '');

        if (!value || /^(?:https?:)?\/\//i.test(value) || value.startsWith('data:') || value.startsWith('/')) {
            return;
        }

        if (assetPrefixes.some((prefix) => value.startsWith(prefix)) || value === 'favicon.svg') {
            $element.attr(attrName, `../${value}`);
        }
    });

    $('[onerror]').each((_, element) => {
        const $element = $(element);
        const value = String($element.attr('onerror') || '');
        if (value.includes('img/')) {
            $element.attr('onerror', value.replace(/img\//g, '../img/'));
        }
    });
}

function localizePlayHead($, locale) {
    const canonical = `https://www.skillwarz.online/${locale.code}/play.html`;
    $('link[rel="canonical"]').attr('href', canonical);
    $('meta[property="og:url"]').attr('content', canonical);
}

function collectFiles(dirPath) {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    const files = [];

    for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);
        if (entry.isDirectory()) {
            files.push(...collectFiles(fullPath));
            continue;
        }

        if (entry.isFile() && entry.name.endsWith('.html') && entry.name !== 'play.html') {
            files.push(fullPath);
        }
    }

    return files;
}

async function translateRaw(text, locale) {
    const fallback = applyTextFallback(text, locale);
    if (fallback) {
        return fallback;
    }

    if (!ALLOW_REMOTE_TRANSLATION) {
        return text;
    }

    const payload = new URLSearchParams({
        q: text,
        langpair: `en|${locale.lang}`
    });

    for (let attempt = 0; attempt < 3; attempt += 1) {
        const now = Date.now();
        const waitMs = Math.max(0, lastRequestAt + REQUEST_DELAY_MS - now);
        if (waitMs > 0) {
            await delay(waitMs);
        }

        try {
            const response = await fetch('https://api.mymemory.translated.net/get', {
                method: 'POST',
                headers: {
                    'content-type': 'application/x-www-form-urlencoded'
                },
                body: payload.toString()
            });
            lastRequestAt = Date.now();

            if (!response.ok) {
                if (response.status === 429) {
                    await delay(RETRY_BASE_MS * (attempt + 1));
                }
                throw new Error(`HTTP ${response.status}`);
            }

            const json = await response.json();
            const translated = json?.responseData?.translatedText;

            if (typeof translated === 'string' && translated.length > 0) {
                return translated;
            }
        } catch (error) {
            const retryFallback = applyTextFallback(text, locale);
            if (retryFallback) {
                return retryFallback;
            }

            if (attempt === 2) {
                console.warn(`[${locale.code}] translation failed, keeping source text: ${error.message}`);
                return text;
            }
            await delay(RETRY_BASE_MS * (attempt + 1));
        }
    }

    return text;
}

function buildTranslationChunks(texts) {
    const chunks = [];
    let currentChunk = [];
    let currentChars = 0;

    for (const text of texts) {
        const nextChars = currentChars + text.length + SEP.length;
        if (currentChunk.length && (currentChunk.length >= CHUNK_MAX_ITEMS || nextChars > CHUNK_MAX_CHARS)) {
            chunks.push(currentChunk);
            currentChunk = [];
            currentChars = 0;
        }

        currentChunk.push(text);
        currentChars += text.length + SEP.length;
    }

    if (currentChunk.length) {
        chunks.push(currentChunk);
    }

    return chunks;
}

async function translateBatch(texts, locale) {
    if (!texts.length) {
        return [];
    }

    const results = [];
    const chunks = buildTranslationChunks(texts);

    for (const chunk of chunks) {
        const joined = chunk.join(SEP);
        const translatedJoined = await translateRaw(joined, locale);
        const parts = translatedJoined.split(SEP);

        if (parts.length === chunk.length) {
            parts.forEach((part, index) => {
                const translated = normalizeText(part);
                const source = chunk[index];
                results.push({
                    source,
                    translated,
                    success: !looksUntranslated(source, translated)
                });
            });
            continue;
        }

        for (const source of chunk) {
            const translated = normalizeText(await translateRaw(source, locale));
            results.push({
                source,
                translated,
                success: !looksUntranslated(source, translated)
            });
        }
    }

    return results;
}

async function localizeStrings(strings, locale) {
    const results = new Array(strings.length);
    const pending = [];
    const pendingIndexes = [];

    strings.forEach((text, index) => {
        const source = normalizeText(text);
        if (!source) {
            results[index] = text;
            return;
        }

        if (!cache[locale.code]) {
            cache[locale.code] = {};
        }

        const cached = cache[locale.code][source];
        if (typeof cached === 'string') {
            results[index] = cached;
            return;
        }

        pending.push(source);
        pendingIndexes.push(index);
    });

    if (pending.length) {
        const translated = await translateBatch(pending, locale);
        translated.forEach((entry, i) => {
            const index = pendingIndexes[i];
            results[index] = entry.translated;
            if (entry.success) {
                cache[locale.code][entry.source] = entry.translated;
            }
        });
        saveCache();
    }

    return results;
}

function updateHtmlLocale($, locale) {
    $('html').attr('lang', locale.lang);
    if (locale.rtl) {
        $('html').attr('dir', 'rtl');
    } else {
        $('html').removeAttr('dir');
    }
}

function collectTranslatableItems($) {
    const items = [];

    function walk(node) {
        if (!node) {
            return;
        }

        if (node.type === 'text') {
            const raw = String(node.data || '');
            const text = normalizeText(raw);
            if (shouldTranslateText(text, currentLocale)) {
                items.push({ type: 'text', node, raw });
            }
            return;
        }

        if (node.type !== 'tag' && node.type !== 'root') {
            return;
        }

        if (node.type === 'tag') {
            if (SKIP_TAGS.has(node.name)) {
                return;
            }

            const attribs = node.attribs || {};
            for (const [name, value] of Object.entries(attribs)) {
                const normalizedValue = normalizeText(value);
                const lowerName = String(name || '').toLowerCase();
                const attrKey = lowerName.includes(':') ? lowerName.split(':').pop() : lowerName;

                if (lowerName === 'content') {
                    const metaName = String(attribs.name || attribs.property || '').toLowerCase();
                    if (TRANSLATABLE_META.has(metaName) && shouldTranslateText(normalizedValue, currentLocale)) {
                        items.push({ type: 'attr', node, attr: name, raw: value });
                    }
                    continue;
                }

                if (TRANSLATABLE_ATTRS.has(attrKey) && shouldTranslateText(normalizedValue, currentLocale)) {
                    items.push({ type: 'attr', node, attr: name, raw: value });
                }
            }
        }

        for (const child of node.children || []) {
            walk(child);
        }
    }

    walk($.root()[0]);
    return items;
}

async function localizeHtml(html, locale, options = {}) {
    const $ = cheerio.load(html, { decodeEntities: false });
    updateHtmlLocale($, locale);

    if (options.playTemplate) {
        localizePlayHead($, locale);
        rebasePlayTemplateAssets($);
    }

    const items = collectTranslatableItems($);
    const sourceStrings = items.map((item) => normalizeText(item.raw));
    const translatedStrings = await localizeStrings(sourceStrings, locale);

    items.forEach((item, index) => {
        const translated = translatedStrings[index] || normalizeText(item.raw);
        if (item.type === 'text') {
            const { leading, trailing } = splitTrailingWhitespace(item.raw);
            item.node.data = `${leading}${translated}${trailing}`;
        } else if (item.type === 'attr') {
            item.node.attribs[item.attr] = translated;
        }
    });

    return $.html();
}

async function buildLocalizedPlayPage(locale) {
    const sourceFile = path.join(ROOT_DIR, 'play.html');
    if (!fs.existsSync(sourceFile)) {
        return;
    }

    const html = fs.readFileSync(sourceFile, 'utf8');
    const localized = await localizeHtml(html, locale, { playTemplate: true });
    const targetFile = path.join(ROOT_DIR, locale.code, 'play.html');
    ensureDir(path.dirname(targetFile));
    fs.writeFileSync(targetFile, localized, 'utf8');
    console.log(`[${locale.code}] ${path.relative(ROOT_DIR, targetFile)}`);
}

let currentLocale = null;

async function processLocale(locale) {
    currentLocale = locale;
    await buildLocalizedPlayPage(locale);
    const localeDir = path.join(ROOT_DIR, locale.code);

    if (!fs.existsSync(localeDir)) {
        console.warn(`[${locale.code}] skipped, directory not found`);
        return;
    }

    const files = collectFiles(localeDir);
    console.log(`[${locale.code}] localizing ${files.length} pages`);

    for (const filePath of files) {
        const html = fs.readFileSync(filePath, 'utf8');
        const localized = await localizeHtml(html, locale);
        fs.writeFileSync(filePath, localized, 'utf8');
        console.log(`[${locale.code}] ${path.relative(ROOT_DIR, filePath)}`);
    }
}

async function main() {
    for (const locale of LOCALES) {
        await processLocale(locale);
    }

    saveCache();
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
