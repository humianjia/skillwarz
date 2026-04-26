const fs = require('fs');
const path = require('path');

// Google标签代码
const googleTag = `<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-DNT670B4R3"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-DNT670B4R3');
</script>`;

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

// 更新页面的Google标签
function updateGoogleTag(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    const relativePath = path.relative(__dirname, filePath);

    // 检查是否已有Google标签
    if (content.includes('googletagmanager.com/gtag') || content.includes('gtag(')) {
        // 移除旧的Google标签
        content = content.replace(/<!-- Google tag[\s\S]*?<\/script>/g, '');
        content = content.replace(/<script[\s\S]*?googletagmanager[\s\S]*?<\/script>/g, '');
        content = content.replace(/<script[\s\S]*?gtag\([\s\S]*?<\/script>/g, '');
        content = content.replace(/window\.dataLayer[\s\S]*?<\/script>/g, '');
        content = content.replace(/<script>\s*window\.dataLayer[\s\S]*?<\/script>/g, '');
    }

    // 在</head>标签前插入新的Google标签
    if (content.includes('</head>')) {
        content = content.replace('</head>', googleTag + '\n</head>');
    }

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated Google tag in: ${relativePath}`);
}

// 主函数
function main() {
    console.log('开始更新所有页面的Google标签...\n');

    const htmlFiles = getAllHtmlFiles(__dirname);

    console.log(`找到 ${htmlFiles.length} 个HTML文件\n`);

    let updatedCount = 0;
    htmlFiles.forEach(file => {
        try {
            updateGoogleTag(file);
            updatedCount++;
        } catch (error) {
            console.error(`Error updating ${file}:`, error.message);
        }
    });

    console.log(`\n已更新 ${updatedCount} 个页面的Google标签！`);
}

main();
