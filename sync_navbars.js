const fs = require('fs');
const path = require('path');

// 首页导航栏结构
const homepageNavbar = `        <a href="../index.html" class="logo">
            <svg class="logo-icon" viewBox="0 0 50 50" width="45" height="45">
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
            <a href="../categories.html?category=fps" class="nav-item">First-Person Shooters</a>
            <a href="../categories.html?category=battle-royale" class="nav-item">Battle Royale</a>
            <a href="../categories.html?category=sniper" class="nav-item">Sniper Games</a>
            <a href="../categories.html?category=multiplayer" class="nav-item">Multiplayer Shooters</a>
            <a href="../categories.html?category=action" class="nav-item">Action Shooters</a>
        </nav>
        <div class="search-bar">
            <input type="text" placeholder="搜索游戏...">
            <i class="fas fa-search"></i>
        </div>`;

// 游戏页面目录
const gameDirectories = [
    'Action',
    'BattleRoyale',
    'FPS',
    'Multiplayer',
    'Sniper'
];

// 同步导航栏
function syncNavbars() {
    gameDirectories.forEach(directory => {
        const dirPath = path.join(__dirname, directory);
        
        if (fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory()) {
            const files = fs.readdirSync(dirPath);
            
            files.forEach(file => {
                if (file.endsWith('.html')) {
                    const filePath = path.join(dirPath, file);
                    console.log(`Processing ${filePath}...`);
                    
                    let content = fs.readFileSync(filePath, 'utf8');
                    
                    // 替换导航栏
                    content = content.replace(/<header class="header">[\s\S]*?<\/header>/g, (match) => {
                        return `<header class="header">
${homepageNavbar}
    </header>`;
                    });
                    
                    // 写入更新后的内容
                    fs.writeFileSync(filePath, content, 'utf8');
                    console.log(`Updated ${filePath}`);
                }
            });
        } else {
            console.log(`Directory ${directory} does not exist`);
        }
    });
    
    console.log('All navbars synced successfully!');
}

// 运行同步
syncNavbars();
