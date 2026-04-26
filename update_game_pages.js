const fs = require('fs');
const path = require('path');

// 游戏描述数据
const skillwarzDescription = {
    metaDescription: "SkillWarz is a fast-paced first-person shooter offering advanced movement mechanics and diverse game modes including Deathmatch, Team Deathmatch, Gun Game, Team Gun Game, Skull Hunt, Elimination, Capture The Flag, and Domination. Navigate through dynamic day and night maps featuring bounce pads, teleports, and battle pickups. Unlock unique classes, customize your gear, and challenge others or practice against bots in action-packed matches tailored to your style.",
    keywords: "SkillWarz, FPS, shooter, multiplayer, action, battle royale, sniper, online game, free game"
};

// 游戏页面目录
const gameDirectories = [
    'Action',
    'BattleRoyale',
    'FPS',
    'Multiplayer',
    'Sniper'
];

// 更新游戏页面
function updateGamePages() {
    gameDirectories.forEach(directory => {
        const dirPath = path.join(__dirname, directory);
        
        if (fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory()) {
            const files = fs.readdirSync(dirPath);
            
            files.forEach(file => {
                if (file.endsWith('.html')) {
                    const filePath = path.join(dirPath, file);
                    console.log(`Processing ${filePath}...`);
                    
                    let content = fs.readFileSync(filePath, 'utf8');
                    
                    // 更新标题
                    content = content.replace(/<title>[^<]*<\/title>/g, (match) => {
                        const gameName = match.replace(/<title>|<\/title>/g, '').split(' - ')[0];
                        return `<title>${gameName} - Play Free Online | skillwarz</title>`;
                    });
                    
                    // 更新元数据描述
                    content = content.replace(/<meta name="description" content="[^"]*">/g, (match) => {
                        return `<meta name="description" content="${skillwarzDescription.metaDescription} Play ${match.match(/<meta name="description" content="([^"]*)"/)[1].split(' ')[0]} for free on skillwarz - Fast, browser-based multiplayer FPS games. No download required!">`;
                    });
                    
                    // 更新关键词
                    content = content.replace(/<meta name="keywords" content="[^"]*">/g, (match) => {
                        return `<meta name="keywords" content="${skillwarzDescription.keywords}">`;
                    });
                    
                    // 更新og:description
                    content = content.replace(/<meta property="og:description" content="[^"]*">/g, (match) => {
                        return `<meta property="og:description" content="${skillwarzDescription.metaDescription} Play for free on skillwarz!">`;
                    });
                    
                    // 更新twitter:description
                    content = content.replace(/<meta name="twitter:description" content="[^"]*">/g, (match) => {
                        return `<meta name="twitter:description" content="${skillwarzDescription.metaDescription}">`;
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
    
    console.log('All game pages updated successfully!');
}

// 运行更新
updateGamePages();
