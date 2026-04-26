const fs = require('fs');
const path = require('path');

// 游戏页面目录
const gameDirectories = [
    'Action',
    'BattleRoyale',
    'FPS',
    'Multiplayer',
    'Sniper'
];

// 获取所有非index.html的页面
function getNonIndexPages() {
    const pages = [];
    
    // 检查根目录下的非index.html文件
    const rootFiles = fs.readdirSync(__dirname);
    rootFiles.forEach(file => {
        if (file.endsWith('.html') && file !== 'index.html') {
            const filePath = path.join(__dirname, file);
            const content = fs.readFileSync(filePath, 'utf8');
            const titleMatch = content.match(/<title>([^-]+) - /);
            if (titleMatch) {
                const pageName = titleMatch[1].trim();
                pages.push({ filePath, pageName });
            }
        }
    });
    
    // 检查游戏分类目录下的文件
    gameDirectories.forEach(directory => {
        const dirPath = path.join(__dirname, directory);
        
        if (fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory()) {
            const files = fs.readdirSync(dirPath);
            
            files.forEach(file => {
                if (file.endsWith('.html')) {
                    const filePath = path.join(dirPath, file);
                    const content = fs.readFileSync(filePath, 'utf8');
                    
                    // 提取页面名字
                    const titleMatch = content.match(/<title>([^-]+) - /);
                    if (titleMatch) {
                        const pageName = titleMatch[1].trim();
                        pages.push({ filePath, pageName });
                    }
                }
            });
        }
    });
    
    return pages;
}

// 为页面生成更详细的描述
function generateDetailedDescription(pageName) {
    // 为不同类型的页面生成不同的描述
    const descriptions = {
        'Categories': 'Explore our extensive collection of free online shooter games at SkillWarz. Browse through various categories including First-Person Shooters, Battle Royale, Sniper Games, Multiplayer Shooters, and Action Shooters. Find your favorite games and start playing instantly without any downloads. With hundreds of games to choose from, there\'s something for every type of gamer at SkillWarz.',
        'Dessert DIY': 'Dessert DIY is a fun and creative game where players can create delicious desserts from scratch. Choose from a variety of ingredients, decorations, and tools to design your perfect dessert. Experiment with different recipes and techniques to create mouth-watering treats. With intuitive controls and colorful graphics, Dessert DIY offers a delightful gaming experience for players of all ages.',
        'Marshmallow Rush': 'Marshmallow Rush is an exciting arcade game where players guide marshmallows through a series of obstacles. Jump, slide, and dodge your way through challenging levels while collecting power-ups and bonuses. With its charming graphics and addictive gameplay, Marshmallow Rush provides hours of entertainment for players of all ages.',
        'Night Club Security': 'Night Club Security is a thrilling action game where players take on the role of a nightclub security guard. Monitor the club, identify troublemakers, and maintain order to ensure a safe and enjoyable environment for patrons. With its realistic graphics and challenging gameplay, Night Club Security offers an immersive gaming experience.',
        'Obby Football Soccer 3D': 'Obby Football Soccer 3D is a unique sports game that combines obstacle courses with soccer gameplay. Navigate through challenging obbys while controlling a soccer ball, avoiding obstacles and collecting power-ups. With its 3D graphics and intuitive controls, Obby Football Soccer 3D offers a fun and challenging gaming experience for sports fans.',
        'Revoxel 3D': 'Revoxel 3D is a voxel-based RPG shooter game set in a post-apocalyptic world. Explore vast environments, battle enemies, and complete quests to progress through the game. With its blocky graphics and immersive gameplay, Revoxel 3D offers a unique gaming experience for fans of RPGs and shooters.',
        'Sort Balls': 'Sort Balls is a challenging puzzle game where players must sort colored balls into their corresponding cones. Test your problem-solving skills and reflexes as you race against the clock to complete each level. With its simple yet addictive gameplay, Sort Balls offers hours of entertainment for puzzle game fans.',
        'Battle Royale Coloring Book': 'Battle Royale Coloring Book is a creative game where players can color various battle royale-themed images. Choose from a wide range of colors and tools to bring your favorite battle royale scenes to life. With its relaxing gameplay and extensive color palette, Battle Royale Coloring Book offers a fun and creative outlet for players of all ages.',
        'Battle Royale Jigsaw': 'Battle Royale Jigsaw is a challenging puzzle game featuring battle royale-themed images. Piece together jigsaw puzzles of various difficulty levels to reveal stunning battle royale scenes. With its intuitive controls and beautiful graphics, Battle Royale Jigsaw offers a fun and relaxing gaming experience for puzzle fans.',
        'Battle Royale Noob vs Pro': 'Battle Royale Noob vs Pro is an exciting battle royale game that pits new players against experienced pros. Test your skills and strategy as you fight to be the last one standing in intense multiplayer battles. With its fast-paced gameplay and competitive mechanics, Battle Royale Noob vs Pro offers an thrilling gaming experience for battle royale fans.',
        'Battle Royale Puzzles': 'Battle Royale Puzzles is a collection of challenging puzzles inspired by battle royale games. Solve a variety of puzzles including jigsaw, crossword, and sudoku with battle royale themes. With its diverse puzzle types and engaging gameplay, Battle Royale Puzzles offers hours of entertainment for puzzle game fans.',
        'Battle Royale Puzzle Challenge': 'Battle Royale Puzzle Challenge is a competitive puzzle game where players race to solve battle royale-themed puzzles. Compete against other players or challenge yourself with increasingly difficult puzzles. With its competitive gameplay and engaging puzzles, Battle Royale Puzzle Challenge offers a unique gaming experience.',
        'Cube Battle Royale': 'Cube Battle Royale is a blocky battle royale game set in a cube-shaped world. Collect resources, build structures, and fight against other players to be the last one standing. With its voxel graphics and fast-paced gameplay, Cube Battle Royale offers a unique twist on the battle royale genre.',
        'Doge\'s Battle Royale': 'Doge\'s Battle Royale is a fun and quirky battle royale game featuring the popular Doge meme character. Join Doge and his friends in intense multiplayer battles across colorful maps. With its lighthearted humor and engaging gameplay, Doge\'s Battle Royale offers a unique gaming experience.',
        'Pixel Battle Royale': 'Pixel Battle Royale is a retro-style battle royale game with pixel art graphics. Drop into a pixelated world, collect weapons and items, and fight to be the last one standing. With its nostalgic graphics and fast-paced gameplay, Pixel Battle Royale offers a unique gaming experience for fans of retro games and battle royale.',
        'Pixel Battle Royale Multiplayer': 'Pixel Battle Royale Multiplayer is an online multiplayer battle royale game with pixel art graphics. Team up with friends or compete against players from around the world in intense battles. With its multiplayer functionality and retro graphics, Pixel Battle Royale Multiplayer offers a fun and social gaming experience.',
        'Top Guns IO': 'Top Guns IO is an online multiplayer shooter game where players compete to be the top gun. Choose from a variety of weapons and battle against other players in fast-paced matches. With its competitive gameplay and intuitive controls, Top Guns IO offers an thrilling gaming experience for shooter fans.',
        '3D FPS Target Shooting': '3D FPS Target Shooting is a realistic first-person shooter game focused on target practice. Test your aim and precision with a variety of weapons and target scenarios. With its realistic graphics and immersive gameplay, 3D FPS Target Shooting is the perfect game for honing your shooting skills.',
        'Alien Infestation FPS': 'Alien Infestation FPS is a sci-fi first-person shooter game where players battle against an alien infestation. Explore futuristic environments, wield advanced weapons, and fight against hordes of alien enemies. With its immersive sci-fi setting and intense gameplay, Alien Infestation FPS offers a thrilling gaming experience.',
        'Army Fps Shooting': 'Army Fps Shooting is a military-themed first-person shooter game. Take on the role of a soldier and complete various combat missions in realistic military environments. With its authentic military experience and challenging gameplay, Army Fps Shooting is a must-play for fans of military shooters.',
        'Battle SWAT VS Mercenary': 'Battle SWAT VS Mercenary is a tactical first-person shooter game that pits SWAT teams against mercenaries. Choose your side and engage in intense tactical battles across various maps. With its strategic gameplay and team-based mechanics, Battle SWAT VS Mercenary offers a unique gaming experience.',
        'Command Strike FPS': 'Command Strike FPS is a tactical first-person shooter game where players take on the role of a commander. Lead your troops into battle, make strategic decisions, and complete challenging missions. With its tactical depth and immersive gameplay, Command Strike FPS offers a unique gaming experience for strategy fans.',
        'Crab Guards': 'Crab Guards is an action-packed first-person shooter game where players defend against waves of crab enemies. The game features various weapons, power-ups, and challenging levels. Players must use strategy and quick reflexes to survive the crab onslaught. With stunning graphics and immersive gameplay, Crab Guards offers hours of entertainment for shooter fans.',
        'CS War Gun King FPS': 'CS War Gun King FPS is a counter-strike inspired first-person shooter game. Engage in competitive combat with various weapons across classic maps. With its team-based gameplay and competitive mechanics, CS War Gun King FPS is perfect for fans of competitive shooters.',
        'Dragon Slayer FPS': 'Dragon Slayer FPS is a fantasy first-person shooter game where players take on the role of a dragon slayer. Battle against dragons and other mythical creatures in immersive fantasy environments. With its fantasy setting and epic battles, Dragon Slayer FPS offers a unique gaming experience.',
        'FPS Assault Shooter': 'FPS Assault Shooter is an action-packed first-person shooter game. Engage in intense assault missions against enemy forces across various environments. With its fast-paced action and challenging missions, FPS Assault Shooter is perfect for fans of action-packed shooters.',
        'FPS Clicker': 'FPS Clicker is a unique clicker game with first-person shooter elements. Click to shoot enemies, upgrade your weapons, and progress through increasingly challenging levels. With its incremental mechanics and shooter elements, FPS Clicker offers a unique gaming experience.',
        'FPS Shooter 3D City Wars': 'FPS Shooter 3D City Wars is a first-person shooter game set in urban environments. Engage in intense urban combat scenarios with various weapons. With its realistic city environments and tactical gameplay, FPS Shooter 3D City Wars provides an immersive gaming experience.',
        'FPS Shooting Strike: Modern Combat War 2k20': 'FPS Shooting Strike: Modern Combat War 2k20 is a modern warfare first-person shooter game. Engage in modern combat scenarios with advanced weapons and equipment. With its modern warfare setting and intense gameplay, FPS Shooting Strike: Modern Combat War 2k20 is a must-play for fans of modern shooters.',
        'FPS Simulator': 'FPS Simulator is a first-person shooter training simulator. Practice your shooting skills in various training scenarios with realistic weapon mechanics. With its training focus and realistic mechanics, FPS Simulator is perfect for honing your shooting skills.',
        'FPS Sniper Shooter: Battle Survival': 'FPS Sniper Shooter: Battle Survival is a sniper game with battle royale elements. Take on the role of a sniper and compete against other players to be the last one standing. With its realistic sniper mechanics and battle royale elements, FPS Sniper Shooter: Battle Survival offers a unique gaming experience.',
        'FPS Toy Realism': 'FPS Toy Realism is a unique first-person shooter game with toy-themed graphics. Engage in battles using toy weapons in detailed toy environments. With its realistic sound effects and physics, FPS Toy Realism creates an immersive toy battlefield experience.',
        'Hazmob FPS': 'Hazmob FPS is a fast-paced online multiplayer first-person shooter game. It features various game modes including Free for All, Team Death Match, Domination, Capture the Flag, Gun Race, Elimination, and Search and Destroy. With its responsive controls and competitive gameplay, Hazmob FPS offers an thrilling gaming experience.',
        'Infantry Attack Battle 3D FPS': 'Infantry Attack Battle 3D FPS is a military-themed first-person shooter game. Take on the role of an infantry soldier and complete various combat missions in realistic 3D environments. With its authentic military experience and challenging missions, Infantry Attack Battle 3D FPS is perfect for fans of military shooters.',
        'Lizard Lady vs Herself': 'Lizard Lady vs Herself is a quirky action game featuring the Lizard Lady character. Control Lizard Lady as she battles against her own clones in colorful environments. With its unique gameplay mechanics and humorous elements, Lizard Lady vs Herself offers a unique gaming experience.',
        'Lizard Lady vs The Cats': 'Lizard Lady vs The Cats is a quirky action game where Lizard Lady battles against cat enemies. Navigate through various levels, defeat cat enemies, and collect power-ups. With its quirky concept and fun gameplay, Lizard Lady vs The Cats offers a unique gaming experience.',
        'Merge Gun Fps Shooting Zombie': 'Merge Gun Fps Shooting Zombie combines merge mechanics with zombie shooting action. Merge weapons to create more powerful ones and fight off waves of zombies. With its addictive merge gameplay and intense zombie shooting action, Merge Gun Fps Shooting Zombie offers a unique gaming experience.',
        'Mine FPS shooter: Noob Arena': 'Mine FPS shooter: Noob Arena is a Minecraft-style first-person shooter game set in blocky environments. Battle against other players or AI enemies in arena-style combat. With its unique blocky graphics and fast-paced gameplay, Mine FPS shooter: Noob Arena offers a fresh take on the FPS genre.',
        'Offline FPS Royale': 'Offline FPS Royale is a battle royale game that can be played without an internet connection. Drop onto an island, collect weapons and items, and fight to be the last survivor against AI opponents. With its offline gameplay and intense battle royale action, Offline FPS Royale is perfect for gaming on the go.',
        'Real Shooting Fps Strike': 'Real Shooting Fps Strike is a realistic first-person shooter game. Engage in realistic combat scenarios with authentic weapons and physics. With its attention to detail and immersive gameplay, Real Shooting Fps Strike provides a realistic shooting experience.',
        'Shoot Your Nightmare Double Trouble': 'Shoot Your Nightmare Double Trouble is a horror-themed first-person shooter game. Navigate through nightmare scenarios and battle against horror creatures. With its immersive horror environments and intense combat, Shoot Your Nightmare Double Trouble provides a thrilling gaming experience.',
        'Society FPS': 'Society FPS is a social-themed first-person shooter game. Engage in battles in various social environments with team-based gameplay. With its unique social setting and competitive gameplay, Society FPS offers a fresh take on the FPS genre.',
        'Subway FPS': 'Subway FPS is a first-person shooter game set in subway environments. Take on the role of a subway security guard and defend against threats. With its unique setting and intense gameplay, Subway FPS provides an immersive gaming experience.',
        'Thief Fps Fire Marshal': 'Thief Fps Fire Marshal is an action game where players take on the role of a fire marshal fighting crime. Combine firefighting elements with crime prevention in various missions. With its unique concept and engaging gameplay, Thief Fps Fire Marshal offers a unique gaming experience.',
        'Animal Racing Idle Park': 'Animal Racing Idle Park is an idle game where players manage a racing park with animal racers. Upgrade your park, unlock new animals, and watch them race to earn rewards. With its idle mechanics and charming graphics, Animal Racing Idle Park offers a relaxing gaming experience.',
        'Brainrots Lava Survive Online': 'Brainrots Lava Survive Online is an online multiplayer game where players must survive on platforms above lava. Jump between platforms, avoid obstacles, and be the last one standing. With its competitive gameplay and social elements, Brainrots Lava Survive Online offers a fun and challenging gaming experience.',
        'Gang War': 'Gang War is an action-packed shooter game where players take on the role of a gang member. Engage in turf wars, complete missions, and build your gang\'s reputation. With its intense gameplay and criminal underworld setting, Gang War offers a thrilling gaming experience.',
        'Push.io': 'Push.io is an online multiplayer game where players push each other off platforms. Use strategy and timing to push your opponents off while staying on yourself. With its simple yet addictive gameplay, Push.io offers a fun and competitive gaming experience.',
        'Tic Tac Toe Merge': 'Tic Tac Toe Merge is a unique twist on the classic tic tac toe game. Merge tiles to create stronger symbols and get three in a row to win. With its strategic gameplay and unique mechanics, Tic Tac Toe Merge offers a fresh take on the classic game.',
        'Tsunami Brainrots Online': 'Tsunami Brainrots Online is an online multiplayer game where players must survive a tsunami. Run, jump, and climb to stay above the rising water. With its intense gameplay and social elements, Tsunami Brainrots Online offers a thrilling gaming experience.',
        'Aliens Hunter': 'Aliens Hunter is a sniper game where players hunt down alien invaders. Use your sniper rifle to eliminate aliens from a distance. With its precision gameplay and sci-fi setting, Aliens Hunter offers a unique gaming experience.',
        'Block Sniper': 'Block Sniper is a voxel-based sniper game set in blocky environments. Take on the role of a sniper and complete various missions. With its blocky graphics and precision gameplay, Block Sniper offers a unique gaming experience.',
        'Counter Craft Sniper': 'Counter Craft Sniper is a Minecraft-style sniper game. Take on the role of a sniper in blocky environments and complete various missions. With its unique blocky graphics and precision gameplay, Counter Craft Sniper offers a fresh take on the sniper genre.',
        'Gun Shooting Games Sniper 3D': 'Gun Shooting Games Sniper 3D is a realistic 3D sniper game. Take on the role of a sniper and complete various missions in realistic environments. With its stunning 3D graphics and precision gameplay, Gun Shooting Games Sniper 3D offers an immersive gaming experience.',
        'Mafia Sniper Crime Shooting': 'Mafia Sniper Crime Shooting is a mafia-themed sniper game. Take on the role of a mafia sniper and eliminate targets. With its criminal underworld setting and precision gameplay, Mafia Sniper Crime Shooting offers a thrilling gaming experience.'
    };
    
    return descriptions[pageName] || `${pageName} is an exciting online game that offers engaging gameplay and immersive experiences. Players can enjoy hours of entertainment with this action-packed game. With its stunning graphics, intuitive controls, and challenging gameplay, ${pageName} is sure to provide hours of fun for players of all ages.`;
}

// 更新页面描述
function updatePageDescriptions() {
    const pages = getNonIndexPages();
    
    pages.forEach(({ filePath, pageName }) => {
        console.log(`Updating description for ${pageName}...`);
        
        let content = fs.readFileSync(filePath, 'utf8');
        const detailedDescription = generateDetailedDescription(pageName);
        
        // 更新元数据描述
        content = content.replace(/<meta name="description" content="[^"]*">/g, (match) => {
            return `<meta name="description" content="${detailedDescription}">`;
        });
        
        // 更新og:description
        content = content.replace(/<meta property="og:description" content="[^"]*">/g, (match) => {
            return `<meta property="og:description" content="${detailedDescription}">`;
        });
        
        // 更新twitter:description
        content = content.replace(/<meta name="twitter:description" content="[^"]*">/g, (match) => {
            return `<meta name="twitter:description" content="${detailedDescription}">`;
        });
        
        // 写入更新后的内容
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated description for ${pageName}`);
    });
    
    console.log('All page descriptions updated successfully!');
}

// 运行更新
updatePageDescriptions();
