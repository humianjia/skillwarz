const fs = require('fs');
const path = require('path');

// 需要检查的文件扩展名
const htmlExtensions = ['.html'];

// 遍历目录获取所有HTML文件
function getAllHtmlFiles(dir, files = []) {
    const items = fs.readdirSync(dir);

    items.forEach(item => {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            // 跳过node_modules和其他不需要的目录
            if (item !== 'node_modules' && item !== '.git') {
                getAllHtmlFiles(fullPath, files);
            }
        } else if (htmlExtensions.includes(path.extname(item))) {
            files.push(fullPath);
        }
    });

    return files;
}

// 修复canonical标签
function fixCanonical(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    const relativePath = path.relative(__dirname, filePath);

    // 根据文件路径生成正确的canonical URL
    let canonicalUrl;

    if (filePath === path.join(__dirname, 'index.html')) {
        // 首页
        canonicalUrl = 'https://www.skillwarz.online/';
    } else if (filePath === path.join(__dirname, 'categories.html')) {
        // 分类页
        canonicalUrl = 'https://www.skillwarz.online/categories.html';
    } else {
        // 二级页面 - 需要计算相对路径
        const dir = path.dirname(relativePath);
        const basename = path.basename(filePath);
        const fullPath = dir === '.' ? basename : `${dir}/${basename}`;
        canonicalUrl = `https://www.skillwarz.online/${fullPath.replace(/\\/g, '/')}`;
    }

    // 修复或添加canonical标签
    if (content.includes('rel="canonical"')) {
        content = content.replace(
            /<link[^>]*rel="canonical"[^>]*href="[^"]*"[^>]*>/g,
            `<link rel="canonical" href="${canonicalUrl}">`
        );
    } else if (content.includes('</head>')) {
        content = content.replace(
            '</head>',
            `    <link rel="canonical" href="${canonicalUrl}">\n</head>`
        );
    }

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed canonical in: ${relativePath}`);
    console.log(`  -> ${canonicalUrl}`);
}

// 主函数
function main() {
    console.log('开始修复所有页面的canonical标签...\n');

    const htmlFiles = getAllHtmlFiles(__dirname);

    console.log(`找到 ${htmlFiles.length} 个HTML文件\n`);

    htmlFiles.forEach(file => {
        try {
            fixCanonical(file);
        } catch (error) {
            console.error(`Error fixing ${file}:`, error.message);
        }
    });

    console.log('\n所有页面的canonical标签已修复完成！');
}

main();
