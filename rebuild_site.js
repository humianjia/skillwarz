const fs = require('fs');
const path = require('path');
const vm = require('vm');

const posix = path.posix;

function lt(en, hi) {
    return { en, hi };
}

const SITE = {
    name: 'SkillWarz',
    url: 'https://www.skillwarz.online',
    email: '422435896@qq.com',
    dateIso: '2026-05-10',
    dateLabel: lt('May 7, 2026', '7 मई 2026'),
    analyticsId: 'G-DNT670B4R3',
    adsensePublisher: 'ca-pub-7534347140708021',
    author: 'SkillWarz Editorial Team',
};

const ROOT = __dirname;

const LOCALES = [
    { code: 'en', lang: 'en', baseDir: '', switchLabel: 'EN', name: 'English' },
    { code: 'hi', lang: 'hi', baseDir: 'hi', switchLabel: 'हिन्दी', name: 'हिन्दी' },
    { code: 'ur', lang: 'ur', baseDir: 'ur', switchLabel: 'اردو', name: 'اردو' },
    { code: 'tr', lang: 'tr', baseDir: 'tr', switchLabel: 'Türkçe', name: 'Türkçe' },
    { code: 'pt-br', lang: 'pt-BR', baseDir: 'pt-br', switchLabel: 'Português', name: 'Português (Brasil)' },
    { code: 'it', lang: 'it', baseDir: 'it', switchLabel: 'Italiano', name: 'Italiano' },
];

const LOCALE_MAP = Object.fromEntries(LOCALES.map((locale) => [locale.code, locale]));

const UI = {
    home: lt('Home', 'होम'),
    guides: lt('Guides', 'गाइड्स'),
    categories: lt('Categories', 'श्रेणियां'),
    fps: lt('FPS', 'FPS'),
    battleRoyale: lt('Battle Royale', 'बैटल रॉयल'),
    sniper: lt('Sniper', 'स्नाइपर'),
    multiplayer: lt('Multiplayer', 'मल्टीप्लेयर'),
    about: lt('About', 'हमारे बारे में'),
    contact: lt('Contact', 'संपर्क'),
    privacyPolicy: lt('Privacy Policy', 'गोपनीयता नीति'),
    termsOfService: lt('Terms of Service', 'सेवा की शर्तें'),
    supportContact: lt('Support contact', 'सपोर्ट संपर्क'),
    curatedCatalog: lt('Browser catalog', 'ब्राउज़र कैटलॉग'),
    language: lt('Language', 'भाषा'),
    editorialPage: lt('Editorial page', 'एडिटोरियल पेज'),
    supportPage: lt('Support page', 'सहायक पेज'),
    openPage: lt('Open page', 'पेज खोलें'),
    fullscreen: lt('Fullscreen', 'फुलस्क्रीन'),
    sessionLoaded: lt('Browser session loaded', 'ब्राउज़र सेशन लोड हो गया'),
    userInitiatedSession: lt('User-initiated browser session', 'उपयोगकर्ता द्वारा शुरू किया गया ब्राउज़र सेशन'),
    browseCategories: lt('Browse categories', 'श्रेणियां देखें'),
    returnHome: lt('Return to homepage', 'होमपेज पर लौटें'),
    updated: lt('Updated', 'अपडेट किया गया'),
    editorialContact: lt('Editorial contact', 'संपादकीय संपर्क'),
    footerCopy: lt(
        'Browser shooter discovery and original guide content.',
        'ब्राउज़र शूटर डिस्कवरी और मौलिक गाइड सामग्री।'
    ),
    reportIssue: lt('Report a page issue', 'पेज समस्या की रिपोर्ट करें'),
    backTo: lt('Back to', 'वापस जाएं'),
    quickTake: lt('Quick Take', 'त्वरित सारांश'),
    beforePlay: lt('What To Expect Before You Click Play', 'प्ले क्लिक करने से पहले क्या उम्मीद करें'),
    playableFrame: lt('Playable Browser Frame', 'खेलने योग्य ब्राउज़र फ्रेम'),
    whyTryPage: lt('Why Players Usually Try This Kind Of Page', 'खिलाड़ी आमतौर पर इस तरह का पेज क्यों खोलते हैं'),
    editorialNotes: lt('Editorial Notes', 'संपादकीय नोट्स'),
    related: lt('Related', 'संबंधित'),
    loadLabel: lt('Load', 'लोड करें'),
    browseAllCategories: lt('Browse all categories', 'सभी श्रेणियां देखें'),
    startWithGuide: lt('Start with the beginner guide', 'शुरुआती गाइड से शुरू करें'),
    menu: lt('Menu', 'मेनू'),
    closeMenu: lt('Close menu', 'मेनू बंद करें'),
    menuLabel: lt('Site navigation', 'साइट नेविगेशन'),
    mobileActions: lt('Quick actions', 'त्वरित क्रियाएं'),
    mobilePlayNote: lt(
        'On phones, it is usually better to read the quick summary first and launch play only when you are ready.',
        'फ़ोन पर पहले त्वरित सारांश पढ़ना और तैयार होने पर ही play शुरू करना बेहतर रहता है।'
    ),
    mobilePlaySummary: lt(
        'Mobile-first tip: use this page to preview the game, then decide whether to open the playable frame.',
        'मोबाइल टिप: पहले इस पेज से गेम को समझें, फिर तय करें कि playable frame खोलनी है या नहीं।'
    ),
    mobileOpenPlay: lt('Open playable frame', 'Playable frame खोलें'),
    mobilePlayExplain: lt(
        'The game frame stays secondary on smaller screens so the page is easier to read and tap through.',
        'छोटी स्क्रीन पर game frame को secondary रखा जाता है ताकि पेज पढ़ना और tap करना आसान रहे।'
    ),
};

SITE.dateLabel = lt('May 10, 2026', 'May 10, 2026');
UI.editorialPage = lt('Curated page', 'Curated page');
UI.supportPage = lt('Catalog page', 'Catalog page');

const DATASETS = [
    {
        varName: 'actionGames',
        file: 'js/game_data/action.js',
        dir: 'Action',
        slug: 'action',
        label: lt('Action Shooters', 'एक्शन शूटर्स'),
        intro: lt(
            'Action pages on SkillWarz focus on quick browser sessions, direct controls, and easy-to-understand game loops.',
            'SkillWarz पर एक्शन पेज तेज ब्राउज़र सेशन, सीधे कंट्रोल और आसानी से समझ आने वाले गेम लूप पर ध्यान देते हैं।'
        ),
    },
    {
        varName: 'battleRoyaleData',
        file: 'js/game_data/battleRoyale.js',
        dir: 'BattleRoyale',
        slug: 'battle-royale',
        label: lt('Battle Royale', 'बैटल रॉयल'),
        intro: lt(
            'Battle royale pages emphasize survival pressure, looting rhythm, and the last-player-standing loop.',
            'बैटल रॉयल पेज survival pressure, looting rhythm और last-player-standing loop पर जोर देते हैं।'
        ),
    },
    {
        varName: 'fpsData',
        file: 'js/game_data/fps.js',
        dir: 'FPS',
        slug: 'fps',
        label: lt('First-Person Shooters', 'फर्स्ट-पर्सन शूटर्स'),
        intro: lt(
            'FPS pages highlight aiming feel, movement pace, and the kind of player each browser shooter suits best.',
            'FPS पेज aiming feel, movement pace और यह कि कौन-सा browser shooter किस तरह के खिलाड़ी के लिए बेहतर है, इस पर रोशनी डालते हैं।'
        ),
    },
    {
        varName: 'multiplayerGames',
        file: 'js/game_data/multiplayer.js',
        dir: 'Multiplayer',
        slug: 'multiplayer',
        label: lt('Multiplayer Games', 'मल्टीप्लेयर गेम्स'),
        intro: lt(
            'Multiplayer pages collect browser titles that make sense for short social sessions and instant replays.',
            'मल्टीप्लेयर पेज ऐसे browser titles इकट्ठा करते हैं जो छोटी social sessions और instant replays के लिए ठीक बैठते हैं।'
        ),
    },
    {
        varName: 'sniperData',
        file: 'js/game_data/sniper.js',
        dir: 'Sniper',
        slug: 'sniper',
        label: lt('Sniper Games', 'स्नाइपर गेम्स'),
        intro: lt(
            'Sniper pages focus on patience, line-of-sight control, and whether a game rewards careful or aggressive shots.',
            'स्नाइपर पेज patience, line-of-sight control और यह कि कोई गेम सावधान shots को पुरस्कृत करता है या aggressive play को, इस पर ध्यान देते हैं।'
        ),
    },
];

const GUIDES = [
    {
        slug: 'skillwarz-beginner-guide.html',
        title: lt('SkillWarz Beginner Guide', 'SkillWarz शुरुआती गाइड'),
        description: lt(
            'A practical beginner guide to SkillWarz covering game flow, early habits, map awareness, and faster improvement in browser FPS matches.',
            'SkillWarz के लिए एक व्यावहारिक शुरुआती गाइड, जिसमें game flow, शुरुआती आदतें, map awareness और browser FPS matches में तेज सुधार शामिल है।'
        ),
        intro: lt(
            'This guide is for players who load SkillWarz for the first time and want to understand what actually matters in their first few matches.',
            'यह गाइड उन खिलाड़ियों के लिए है जो पहली बार SkillWarz खोल रहे हैं और अपनी शुरुआती कुछ matches में सच में क्या मायने रखता है, यह समझना चाहते हैं।'
        ),
        tags: [lt('SkillWarz guide', 'SkillWarz गाइड'), lt('Beginner tips', 'शुरुआती टिप्स'), lt('Browser FPS', 'ब्राउज़र FPS')],
        sections: [
            {
                heading: lt('Start With Movement Before Aim', 'Aim से पहले movement सीखें'),
                paragraphs: [
                    lt(
                        'SkillWarz rewards players who stay mobile. New players often focus only on the crosshair, but early improvement usually comes from learning how to reposition after every fight.',
                        'SkillWarz उन खिलाड़ियों को इनाम देता है जो चलते रहते हैं। नए खिलाड़ी अक्सर सिर्फ crosshair पर ध्यान देते हैं, लेकिन शुरुआती सुधार आमतौर पर हर fight के बाद सही reposition सीखने से आता है।'
                    ),
                    lt(
                        'Treat movement as part of offense and defense. If you can slide, strafe, and break line of sight after a shot, you will survive longer even before your aim becomes consistent.',
                        'Movement को offense और defense दोनों का हिस्सा मानें। अगर आप shot के बाद slide, strafe और line of sight तोड़ सकते हैं, तो आपका aim स्थिर होने से पहले भी आप ज्यादा देर तक जीवित रहेंगे।'
                    ),
                ],
                bullets: [
                    lt('Move between cover instead of standing still to trade shots.', 'Shots trade करने के लिए स्थिर खड़े रहने के बजाय cover के बीच move करें।'),
                    lt('Use short bursts of aggression, then reset your angle.', 'थोड़ी देर aggressive खेलें, फिर अपना angle reset करें।'),
                    lt('Learn one map route at a time rather than trying to memorize every lane at once.', 'एक साथ हर lane याद करने की जगह एक समय में एक map route सीखें।'),
                ],
            },
            {
                heading: lt('Pick One Reliable Goal Per Match', 'हर match के लिए एक भरोसेमंद लक्ष्य चुनें'),
                paragraphs: [
                    lt(
                        'A simple improvement loop works better than trying to fix everything at once. Enter each match with one focus: cleaner peeks, better crosshair placement, or smarter route choices.',
                        'एक साथ सब कुछ ठीक करने की कोशिश से बेहतर एक सरल improvement loop होता है। हर match में एक focus लेकर जाएं: cleaner peeks, बेहतर crosshair placement या smarter route choices।'
                    ),
                    lt(
                        'That kind of narrow goal keeps matches productive and gives you something measurable to repeat in the next session.',
                        'ऐसा सीमित लक्ष्य आपकी matches को productive रखता है और अगली session में दोहराने के लिए measurable चीज देता है।'
                    ),
                ],
                bullets: [
                    lt('Track whether you died while sprinting into open space.', 'देखें कि क्या आप खुली जगह में sprint करते हुए मरे।'),
                    lt('Track whether your crosshair was already near the next angle.', 'देखें कि आपका crosshair अगले angle के पास पहले से था या नहीं।'),
                    lt('Track whether you challenged two players at once when you could have split the fight.', 'देखें कि जहां fight को अलग किया जा सकता था, वहां क्या आपने एक साथ दो खिलाड़ियों को challenge किया।'),
                ],
            },
            {
                heading: lt('Use Bots And Lower-Stakes Matches Properly', 'Bots और low-stakes matches का सही उपयोग करें'),
                paragraphs: [
                    lt(
                        'Training spaces are best for practicing routes, weapon feel, and muscle memory. They are not a perfect replacement for human opponents, but they are a fast way to build repetition.',
                        'Training spaces routes, weapon feel और muscle memory की practice के लिए सबसे अच्छे हैं। वे human opponents का perfect replacement नहीं हैं, लेकिन repetition बनाने का तेज तरीका हैं।'
                    ),
                    lt(
                        'If your first public match feels chaotic, go back to a lower-pressure mode and tighten your habits before you try to speed up.',
                        'अगर आपकी पहली public match बहुत chaotic लगे, तो किसी lower-pressure mode में लौटें और speed बढ़ाने से पहले अपनी आदतें ठीक करें।'
                    ),
                ],
                bullets: [
                    lt('Warm up aim and movement before queueing into tougher matches.', 'कठिन matches में queue करने से पहले aim और movement warm up करें।'),
                    lt('Repeat one route several times until it feels automatic.', 'एक route को कई बार दोहराएं जब तक वह automatic न लगे।'),
                    lt('Leave training once your movements feel deliberate rather than random.', 'जब आपका movement random के बजाय deliberate लगे, तब training से बाहर आएं।'),
                ],
            },
        ],
    },
    {
        slug: 'skillwarz-controls-tips.html',
        title: lt('SkillWarz Controls And Movement Tips', 'SkillWarz कंट्रोल और movement टिप्स'),
        description: lt(
            'Learn the core SkillWarz controls, how each movement input affects fights, and what beginners should practice first.',
            'SkillWarz के मुख्य controls, हर movement input का fights पर असर और beginners को पहले क्या practice करना चाहिए, यह सीखें।'
        ),
        intro: lt(
            'Controls matter in SkillWarz because the game becomes much easier once your movement inputs stop competing with each other.',
            'SkillWarz में controls इसलिए मायने रखते हैं क्योंकि जब आपके movement inputs आपस में टकराना बंद कर देते हैं, तो गेम काफी आसान लगने लगता है।'
        ),
        tags: [lt('Controls', 'कंट्रोल'), lt('Movement', 'मूवमेंट'), lt('SkillWarz', 'SkillWarz')],
        sections: [
            {
                heading: lt('Build A Clean Control Routine', 'साफ control routine बनाएं'),
                paragraphs: [
                    lt(
                        'The important part is not memorizing every key. The important part is making the basic movement actions feel automatic so your brain can focus on reading the fight.',
                        'महत्वपूर्ण बात हर key याद करना नहीं है। असली बात basic movement actions को automatic बनाना है ताकि आपका दिमाग fight को पढ़ने पर ध्यान दे सके।'
                    ),
                    lt(
                        'If your fingers still feel busy, simplify what you are trying to do. Run one route, jump one corner, and learn one reset pattern before layering in harder mechanics.',
                        'अगर आपकी उंगलियां अभी भी बहुत व्यस्त लगती हैं, तो जो आप कर रहे हैं उसे आसान बनाएं। कठिन mechanics जोड़ने से पहले एक route, एक corner jump और एक reset pattern सीखें।'
                    ),
                ],
                bullets: [
                    lt('Use WASD for movement and keep the mouse only for aim and angle control.', 'Movement के लिए WASD इस्तेमाल करें और mouse को aim और angle control के लिए रखें।'),
                    lt('Practice jump timing separately from combat until it feels natural.', 'Jump timing की practice combat से अलग करें जब तक वह natural न लगे।'),
                    lt('Use crouch or slide with intention, not as a panic button every fight.', 'Crouch या slide सोच-समझकर इस्तेमाल करें, हर fight में panic button की तरह नहीं।'),
                ],
            },
            {
                heading: lt('Why Crosshair Placement Matters More Than Flicks', 'Crosshair placement flicks से ज्यादा क्यों मायने रखता है'),
                paragraphs: [
                    lt(
                        'Players often think they need flashy aim to improve. In browser shooters, cleaner pre-aim usually creates more value than emergency flicks.',
                        'खिलाड़ियों को अक्सर लगता है कि सुधार के लिए flashy aim चाहिए। Browser shooters में cleaner pre-aim, emergency flicks से ज्यादा फायदा देता है।'
                    ),
                    lt(
                        'If the crosshair is already near the enemy path, you reduce the amount of correction required and win easier trades.',
                        'अगर crosshair पहले से enemy path के पास है, तो correction कम करनी पड़ती है और trades जीतना आसान हो जाता है।'
                    ),
                ],
                bullets: [
                    lt('Keep the crosshair near chest or head height while moving.', 'Move करते समय crosshair को chest या head height के पास रखें।'),
                    lt('Aim at likely exits before an opponent appears.', 'Opponent दिखने से पहले likely exits पर aim रखें।'),
                    lt('Reset your view after every fight instead of swinging wildly into the next angle.', 'हर fight के बाद अगले angle में बेतरतीब swing करने के बजाय अपना view reset करें।'),
                ],
            },
            {
                heading: lt('Movement Errors That Cost New Players The Most', 'वे movement गलतियां जो नए खिलाड़ियों को सबसे ज्यादा नुकसान पहुंचाती हैं'),
                paragraphs: [
                    lt(
                        'Most beginner deaths happen because the player keeps moving into open lanes after information has already turned bad.',
                        'ज्यादातर beginner deaths इसलिए होती हैं क्योंकि जानकारी खराब हो जाने के बाद भी खिलाड़ी खुली lanes में बढ़ते रहते हैं।'
                    ),
                    lt(
                        'A short retreat, strafe reset, or angle change is often stronger than forcing one more bullet exchange.',
                        'एक छोटा retreat, strafe reset या angle change अक्सर एक और bullet exchange थोपने से बेहतर होता है।'
                    ),
                ],
                bullets: [
                    lt('Do not reload in the middle of open sightlines.', 'खुली sightlines के बीच reload न करें।'),
                    lt('Do not chase every weak opponent if the route exposes you to two more angles.', 'अगर route आपको दो और angles पर खोलता है, तो हर weak opponent का पीछा न करें।'),
                    lt('Break line of sight before switching weapons or resetting position.', 'Weapon बदलने या position reset करने से पहले line of sight तोड़ें।'),
                ],
            },
        ],
    },
    {
        slug: 'best-browser-shooter-modes.html',
        title: lt('Best Browser Shooter Modes For Different Players', 'अलग-अलग खिलाड़ियों के लिए सबसे अच्छे browser shooter modes'),
        description: lt(
            'A practical guide to browser shooter game modes and which ones fit competitive players, casual players, and short play sessions.',
            'Browser shooter game modes का एक व्यावहारिक गाइड और कौन-से modes competitive players, casual players और short sessions के लिए बेहतर हैं।'
        ),
        intro: lt(
            'Not every browser shooter mode gives the same kind of fun. Some reward raw mechanics, some reward map knowledge, and some are simply better for a ten-minute break.',
            'हर browser shooter mode एक जैसा मज़ा नहीं देता। कुछ raw mechanics को reward करते हैं, कुछ map knowledge को, और कुछ सिर्फ दस मिनट के break के लिए बेहतर होते हैं।'
        ),
        tags: [lt('Browser shooters', 'ब्राउज़र शूटर्स'), lt('Game modes', 'गेम मोड्स'), lt('FPS guide', 'FPS गाइड')],
        sections: [
            {
                heading: lt('Deathmatch For Mechanical Reps', 'Mechanical reps के लिए deathmatch'),
                paragraphs: [
                    lt(
                        'Deathmatch and free-for-all modes are great for improving aim, reaction speed, and pace under pressure. They create constant respawns and fast repetitions.',
                        'Deathmatch और free-for-all modes aim, reaction speed और pressure में pace सुधारने के लिए शानदार हैं। इनमें लगातार respawns और तेज repetitions मिलते हैं।'
                    ),
                    lt(
                        'If you want to sharpen fundamentals, this is usually the most efficient mode to revisit.',
                        'अगर आप fundamentals को तेज करना चाहते हैं, तो यह mode आमतौर पर बार-बार खेलने के लिए सबसे efficient होता है।'
                    ),
                ],
                bullets: [
                    lt('Best for warming up before harder matches.', 'कठिन matches से पहले warm-up के लिए सबसे अच्छा।'),
                    lt('Best for learning weapon feel quickly.', 'Weapon feel जल्दी सीखने के लिए सबसे अच्छा।'),
                    lt('Less useful if your goal is team coordination or objective play.', 'अगर आपका लक्ष्य team coordination या objective play है, तो यह कम उपयोगी है।'),
                ],
            },
            {
                heading: lt('Objective Modes For Map Awareness', 'Map awareness के लिए objective modes'),
                paragraphs: [
                    lt(
                        'Capture, domination, and team-control styles reward route selection and timing more than raw frag chasing.',
                        'Capture, domination और team-control styles raw frag chasing से ज्यादा route selection और timing को reward करते हैं।'
                    ),
                    lt(
                        'These modes often teach better discipline because overextending usually punishes the whole team instead of only your own score.',
                        'ये modes अक्सर बेहतर discipline सिखाते हैं क्योंकि overextend करने पर सिर्फ आपका score नहीं, पूरी team को नुकसान होता है।'
                    ),
                ],
                bullets: [
                    lt('Great for learning how maps connect.', 'Maps कैसे connect होते हैं, यह सीखने के लिए बढ़िया।'),
                    lt('Great for practicing when to rotate and when to hold.', 'कब rotate करना है और कब hold करना है, इसकी practice के लिए बढ़िया।'),
                    lt('Useful if you want a slower, more readable pace.', 'अगर आपको धीमा और ज्यादा readable pace चाहिए, तो उपयोगी।'),
                ],
            },
            {
                heading: lt('Survival And Elimination For Decision Making', 'Decision making के लिए survival और elimination'),
                paragraphs: [
                    lt(
                        'Modes with limited lives force cleaner decisions. Every overpeek and bad chase becomes more expensive.',
                        'Limited lives वाले modes साफ decisions लेने पर मजबूर करते हैं। हर overpeek और गलत chase ज्यादा महंगा पड़ता है।'
                    ),
                    lt(
                        'That pressure makes them useful for players who want to reduce sloppy habits and think more carefully before committing.',
                        'यही pressure उन्हें उन खिलाड़ियों के लिए उपयोगी बनाता है जो sloppy habits कम करना चाहते हैं और commit करने से पहले ज्यादा सोचते हैं।'
                    ),
                ],
                bullets: [
                    lt('Good for players trying to improve discipline.', 'Discipline सुधारने वाले खिलाड़ियों के लिए अच्छा।'),
                    lt('Good for learning when not to take a fight.', 'कब fight नहीं लेनी चाहिए, यह सीखने के लिए अच्छा।'),
                    lt('Less forgiving for brand-new players who still need reps.', 'बिलकुल नए खिलाड़ियों के लिए कम forgiving, जिन्हें अभी reps चाहिए।'),
                ],
            },
        ],
    },
    {
        slug: 'browser-fps-vs-battle-royale-guide.html',
        title: lt('Browser FPS Vs Battle Royale: Which Format Fits You?', 'Browser FPS बनाम battle royale: आपके लिए कौन-सा format सही है?'),
        description: lt(
            'Compare browser FPS games and battle royale games to find out which pace, skill loop, and session length fits your play style.',
            'Browser FPS games और battle royale games की तुलना करें ताकि पता चल सके कि कौन-सा pace, skill loop और session length आपके play style के लिए सही है।'
        ),
        intro: lt(
            'Players often know they want a browser shooter but are not sure whether they want round-based FPS pressure or the longer survival loop of battle royale matches.',
            'खिलाड़ी अक्सर जानते हैं कि उन्हें browser shooter चाहिए, लेकिन यह तय नहीं कर पाते कि उन्हें round-based FPS pressure चाहिए या battle royale matches का लंबा survival loop।'
        ),
        tags: [lt('FPS vs Battle Royale', 'FPS बनाम battle royale'), lt('Browser guide', 'ब्राउज़र गाइड'), lt('Shooter discovery', 'शूटर डिस्कवरी')],
        sections: [
            {
                heading: lt('Choose FPS If You Want Fast Repetition', 'अगर आपको तेज repetition चाहिए तो FPS चुनें'),
                paragraphs: [
                    lt(
                        'Classic FPS formats are better when you want more fights per minute, easier warm-ups, and cleaner repetition of the same mechanics.',
                        'Classic FPS formats तब बेहतर होते हैं जब आपको प्रति मिनट ज्यादा fights, आसान warm-ups और same mechanics की साफ repetition चाहिए।'
                    ),
                    lt(
                        'They let you fail, respawn, and try again quickly, which makes them efficient for improvement and easier for short sessions.',
                        'वे आपको fail, respawn और जल्दी फिर कोशिश करने देते हैं, जिससे वे improvement के लिए efficient और short sessions के लिए आसान बनते हैं।'
                    ),
                ],
                bullets: [
                    lt('Better for aim practice.', 'Aim practice के लिए बेहतर।'),
                    lt('Better for short play windows.', 'छोटे play windows के लिए बेहतर।'),
                    lt('Better if you want instant action without long looting phases.', 'अगर आप लंबी looting phases के बिना instant action चाहते हैं, तो बेहतर।'),
                ],
            },
            {
                heading: lt('Choose Battle Royale If You Like Risk And Tension', 'अगर आपको risk और tension पसंद है तो battle royale चुनें'),
                paragraphs: [
                    lt(
                        'Battle royale sessions create more emotional peaks because every decision can shape the whole run. Positioning, loot timing, and survival routes matter more.',
                        'Battle royale sessions ज्यादा emotional peaks बनाते हैं क्योंकि हर decision पूरे run को बदल सकता है। Positioning, loot timing और survival routes ज्यादा मायने रखते हैं।'
                    ),
                    lt(
                        'That makes the mode appealing to players who enjoy suspense and comeback tension more than constant respawn action.',
                        'इससे यह mode उन खिलाड़ियों को पसंद आता है जिन्हें constant respawn action से ज्यादा suspense और comeback tension पसंद है।'
                    ),
                ],
                bullets: [
                    lt('Better for players who enjoy survival pressure.', 'Survival pressure पसंद करने वाले खिलाड़ियों के लिए बेहतर।'),
                    lt('Better for larger map movement and positioning choices.', 'बड़े map movement और positioning choices के लिए बेहतर।'),
                    lt('Better when the journey matters as much as the gunfight itself.', 'जब journey उतनी ही महत्वपूर्ण हो जितनी gunfight, तब बेहतर।'),
                ],
            },
            {
                heading: lt('Use Both If Your Sessions Change', 'अगर आपकी sessions बदलती रहती हैं, तो दोनों इस्तेमाल करें'),
                paragraphs: [
                    lt(
                        'A lot of browser shooter players rotate between formats. FPS works well for warm-up or quick breaks, while battle royale scratches the itch for longer, higher-stakes runs.',
                        'कई browser shooter खिलाड़ी अलग-अलग formats के बीच घूमते रहते हैं। FPS warm-up या quick break के लिए अच्छा है, जबकि battle royale लंबी और ज्यादा stakes वाली runs के लिए बेहतर है।'
                    ),
                    lt(
                        'If your available time changes during the week, keeping both in your rotation often makes the most sense.',
                        'अगर हफ्ते भर में आपका available time बदलता है, तो rotation में दोनों को रखना अक्सर सबसे सही रहता है।'
                    ),
                ],
                bullets: [
                    lt('Use FPS when you have 10 to 20 minutes.', 'जब आपके पास 10 से 20 मिनट हों, तब FPS खेलें।'),
                    lt('Use battle royale when you want more tension and slower buildup.', 'जब आपको ज्यादा tension और धीमा buildup चाहिए, तब battle royale खेलें।'),
                    lt('Use both if you want variety without leaving the browser shooter category.', 'अगर आप browser shooter category छोड़े बिना variety चाहते हैं, तो दोनों खेलें।'),
                ],
            },
        ],
    },
    {
        slug: 'how-to-improve-browser-fps-aim.html',
        title: lt('How To Improve Aim In Browser FPS Games', 'Browser FPS games में aim कैसे सुधारें'),
        description: lt(
            'A practical aim guide for browser FPS players covering crosshair placement, cleaner fights, and building useful repetition without overtraining.',
            'Browser FPS players के लिए एक व्यावहारिक aim guide, जिसमें crosshair placement, cleaner fights और बिना overtraining के useful repetition बनाना शामिल है।'
        ),
        intro: lt(
            'Aim in browser shooters improves fastest when you remove messy habits first and only then worry about speed.',
            'Browser shooters में aim सबसे तेज तब सुधरता है जब आप पहले messy habits हटाते हैं और उसके बाद speed की चिंता करते हैं।'
        ),
        tags: [lt('Aim guide', 'Aim गाइड'), lt('Browser FPS', 'ब्राउज़र FPS'), lt('Skill practice', 'स्किल प्रैक्टिस')],
        sections: [
            {
                heading: lt('Use Crosshair Placement To Make Aim Easier', 'Aim आसान बनाने के लिए crosshair placement का उपयोग करें'),
                paragraphs: [
                    lt(
                        'A lot of missed shots come from arriving at an angle with the crosshair in the wrong place. The fewer corrections you need to make, the more stable your first shot becomes.',
                        'कई missed shots इसलिए होते हैं क्योंकि आप किसी angle पर गलत crosshair position के साथ पहुंचते हैं। जितनी कम corrections करनी पड़ेंगी, आपका पहला shot उतना ही stable होगा।'
                    ),
                    lt(
                        'This matters even more in browser shooters because sessions often move quickly and you do not always get long time-to-kill windows to recover from a bad first look.',
                        'Browser shooters में यह और भी जरूरी है क्योंकि sessions तेज चलती हैं और खराब first look से संभलने के लिए हमेशा लंबा time-to-kill window नहीं मिलता।'
                    ),
                ],
                bullets: [
                    lt('Keep the crosshair near the next enemy path instead of the floor.', 'Crosshair को floor के बजाय अगली enemy path के पास रखें।'),
                    lt('Pre-aim likely exits before you swing a corner.', 'Corner swing करने से पहले likely exits पर pre-aim करें।'),
                    lt('Reset to a neutral, ready position after every engagement.', 'हर engagement के बाद neutral, ready position पर लौटें।'),
                ],
            },
            {
                heading: lt('Train For Control, Not Just Speed', 'सिर्फ speed नहीं, control के लिए training करें'),
                paragraphs: [
                    lt(
                        'Raw speed is tempting, but unstable speed creates inconsistent fights. If you can stop the crosshair cleanly and fire without overflicking, you gain more usable aim.',
                        'Raw speed आकर्षक लगती है, लेकिन unstable speed inconsistent fights बनाती है। अगर आप crosshair को साफ रोककर बिना overflick के fire कर सकते हैं, तो आपको ज्यादा usable aim मिलता है।'
                    ),
                    lt(
                        'Think of accuracy as the base layer. Speed grows safely once the stopping point becomes reliable.',
                        'Accuracy को base layer मानें। जब stopping point भरोसेमंद हो जाता है, तब speed सुरक्षित तरीके से बढ़ती है।'
                    ),
                ],
                bullets: [
                    lt('Take slightly slower first shots until they land consistently.', 'पहले shots को थोड़ा धीमा लें जब तक वे लगातार लगने न लगें।'),
                    lt('Practice small corrections rather than giant panic flicks.', 'बड़े panic flicks के बजाय छोटी corrections की practice करें।'),
                    lt('Use short warm-ups that end before fatigue ruins your form.', 'ऐसे short warm-ups करें जो थकान आपकी form बिगाड़ने से पहले खत्म हो जाएं।'),
                ],
            },
            {
                heading: lt('Let Better Positioning Help Your Aim', 'बेहतर positioning से अपने aim को मदद दें'),
                paragraphs: [
                    lt(
                        'Aim looks better when the fight is easier. Cleaner positioning reduces the number of angles you must watch and gives you more predictable peeks.',
                        'जब fight आसान होती है, तब aim बेहतर दिखता है। Cleaner positioning उन angles की संख्या घटाती है जिन्हें आपको देखना है और अधिक predictable peeks देती है।'
                    ),
                    lt(
                        'That is why strong FPS players often seem accurate before they seem flashy: they create simpler fights for themselves.',
                        'इसीलिए मजबूत FPS खिलाड़ी flashy दिखने से पहले accurate लगते हैं: वे अपने लिए आसान fights बनाते हैं।'
                    ),
                ],
                bullets: [
                    lt('Avoid wide swings into multiple enemies at once.', 'एक साथ कई enemies की ओर wide swing करने से बचें।'),
                    lt('Peek from cover so you can break line of sight immediately after a shot.', 'Cover से peek करें ताकि shot के तुरंत बाद line of sight तोड़ सकें।'),
                    lt('Choose lanes where your next opponent is easier to read.', 'ऐसी lanes चुनें जहां अगला opponent पढ़ना आसान हो।'),
                ],
            },
        ],
    },
    {
        slug: 'best-browser-sniper-games-guide.html',
        title: lt('Best Browser Sniper Games: What Makes Them Fun?', 'सबसे अच्छे browser sniper games: उन्हें मज़ेदार क्या बनाता है?'),
        description: lt(
            'Learn what separates good browser sniper games from forgettable ones, including pacing, sightline design, and how much patience each game rewards.',
            'जानें कि अच्छे browser sniper games को साधारण games से क्या अलग बनाता है, जैसे pacing, sightline design और हर game patience को कितना reward करता है।'
        ),
        intro: lt(
            'Sniper games feel good when their pacing, sightlines, and target pressure all work together.',
            'Sniper games तब अच्छे लगते हैं जब उनका pacing, sightlines और target pressure साथ मिलकर काम करते हैं।'
        ),
        tags: [lt('Sniper guide', 'स्नाइपर गाइड'), lt('Browser games', 'ब्राउज़र गेम्स'), lt('Game discovery', 'गेम डिस्कवरी')],
        sections: [
            {
                heading: lt('Good Sniper Games Reward Patience', 'अच्छे sniper games patience को reward करते हैं'),
                paragraphs: [
                    lt(
                        'The strongest browser sniper games do not only ask whether you can click quickly. They ask whether you can wait for the right angle, choose the cleaner shot, and avoid forcing low-percentage fights.',
                        'सबसे अच्छे browser sniper games सिर्फ यह नहीं पूछते कि आप कितनी तेजी से click कर सकते हैं। वे यह भी देखते हैं कि क्या आप सही angle का इंतज़ार कर सकते हैं, cleaner shot चुन सकते हैं और low-percentage fights से बच सकते हैं।'
                    ),
                    lt(
                        'That patience is what separates satisfying tension from random target clicking.',
                        'यही patience संतोषजनक tension को random target clicking से अलग करती है।'
                    ),
                ],
                bullets: [
                    lt('Look for games that give space to hold lines and read movement.', 'ऐसे games खोजें जो lines hold करने और movement पढ़ने की जगह दें।'),
                    lt('Look for games where visibility matters as much as raw reflex.', 'ऐसे games देखें जहां visibility उतनी ही महत्वपूर्ण हो जितनी raw reflex।'),
                    lt('Be careful with sniper pages that look tense but actually play like arcade rush shooters.', 'उन sniper pages से सावधान रहें जो tense दिखते हैं लेकिन असल में arcade rush shooters की तरह खेलते हैं।'),
                ],
            },
            {
                heading: lt('Sightline Design Matters More Than Weapon Labels', 'Weapon labels से ज्यादा sightline design मायने रखता है'),
                paragraphs: [
                    lt(
                        'A game can call itself a sniper game and still fail if maps do not create meaningful lines of fire.',
                        'कोई game खुद को sniper game कह सकता है, फिर भी fail हो सकता है अगर maps meaningful lines of fire नहीं बनाते।'
                    ),
                    lt(
                        'Good sightline design gives players tradeoffs: safer long angles, risky reposition routes, and moments where patience pays off.',
                        'अच्छा sightline design खिलाड़ियों को tradeoffs देता है: safer long angles, risky reposition routes और ऐसे moments जहां patience काम आती है।'
                    ),
                ],
                bullets: [
                    lt('Balanced maps offer both exposed power angles and flank routes.', 'Balanced maps exposed power angles और flank routes दोनों देते हैं।'),
                    lt('Targets should be readable enough to reward tracking and timing.', 'Targets इतने readable होने चाहिए कि tracking और timing को reward मिले।'),
                    lt('The best browser sniper sessions make every missed shot feel instructive rather than random.', 'सबसे अच्छे browser sniper sessions हर missed shot को random के बजाय instructive महसूस कराते हैं।'),
                ],
            },
            {
                heading: lt('Who Usually Enjoys Browser Sniper Pages', 'Browser sniper pages आमतौर पर किसे पसंद आते हैं'),
                paragraphs: [
                    lt(
                        'Sniper-focused browser players are often less interested in nonstop chaos and more interested in clarity. They want a match pace that allows prediction, timing, and line control.',
                        'Sniper-focused browser players अक्सर nonstop chaos से कम और clarity से ज्यादा प्रभावित होते हैं। उन्हें ऐसा match pace चाहिए जिसमें prediction, timing और line control की जगह हो।'
                    ),
                    lt(
                        'If that sounds like you, sniper categories are often a better starting point than general FPS pages.',
                        'अगर यह आपको सही लगता है, तो sniper categories अक्सर general FPS pages से बेहतर starting point होती हैं।'
                    ),
                ],
                bullets: [
                    lt('Best for players who enjoy patience and precision.', 'Patience और precision पसंद करने वाले खिलाड़ियों के लिए बेहतर।'),
                    lt('Best for players who want fewer but more meaningful engagements.', 'कम लेकिन ज्यादा meaningful engagements चाहने वाले खिलाड़ियों के लिए बेहतर।'),
                    lt('Best for players who like map knowledge as much as aim.', 'Aim जितना ही map knowledge पसंद करने वाले खिलाड़ियों के लिए बेहतर।'),
                ],
            },
        ],
    },
    {
        slug: 'battle-royale-beginner-mistakes.html',
        title: lt('Battle Royale Beginner Mistakes In Browser Games', 'Browser games में battle royale की शुरुआती गलतियां'),
        description: lt(
            'A quick guide to the most common browser battle royale mistakes, from bad rotations to late looting and low-value fights.',
            'Browser battle royale में होने वाली सबसे आम गलतियों पर एक quick guide, जैसे bad rotations, late looting और low-value fights।'
        ),
        intro: lt(
            'Battle royale mistakes usually happen long before the final duel. Many losses begin with route decisions, greed, or low-value fights.',
            'Battle royale की गलतियां अक्सर final duel से बहुत पहले हो जाती हैं। कई हार route decisions, greed या low-value fights से शुरू होती हैं।'
        ),
        tags: [lt('Battle royale', 'बैटल रॉयल'), lt('Beginner mistakes', 'शुरुआती गलतियां'), lt('Browser guide', 'ब्राउज़र गाइड')],
        sections: [
            {
                heading: lt('Do Not Treat Every Fight As Mandatory', 'हर fight को ज़रूरी मत समझें'),
                paragraphs: [
                    lt(
                        'New battle royale players often assume every enemy sighting is a required fight. In reality, some encounters cost too much and give too little back.',
                        'नए battle royale खिलाड़ी अक्सर मान लेते हैं कि हर enemy sighting एक required fight है। असल में कुछ encounters बहुत ज्यादा कीमत लेते हैं और बदले में बहुत कम देते हैं।'
                    ),
                    lt(
                        'If a fight breaks your position, leaves you exposed, or slows your route too much, skipping it can be the stronger decision.',
                        'अगर कोई fight आपकी position तोड़ देती है, आपको exposed छोड़ती है या route बहुत धीमा कर देती है, तो उसे छोड़ देना बेहतर decision हो सकता है।'
                    ),
                ],
                bullets: [
                    lt('Fight when the angle is favorable or the reward is meaningful.', 'जब angle अनुकूल हो या reward meaningful हो, तभी fight लें।'),
                    lt('Avoid long chases that drag you through open ground.', 'ऐसी लंबी chases से बचें जो आपको खुली जमीन से गुजरने पर मजबूर करें।'),
                    lt('Remember that surviving in a better position often creates the next easier fight.', 'याद रखें कि बेहतर position में जीवित रहना अक्सर अगली आसान fight बनाता है।'),
                ],
            },
            {
                heading: lt('Loot Faster And Move Earlier', 'जल्दी loot करें और पहले move करें'),
                paragraphs: [
                    lt(
                        'Over-looting is one of the most common early mistakes. The extra seconds feel harmless until they force a rushed rotation later.',
                        'Over-looting शुरुआती सबसे आम गलतियों में से एक है। वे अतिरिक्त seconds तब तक harmless लगते हैं जब तक वे बाद में rushed rotation के लिए मजबूर न कर दें।'
                    ),
                    lt(
                        'A clean, modest loadout in a better position often beats perfect loot collected too slowly.',
                        'बेहतर position में एक साफ और साधारण loadout, बहुत धीरे जमा किए गए perfect loot से अक्सर बेहतर होता है।'
                    ),
                ],
                bullets: [
                    lt('Decide quickly what counts as enough gear.', 'जल्दी तय करें कि आपके लिए कितना gear पर्याप्त है।'),
                    lt('Leave zones earlier if your route options are limited.', 'अगर आपके route options सीमित हैं, तो zones जल्दी छोड़ें।'),
                    lt('Treat safe movement as part of your resource management.', 'Safe movement को अपने resource management का हिस्सा मानें।'),
                ],
            },
            {
                heading: lt('Position Wins Fights Before Bullets Do', 'Bullets से पहले position fights जिताती है'),
                paragraphs: [
                    lt(
                        'When endgames become smaller, information and terrain matter more. Players in cleaner spots take easier duels, see threats sooner, and escape more often.',
                        'जब endgames छोटे होने लगते हैं, तो information और terrain ज्यादा मायने रखते हैं। बेहतर spots में खिलाड़ी आसान duels लेते हैं, threats जल्दी देखते हैं और ज्यादा बार बच निकलते हैं।'
                    ),
                    lt(
                        'That is why good battle royale improvement often looks less flashy than pure shooter improvement.',
                        'इसीलिए अच्छी battle royale improvement अक्सर pure shooter improvement से कम flashy दिखती है।'
                    ),
                ],
                bullets: [
                    lt('Move toward positions with cover and multiple exits.', 'ऐसी positions की ओर बढ़ें जहां cover और multiple exits हों।'),
                    lt('Avoid cliffs or hard edges that trap your route options.', 'ऐसे cliffs या hard edges से बचें जो route options को फंसा दें।'),
                    lt('Think about the next circle before the current fight ends.', 'Current fight खत्म होने से पहले next circle के बारे में सोचें।'),
                ],
            },
        ],
    },
    {
        slug: 'how-to-choose-browser-shooter.html',
        title: lt('How To Choose The Right Browser Shooter For You', 'अपने लिए सही browser shooter कैसे चुनें'),
        description: lt(
            'Use this SkillWarz guide to decide whether you should start with FPS, sniper, battle royale, or lighter browser action pages.',
            'इस SkillWarz guide का उपयोग करके तय करें कि आपको FPS, sniper, battle royale या हल्के browser action pages में से किससे शुरू करना चाहिए।'
        ),
        intro: lt(
            'A browser shooter feels better when it matches the amount of time, focus, and pressure you actually want from the session.',
            'कोई browser shooter तब बेहतर लगता है जब वह उस समय, focus और pressure से मेल खाता है जो आप वास्तव में उस session से चाहते हैं।'
        ),
        tags: [lt('Shooter guide', 'शूटर गाइड'), lt('Player fit', 'प्लेयर फिट'), lt('Browser discovery', 'ब्राउज़र डिस्कवरी')],
        sections: [
            {
                heading: lt('Start With Session Length', 'Session length से शुरुआत करें'),
                paragraphs: [
                    lt(
                        'If you only have a short break, faster-respawn FPS pages usually make more sense than slower survival formats.',
                        'अगर आपके पास सिर्फ छोटा break है, तो faster-respawn FPS pages आमतौर पर धीमे survival formats से ज्यादा सही होते हैं।'
                    ),
                    lt(
                        'If you have more time and want rising tension, battle royale or elimination-style pages often fit better.',
                        'अगर आपके पास ज्यादा समय है और आप बढ़ती tension चाहते हैं, तो battle royale या elimination-style pages बेहतर बैठते हैं।'
                    ),
                ],
                bullets: [
                    lt('Choose FPS for short, repeatable sessions.', 'छोटी और repeatable sessions के लिए FPS चुनें।'),
                    lt('Choose battle royale for longer, higher-stakes runs.', 'लंबी और ज्यादा stakes वाली runs के लिए battle royale चुनें।'),
                    lt('Choose sniper if you want a calmer pace with more deliberate shots.', 'अगर आपको शांत pace और ज्यादा deliberate shots चाहिए, तो sniper चुनें।'),
                ],
            },
            {
                heading: lt('Match The Pace To Your Mood', 'Pace को अपने mood से मिलाएं'),
                paragraphs: [
                    lt(
                        'Some players want nonstop action. Others want fewer but more meaningful engagements. Picking the wrong pace makes a decent game feel wrong for the moment.',
                        'कुछ खिलाड़ियों को nonstop action चाहिए। कुछ को कम लेकिन ज्यादा meaningful engagements चाहिए। गलत pace चुनने से अच्छा game भी उस समय गलत लग सकता है।'
                    ),
                    lt(
                        'That is why category navigation matters: it helps align expectation with what the session actually delivers.',
                        'इसीलिए category navigation महत्वपूर्ण है: यह expectation को उस चीज़ से मिलाती है जो session वास्तव में देती है।'
                    ),
                ],
                bullets: [
                    lt('Fast mood: start with FPS or direct shooter pages.', 'Fast mood: FPS या direct shooter pages से शुरू करें।'),
                    lt('Measured mood: start with sniper pages.', 'Measured mood: sniper pages से शुरू करें।'),
                    lt('Suspense mood: start with battle royale pages.', 'Suspense mood: battle royale pages से शुरू करें।'),
                ],
            },
            {
                heading: lt('Use Support Pages As Filters', 'Support pages को filters की तरह इस्तेमाल करें'),
                paragraphs: [
                    lt(
                        'Not every page in the site catalog is treated as a flagship page. Some remain support pages while stronger editorial coverage is concentrated on core shooter titles.',
                        'Site catalog का हर page flagship page की तरह नहीं माना जाता। कुछ support pages बने रहते हैं जबकि मजबूत editorial coverage core shooter titles पर केंद्रित रहती है।'
                    ),
                    lt(
                        'That distinction is useful because it helps you spend time on the pages most aligned with the main focus of the site.',
                        'यह फर्क उपयोगी है क्योंकि यह आपको उन pages पर समय लगाने में मदद करता है जो site के मुख्य focus के सबसे करीब हैं।'
                    ),
                ],
                bullets: [
                    lt('Flagship pages are the best place to start if you want stronger genre fit.', 'अगर आपको मजबूत genre fit चाहिए, तो flagship pages सबसे अच्छी शुरुआत हैं।'),
                    lt('Support pages still exist for catalog completeness but may stay noindex while coverage grows.', 'Catalog completeness के लिए support pages मौजूद रहते हैं, लेकिन coverage बढ़ने तक वे noindex रह सकते हैं।'),
                    lt('Guides help you choose faster when you are not sure where to begin.', 'जब आपको शुरुआत समझ न आए, तब guides जल्दी चुनने में मदद करती हैं।'),
                ],
            },
        ],
    },
];

const INFO_PAGES = [
    {
        slug: 'about.html',
        title: lt('About SkillWarz', 'SkillWarz के बारे में'),
        description: lt(
            'Learn how SkillWarz curates browser games, writes original play guides, and maintains a safer, easier way to discover online action games.',
            'जानें कि SkillWarz browser games को कैसे curate करता है, original play guides कैसे लिखता है और online action games को खोजने का आसान तरीका कैसे बनाए रखता है।'
        ),
        intro: lt(
            'SkillWarz is an independent browser gaming site focused on online action, FPS, sniper, battle royale, and multiplayer titles that can be played quickly in a desktop or mobile browser.',
            'SkillWarz एक स्वतंत्र browser gaming site है जो online action, FPS, sniper, battle royale और multiplayer titles पर केंद्रित है, जिन्हें desktop या mobile browser में जल्दी खेला जा सकता है।'
        ),
        sections: [
            {
                heading: lt('What This Site Does', 'यह साइट क्या करती है'),
                paragraphs: [
                    lt(
                        'We do not claim to be the developer of every game listed on the site. Our role is to organize playable browser titles, publish original overview text, explain controls and game loops, and help players decide which games are worth trying first.',
                        'हम साइट पर सूचीबद्ध हर game के developer होने का दावा नहीं करते। हमारी भूमिका playable browser titles को व्यवस्थित करना, original overview text प्रकाशित करना, controls और game loops समझाना और खिलाड़ियों को यह तय करने में मदद करना है कि कौन-से games पहले आजमाने लायक हैं।'
                    ),
                ],
            },
            {
                heading: lt('How Games Are Chosen', 'Games कैसे चुने जाते हैं'),
                paragraphs: [
                    lt(
                        'We prioritize games that load in-browser, are easy to understand, and fit the genres our visitors expect. Pages may include playable embeds from third-party distribution partners or official portals when that play method is available.',
                        'हम उन games को प्राथमिकता देते हैं जो browser में load होते हैं, समझने में आसान होते हैं और उन genres में आते हैं जिनकी हमारे visitors को उम्मीद रहती है। जब play method उपलब्ध हो, तो pages में third-party distribution partners या official portals के embeds शामिल हो सकते हैं।'
                    ),
                ],
            },
            {
                heading: lt('What Makes The Content Different', 'इस सामग्री को अलग क्या बनाता है'),
                bullets: [
                    lt('Each featured page is meant to include an original summary, quick tips, and category context.', 'हर featured page में original summary, quick tips और category context शामिल करने का लक्ष्य होता है।'),
                    lt('Category pages group related games so players can compare options without jumping across multiple sites.', 'Category pages related games को एक साथ रखती हैं ताकि खिलाड़ी कई sites पर जाए बिना options की तुलना कर सकें।'),
                    lt('Guide pages are written to help visitors discover controls, difficulty, and audience fit before they click play.', 'Guide pages इस तरह लिखी जाती हैं कि visitors play क्लिक करने से पहले controls, difficulty और audience fit समझ सकें।'),
                ],
            },
            {
                heading: lt('Ownership And Copyright', 'Ownership और copyright'),
                paragraphs: [
                    lt(
                        'Game trademarks, brand names, logos, screenshots, and embedded experiences belong to their respective owners. If you are a rightsholder and want content corrected or removed, contact us and we will review the request promptly.',
                        'Game trademarks, brand names, logos, screenshots और embedded experiences उनके संबंधित owners के हैं। अगर आप rightsholder हैं और सामग्री में सुधार या removal चाहते हैं, तो हमसे संपर्क करें; हम अनुरोध की जल्दी समीक्षा करेंगे।'
                    ),
                ],
            },
            {
                heading: lt('Contact', 'संपर्क'),
                paragraphs: [
                    lt(
                        `You can reach the site operator at ${SITE.email} for support, business inquiries, or copyright issues.`,
                        `Support, business inquiries या copyright issues के लिए आप site operator से ${SITE.email} पर संपर्क कर सकते हैं।`
                    ),
                ],
            },
        ],
        note: lt(
            'SkillWarz is a curated game discovery website. The goal is to provide a cleaner landing page, clearer descriptions, and easier navigation around browser-playable action games.',
            'SkillWarz एक curated game discovery website है। इसका लक्ष्य browser-playable action games के लिए साफ landing page, स्पष्ट descriptions और आसान navigation देना है।'
        ),
    },
    {
        slug: 'contact.html',
        title: lt('Contact SkillWarz', 'SkillWarz से संपर्क करें'),
        description: lt(
            'Contact SkillWarz for support, copyright requests, business questions, or general feedback.',
            'Support, copyright requests, business questions या सामान्य feedback के लिए SkillWarz से संपर्क करें।'
        ),
        intro: lt(
            'Questions, corrections, copyright concerns, and business inquiries are all handled by email.',
            'प्रश्न, corrections, copyright concerns और business inquiries सभी ईमेल के माध्यम से संभाली जाती हैं।'
        ),
        sections: [
            {
                heading: lt('Email', 'ईमेल'),
                paragraphs: [lt(SITE.email, SITE.email)],
            },
            {
                heading: lt('What To Include', 'क्या शामिल करें'),
                bullets: [
                    lt('The page URL you are contacting us about.', 'उस page का URL जिसके बारे में आप हमसे संपर्क कर रहे हैं।'),
                    lt('A short description of the issue or request.', 'समस्या या अनुरोध का छोटा विवरण।'),
                    lt('Your preferred reply address if different from the sender.', 'अगर sender से अलग हो, तो आपका पसंदीदा reply address।'),
                ],
            },
            {
                heading: lt('Typical Topics', 'आम विषय'),
                bullets: [
                    lt('Game page corrections or broken embeds.', 'Game page corrections या broken embeds।'),
                    lt('DMCA or copyright notices.', 'DMCA या copyright notices।'),
                    lt('Advertising or partnership questions.', 'Advertising या partnership questions।'),
                    lt('General site feedback.', 'सामान्य site feedback।'),
                ],
            },
        ],
    },
    {
        slug: 'privacy.html',
        title: lt('Privacy Policy', 'गोपनीयता नीति'),
        description: lt(
            'Read the SkillWarz privacy policy, including analytics usage, embedded third-party content, cookies, and contact information.',
            'SkillWarz की privacy policy पढ़ें, जिसमें analytics usage, embedded third-party content, cookies और contact information शामिल हैं।'
        ),
        intro: lt(
            'This Privacy Policy explains how SkillWarz collects and uses information when you browse the website at www.skillwarz.online.',
            'यह Privacy Policy बताती है कि जब आप www.skillwarz.online पर browse करते हैं तो SkillWarz जानकारी कैसे एकत्र और उपयोग करता है।'
        ),
        showUpdated: true,
        sections: [
            {
                heading: lt('1. Information We Collect', '1. हम कौन-सी जानकारी एकत्र करते हैं'),
                paragraphs: [
                    lt(
                        'We do not require visitors to create an account to browse the site. Information may still be collected automatically through standard web technologies.',
                        'साइट browse करने के लिए हम visitors से account बनाने की मांग नहीं करते। फिर भी standard web technologies के माध्यम से कुछ जानकारी अपने आप एकत्र हो सकती है।'
                    ),
                ],
                bullets: [
                    lt('Basic log data such as IP address, device type, browser type, referral source, and page requests.', 'Basic log data जैसे IP address, device type, browser type, referral source और page requests।'),
                    lt('Analytics data used to understand traffic trends and page performance.', 'Traffic trends और page performance समझने के लिए analytics data।'),
                    lt('Messages you send directly to us by email.', 'वे messages जो आप हमें सीधे ईमेल द्वारा भेजते हैं।'),
                ],
            },
            {
                heading: lt('2. How Information Is Used', '2. जानकारी का उपयोग कैसे किया जाता है'),
                bullets: [
                    lt('To operate and secure the website.', 'Website चलाने और सुरक्षित रखने के लिए।'),
                    lt('To understand which pages visitors find useful.', 'यह समझने के लिए कि visitors किन pages को उपयोगी मानते हैं।'),
                    lt('To respond to support, legal, or copyright requests.', 'Support, legal या copyright requests का जवाब देने के लिए।'),
                    lt('To improve page quality, navigation, and content coverage.', 'Page quality, navigation और content coverage बेहतर करने के लिए।'),
                ],
            },
            {
                heading: lt('3. Analytics And Cookies', '3. Analytics और cookies'),
                paragraphs: [
                    lt(
                        'SkillWarz uses Google Analytics or similar measurement tools to understand visits, clicks, traffic sources, and engagement. These services may use cookies or similar technologies to measure usage.',
                        'SkillWarz visits, clicks, traffic sources और engagement समझने के लिए Google Analytics या समान measurement tools का उपयोग करता है। ये सेवाएं usage मापने के लिए cookies या similar technologies इस्तेमाल कर सकती हैं।'
                    ),
                ],
            },
            {
                heading: lt('4. Third-Party Embedded Content', '4. Third-party embedded content'),
                paragraphs: [
                    lt(
                        'Some pages may contain embedded games, videos, or external links provided by third-party platforms. When you interact with that content, those services may collect information according to their own privacy policies.',
                        'कुछ pages में third-party platforms द्वारा दिए गए embedded games, videos या external links हो सकते हैं। जब आप उस content से interact करते हैं, तो वे services अपनी privacy policies के अनुसार जानकारी एकत्र कर सकती हैं।'
                    ),
                ],
            },
            {
                heading: lt('5. Advertising', '5. Advertising'),
                paragraphs: [
                    lt(
                        'If advertising is enabled in the future, ad partners may use cookies, device identifiers, or similar technologies to serve and measure ads. This policy will continue to be updated if monetization settings change.',
                        'अगर भविष्य में advertising enabled होती है, तो ad partners ads दिखाने और मापने के लिए cookies, device identifiers या similar technologies का उपयोग कर सकते हैं। Monetization settings बदलने पर इस policy को अपडेट किया जाता रहेगा।'
                    ),
                ],
            },
            {
                heading: lt('6. Data Retention', '6. Data retention'),
                paragraphs: [
                    lt(
                        'Operational and analytics data is retained only as long as needed for security, reporting, and site maintenance.',
                        'Operational और analytics data को केवल उतनी अवधि तक रखा जाता है जितनी security, reporting और site maintenance के लिए जरूरी हो।'
                    ),
                ],
            },
            {
                heading: lt("7. Children's Privacy", '7. बच्चों की गोपनीयता'),
                paragraphs: [
                    lt(
                        'The site is not intentionally directed at children under 13, and we do not knowingly request personal information from children.',
                        'यह साइट जानबूझकर 13 वर्ष से कम उम्र के बच्चों के लिए निर्देशित नहीं है, और हम बच्चों से जानबूझकर personal information नहीं मांगते।'
                    ),
                ],
            },
            {
                heading: lt('8. Your Choices', '8. आपके विकल्प'),
                paragraphs: [
                    lt(
                        'You can limit cookies through your browser settings. You may also contact us if you have questions about information you submitted directly by email.',
                        'आप अपने browser settings के माध्यम से cookies सीमित कर सकते हैं। अगर आपने ईमेल द्वारा सीधे जो जानकारी दी है, उसके बारे में सवाल हों, तो आप हमसे संपर्क कर सकते हैं।'
                    ),
                ],
            },
            {
                heading: lt('9. Contact', '9. संपर्क'),
                paragraphs: [
                    lt(`For privacy questions, contact ${SITE.email}.`, `Privacy से जुड़े प्रश्नों के लिए ${SITE.email} पर संपर्क करें।`),
                ],
            },
        ],
    },
    {
        slug: 'terms.html',
        title: lt('Terms of Service', 'सेवा की शर्तें'),
        description: lt(
            'Review the SkillWarz terms of service for use of the website, external game content, intellectual property, and contact details.',
            'Website उपयोग, external game content, intellectual property और contact details के लिए SkillWarz की terms of service पढ़ें।'
        ),
        intro: lt(
            'By visiting or using SkillWarz, you agree to these Terms of Service.',
            'SkillWarz पर आने या इसका उपयोग करने से आप इन Terms of Service से सहमत होते हैं।'
        ),
        showUpdated: true,
        sections: [
            {
                heading: lt('1. Website Purpose', '1. Website का उद्देश्य'),
                paragraphs: [
                    lt(
                        'SkillWarz is a browser game discovery and information website. Some pages may link to or embed content supplied by third-party platforms or publishers.',
                        'SkillWarz एक browser game discovery और information website है। कुछ pages third-party platforms या publishers द्वारा दिए गए content को link या embed कर सकते हैं।'
                    ),
                ],
            },
            {
                heading: lt('2. Acceptable Use', '2. उचित उपयोग'),
                bullets: [
                    lt('Do not misuse the website, attack its infrastructure, or attempt unauthorized access.', 'Website का दुरुपयोग न करें, उसकी infrastructure पर हमला न करें और unauthorized access की कोशिश न करें।'),
                    lt('Do not use the site in a way that violates applicable laws or third-party rights.', 'Site का उपयोग ऐसे तरीके से न करें जो लागू कानूनों या third-party rights का उल्लंघन करे।'),
                    lt('Do not copy site content in bulk for republication without permission.', 'बिना अनुमति के republication के लिए site content की bulk copying न करें।'),
                ],
            },
            {
                heading: lt('3. External Content', '3. External content'),
                paragraphs: [
                    lt(
                        'Playable embeds, videos, outbound links, game logos, and trademarks may be controlled by third parties. SkillWarz is not responsible for the availability or policies of external services.',
                        'Playable embeds, videos, outbound links, game logos और trademarks third parties के नियंत्रण में हो सकते हैं। External services की availability या policies के लिए SkillWarz जिम्मेदार नहीं है।'
                    ),
                ],
            },
            {
                heading: lt('4. Intellectual Property', '4. Intellectual property'),
                paragraphs: [
                    lt(
                        'Original site copy, page organization, and editorial content on SkillWarz belong to the site operator unless otherwise stated. Game brands, screenshots, and embedded content remain the property of their respective owners.',
                        'जब तक अलग से न कहा जाए, SkillWarz की original site copy, page organization और editorial content site operator की है। Game brands, screenshots और embedded content अपने-अपने owners की property बने रहते हैं।'
                    ),
                ],
            },
            {
                heading: lt('5. No Warranty', '5. कोई वारंटी नहीं'),
                paragraphs: [
                    lt(
                        'The website is provided on an "as is" and "as available" basis. We do not guarantee uninterrupted availability, error-free operation, or continued access to third-party game embeds.',
                        'यह website "as is" और "as available" आधार पर प्रदान की जाती है। हम uninterrupted availability, error-free operation या third-party game embeds तक लगातार access की गारंटी नहीं देते।'
                    ),
                ],
            },
            {
                heading: lt('6. Limitation of Liability', '6. Liability की सीमा'),
                paragraphs: [
                    lt(
                        'To the fullest extent allowed by law, SkillWarz is not liable for losses arising from use of the site, reliance on site content, or third-party services reached through the site.',
                        'कानून द्वारा अनुमति प्राप्त अधिकतम सीमा तक, SkillWarz site के उपयोग, site content पर भरोसे या site के माध्यम से प्राप्त third-party services से होने वाले नुकसान के लिए जिम्मेदार नहीं है।'
                    ),
                ],
            },
            {
                heading: lt('7. Changes', '7. बदलाव'),
                paragraphs: [
                    lt(
                        'These terms may be updated as the site changes. Continued use of the site after updates means you accept the revised terms.',
                        'Site में बदलाव के साथ ये terms अपडेट हो सकती हैं। Updates के बाद site का उपयोग जारी रखने का मतलब है कि आप revised terms स्वीकार करते हैं।'
                    ),
                ],
            },
            {
                heading: lt('8. Contact', '8. संपर्क'),
                paragraphs: [
                    lt(`Questions about these terms can be sent to ${SITE.email}.`, `इन terms से जुड़े प्रश्न ${SITE.email} पर भेजे जा सकते हैं।`),
                ],
            },
        ],
    },
    {
        slug: 'dmca.html',
        title: lt('DMCA Notice and Takedown Policy', 'DMCA notice और takedown policy'),
        description: lt(
            'Read the SkillWarz DMCA policy and learn how to submit copyright removal requests.',
            'SkillWarz की DMCA policy पढ़ें और copyright removal requests कैसे भेजें, यह जानें।'
        ),
        intro: lt(
            `SkillWarz respects intellectual property rights. If you believe material on this site infringes your copyright, send a notice to ${SITE.email}.`,
            `SkillWarz intellectual property rights का सम्मान करता है। अगर आपको लगता है कि इस site पर मौजूद सामग्री आपके copyright का उल्लंघन करती है, तो ${SITE.email} पर notice भेजें।`
        ),
        sections: [
            {
                heading: lt('Include The Following', 'इन बातों को शामिल करें'),
                listType: 'ol',
                bullets: [
                    lt('Your full name and contact information.', 'आपका पूरा नाम और contact information।'),
                    lt('The exact page URL or URLs involved.', 'संबंधित page URL या URLs।'),
                    lt('A description of the copyrighted work you believe is affected.', 'उस copyrighted work का विवरण जिसे आप प्रभावित मानते हैं।'),
                    lt('A statement that you have a good-faith belief the use is not authorized.', 'यह बयान कि आपको good-faith belief है कि यह उपयोग authorized नहीं है।'),
                    lt('A statement, under penalty of perjury, that the information in the notice is accurate and that you are the copyright owner or authorized to act on their behalf.', 'Perjury के दंड के तहत यह बयान कि notice में दी गई जानकारी सही है और आप copyright owner हैं या उनकी ओर से कार्य करने के लिए authorized हैं।'),
                    lt('Your physical or electronic signature.', 'आपका physical या electronic signature।'),
                ],
            },
            {
                heading: lt('Response Process', 'Response process'),
                paragraphs: [
                    lt(
                        'We review notices as quickly as reasonably possible and may remove or disable access to the identified material while a claim is reviewed.',
                        'हम notices की यथासंभव जल्दी समीक्षा करते हैं और claim की समीक्षा के दौरान पहचानी गई सामग्री तक access हटा या बंद कर सकते हैं।'
                    ),
                ],
            },
            {
                heading: lt('Counter Notice', 'Counter notice'),
                paragraphs: [
                    lt(
                        'If you believe content was removed in error, you may send a counter notice to the same address with your contact details, the affected URL, and the basis for your objection.',
                        'अगर आपको लगता है कि content गलती से हटाई गई है, तो आप उसी address पर अपने contact details, प्रभावित URL और आपत्ति के आधार के साथ counter notice भेज सकते हैं।'
                    ),
                ],
            },
        ],
    },
];

const INDEXABLE_GAME_PATHS = new Set([
    'Action/Revoxel_3D_-_Voxel_RPG_Shooter.html',
    'BattleRoyale/Doge_s_Battle_Royale.html',
    'BattleRoyale/Top_Guns_IO.html',
    'FPS/Hazmob_FPS.html',
    'FPS/Command_Strike_FPS.html',
    'FPS/Crab_Guards.html',
    'FPS/Real_Shooting_Fps_Strike.html',
    'Sniper/Counter_Craft_Sniper.html',
    'Sniper/Gun_Shooting_Games_Sniper_3D.html',
    'Sniper/Mafia_Sniper_Crime_Shooting.html',
]);

const INDEXED_GAME_DETAIL_COPY = {
    'Action/Revoxel_3D_-_Voxel_RPG_Shooter.html': 'Revoxel 3D stands out from the rest of the indexed set because its voxel presentation and light RPG framing make the page read more like a progression-focused shooter overview than a standard round-based match.',
    'BattleRoyale/Doge_s_Battle_Royale.html': 'Doge\'s Battle Royale reads as a lighter, more novelty-driven survival page, so the summary focuses on meme-styled presentation and casual battle royale pacing instead of serious esports framing.',
    'BattleRoyale/Top_Guns_IO.html': 'Top Guns IO is differentiated around aerial combat language, with the page positioned for visitors who want browser battle royale pressure through jet fights and faster high-altitude movement.',
    'FPS/Hazmob_FPS.html': 'Hazmob FPS is one of the more direct competitive entries in the set, so the copy emphasizes match flow, aiming rhythm, and whether the browser session feels suitable for repeat PvP rounds.',
    'FPS/Command_Strike_FPS.html': 'Command Strike FPS is framed as a straightforward military-style browser shooter, making the page more useful for players who want familiar FPS structure without extra progression systems to parse first.',
    'FPS/Crab_Guards.html': 'Crab Guards gets more personality-led copy because the title and art direction suggest a less standard shooter theme, which helps the page avoid sounding interchangeable with the other modern FPS entries.',
    'FPS/Real_Shooting_Fps_Strike.html': 'Real Shooting Fps Strike is presented as a no-frills entry for visitors comparing core gunplay pages, with the summary centered on direct access, readable controls, and quick session testing.',
    'Sniper/Counter_Craft_Sniper.html': 'Counter Craft Sniper is described through its blocky craft-inspired presentation and distance-shot focus, which separates it clearly from the site\'s conventional military sniper pages.',
    'Sniper/Gun_Shooting_Games_Sniper_3D.html': 'Gun Shooting Games Sniper 3D is positioned as a simpler patience-and-accuracy page, helping visitors decide whether they want a slower sniper session rather than a multi-mode arcade shooter.',
    'Sniper/Mafia_Sniper_Crime_Shooting.html': 'Mafia Sniper Crime Shooting is framed around mission flavor and urban crime-theme targeting, giving the page a more scenario-based identity than the other indexed sniper entries.',
};

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
        indexable: false,
    },
];

const PLAY_STYLE_COPY = {
    sniper: lt('slow-angle precision and patient line-of-sight control', 'धीमी angle precision और patient line-of-sight control'),
    battleRoyale: lt('survival pressure, positioning, and endgame decision making', 'survival pressure, positioning और endgame decision making'),
    fps: lt('fast firefights, direct aim duels, and quick respawn practice', 'तेज firefights, direct aim duels और quick respawn practice'),
    zombie: lt('wave pressure and short-range weapon upgrades', 'wave pressure और short-range weapon upgrades'),
    revoxel: lt('exploration mixed with shooter progression and a lighter RPG loop', 'exploration, shooter progression और हल्के RPG loop का मिश्रण'),
    default: lt('easy-to-start browser action with a clear core loop and readable controls', 'आसान शुरुआत वाला browser action, clear core loop और readable controls'),
};

const VISUAL_STYLE_COPY = {
    pixel: lt('blocky or pixel-style presentation', 'blocky या pixel-style presentation'),
    fantasy: lt('theme-heavy combat scenarios with a stronger fantasy or sci-fi feel', 'theme-heavy combat scenarios जिनमें fantasy या sci-fi feel ज्यादा हो'),
    military: lt('a direct combat theme built around weapons, targets, and pressure', 'weapons, targets और pressure पर आधारित direct combat theme'),
    default: lt('a lightweight browser presentation that favors quick load times over cinematic complexity', 'हल्का browser presentation जो cinematic complexity से ज्यादा quick load times पर जोर देता है'),
};

const AUDIENCE_COPY = {
    sniper: lt('players who prefer precision and measured pacing over constant rushing', 'वे खिलाड़ी जो constant rushing से ज्यादा precision और measured pacing पसंद करते हैं'),
    battleRoyale: lt('players who enjoy higher-stakes rounds and positioning pressure', 'वे खिलाड़ी जिन्हें higher-stakes rounds और positioning pressure पसंद है'),
    fps: lt('players who want straightforward browser shooting reps and quick match resets', 'वे खिलाड़ी जो straightforward browser shooting reps और quick match resets चाहते हैं'),
    default: lt('visitors who want a fast browser session without a long setup process', 'वे visitors जो लंबे setup के बिना तेज browser session चाहते हैं'),
};

const SKILL_COPY = {
    sniper: lt('steady aim and sightline discipline', 'steady aim और sightline discipline'),
    battleRoyale: lt('positioning and late-round decision making', 'positioning और late-round decision making'),
    fps: lt('crosshair placement and reaction speed', 'crosshair placement और reaction speed'),
    route: lt('route recognition inside simpler, readable maps', 'सरल और readable maps में route recognition'),
    threat: lt('threat prioritization when multiple targets stack pressure', 'जब कई targets pressure बनाएं, तब threat prioritization'),
    default: lt('basic movement, timing, and pattern recognition', 'basic movement, timing और pattern recognition'),
};

const CATEGORY_EXPECTATION_COPY = {
    FPS: lt(
        'Most FPS visitors care about weapon feel, route clarity, and how quickly they can reset after a mistake.',
        'ज्यादातर FPS visitors weapon feel, route clarity और गलती के बाद कितनी जल्दी reset किया जा सकता है, इन बातों की परवाह करते हैं।'
    ),
    Sniper: lt(
        'Most sniper visitors care about patience, visibility, and whether the pace leaves room for deliberate shots.',
        'ज्यादातर sniper visitors patience, visibility और यह कि pace deliberate shots के लिए जगह देती है या नहीं, इन बातों की परवाह करते हैं।'
    ),
    BattleRoyale: lt(
        'Battle royale visitors usually care about survival rhythm, map movement, and the tension of longer rounds.',
        'Battle royale visitors आमतौर पर survival rhythm, map movement और लंबे rounds की tension की परवाह करते हैं।'
    ),
    Multiplayer: lt(
        'Multiplayer visitors usually care about how quickly the game becomes social or competitive without a long onboarding step.',
        'Multiplayer visitors आमतौर पर इस बात की परवाह करते हैं कि लंबी onboarding के बिना game कितनी जल्दी social या competitive बनती है।'
    ),
    Action: lt(
        'Action visitors usually care about immediate readability and whether the game loop becomes fun within the first few minutes.',
        'Action visitors आमतौर पर immediate readability और यह कि game loop शुरुआती कुछ मिनटों में मजेदार बनती है या नहीं, इस बात की परवाह करते हैं।'
    ),
    default: lt(
        'Browser players usually care about low-friction sessions and easy-to-read mechanics.',
        'Browser players आमतौर पर low-friction sessions और easy-to-read mechanics की परवाह करते हैं।'
    ),
};

function t(locale, value) {
    if (Array.isArray(value)) {
        return value.map((item) => t(locale, item));
    }
    if (value && typeof value === 'object' && Object.prototype.hasOwnProperty.call(value, 'en')) {
        return value[locale.code] ?? value.en;
    }
    return value;
}

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

function normalizePagePath(pagePath) {
    return pagePath || 'index.html';
}

function localizedOutputPath(locale, pagePath) {
    const normalized = normalizePagePath(pagePath);
    return locale.baseDir ? `${locale.baseDir}/${normalized}` : normalized;
}

function publicAssetUrl(assetPath) {
    return `${SITE.url}/${assetPath.replace(/\\/g, '/')}`;
}

function publicUrl(locale, pagePath) {
    const normalized = normalizePagePath(pagePath);
    if (normalized === 'index.html') {
        return locale.baseDir ? `${SITE.url}/${locale.baseDir}/` : `${SITE.url}/`;
    }
    return `${SITE.url}/${localizedOutputPath(locale, normalized).replace(/\\/g, '/')}`;
}

function relativePath(fromPath, toPath) {
    const rel = posix.relative(posix.dirname(fromPath), toPath);
    return rel || posix.basename(toPath);
}

function sameLocaleHref(locale, fromPagePath, toPagePath, anchor = '') {
    const fromOutput = localizedOutputPath(locale, fromPagePath);
    const toOutput = localizedOutputPath(locale, toPagePath);
    return `${relativePath(fromOutput, toOutput)}${anchor ? `#${anchor}` : ''}`;
}

function crossLocaleHref(fromLocale, fromPagePath, toLocale, toPagePath) {
    const fromOutput = localizedOutputPath(fromLocale, fromPagePath);
    const toOutput = localizedOutputPath(toLocale, toPagePath);
    return relativePath(fromOutput, toOutput);
}

function assetHref(locale, pagePath, assetPath) {
    const fromOutput = localizedOutputPath(locale, pagePath);
    return relativePath(fromOutput, assetPath);
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

function getDatasetByCategory(category) {
    return DATASETS.find((dataset) => dataset.dir === category);
}

function getCategoryLabel(category, locale) {
    const dataset = getDatasetByCategory(category);
    return dataset ? t(locale, dataset.label) : category;
}

function getCategoryIntro(category, locale) {
    const dataset = getDatasetByCategory(category);
    return dataset ? t(locale, dataset.intro) : '';
}

function pageWord(locale, count) {
    if (locale.code === 'hi') {
        return 'पेज';
    }
    return count === 1 ? 'page' : 'pages';
}

function editorialCountText(locale, count) {
    if (locale.code === 'hi') {
        return `${count} एडिटोरियल ${pageWord(locale, count)}`;
    }
    return `${count} editorial ${pageWord(locale, count)}`;
}

function jumpCountText(locale, featuredCount, supportCount) {
    if (locale.code === 'hi') {
        return `${featuredCount} फ़ीचर्ड ${pageWord(locale, featuredCount)} और ${supportCount} सहायक ${pageWord(locale, supportCount)}।`;
    }
    return `${featuredCount} featured ${pageWord(locale, featuredCount)} and ${supportCount} support ${pageWord(locale, supportCount)}.`;
}

function supportNoteText(locale, supportCount) {
    if (locale.code === 'hi') {
        return `${supportCount} अतिरिक्त सहायक ${pageWord(locale, supportCount)} इस श्रेणी में मौजूद हैं, लेकिन जब तक गहरी मौलिक कवरेज तैयार नहीं होती, वे noindex और मुख्य review path से बाहर रहेंगे।`;
    }
    return `${supportCount} additional support ${pageWord(locale, supportCount)} exist in this category, but they remain noindex and off the main review path until deeper original coverage is ready.`;
}

function noFlagshipText(locale) {
    if (locale.code === 'hi') {
        return 'इस श्रेणी में अभी कोई प्रमुख editorial page सामने नहीं रखी जा रही है। मजबूत original writeups तैयार होने तक support entries कम महत्व के साथ रहेंगी।';
    }
    return 'No flagship editorial page is being surfaced in this category yet. Support entries remain de-emphasized until stronger original writeups are ready.';
}

function standardHead({
    locale,
    pagePath,
    title,
    description,
    ogTitle,
    ogDescription,
    ogImage = 'img/skillwarz.avif',
    robots = 'index, follow, max-image-preview:large',
}) {
    const canonical = publicUrl(locale, pagePath);
    const alternateLinks = LOCALES.map((item) => `    <link rel="alternate" hreflang="${item.code}" href="${escapeHtml(publicUrl(item, pagePath))}">`).join('\n');

    return `    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}">
    <meta name="robots" content="${escapeHtml(robots)}">
    <meta name="author" content="${escapeHtml(SITE.author)}">
    <link rel="canonical" href="${escapeHtml(canonical)}">
${alternateLinks}
    <link rel="alternate" hreflang="x-default" href="${escapeHtml(publicUrl(LOCALE_MAP.en, pagePath))}">
    <meta property="og:title" content="${escapeHtml(ogTitle || title)}">
    <meta property="og:description" content="${escapeHtml(ogDescription || description)}">
    <meta property="og:type" content="website">
    <meta property="og:url" content="${escapeHtml(canonical)}">
    <meta property="og:image" content="${escapeHtml(publicAssetUrl(ogImage))}">
    <meta property="og:site_name" content="${escapeHtml(SITE.name)}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${escapeHtml(ogTitle || title)}">
    <meta name="twitter:description" content="${escapeHtml(ogDescription || description)}">
    <meta name="twitter:image" content="${escapeHtml(publicAssetUrl(ogImage))}">
    <meta name="google-adsense-account" content="${escapeHtml(SITE.adsensePublisher)}">
    <link rel="icon" type="image/svg+xml" href="${assetHref(locale, pagePath, 'favicon.svg')}">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="${assetHref(locale, pagePath, 'css/css.css')}">
    <link rel="stylesheet" href="${assetHref(locale, pagePath, 'css/content.css')}">
${analyticsSnippet()}`;
}

function buildHeader(locale, pagePath, activeKey = '') {
    const navItems = [
        { key: 'home', href: sameLocaleHref(locale, pagePath, 'index.html'), label: t(locale, UI.home) },
        { key: 'guides', href: sameLocaleHref(locale, pagePath, 'skillwarz-beginner-guide.html'), label: t(locale, UI.guides) },
        { key: 'fps', href: sameLocaleHref(locale, pagePath, 'categories.html', 'fps'), label: t(locale, UI.fps) },
        { key: 'battle-royale', href: sameLocaleHref(locale, pagePath, 'categories.html', 'battle-royale'), label: t(locale, UI.battleRoyale) },
        { key: 'sniper', href: sameLocaleHref(locale, pagePath, 'categories.html', 'sniper'), label: t(locale, UI.sniper) },
        { key: 'multiplayer', href: sameLocaleHref(locale, pagePath, 'categories.html', 'multiplayer'), label: t(locale, UI.multiplayer) },
    ];

    const nav = navItems.map((item) => {
        const active = item.key === activeKey ? ' nav-item active' : ' nav-item';
        return `<a href="${item.href}" class="${active.trim()}">${escapeHtml(item.label)}</a>`;
    }).join('\n            ');

    const languageSwitch = LOCALES.map((targetLocale) => {
        const activeClass = targetLocale.code === locale.code ? ' lang-switch-link active' : ' lang-switch-link';
        return `<a href="${crossLocaleHref(locale, pagePath, targetLocale, pagePath)}" class="${activeClass.trim()}" lang="${targetLocale.lang}">${escapeHtml(targetLocale.switchLabel)}</a>`;
    }).join('');

    const mobileMenuId = `mobile-menu-${slugFromName(pagePath.replace(/[^a-z0-9]+/gi, '-')) || 'home'}`;

    return `<header class="header">
        <div class="header-main">
            <a href="${sameLocaleHref(locale, pagePath, 'index.html')}" class="logo">
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
            <button
                class="mobile-menu-toggle"
                type="button"
                data-mobile-menu-toggle="${mobileMenuId}"
                aria-expanded="false"
                aria-controls="${mobileMenuId}"
                aria-label="${escapeHtml(t(locale, UI.menu))}"
            >
                <span class="mobile-menu-toggle-label">${escapeHtml(t(locale, UI.menu))}</span>
                <span class="mobile-menu-toggle-bars" aria-hidden="true">
                    <span></span>
                    <span></span>
                    <span></span>
                </span>
            </button>
        </div>
        <nav class="nav-categories nav-categories-desktop">
            ${nav}
        </nav>
        <div class="header-tools header-tools-desktop">
            <a href="${sameLocaleHref(locale, pagePath, 'contact.html')}" class="header-pill"><i class="fas fa-envelope"></i>${escapeHtml(t(locale, UI.supportContact))}</a>
            <a href="${sameLocaleHref(locale, pagePath, 'categories.html')}" class="header-pill secondary"><i class="fas fa-layer-group"></i>${escapeHtml(t(locale, UI.curatedCatalog))}</a>
            <div class="lang-switch" aria-label="${escapeHtml(t(locale, UI.language))}">
                <span class="lang-switch-label">${escapeHtml(t(locale, UI.language))}</span>
                <div class="lang-switch-links">${languageSwitch}</div>
            </div>
        </div>
        <div class="mobile-menu-panel" id="${mobileMenuId}" hidden>
            <div class="mobile-menu-card">
                <div class="mobile-menu-header">
                    <strong>${escapeHtml(t(locale, UI.menuLabel))}</strong>
                    <button
                        class="mobile-menu-close"
                        type="button"
                        data-mobile-menu-toggle="${mobileMenuId}"
                        aria-expanded="true"
                        aria-controls="${mobileMenuId}"
                        aria-label="${escapeHtml(t(locale, UI.closeMenu))}"
                    ><i class="fas fa-times"></i></button>
                </div>
                <nav class="mobile-nav-list">
                    ${nav}
                </nav>
                <div class="mobile-menu-meta">
                    <div class="mobile-menu-section-label">${escapeHtml(t(locale, UI.mobileActions))}</div>
                    <div class="mobile-menu-actions">
                        <a href="${sameLocaleHref(locale, pagePath, 'contact.html')}" class="header-pill"><i class="fas fa-envelope"></i>${escapeHtml(t(locale, UI.supportContact))}</a>
                        <a href="${sameLocaleHref(locale, pagePath, 'categories.html')}" class="header-pill secondary"><i class="fas fa-layer-group"></i>${escapeHtml(t(locale, UI.curatedCatalog))}</a>
                    </div>
                    <div class="lang-switch mobile-lang-switch" aria-label="${escapeHtml(t(locale, UI.language))}">
                        <span class="lang-switch-label">${escapeHtml(t(locale, UI.language))}</span>
                        <div class="lang-switch-links">${languageSwitch}</div>
                    </div>
                </div>
            </div>
        </div>
    </header>`;
}

function buildFooter(locale, pagePath) {
    return `<footer class="footer">
        <div class="footer-links">
            <a href="${sameLocaleHref(locale, pagePath, 'about.html')}">${escapeHtml(t(locale, UI.about))}</a>
            <a href="${sameLocaleHref(locale, pagePath, 'contact.html')}">${escapeHtml(t(locale, UI.contact))}</a>
            <a href="${sameLocaleHref(locale, pagePath, 'dmca.html')}">DMCA</a>
            <a href="${sameLocaleHref(locale, pagePath, 'privacy.html')}">${escapeHtml(t(locale, UI.privacyPolicy))}</a>
            <a href="${sameLocaleHref(locale, pagePath, 'terms.html')}">${escapeHtml(t(locale, UI.termsOfService))}</a>
        </div>
        <div class="footer-copyright">&copy; 2026 SkillWarz - ${escapeHtml(t(locale, UI.footerCopy))}</div>
        <div class="footer-meta">${escapeHtml(t(locale, UI.editorialContact))}: <a href="mailto:${SITE.email}">${SITE.email}</a></div>
    </footer>`;
}

function tagList(tags, limit = 4) {
    return (tags || []).slice(0, limit).map((tag) => `<span>${escapeHtml(tag)}</span>`).join('');
}

function gameCategoryBadge(locale, game) {
    return `<span class="catalog-badge"><i class="fas fa-tag"></i>${escapeHtml(getCategoryLabel(game.category, locale))}</span>`;
}

function gameSearchStatus(locale, game) {
    return game.indexable
        ? `<span class="meta-badge"><i class="fas fa-compass"></i>${escapeHtml(t(locale, UI.editorialPage))}</span>`
        : `<span class="meta-badge warn"><i class="fas fa-wrench"></i>${escapeHtml(t(locale, UI.supportPage))}</span>`;
}

function inferPlayStyleKey(game) {
    const name = game.name.toLowerCase();
    if (name.includes('sniper')) return 'sniper';
    if (name.includes('battle royale') || name.includes('royale')) return 'battleRoyale';
    if (name.includes('fps') || name.includes('shooter') || name.includes('strike')) return 'fps';
    if (name.includes('zombie')) return 'zombie';
    if (name.includes('revoxel')) return 'revoxel';
    return 'default';
}

function inferVisualStyleKey(game) {
    const name = game.name.toLowerCase();
    if (/(pixel|block|craft|cube|mine)/.test(name)) return 'pixel';
    if (/(dragon|alien|nightmare)/.test(name)) return 'fantasy';
    if (/(army|swat|mercenary|command|strike|sniper|mafia)/.test(name)) return 'military';
    return 'default';
}

function inferAudienceKey(game) {
    const name = game.name.toLowerCase();
    if (/(sniper|target)/.test(name)) return 'sniper';
    if (/(battle royale|survival|elimination|royale)/.test(name)) return 'battleRoyale';
    if (/(fps|shooter|strike|assault|war|attack)/.test(name)) return 'fps';
    return 'default';
}

function inferSkillsKeys(game) {
    const name = game.name.toLowerCase();
    const items = [];
    if (/(sniper|target)/.test(name)) items.push('sniper');
    if (/(battle royale|royale|survive)/.test(name)) items.push('battleRoyale');
    if (/(fps|shooter|strike|assault|war|attack)/.test(name)) items.push('fps');
    if (/(pixel|block|craft|mine|cube)/.test(name)) items.push('route');
    if (/(zombie|dragon|alien)/.test(name)) items.push('threat');
    if (items.length === 0) items.push('default');
    return items;
}

function inferPlayStyle(locale, game) {
    return t(locale, PLAY_STYLE_COPY[inferPlayStyleKey(game)]);
}

function inferVisualStyle(locale, game) {
    return t(locale, VISUAL_STYLE_COPY[inferVisualStyleKey(game)]);
}

function inferAudience(locale, game) {
    return t(locale, AUDIENCE_COPY[inferAudienceKey(game)]);
}

function inferSkills(locale, game) {
    return inferSkillsKeys(game).map((key) => t(locale, SKILL_COPY[key]));
}

function inferWarnings(locale, game) {
    const notes = [];
    if (!game.indexable) {
        notes.push(locale.code === 'hi'
            ? 'यह पेज अभी support catalog page के रूप में बना हुआ है, जबकि हम original editorial coverage को बढ़ा रहे हैं।'
            : 'This page remains a supporting catalog page while we expand original editorial coverage.');
    }
    if (game.category === 'Action' || game.category === 'Multiplayer') {
        notes.push(locale.code === 'hi'
            ? 'यह game साइट के मुख्य shooter focus के पास है, इसलिए इस पेज को flagship review की जगह supporting content की तरह माना जाता है।'
            : 'The game is adjacent to the main shooter focus of the site, so the page is treated as supporting content rather than a flagship review.');
    }
    notes.push(locale.code === 'hi'
        ? 'Playable browser embeds उपलब्ध होने पर third-party distribution partner के माध्यम से दिए जा सकते हैं।'
        : 'Playable browser embeds may be provided by a third-party distribution partner when available.');
    return notes;
}

function buildGameSummary(locale, game) {
    const style = inferPlayStyle(locale, game);
    const visual = inferVisualStyle(locale, game);
    const audience = inferAudience(locale, game);
    const specific = gameSpecificSnippet(game);

    if (locale.code === 'hi') {
        return [
            `${game.name} को SkillWarz पर ऐसे browser game के रूप में सूचीबद्ध किया गया है जो ${style} पर आधारित है।`,
            `यह पेज उन visitors के लिए लिखा गया है जो session शुरू करने से पहले जल्दी समझना चाहते हैं कि यह game ${audience} के लिए कितना उपयुक्त है।`,
            `भारी native downloads की तुलना में यह title ${visual} पर ज्यादा निर्भर करता है, इसलिए आमतौर पर इसे जल्दी खोला जा सकता है और setup friction कम रहता है।`,
        ];
    }

    return [
        `${game.name} is cataloged on SkillWarz as a browser game built around ${style}.`,
        `The page is written for visitors who want a quick read before launching a session, especially when deciding whether the game fits ${audience}.`,
        specific || `Compared with heavier native downloads, this title leans on ${visual}, which usually means faster access and lower setup friction.`,
    ];
}

function buildGameExpectations(locale, game) {
    const categoryNote = t(locale, CATEGORY_EXPECTATION_COPY[game.category] || CATEGORY_EXPECTATION_COPY.default);

    if (locale.code === 'hi') {
        return [
            categoryNote,
            `${game.name} के लिए मुख्य सवाल यह है कि क्या पहला session अपना core loop इतनी स्पष्टता से दिखाता है कि opening minute के बाद भी आप game में बने रहें।`,
        ];
    }

    return [
        categoryNote,
        `For ${game.name}, the main question is whether the first session communicates its loop clearly enough to keep you in the game after the opening minute.`,
    ];
}

function buildGameBullets(locale, game) {
    const skills = inferSkills(locale, game);

    if (locale.code === 'hi') {
        return [
            `मुख्य feel: ${inferPlayStyle(locale, game)}।`,
            `दृश्य दिशा: ${inferVisualStyle(locale, game)}।`,
            `सबसे अच्छा fit: ${inferAudience(locale, game)}।`,
            `मुख्य सुधार क्षेत्र: ${skills.join(', ')}।`,
        ];
    }

    return [
        `Core feel: ${inferPlayStyle(locale, game)}.`,
        `Visual direction: ${inferVisualStyle(locale, game)}.`,
        `Best fit: ${inferAudience(locale, game)}.`,
        `Primary improvement area: ${skills.join(', ')}.`,
    ];
}

function buildCatalogCard(locale, pagePath, game) {
    const href = sameLocaleHref(locale, pagePath, game.link);
    const imageHref = assetHref(locale, pagePath, game.imageUrl);
    const summary = buildGameSummary(locale, game)[0];

    return `<article class="catalog-card">
        <img src="${imageHref}" alt="${escapeHtml(game.name)}" loading="lazy">
        <div class="catalog-card-body">
            <div class="catalog-card-top">
                <h3>${escapeHtml(game.name)}</h3>
                ${gameSearchStatus(locale, game)}
            </div>
            ${gameCategoryBadge(locale, game)}
            <p>${escapeHtml(summary)}</p>
            <div class="catalog-tags">${tagList(game.tags, 4)}</div>
            <a class="catalog-link" href="${href}">${escapeHtml(t(locale, UI.openPage))}</a>
        </div>
    </article>`;
}

function buildRelatedCard(locale, pagePath, game) {
    return `<a class="related-card" href="${sameLocaleHref(locale, pagePath, game.link)}">
        <img src="${assetHref(locale, pagePath, game.imageUrl)}" alt="${escapeHtml(game.name)}" loading="lazy">
        <span>${escapeHtml(game.name)}</span>
    </a>`;
}

function buildGuideCard(locale, pagePath, guide) {
    return `<article class="guide-card">
        <h3><a href="${sameLocaleHref(locale, pagePath, guide.slug)}">${escapeHtml(t(locale, guide.title))}</a></h3>
        <p>${escapeHtml(t(locale, guide.description))}</p>
    </article>`;
}

function buildDeferredPlayShell({
    locale,
    pagePath,
    shellId,
    iframeUrl,
    title,
    imageUrl,
    imageAlt,
    heading,
    description,
    buttonLabel,
    disclosure,
    secondaryHref = '',
    secondaryLabel = '',
}) {
    const secondaryLink = secondaryHref && secondaryLabel
        ? `<a class="button-link secondary" href="${secondaryHref}">${escapeHtml(secondaryLabel)}</a>`
        : '';

    return `<div class="game-showcase deferred-play-shell">
        <div class="game-frame play-frame-shell" id="${shellId}">
            <div class="play-placeholder">
                <img src="${assetHref(locale, pagePath, imageUrl)}" class="play-placeholder-thumb" alt="${escapeHtml(imageAlt)}" loading="lazy">
                <div class="play-placeholder-copy">
                    <span class="play-kicker">${escapeHtml(t(locale, UI.userInitiatedSession))}</span>
                    <h3>${escapeHtml(heading)}</h3>
                    <p>${escapeHtml(description)}</p>
                    <div class="play-mobile-note">
                        <strong>${escapeHtml(locale.code === 'hi' ? 'मोबाइल-फ्रेंडली' : 'Mobile-friendly')}</strong>
                        <span>${escapeHtml(t(locale, UI.mobilePlayNote))}</span>
                    </div>
                    <div class="button-row">
                        <button
                            class="button-link play-trigger"
                            type="button"
                            data-play-target="${shellId}"
                            data-iframe-url="${escapeHtml(iframeUrl)}"
                            data-iframe-title="${escapeHtml(title)}"
                            data-expand-target="${shellId}-expand"
                        ><i class="fas fa-play"></i><span class="play-trigger-label-desktop">${escapeHtml(buttonLabel)}</span><span class="play-trigger-label-mobile">${escapeHtml(t(locale, UI.mobileOpenPlay))}</span></button>
                        ${secondaryLink}
                    </div>
                    <div class="play-status">${escapeHtml(locale.code === 'hi' ? 'Playable frame तभी लोड होगा जब visitor इसे खोलने का निर्णय करेगा।' : 'The playable frame loads only after the visitor chooses to open it.')}</div>
                </div>
            </div>
        </div>
        <div class="game-controls">
            <div class="game-title-section">
                <img src="${assetHref(locale, pagePath, imageUrl)}" class="game-icon" alt="${escapeHtml(imageAlt)}">
                <div class="game-title-copy">
                    <span class="game-title">${escapeHtml(title)}</span>
                    <span class="game-title-note">${escapeHtml(t(locale, UI.mobilePlaySummary))}</span>
                </div>
            </div>
            <div class="game-actions">
                <button
                    class="game-action-button"
                    type="button"
                    id="${shellId}-expand"
                    data-fullscreen-target="${shellId}"
                    hidden
                    aria-hidden="true"
                ><i class="fas fa-expand"></i><span>${escapeHtml(t(locale, UI.fullscreen))}</span></button>
            </div>
        </div>
        <div class="embed-note">${escapeHtml(disclosure)}</div>
        <div class="mobile-play-disclaimer">${escapeHtml(t(locale, UI.mobilePlayExplain))}</div>
    </div>`;
}

function buildPlayActivationScript(locale) {
    const loadedLabel = JSON.stringify(t(locale, UI.sessionLoaded));

    return `<script>
(function () {
    function setMenuState(panel, isOpen, trigger) {
        panel.hidden = !isOpen;
        document.body.classList.toggle('mobile-menu-open', isOpen);
        if (trigger) {
            trigger.setAttribute('aria-expanded', String(isOpen));
        }

        const triggers = document.querySelectorAll('[data-mobile-menu-toggle="' + panel.id + '"]');
        triggers.forEach(function (item) {
            item.setAttribute('aria-expanded', String(isOpen));
        });
    }

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
        trigger.innerHTML = '<i class="fas fa-check"></i>' + ${loadedLabel};

        const expandButton = document.getElementById(trigger.getAttribute('data-expand-target'));
        if (expandButton) {
            expandButton.hidden = false;
            expandButton.removeAttribute('aria-hidden');
        }
    }

    document.addEventListener('click', function (event) {
        const menuTrigger = event.target.closest('[data-mobile-menu-toggle]');
        if (menuTrigger) {
            const panel = document.getElementById(menuTrigger.getAttribute('data-mobile-menu-toggle'));
            if (panel) {
                setMenuState(panel, panel.hidden, menuTrigger);
            }
            return;
        }

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

    document.addEventListener('keydown', function (event) {
        if (event.key !== 'Escape') {
            return;
        }

        document.querySelectorAll('.mobile-menu-panel').forEach(function (panel) {
            if (!panel.hidden) {
                setMenuState(panel, false);
            }
        });
    });
}());
</script>`;
}

function buildPageLayout({
    locale,
    head,
    bodyClass = '',
    header,
    mainClass = 'main-container',
    mainContent,
    footer,
    extraScripts = '',
}) {
    return `<!DOCTYPE html>
<html lang="${locale.lang}">
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

function slugFromName(name) {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

function shouldIndexGame(game) {
    return INDEXABLE_GAME_PATHS.has(game.link);
}

function gameSpecificSnippet(game) {
    if (game && game.link && INDEXED_GAME_DETAIL_COPY[game.link]) {
        return INDEXED_GAME_DETAIL_COPY[game.link];
    }

    const tags = Array.isArray(game.tags)
        ? game.tags
            .map((tag) => String(tag || '').trim())
            .filter(Boolean)
        : [];

    if (!tags.length) {
        return '';
    }

    const topTags = tags.slice(0, 3).join(', ');
    return `${game.name} is grouped on SkillWarz with tags such as ${topTags}, which helps visitors judge the page theme before opening the playable frame.`;
}

function buildDatasets() {
    const allGames = [];

    for (const dataset of DATASETS) {
        const items = readVarArray(dataset.file, dataset.varName);
        for (const item of items) {
            allGames.push({
                ...item,
                category: dataset.dir,
                categorySlug: dataset.slug,
                indexable: false,
            });
        }
    }

    for (const game of EXTRA_GAMES) {
        allGames.push({ ...game });
    }

    for (const game of allGames) {
        game.indexable = shouldIndexGame(game);
    }

    return allGames;
}

function buildHomePage(locale, homeGame, featuredGames) {
    const pagePath = 'index.html';
    const stats = [
        {
            title: locale.code === 'hi' ? 'मुख्य फोकस' : 'Core focus',
            text: locale.code === 'hi'
                ? 'Browser shooters, sniper games, battle royale picks और quick-start editorial notes।'
                : 'Browser shooters, sniper games, battle royale picks, and quick-start editorial notes.',
        },
        {
            title: locale.code === 'hi' ? 'यह version क्यों महत्वपूर्ण है' : 'Why this version matters',
            text: locale.code === 'hi'
                ? 'Pages को original summaries, cleaner navigation और clearer session-fit guidance के आसपास फिर से बनाया जा रहा है।'
                : 'Pages are being rebuilt around original summaries, cleaner navigation, and clearer session-fit guidance.',
        },
        {
            title: locale.code === 'hi' ? 'सपोर्ट संपर्क' : 'Support contact',
            text: SITE.email,
        },
    ];

    const statCards = stats.map((item) => `<div class="stat-card"><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.text)}</p></div>`).join('');
    const guideCards = GUIDES.map((guide) => buildGuideCard(locale, pagePath, guide)).join('');
    const featuredCards = featuredGames.slice(0, 8).map((game) => buildCatalogCard(locale, pagePath, game)).join('');
    const homePlayShell = buildDeferredPlayShell({
        locale,
        pagePath,
        shellId: 'home-play-shell',
        iframeUrl: homeGame.iframeUrl,
        title: locale.code === 'hi' ? 'SkillWarz ब्राउज़र सेशन' : 'SkillWarz browser session',
        imageUrl: homeGame.imageUrl,
        imageAlt: locale.code === 'hi' ? 'SkillWarz आइकन' : 'SkillWarz icon',
        heading: locale.code === 'hi'
            ? 'जब आप तैयार हों, तभी playable browser session लोड करें'
            : 'Load the playable browser session only when you are ready',
        description: locale.code === 'hi'
            ? 'इससे homepage पहले original guidance पर केंद्रित रहता है और visitor चाहें तो बाद में browser build खोल सकते हैं।'
            : 'This keeps the homepage focused on original guidance first while still letting visitors launch the browser build on demand.',
        buttonLabel: locale.code === 'hi' ? 'Playable browser session लोड करें' : 'Load playable browser session',
        disclosure: locale.code === 'hi'
            ? 'जब उपलब्ध हो, playable browser sessions third-party distribution partner के माध्यम से दी जा सकती हैं। इस साइट का editorial text visitors को controls, genre fit और session style समझाने के लिए स्वतंत्र रूप से लिखा गया है।'
            : 'Playable browser sessions may be delivered through a third-party distribution partner when available. The editorial text on this site is written independently to help visitors understand controls, genre fit, and session style before they play.',
        secondaryHref: sameLocaleHref(locale, pagePath, 'skillwarz-beginner-guide.html'),
        secondaryLabel: locale.code === 'hi' ? 'पहले शुरुआती गाइड पढ़ें' : 'Read the beginner guide first',
    });

    const head = standardHead({
        locale,
        pagePath,
        title: locale.code === 'hi'
            ? 'SkillWarz - ब्राउज़र शूटर गाइड, रिव्यू और चुने हुए प्ले पेज'
            : 'SkillWarz - Browser Shooter Guides, Reviews, and Curated Play Pages',
        description: locale.code === 'hi'
            ? 'SkillWarz एक browser shooter discovery site है जिसमें original SkillWarz guides, चुने हुए FPS picks, battle royale recommendations और editorial game pages शामिल हैं।'
            : 'SkillWarz is a browser shooter discovery site with original SkillWarz guides, curated FPS picks, battle royale recommendations, and editorial game pages.',
        ogTitle: locale.code === 'hi'
            ? 'SkillWarz - ब्राउज़र शूटर गाइड और चुने हुए गेम पेज'
            : 'SkillWarz - Browser Shooter Guides and Curated Game Pages',
        ogDescription: locale.code === 'hi'
            ? 'Original SkillWarz guides पढ़ें, curated shooter pages की तुलना करें और जब तैयार हों तभी browser sessions लोड करें।'
            : 'Read original SkillWarz guides, compare curated shooter pages, and load browser sessions only when you are ready to play.',
        ogImage: 'img/skillwarz.avif',
    });

    const mainContent = `        <div class="main-content">
            <div class="content-section">
                <div class="game-info page-copy">
                    <h1>${escapeHtml(locale.code === 'hi' ? 'SkillWarz ब्राउज़र गाइड और शूटर डिस्कवरी हब' : 'SkillWarz Browser Guide And Shooter Discovery Hub')}</h1>
                    <div class="info-header">${escapeHtml(locale.code === 'hi'
                        ? 'SkillWarz अब thin template content की जगह editorial summaries, browser shooter discovery और clearer category pages पर ध्यान देता है।'
                        : 'SkillWarz now focuses on editorial summaries, browser shooter discovery, and clearer category pages instead of thin template content.')}</div>
                    <div class="hero-grid">
                        <section class="callout-card hero-card hero-card-primary">
                            <p class="lead-copy">${escapeHtml(locale.code === 'hi'
                                ? 'इस साइट का लक्ष्य सरल है: खिलाड़ियों को यह समझने में मदद करना कि वे क्या क्लिक करने वाले हैं, कौन-से games उनके mood के लिए सही हैं, और SkillWarz खुद एक सीखने लायक browser FPS क्यों है।'
                                : 'The goal of this site is simple: help players understand what they are about to click, which games fit their mood, and why SkillWarz itself stands out as a browser FPS worth learning.')}</p>
                            <div class="button-row">
                                <a class="button-link" href="${sameLocaleHref(locale, pagePath, 'skillwarz-beginner-guide.html')}"><i class="fas fa-book-open"></i>${escapeHtml(t(locale, UI.startWithGuide))}</a>
                                <a class="button-link secondary" href="${sameLocaleHref(locale, pagePath, 'categories.html')}"><i class="fas fa-layer-group"></i>${escapeHtml(t(locale, UI.browseAllCategories))}</a>
                            </div>
                            <div class="stat-grid">
                                ${statCards}
                            </div>
                        </section>
                        <aside class="callout-card hero-card hero-card-secondary">
                            <h2>${escapeHtml(locale.code === 'hi' ? 'रिव्यूअर सबसे पहले क्या देखें' : 'What reviewers should see first')}</h2>
                            <p>${escapeHtml(locale.code === 'hi'
                                ? 'SkillWarz अब original guidance, ज्यादा focused shooter-only review path और किसी playable frame के लोड होने से पहले साफ trust signals को आगे रखता है।'
                                : 'SkillWarz now leads with original guidance, a tighter shooter-only review path, and clear trust signals before any playable frame is loaded.')}</p>
                            <ul class="mini-list">
                                <li>${escapeHtml(locale.code === 'hi' ? 'Original guides और comparison articles play trigger के ऊपर रखे गए हैं।' : 'Original guides and comparison articles sit above the play trigger.')}</li>
                                <li>${escapeHtml(locale.code === 'hi' ? 'केवल मजबूत shooter pages को flagship editorial pages के रूप में दिखाया जाता है।' : 'Only stronger shooter pages are surfaced as flagship editorial pages.')}</li>
                                <li>${escapeHtml(locale.code === 'hi' ? 'Coverage बढ़ते समय support pages noindex रहती हैं।' : 'Support pages remain noindex while coverage is expanded and refined.')}</li>
                            </ul>
                        </aside>
                    </div>

                    <div class="section-stack">
                        <section class="section-block">
                            <h2>${escapeHtml(locale.code === 'hi' ? 'SkillWarz क्या है' : 'What SkillWarz Is')}</h2>
                            <p>${escapeHtml(locale.code === 'hi'
                                ? 'SkillWarz को movement-driven browser FPS के रूप में समझना सबसे अच्छा है। यह उन खिलाड़ियों को reward करता है जो अपने routes साफ रखते हैं, fight के बाद angles reset करना सीखते हैं और map movement को combat का हिस्सा मानते हैं।'
                                : 'SkillWarz is best approached as a movement-driven browser FPS. It rewards players who keep their routes clean, learn how to reset angles after a fight, and treat map movement as part of combat instead of something separate from it.')}</p>
                            <p>${escapeHtml(locale.code === 'hi'
                                ? 'जब खिलाड़ी हर duel को panic aim से जीतने की कोशिश छोड़ देता है, तब game ज्यादा मजेदार हो जाती है। बेहतर routing, पहले crosshair placement और simple movement discipline flashy mechanics से तेज सुधार देते हैं।'
                                : 'The game becomes more enjoyable once the player stops trying to win every duel with panic aim alone. Better routing, earlier crosshair placement, and simple movement discipline create faster improvement than flashy mechanics.')}</p>
                            <div class="page-anchor-links">
                                <a href="${sameLocaleHref(locale, pagePath, 'skillwarz-controls-tips.html')}">${escapeHtml(locale.code === 'hi' ? 'Controls और movement टिप्स' : 'Controls and movement tips')}</a>
                                <a href="${sameLocaleHref(locale, pagePath, 'best-browser-shooter-modes.html')}">${escapeHtml(locale.code === 'hi' ? 'Shooter mode गाइड' : 'Shooter mode guide')}</a>
                                <a href="${sameLocaleHref(locale, pagePath, 'browser-fps-vs-battle-royale-guide.html')}">${escapeHtml(locale.code === 'hi' ? 'FPS बनाम battle royale गाइड' : 'FPS vs battle royale guide')}</a>
                            </div>
                        </section>

                        <section class="section-block">
                            <h2>${escapeHtml(locale.code === 'hi' ? 'यह साइट क्यों मौजूद है' : 'Why This Site Exists')}</h2>
                            <p>${escapeHtml(locale.code === 'hi'
                                ? 'वेब पर कई browser game pages visitors को लगभग बिना संदर्भ के सीधे embed में भेज देती हैं। SkillWarz को इस तरह फिर से बनाया जा रहा है कि हर महत्वपूर्ण page genre, expected pace, player fit और यह कि game आपका समय लेनी चाहिए या नहीं, इन सबको पहले समझाए।'
                                : 'Many browser game pages on the web send visitors straight into an embed with almost no context. SkillWarz is being rebuilt so that each important page explains the genre, the expected pace, the player fit, and the reason the game may or may not be worth your time.')}</p>
                            <ul class="mini-list">
                                <li>${escapeHtml(locale.code === 'hi' ? 'Generic one-line descriptions की जगह original quick-take copy।' : 'Original quick-take copy instead of generic one-line descriptions.')}</li>
                                <li>${escapeHtml(locale.code === 'hi' ? 'FPS, sniper और battle royale खिलाड़ियों के लिए cleaner categories।' : 'Cleaner categories for FPS, sniper, and battle royale players.')}</li>
                                <li>${escapeHtml(locale.code === 'hi' ? 'Real contact details और updated policy information वाले support pages।' : 'Support pages with real contact details and updated policy information.')}</li>
                            </ul>
                        </section>

                        <section class="section-block">
                            <h2>${escapeHtml(locale.code === 'hi' ? 'Playable browser session' : 'Playable Browser Session')}</h2>
                            <p>${escapeHtml(locale.code === 'hi'
                                ? 'Visitors अब भी homepage से SkillWarz launch कर सकते हैं, लेकिन browser frame केवल तब लोड होती है जब वे खुद request करें। इससे page पहले original guidance पर केंद्रित रहता है और playable access बाद में आती है।'
                                : 'Visitors can still launch SkillWarz from this homepage, but the browser frame is loaded only after they actively request it. That keeps the page centered on original guidance first and playable access second.')}</p>
                            ${homePlayShell}
                        </section>

                        <section class="section-block">
                            <h2>${escapeHtml(locale.code === 'hi' ? 'Featured guides' : 'Featured Guides')}</h2>
                            <div class="guide-grid">
                                ${guideCards}
                            </div>
                        </section>

                        <section class="section-block">
                            <h2>${escapeHtml(locale.code === 'hi' ? 'Featured browser shooter pages' : 'Featured Browser Shooter Pages')}</h2>
                            <p>${escapeHtml(locale.code === 'hi'
                                ? 'ये वे pages हैं जिन्हें हम मजबूत editorial coverage मान रहे हैं, क्योंकि इनमें category fit ज्यादा साफ है और साइट के मुख्य browser shooter theme से बेहतर मेल है।'
                                : 'These are the pages we are treating as stronger editorial coverage, with tighter category fit and better alignment with the core browser shooter theme of the site.')}</p>
                            <div class="catalog-grid">
                                ${featuredCards}
                            </div>
                        </section>

                        <section class="section-block">
                            <h2>${escapeHtml(locale.code === 'hi' ? 'खेलने से पहले' : 'Before You Play')}</h2>
                            <div class="info-grid">
                                <div class="info-card">
                                    <h3>${escapeHtml(locale.code === 'hi' ? 'पढ़ने लायक लक्ष्य से शुरू करें' : 'Start with readable goals')}</h3>
                                    <p>${escapeHtml(locale.code === 'hi' ? 'हर session में सुधार के लिए एक आदत चुनें: movement resets, aim discipline या route choice।' : 'Pick one habit to improve per session: movement resets, aim discipline, or route choice.')}</p>
                                </div>
                                <div class="info-card">
                                    <h3>${escapeHtml(locale.code === 'hi' ? 'Flicks को ज्यादा महत्व न दें' : 'Do not overvalue flicks')}</h3>
                                    <p>${escapeHtml(locale.code === 'hi' ? 'Crosshair placement और cleaner peeks, flashy emergency aim से ज्यादा wins दिलाते हैं।' : 'Crosshair placement and cleaner peeks usually create more wins than flashy emergency aim.')}</p>
                                </div>
                                <div class="info-card">
                                    <h3>${escapeHtml(locale.code === 'hi' ? 'Category pages को समझदारी से उपयोग करें' : 'Use category pages smartly')}</h3>
                                    <p>${escapeHtml(locale.code === 'hi' ? 'अगर आपको तेज action चाहिए तो FPS से शुरू करें। अगर patience और pressure चाहिए तो sniper या battle royale pages से शुरू करें।' : 'If you want fast action, start with FPS. If you want patience and pressure, start with sniper or battle royale pages.')}</p>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>`;

    return buildPageLayout({
        locale,
        head,
        header: buildHeader(locale, pagePath, 'home'),
        mainContent,
        footer: buildFooter(locale, pagePath),
        extraScripts: buildPlayActivationScript(locale),
    });
}

function buildCategoryPage(locale, allGames) {
    const pagePath = 'categories.html';
    const grouped = DATASETS.map((dataset) => ({
        ...dataset,
        games: allGames.filter((game) => game.category === dataset.dir),
    })).map((group) => ({
        ...group,
        featuredGames: group.games.filter((game) => game.indexable),
        supportGames: group.games.filter((game) => !game.indexable),
    }));

    const jumpCards = grouped.map((group) => `<article class="jump-card">
        <h3><a href="#${group.slug}">${escapeHtml(t(locale, group.label))}</a></h3>
        <p>${escapeHtml(jumpCountText(locale, group.featuredGames.length, group.supportGames.length))}</p>
    </article>`).join('');

    const sections = grouped.map((group) => {
        const cards = group.featuredGames.map((game) => buildCatalogCard(locale, pagePath, game)).join('');
        const supportNote = group.supportGames.length
            ? `<div class="support-note">
                ${escapeHtml(supportNoteText(locale, group.supportGames.length))}
            </div>`
            : '';
        const sectionBody = cards
            ? `<div class="catalog-grid">
                ${cards}
            </div>`
            : `<div class="site-note">
                <p>${escapeHtml(noFlagshipText(locale))}</p>
            </div>`;

        return `<section class="catalog-section" id="${group.slug}">
            <div class="catalog-section-header">
                <div>
                    <h2>${escapeHtml(t(locale, group.label))}</h2>
                    <p>${escapeHtml(t(locale, group.intro))}</p>
                </div>
                <span class="catalog-badge"><i class="fas fa-gamepad"></i>${escapeHtml(editorialCountText(locale, group.featuredGames.length))}</span>
            </div>
            ${supportNote}
            ${sectionBody}
        </section>`;
    }).join('\n');

    const head = standardHead({
        locale,
        pagePath,
        title: locale.code === 'hi' ? 'Game श्रेणियां - SkillWarz' : 'Game Categories - SkillWarz',
        description: locale.code === 'hi'
            ? 'Browser FPS, sniper, battle royale, action और multiplayer games के लिए SkillWarz categories देखें, जहां साफ descriptions और category context मौजूद है।'
            : 'Browse SkillWarz categories for browser FPS, sniper, battle royale, action, and multiplayer games with cleaner descriptions and category context.',
        ogTitle: locale.code === 'hi' ? 'SkillWarz श्रेणियां' : 'SkillWarz Categories',
        ogDescription: locale.code === 'hi'
            ? 'Curated browser game categories देखें जिनमें मजबूत shooter focus, वास्तविक counts और original editorial summaries हैं।'
            : 'Explore curated browser game categories with stronger shooter focus, real counts, and original editorial summaries.',
        ogImage: 'img/skillwarz.avif',
    });

    const mainContent = `        <div class="main-content">
            <div class="content-section">
                <div class="game-info page-copy">
                    <div class="page-breadcrumb"><a href="${sameLocaleHref(locale, pagePath, 'index.html')}">${escapeHtml(t(locale, UI.home))}</a><span>/</span><span>${escapeHtml(t(locale, UI.categories))}</span></div>
                    <h1>${escapeHtml(locale.code === 'hi' ? 'SkillWarz श्रेणियां' : 'SkillWarz Categories')}</h1>
                    <div class="info-header">${escapeHtml(locale.code === 'hi'
                        ? 'SkillWarz का हर category page अब cleaner genre fit, वास्तविक page counts और मजबूत editorial summaries के आसपास फिर से बनाया जा रहा है।'
                        : 'Every category page on SkillWarz is being rebuilt around cleaner genre fit, actual page counts, and stronger editorial summaries.')}</div>
                    <p class="lead-copy">${escapeHtml(locale.code === 'hi'
                        ? 'यह catalog अब सबसे मजबूत shooter-aligned editorial pages को पहले दिखाता है। Broader site inventory में support entries अभी भी मौजूद हैं, लेकिन original coverage बढ़ने तक वे noindex और मुख्य review path से बाहर रहती हैं।'
                        : 'This catalog now highlights the strongest shooter-aligned editorial pages first. Support entries still exist in the broader site inventory, but they stay noindex and off the main review path while original coverage expands.')}</p>
                    <div class="catalog-note">${escapeHtml(locale.code === 'hi'
                        ? 'अब आपको यहां बढ़ा-चढ़ाकर दिखाए गए counts, random ratings या नकली play totals नहीं दिखेंगे। Category sections अब flagship pages को प्राथमिकता देती हैं और कमजोर support entries की visibility घटाती हैं।'
                        : 'You will no longer see inflated counts, random ratings, or fake play totals here. Category sections now prioritize flagship pages and reduce the visibility of weaker support entries.')}</div>

                    <div class="category-jump-grid">
                        ${jumpCards}
                    </div>

                    ${sections}
                </div>
            </div>
        </div>`;

    return buildPageLayout({
        locale,
        head,
        header: buildHeader(locale, pagePath, ''),
        mainContent,
        footer: buildFooter(locale, pagePath),
    });
}

function buildGuidePage(locale, guide) {
    const pagePath = guide.slug;
    const title = t(locale, guide.title);
    const description = t(locale, guide.description);
    const sectionHtml = guide.sections.map((section) => {
        const paragraphs = section.paragraphs.map((paragraph) => `<p>${escapeHtml(t(locale, paragraph))}</p>`).join('\n');
        const bullets = section.bullets && section.bullets.length
            ? `<ul>${section.bullets.map((bullet) => `<li>${escapeHtml(t(locale, bullet))}</li>`).join('')}</ul>`
            : '';
        return `<section class="section-block">
            <h2>${escapeHtml(t(locale, section.heading))}</h2>
            ${paragraphs}
            ${bullets}
        </section>`;
    }).join('\n');

    const tagHtml = t(locale, guide.tags).map((tag) => `<span class="guide-tag">${escapeHtml(tag)}</span>`).join('');

    const head = standardHead({
        locale,
        pagePath,
        title: `${title} | SkillWarz`,
        description,
        ogTitle: `${title} | SkillWarz`,
        ogDescription: description,
        ogImage: 'img/skillwarz.avif',
    });

    const mainContent = `        <div class="main-content article-shell">
            <div class="content-section">
                <div class="game-info guide-copy">
                    <div class="page-breadcrumb"><a href="${sameLocaleHref(locale, pagePath, 'index.html')}">${escapeHtml(t(locale, UI.home))}</a><span>/</span><a href="${sameLocaleHref(locale, pagePath, 'skillwarz-beginner-guide.html')}">${escapeHtml(t(locale, UI.guides))}</a><span>/</span><span>${escapeHtml(title)}</span></div>
                    <h1>${escapeHtml(title)}</h1>
                    <div class="info-header">${escapeHtml(locale.code === 'hi'
                        ? 'Browser shooter खिलाड़ियों के लिए original SkillWarz guide content, जो बेहतर habits, routing और तेज improvement चाहती है।'
                        : 'Original SkillWarz guide content for browser shooter players who want clearer habits, better routing, and faster improvement.')}</div>
                    <p class="lead-copy">${escapeHtml(t(locale, guide.intro))}</p>
                    <div class="guide-meta">
                        ${tagHtml}
                        <span class="guide-tag">${escapeHtml(`${t(locale, UI.updated)} ${t(locale, SITE.dateLabel)}`)}</span>
                    </div>
                    <div class="button-row">
                        <a class="button-link" href="${sameLocaleHref(locale, pagePath, 'categories.html')}">${escapeHtml(t(locale, UI.browseCategories))}</a>
                        <a class="button-link secondary" href="${sameLocaleHref(locale, pagePath, 'index.html')}">${escapeHtml(t(locale, UI.returnHome))}</a>
                    </div>
                    <div class="section-stack" style="margin-top:24px;">
                        ${sectionHtml}
                    </div>
                </div>
            </div>
        </div>`;

    return buildPageLayout({
        locale,
        head,
        header: buildHeader(locale, pagePath, 'guides'),
        mainContent,
        footer: buildFooter(locale, pagePath),
    });
}

function buildGamePage(locale, game, allGames) {
    const pagePath = game.link;
    const categoryLabel = getCategoryLabel(game.category, locale);
    const summary = buildGameSummary(locale, game);
    const expectations = buildGameExpectations(locale, game);
    const bullets = buildGameBullets(locale, game);
    const warnings = inferWarnings(locale, game);

    const guideByCategory = {
        FPS: {
            href: sameLocaleHref(locale, pagePath, 'how-to-improve-browser-fps-aim.html'),
            label: locale.code === 'hi' ? 'FPS aim guide पढ़ें' : 'Read the FPS aim guide',
        },
        Sniper: {
            href: sameLocaleHref(locale, pagePath, 'best-browser-sniper-games-guide.html'),
            label: locale.code === 'hi' ? 'Sniper guide पढ़ें' : 'Read the sniper guide',
        },
        BattleRoyale: {
            href: sameLocaleHref(locale, pagePath, 'battle-royale-beginner-mistakes.html'),
            label: locale.code === 'hi' ? 'Battle royale guide पढ़ें' : 'Read the battle royale guide',
        },
        Action: {
            href: sameLocaleHref(locale, pagePath, 'how-to-choose-browser-shooter.html'),
            label: locale.code === 'hi' ? 'Game choice guide इस्तेमाल करें' : 'Use the game choice guide',
        },
        Multiplayer: {
            href: sameLocaleHref(locale, pagePath, 'best-browser-shooter-modes.html'),
            label: locale.code === 'hi' ? 'Shooter modes की तुलना करें' : 'Compare browser shooter modes',
        },
    }[game.category] || {
        href: sameLocaleHref(locale, pagePath, 'skillwarz-beginner-guide.html'),
        label: locale.code === 'hi' ? 'शुरुआती गाइड पढ़ें' : 'Read the beginner guide',
    };

    const relatedGames = allGames
        .filter((candidate) => candidate.link !== game.link && candidate.category === game.category)
        .sort((left, right) => Number(right.indexable) - Number(left.indexable) || left.name.localeCompare(right.name))
        .slice(0, 6);

    const playShell = buildDeferredPlayShell({
        locale,
        pagePath,
        shellId: `${slugFromName(game.name)}-play-shell`,
        iframeUrl: game.iframeUrl,
        title: locale.code === 'hi' ? `${game.name} ब्राउज़र सेशन` : `${game.name} browser session`,
        imageUrl: game.imageUrl,
        imageAlt: locale.code === 'hi' ? `${game.name} आइकन` : `${game.name} icon`,
        heading: locale.code === 'hi'
            ? `Quick take पढ़ने के बाद ही ${game.name} लोड करें`
            : `Load ${game.name} only after you have read the quick take`,
        description: locale.code === 'hi'
            ? 'यह पेज पहले original summary और player-fit notes दिखाता है, फिर visitor चाहे तो playable browser frame खोल सकता है।'
            : 'This page keeps the original summary and player-fit notes visible first, then lets the visitor choose whether to open the playable browser frame.',
        buttonLabel: locale.code === 'hi' ? `${game.name} लोड करें` : `${t(locale, UI.loadLabel)} ${game.name}`,
        disclosure: locale.code === 'hi'
            ? 'ऊपर दिखाया गया playable frame third-party browser distribution partner द्वारा दिया जा सकता है। SkillWarz इस page पर context, original summary text और साफ navigation जोड़ता है।'
            : 'The playable frame above may be supplied by a third-party browser distribution partner. SkillWarz uses this page to add context, original summary text, and cleaner navigation around the title.',
        secondaryHref: guideByCategory.href,
        secondaryLabel: guideByCategory.label,
    });

    const relatedHtml = relatedGames.map((candidate) => buildRelatedCard(locale, pagePath, candidate)).join('');
    const head = standardHead({
        locale,
        pagePath,
        title: locale.code === 'hi'
            ? `${game.name} - ब्राउज़र गाइड और प्ले पेज | SkillWarz`
            : `${game.name} - Browser Guide And Play Page | SkillWarz`,
        description: locale.code === 'hi'
            ? `${game.name} के लिए SkillWarz quick guide पढ़ें, उसका core loop समझें और उपलब्ध होने पर browser version लोड करें।`
            : `Read the SkillWarz quick guide for ${game.name}, understand the core loop, and load the browser version when available.`,
        ogTitle: `${game.name} | SkillWarz`,
        ogDescription: locale.code === 'hi'
            ? `${game.name} के लिए curated SkillWarz page, जिसमें original summary text, on-demand browser play और category context शामिल हैं।`
            : `A curated SkillWarz page for ${game.name} with original summary text, on-demand browser play, and category context.`,
        ogImage: game.imageUrl,
        robots: game.indexable ? 'index, follow, max-image-preview:large' : 'noindex, follow',
    });

    const summaryCards = bullets.map((bullet) => `<div class="summary-card"><p>${escapeHtml(bullet)}</p></div>`).join('');
    const warningList = warnings.map((warning) => `<li>${escapeHtml(warning)}</li>`).join('');

    const mainContent = `        <div class="main-content">
            <div class="content-section">
                <div class="game-info page-copy">
                    <div class="page-breadcrumb">
                        <a href="${sameLocaleHref(locale, pagePath, 'index.html')}">${escapeHtml(t(locale, UI.home))}</a>
                        <span>/</span>
                        <a href="${sameLocaleHref(locale, pagePath, 'categories.html', game.categorySlug)}">${escapeHtml(categoryLabel)}</a>
                        <span>/</span>
                        <span>${escapeHtml(game.name)}</span>
                    </div>

                    <h1>${escapeHtml(game.name)}</h1>
                    <div class="info-header">${escapeHtml(locale.code === 'hi'
                        ? 'यह SkillWarz page playable access को original quick-take summary, player-fit notes और category context के साथ जोड़ता है।'
                        : 'This SkillWarz page combines playable access with an original quick-take summary, player-fit notes, and category context.')}</div>

                    <div class="button-row">
                        <a class="button-link" href="${sameLocaleHref(locale, pagePath, 'categories.html', game.categorySlug)}"><i class="fas fa-layer-group"></i>${escapeHtml(`${t(locale, UI.backTo)} ${categoryLabel}`)}</a>
                        <a class="button-link secondary" href="${sameLocaleHref(locale, pagePath, 'contact.html')}"><i class="fas fa-envelope"></i>${escapeHtml(t(locale, UI.reportIssue))}</a>
                    </div>

                    <div class="summary-grid">
                        ${summaryCards}
                    </div>

                    <div class="section-stack">
                        <section class="section-block">
                            <h2>${escapeHtml(t(locale, UI.quickTake))}</h2>
                            ${summary.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join('\n')}
                        </section>

                        <section class="section-block">
                            <h2>${escapeHtml(t(locale, UI.beforePlay))}</h2>
                            ${expectations.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join('\n')}
                        </section>

                        <section class="section-block">
                            <h2>${escapeHtml(t(locale, UI.playableFrame))}</h2>
                            <p>${escapeHtml(locale.code === 'hi'
                                ? 'Browser frame केवल तब लोड होती है जब visitor उसे खोलने का निर्णय करता है। इससे editorial summary और player-fit notes किसी भी third-party session से पहले दिखाई देती रहती हैं।'
                                : 'The browser frame is loaded only when a visitor chooses to open it, which keeps the editorial summary and player-fit notes visible before any third-party session starts.')}</p>
                            ${playShell}
                        </section>

                        <section class="section-block">
                            <h2>${escapeHtml(t(locale, UI.whyTryPage))}</h2>
                            <ul>
                                ${bullets.map((bullet) => `<li>${escapeHtml(bullet)}</li>`).join('')}
                            </ul>
                        </section>

                        <section class="section-block">
                            <h2>${escapeHtml(t(locale, UI.editorialNotes))}</h2>
                            <ul>
                                ${warningList}
                            </ul>
                            <div class="content-note">${escapeHtml(locale.code === 'hi'
                                ? 'SkillWarz पर category tags का उपयोग खिलाड़ियों को session style, pacing और संभावित player fit की तुलना करने में मदद करने के लिए किया जाता है। ये ownership के दावे नहीं हैं।'
                                : 'Category tags on SkillWarz are used to help players compare session style, pacing, and likely player fit. They are not claims of game ownership.')}</div>
                        </section>

                        <section class="section-block">
                            <h2>${escapeHtml(`${t(locale, UI.related)} ${categoryLabel}`)}</h2>
                            <div class="related-grid">
                                ${relatedHtml}
                            </div>
                        </section>
                    </div>

                    <div class="tags">
                        <span class="tag"><i class="fas fa-tag"></i> ${escapeHtml(categoryLabel)}</span>
                        ${(game.tags || []).slice(0, 5).map((tag) => `<span class="tag"><i class="fas fa-hashtag"></i> ${escapeHtml(tag)}</span>`).join('')}
                    </div>
                </div>
            </div>
        </div>`;

    return buildPageLayout({
        locale,
        head,
        header: buildHeader(locale, pagePath, game.categorySlug),
        mainContent,
        footer: buildFooter(locale, pagePath),
        extraScripts: buildPlayActivationScript(locale),
    });
}

function buildInfoPage(locale, page) {
    const pagePath = page.slug;
    const title = t(locale, page.title);
    const description = t(locale, page.description);
    const updatedTag = page.showUpdated ? `<div class="guide-meta"><span class="guide-tag">${escapeHtml(`${t(locale, UI.updated)} ${t(locale, SITE.dateLabel)}`)}</span></div>` : '';

    const sectionHtml = page.sections.map((section) => {
        const paragraphs = (section.paragraphs || []).map((paragraph) => {
            const value = t(locale, paragraph);
            const isEmailOnly = value === SITE.email;
            return isEmailOnly
                ? `<p><a href="mailto:${SITE.email}">${SITE.email}</a></p>`
                : `<p>${escapeHtml(value)}</p>`;
        }).join('\n');

        const bullets = section.bullets && section.bullets.length
            ? (() => {
                const listTag = section.listType === 'ol' ? 'ol' : 'ul';
                return `<${listTag}>${section.bullets.map((bullet) => `<li>${escapeHtml(t(locale, bullet))}</li>`).join('')}</${listTag}>`;
            })()
            : '';

        return `<section class="section-block">
            <h2>${escapeHtml(t(locale, section.heading))}</h2>
            ${paragraphs}
            ${bullets}
        </section>`;
    }).join('\n');

    const noteHtml = page.note ? `<div class="content-note">${escapeHtml(t(locale, page.note))}</div>` : '';

    const head = standardHead({
        locale,
        pagePath,
        title: `${title} - SkillWarz`,
        description,
        ogTitle: `${title} - SkillWarz`,
        ogDescription: description,
        ogImage: 'img/skillwarz.avif',
        robots: 'index, follow',
    });

    const mainContent = `        <div class="main-content article-shell">
            <div class="content-section">
                <div class="game-info guide-copy">
                    <div class="page-breadcrumb"><a href="${sameLocaleHref(locale, pagePath, 'index.html')}">${escapeHtml(t(locale, UI.home))}</a><span>/</span><span>${escapeHtml(title)}</span></div>
                    <h1>${escapeHtml(title)}</h1>
                    <p class="lead-copy">${escapeHtml(t(locale, page.intro))}</p>
                    ${updatedTag}
                    <div class="button-row">
                        <a class="button-link" href="${sameLocaleHref(locale, pagePath, 'categories.html')}">${escapeHtml(t(locale, UI.browseCategories))}</a>
                        <a class="button-link secondary" href="${sameLocaleHref(locale, pagePath, 'index.html')}">${escapeHtml(t(locale, UI.returnHome))}</a>
                    </div>
                    <div class="section-stack" style="margin-top:24px;">
                        ${sectionHtml}
                    </div>
                    ${noteHtml}
                </div>
            </div>
        </div>`;

    return buildPageLayout({
        locale,
        head,
        header: buildHeader(locale, pagePath, ''),
        mainContent,
        footer: buildFooter(locale, pagePath),
    });
}

function writeFile(relativePath, content) {
    const target = path.join(ROOT, relativePath);
    ensureDir(path.dirname(target));
    fs.writeFileSync(target, hardenForAdSense(relativePath.replace(/\\/g, '/'), content), 'utf8');
}

function clearLocalizedGameDirectories(locale) {
    for (const dataset of DATASETS) {
        const outputDir = localizedOutputPath(locale, dataset.dir);
        const dirPath = path.join(ROOT, outputDir);
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

function buildSitemap(entries) {
    const urls = entries.map((entry) => {
        const loc = publicUrl(entry.locale, entry.pagePath);
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

function hardenForAdSense(relativePath, content) {
    let output = content;

    if (/^(index|categories)\.html$/.test(relativePath)) {
        output = output
            .replace(/Pages are being rebuilt around original summaries, cleaner navigation, and clearer session-fit guidance\./g, 'Pages now lead with original summaries, cleaner navigation, and clearer session-fit guidance.')
            .replace(/SkillWarz is being rebuilt so that each important page explains the genre, the expected pace, the player fit, and the reason the game may or may not be worth your time\./g, 'SkillWarz is structured so that each important page explains the genre, expected pace, player fit, and the reason a game may or may not be worth your time.')
            .replace(/Every category page on SkillWarz is being rebuilt around cleaner genre fit, actual page counts, and stronger editorial summaries\./g, 'SkillWarz category pages focus on cleaner genre fit, actual page counts, and stronger editorial summaries.')
            .replace(/This catalog now highlights the strongest shooter-aligned editorial pages first\. Support entries still exist in the broader site inventory, but they stay noindex and off the main review path while original coverage expands\./g, 'This catalog highlights a narrow set of publicly indexed shooter-aligned pages first, while lower-priority catalog entries stay out of search.')
            .replace(/Support pages remain noindex while coverage is expanded and refined\./g, 'Lower-priority catalog pages stay out of search while the public catalog remains focused.')
            .replace(/Support pages with real contact details and updated policy information\./g, 'Trust pages with real contact details and updated policy information.')
            .replace(/<p>1 featured page and 5 support pages\.<\/p>/g, '<p>1 curated page.</p>')
            .replace(/<p>2 featured pages and 8 support pages\.<\/p>/g, '<p>2 curated pages.</p>')
            .replace(/<p>5 featured pages and 5 support pages\.<\/p>/g, '<p>2 curated pages.</p>')
            .replace(/<p>4 featured pages and 23 support pages\.<\/p>/g, '<p>4 curated pages.</p>')
            .replace(/<p>7 featured pages and 20 support pages\.<\/p>/g, '<p>4 curated pages.</p>')
            .replace(/<p>0 featured pages and 6 support pages\.<\/p>/g, '<p>0 curated pages.</p>')
            .replace(/<p>3 featured pages and 2 support pages\.<\/p>/g, '<p>3 curated pages.</p>')
            .replace(/<p>5 featured pages and 0 support pages\.<\/p>/g, '<p>3 curated pages.</p>')
            .replace(/(\d+)\s+featured\s+pages?\s+and\s+\d+\s+support\s+pages?\./g, '$1 curated pages.')
            .replace(/(\d+)\s+editorial\s+pages?/g, '$1 curated pages')
            .replace(/<div class="support-note">[\s\S]*?<\/div>/g, '')
            .replace(/No flagship editorial page is being surfaced in this category yet\. Support entries remain de-emphasized until stronger original writeups are ready\./g, 'This category stays narrow so the public catalog only surfaces pages with clearer shooter overlap.');
    }

    if (/^privacy\.html$/.test(relativePath)) {
        output = output.replace(
            /If advertising is enabled in the future, ad partners may use cookies, device identifiers, or similar technologies to serve and measure ads\. This policy will continue to be updated if monetization settings change\./g,
            'SkillWarz may use advertising and measurement partners, including Google, to serve and measure ads. Those partners may use cookies, device identifiers, or similar technologies according to their own policies and applicable consent settings.'
        );
    }

    if (/^about\.html$/.test(relativePath)) {
        output = output.replace(
            /The goal is to provide a cleaner landing page, clearer descriptions, and easier navigation around browser-playable action games\./g,
            'The goal is to provide original guidance, clearer descriptions, and easier navigation around browser-playable shooter and action games.'
        );
    }

    return output;
}

function buildSite() {
    const homeGame = readVarArray('js/game_data/games.js', 'gamesData')[0];
    const allGames = buildDatasets();
    const featuredGames = allGames.filter((game) => game.indexable).slice(0, 12);
    const sitemapEntries = [];

    for (const locale of LOCALES) {
        clearLocalizedGameDirectories(locale);

        writeFile(localizedOutputPath(locale, 'index.html'), buildHomePage(locale, homeGame, featuredGames));
        writeFile(localizedOutputPath(locale, 'categories.html'), buildCategoryPage(locale, allGames));
        sitemapEntries.push({ locale, pagePath: 'index.html' }, { locale, pagePath: 'categories.html' });

        for (const guide of GUIDES) {
            writeFile(localizedOutputPath(locale, guide.slug), buildGuidePage(locale, guide));
            sitemapEntries.push({ locale, pagePath: guide.slug });
        }

        for (const page of INFO_PAGES) {
            writeFile(localizedOutputPath(locale, page.slug), buildInfoPage(locale, page));
            sitemapEntries.push({ locale, pagePath: page.slug });
        }

        for (const game of allGames) {
            writeFile(localizedOutputPath(locale, game.link), buildGamePage(locale, game, allGames));
            if (game.indexable) {
                sitemapEntries.push({ locale, pagePath: game.link });
            }
        }
    }

    writeFile('robots.txt', buildRobots());
    writeFile('sitemap.xml', buildSitemap(sitemapEntries));
    writeFile('ads.txt', buildAdsTxt());
}

buildSite();
