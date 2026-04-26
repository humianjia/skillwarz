const fs = require('fs');
const path = require('path');

// 游戏描述数据
const skillwarzDescription = {
    general: "SkillWarz is a fast-paced first-person shooter offering advanced movement mechanics and diverse game modes including Deathmatch, Team Deathmatch, Gun Game, Team Gun Game, Skull Hunt, Elimination, Capture The Flag, and Domination. Navigate through dynamic day and night maps featuring bounce pads, teleports, and battle pickups. Unlock unique classes, customize your gear, and challenge others or practice against bots in action-packed matches tailored to your style.",
    features: "Features advanced movement system with slide and sprint mechanics, bounce pads, teleport systems, and fluid combat movement. Experience diverse game modes with dynamic map design including day/night cycles, interactive elements, and battle pickups. Customize your gameplay with unique classes, gear customization, and a variety of weapons.",
    controls: "WASD = move, Space = jump, C = crouch/slide, Shift = sprint, R = reload weapon, Left click = fire weapon, Right click = aim down the sight, Mouse wheel = switch weapon, Q = melee, G = primary grenade, F = secondary grenade, 1 = select primary weapon, 2 = select secondary weapon, 3 = select melee weapon, 4 = use pickup bonus, Tab = scoreboard, ~ = menu, T = spray, Y = say all, U = say team"
};

// 游戏数据文件路径
const gameDataFiles = [
    'js/game_data/action.js',
    'js/game_data/battleRoyale.js',
    'js/game_data/fps.js',
    'js/game_data/multiplayer.js',
    'js/game_data/sniper.js'
];

// 更新游戏描述
function updateGameDescriptions() {
    gameDataFiles.forEach(filePath => {
        const fullPath = path.join(__dirname, filePath);
        
        if (fs.existsSync(fullPath)) {
            console.log(`Processing ${filePath}...`);
            
            let content = fs.readFileSync(fullPath, 'utf8');
            
            // 替换所有游戏的描述
            content = content.replace(/"description": "[^"]*",/g, (match) => {
                return `"description": "${skillwarzDescription.general} ${skillwarzDescription.features}",`;
            });
            
            // 替换关键词
            content = content.replace(/"keywords": "[^"]*",/g, (match) => {
                return `"keywords": "SkillWarz, FPS, shooter, multiplayer, action, battle royale, sniper",`;
            });
            
            // 替换游戏类型
            content = content.replace(/"gameType": "[^"]*",/g, (match) => {
                return `"gameType": "SkillWarz",`;
            });
            
            // 写入更新后的内容
            fs.writeFileSync(fullPath, content, 'utf8');
            console.log(`Updated ${filePath}`);
        } else {
            console.log(`File ${filePath} does not exist`);
        }
    });
    
    console.log('All game descriptions updated successfully!');
}

// 运行更新
updateGameDescriptions();
