(function () {
    var CATEGORY_CONFIG = [
        {
            key: 'action',
            anchor: 'action',
            title: 'Action',
            icon: 'fa-bolt',
            dataKey: 'actionGames',
            accent: '#ffb84d',
            soft: 'rgba(255, 184, 77, 0.16)',
            description: 'Arcade detours, oddball challenges, and easy-start action picks for short sessions.',
            tags: ['arcade', 'casual', 'varied']
        },
        {
            key: 'fps',
            anchor: 'fps',
            title: 'FPS',
            icon: 'fa-crosshairs',
            dataKey: 'fpsData',
            accent: '#ff6b57',
            soft: 'rgba(255, 107, 87, 0.16)',
            description: 'Fast first-person gunplay, military maps, and browser shooters with quick rematches.',
            tags: ['aim', 'respawn', 'arena']
        },
        {
            key: 'battleRoyale',
            anchor: 'battle-royale',
            title: 'Battle Royale',
            icon: 'fa-parachute-box',
            dataKey: 'battleRoyaleData',
            accent: '#5ecbff',
            soft: 'rgba(94, 203, 255, 0.16)',
            description: 'Survival loops, endgame pressure, and themed last-player-standing browser sessions.',
            tags: ['survival', 'loot', 'endgame']
        },
        {
            key: 'multiplayer',
            anchor: 'multiplayer',
            title: 'Multiplayer',
            icon: 'fa-users',
            dataKey: 'multiplayerGames',
            accent: '#8bd450',
            soft: 'rgba(139, 212, 80, 0.16)',
            description: 'Social browser sessions, room-based chaos, and quick multiplayer rounds.',
            tags: ['online', 'rooms', 'social']
        },
        {
            key: 'sniper',
            anchor: 'sniper',
            title: 'Sniper',
            icon: 'fa-location-crosshairs',
            dataKey: 'sniperData',
            accent: '#f0c66e',
            soft: 'rgba(240, 198, 110, 0.16)',
            description: 'Longer sightlines, patience-first pacing, and precision-focused shooting pages.',
            tags: ['precision', 'angles', 'steady aim']
        }
    ];

    var PREFERRED_ORDER = {
        action: [
            'Revoxel 3D - Voxel RPG Shooter',
            'Night Club Security',
            'Obby Football Soccer 3D',
            'Marshmallow Rush',
            'Dessert DIY',
            'Sort Balls - Cones'
        ],
        fps: [
            'Hazmob FPS',
            'Subway FPS',
            'Command Strike FPS',
            'Real Shooting Fps Strike',
            'Dragon Slayer FPS',
            'Crab Guards',
            'FPS Toy Realism',
            'Mine FPS shooter: Noob Arena'
        ],
        battleRoyale: [
            'Cube Battle Royale',
            'Top Guns IO',
            'Pixel Battle Royale Multiplayer',
            'Doge\'s Battle Royale',
            'Pixel Battle Royale',
            'Battle Royale Noob vs Pro'
        ],
        multiplayer: [
            'Push.io',
            'Brainrots Lava Survive Online',
            'Tsunami Brainrots Online',
            'Animal Racing Idle Park',
            'Tic Tac Toe Merge'
        ],
        sniper: [
            'Aliens Hunter',
            'Gun Shooting Games Sniper 3D',
            'Counter Craft Sniper',
            'Mafia Sniper Crime Shooting',
            'Block Sniper'
        ]
    };

    var FEATURED_IDS = [
        'Hazmob FPS',
        'Subway FPS',
        'Cube Battle Royale',
        'Top Guns IO',
        'Push.io',
        'Gun Shooting Games Sniper 3D',
        'Aliens Hunter',
        'Revoxel 3D - Voxel RPG Shooter'
    ];

    var PATH_CONTEXT = getPathContext();

    function getPathContext() {
        var pathname = String((window.location && window.location.pathname) || '').replace(/\\/g, '/');
        var isHindiSection = /\/hi(\/|$)/.test(pathname);

        return {
            isHindiSection: isHindiSection,
            imagePrefix: isHindiSection ? '../' : ''
        };
    }

    function escapeHtml(value) {
        return String(value || '').replace(/[&<>"']/g, function (char) {
            switch (char) {
                case '&':
                    return '&amp;';
                case '<':
                    return '&lt;';
                case '>':
                    return '&gt;';
                case '"':
                    return '&quot;';
                case '\'':
                    return '&#39;';
                default:
                    return char;
            }
        });
    }

    function includesAny(haystack, words) {
        return words.some(function (word) {
            return haystack.indexOf(word) !== -1;
        });
    }

    function orderGames(games, categoryKey) {
        var preferredIds = PREFERRED_ORDER[categoryKey] || [];
        var preferredMap = new Map();

        preferredIds.forEach(function (id, index) {
            preferredMap.set(id, index);
        });

        return games.slice().sort(function (a, b) {
            var aIndex = preferredMap.has(a.id) ? preferredMap.get(a.id) : 9999;
            var bIndex = preferredMap.has(b.id) ? preferredMap.get(b.id) : 9999;

            if (aIndex !== bIndex) {
                return aIndex - bIndex;
            }

            return String(a.name || '').localeCompare(String(b.name || ''));
        });
    }

    function resolveImageUrl(path) {
        if (!path) {
            return PATH_CONTEXT.imagePrefix + 'img/skillwarz.avif';
        }

        if (/^(?:https?:)?\/\//.test(path) || /^data:/.test(path) || path.indexOf('../') === 0 || path.indexOf('./') === 0 || path.indexOf('/') === 0) {
            return path;
        }

        if (PATH_CONTEXT.isHindiSection && path.indexOf('img/') === 0) {
            return '../' + path;
        }

        return path;
    }

    function getCategoryHref(anchor) {
        return 'categories.html#' + anchor;
    }

    function normalizeGame(game, category) {
        var tags = Array.isArray(game.tags) ? game.tags : [];
        var searchText = [
            game.name,
            category.title,
            category.key,
            category.description,
            tags.join(' ')
        ].join(' ').toLowerCase();

        return Object.assign({}, game, {
            imageUrl: resolveImageUrl(game.imageUrl),
            categoryKey: category.key,
            categoryTitle: category.title,
            categoryAnchor: category.anchor,
            categoryIcon: category.icon,
            categoryAccent: category.accent,
            categorySoft: category.soft,
            searchText: searchText
        });
    }

    function getCategories() {
        return CATEGORY_CONFIG.map(function (config) {
            var source = window[config.dataKey];
            var games = Array.isArray(source) ? orderGames(source, config.key).map(function (game) {
                return normalizeGame(game, config);
            }) : [];

            return Object.assign({}, config, {
                games: games
            });
        });
    }

    function getAllGames(categories) {
        var allGames = [];

        categories.forEach(function (category) {
            category.games.forEach(function (game) {
                allGames.push(game);
            });
        });

        return allGames;
    }

    function getCategoryByKey(categories, key) {
        return categories.find(function (category) {
            return category.key === key;
        }) || null;
    }

    function getRatingValue(game) {
        var rating = parseFloat(game && game.rating);

        return isNaN(rating) ? 0 : rating;
    }

    function getTopRatedGames(games, limit) {
        return games.slice().sort(function (a, b) {
            var ratingDelta = getRatingValue(b) - getRatingValue(a);

            if (Math.abs(ratingDelta) > 0.001) {
                return ratingDelta;
            }

            return String(a.name || '').localeCompare(String(b.name || ''));
        }).slice(0, limit || games.length);
    }

    function getNewestGames(categories, limit) {
        var allGames = getAllGames(categories).slice().reverse();
        var seen = new Map();
        var latestGames = [];

        allGames.forEach(function (game) {
            if (latestGames.length >= (limit || 8)) {
                return;
            }

            if (!seen.has(game.id)) {
                seen.set(game.id, true);
                latestGames.push(game);
            }
        });

        return latestGames;
    }

    function getFeaturedGames(categories, limit) {
        var allGames = getAllGames(categories);
        var gameMap = new Map();
        var featuredGames = [];
        var maxItems = limit || 8;

        allGames.forEach(function (game) {
            gameMap.set(game.id, game);
        });

        FEATURED_IDS.forEach(function (id) {
            if (featuredGames.length >= maxItems) {
                return;
            }

            if (gameMap.has(id)) {
                featuredGames.push(gameMap.get(id));
            }
        });

        if (featuredGames.length < maxItems) {
            allGames.forEach(function (game) {
                if (featuredGames.length >= maxItems) {
                    return;
                }

                if (!featuredGames.some(function (item) { return item.id === game.id; })) {
                    featuredGames.push(game);
                }
            });
        }

        return featuredGames;
    }

    function buildSummary(game) {
        var haystack = (String(game.name || '') + ' ' + (game.tags || []).join(' ')).toLowerCase();

        switch (game.categoryKey) {
            case 'action':
                if (includesAny(haystack, ['voxel', 'shooter'])) {
                    return 'Blocky action and shooter energy packed into quick browser rounds.';
                }
                if (includesAny(haystack, ['football', 'soccer'])) {
                    return 'Obstacle-heavy sports action that works well for short, casual sessions.';
                }
                if (includesAny(haystack, ['dessert', 'cooking'])) {
                    return 'A lighter arcade-simulation detour for players who want something playful and low pressure.';
                }
                if (includesAny(haystack, ['security', 'nightclub'])) {
                    return 'Simple decision-based action built around quick reactions and a readable loop.';
                }
                if (includesAny(haystack, ['sort', 'cones', 'puzzle'])) {
                    return 'A calmer quick-play page built around easy visual sorting and short rounds.';
                }
                return 'An easy-start action pick with simple controls and a fast browser-friendly loop.';

            case 'fps':
                if (includesAny(haystack, ['zombie'])) {
                    return 'Fast first-person shooting with zombie pressure and quick weapon upgrades.';
                }
                if (includesAny(haystack, ['target'])) {
                    return 'Practice-oriented FPS shooting with direct controls and immediate restart value.';
                }
                if (includesAny(haystack, ['toy'])) {
                    return 'Toy-scale firefights give this FPS page a more playful arcade feel.';
                }
                if (includesAny(haystack, ['mine', 'voxel', 'block'])) {
                    return 'Block-style first-person shooting built for easy aim duels and short rounds.';
                }
                if (includesAny(haystack, ['military', 'army', 'command', 'combat', 'strike'])) {
                    return 'Military-flavored browser FPS with straightforward maps, gunfights, and fast rematches.';
                }
                if (includesAny(haystack, ['dragon', 'fantasy'])) {
                    return 'A fantasy spin on FPS combat that swaps standard arenas for a more stylized theme.';
                }
                if (includesAny(haystack, ['subway'])) {
                    return 'Compact maps and constant pressure make this a strong quick-session FPS option.';
                }
                if (includesAny(haystack, ['sniper'])) {
                    return 'First-person shooter action with a heavier focus on controlled shots and survival pacing.';
                }
                return 'Quick-fire browser FPS action with readable gunplay and fast match flow.';

            case 'battleRoyale':
                if (includesAny(haystack, ['puzzle', 'jigsaw', 'coloring'])) {
                    return 'A battle royale-themed casual page for players who want the theme without a full shooter session.';
                }
                if (includesAny(haystack, ['pixel', 'cube', 'blocky', 'minecraft'])) {
                    return 'Blocky last-player-standing action with loot pressure and arcade survival rounds.';
                }
                if (includesAny(haystack, ['jet', 'aerial', 'top guns'])) {
                    return 'Air-combat battle royale action with short dogfight-style rounds.';
                }
                if (includesAny(haystack, ['noob vs pro'])) {
                    return 'A lighter competitive spin on battle royale progression with easy-to-read objectives.';
                }
                if (includesAny(haystack, ['doge'])) {
                    return 'Meme-flavored survival action that keeps the pace playful while staying battle royale themed.';
                }
                return 'Survival-focused browser action with loot, movement, and last-player-standing pressure.';

            case 'multiplayer':
                if (includesAny(haystack, ['racing', 'park'])) {
                    return 'A multiplayer park and racing detour built for quick social sessions.';
                }
                if (includesAny(haystack, ['tic tac toe', 'strategy'])) {
                    return 'A short competitive puzzle match for players who want multiplayer without shooter controls.';
                }
                if (includesAny(haystack, ['tsunami', 'lava', 'survive'])) {
                    return 'Online survival chaos with hazards, quick resets, and room-based multiplayer energy.';
                }
                if (includesAny(haystack, ['push.io', 'arena', 'boomerang'])) {
                    return 'Arena-style multiplayer action with simple controls and instant rematch appeal.';
                }
                return 'Session-based multiplayer browser play designed for quick room joins and social chaos.';

            case 'sniper':
                if (includesAny(haystack, ['block', 'voxel', 'craft'])) {
                    return 'Precision shooting on block-style maps where sightlines and clean shots matter most.';
                }
                if (includesAny(haystack, ['mafia', 'crime'])) {
                    return 'Sniper missions with a crime theme and a slower, more deliberate pace.';
                }
                if (includesAny(haystack, ['aliens', 'sci-fi'])) {
                    return 'A sci-fi sniper setup built around careful shots, distance control, and target priority.';
                }
                return 'Patience-first browser sniper action that rewards timing, angles, and steady aim.';

            default:
                return 'A browser game page inside the SkillWarz collection.';
        }
    }

    function buildTagMarkup(tags, limit) {
        if (!Array.isArray(tags) || !tags.length) {
            return '';
        }

        return tags.slice(0, limit).map(function (tag) {
            return '<span>' + escapeHtml(tag) + '</span>';
        }).join('');
    }

    function buildGameCard(game, options) {
        var cardClass = options && options.compact ? 'game-card game-card-compact' : 'game-card';
        var linkLabel = (options && options.linkLabel) || 'Play Now';
        var rating = getRatingValue(game);

        return [
            '<a class="' + cardClass + '" href="' + escapeHtml(game.link) + '" aria-label="Play ' + escapeHtml(game.name) + '" style="--hub-accent:' + game.categoryAccent + ';--hub-accent-soft:' + game.categorySoft + ';">',
            '<span class="game-card-media">',
            '<img src="' + escapeHtml(game.imageUrl) + '" alt="' + escapeHtml(game.name) + '" loading="lazy">',
            '<span class="game-card-play"><i class="fas fa-play"></i>' + escapeHtml(linkLabel) + '</span>',
            '</span>',
            '<span class="game-card-body">',
            '<span class="game-card-top">',
            '<span class="catalog-badge"><i class="fas ' + escapeHtml(game.categoryIcon) + '"></i>' + escapeHtml(game.categoryTitle) + '</span>',
            '<span class="game-card-rating"><i class="fas fa-star"></i>' + escapeHtml(rating.toFixed(1)) + '</span>',
            '</span>',
            '<strong>' + escapeHtml(game.name) + '</strong>',
            '<span class="game-card-meta"><span>Browser</span><span>Instant play</span></span>',
            '<span class="catalog-tags">' + buildTagMarkup(game.tags || [], options && options.compact ? 2 : 3) + '</span>',
            '</span>',
            '</a>'
        ].join('');
    }

    function buildCategoryCard(category) {
        return [
            '<a class="category-card" href="' + escapeHtml(getCategoryHref(category.anchor)) + '" style="--hub-accent:' + category.accent + ';--hub-accent-soft:' + category.soft + ';">',
            '<span class="category-card-icon"><i class="fas ' + escapeHtml(category.icon) + '"></i></span>',
            '<strong>' + escapeHtml(category.title) + '</strong>',
            '<span class="category-card-count">' + escapeHtml(String(category.games.length)) + ' games</span>',
            '<span class="catalog-tags">' + buildTagMarkup(category.tags, 2) + '</span>',
            '<span class="category-card-arrow"><i class="fas fa-arrow-right"></i></span>',
            '</a>'
        ].join('');
    }

    function buildModeCard(mode) {
        return [
            '<article class="mode-card" style="--hub-accent:' + mode.accent + ';--hub-accent-soft:' + mode.soft + ';">',
            '<span class="mode-card-icon"><i class="fas ' + escapeHtml(mode.icon) + '"></i></span>',
            '<strong>' + escapeHtml(mode.title) + '</strong>',
            '<span>' + escapeHtml(mode.note) + '</span>',
            '</article>'
        ].join('');
    }

    function buildWeaponCard(weapon) {
        return [
            '<article class="weapon-card" style="--hub-accent:' + weapon.accent + ';--hub-accent-soft:' + weapon.soft + ';">',
            '<span class="weapon-card-icon"><i class="fas ' + escapeHtml(weapon.icon) + '"></i></span>',
            '<strong>' + escapeHtml(weapon.title) + '</strong>',
            '<span>' + escapeHtml(weapon.note) + '</span>',
            '</article>'
        ].join('');
    }

    function buildCategoryRackCard(category) {
        return [
            '<a class="rack-card" href="' + escapeHtml(getCategoryHref(category.anchor)) + '" style="--hub-accent:' + category.accent + ';--hub-accent-soft:' + category.soft + ';">',
            '<span class="rack-icon"><i class="fas ' + escapeHtml(category.icon) + '"></i></span>',
            '<span class="rack-copy">',
            '<strong>' + escapeHtml(category.title) + '</strong>',
            '<small>' + escapeHtml(category.description) + '</small>',
            '</span>',
            '<span class="rack-count">' + escapeHtml(String(category.games.length)) + '</span>',
            '</a>'
        ].join('');
    }

    function buildHeroCategoryShortcut(category) {
        return [
            '<a class="home-hero-category-item" href="' + escapeHtml(getCategoryHref(category.anchor)) + '" style="--hub-accent:' + category.accent + ';--hub-accent-soft:' + category.soft + ';">',
            '<span class="home-hero-category-icon"><i class="fas ' + escapeHtml(category.icon) + '"></i></span>',
            '<span class="home-hero-category-copy">',
            '<strong>' + escapeHtml(category.title) + '</strong>',
            '<span>' + escapeHtml(String(category.games.length)) + ' games</span>',
            '</span>',
            '<span class="home-hero-category-arrow"><i class="fas fa-arrow-right"></i></span>',
            '</a>'
        ].join('');
    }

    function buildSearchCard(game) {
        return buildGameCard(game, {
            compact: true,
            linkLabel: 'Open game'
        });
    }

    function buildJumpCard(category) {
        return [
            '<article class="jump-card" style="--hub-accent:' + category.accent + ';--hub-accent-soft:' + category.soft + ';">',
            '<span class="jump-card-icon"><i class="fas ' + escapeHtml(category.icon) + '"></i></span>',
            '<h3><a href="#' + escapeHtml(category.anchor) + '">' + escapeHtml(category.title) + '</a></h3>',
            '<div class="jump-card-meta"><span>' + escapeHtml(String(category.games.length)) + ' games</span><a href="#' + escapeHtml(category.anchor) + '">Jump in</a></div>',
            '</article>'
        ].join('');
    }

    function buildRail(category) {
        var games = category.games.slice(0, 4).map(function (game) {
            return buildGameCard(game, {
                compact: true,
                badgeLabel: 'Quick Pick',
                linkLabel: 'Open page'
            });
        }).join('');

        return [
            '<section class="hub-rail" style="--hub-accent:' + category.accent + ';--hub-accent-soft:' + category.soft + ';">',
            '<div class="hub-rail-header">',
            '<div>',
            '<span class="page-eyebrow"><i class="fas ' + escapeHtml(category.icon) + '"></i>' + escapeHtml(category.title) + '</span>',
            '<h3>' + escapeHtml(category.title) + '</h3>',
            '<p>' + escapeHtml(category.description) + '</p>',
            '</div>',
            '<a class="hub-card-link" href="' + escapeHtml(getCategoryHref(category.anchor)) + '">View all ' + escapeHtml(String(category.games.length)) + '</a>',
            '</div>',
            '<div class="hub-rail-grid">' + games + '</div>',
            '</section>'
        ].join('');
    }

    function buildCatalogSection(category) {
        var games = category.games.map(function (game) {
            return buildGameCard(game, {
                compact: false,
                badgeLabel: 'Collection Page',
                linkLabel: 'Open game page'
            });
        }).join('');

        return [
            '<section class="catalog-section hub-category-section" id="' + escapeHtml(category.anchor) + '" style="--hub-accent:' + category.accent + ';--hub-accent-soft:' + category.soft + ';">',
            '<div class="catalog-section-header">',
            '<div>',
            '<span class="page-eyebrow"><i class="fas ' + escapeHtml(category.icon) + '"></i>' + escapeHtml(category.title) + '</span>',
            '<h2>' + escapeHtml(category.title) + '</h2>',
            '<p>' + escapeHtml(category.description) + '</p>',
            '</div>',
            '<span class="catalog-badge"><i class="fas fa-layer-group"></i>' + escapeHtml(String(category.games.length)) + ' games</span>',
            '</div>',
            '<div class="catalog-grid">' + games + '</div>',
            '</section>'
        ].join('');
    }

    function renderSharedStats(categories) {
        var totalGames = categories.reduce(function (sum, category) {
            return sum + category.games.length;
        }, 0);
        var shooterGames = categories.reduce(function (sum, category) {
            if (category.key === 'fps' || category.key === 'battleRoyale' || category.key === 'sniper') {
                return sum + category.games.length;
            }

            return sum;
        }, 0);

        document.querySelectorAll('[data-total-games]').forEach(function (element) {
            element.textContent = String(totalGames);
        });

        document.querySelectorAll('[data-total-categories]').forEach(function (element) {
            element.textContent = String(categories.length);
        });

        document.querySelectorAll('[data-shooter-games]').forEach(function (element) {
            element.textContent = String(shooterGames);
        });
    }

    function renderSearchResults(resultsElement, statusElement, games, message) {
        if (!resultsElement) {
            return;
        }

        if (!games.length) {
            resultsElement.innerHTML = '<div class="site-note"><p>No matching shooter pages found. Try FPS, sniper, or survival keywords.</p></div>';
            if (statusElement) {
                statusElement.textContent = message;
            }
            return;
        }

        resultsElement.innerHTML = games.map(buildSearchCard).join('');

        if (statusElement) {
            statusElement.textContent = message;
        }
    }

    function setupHomeSearch(categories) {
        var panel = document.getElementById('home-search-panel');
        var input = document.getElementById('home-search-input');
        var results = document.getElementById('home-search-results');
        var status = document.getElementById('home-search-status');

        if (!panel || !results) {
            return;
        }

        var allGames = getAllGames(categories);
        var featuredGames = getFeaturedGames(categories, 6);

        function renderInitialSearchState() {
            renderSearchResults(
                results,
                status,
                featuredGames,
                'Quick-search the collection without leaving the launch screen.'
            );
        }

        renderInitialSearchState();

        if (!input) {
            return;
        }

        input.addEventListener('input', function () {
            var query = String(input.value || '').trim().toLowerCase();

            if (!query) {
                renderInitialSearchState();
                return;
            }

            var matches = allGames.filter(function (game) {
                return game.searchText.indexOf(query) !== -1;
            }).slice(0, 8);

            renderSearchResults(
                results,
                status,
                matches,
                matches.length + ' result' + (matches.length === 1 ? '' : 's') + ' for "' + query + '".'
            );
        });
    }

    function renderHome(categories) {
        var featuredGames = getFeaturedGames(categories, 8);
        var homeFeaturedGrid = document.getElementById('home-featured-grid');
        var homeCategoryGrid = document.getElementById('home-category-grid');
        var homeModesGrid = document.getElementById('home-modes-grid');
        var homeWeaponsRail = document.getElementById('home-weapons-rail');
        var homeTrendingGrid = document.getElementById('home-trending-grid');
        var homeFpsGrid = document.getElementById('home-fps-grid');
        var homeBattleGrid = document.getElementById('home-battle-grid');
        var homeSniperGrid = document.getElementById('home-sniper-grid');
        var homeNewGrid = document.getElementById('home-new-grid');

        if (homeFeaturedGrid) {
            homeFeaturedGrid.innerHTML = featuredGames.map(function (game) {
                return buildGameCard(game, {
                    compact: false,
                    linkLabel: 'Play Now'
                });
            }).join('');
        }

        if (homeCategoryGrid) {
            homeCategoryGrid.innerHTML = categories.map(buildCategoryCard).join('');
        }

        if (homeModesGrid) {
            homeModesGrid.innerHTML = [
                {
                    title: 'Team Deathmatch',
                    note: 'Fast objective pressure',
                    icon: 'fa-swords',
                    accent: '#00e5ff',
                    soft: 'rgba(0, 229, 255, 0.16)'
                },
                {
                    title: 'Sniper Arena',
                    note: 'Precision first shots',
                    icon: 'fa-crosshairs',
                    accent: '#ff3b30',
                    soft: 'rgba(255, 59, 48, 0.16)'
                },
                {
                    title: 'Squad Battle',
                    note: 'Team-up and push',
                    icon: 'fa-users',
                    accent: '#6ee7a8',
                    soft: 'rgba(110, 231, 168, 0.16)'
                },
                {
                    title: 'Battle Royale',
                    note: 'Last player standing',
                    icon: 'fa-skull',
                    accent: '#ff9f43',
                    soft: 'rgba(255, 159, 67, 0.16)'
                },
                {
                    title: 'Gun Game',
                    note: 'Rapid weapon swaps',
                    icon: 'fa-bolt',
                    accent: '#9dd6ff',
                    soft: 'rgba(157, 214, 255, 0.16)'
                }
            ].map(buildModeCard).join('');
        }

        if (homeWeaponsRail) {
            homeWeaponsRail.innerHTML = [
                {
                    title: 'AK-47',
                    note: 'Reliable auto fire',
                    icon: 'fa-bullseye',
                    accent: '#00e5ff',
                    soft: 'rgba(0, 229, 255, 0.16)'
                },
                {
                    title: 'Sniper Rifle',
                    note: 'Long-range precision',
                    icon: 'fa-crosshairs',
                    accent: '#ff3b30',
                    soft: 'rgba(255, 59, 48, 0.16)'
                },
                {
                    title: 'Shotgun',
                    note: 'Close-range burst',
                    icon: 'fa-burst',
                    accent: '#ff9f43',
                    soft: 'rgba(255, 159, 67, 0.16)'
                },
                {
                    title: 'SMG',
                    note: 'Fast spray control',
                    icon: 'fa-bolt',
                    accent: '#6ee7a8',
                    soft: 'rgba(110, 231, 168, 0.16)'
                },
                {
                    title: 'Energy Rifle',
                    note: 'Sci-fi fire lanes',
                    icon: 'fa-circle-nodes',
                    accent: '#9dd6ff',
                    soft: 'rgba(157, 214, 255, 0.16)'
                }
            ].map(buildWeaponCard).join('');
        }

        if (homeTrendingGrid) {
            var multiplayerCategory = getCategoryByKey(categories, 'multiplayer');
            var trendingGames = multiplayerCategory ? getTopRatedGames(multiplayerCategory.games, 6) : [];

            homeTrendingGrid.innerHTML = trendingGames.map(function (game) {
                return buildGameCard(game, {
                    compact: false,
                    linkLabel: 'Play Now'
                });
            }).join('');
        }

        if (homeFpsGrid) {
            var fpsCategory = getCategoryByKey(categories, 'fps');
            var topFpsGames = fpsCategory ? getTopRatedGames(fpsCategory.games, 6) : [];

            homeFpsGrid.innerHTML = topFpsGames.map(function (game) {
                return buildGameCard(game, {
                    compact: false,
                    linkLabel: 'Play Now'
                });
            }).join('');
        }

        if (homeBattleGrid) {
            var battleRoyaleCategory = getCategoryByKey(categories, 'battleRoyale');
            var battleRoyaleGames = battleRoyaleCategory ? getTopRatedGames(battleRoyaleCategory.games, 6) : [];

            homeBattleGrid.innerHTML = battleRoyaleGames.map(function (game) {
                return buildGameCard(game, {
                    compact: false,
                    linkLabel: 'Play Now'
                });
            }).join('');
        }

        if (homeSniperGrid) {
            var sniperCategory = getCategoryByKey(categories, 'sniper');
            var sniperGames = sniperCategory ? getTopRatedGames(sniperCategory.games, 6) : [];

            homeSniperGrid.innerHTML = sniperGames.map(function (game) {
                return buildGameCard(game, {
                    compact: false,
                    linkLabel: 'Play Now'
                });
            }).join('');
        }

        if (homeNewGrid) {
            var newestGames = getNewestGames(categories, 8);

            homeNewGrid.innerHTML = newestGames.map(function (game) {
                return buildGameCard(game, {
                    compact: false,
                    linkLabel: 'Play Now'
                });
            }).join('');
        }

        setupHomeSearch(categories);
    }

    function renderCatalog(categories) {
        var jumpGrid = document.getElementById('catalog-jump-grid');
        var catalogSections = document.getElementById('catalog-sections');

        if (jumpGrid) {
            jumpGrid.innerHTML = categories.map(buildJumpCard).join('');
        }

        if (catalogSections) {
            catalogSections.innerHTML = categories.map(buildCatalogSection).join('');
        }
    }

    function setMenuState(panel, isOpen, trigger) {
        panel.hidden = !isOpen;
        document.body.classList.toggle('mobile-menu-open', isOpen);

        if (trigger) {
            trigger.setAttribute('aria-expanded', String(isOpen));
        }

        document.querySelectorAll('[data-mobile-menu-toggle="' + panel.id + '"]').forEach(function (item) {
            item.setAttribute('aria-expanded', String(isOpen));
        });
    }

    function setSearchState(panel, isOpen, trigger) {
        panel.hidden = !isOpen;
        document.body.classList.toggle('search-open', isOpen);

        if (trigger) {
            trigger.setAttribute('aria-expanded', String(isOpen));
        }

        document.querySelectorAll('[data-search-toggle="' + panel.id + '"]').forEach(function (item) {
            item.setAttribute('aria-expanded', String(isOpen));
        });

        if (isOpen) {
            var input = panel.querySelector('input[type="search"]');
            if (input) {
                window.setTimeout(function () {
                    input.focus();
                }, 40);
            }
        }
    }

    function markCombatFrameLoaded(shell) {
        if (!shell || shell.classList.contains('is-loaded')) {
            return;
        }

        shell.classList.add('is-loaded');
    }

    function setupCombatFrames() {
        document.querySelectorAll('.combat-frame-shell').forEach(function (shell) {
            var iframe = shell.querySelector('iframe');

            if (!iframe) {
                return;
            }

            iframe.addEventListener('load', function () {
                markCombatFrameLoaded(shell);
            });

            window.setTimeout(function () {
                markCombatFrameLoaded(shell);
            }, 3500);
        });
    }

    function updateTopbarState() {
        var topbar = document.querySelector('.topbar');
        if (!topbar) {
            return;
        }

        topbar.classList.toggle('is-scrolled', window.scrollY > 12);
    }

    function loadPlayableFrame(trigger) {
        var targetId = trigger.getAttribute('data-play-target');
        var shell = document.getElementById(targetId);

        if (!targetId || !shell || shell.dataset.loaded === 'true') {
            return;
        }

        var iframe = document.createElement('iframe');
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

        var expandButton = document.getElementById(trigger.getAttribute('data-expand-target'));
        if (expandButton) {
            expandButton.hidden = false;
            expandButton.removeAttribute('aria-hidden');
        }
    }

    document.addEventListener('click', function (event) {
        var menuTrigger = event.target.closest('[data-mobile-menu-toggle]');
        if (menuTrigger) {
            var menuPanel = document.getElementById(menuTrigger.getAttribute('data-mobile-menu-toggle'));
            if (menuPanel) {
                setMenuState(menuPanel, menuPanel.hidden, menuTrigger);
            }
            return;
        }

        var searchTrigger = event.target.closest('[data-search-toggle]');
        if (searchTrigger) {
            var searchPanel = document.getElementById(searchTrigger.getAttribute('data-search-toggle'));
            if (searchPanel) {
                setSearchState(searchPanel, searchPanel.hidden, searchTrigger);
            }
            return;
        }

        var loadTrigger = event.target.closest('[data-play-target]');
        if (loadTrigger) {
            loadPlayableFrame(loadTrigger);
            return;
        }

        var fullscreenTrigger = event.target.closest('[data-fullscreen-target]');
        if (!fullscreenTrigger) {
            return;
        }

        var shell = document.getElementById(fullscreenTrigger.getAttribute('data-fullscreen-target'));
        var iframe = shell && shell.querySelector('iframe');
        var fullscreenTarget = shell || iframe;

        if (fullscreenTarget && fullscreenTarget.requestFullscreen) {
            fullscreenTarget.requestFullscreen();
        }
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

        document.querySelectorAll('.search-drawer').forEach(function (panel) {
            if (!panel.hidden) {
                setSearchState(panel, false);
            }
        });
    });

    document.addEventListener('DOMContentLoaded', function () {
        var categories = getCategories();

        renderSharedStats(categories);
        renderHome(categories);
        renderCatalog(categories);
        setupCombatFrames();
        updateTopbarState();

        window.addEventListener('scroll', updateTopbarState, { passive: true });
    });
}());
