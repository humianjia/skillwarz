function getAllHomeGames() {
    return [
        ...(window.gamesData || []),
        ...(window.actionGames || []),
        ...(window.battleRoyaleData || []),
        ...(window.fpsData || []),
        ...(window.multiplayerGames || []),
        ...(window.sniperData || [])
    ];
}

function getLocaleApi() {
    return window.SkillWarzLocale || null;
}

function getHomeLocaleText(key) {
    const localeApi = getLocaleApi();
    return localeApi ? localeApi.t('home', key) : '';
}

function resolveHomeImageUrl(path) {
    const localeApi = getLocaleApi();
    return localeApi ? localeApi.resolveGameImageUrl(path) : path;
}

function resolveHomePageLink(path) {
    const localeApi = getLocaleApi();
    return localeApi ? localeApi.resolvePageLink(path) : path;
}

function getHomeDefaultGame() {
    return Array.isArray(window.gamesData) && window.gamesData.length > 0 ? window.gamesData[0] : null;
}

function setGameLoadingState(isLoading, message) {
    const showcase = document.querySelector('.game-showcase');
    const overlay = document.getElementById('game-loading-overlay');
    const status = document.getElementById('game-load-status');

    if (showcase) {
        showcase.classList.toggle('is-loading', !!isLoading);
        showcase.classList.toggle('is-loaded', !isLoading);
    }

    if (overlay) {
        overlay.hidden = !isLoading;
    }

    if (status && message) {
        status.textContent = message;
    }
}

function loadMainGame() {
    const game = getHomeDefaultGame();
    const iframe = document.getElementById('game-iframe');
    const title = document.getElementById('current-game-title');
    const icon = document.getElementById('game-icon');

    if (!game) {
        return;
    }

    if (iframe && game.iframeUrl && iframe.src !== game.iframeUrl) {
        setGameLoadingState(true, getHomeLocaleText('launchingBrowser') || 'Launching in browser...');
        iframe.src = game.iframeUrl;
    }

    if (title) {
        title.textContent = game.name || getHomeLocaleText('genericGame') || 'Game';
    }

    if (icon && game.imageUrl) {
        icon.src = resolveHomeImageUrl(game.imageUrl);
        icon.alt = game.name || getHomeLocaleText('genericGameIcon') || 'Game icon';
    }
}

function loadGame(gameIndex) {
    if (!Array.isArray(window.gamesData) || !window.gamesData[gameIndex]) {
        return;
    }

    const game = window.gamesData[gameIndex];
    const iframe = document.getElementById('game-iframe');
    const title = document.getElementById('current-game-title');
    const icon = document.getElementById('game-icon');

    if (iframe) {
        setGameLoadingState(true, getHomeLocaleText('loadingSelectedGame') || 'Loading selected game...');
        iframe.src = game.iframeUrl || '';
    }

    if (title) {
        title.textContent = game.name || getHomeLocaleText('genericGame') || 'Game';
    }

    if (icon && game.imageUrl) {
        icon.src = resolveHomeImageUrl(game.imageUrl);
        icon.alt = game.name || getHomeLocaleText('genericGameIcon') || 'Game icon';
    }
}

function toggleFullscreen() {
    const gameFrame = document.querySelector('.game-frame');
    if (!gameFrame) {
        return;
    }

    if (gameFrame.requestFullscreen) {
        gameFrame.requestFullscreen();
    } else if (gameFrame.webkitRequestFullscreen) {
        gameFrame.webkitRequestFullscreen();
    } else if (gameFrame.msRequestFullscreen) {
        gameFrame.msRequestFullscreen();
    }
}

function syncFullscreenState() {
    const gameFrame = document.querySelector('.game-frame');
    const iframe = document.getElementById('game-iframe');
    const mask = document.querySelector('.iframe-bottom-mask');

    if (!gameFrame || !iframe) {
        return;
    }

    const isFullscreen =
        document.fullscreenElement === gameFrame ||
        document.webkitFullscreenElement === gameFrame;

    gameFrame.classList.toggle('fullscreen-active', isFullscreen);

    if (mask) {
        mask.classList.toggle('fullscreen-mask', isFullscreen);
    }

    if (isFullscreen) {
        iframe.style.height = '110vh';
        iframe.style.width = '100vw';
        iframe.style.objectFit = 'cover';
        iframe.style.objectPosition = 'top -40px';
    } else {
        iframe.style.height = '';
        iframe.style.width = '';
        iframe.style.objectFit = '';
        iframe.style.objectPosition = '';
    }
}

document.addEventListener('fullscreenchange', syncFullscreenState);
document.addEventListener('webkitfullscreenchange', syncFullscreenState);

function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function loadRelatedGames() {
    const container = document.getElementById('related-games-container');
    if (!container) {
        return;
    }

    const games = shuffleArray(getAllHomeGames())
        .filter((game) => game && game.id !== 'skillwarz')
        .slice(0, 12);

    container.innerHTML = '';

    games.forEach((game) => {
        const card = document.createElement('div');
        card.className = 'game-card';
        card.setAttribute('data-game', game.id);
        card.innerHTML = `
            <img src="${resolveHomeImageUrl(game.imageUrl || 'img/icon/veckIo.jpg')}" alt="${game.name || (getHomeLocaleText('genericGame') || 'Game')}" loading="lazy" onerror="this.src='/img/icon/veckIo.jpg'">
            <div class="game-card-title">${game.name || (getHomeLocaleText('genericGame') || 'Game')}</div>
        `;
        card.addEventListener('click', function () {
            loadGameById(game.id);
        });
        container.appendChild(card);
    });
}

function loadGameById(gameId) {
    const game = getAllHomeGames().find((item) => item.id === gameId);
    if (game && game.link) {
        window.location.href = resolveHomePageLink(game.link);
    }
}

function initHomeSearch() {
    const input = document.getElementById('home-search-input');
    const icon = document.querySelector('.search-bar i');
    if (!input) {
        return;
    }

    const allGames = getAllHomeGames();

    function findGame(query) {
        const needle = String(query || '').trim().toLowerCase();
        if (!needle) {
            return null;
        }

        return allGames.find((game) => {
            const haystack = [
                game.name,
                game.id,
                game.gameType,
                game.description,
                game.keywords,
                Array.isArray(game.tags) ? game.tags.join(' ') : ''
            ].join(' ').toLowerCase();

            return haystack.includes(needle);
        }) || null;
    }

    function submitSearch() {
        const match = findGame(input.value);
        if (!match) {
            return;
        }

        if (match.id === 'skillwarz') {
            const target = document.getElementById('skillwarz-game');
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            return;
        }

        if (match.link) {
            window.location.href = resolveHomePageLink(match.link);
        }
    }

    input.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            submitSearch();
        }
    });

    if (icon) {
        icon.style.cursor = 'pointer';
        icon.addEventListener('click', submitSearch);
    }
}

function initScrollEnhancements() {
    const progressBar = document.getElementById('reading-progress-bar');
    const backToTop = document.getElementById('back-to-top');

    function update() {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0;

        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }

        if (backToTop) {
            backToTop.classList.toggle('is-visible', scrollTop > 500);
        }
    }

    update();
    window.addEventListener('scroll', update, { passive: true });
}

function initParticles() {
    const container = document.getElementById('particles');
    if (!container) {
        return;
    }

    for (let i = 0; i < 30; i += 1) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.animationDelay = `${Math.random() * 20}s`;
        particle.style.animationDuration = `${15 + Math.random() * 10}s`;
        particle.style.width = `${3 + Math.random() * 4}px`;
        particle.style.height = particle.style.width;
        container.appendChild(particle);
    }
}

function initCursorGlow() {
    const glow = document.getElementById('cursorGlow');
    if (!glow) {
        return;
    }

    document.addEventListener('mousemove', function (event) {
        glow.style.left = `${event.clientX}px`;
        glow.style.top = `${event.clientY}px`;
    });

    document.addEventListener('mouseleave', function () {
        glow.style.opacity = '0';
    });

    document.addEventListener('mouseenter', function () {
        glow.style.opacity = '1';
    });
}

function initGameFrameLoading() {
    const iframe = document.getElementById('game-iframe');
    if (!iframe) {
        return;
    }

    iframe.addEventListener('load', function () {
        setGameLoadingState(false, getHomeLocaleText('liveNow') || 'Live now. Jump into the match.');
    });

    window.setTimeout(function () {
        setGameLoadingState(false, getHomeLocaleText('readyToPlay') || 'Ready to play. Click inside the frame if needed.');
    }, 8000);
}

function bootstrapHomePage() {
    initParticles();
    initCursorGlow();
    initHomeSearch();
    initScrollEnhancements();
    initGameFrameLoading();
    loadMainGame();
    loadRelatedGames();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrapHomePage);
} else {
    bootstrapHomePage();
}
