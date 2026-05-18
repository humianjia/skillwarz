const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const TMP_DIR = path.join(ROOT_DIR, '.tmp');
const CACHE_DIR = path.join(TMP_DIR, 'gd_cache');
const OUTPUT_FILE = path.join(ROOT_DIR, 'js', 'game_data', 'gd_extra.js');
const REPORT_FILE = path.join(TMP_DIR, 'gd_extra_report.json');
const MAX_TOTAL_CANDIDATES = 900;

const SEARCH_QUERY = `query GetGamesSearched($id: String! = "", $perPage: Int! = 30, $page: Int! = 0, $search: String! = "", $UIfilter: UIFilterInput! = {}, $filters: GameSearchFiltersFlat! = {}, $sortBy: KnownOrder, $sortByGeneric: [String!], $sortByCountryPerf: SortByCountryPerf! = {}, $sortByGenericWithDirection: [SortByGenericWithDirection!], $sortByScore: SortByScore) { gamesSearched(input: { collectionObjectId: $id, hitsPerPage: $perPage, page: $page, search: $search, UIfilter: $UIfilter, filters: $filters, sortBy: $sortBy, sortByCountryPerf: $sortByCountryPerf, sortByGeneric: $sortByGeneric, sortByGenericWithDirection: $sortByGenericWithDirection, sortByScore: $sortByScore }) { nbHits page hits { objectID title company slugs { name } assets { name width height } } } }`;

const CATEGORY_CONFIG = {
    fps: {
        label: 'First-Person Shooters',
        targetCount: 20,
        preferredMinScore: 10,
        fallbackMinScore: 6,
        searchTerms: [
            'fps',
            'first person shooter',
            'counter strike',
            'gun strike',
            'modern combat',
            'battlefield'
        ]
    },
    'battle-royale': {
        label: 'Battle Royale',
        targetCount: 20,
        preferredMinScore: 11,
        fallbackMinScore: 6,
        searchTerms: [
            'battle royale',
            'battleroyale',
            'royale shooter',
            'last man standing',
            'survival shooter',
            'royale'
        ]
    },
    sniper: {
        label: 'Sniper Games',
        targetCount: 20,
        preferredMinScore: 10,
        fallbackMinScore: 5,
        searchTerms: [
            'sniper',
            'marksman',
            'target shooting',
            'counter sniper',
            'assassin shooter'
        ]
    },
    multiplayer: {
        label: 'Multiplayer Shooters',
        targetCount: 20,
        preferredMinScore: 9,
        fallbackMinScore: 5,
        searchTerms: [
            'multiplayer shooter',
            'io shooter',
            'arena io',
            'team shooter',
            'online battle',
            'multiplayer'
        ]
    },
    action: {
        label: 'Action Shooters',
        targetCount: 20,
        preferredMinScore: 9,
        fallbackMinScore: 5,
        searchTerms: [
            'action shooter',
            'combat shooter',
            'war game',
            'gun game',
            'battle action',
            'shooter'
        ]
    }
};

const EXISTING_DATA_FILES = [
    path.join(ROOT_DIR, 'js', 'game_data', 'games.js'),
    path.join(ROOT_DIR, 'js', 'game_data', 'action.js'),
    path.join(ROOT_DIR, 'js', 'game_data', 'battleRoyale.js'),
    path.join(ROOT_DIR, 'js', 'game_data', 'fps.js'),
    path.join(ROOT_DIR, 'js', 'game_data', 'multiplayer.js'),
    path.join(ROOT_DIR, 'js', 'game_data', 'sniper.js')
];

const REFERRER_SUFFIX = '?gd_sdk_referrer_url=https://www.onlinegames.io/cat-runner/';

function ensureDir(dirPath) {
    fs.mkdirSync(dirPath, { recursive: true });
}

function normalizeText(value) {
    return String(value || '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, ' ')
        .trim();
}

function collapseWhitespace(value) {
    return String(value || '')
        .replace(/\s+/g, ' ')
        .trim();
}

function sanitizeCacheName(value) {
    return String(value || '')
        .replace(/[^a-z0-9._-]+/gi, '_')
        .replace(/_+/g, '_')
        .replace(/^_+|_+$/g, '');
}

function parseArrayFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const match = content.match(/=\s*(\[[\s\S]*\]);?\s*$/);
    if (!match) {
        return [];
    }

    return Function(`return (${match[1]});`)();
}

function extractExistingIndex() {
    const index = {
        titles: new Set(),
        slugs: new Set(),
        md5s: new Set()
    };

    for (const filePath of EXISTING_DATA_FILES) {
        const games = parseArrayFile(filePath);
        for (const game of games) {
            index.titles.add(normalizeText(game.name || game.id));

            const fileSlug = String(game.link || '')
                .split('/')
                .pop()
                .replace(/\.html$/i, '')
                .replace(/_/g, ' ');
            if (fileSlug) {
                index.slugs.add(normalizeText(fileSlug));
            }

            const md5Match = String(game.iframeUrl || '').match(/html5\.gamedistribution\.com\/([^/]+)\//i);
            if (md5Match) {
                index.md5s.add(md5Match[1].toLowerCase());
            }
        }
    }

    return index;
}

async function postGraphQL(variables) {
    const response = await fetch('https://gd-website-api.gamedistribution.com/graphql', {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            operationName: 'GetGamesSearched',
            query: SEARCH_QUERY,
            variables
        })
    });

    if (!response.ok) {
        throw new Error(`Search request failed with status ${response.status}`);
    }

    const payload = await response.json();
    if (payload.errors) {
        throw new Error(JSON.stringify(payload.errors));
    }

    return payload.data?.gamesSearched?.hits || [];
}

async function searchCandidateSlugs() {
    const candidateMap = new Map();
    const searchSpecs = [];

    for (const [categoryKey, config] of Object.entries(CATEGORY_CONFIG)) {
        for (const term of config.searchTerms) {
            searchSpecs.push({ categoryKey, term });
        }
    }

    for (const { categoryKey, term } of searchSpecs) {
        for (const page of [0, 1]) {
            const hits = await postGraphQL({
                perPage: 30,
                page,
                search: term
            });

            for (const hit of hits) {
                const slug = hit?.slugs?.[0]?.name;
                if (!slug) {
                    continue;
                }

                const existing = candidateMap.get(slug) || {
                    slug,
                    title: hit.title,
                    matchedSearches: new Set()
                };

                existing.matchedSearches.add(`${categoryKey}:${term}`);
                candidateMap.set(slug, existing);
            }
        }
    }

    return candidateMap;
}

async function fetchGameDetail(slug) {
    ensureDir(CACHE_DIR);
    const cacheFile = path.join(CACHE_DIR, `${sanitizeCacheName(slug)}.json`);

    if (fs.existsSync(cacheFile)) {
        return JSON.parse(fs.readFileSync(cacheFile, 'utf8'));
    }

    const response = await fetch(`https://www.gamedistribution.com/games/${slug}/`);
    if (!response.ok) {
        throw new Error(`Detail request for ${slug} failed with status ${response.status}`);
    }

    const html = await response.text();
    const nextDataMatch = html.match(/<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/);
    if (!nextDataMatch) {
        throw new Error(`No __NEXT_DATA__ payload found for ${slug}`);
    }

    const nextData = JSON.parse(nextDataMatch[1]);
    const game = nextData?.props?.pageProps?.game;
    if (!game || !game.md5) {
        throw new Error(`Incomplete game detail payload for ${slug}`);
    }

    fs.writeFileSync(cacheFile, JSON.stringify(game, null, 2), 'utf8');
    return game;
}

function pickAssetName(assets) {
    const assetList = Array.isArray(assets) ? assets : [];
    const preferredSuffixes = ['512x384', '512x512', '1280x720', '1280x550', '200x120'];

    for (const suffix of preferredSuffixes) {
        const found = assetList.find((asset) => String(asset?.name || '').includes(suffix));
        if (found?.name) {
            return found.name;
        }
    }

    return assetList[0]?.name || '';
}

function hasAny(text, patterns) {
    return patterns.some((pattern) => text.includes(pattern));
}

function scoreGame(game, matchedSearches) {
    const categories = (game.categories || []).map((value) => String(value).toLowerCase());
    const tags = (game.tags || []).map((value) => String(value).toLowerCase());
    const searchableText = normalizeText([
        game.title,
        game.description,
        game.instruction,
        ...(game.categories || []),
        ...(game.tags || []),
        ...(game.slugs || []).map((item) => item.name)
    ].join(' '));

    const scores = {
        fps: 0,
        'battle-royale': 0,
        sniper: 0,
        multiplayer: 0,
        action: 0
    };

    if (categories.includes('shooter')) {
        scores.fps += 4;
        scores.action += 3;
    }

    if (categories.includes('battle')) {
        scores['battle-royale'] += 4;
        scores.action += 2;
        scores.fps += 1;
    }

    if (categories.includes('.io')) {
        scores.multiplayer += 4;
        scores['battle-royale'] += 2;
        scores.action += 1;
    }

    if (tags.includes('multiplayer') || tags.includes('co-op')) {
        scores.multiplayer += 6;
    }

    if (tags.includes('2players') || tags.includes('3players')) {
        scores.multiplayer += 3;
    }

    if (tags.includes('sniper')) {
        scores.sniper += 10;
    }

    if (tags.includes('battleroyale')) {
        scores['battle-royale'] += 10;
    }

    if (tags.includes('shoot-em-up')) {
        scores.action += 4;
        scores.fps += 2;
    }

    if (tags.includes('battlefield')) {
        scores.fps += 4;
        scores['battle-royale'] += 4;
        scores.action += 2;
    }

    if (tags.includes('guns') || tags.includes('war') || tags.includes('combat') || tags.includes('soldier')) {
        scores.fps += 2;
        scores.action += 3;
    }

    if (tags.includes('arena')) {
        scores.multiplayer += 2;
        scores.action += 1;
    }

    if (tags.includes('target') || tags.includes('aim') || tags.includes('bullet') || tags.includes('assassin')) {
        scores.sniper += 2;
    }

    if (hasAny(searchableText, [' fps ', 'first person', 'first person shooter', 'first person combat'])) {
        scores.fps += 10;
    }

    if (searchableText.startsWith('fps ') || searchableText.includes(' fps')) {
        scores.fps += 4;
    }

    if (searchableText.includes('sniper')) {
        scores.sniper += 10;
    }

    if (hasAny(searchableText, ['battle royale', 'battleroyale', 'last man standing', 'last player alive'])) {
        scores['battle-royale'] += 10;
    }

    if (hasAny(searchableText, ['multiplayer', 'online battle', 'team based', 'team-based'])) {
        scores.multiplayer += 5;
    }

    if (searchableText.includes('survival')) {
        scores['battle-royale'] += 2;
        scores.action += 1;
    }

    if (searchableText.includes('action')) {
        scores.action += 2;
    }

    if (searchableText.includes('shooter')) {
        scores.fps += 2;
        scores.action += 2;
    }

    if (searchableText.includes('gun')) {
        scores.fps += 1;
        scores.action += 1;
    }

    if (searchableText.includes(' io ') || searchableText.endsWith(' io') || searchableText.startsWith('io ')) {
        scores.multiplayer += 2;
    }

    for (const token of matchedSearches || []) {
        const categoryKey = String(token).split(':')[0];
        if (scores[categoryKey] !== undefined) {
            scores[categoryKey] += 2;
        }
    }

    return scores;
}

function passesCategoryGuard(game, categoryKey, scoreValue) {
    const categories = (game.categories || []).map((value) => String(value).toLowerCase());
    const tags = (game.tags || []).map((value) => String(value).toLowerCase());
    const searchableText = normalizeText([
        game.title,
        game.description,
        game.instruction,
        ...(game.categories || []),
        ...(game.tags || [])
    ].join(' '));

    if (categoryKey === 'fps') {
        return scoreValue >= 6 && (
            categories.includes('shooter') ||
            searchableText.includes('fps') ||
            searchableText.includes('first person') ||
            tags.includes('battlefield') ||
            tags.includes('guns')
        );
    }

    if (categoryKey === 'battle-royale') {
        return scoreValue >= 6 && (
            tags.includes('battleroyale') ||
            searchableText.includes('battle royale') ||
            categories.includes('.io') ||
            categories.includes('battle')
        );
    }

    if (categoryKey === 'sniper') {
        return scoreValue >= 5 && (
            tags.includes('sniper') ||
            searchableText.includes('sniper') ||
            tags.includes('target') ||
            tags.includes('aim')
        );
    }

    if (categoryKey === 'multiplayer') {
        return scoreValue >= 5 && (
            tags.includes('multiplayer') ||
            tags.includes('co-op') ||
            tags.includes('2players') ||
            tags.includes('3players') ||
            categories.includes('.io') ||
            searchableText.includes('multiplayer')
        );
    }

    if (categoryKey === 'action') {
        return scoreValue >= 5 && (
            categories.includes('shooter') ||
            categories.includes('battle') ||
            categories.includes('.io') ||
            tags.includes('shoot-em-up') ||
            tags.includes('guns') ||
            searchableText.includes('action')
        );
    }

    return false;
}

function toComparableSlug(slugValue) {
    return normalizeText(String(slugValue || '').replace(/[-_:]+/g, ' '));
}

function isDuplicateOfExisting(game, existingIndex) {
    const titleKey = normalizeText(game.title);
    const slugKey = toComparableSlug(game.slugs?.[0]?.name || '');
    const md5Key = String(game.md5 || '').toLowerCase();

    return existingIndex.titles.has(titleKey) ||
        existingIndex.slugs.has(slugKey) ||
        existingIndex.md5s.has(md5Key);
}

function buildKeywordString(game, categoryLabel) {
    const uniqueParts = new Set([
        game.title,
        categoryLabel,
        'GameDistribution',
        ...(game.categories || []),
        ...(game.tags || []).slice(0, 8)
    ].map((value) => collapseWhitespace(value)).filter(Boolean));

    return [...uniqueParts].join(', ');
}

function computeRating(game, scoreValue) {
    const baseRating = 4 + Math.min(0.9, Math.max(0, scoreValue) / 25);
    return baseRating.toFixed(1);
}

function formatGameRecord(game, categoryKey, scoreValue) {
    const categoryLabel = CATEGORY_CONFIG[categoryKey].label;
    const activeSlug = game.slugs?.find((item) => item.active)?.name || game.slugs?.[0]?.name || '';
    const assetName = pickAssetName(game.assets);
    const description = collapseWhitespace(game.description) ||
        `${game.title} is a browser game from GameDistribution.`;
    const instruction = collapseWhitespace(game.instruction);
    const tags = [...new Set((game.tags || []).map((value) => String(value).toLowerCase()).filter(Boolean))];

    return {
        id: `gd:${activeSlug}`,
        slug: activeSlug,
        name: game.title,
        imageUrl: `https://img.gamedistribution.com/${assetName}`,
        gameType: categoryLabel,
        rating: computeRating(game, scoreValue),
        description,
        keywords: buildKeywordString(game, categoryLabel),
        link: `play.html?gd=${encodeURIComponent(activeSlug)}&category=${encodeURIComponent(categoryKey)}`,
        tags,
        iframeUrl: `https://html5.gamedistribution.com/${game.md5}/${REFERRER_SUFFIX}`,
        source: 'GameDistribution',
        provider: 'GameDistribution',
        categoryKey,
        instruction,
        categories: game.categories || [],
        lastPublishedAt: game.lastPublishedAt || '',
        pageView: game.pageView || 0
    };
}

function sortCandidates(left, right, categoryKey) {
    const scoreDifference = right.scores[categoryKey] - left.scores[categoryKey];
    if (scoreDifference !== 0) {
        return scoreDifference;
    }

    const leftViews = Number(left.game.pageView || 0);
    const rightViews = Number(right.game.pageView || 0);
    if (rightViews !== leftViews) {
        return rightViews - leftViews;
    }

    const leftPublished = new Date(left.game.lastPublishedAt || left.game.publishedAt || 0).getTime();
    const rightPublished = new Date(right.game.lastPublishedAt || right.game.publishedAt || 0).getTime();
    return rightPublished - leftPublished;
}

function selectGamesForCategory(detailEntries, categoryKey, existingIndex) {
    const config = CATEGORY_CONFIG[categoryKey];
    const byThreshold = [];

    for (let threshold = config.preferredMinScore; threshold >= config.fallbackMinScore; threshold -= 1) {
        const picked = [];
        const seenMd5s = new Set();

        for (const entry of detailEntries.sort((left, right) => sortCandidates(left, right, categoryKey))) {
            const game = entry.game;
            const scoreValue = entry.scores[categoryKey];
            if (scoreValue < threshold) {
                continue;
            }

            if (!passesCategoryGuard(game, categoryKey, scoreValue)) {
                continue;
            }

            if (isDuplicateOfExisting(game, existingIndex)) {
                continue;
            }

            if (!game.md5 || !game.slugs?.[0]?.name || !pickAssetName(game.assets)) {
                continue;
            }

            const md5Key = String(game.md5).toLowerCase();
            if (seenMd5s.has(md5Key)) {
                continue;
            }

            seenMd5s.add(md5Key);
            picked.push(formatGameRecord(game, categoryKey, scoreValue));

            if (picked.length >= config.targetCount) {
                break;
            }
        }

        byThreshold.push({ threshold, picked });
        if (picked.length >= config.targetCount) {
            return picked;
        }
    }

    return byThreshold.sort((left, right) => right.picked.length - left.picked.length)[0]?.picked || [];
}

async function fetchAllDetailEntries(candidateMap) {
    const slugs = [...candidateMap.keys()];
    const detailEntries = [];
    let currentIndex = 0;

    async function worker() {
        while (currentIndex < slugs.length) {
            const slug = slugs[currentIndex];
            currentIndex += 1;

            try {
                const game = await fetchGameDetail(slug);
                const matchedSearches = candidateMap.get(slug)?.matchedSearches || new Set();
                detailEntries.push({
                    game,
                    scores: scoreGame(game, matchedSearches),
                    matchedSearches: [...matchedSearches]
                });

                for (const similarGame of game.similarGames || []) {
                    const similarSlug = similarGame?.slugs?.[0]?.name;
                    if (!similarSlug || candidateMap.has(similarSlug) || candidateMap.size >= MAX_TOTAL_CANDIDATES) {
                        continue;
                    }

                    candidateMap.set(similarSlug, {
                        slug: similarSlug,
                        title: similarGame.title,
                        matchedSearches: new Set([`similar:${slug}`])
                    });
                    slugs.push(similarSlug);
                }
            } catch (error) {
                console.warn(`Skipped ${slug}: ${error.message}`);
            }
        }
    }

    await Promise.all(Array.from({ length: 6 }, () => worker()));
    return detailEntries;
}

function writeOutput(data) {
    const banner = [
        '// This file is generated by scripts/build_gd_extra.js',
        '// It contains extra GameDistribution games shown on category pages and the generic GD play page.',
        ''
    ].join('\n');

    const content = `${banner}window.gdExtraGames = ${JSON.stringify(data, null, 4)};\n`;
    fs.writeFileSync(OUTPUT_FILE, content, 'utf8');
}

function writeReport(report) {
    ensureDir(TMP_DIR);
    fs.writeFileSync(REPORT_FILE, JSON.stringify(report, null, 2), 'utf8');
}

async function main() {
    ensureDir(TMP_DIR);
    ensureDir(CACHE_DIR);

    const existingIndex = extractExistingIndex();
    const candidateMap = await searchCandidateSlugs();
    const detailEntries = await fetchAllDetailEntries(candidateMap);

    const output = {};
    const report = {
        generatedAt: new Date().toISOString(),
        candidateCount: candidateMap.size,
        detailCount: detailEntries.length,
        categories: {}
    };

    for (const categoryKey of Object.keys(CATEGORY_CONFIG)) {
        const selectedGames = selectGamesForCategory(detailEntries, categoryKey, existingIndex);
        output[categoryKey] = selectedGames;
        report.categories[categoryKey] = {
            count: selectedGames.length,
            titles: selectedGames.map((game) => game.name)
        };
    }

    writeOutput(output);
    writeReport(report);

    console.log('Generated js/game_data/gd_extra.js');
    for (const [categoryKey, games] of Object.entries(output)) {
        console.log(`${categoryKey}: ${games.length}`);
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
