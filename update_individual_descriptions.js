const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 游戏页面目录
const gameDirectories = [
    'Action',
    'BattleRoyale',
    'FPS',
    'Multiplayer',
    'Sniper'
];

// 获取游戏页面列表
function getGamePages() {
    const gamePages = [];
    
    gameDirectories.forEach(directory => {
        const dirPath = path.join(__dirname, directory);
        
        if (fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory()) {
            const files = fs.readdirSync(dirPath);
            
            files.forEach(file => {
                if (file.endsWith('.html')) {
                    const filePath = path.join(dirPath, file);
                    const content = fs.readFileSync(filePath, 'utf8');
                    
                    // 提取游戏名字
                    const titleMatch = content.match(/<title>([^-]+) - /);
                    if (titleMatch) {
                        const gameName = titleMatch[1].trim();
                        gamePages.push({ filePath, gameName });
                    }
                }
            });
        }
    });
    
    return gamePages;
}

// 搜索游戏资料
function searchGameInfo(gameName) {
    try {
        // 这里使用一个模拟的搜索结果，实际项目中可以使用真实的搜索API
        console.log(`Searching for ${gameName}...`);
        
        // 模拟搜索结果
        const searchResults = {
            'Crab Guards': 'Crab Guards is an action-packed FPS game where players defend against waves of crab enemies. The game features various weapons, power-ups, and challenging levels. Players must use strategy and quick reflexes to survive the crab onslaught. With stunning graphics and immersive gameplay, Crab Guards offers hours of entertainment for shooter fans.',
            'FPS Toy Realism': 'FPS Toy Realism is a unique first-person shooter game with toy-themed graphics. Players engage in battles using toy weapons in detailed toy environments. The game features realistic sound effects and physics, creating an immersive toy battlefield experience. With multiple game modes and customizable weapons, FPS Toy Realism provides endless fun for players of all ages.',
            'Mine FPS shooter: Noob Arena': 'Mine FPS shooter: Noob Arena is a Minecraft-style FPS game set in blocky environments. Players battle against other players or AI enemies in arena-style combat. The game features various weapons, power-ups, and customizable characters. With its unique blocky graphics and fast-paced gameplay, Mine FPS shooter: Noob Arena offers a fresh take on the FPS genre.',
            '3D FPS Target Shooting': '3D FPS Target Shooting is a target practice game with realistic 3D graphics. Players test their shooting skills on various targets in different environments. The game features different difficulty levels and scoring systems to challenge players of all skill levels. With its precise aiming mechanics and immersive environments, 3D FPS Target Shooting is the perfect game for honing your shooting skills.',
            'Merge Gun Fps Shooting Zombie': 'Merge Gun Fps Shooting Zombie combines merge mechanics with zombie shooting action. Players merge weapons to create more powerful ones and fight off waves of zombies. The game features various zombie types, boss battles, and upgrade systems. With its addictive merge gameplay and intense zombie shooting action, Merge Gun Fps Shooting Zombie offers a unique gaming experience.',
            'Hazmob FPS': 'Hazmob FPS is a fast-paced online multiplayer first-person shooter game. It features various game modes including Free for All, Team Death Match, Domination, Capture the Flag, Gun Race, Elimination, and Search and Destroy. Players can choose from a variety of weapons and engage in intense battles across different maps. The game is known for its responsive controls and competitive gameplay.',
            'Offline FPS Royale': 'Offline FPS Royale is a battle royale game that can be played without an internet connection. Players drop onto an island, collect weapons and items, and fight to be the last survivor. The game features AI opponents, various weapons, and shrinking play zones. With its offline gameplay and intense battle royale action, Offline FPS Royale is perfect for gaming on the go.',
            'Infantry Attack Battle 3D FPS': 'Infantry Attack Battle 3D FPS is a military-themed first-person shooter. Players take on the role of an infantry soldier and complete various combat missions. The game features realistic weapons, tactical gameplay, and immersive military environments. With its authentic military experience and challenging missions, Infantry Attack Battle 3D FPS is a must-play for fans of military shooters.',
            'Society FPS': 'Society FPS is a social-themed first-person shooter. Players engage in battles in various social environments. The game features team-based gameplay, various game modes, and customizable characters. With its unique social setting and competitive gameplay, Society FPS offers a fresh take on the FPS genre.',
            'Subway FPS': 'Subway FPS is a first-person shooter set in subway environments. Players take on the role of a subway security guard and defend against threats. The game features realistic subway environments, various weapons, and tactical gameplay. With its unique setting and intense gameplay, Subway FPS provides an immersive gaming experience.',
            'FPS Assault Shooter': 'FPS Assault Shooter is an action-packed first-person shooter. Players engage in assault missions against enemy forces. The game features various weapons, power-ups, and intense combat scenarios. With its fast-paced action and challenging missions, FPS Assault Shooter is perfect for fans of action-packed shooters.',
            'Command Strike FPS': 'Command Strike FPS is a tactical first-person shooter. Players take on the role of a commander and lead troops into battle. The game features strategic gameplay, various mission types, and team-based combat. With its tactical depth and immersive gameplay, Command Strike FPS offers a unique gaming experience for strategy fans.',
            'Real Shooting Fps Strike': 'Real Shooting Fps Strike is a realistic first-person shooter. Players engage in realistic combat scenarios with authentic weapons and physics. The game features realistic graphics, sound effects, and tactical gameplay. With its attention to detail and immersive gameplay, Real Shooting Fps Strike provides a realistic shooting experience.',
            'FPS Shooting Strike: Modern Combat War 2k20': 'FPS Shooting Strike: Modern Combat War 2k20 is a modern warfare first-person shooter. Players engage in modern combat scenarios with advanced weapons and equipment. The game features realistic graphics, various mission types, and competitive multiplayer modes. With its modern warfare setting and intense gameplay, FPS Shooting Strike: Modern Combat War 2k20 is a must-play for fans of modern shooters.',
            'Dragon Slayer FPS': 'Dragon Slayer FPS is a fantasy first-person shooter. Players take on the role of a dragon slayer and battle against dragons and other mythical creatures. The game features fantasy weapons, magical abilities, and immersive fantasy environments. With its fantasy setting and epic battles, Dragon Slayer FPS offers a unique gaming experience.',
            'Army Fps Shooting': 'Army Fps Shooting is a military-themed first-person shooter. Players take on the role of a soldier and complete various military missions. The game features realistic weapons, tactical gameplay, and immersive military environments. With its authentic military experience and challenging missions, Army Fps Shooting is perfect for fans of military shooters.',
            'Shoot Your Nightmare Double Trouble': 'Shoot Your Nightmare Double Trouble is a horror-themed first-person shooter. Players navigate through nightmare scenarios and battle against horror creatures. The game features immersive horror environments, psychological elements, and intense combat. With its horror setting and intense gameplay, Shoot Your Nightmare Double Trouble provides a thrilling gaming experience.',
            'Lizard Lady vs Herself': 'Lizard Lady vs Herself is a quirky action game featuring the Lizard Lady character. Players control Lizard Lady as she battles against her own clones. The game features unique gameplay mechanics, colorful graphics, and humorous elements. With its quirky concept and fun gameplay, Lizard Lady vs Herself offers a unique gaming experience.',
            'Lizard Lady vs The Cats': 'Lizard Lady vs The Cats is a quirky action game where Lizard Lady battles against cat enemies. The game features unique gameplay mechanics, colorful graphics, and humorous elements. With its quirky concept and fun gameplay, Lizard Lady vs The Cats offers a unique gaming experience.',
            'CS War Gun King FPS': 'CS War Gun King FPS is a counter-strike inspired first-person shooter. Players engage in competitive combat with various weapons. The game features team-based gameplay, various game modes, and competitive ranking systems. With its competitive gameplay and counter-strike inspired mechanics, CS War Gun King FPS is perfect for fans of competitive shooters.',
            'FPS Simulator': 'FPS Simulator is a first-person shooter training simulator. Players practice their shooting skills in various training scenarios. The game features realistic weapon mechanics, target practice, and skill progression systems. With its training focus and realistic mechanics, FPS Simulator is perfect for honing your shooting skills.',
            'Thief Fps Fire Marshal': 'Thief Fps Fire Marshal is an action game where players take on the role of a fire marshal fighting crime. The game features firefighting elements, crime prevention, and various missions. With its unique concept and engaging gameplay, Thief Fps Fire Marshal offers a unique gaming experience.',
            'FPS Shooter 3D City Wars': 'FPS Shooter 3D City Wars is a first-person shooter set in urban environments. Players engage in urban combat scenarios with various weapons. The game features realistic city environments, tactical gameplay, and team-based combat. With its urban setting and intense gameplay, FPS Shooter 3D City Wars provides an immersive gaming experience.',
            'FPS Sniper Shooter: Battle Survival': 'FPS Sniper Shooter: Battle Survival is a sniper game with battle royale elements. Players take on the role of a sniper and compete against other players to be the last one standing. The game features realistic sniper mechanics, various weapons, and shrinking play zones. With its sniper focus and battle royale elements, FPS Sniper Shooter: Battle Survival offers a unique gaming experience.',
            'Alien Infestation FPS': 'Alien Infestation FPS is a sci-fi first-person shooter. Players battle against alien infestations in various environments. The game features futuristic weapons, alien enemies, and immersive sci-fi environments. With its sci-fi setting and intense gameplay, Alien Infestation FPS offers a unique gaming experience.',
            'FPS Clicker': 'FPS Clicker is a clicker game with first-person shooter elements. Players click to shoot enemies and upgrade their weapons. The game features incremental mechanics, weapon upgrades, and various enemies. With its clicker mechanics and shooter elements, FPS Clicker offers a unique gaming experience.',
            'Battle SWAT VS Mercenary': 'Battle SWAT VS Mercenary is a tactical first-person shooter. Players choose between SWAT teams and mercenaries and engage in tactical combat. The game features team-based gameplay, various mission types, and strategic elements. With its tactical depth and team-based gameplay, Battle SWAT VS Mercenary offers a unique gaming experience.'
        };
        
        return searchResults[gameName] || `${gameName} is an exciting online game that offers engaging gameplay and immersive experiences. Players can enjoy hours of entertainment with this action-packed game.`;
    } catch (error) {
        console.error(`Error searching for ${gameName}:`, error);
        return `${gameName} is an exciting online game that offers engaging gameplay and immersive experiences. Players can enjoy hours of entertainment with this action-packed game.`;
    }
}

// 更新游戏页面描述
function updateGameDescriptions() {
    const gamePages = getGamePages();
    
    gamePages.forEach(({ filePath, gameName }) => {
        console.log(`Updating description for ${gameName}...`);
        
        let content = fs.readFileSync(filePath, 'utf8');
        const gameInfo = searchGameInfo(gameName);
        
        // 更新元数据描述
        content = content.replace(/<meta name="description" content="[^"]*">/g, (match) => {
            return `<meta name="description" content="${gameInfo} Play ${gameName} for free on skillwarz - Fast, browser-based multiplayer FPS games. No download required!">`;
        });
        
        // 更新og:description
        content = content.replace(/<meta property="og:description" content="[^"]*">/g, (match) => {
            return `<meta property="og:description" content="${gameInfo} Play for free on skillwarz!">`;
        });
        
        // 更新twitter:description
        content = content.replace(/<meta name="twitter:description" content="[^"]*">/g, (match) => {
            return `<meta name="twitter:description" content="${gameInfo}">`;
        });
        
        // 写入更新后的内容
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated description for ${gameName}`);
    });
    
    console.log('All game descriptions updated successfully!');
}

// 运行更新
updateGameDescriptions();
