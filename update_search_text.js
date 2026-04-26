const fs = require('fs');
const path = require('path');

// 获取所有HTML文件
function getAllHtmlFiles(dir, files = []) {
    const items = fs.readdirSync(dir);

    items.forEach(item => {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            if (item !== 'node_modules' && item !== '.git') {
                getAllHtmlFiles(fullPath, files);
            }
        } else if (path.extname(item) === '.html') {
            files.push(fullPath);
        }
    });

    return files;
}

// 更新搜索文本
function updateSearchText(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    const relativePath = path.relative(__dirname, filePath);

    // 替换中文搜索文本为英文
    if (content.includes('搜索游戏')) {
        content = content.replace(/搜索游戏\.\.\./g, 'Search games...');
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated search text in: ${relativePath}`);
        return true;
    }
    return false;
}

// 主函数
function main() {
    console.log('开始更新所有页面的搜索文本...\n');

    const htmlFiles = getAllHtmlFiles(__dirname);

    console.log(`找到 ${htmlFiles.length} 个HTML文件\n`);

    let updatedCount = 0;
    htmlFiles.forEach(file => {
        try {
            if (updateSearchText(file)) {
                updatedCount++;
            }
        } catch (error) {
            console.error(`Error updating ${file}:`, error.message);
        }
    });

    console.log(`\n已更新 ${updatedCount} 个页面的搜索文本！`);
}

main();
