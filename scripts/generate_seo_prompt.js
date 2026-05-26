const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT_DIR = path.resolve(__dirname, '..');

const DATA_SOURCES = [
    { type: 'arrayVar', file: path.join(ROOT_DIR, 'js', 'game_data', 'games.js'), varName: 'gamesData', fallbackType: 'Featured Game' },
    { type: 'arrayVar', file: path.join(ROOT_DIR, 'js', 'game_data', 'action.js'), varName: 'actionGames', fallbackType: 'Action' },
    { type: 'arrayVar', file: path.join(ROOT_DIR, 'js', 'game_data', 'battleRoyale.js'), varName: 'battleRoyaleData', fallbackType: 'Battle Royale' },
    { type: 'arrayVar', file: path.join(ROOT_DIR, 'js', 'game_data', 'fps.js'), varName: 'fpsData', fallbackType: 'First-Person Shooter' },
    { type: 'arrayVar', file: path.join(ROOT_DIR, 'js', 'game_data', 'multiplayer.js'), varName: 'multiplayerGames', fallbackType: 'Multiplayer' },
    { type: 'arrayVar', file: path.join(ROOT_DIR, 'js', 'game_data', 'sniper.js'), varName: 'sniperData', fallbackType: 'Sniper' },
    { type: 'arrayVar', file: path.join(ROOT_DIR, 'js', 'game_data', 'gd_extra.js'), varName: 'gdExtraGames' },
    { type: 'objectVar', file: path.join(ROOT_DIR, 'js', 'game_data', 'gd_categories.js'), varName: 'gdCategoryData' }
];

function collapseWhitespace(value) {
    return String(value || '')
        .replace(/\s+/g, ' ')
        .trim();
}

function normalizeKey(value) {
    return collapseWhitespace(value).toLowerCase();
}

function parseAssignedValue(filePath, varName) {
    const content = fs.readFileSync(filePath, 'utf8');
    const context = { window: {} };

    try {
        vm.runInNewContext(content, context, { filename: filePath });
    } catch (error) {
        throw new Error(`Could not evaluate ${varName} from ${filePath}: ${error.message}`);
    }

    if (varName in context) {
        return context[varName];
    }

    if (context.window && varName in context.window) {
        return context.window[varName];
    }

    if (!(varName in context)) {
        throw new Error(`Could not parse ${varName} from ${filePath}`);
    }
}

function flattenGdExtra(value) {
    if (!value || typeof value !== 'object') {
        return [];
    }

    return Object.values(value).flatMap((entry) => Array.isArray(entry) ? entry : []);
}

function flattenGdCategories(value) {
    if (!value || typeof value !== 'object') {
        return [];
    }

    const categoryGames = Array.isArray(value.allGames)
        ? value.allGames
        : [];

    const nestedGames = Array.isArray(value.categories)
        ? value.categories.flatMap((category) => Array.isArray(category.games) ? category.games : [])
        : [];

    return [...categoryGames, ...nestedGames];
}

function loadAllGames() {
    const collected = [];

    for (const source of DATA_SOURCES) {
        if (!fs.existsSync(source.file)) {
            continue;
        }

        const parsed = parseAssignedValue(source.file, source.varName);
        if (source.type === 'arrayVar') {
            if (Array.isArray(parsed)) {
                collected.push(...parsed.map((entry) => ({
                    ...entry,
                    __sourceFallbackType: source.fallbackType || ''
                })));
            } else if (parsed && typeof parsed === 'object') {
                collected.push(...flattenGdExtra(parsed));
            }
            continue;
        }

        if (source.type === 'objectVar') {
            collected.push(...flattenGdCategories(parsed));
        }
    }

    return collected;
}

function stringifyGameType(gameType, fallbackType) {
    if (!gameType) {
        return collapseWhitespace(fallbackType || '');
    }

    let resolved = '';

    if (typeof gameType === 'string') {
        resolved = collapseWhitespace(gameType);
    } else if (typeof gameType === 'object') {
        resolved = collapseWhitespace(
            gameType.en ||
            gameType['en-US'] ||
            Object.values(gameType).find(Boolean) ||
            ''
        );
    } else {
        resolved = collapseWhitespace(gameType);
    }

    if (!resolved || ['skillwarz', 'index'].includes(normalizeKey(resolved))) {
        return collapseWhitespace(fallbackType || resolved || 'Browser Game');
    }

    return resolved;
}

function sanitizeDescription(description) {
    const text = collapseWhitespace(description);
    if (!text) {
        return '';
    }

    // Skip obviously corrupted sitewide placeholder copy.
    if (
        text.includes('SkillWarz is a fast-paced first-person shooter offering advanced movement mechanics') &&
        text.includes('Deathmatch') &&
        text.includes('Capture The Flag')
    ) {
        return '';
    }

    return text;
}

function chooseDescription(game) {
    const primary = sanitizeDescription(game.description);
    if (primary) {
        return primary;
    }

    const fallbackParts = [
        game.gameplay,
        Array.isArray(game.features) ? game.features.join('. ') : '',
        game.instruction
    ]
        .map(sanitizeDescription)
        .filter(Boolean);

    if (fallbackParts[0]) {
        return fallbackParts[0];
    }

    const tags = Array.isArray(game.tags) ? game.tags.filter(Boolean).slice(0, 4) : [];
    const categories = Array.isArray(game.categories) ? game.categories.filter(Boolean).slice(0, 3) : [];
    const label = stringifyGameType(game.gameType || game.category || game.categoryKey, game.__sourceFallbackType);
    const signals = [...new Set([...tags, ...categories].map(collapseWhitespace).filter(Boolean))];

    if (signals.length > 0) {
        return `${game.name || game.title || 'This game'} is a ${label.toLowerCase()} experience featuring ${signals.join(', ')} elements.`;
    }

    return label
        ? `${game.name || game.title || 'This game'} is a browser-based ${label.toLowerCase()} game.`
        : '';
}

function normalizeGame(game) {
    const name = collapseWhitespace(game.name || game.title || game.id || '');
    const gameType = stringifyGameType(
        game.gameType || game.category || game.categoryKey,
        game.__sourceFallbackType
    );
    const description = chooseDescription(game);
    const instruction = collapseWhitespace(game.instruction || '');
    const uniqueKey = collapseWhitespace(game.id || game.slug || game.link || `${name}::${gameType}`);

    return {
        uniqueKey,
        name,
        gameType,
        description,
        instruction
    };
}

function buildIndex(games) {
    const index = new Map();

    for (const game of games) {
        const normalized = normalizeGame(game);
        if (!normalized.name) {
            continue;
        }

        const existing = index.get(normalized.uniqueKey);
        if (!existing) {
            index.set(normalized.uniqueKey, normalized);
            continue;
        }

        const currentScore = existing.description.length + existing.instruction.length;
        const nextScore = normalized.description.length + normalized.instruction.length;
        if (nextScore > currentScore) {
            index.set(normalized.uniqueKey, normalized);
        }
    }

    return index;
}

function findGame(index, query) {
    const normalizedQuery = normalizeKey(query);
    if (!normalizedQuery) {
        return null;
    }

    const allGames = [...index.values()];
    return allGames.find((game) => normalizeKey(game.name) === normalizedQuery) ||
        allGames.find((game) => normalizeKey(game.uniqueKey) === normalizedQuery) ||
        allGames.find((game) => normalizeKey(game.name).includes(normalizedQuery));
}

function buildPrompt(game) {
    const lines = [
        '你是一个游戏网站SEO内容编辑。你的任务是将简短的游戏描述扩写为适合游戏详情页的SEO内容段落。',
        '',
        '要求：',
        '- 输出5-8句话，约150-200字',
        '- 必须包含：游戏玩法介绍、操作方式（键盘/鼠标/触屏）、游戏特色亮点',
        '- 语言：英文',
        '- 语气：自然、面向玩家，不要堆砌关键词',
        `- 最后一句固定为：Play ${game.name} instantly on minefun io with no download required.`,
        '- 只输出正文段落，不要标题，不要bullet points',
        '',
        `游戏名：${game.name}`,
        `类型：${game.gameType || 'Browser Game'}`,
        `原描述：${game.description || 'N/A'}`
    ];

    if (game.instruction) {
        lines.push(`操作参考：${game.instruction}`);
    }

    lines.push('请扩写。');
    return lines.join('\n');
}

function printUsage() {
    console.error('Usage: node scripts/generate_seo_prompt.js "<game name>"');
}

function main() {
    const query = process.argv.slice(2).join(' ').trim();
    if (!query) {
        printUsage();
        process.exit(1);
    }

    const games = loadAllGames();
    const index = buildIndex(games);
    const game = findGame(index, query);

    if (!game) {
        console.error(`Game not found: ${query}`);
        process.exit(1);
    }

    process.stdout.write(buildPrompt(game));
}

main();
