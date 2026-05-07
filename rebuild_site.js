const fs = require('fs');
const path = require('path');
const vm = require('vm');

const SITE = {
    name: 'SkillWarz',
    url: 'https://skillwarz.online',
    email: '422435896@qq.com',
    dateIso: '2026-05-07',
    dateLabel: 'May 7, 2026',
    analyticsId: 'G-DNT670B4R3',
    adsensePublisher: 'ca-pub-7534347140708021',
    author: 'SkillWarz Editorial Team',
};

const ROOT = __dirname;

const DATASETS = [
    {
        varName: 'actionGames',
        file: 'js/game_data/action.js',
        dir: 'Action',
        slug: 'action',
        label: 'Action Shooters',
        intro: 'Action pages on SkillWarz focus on quick browser sessions, direct controls, and easy-to-understand game loops.',
    },
    {
        varName: 'battleRoyaleData',
        file: 'js/game_data/battleRoyale.js',
        dir: 'BattleRoyale',
        slug: 'battle-royale',
        label: 'Battle Royale',
        intro: 'Battle royale pages emphasize survival pressure, looting rhythm, and the last-player-standing loop.',
    },
    {
        varName: 'fpsData',
        file: 'js/game_data/fps.js',
        dir: 'FPS',
        slug: 'fps',
        label: 'First-Person Shooters',
        intro: 'FPS pages highlight aiming feel, movement pace, and the kind of player each browser shooter suits best.',
    },
    {
        varName: 'multiplayerGames',
        file: 'js/game_data/multiplayer.js',
        dir: 'Multiplayer',
        slug: 'multiplayer',
        label: 'Multiplayer Games',
        intro: 'Multiplayer pages collect browser titles that make sense for short social sessions and instant replays.',
    },
    {
        varName: 'sniperData',
        file: 'js/game_data/sniper.js',
        dir: 'Sniper',
        slug: 'sniper',
        label: 'Sniper Games',
        intro: 'Sniper pages focus on patience, line-of-sight control, and whether a game rewards careful or aggressive shots.',
    },
];

const GUIDES = [
    {
        slug: 'skillwarz-beginner-guide.html',
        title: 'SkillWarz Beginner Guide',
        description: 'A practical beginner guide to SkillWarz covering game flow, early habits, map awareness, and faster improvement in browser FPS matches.',
        intro: 'This guide is for players who load SkillWarz for the first time and want to understand what actually matters in their first few matches.',
        tags: ['SkillWarz guide', 'Beginner tips', 'Browser FPS'],
        sections: [
            {
                heading: 'Start With Movement Before Aim',
                paragraphs: [
                    'SkillWarz rewards players who stay mobile. New players often focus only on the crosshair, but early improvement usually comes from learning how to reposition after every fight.',
                    'Treat movement as part of offense and defense. If you can slide, strafe, and break line of sight after a shot, you will survive longer even before your aim becomes consistent.',
                ],
                bullets: [
                    'Move between cover instead of standing still to trade shots.',
                    'Use short bursts of aggression, then reset your angle.',
                    'Learn one map route at a time rather than trying to memorize every lane at once.',
                ],
            },
            {
                heading: 'Pick One Reliable Goal Per Match',
                paragraphs: [
                    'A simple improvement loop works better than trying to fix everything at once. Enter each match with one focus: cleaner peeks, better crosshair placement, or smarter route choices.',
                    'That kind of narrow goal keeps matches productive and gives you something measurable to repeat in the next session.',
                ],
                bullets: [
                    'Track whether you died while sprinting into open space.',
                    'Track whether your crosshair was already near the next angle.',
                    'Track whether you challenged two players at once when you could have split the fight.',
                ],
            },
            {
                heading: 'Use Bots And Lower-Stakes Matches Properly',
                paragraphs: [
                    'Training spaces are best for practicing routes, weapon feel, and muscle memory. They are not a perfect replacement for human opponents, but they are a fast way to build repetition.',
                    'If your first public match feels chaotic, go back to a lower-pressure mode and tighten your habits before you try to speed up.',
                ],
                bullets: [
                    'Warm up aim and movement before queueing into tougher matches.',
                    'Repeat one route several times until it feels automatic.',
                    'Leave training once your movements feel deliberate rather than random.',
                ],
            },
        ],
    },
    {
        slug: 'skillwarz-controls-tips.html',
        title: 'SkillWarz Controls And Movement Tips',
        description: 'Learn the core SkillWarz controls, how each movement input affects fights, and what beginners should practice first.',
        intro: 'Controls matter in SkillWarz because the game becomes much easier once your movement inputs stop competing with each other.',
        tags: ['Controls', 'Movement', 'SkillWarz'],
        sections: [
            {
                heading: 'Build A Clean Control Routine',
                paragraphs: [
                    'The important part is not memorizing every key. The important part is making the basic movement actions feel automatic so your brain can focus on reading the fight.',
                    'If your fingers still feel busy, simplify what you are trying to do. Run one route, jump one corner, and learn one reset pattern before layering in harder mechanics.',
                ],
                bullets: [
                    'Use WASD for movement and keep the mouse only for aim and angle control.',
                    'Practice jump timing separately from combat until it feels natural.',
                    'Use crouch or slide with intention, not as a panic button every fight.',
                ],
            },
            {
                heading: 'Why Crosshair Placement Matters More Than Flicks',
                paragraphs: [
                    'Players often think they need flashy aim to improve. In browser shooters, cleaner pre-aim usually creates more value than emergency flicks.',
                    'If the crosshair is already near the enemy path, you reduce the amount of correction required and win easier trades.',
                ],
                bullets: [
                    'Keep the crosshair near chest or head height while moving.',
                    'Aim at likely exits before an opponent appears.',
                    'Reset your view after every fight instead of swinging wildly into the next angle.',
                ],
            },
            {
                heading: 'Movement Errors That Cost New Players The Most',
                paragraphs: [
                    'Most beginner deaths happen because the player keeps moving into open lanes after information has already turned bad.',
                    'A short retreat, strafe reset, or angle change is often stronger than forcing one more bullet exchange.',
                ],
                bullets: [
                    'Do not reload in the middle of open sightlines.',
                    'Do not chase every weak opponent if the route exposes you to two more angles.',
                    'Break line of sight before switching weapons or resetting position.',
                ],
            },
        ],
    },
    {
        slug: 'best-browser-shooter-modes.html',
        title: 'Best Browser Shooter Modes For Different Players',
        description: 'A practical guide to browser shooter game modes and which ones fit competitive players, casual players, and short play sessions.',
        intro: 'Not every browser shooter mode gives the same kind of fun. Some reward raw mechanics, some reward map knowledge, and some are simply better for a ten-minute break.',
        tags: ['Browser shooters', 'Game modes', 'FPS guide'],
        sections: [
            {
                heading: 'Deathmatch For Mechanical Reps',
                paragraphs: [
                    'Deathmatch and free-for-all modes are great for improving aim, reaction speed, and pace under pressure. They create constant respawns and fast repetitions.',
                    'If you want to sharpen fundamentals, this is usually the most efficient mode to revisit.',
                ],
                bullets: [
                    'Best for warming up before harder matches.',
                    'Best for learning weapon feel quickly.',
                    'Less useful if your goal is team coordination or objective play.',
                ],
            },
            {
                heading: 'Objective Modes For Map Awareness',
                paragraphs: [
                    'Capture, domination, and team-control styles reward route selection and timing more than raw frag chasing.',
                    'These modes often teach better discipline because overextending usually punishes the whole team instead of only your own score.',
                ],
                bullets: [
                    'Great for learning how maps connect.',
                    'Great for practicing when to rotate and when to hold.',
                    'Useful if you want a slower, more readable pace.',
                ],
            },
            {
                heading: 'Survival And Elimination For Decision Making',
                paragraphs: [
                    'Modes with limited lives force cleaner decisions. Every overpeek and bad chase becomes more expensive.',
                    'That pressure makes them useful for players who want to reduce sloppy habits and think more carefully before committing.',
                ],
                bullets: [
                    'Good for players trying to improve discipline.',
                    'Good for learning when not to take a fight.',
                    'Less forgiving for brand-new players who still need reps.',
                ],
            },
        ],
    },
    {
        slug: 'browser-fps-vs-battle-royale-guide.html',
        title: 'Browser FPS Vs Battle Royale: Which Format Fits You?',
        description: 'Compare browser FPS games and battle royale games to find out which pace, skill loop, and session length fits your play style.',
        intro: 'Players often know they want a browser shooter but are not sure whether they want round-based FPS pressure or the longer survival loop of battle royale matches.',
        tags: ['FPS vs Battle Royale', 'Browser guide', 'Shooter discovery'],
        sections: [
            {
                heading: 'Choose FPS If You Want Fast Repetition',
                paragraphs: [
                    'Classic FPS formats are better when you want more fights per minute, easier warm-ups, and cleaner repetition of the same mechanics.',
                    'They let you fail, respawn, and try again quickly, which makes them efficient for improvement and easier for short sessions.',
                ],
                bullets: [
                    'Better for aim practice.',
                    'Better for short play windows.',
                    'Better if you want instant action without long looting phases.',
                ],
            },
            {
                heading: 'Choose Battle Royale If You Like Risk And Tension',
                paragraphs: [
                    'Battle royale sessions create more emotional peaks because every decision can shape the whole run. Positioning, loot timing, and survival routes matter more.',
                    'That makes the mode appealing to players who enjoy suspense and comeback tension more than constant respawn action.',
                ],
                bullets: [
                    'Better for players who enjoy survival pressure.',
                    'Better for larger map movement and positioning choices.',
                    'Better when the journey matters as much as the gunfight itself.',
                ],
            },
            {
                heading: 'Use Both If Your Sessions Change',
                paragraphs: [
                    'A lot of browser shooter players rotate between formats. FPS works well for warm-up or quick breaks, while battle royale scratches the itch for longer, higher-stakes runs.',
                    'If your available time changes during the week, keeping both in your rotation often makes the most sense.',
                ],
                bullets: [
                    'Use FPS when you have 10 to 20 minutes.',
                    'Use battle royale when you want more tension and slower buildup.',
                    'Use both if you want variety without leaving the browser shooter category.',
                ],
            },
        ],
    },
    {
        slug: 'how-to-improve-browser-fps-aim.html',
        title: 'How To Improve Aim In Browser FPS Games',
        description: 'A practical aim guide for browser FPS players covering crosshair placement, cleaner fights, and building useful repetition without overtraining.',
        intro: 'Aim in browser shooters improves fastest when you remove messy habits first and only then worry about speed.',
        tags: ['Aim guide', 'Browser FPS', 'Skill practice'],
        sections: [
            {
                heading: 'Use Crosshair Placement To Make Aim Easier',
                paragraphs: [
                    'A lot of missed shots come from arriving at an angle with the crosshair in the wrong place. The fewer corrections you need to make, the more stable your first shot becomes.',
                    'This matters even more in browser shooters because sessions often move quickly and you do not always get long time-to-kill windows to recover from a bad first look.',
                ],
                bullets: [
                    'Keep the crosshair near the next enemy path instead of the floor.',
                    'Pre-aim likely exits before you swing a corner.',
                    'Reset to a neutral, ready position after every engagement.',
                ],
            },
            {
                heading: 'Train For Control, Not Just Speed',
                paragraphs: [
                    'Raw speed is tempting, but unstable speed creates inconsistent fights. If you can stop the crosshair cleanly and fire without overflicking, you gain more usable aim.',
                    'Think of accuracy as the base layer. Speed grows safely once the stopping point becomes reliable.',
                ],
                bullets: [
                    'Take slightly slower first shots until they land consistently.',
                    'Practice small corrections rather than giant panic flicks.',
                    'Use short warm-ups that end before fatigue ruins your form.',
                ],
            },
            {
                heading: 'Let Better Positioning Help Your Aim',
                paragraphs: [
                    'Aim looks better when the fight is easier. Cleaner positioning reduces the number of angles you must watch and gives you more predictable peeks.',
                    'That is why strong FPS players often seem accurate before they seem flashy: they create simpler fights for themselves.',
                ],
                bullets: [
                    'Avoid wide swings into multiple enemies at once.',
                    'Peek from cover so you can break line of sight immediately after a shot.',
                    'Choose lanes where your next opponent is easier to read.',
                ],
            },
        ],
    },
    {
        slug: 'best-browser-sniper-games-guide.html',
        title: 'Best Browser Sniper Games: What Makes Them Fun?',
        description: 'Learn what separates good browser sniper games from forgettable ones, including pacing, sightline design, and how much patience each game rewards.',
        intro: 'Sniper games feel good when their pacing, sightlines, and target pressure all work together.',
        tags: ['Sniper guide', 'Browser games', 'Game discovery'],
        sections: [
            {
                heading: 'Good Sniper Games Reward Patience',
                paragraphs: [
                    'The strongest browser sniper games do not only ask whether you can click quickly. They ask whether you can wait for the right angle, choose the cleaner shot, and avoid forcing low-percentage fights.',
                    'That patience is what separates satisfying tension from random target clicking.',
                ],
                bullets: [
                    'Look for games that give space to hold lines and read movement.',
                    'Look for games where visibility matters as much as raw reflex.',
                    'Be careful with sniper pages that look tense but actually play like arcade rush shooters.',
                ],
            },
            {
                heading: 'Sightline Design Matters More Than Weapon Labels',
                paragraphs: [
                    'A game can call itself a sniper game and still fail if maps do not create meaningful lines of fire.',
                    'Good sightline design gives players tradeoffs: safer long angles, risky reposition routes, and moments where patience pays off.',
                ],
                bullets: [
                    'Balanced maps offer both exposed power angles and flank routes.',
                    'Targets should be readable enough to reward tracking and timing.',
                    'The best browser sniper sessions make every missed shot feel instructive rather than random.',
                ],
            },
            {
                heading: 'Who Usually Enjoys Browser Sniper Pages',
                paragraphs: [
                    'Sniper-focused browser players are often less interested in nonstop chaos and more interested in clarity. They want a match pace that allows prediction, timing, and line control.',
                    'If that sounds like you, sniper categories are often a better starting point than general FPS pages.',
                ],
                bullets: [
                    'Best for players who enjoy patience and precision.',
                    'Best for players who want fewer but more meaningful engagements.',
                    'Best for players who like map knowledge as much as aim.',
                ],
            },
        ],
    },
    {
        slug: 'battle-royale-beginner-mistakes.html',
        title: 'Battle Royale Beginner Mistakes In Browser Games',
        description: 'A quick guide to the most common browser battle royale mistakes, from bad rotations to late looting and low-value fights.',
        intro: 'Battle royale mistakes usually happen long before the final duel. Many losses begin with route decisions, greed, or low-value fights.',
        tags: ['Battle royale', 'Beginner mistakes', 'Browser guide'],
        sections: [
            {
                heading: 'Do Not Treat Every Fight As Mandatory',
                paragraphs: [
                    'New battle royale players often assume every enemy sighting is a required fight. In reality, some encounters cost too much and give too little back.',
                    'If a fight breaks your position, leaves you exposed, or slows your route too much, skipping it can be the stronger decision.',
                ],
                bullets: [
                    'Fight when the angle is favorable or the reward is meaningful.',
                    'Avoid long chases that drag you through open ground.',
                    'Remember that surviving in a better position often creates the next easier fight.',
                ],
            },
            {
                heading: 'Loot Faster And Move Earlier',
                paragraphs: [
                    'Over-looting is one of the most common early mistakes. The extra seconds feel harmless until they force a rushed rotation later.',
                    'A clean, modest loadout in a better position often beats perfect loot collected too slowly.',
                ],
                bullets: [
                    'Decide quickly what counts as enough gear.',
                    'Leave zones earlier if your route options are limited.',
                    'Treat safe movement as part of your resource management.',
                ],
            },
            {
                heading: 'Position Wins Fights Before Bullets Do',
                paragraphs: [
                    'When endgames become smaller, information and terrain matter more. Players in cleaner spots take easier duels, see threats sooner, and escape more often.',
                    'That is why good battle royale improvement often looks less flashy than pure shooter improvement.',
                ],
                bullets: [
                    'Move toward positions with cover and multiple exits.',
                    'Avoid cliffs or hard edges that trap your route options.',
                    'Think about the next circle before the current fight ends.',
                ],
            },
        ],
    },
    {
        slug: 'how-to-choose-browser-shooter.html',
        title: 'How To Choose The Right Browser Shooter For You',
        description: 'Use this SkillWarz guide to decide whether you should start with FPS, sniper, battle royale, or lighter browser action pages.',
        intro: 'A browser shooter feels better when it matches the amount of time, focus, and pressure you actually want from the session.',
        tags: ['Shooter guide', 'Player fit', 'Browser discovery'],
        sections: [
            {
                heading: 'Start With Session Length',
                paragraphs: [
                    'If you only have a short break, faster-respawn FPS pages usually make more sense than slower survival formats.',
                    'If you have more time and want rising tension, battle royale or elimination-style pages often fit better.',
                ],
                bullets: [
                    'Choose FPS for short, repeatable sessions.',
                    'Choose battle royale for longer, higher-stakes runs.',
                    'Choose sniper if you want a calmer pace with more deliberate shots.',
                ],
            },
            {
                heading: 'Match The Pace To Your Mood',
                paragraphs: [
                    'Some players want nonstop action. Others want fewer but more meaningful engagements. Picking the wrong pace makes a decent game feel wrong for the moment.',
                    'That is why category navigation matters: it helps align expectation with what the session actually delivers.',
                ],
                bullets: [
                    'Fast mood: start with FPS or direct shooter pages.',
                    'Measured mood: start with sniper pages.',
                    'Suspense mood: start with battle royale pages.',
                ],
            },
            {
                heading: 'Use Support Pages As Filters',
                paragraphs: [
                    'Not every page in the site catalog is treated as a flagship page. Some remain support pages while stronger editorial coverage is concentrated on core shooter titles.',
                    'That distinction is useful because it helps you spend time on the pages most aligned with the main focus of the site.',
                ],
                bullets: [
                    'Flagship pages are the best place to start if you want stronger genre fit.',
                    'Support pages still exist for catalog completeness but may stay noindex while coverage grows.',
                    'Guides help you choose faster when you are not sure where to begin.',
                ],
            },
        ],
    },
];

const INDEXABLE_GAME_PATHS = new Set([
    'Action/Revoxel_3D_-_Voxel_RPG_Shooter.html',
    'BattleRoyale/Doge_s_Battle_Royale.html',
    'BattleRoyale/Battle_Royale_Noob_vs_Pro.html',
    'BattleRoyale/Top_Guns_IO.html',
    'BattleRoyale/Cube_Battle_Royale.html',
    'BattleRoyale/Pixel_Battle_Royale.html',
    'FPS/Hazmob_FPS.html',
    'FPS/Command_Strike_FPS.html',
    'FPS/Crab_Guards.html',
    'FPS/Dragon_Slayer_FPS.html',
    'FPS/Real_Shooting_Fps_Strike.html',
    'FPS/FPS_Toy_Realism.html',
    'FPS/Alien_Infestation_FPS.html',
    'Sniper/Aliens_Hunter.html',
    'Sniper/Block_Sniper.html',
    'Sniper/Counter_Craft_Sniper.html',
    'Sniper/Gun_Shooting_Games_Sniper_3D.html',
    'Sniper/Mafia_Sniper_Crime_Shooting.html',
]);

const EXTRA_GAMES = [
    {
        id: 'Gang War - Strike Shooter',
        name: 'Gang War - Strike Shooter',
        imageUrl: 'img/icon/Multiplayer/GangWarStrikeShooter.jpg',
        gameType: 'Multiplayer',
        tags: ['gang war', 'shooter', 'multiplayer', 'arcade'],
        iframeUrl: 'https://html5.gamedistribution.com/a7c3e9f1b5d8f2a6c4e1b8d3f7a9c2e/?gd_sdk_referrer_url=https%3A%2F%2Fwww.onlinegames.io%2Fcat-runner%2F',
        link: 'Multiplayer/Gang_War_-_Strike_Shooter.html',
        category: 'Multiplayer',
        categorySlug: 'multiplayer',
        categoryLabel: 'Multiplayer Games',
        categoryIntro: 'Multiplayer pages collect browser titles that make sense for short social sessions and instant replays.',
        indexable: false,
    },
];

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function ensureDir(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
}

function readVarArray(filePath, varName) {
    const code = fs.readFileSync(path.join(ROOT, filePath), 'utf8');
    const sandbox = {};
    vm.createContext(sandbox);
    vm.runInContext(code, sandbox);
    return sandbox[varName] || [];
}

function fullUrl(relativePath) {
    if (!relativePath) {
        return `${SITE.url}/`;
    }
    return `${SITE.url}/${relativePath.replace(/\\/g, '/')}`;
}

function analyticsSnippet() {
    return `<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=${SITE.analyticsId}"></script>
<script>
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${SITE.analyticsId}');
</script>`;
}

function standardHead({
    title,
    description,
    canonical,
    ogTitle,
    ogDescription,
    ogImage,
    robots = 'index, follow, max-image-preview:large',
    relativePrefix = '',
}) {
    const image = ogImage ? fullUrl(`${relativePrefix ? '' : ''}${ogImage}`.replace(/^\.\//, '')) : fullUrl('img/skillwarz.avif');
    return `    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}">
    <meta name="robots" content="${escapeHtml(robots)}">
    <meta name="author" content="${escapeHtml(SITE.author)}">
    <link rel="canonical" href="${escapeHtml(canonical)}">
    <meta property="og:title" content="${escapeHtml(ogTitle || title)}">
    <meta property="og:description" content="${escapeHtml(ogDescription || description)}">
    <meta property="og:type" content="website">
    <meta property="og:url" content="${escapeHtml(canonical)}">
    <meta property="og:image" content="${escapeHtml(image)}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${escapeHtml(ogTitle || title)}">
    <meta name="twitter:description" content="${escapeHtml(ogDescription || description)}">
    <meta name="twitter:image" content="${escapeHtml(image)}">
    <meta name="google-adsense-account" content="${escapeHtml(SITE.adsensePublisher)}">
    <link rel="icon" type="image/svg+xml" href="${relativePrefix}favicon.svg">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="${relativePrefix}css/css.css">
    <link rel="stylesheet" href="${relativePrefix}css/content.css">
${analyticsSnippet()}`;
}

function buildHeader(relativePrefix, activeKey = '') {
    const navItems = [
        { key: 'home', href: `${relativePrefix}index.html`, label: 'Home' },
        { key: 'guides', href: `${relativePrefix}skillwarz-beginner-guide.html`, label: 'Guides' },
        { key: 'fps', href: `${relativePrefix}categories.html#fps`, label: 'FPS' },
        { key: 'battle-royale', href: `${relativePrefix}categories.html#battle-royale`, label: 'Battle Royale' },
        { key: 'sniper', href: `${relativePrefix}categories.html#sniper`, label: 'Sniper' },
        { key: 'multiplayer', href: `${relativePrefix}categories.html#multiplayer`, label: 'Multiplayer' },
    ];
    const nav = navItems.map((item) => {
        const active = item.key === activeKey ? ' nav-item active' : ' nav-item';
        return `<a href="${item.href}" class="${active.trim()}">${escapeHtml(item.label)}</a>`;
    }).join('\n            ');

    return `<header class="header">
        <a href="${relativePrefix}index.html" class="logo">
            <svg class="logo-icon" viewBox="0 0 50 50" width="45" height="45" aria-hidden="true">
                <defs>
                    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#ff4500;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#ff8c00;stop-opacity:1" />
                    </linearGradient>
                </defs>
                <rect x="10" y="15" width="30" height="20" rx="2" fill="none" stroke="url(#grad1)" stroke-width="3"/>
                <path d="M15 20 L35 20 M15 25 L35 25 M15 30 L35 30" stroke="url(#grad1)" stroke-width="2"/>
                <polygon points="25 10 30 15 20 15" fill="url(#grad1)"/>
            </svg>
            <span class="logo-text">skillwarz</span>
        </a>
        <nav class="nav-categories">
            ${nav}
        </nav>
        <div class="header-tools">
            <a href="${relativePrefix}contact.html" class="header-pill"><i class="fas fa-envelope"></i>Real support contact</a>
            <a href="${relativePrefix}categories.html" class="header-pill secondary"><i class="fas fa-layer-group"></i>Curated browser catalog</a>
        </div>
    </header>`;
}

function buildFooter(relativePrefix) {
    return `<footer class="footer">
        <div class="footer-links">
            <a href="${relativePrefix}about.html">About</a>
            <a href="${relativePrefix}contact.html">Contact</a>
            <a href="${relativePrefix}dmca.html">DMCA</a>
            <a href="${relativePrefix}privacy.html">Privacy Policy</a>
            <a href="${relativePrefix}terms.html">Terms of Service</a>
        </div>
        <div class="footer-copyright">© 2026 SkillWarz - Browser shooter discovery and original guide content.</div>
        <div class="footer-copyright">&copy; 2026 SkillWarz - Browser shooter discovery and original guide content.</div>
        <div class="footer-meta">Editorial contact: <a href="mailto:${SITE.email}">${SITE.email}</a></div>
    </footer>`;
}

function tagList(tags, limit = 4) {
    return (tags || []).slice(0, limit).map((tag) => `<span>${escapeHtml(tag)}</span>`).join('');
}

function gameCategoryBadge(game) {
    return `<span class="catalog-badge"><i class="fas fa-tag"></i>${escapeHtml(game.categoryLabel)}</span>`;
}

function gameSearchStatus(game) {
    return game.indexable
        ? `<span class="meta-badge"><i class="fas fa-compass"></i>Editorial page</span>`
        : `<span class="meta-badge warn"><i class="fas fa-wrench"></i>Support page</span>`;
}

function cleanText(value) {
    return String(value || '').replace(/\s+/g, ' ').trim();
}

function pluralize(count, singular, plural = `${singular}s`) {
    return count === 1 ? singular : plural;
}

function inferPlayStyle(game) {
    const name = game.name.toLowerCase();
    if (name.includes('sniper')) return 'slow-angle precision and patient line-of-sight control';
    if (name.includes('battle royale') || name.includes('royale')) return 'survival pressure, positioning, and endgame decision making';
    if (name.includes('fps') || name.includes('shooter') || name.includes('strike')) return 'fast firefights, direct aim duels, and quick respawn practice';
    if (name.includes('zombie')) return 'wave pressure and short-range weapon upgrades';
    if (name.includes('revoxel')) return 'exploration mixed with shooter progression and a lighter RPG loop';
    return 'easy-to-start browser action with a clear core loop and readable controls';
}

function inferVisualStyle(game) {
    const name = game.name.toLowerCase();
    if (/(pixel|block|craft|cube|mine)/.test(name)) return 'blocky or pixel-style presentation';
    if (/(dragon|alien|nightmare)/.test(name)) return 'theme-heavy combat scenarios with a stronger fantasy or sci-fi feel';
    if (/(army|swat|mercenary|command|strike|sniper|mafia)/.test(name)) return 'a direct combat theme built around weapons, targets, and pressure';
    return 'a lightweight browser presentation that favors quick load times over cinematic complexity';
}

function inferAudience(game) {
    const name = game.name.toLowerCase();
    if (/(sniper|target)/.test(name)) return 'players who prefer precision and measured pacing over constant rushing';
    if (/(battle royale|survival|elimination|royale)/.test(name)) return 'players who enjoy higher-stakes rounds and positioning pressure';
    if (/(fps|shooter|strike|assault|war|attack)/.test(name)) return 'players who want straightforward browser shooting reps and quick match resets';
    return 'visitors who want a fast browser session without a long setup process';
}

function inferSkills(game) {
    const name = game.name.toLowerCase();
    const items = [];
    if (/(sniper|target)/.test(name)) items.push('steady aim and sightline discipline');
    if (/(battle royale|royale|survive)/.test(name)) items.push('positioning and late-round decision making');
    if (/(fps|shooter|strike|assault|war|attack)/.test(name)) items.push('crosshair placement and reaction speed');
    if (/(pixel|block|craft|mine|cube)/.test(name)) items.push('route recognition inside simpler, readable maps');
    if (/(zombie|dragon|alien)/.test(name)) items.push('threat prioritization when multiple targets stack pressure');
    if (items.length === 0) items.push('basic movement, timing, and pattern recognition');
    return items;
}

function inferWarnings(game) {
    const notes = [];
    if (!game.indexable) {
        notes.push('This page remains a supporting catalog page while we expand original editorial coverage.');
    }
    if (game.category === 'Action' || game.category === 'Multiplayer') {
        notes.push('The game is adjacent to the main shooter focus of the site, so the page is treated as supporting content rather than a flagship review.');
    }
    notes.push('Playable browser embeds may be provided by a third-party distribution partner when available.');
    return notes;
}

function buildGameSummary(game) {
    const style = inferPlayStyle(game);
    const visual = inferVisualStyle(game);
    const audience = inferAudience(game);
    return [
        `${game.name} is cataloged on SkillWarz as a browser game built around ${style}.`,
        `The page is written for visitors who want a quick read before launching a session, especially when deciding whether the game fits ${audience}.`,
        `Compared with heavier native downloads, this title leans on ${visual}, which usually means faster access and lower setup friction.`,
    ];
}

function buildGameExpectations(game) {
    const categoryNote = {
        'FPS': 'Most FPS visitors care about weapon feel, route clarity, and how quickly they can reset after a mistake.',
        'Sniper': 'Most sniper visitors care about patience, visibility, and whether the pace leaves room for deliberate shots.',
        'BattleRoyale': 'Battle royale visitors usually care about survival rhythm, map movement, and the tension of longer rounds.',
        'Multiplayer': 'Multiplayer visitors usually care about how quickly the game becomes social or competitive without a long onboarding step.',
        'Action': 'Action visitors usually care about immediate readability and whether the game loop becomes fun within the first few minutes.',
    }[game.category] || 'Browser players usually care about low-friction sessions and easy-to-read mechanics.';

    return [
        categoryNote,
        `For ${game.name}, the main question is whether the first session communicates its loop clearly enough to keep you in the game after the opening minute.`,
    ];
}

function buildGameBullets(game) {
    const skills = inferSkills(game);
    return [
        `Core feel: ${inferPlayStyle(game)}.`,
        `Visual direction: ${inferVisualStyle(game)}.`,
        `Best fit: ${inferAudience(game)}.`,
        `Primary improvement area: ${skills.join(', ')}.`,
    ];
}

function buildCatalogCard(game, relativePrefix) {
    const href = `${relativePrefix}${game.link}`;
    return `<article class="catalog-card">
        <img src="${relativePrefix}${game.imageUrl}" alt="${escapeHtml(game.name)}" loading="lazy">
        <div class="catalog-card-body">
            <div class="catalog-card-top">
                <h3>${escapeHtml(game.name)}</h3>
                ${gameSearchStatus(game)}
            </div>
            ${gameCategoryBadge(game)}
            <p>${escapeHtml(game.cardDescription)}</p>
            <div class="catalog-tags">${tagList(game.tags, 4)}</div>
            <a class="catalog-link" href="${href}">Open page</a>
        </div>
    </article>`;
}

function buildRelatedCard(game, relativePrefix) {
    return `<a class="related-card" href="${relativePrefix}${game.link}">
        <img src="${relativePrefix}${game.imageUrl}" alt="${escapeHtml(game.name)}" loading="lazy">
        <span>${escapeHtml(game.name)}</span>
    </a>`;
}

function buildGuideCard(guide) {
    return `<article class="guide-card">
        <h3><a href="${guide.slug}">${escapeHtml(guide.title)}</a></h3>
        <p>${escapeHtml(guide.description)}</p>
    </article>`;
}

function buildDeferredPlayShell({
    shellId,
    iframeUrl,
    title,
    imageUrl,
    imageAlt,
    heading,
    description,
    buttonLabel,
    disclosure,
    relativePrefix = '',
    secondaryHref = '',
    secondaryLabel = '',
}) {
    const secondaryLink = secondaryHref && secondaryLabel
        ? `<a class="button-link secondary" href="${secondaryHref}">${escapeHtml(secondaryLabel)}</a>`
        : '';

    return `<div class="game-showcase deferred-play-shell">
        <div class="game-frame play-frame-shell" id="${shellId}">
            <div class="play-placeholder">
                <img src="${relativePrefix}${escapeHtml(imageUrl)}" class="play-placeholder-thumb" alt="${escapeHtml(imageAlt)}" loading="lazy">
                <div class="play-placeholder-copy">
                    <span class="play-kicker">User-initiated browser session</span>
                    <h3>${escapeHtml(heading)}</h3>
                    <p>${escapeHtml(description)}</p>
                    <div class="button-row">
                        <button
                            class="button-link play-trigger"
                            type="button"
                            data-play-target="${shellId}"
                            data-iframe-url="${escapeHtml(iframeUrl)}"
                            data-iframe-title="${escapeHtml(title)}"
                            data-expand-target="${shellId}-expand"
                        ><i class="fas fa-play"></i>${escapeHtml(buttonLabel)}</button>
                        ${secondaryLink}
                    </div>
                    <div class="play-status">The playable frame loads only after the visitor chooses to open it.</div>
                </div>
            </div>
        </div>
        <div class="game-controls">
            <div class="game-title-section">
                <img src="${relativePrefix}${escapeHtml(imageUrl)}" class="game-icon" alt="${escapeHtml(imageAlt)}">
                <span class="game-title">${escapeHtml(title)}</span>
            </div>
            <div class="game-actions">
                <button
                    class="game-action-button"
                    type="button"
                    id="${shellId}-expand"
                    data-fullscreen-target="${shellId}"
                    hidden
                    aria-hidden="true"
                ><i class="fas fa-expand"></i><span>Fullscreen</span></button>
            </div>
        </div>
        <div class="embed-note">${escapeHtml(disclosure)}</div>
    </div>`;
}

function buildPlayActivationScript() {
    return `<script>
(function () {
    function loadPlayableFrame(trigger) {
        const targetId = trigger.getAttribute('data-play-target');
        const shell = document.getElementById(targetId);
        if (!targetId || !shell || shell.dataset.loaded === 'true') {
            return;
        }

        const iframe = document.createElement('iframe');
        iframe.src = trigger.getAttribute('data-iframe-url');
        iframe.title = trigger.getAttribute('data-iframe-title');
        iframe.loading = 'lazy';
        iframe.setAttribute('allowfullscreen', '');

        shell.innerHTML = '';
        shell.appendChild(iframe);
        shell.dataset.loaded = 'true';

        trigger.disabled = true;
        trigger.classList.add('is-loaded');
        trigger.innerHTML = '<i class="fas fa-check"></i>Browser session loaded';

        const expandButton = document.getElementById(trigger.getAttribute('data-expand-target'));
        if (expandButton) {
            expandButton.hidden = false;
            expandButton.removeAttribute('aria-hidden');
        }
    }

    document.addEventListener('click', function (event) {
        const loadTrigger = event.target.closest('[data-play-target]');
        if (loadTrigger) {
            loadPlayableFrame(loadTrigger);
            return;
        }

        const fullscreenTrigger = event.target.closest('[data-fullscreen-target]');
        if (!fullscreenTrigger) {
            return;
        }

        const shell = document.getElementById(fullscreenTrigger.getAttribute('data-fullscreen-target'));
        const iframe = shell && shell.querySelector('iframe');
        if (!iframe || !iframe.requestFullscreen) {
            return;
        }

        iframe.requestFullscreen();
    });
}());
</script>`;
}

function buildPageLayout({
    head,
    bodyClass = '',
    header,
    mainClass = 'main-container',
    mainContent,
    footer,
    extraScripts = '',
}) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
${head}
</head>
<body class="${bodyClass}">
    ${header}
    <main class="${mainClass}">
${mainContent}
    </main>
    ${footer}
    ${extraScripts}
</body>
</html>`;
}

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function slugFromName(name) {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

function shouldIndexGame(game) {
    return INDEXABLE_GAME_PATHS.has(game.link);
}

function buildDatasets() {
    const allGames = [];

    for (const dataset of DATASETS) {
        const items = readVarArray(dataset.file, dataset.varName);
        for (const item of items) {
            const game = {
                ...item,
                category: dataset.dir,
                categorySlug: dataset.slug,
                categoryLabel: dataset.label,
                categoryIntro: dataset.intro,
                indexable: false,
            };
            game.indexable = shouldIndexGame(game);
            game.cardDescription = buildGameSummary(game)[0];
            allGames.push(game);
        }
    }

    for (const game of EXTRA_GAMES) {
        game.indexable = shouldIndexGame(game);
        game.cardDescription = buildGameSummary(game)[0];
        allGames.push(game);
    }

    return allGames;
}

function buildHomePage(homeGame, featuredGames) {
    const stats = [
        { title: 'Core focus', text: 'Browser shooters, sniper games, battle royale picks, and quick-start editorial notes.' },
        { title: 'Why this version matters', text: 'Pages are being rebuilt around original summaries, cleaner navigation, and clearer session-fit guidance.' },
        { title: 'Support contact', text: SITE.email },
    ];

    const statCards = stats.map((item) => `<div class="stat-card"><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.text)}</p></div>`).join('');
    const guideCards = GUIDES.map(buildGuideCard).join('');
    const featuredCards = featuredGames.slice(0, 8).map((game) => buildCatalogCard(game, '')).join('');
    const homePlayShell = buildDeferredPlayShell({
        shellId: 'home-play-shell',
        iframeUrl: homeGame.iframeUrl,
        title: 'SkillWarz browser session',
        imageUrl: homeGame.imageUrl,
        imageAlt: 'SkillWarz icon',
        heading: 'Load the playable browser session only when you are ready',
        description: 'This keeps the homepage focused on original guidance first while still letting visitors launch the browser build on demand.',
        buttonLabel: 'Load playable browser session',
        disclosure: 'Playable browser sessions may be delivered through a third-party distribution partner when available. The editorial text on this site is written independently to help visitors understand controls, genre fit, and session style before they play.',
        secondaryHref: 'skillwarz-beginner-guide.html',
        secondaryLabel: 'Read the beginner guide first',
    });

    const head = standardHead({
        title: 'SkillWarz - Browser Shooter Guides, Reviews, and Curated Play Pages',
        description: 'SkillWarz is a browser shooter discovery site with original SkillWarz guides, curated FPS picks, battle royale recommendations, and editorial game pages.',
        canonical: `${SITE.url}/`,
        ogTitle: 'SkillWarz - Browser Shooter Guides and Curated Game Pages',
        ogDescription: 'Read original SkillWarz guides, compare curated shooter pages, and load browser sessions only when you are ready to play.',
        ogImage: 'img/skillwarz.avif',
    });

    const mainContent = `        <div class="main-content">
            <div class="content-section">
                <div class="game-info page-copy">
                    <h1>SkillWarz Browser Guide And Shooter Discovery Hub</h1>
                    <div class="info-header">SkillWarz now focuses on editorial summaries, browser shooter discovery, and clearer category pages instead of thin template content.</div>
                    <div class="hero-grid">
                        <section class="callout-card hero-card hero-card-primary">
                            <p class="lead-copy">The goal of this site is simple: help players understand what they are about to click, which games fit their mood, and why SkillWarz itself stands out as a browser FPS worth learning.</p>
                            <div class="button-row">
                                <a class="button-link" href="skillwarz-beginner-guide.html"><i class="fas fa-book-open"></i>Start with the beginner guide</a>
                                <a class="button-link secondary" href="categories.html"><i class="fas fa-layer-group"></i>Browse all categories</a>
                            </div>
                            <div class="stat-grid">
                                ${statCards}
                            </div>
                        </section>
                        <aside class="callout-card hero-card hero-card-secondary">
                            <h2>What reviewers should see first</h2>
                            <p>SkillWarz now leads with original guidance, a tighter shooter-only review path, and clear trust signals before any playable frame is loaded.</p>
                            <ul class="mini-list">
                                <li>Original guides and comparison articles sit above the play trigger.</li>
                                <li>Only stronger shooter pages are surfaced as flagship editorial pages.</li>
                                <li>Support pages remain noindex while coverage is expanded and refined.</li>
                            </ul>
                        </aside>
                    </div>

                    <div class="section-stack">
                        <section class="section-block">
                            <h2>What SkillWarz Is</h2>
                            <p>SkillWarz is best approached as a movement-driven browser FPS. It rewards players who keep their routes clean, learn how to reset angles after a fight, and treat map movement as part of combat instead of something separate from it.</p>
                            <p>The game becomes more enjoyable once the player stops trying to win every duel with panic aim alone. Better routing, earlier crosshair placement, and simple movement discipline create faster improvement than flashy mechanics.</p>
                            <div class="page-anchor-links">
                                <a href="skillwarz-controls-tips.html">Controls and movement tips</a>
                                <a href="best-browser-shooter-modes.html">Shooter mode guide</a>
                                <a href="browser-fps-vs-battle-royale-guide.html">FPS vs battle royale guide</a>
                            </div>
                        </section>

                        <section class="section-block">
                            <h2>Why This Site Exists</h2>
                            <p>Many browser game pages on the web send visitors straight into an embed with almost no context. SkillWarz is being rebuilt so that each important page explains the genre, the expected pace, the player fit, and the reason the game may or may not be worth your time.</p>
                            <ul class="mini-list">
                                <li>Original quick-take copy instead of generic one-line descriptions.</li>
                                <li>Cleaner categories for FPS, sniper, and battle royale players.</li>
                                <li>Support pages with real contact details and updated policy information.</li>
                            </ul>
                        </section>

                        <section class="section-block">
                            <h2>Playable Browser Session</h2>
                            <p>Visitors can still launch SkillWarz from this homepage, but the browser frame is loaded only after they actively request it. That keeps the page centered on original guidance first and playable access second.</p>
                            ${homePlayShell}
                        </section>

                        <section class="section-block">
                            <h2>Featured Guides</h2>
                            <div class="guide-grid">
                                ${guideCards}
                            </div>
                        </section>

                        <section class="section-block">
                            <h2>Featured Browser Shooter Pages</h2>
                            <p>These are the pages we are treating as stronger editorial coverage, with tighter category fit and better alignment with the core browser shooter theme of the site.</p>
                            <div class="catalog-grid">
                                ${featuredCards}
                            </div>
                        </section>

                        <section class="section-block">
                            <h2>Before You Play</h2>
                            <div class="info-grid">
                                <div class="info-card">
                                    <h3>Start with readable goals</h3>
                                    <p>Pick one habit to improve per session: movement resets, aim discipline, or route choice.</p>
                                </div>
                                <div class="info-card">
                                    <h3>Do not overvalue flicks</h3>
                                    <p>Crosshair placement and cleaner peeks usually create more wins than flashy emergency aim.</p>
                                </div>
                                <div class="info-card">
                                    <h3>Use category pages smartly</h3>
                                    <p>If you want fast action, start with FPS. If you want patience and pressure, start with sniper or battle royale pages.</p>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>`;

    return buildPageLayout({
        head,
        header: buildHeader('', 'home'),
        mainContent,
        footer: buildFooter(''),
        extraScripts: buildPlayActivationScript(),
    });
}

function buildCategoryPage(allGames) {
    const grouped = DATASETS.map((dataset) => ({
        ...dataset,
        games: allGames.filter((game) => game.category === dataset.dir),
    })).map((group) => ({
        ...group,
        featuredGames: group.games.filter((game) => game.indexable),
        supportGames: group.games.filter((game) => !game.indexable),
    }));

    const jumpCards = grouped.map((group) => `<article class="jump-card">
        <h3><a href="#${group.slug}">${escapeHtml(group.label)}</a></h3>
        <p>${group.featuredGames.length} featured ${pluralize(group.featuredGames.length, 'page')} and ${group.supportGames.length} support ${pluralize(group.supportGames.length, 'page')}.</p>
    </article>`).join('');

    const sections = grouped.map((group) => {
        const cards = group.featuredGames.map((game) => buildCatalogCard(game, '')).join('');
        const supportNote = group.supportGames.length
            ? `<div class="support-note">
                ${group.supportGames.length} additional support ${pluralize(group.supportGames.length, 'page')} exist in this category, but they remain noindex and off the main review path until deeper original coverage is ready.
            </div>`
            : '';
        const sectionBody = cards
            ? `<div class="catalog-grid">
                ${cards}
            </div>`
            : `<div class="site-note">
                <p>No flagship editorial page is being surfaced in this category yet. Support entries remain de-emphasized until stronger original writeups are ready.</p>
            </div>`;

        return `<section class="catalog-section" id="${group.slug}">
            <div class="catalog-section-header">
                <div>
                    <h2>${escapeHtml(group.label)}</h2>
                    <p>${escapeHtml(group.intro)}</p>
                </div>
                <span class="catalog-badge"><i class="fas fa-gamepad"></i>${group.featuredGames.length} editorial ${pluralize(group.featuredGames.length, 'page')}</span>
            </div>
            ${supportNote}
            ${sectionBody}
        </section>`;
    }).join('\n');

    const head = standardHead({
        title: 'Game Categories - SkillWarz',
        description: 'Browse SkillWarz categories for browser FPS, sniper, battle royale, action, and multiplayer games with cleaner descriptions and category context.',
        canonical: fullUrl('categories.html'),
        ogTitle: 'SkillWarz Categories',
        ogDescription: 'Explore curated browser game categories with stronger shooter focus, real counts, and original editorial summaries.',
        ogImage: 'img/skillwarz.avif',
    });

    const mainContent = `        <div class="main-content">
            <div class="content-section">
                <div class="game-info page-copy">
                    <div class="page-breadcrumb"><a href="index.html">Home</a><span>/</span><span>Categories</span></div>
                    <h1>SkillWarz Categories</h1>
                    <div class="info-header">Every category page on SkillWarz is being rebuilt around cleaner genre fit, actual page counts, and stronger editorial summaries.</div>
                    <p class="lead-copy">This catalog now highlights the strongest shooter-aligned editorial pages first. Support entries still exist in the broader site inventory, but they stay noindex and off the main review path while original coverage expands.</p>
                    <div class="catalog-note">You will no longer see inflated counts, random ratings, or fake play totals here. Category sections now prioritize flagship pages and reduce the visibility of weaker support entries.</div>

                    <div class="category-jump-grid">
                        ${jumpCards}
                    </div>

                    ${sections}
                </div>
            </div>
        </div>`;

    return buildPageLayout({
        head,
        header: buildHeader('', ''),
        mainContent,
        footer: buildFooter(''),
    });
}

function buildGuidePage(guide) {
    const head = standardHead({
        title: `${guide.title} | SkillWarz`,
        description: guide.description,
        canonical: fullUrl(guide.slug),
        ogTitle: `${guide.title} | SkillWarz`,
        ogDescription: guide.description,
        ogImage: 'img/skillwarz.avif',
    });

    const sectionHtml = guide.sections.map((section) => {
        const paragraphs = section.paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join('\n');
        const bullets = section.bullets && section.bullets.length
            ? `<ul>${section.bullets.map((bullet) => `<li>${escapeHtml(bullet)}</li>`).join('')}</ul>`
            : '';
        return `<section class="section-block">
            <h2>${escapeHtml(section.heading)}</h2>
            ${paragraphs}
            ${bullets}
        </section>`;
    }).join('\n');

    const tagHtml = guide.tags.map((tag) => `<span class="guide-tag">${escapeHtml(tag)}</span>`).join('');

    const mainContent = `        <div class="main-content article-shell">
            <div class="content-section">
                <div class="game-info guide-copy">
                    <div class="page-breadcrumb"><a href="index.html">Home</a><span>/</span><a href="skillwarz-beginner-guide.html">Guides</a><span>/</span><span>${escapeHtml(guide.title)}</span></div>
                    <h1>${escapeHtml(guide.title)}</h1>
                    <div class="info-header">Original SkillWarz guide content for browser shooter players who want clearer habits, better routing, and faster improvement.</div>
                    <p class="lead-copy">${escapeHtml(guide.intro)}</p>
                    <div class="guide-meta">
                        ${tagHtml}
                        <span class="guide-tag">Updated ${SITE.dateLabel}</span>
                    </div>
                    <div class="button-row">
                        <a class="button-link" href="categories.html">Browse categories</a>
                        <a class="button-link secondary" href="index.html">Return to homepage</a>
                    </div>
                    <div class="section-stack" style="margin-top:24px;">
                        ${sectionHtml}
                    </div>
                </div>
            </div>
        </div>`;

    return buildPageLayout({
        head,
        header: buildHeader('', 'guides'),
        mainContent,
        footer: buildFooter(''),
    });
}

function buildGamePage(game, allGames) {
    const relativePrefix = '../';
    const canonical = fullUrl(game.link);
    const summary = buildGameSummary(game);
    const expectations = buildGameExpectations(game);
    const bullets = buildGameBullets(game);
    const warnings = inferWarnings(game);
    const guideByCategory = {
        'FPS': { href: `${relativePrefix}how-to-improve-browser-fps-aim.html`, label: 'Read the FPS aim guide' },
        'Sniper': { href: `${relativePrefix}best-browser-sniper-games-guide.html`, label: 'Read the sniper guide' },
        'BattleRoyale': { href: `${relativePrefix}battle-royale-beginner-mistakes.html`, label: 'Read the battle royale guide' },
        'Action': { href: `${relativePrefix}how-to-choose-browser-shooter.html`, label: 'Use the game choice guide' },
        'Multiplayer': { href: `${relativePrefix}best-browser-shooter-modes.html`, label: 'Compare browser shooter modes' },
    }[game.category] || { href: `${relativePrefix}skillwarz-beginner-guide.html`, label: 'Read the beginner guide' };
    const relatedGames = allGames
        .filter((candidate) => candidate.link !== game.link && candidate.category === game.category)
        .sort((left, right) => Number(right.indexable) - Number(left.indexable) || left.name.localeCompare(right.name))
        .slice(0, 6);
    const playShell = buildDeferredPlayShell({
        shellId: `${slugFromName(game.name)}-play-shell`,
        iframeUrl: game.iframeUrl,
        title: `${game.name} browser session`,
        imageUrl: game.imageUrl,
        imageAlt: `${game.name} icon`,
        heading: `Load ${game.name} only after you have read the quick take`,
        description: 'This page keeps the original summary and player-fit notes visible first, then lets the visitor choose whether to open the playable browser frame.',
        buttonLabel: `Load ${game.name}`,
        disclosure: 'The playable frame above may be supplied by a third-party browser distribution partner. SkillWarz uses this page to add context, original summary text, and cleaner navigation around the title.',
        relativePrefix,
        secondaryHref: guideByCategory.href,
        secondaryLabel: guideByCategory.label,
    });

    const relatedHtml = relatedGames.map((candidate) => buildRelatedCard(candidate, relativePrefix)).join('');
    const head = standardHead({
        title: `${game.name} - Browser Guide And Play Page | SkillWarz`,
        description: `Read the SkillWarz quick guide for ${game.name}, understand the core loop, and load the browser version when available.`,
        canonical,
        ogTitle: `${game.name} | SkillWarz`,
        ogDescription: `A curated SkillWarz page for ${game.name} with original summary text, on-demand browser play, and category context.`,
        ogImage: game.imageUrl,
        robots: game.indexable ? 'index, follow, max-image-preview:large' : 'noindex, follow',
        relativePrefix,
    });

    const summaryCards = bullets.map((bullet) => `<div class="summary-card"><p>${escapeHtml(bullet)}</p></div>`).join('');
    const warningList = warnings.map((warning) => `<li>${escapeHtml(warning)}</li>`).join('');

    const mainContent = `        <div class="main-content">
            <div class="content-section">
                <div class="game-info page-copy">
                    <div class="page-breadcrumb">
                        <a href="${relativePrefix}index.html">Home</a>
                        <span>/</span>
                        <a href="${relativePrefix}categories.html#${game.categorySlug}">${escapeHtml(game.categoryLabel)}</a>
                        <span>/</span>
                        <span>${escapeHtml(game.name)}</span>
                    </div>

                    <h1>${escapeHtml(game.name)}</h1>
                    <div class="info-header">This SkillWarz page combines playable access with an original quick-take summary, player-fit notes, and category context.</div>

                    <div class="button-row">
                        <a class="button-link" href="${relativePrefix}categories.html#${game.categorySlug}"><i class="fas fa-layer-group"></i>Back to ${escapeHtml(game.categoryLabel)}</a>
                        <a class="button-link secondary" href="${relativePrefix}contact.html"><i class="fas fa-envelope"></i>Report a page issue</a>
                    </div>

                    <div class="summary-grid">
                        ${summaryCards}
                    </div>

                    <div class="section-stack">
                        <section class="section-block">
                            <h2>Quick Take</h2>
                            ${summary.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join('\n')}
                        </section>

                        <section class="section-block">
                            <h2>What To Expect Before You Click Play</h2>
                            ${expectations.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join('\n')}
                        </section>

                        <section class="section-block">
                            <h2>Playable Browser Frame</h2>
                            <p>The browser frame is loaded only when a visitor chooses to open it, which keeps the editorial summary and player-fit notes visible before any third-party session starts.</p>
                            ${playShell}
                        </section>

                        <section class="section-block">
                            <h2>Why Players Usually Try This Kind Of Page</h2>
                            <ul>
                                ${bullets.map((bullet) => `<li>${escapeHtml(bullet)}</li>`).join('')}
                            </ul>
                        </section>

                        <section class="section-block">
                            <h2>Editorial Notes</h2>
                            <ul>
                                ${warningList}
                            </ul>
                            <div class="content-note">Category tags on SkillWarz are used to help players compare session style, pacing, and likely player fit. They are not claims of game ownership.</div>
                        </section>

                        <section class="section-block">
                            <h2>Related ${escapeHtml(game.categoryLabel)}</h2>
                            <div class="related-grid">
                                ${relatedHtml}
                            </div>
                        </section>
                    </div>

                    <div class="tags">
                        <span class="tag"><i class="fas fa-tag"></i> ${escapeHtml(game.categoryLabel)}</span>
                        ${(game.tags || []).slice(0, 5).map((tag) => `<span class="tag"><i class="fas fa-hashtag"></i> ${escapeHtml(tag)}</span>`).join('')}
                    </div>
                </div>
            </div>
        </div>`;

    return buildPageLayout({
        head,
        header: buildHeader(relativePrefix, game.categorySlug),
        mainContent,
        footer: buildFooter(relativePrefix),
        extraScripts: buildPlayActivationScript(),
    });
}

function writeFile(relativePath, content) {
    const target = path.join(ROOT, relativePath);
    ensureDir(path.dirname(target));
    fs.writeFileSync(target, content, 'utf8');
}

function clearGameDirectories() {
    for (const dataset of DATASETS) {
        const dirPath = path.join(ROOT, dataset.dir);
        if (!fs.existsSync(dirPath)) {
            continue;
        }
        const files = fs.readdirSync(dirPath);
        for (const file of files) {
            const fullPath = path.join(dirPath, file);
            if (file.endsWith('.html') && fs.statSync(fullPath).isFile()) {
                fs.unlinkSync(fullPath);
            }
        }
    }
}

function buildSitemap(indexableGamePaths) {
    const pages = [
        '',
        'categories.html',
        'about.html',
        'contact.html',
        'privacy.html',
        'terms.html',
        'dmca.html',
        ...GUIDES.map((guide) => guide.slug),
        ...indexableGamePaths,
    ];

    const urls = pages.map((page) => {
        const loc = fullUrl(page);
        return `  <url>
    <loc>${escapeHtml(loc)}</loc>
    <lastmod>${SITE.dateIso}</lastmod>
  </url>`;
    }).join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}

function buildRobots() {
    return `User-agent: *
Allow: /

Sitemap: ${SITE.url}/sitemap.xml
`;
}

function buildAdsTxt() {
    return `# SkillWarz ads.txt
google.com, ${SITE.adsensePublisher.replace(/^ca-/, '')}, DIRECT, f08c47fec0942fa0
`;
}

function buildSite() {
    const homeGame = readVarArray('js/game_data/games.js', 'gamesData')[0];
    const allGames = buildDatasets();
    const featuredGames = allGames.filter((game) => game.indexable).slice(0, 12);

    clearGameDirectories();

    writeFile('index.html', buildHomePage(homeGame, featuredGames));
    writeFile('categories.html', buildCategoryPage(allGames));

    for (const guide of GUIDES) {
        writeFile(guide.slug, buildGuidePage(guide));
    }

    const indexableGamePaths = [];
    for (const game of allGames) {
        writeFile(game.link, buildGamePage(game, allGames));
        if (game.indexable) {
            indexableGamePaths.push(game.link);
        }
    }

    writeFile('robots.txt', buildRobots());
    writeFile('sitemap.xml', buildSitemap(indexableGamePaths));
    writeFile('ads.txt', buildAdsTxt());
}

buildSite();
