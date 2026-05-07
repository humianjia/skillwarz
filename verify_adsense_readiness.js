const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const DEFAULT_SITE = 'https://skillwarz.online';

const staticPages = [
    'index.html',
    'categories.html',
    'about.html',
    'contact.html',
    'privacy.html',
    'terms.html',
    'dmca.html',
    'skillwarz-beginner-guide.html',
    'skillwarz-controls-tips.html',
    'best-browser-shooter-modes.html',
    'browser-fps-vs-battle-royale-guide.html',
    'how-to-improve-browser-fps-aim.html',
    'best-browser-sniper-games-guide.html',
    'battle-royale-beginner-mistakes.html',
    'how-to-choose-browser-shooter.html',
];

const gameDirs = ['Action', 'BattleRoyale', 'FPS', 'Multiplayer', 'Sniper'];

const liveChecks = [
    '/',
    '/categories.html',
    '/about.html',
    '/contact.html',
    '/privacy.html',
    '/terms.html',
    '/dmca.html',
    '/skillwarz-beginner-guide.html',
    '/robots.txt',
    '/sitemap.xml',
    '/ads.txt',
];

function read(file) {
    return fs.readFileSync(path.join(ROOT, file), 'utf8');
}

function exists(file) {
    return fs.existsSync(path.join(ROOT, file));
}

function add(results, status, item, details) {
    results.push({ status, item, details });
}

function countGameRobots() {
    let indexed = 0;
    let noindexed = 0;
    for (const dir of gameDirs) {
        const dirPath = path.join(ROOT, dir);
        if (!fs.existsSync(dirPath)) continue;
        for (const file of fs.readdirSync(dirPath)) {
            if (!file.endsWith('.html')) continue;
            const html = fs.readFileSync(path.join(dirPath, file), 'utf8');
            if (html.includes('content="index, follow, max-image-preview:large"')) indexed += 1;
            if (html.includes('content="noindex, follow"')) noindexed += 1;
        }
    }
    return { indexed, noindexed };
}

function runLocalChecks() {
    const results = [];

    const requiredFiles = [
        'ads.txt',
        'robots.txt',
        'sitemap.xml',
        'rebuild_site.js',
        'css/content.css',
    ];

    for (const file of requiredFiles) {
        add(
            results,
            exists(file) ? 'PASS' : 'FAIL',
            `Required file: ${file}`,
            exists(file) ? 'File exists locally.' : 'Missing local file.'
        );
    }

    const robots = exists('robots.txt') ? read('robots.txt') : '';
    add(
        results,
        robots.includes('Sitemap: https://skillwarz.online/sitemap.xml') ? 'PASS' : 'FAIL',
        'robots.txt points to live sitemap',
        robots.includes('Sitemap: https://skillwarz.online/sitemap.xml')
            ? 'Correct sitemap URL found.'
            : 'Expected sitemap URL not found in robots.txt.'
    );

    const sitemap = exists('sitemap.xml') ? read('sitemap.xml') : '';
    add(
        results,
        sitemap.includes('skillwarz-beginner-guide.html') && sitemap.includes('/FPS/Hazmob_FPS.html') ? 'PASS' : 'FAIL',
        'sitemap.xml contains key guide and game URLs',
        sitemap ? 'Sitemap was parsed locally.' : 'sitemap.xml missing or empty.'
    );

    const ads = exists('ads.txt') ? read('ads.txt') : '';
    add(
        results,
        ads.includes('pub-XXXXXXXXXXXXXXXX') ? 'WARN' : ads.trim() ? 'PASS' : 'FAIL',
        'ads.txt publisher line',
        ads.includes('pub-XXXXXXXXXXXXXXXX')
            ? 'Still using placeholder publisher ID. Replace with the real ca-pub value before or immediately after approval.'
            : ads.trim()
                ? 'ads.txt contains a non-placeholder value.'
                : 'ads.txt is empty.'
    );

    for (const file of staticPages) {
        if (!exists(file)) {
            add(results, 'FAIL', `Static page exists: ${file}`, 'Missing page.');
            continue;
        }

        const html = read(file);
        const missing = [];
        if (!html.includes('<title>')) missing.push('title');
        if (!html.includes('meta name="description"')) missing.push('description');
        if (!html.includes('rel="canonical"')) missing.push('canonical');
        if (!html.includes('G-DNT670B4R3')) missing.push('analytics');
        if (!html.includes('google-adsense-account')) missing.push('adsense account meta');
        if (!html.includes('422435896@qq.com')) missing.push('contact email');

        add(
            results,
            missing.length === 0 ? 'PASS' : 'FAIL',
            `Static page metadata: ${file}`,
            missing.length === 0 ? 'Title, description, canonical, analytics, AdSense account meta, and email found.' : `Missing: ${missing.join(', ')}`
        );
    }

    const home = exists('index.html') ? read('index.html') : '';
    add(
        results,
        home.includes('Guide And Shooter Discovery Hub') && home.includes('Start with the beginner guide') ? 'PASS' : 'FAIL',
        'Homepage uses rebuilt editorial version',
        home ? 'Homepage file checked locally.' : 'Homepage missing.'
    );

    add(
        results,
        home.includes('The playable frame loads only after the visitor chooses to open it.') && !home.includes('<iframe id="game-iframe"') ? 'PASS' : 'WARN',
        'Homepage defers playable frame loading',
        home.includes('The playable frame loads only after the visitor chooses to open it.')
            ? 'Homepage now leads with editorial content and a user-initiated play trigger.'
            : 'Homepage still appears to auto-load the playable frame.'
    );

    const categories = exists('categories.html') ? read('categories.html') : '';
    add(
        results,
        !/1000\+ Games|Math\.random/.test(categories) ? 'PASS' : 'FAIL',
        'Category page no longer uses inflated counts or random stats',
        !categories ? 'categories.html missing.' : 'Category page checked locally.'
    );

    add(
        results,
        categories.includes('off the main review path') && !/Support page<\/span>/.test(categories) ? 'PASS' : 'WARN',
        'Category page foregrounds flagship editorial pages',
        categories.includes('off the main review path')
            ? 'Categories emphasize stronger editorial pages and de-emphasize support entries.'
            : 'Categories may still be surfacing too many support entries.'
    );

    const legacyTargets = [
        'veck.io',
        'Veck.io',
        'skillwarz.io',
        'https://skillwarz/',
    ];
    const legacyFiles = ['index.html', 'categories.html', ...staticPages, 'rebuild_site.js', 'init.js'];
    const legacyHits = [];
    for (const file of new Set(legacyFiles)) {
        if (!exists(file)) continue;
        const html = read(file);
        for (const token of legacyTargets) {
            if (html.includes(token)) {
                legacyHits.push(`${file}: ${token}`);
            }
        }
    }
    add(
        results,
        legacyHits.length === 0 ? 'PASS' : 'WARN',
        'Legacy brand/domain leftovers',
        legacyHits.length === 0 ? 'No checked legacy tokens found in main surfaced files.' : legacyHits.join(' | ')
    );

    const robotsCount = countGameRobots();
    add(
        results,
        robotsCount.indexed > 0 && robotsCount.noindexed > 0 ? 'PASS' : 'FAIL',
        'Indexable vs support page split',
        `Indexed game pages: ${robotsCount.indexed}; noindex support pages: ${robotsCount.noindexed}`
    );

    const allGamePages = [];
    for (const dir of gameDirs) {
        const dirPath = path.join(ROOT, dir);
        if (!fs.existsSync(dirPath)) continue;
        for (const file of fs.readdirSync(dirPath)) {
            if (file.endsWith('.html')) {
                allGamePages.push(path.join(dir, file));
            }
        }
    }

    let gamePageFailures = 0;
    for (const file of allGamePages) {
        const html = fs.readFileSync(path.join(ROOT, file), 'utf8');
        const ok =
            html.includes('rel="canonical"') &&
            html.includes('422435896@qq.com') &&
            html.includes('Playable browser embeds may be provided by a third-party distribution partner');
        if (!ok) gamePageFailures += 1;
    }
    add(
        results,
        gamePageFailures === 0 ? 'PASS' : 'FAIL',
        'Game page template consistency',
        gamePageFailures === 0 ? 'All checked game pages include canonical, contact, and embed disclosure text.' : `${gamePageFailures} game pages failed consistency checks.`
    );

    const adsenseCodeFound = [...staticPages, 'index.html', 'categories.html'].some((file) => exists(file) && /google-adsense-account|ca-pub-|adsbygoogle|pagead2\.googlesyndication\.com/.test(read(file)));
    add(
        results,
        adsenseCodeFound ? 'PASS' : 'WARN',
        'AdSense verification token present locally',
        adsenseCodeFound
            ? 'At least one local page contains an AdSense-related verification token.'
            : 'No AdSense token found locally yet. Add the account meta tag or full AdSense code before submission.'
    );

    return results;
}

async function fetchText(url) {
    const response = await fetch(url, { redirect: 'follow' });
    const text = await response.text();
    return { status: response.status, text };
}

async function runLiveChecks(baseUrl) {
    const results = [];

    for (const relative of liveChecks) {
        const url = `${baseUrl}${relative}`;
        try {
            const { status, text } = await fetchText(url);
            add(
                results,
                status === 200 ? 'PASS' : 'FAIL',
                `Live status: ${relative}`,
                `HTTP ${status}; response length ${text.length}`
            );
        } catch (error) {
            add(results, 'FAIL', `Live status: ${relative}`, error.message);
        }
    }

    try {
        const home = await fetchText(`${baseUrl}/`);
        add(
            results,
            home.text.includes('Guide And Shooter Discovery Hub') ? 'PASS' : 'FAIL',
            'Live homepage is rebuilt version',
            home.text.includes('Guide And Shooter Discovery Hub')
                ? 'Live homepage matches rebuilt editorial variant.'
                : 'Live homepage still looks like the older version.'
        );

        add(
            results,
            home.text.includes('The playable frame loads only after the visitor chooses to open it.') && !home.text.includes('<iframe id="game-iframe"') ? 'PASS' : 'WARN',
            'Live homepage defers playable frame loading',
            home.text.includes('The playable frame loads only after the visitor chooses to open it.')
                ? 'Live homepage is using a user-initiated play trigger.'
                : 'Live homepage may still auto-load the playable frame.'
        );
    } catch (error) {
        add(results, 'FAIL', 'Live homepage content check', error.message);
    }

    try {
        const categories = await fetchText(`${baseUrl}/categories.html`);
        add(
            results,
            categories.status === 200 && categories.text.includes('off the main review path') && !/Support page<\/span>/.test(categories.text) ? 'PASS' : 'WARN',
            'Live categories foreground flagship pages',
            categories.status === 200
                ? 'Live categories fetched.'
                : `HTTP ${categories.status}`
        );
    } catch (error) {
        add(results, 'FAIL', 'Live categories content check', error.message);
    }

    try {
        const robots = await fetchText(`${baseUrl}/robots.txt`);
        add(
            results,
            robots.status === 200 && robots.text.includes(`${baseUrl}/sitemap.xml`) ? 'PASS' : 'FAIL',
            'Live robots.txt references live sitemap',
            robots.status === 200 ? 'robots.txt fetched.' : `HTTP ${robots.status}`
        );
    } catch (error) {
        add(results, 'FAIL', 'Live robots.txt content check', error.message);
    }

    try {
        const sitemap = await fetchText(`${baseUrl}/sitemap.xml`);
        add(
            results,
            sitemap.status === 200 && sitemap.text.includes('skillwarz-beginner-guide.html') ? 'PASS' : 'FAIL',
            'Live sitemap contains guide URLs',
            sitemap.status === 200 ? 'sitemap.xml fetched.' : `HTTP ${sitemap.status}`
        );
    } catch (error) {
        add(results, 'FAIL', 'Live sitemap content check', error.message);
    }

    try {
        const ads = await fetchText(`${baseUrl}/ads.txt`);
        const hasPlaceholder = ads.text.includes('pub-XXXXXXXXXXXXXXXX');
        add(
            results,
            ads.status !== 200 ? 'FAIL' : hasPlaceholder ? 'WARN' : 'PASS',
            'Live ads.txt publisher line',
            ads.status !== 200
                ? `HTTP ${ads.status}`
                : hasPlaceholder
                    ? 'ads.txt is live but still uses the placeholder publisher ID.'
                    : 'ads.txt is live and does not use the placeholder publisher ID.'
        );
    } catch (error) {
        add(results, 'FAIL', 'Live ads.txt check', error.message);
    }

    try {
        const guide = await fetchText(`${baseUrl}/skillwarz-beginner-guide.html`);
        add(
            results,
            guide.status === 200 && guide.text.includes('SkillWarz Beginner Guide') ? 'PASS' : 'FAIL',
            'Live guide page is reachable',
            guide.status === 200 ? 'Guide page fetched.' : `HTTP ${guide.status}`
        );
    } catch (error) {
        add(results, 'FAIL', 'Live guide page check', error.message);
    }

    const adsenseTokens = ['google-adsense-account', 'ca-pub-', 'adsbygoogle', 'pagead2.googlesyndication.com'];
    try {
        const home = await fetchText(`${baseUrl}/`);
        const found = adsenseTokens.some((token) => home.text.includes(token));
        add(
            results,
            found ? 'PASS' : 'WARN',
            'Live AdSense token presence',
            found ? 'AdSense-related token found on the live homepage.' : 'No AdSense-related token found on the live homepage yet.'
        );
    } catch (error) {
        add(results, 'FAIL', 'Live AdSense token check', error.message);
    }

    return results;
}

function printResults(title, results) {
    console.log(`\n=== ${title} ===`);
    for (const result of results) {
        console.log(`[${result.status}] ${result.item}`);
        console.log(`  ${result.details}`);
    }
}

function summarize(results) {
    return results.reduce((acc, result) => {
        acc[result.status] = (acc[result.status] || 0) + 1;
        return acc;
    }, {});
}

async function main() {
    const args = process.argv.slice(2);
    const wantsLive = args.includes('--live');
    const liveArgIndex = args.indexOf('--site');
    const site = liveArgIndex >= 0 && args[liveArgIndex + 1] ? args[liveArgIndex + 1].replace(/\/$/, '') : DEFAULT_SITE;

    const localResults = runLocalChecks();
    printResults('Local Checks', localResults);
    console.log('\nLocal summary:', summarize(localResults));

    if (wantsLive) {
        const liveResults = await runLiveChecks(site);
        printResults(`Live Checks (${site})`, liveResults);
        console.log('\nLive summary:', summarize(liveResults));
    } else {
        console.log('\nLive checks skipped. Run `node verify_adsense_readiness.js --live` after deployment.');
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
