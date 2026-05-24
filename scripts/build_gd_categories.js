const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT_DIR = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT_DIR, 'data');
const OUTPUT_JSON_FILE = path.join(DATA_DIR, 'gd_categories.json');
const OUTPUT_JS_FILE = path.join(ROOT_DIR, 'js', 'game_data', 'gd_categories.js');
const REPORT_FILE = path.join(ROOT_DIR, '.tmp', 'gd_categories_report.json');

const GRAPHQL_ENDPOINT = 'https://gd-website-api.gamedistribution.com/graphql';
const REFERRER_SUFFIX = '?gd_sdk_referrer_url=https://www.onlinegames.io/cat-runner/';
const MAX_GAMES_PER_CATEGORY = 50;
const MAX_RECOMMENDED_GAMES = 8;
const PAGE_SIZE = 50;
const MAX_PAGES_PER_CATEGORY = 6;
const CATEGORY_WORKERS = 4;
const CATEGORY_SLUG_OVERRIDES = {
    '.IO': 'io',
    'Racing & Driving': 'racing',
    'Mahjong & Connect': 'mahjong-connect',
};

function label(en, hi, ur, tr, ptBr, it) {
    return {
        en,
        hi,
        ur,
        tr,
        'pt-br': ptBr,
        it,
    };
}

const CATEGORY_LABEL_TRANSLATIONS = {
    '.IO': label('.IO Games', '.IO गेम्स', '.IO گیمز', '.IO Oyunları', 'Jogos .IO', 'Giochi .IO'),
    Adventure: label('Adventure', 'साहसिक', 'ایڈونچر', 'Macera', 'Aventura', 'Avventura'),
    Agility: label('Agility', 'चपलता', 'چستی', 'Çeviklik', 'Agilidade', 'Agilità'),
    Art: label('Art', 'कला', 'آرٹ', 'Sanat', 'Arte', 'Arte'),
    Basketball: label('Basketball', 'बास्केटबॉल', 'باسکٹ بال', 'Basketbol', 'Basquete', 'Basket'),
    Battle: label('Battle', 'युद्ध', 'جنگ', 'Savaş', 'Batalha', 'Battaglia'),
    Boardgames: label('Boardgames', 'बोर्ड गेम्स', 'بورڈ گیمز', 'Tahta Oyunları', 'Jogos de tabuleiro', 'Giochi da tavolo'),
    'Bubble Shooter': label('Bubble Shooter', 'बबल शूटर', 'ببل شوٹر', 'Balon Patlatma', 'Bubble Shooter', 'Sparabolle'),
    Cards: label('Cards', 'कार्ड्स', 'کارڈز', 'Kart Oyunları', 'Jogos de cartas', 'Carte'),
    Care: label('Care', 'देखभाल', 'دیکھ بھال', 'Bakım', 'Cuidado', 'Cura'),
    Casual: label('Casual', 'कैज़ुअल', 'آرام دہ', 'Rahat', 'Casual', 'Casual'),
    Cooking: label('Cooking', 'कुकिंग', 'کھانا پکانا', 'Yemek Pişirme', 'Cozinha', 'Cucina'),
    'Dress-up': label('Dress-up', 'ड्रेस-अप', 'ڈریس اپ', 'Giydirme', 'Vestir', 'Vestire'),
    Educational: label('Educational', 'शैक्षिक', 'تعلیمی', 'Eğitici', 'Educativo', 'Educativo'),
    Football: label('Football', 'फ़ुटबॉल', 'فٹبال', 'Futbol', 'Futebol', 'Calcio'),
    Jigsaw: label('Jigsaw', 'जिगसॉ', 'جیگسا', 'Yapboz', 'Quebra-cabeça', 'Rompicapo'),
    'Mahjong & Connect': label('Mahjong & Connect', 'माहजोंग और कनेक्ट', 'مہجونگ اور کنیکٹ', 'Mahjong ve Bağla', 'Mahjong e Conectar', 'Mahjong e Connetti'),
    'Match-3': label('Match-3', 'मैच-3', 'میچ-3', 'Eşleştirme-3', 'Combinar-3', 'Match-3'),
    Merge: label('Merge', 'मर्ज', 'ضم', 'Birleştir', 'Unir', 'Unire'),
    Puzzle: label('Puzzle', 'पहेली', 'پہیلی', 'Bulmaca', 'Quebra-cabeça', 'Rompicapo'),
    Quiz: label('Quiz', 'क्विज़', 'کوئز', 'Bilgi Yarışması', 'Quiz', 'Quiz'),
    'Racing & Driving': label('Racing', 'रेसिंग', 'ریسنگ', 'Yarış', 'Corrida', 'Corse'),
    Shooter: label('Shooter', 'शूटर', 'شوٹر', 'Nişancı', 'Tiro', 'Sparatutto'),
    Simulation: label('Simulation', 'सिमुलेशन', 'سمولیشن', 'Simülasyon', 'Simulação', 'Simulazione'),
    Sports: label('Sports', 'खेल', 'کھیل', 'Spor', 'Esportes', 'Sport'),
    Strategy: label('Strategy', 'रणनीति', 'حکمت عملی', 'Strateji', 'Estratégia', 'Strategia'),
};

const FACETS_QUERY = `
query GetFacets {
    facets {
        categories
    }
}
`;

const CATEGORY_SEARCH_QUERY = `
query SearchByCategory($perPage: Int!, $page: Int!, $filters: GameSearchFiltersFlat!) {
    gamesSearched(input: { hitsPerPage: $perPage, page: $page, filters: $filters }) {
        nbHits
        nbPages
        page
        hitsPerPage
        hits {
            objectID
            title
            description
            instruction
            md5
            pageView
            publishedAt
            lastPublishedAt
            company
            type
            subType
            visible
            isSearchable
            featuredGame
            featuredGameOrder
            bestGame
            bestGameOrder
            topPicksGame
            topPicksGameOrder
            categories
            tags
            slugs {
                name
                active
            }
            assets {
                name
                width
                height
            }
        }
    }
}
`;

const EXISTING_DATA_SOURCES = [
    { file: 'js/game_data/games.js', kind: 'array', key: 'gamesData' },
    { file: 'js/game_data/action.js', kind: 'array', key: 'actionGames' },
    { file: 'js/game_data/battleRoyale.js', kind: 'array', key: 'battleRoyaleData' },
    { file: 'js/game_data/fps.js', kind: 'array', key: 'fpsData' },
    { file: 'js/game_data/multiplayer.js', kind: 'array', key: 'multiplayerGames' },
    { file: 'js/game_data/sniper.js', kind: 'array', key: 'sniperData' },
    { file: 'js/game_data/gd_extra.js', kind: 'object-of-arrays', key: 'gdExtraGames' },
];

function ensureDir(dirPath) {
    fs.mkdirSync(dirPath, { recursive: true });
}

function collapseWhitespace(value) {
    return String(value || '')
        .replace(/\s+/g, ' ')
        .trim();
}

function normalizeSlug(value) {
    return String(value || '')
        .trim()
        .toLowerCase();
}

function normalizeMd5(value) {
    return String(value || '')
        .trim()
        .toLowerCase();
}

function slugifyCategoryName(value) {
    const cleaned = String(value || '')
        .trim()
        .toLowerCase()
        .replace(/&/g, ' and ')
        .replace(/\./g, ' ')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '');

    return cleaned || 'category';
}

function isExternalUrl(value) {
    return /^https?:\/\//i.test(String(value || ''));
}

function extractMd5FromIframeUrl(value) {
    const match = String(value || '').match(/html5\.gamedistribution\.com\/([^/]+)\//i);
    return match ? normalizeMd5(match[1]) : '';
}

function extractSlugFromLink(value) {
    const link = String(value || '');

    if (!link) {
        return '';
    }

    const gdMatch = link.match(/[?&]gd=([^&]+)/i);
    if (gdMatch) {
        return normalizeSlug(decodeURIComponent(gdMatch[1]));
    }

    const gamePathMatch = link.match(/\/games\/([^/?#]+)\/?$/i);
    if (gamePathMatch) {
        return normalizeSlug(gamePathMatch[1]);
    }

    return normalizeSlug(
        path.basename(link.split('?')[0]).replace(/\.html$/i, '')
    );
}

function pickAssetName(assets) {
    const assetList = Array.isArray(assets) ? assets : [];
    const preferredSuffixes = ['512x384', '512x512', '1280x720', '1280x550', '200x120'];

    for (const suffix of preferredSuffixes) {
        const match = assetList.find((asset) => String(asset?.name || '').includes(suffix));
        if (match?.name) {
            return match.name;
        }
    }

    return assetList[0]?.name || '';
}

function readScriptValue(relativePath, key) {
    const fullPath = path.join(ROOT_DIR, relativePath);
    if (!fs.existsSync(fullPath)) {
        return null;
    }

    const sandbox = { window: {} };
    vm.createContext(sandbox);
    vm.runInContext(fs.readFileSync(fullPath, 'utf8'), sandbox);

    if (sandbox[key] !== undefined) {
        return sandbox[key];
    }

    if (sandbox.window && sandbox.window[key] !== undefined) {
        return sandbox.window[key];
    }

    return null;
}

function collectExistingGames() {
    const games = [];

    for (const source of EXISTING_DATA_SOURCES) {
        const value = readScriptValue(source.file, source.key);

        if (source.kind === 'array' && Array.isArray(value)) {
            games.push(...value);
            continue;
        }

        if (source.kind === 'object-of-arrays' && value && typeof value === 'object') {
            for (const list of Object.values(value)) {
                if (Array.isArray(list)) {
                    games.push(...list);
                }
            }
        }
    }

    return games;
}

function buildExistingIndex() {
    const index = {
        md5s: new Set(),
        slugs: new Set(),
        ids: new Set(),
        urls: new Set(),
    };

    for (const game of collectExistingGames()) {
        const md5 = normalizeMd5(game.md5 || extractMd5FromIframeUrl(game.iframeUrl));
        const slug = normalizeSlug(game.slug || extractSlugFromLink(game.link) || extractSlugFromLink(game.gameUrl));
        const id = normalizeSlug(game.id);
        const gameUrl = isExternalUrl(game.gameUrl) ? game.gameUrl.trim() : '';

        if (md5) {
            index.md5s.add(md5);
        }

        if (slug) {
            index.slugs.add(slug);
        }

        if (id) {
            index.ids.add(id);
        }

        if (gameUrl) {
            index.urls.add(gameUrl);
        }
    }

    return index;
}

async function postGraphQL(query, variables = {}, operationName = null) {
    const response = await fetch(GRAPHQL_ENDPOINT, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify({
            operationName,
            query,
            variables,
        }),
    });

    if (!response.ok) {
        throw new Error(`GraphQL request failed with status ${response.status}`);
    }

    const payload = await response.json();
    if (payload.errors) {
        throw new Error(JSON.stringify(payload.errors));
    }

    return payload.data;
}

async function fetchFacetCategories() {
    const data = await postGraphQL(FACETS_QUERY, {}, 'GetFacets');
    const categories = data?.facets?.categories || [];

    return categories
        .map((value) => collapseWhitespace(value))
        .filter(Boolean)
        .sort((left, right) => left.localeCompare(right));
}

function buildCategoryMeta(sourceCategory) {
    const slug = CATEGORY_SLUG_OVERRIDES[sourceCategory] || slugifyCategoryName(sourceCategory);

    return {
        key: slug,
        slug,
        label: CATEGORY_LABEL_TRANSLATIONS[sourceCategory] || label(sourceCategory, sourceCategory, sourceCategory, sourceCategory, sourceCategory, sourceCategory),
        sourceCategory,
        pagePath: `${slug}.html`,
        description: `${sourceCategory} browser games sourced from GameDistribution and grouped into a dedicated SkillWarz category page.`,
    };
}

function buildKeywordString(hit, categoryLabel) {
    const uniqueParts = new Set([
        hit.title,
        categoryLabel,
        'GameDistribution',
        ...(hit.categories || []),
        ...(hit.tags || []).slice(0, 8),
    ].map((value) => collapseWhitespace(value)).filter(Boolean));

    return [...uniqueParts].join(', ');
}

function computeRating(hit) {
    const base = 4.1;
    const featuredBoost = Number(hit.topPicksGame || 0) ? 0.35 : 0;
    const bestBoost = Number(hit.bestGame || 0) ? 0.25 : 0;
    const featureBoost = Number(hit.featuredGame || 0) ? 0.2 : 0;
    const viewBoost = Math.min(0.3, Number(hit.pageView || 0) / 1000);

    return Math.min(4.9, base + featuredBoost + bestBoost + featureBoost + viewBoost).toFixed(1);
}

function buildGameUrl(slug) {
    return `https://www.gamedistribution.com/games/${slug}/`;
}

function formatGameRecord(hit, categoryMeta) {
    const activeSlug = hit.slugs?.find((item) => item.active)?.name || hit.slugs?.[0]?.name || '';
    const assetName = pickAssetName(hit.assets);
    const description = collapseWhitespace(hit.description) || `${hit.title} is a browser game in the ${categoryMeta.label} category.`;
    const instruction = collapseWhitespace(hit.instruction);
    const tags = [...new Set((hit.tags || []).map((value) => String(value).toLowerCase()).filter(Boolean))];
    const imageUrl = assetName ? `https://img.gamedistribution.com/${assetName}` : '';

    return {
        id: `gd:${activeSlug}`,
        uniqueId: String(hit.objectID || hit.md5 || activeSlug),
        slug: activeSlug,
        name: hit.title,
        imageUrl,
        thumbnailUrl: imageUrl,
        gameType: categoryMeta.label,
        rating: computeRating(hit),
        description,
        keywords: buildKeywordString(hit, categoryMeta.label),
        link: `play.html?gd=${encodeURIComponent(activeSlug)}&category=${encodeURIComponent(categoryMeta.key)}`,
        gameUrl: buildGameUrl(activeSlug),
        tags,
        iframeUrl: `https://html5.gamedistribution.com/${hit.md5}/${REFERRER_SUFFIX}`,
        source: 'GameDistribution',
        provider: 'GameDistribution',
        category: categoryMeta.label,
        categoryKey: categoryMeta.key,
        categorySlug: categoryMeta.slug,
        instruction,
        categories: hit.categories || [],
        lastPublishedAt: hit.lastPublishedAt || hit.publishedAt || '',
        pageView: Number(hit.pageView || 0),
        featuredGame: Number(hit.featuredGame || 0),
        featuredGameOrder: Number(hit.featuredGameOrder || 0),
        bestGame: Number(hit.bestGame || 0),
        bestGameOrder: Number(hit.bestGameOrder || 0),
        topPicksGame: Number(hit.topPicksGame || 0),
        topPicksGameOrder: Number(hit.topPicksGameOrder || 0),
    };
}

function isDuplicateOfExisting(hit, existingIndex) {
    const activeSlug = normalizeSlug(hit.slugs?.find((item) => item.active)?.name || hit.slugs?.[0]?.name || '');
    const md5 = normalizeMd5(hit.md5);
    const uniqueId = normalizeSlug(hit.objectID || '');
    const gameUrl = activeSlug ? buildGameUrl(activeSlug) : '';

    return (
        (md5 && existingIndex.md5s.has(md5)) ||
        (activeSlug && existingIndex.slugs.has(activeSlug)) ||
        (uniqueId && existingIndex.ids.has(uniqueId)) ||
        (gameUrl && existingIndex.urls.has(gameUrl))
    );
}

function hasRequiredFields(hit) {
    const activeSlug = hit.slugs?.find((item) => item.active)?.name || hit.slugs?.[0]?.name || '';
    return Boolean(hit.md5 && activeSlug && pickAssetName(hit.assets));
}

function recommendationScore(game) {
    const topPicksOrder = game.topPicksGameOrder > 0 ? 2000 - game.topPicksGameOrder : 0;
    const featuredOrder = game.featuredGameOrder > 0 ? 1600 - game.featuredGameOrder : 0;
    const bestOrder = game.bestGameOrder > 0 ? 1200 - game.bestGameOrder : 0;
    const pageViewScore = Math.min(500, Number(game.pageView || 0));
    const publishedScore = new Date(game.lastPublishedAt || 0).getTime() / 10000000000;

    return topPicksOrder + featuredOrder + bestOrder + pageViewScore + publishedScore;
}

function sortGames(left, right) {
    const scoreDifference = recommendationScore(right) - recommendationScore(left);
    if (scoreDifference !== 0) {
        return scoreDifference;
    }

    return left.name.localeCompare(right.name);
}

async function fetchCategoryHits(sourceCategory) {
    const selected = [];
    const seenMd5s = new Set();
    let page = 0;
    let nbPages = 1;
    let nbHits = 0;

    while (page < nbPages && page < MAX_PAGES_PER_CATEGORY && selected.length < MAX_GAMES_PER_CATEGORY) {
        const data = await postGraphQL(
            CATEGORY_SEARCH_QUERY,
            {
                perPage: PAGE_SIZE,
                page,
                filters: {
                    categories: [sourceCategory],
                    visible: true,
                    isSearchable: true,
                },
            },
            'SearchByCategory'
        );

        const result = data?.gamesSearched;
        const hits = result?.hits || [];
        nbHits = Number(result?.nbHits || 0);
        nbPages = Number(result?.nbPages || 0);

        for (const hit of hits) {
            const md5 = normalizeMd5(hit.md5);
            if (!md5 || seenMd5s.has(md5)) {
                continue;
            }

            seenMd5s.add(md5);
            selected.push(hit);

            if (selected.length >= MAX_GAMES_PER_CATEGORY) {
                break;
            }
        }

        page += 1;
    }

    return { nbHits, hits: selected };
}

async function mapWithConcurrency(items, concurrency, worker) {
    const results = new Array(items.length);
    let currentIndex = 0;

    async function next() {
        while (currentIndex < items.length) {
            const index = currentIndex;
            currentIndex += 1;
            results[index] = await worker(items[index], index);
        }
    }

    await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, () => next()));
    return results;
}

function dedupeAllGames(categories) {
    const uniqueGames = [];
    const seen = new Set();

    for (const category of categories) {
        for (const game of category.games) {
            const key = normalizeMd5(extractMd5FromIframeUrl(game.iframeUrl)) || normalizeSlug(game.id);
            if (!key || seen.has(key)) {
                continue;
            }

            seen.add(key);
            uniqueGames.push({ ...game });
        }
    }

    return uniqueGames.sort(sortGames);
}

function buildBrowserPayload(categories) {
    return {
        generatedAt: new Date().toISOString(),
        referrerUrl: 'https://www.onlinegames.io/cat-runner/',
        source: 'GameDistribution',
        categories,
        allGames: dedupeAllGames(categories),
    };
}

function writeJsonOutput(payload) {
    ensureDir(DATA_DIR);
    fs.writeFileSync(OUTPUT_JSON_FILE, JSON.stringify(payload, null, 2), 'utf8');
}

function writeJsOutput(payload) {
    ensureDir(path.dirname(OUTPUT_JS_FILE));
    const banner = [
        '// This file is generated by scripts/build_gd_categories.js',
        '// It contains GameDistribution category data for generated category landing pages and play.html.',
        '',
    ].join('\n');

    const content = `${banner}var gdCategoryData = ${JSON.stringify(payload, null, 4)};\nif (typeof window !== 'undefined') {\n    window.gdCategoryData = gdCategoryData;\n}\n`;
    fs.writeFileSync(OUTPUT_JS_FILE, content, 'utf8');
}

function writeReport(report) {
    ensureDir(path.dirname(REPORT_FILE));
    fs.writeFileSync(REPORT_FILE, JSON.stringify(report, null, 2), 'utf8');
}

async function buildCategoryPayload(sourceCategory, existingIndex) {
    const categoryMeta = buildCategoryMeta(sourceCategory);
    const { nbHits, hits } = await fetchCategoryHits(sourceCategory);
    const formattedGames = [];
    const skippedDuplicates = [];

    for (const hit of hits) {
        if (!hasRequiredFields(hit)) {
            continue;
        }

        if (isDuplicateOfExisting(hit, existingIndex)) {
            const duplicateSlug = hit.slugs?.find((item) => item.active)?.name || hit.slugs?.[0]?.name || hit.title;
            skippedDuplicates.push(duplicateSlug);
            continue;
        }

        formattedGames.push(formatGameRecord(hit, categoryMeta));

        if (formattedGames.length >= MAX_GAMES_PER_CATEGORY) {
            break;
        }
    }

    const games = formattedGames.sort(sortGames);
    const recommendedGames = [...games].sort(sortGames).slice(0, MAX_RECOMMENDED_GAMES);

    return {
        ...categoryMeta,
        totalAvailable: nbHits,
        gameCount: games.length,
        recommendedGames,
        games,
        skippedDuplicates,
    };
}

async function main() {
    const existingIndex = buildExistingIndex();
    const sourceCategories = await fetchFacetCategories();

    const categoryPayloads = await mapWithConcurrency(
        sourceCategories,
        CATEGORY_WORKERS,
        (sourceCategory) => buildCategoryPayload(sourceCategory, existingIndex)
    );

    const categories = categoryPayloads.filter((category) => category.gameCount > 0);
    const payload = buildBrowserPayload(categories);
    const report = {
        generatedAt: payload.generatedAt,
        categoryCount: categories.length,
        allGameCount: payload.allGames.length,
        categories: categories.map((category) => ({
            key: category.key,
            label: category.label,
            pagePath: category.pagePath,
            totalAvailable: category.totalAvailable,
            gameCount: category.gameCount,
            recommendedCount: category.recommendedGames.length,
        })),
    };

    writeJsonOutput(payload);
    writeJsOutput(payload);
    writeReport(report);

    console.log(`Generated ${path.relative(ROOT_DIR, OUTPUT_JSON_FILE)}`);
    console.log(`Generated ${path.relative(ROOT_DIR, OUTPUT_JS_FILE)}`);
    for (const category of categories) {
        console.log(`${category.label}: ${category.gameCount} games`);
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
