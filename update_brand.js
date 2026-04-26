const fs = require('fs');
const path = require('path');

// 品牌词替换映射
const brandReplacements = {
    'Veck.io': 'skillwarz',
    'VECK IO': 'SKILLWARZ',
    'veck io': 'skillwarz',
    'veck.io': 'skillwarz',
    'https://veck.io/': 'https://skillwarz.io/'
};

// 新的favicon
const newFavicon = `<link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 50 50'><defs><linearGradient id='g' x1='0%25' y1='0%25' x2='100%25' y2='100%25'><stop offset='0%25' stop-color='%23ff4500'/><stop offset='100%25' stop-color='%23ff8c00'/></linearGradient></defs><rect x='10' y='15' width='30' height='20' rx='2' fill='none' stroke='url(%23g)' stroke-width='3'/><path d='M15 20 L35 20 M15 25 L35 25 M15 30 L35 30' stroke='url(%23g)' stroke-width='2'/><polygon points='25 10 30 15 20 15' fill='url(%23g)'/></svg>">`;

// 新的logo SVG
const newLogoSvg = `<svg class="logo-icon" viewBox="0 0 50 50" width="45" height="45">
                <defs>
                    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#ff4500;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#ff8c00;stop-opacity:1" />
                    </linearGradient>
                </defs>
                <rect x="10" y="15" width="30" height="20" rx="2" fill="none" stroke="url(#grad1)" stroke-width="3"/>
                <path d="M15 20 L35 20 M15 25 L35 25 M15 30 L35 30" stroke="url(#grad1)" stroke-width="2"/>
                <polygon points="25 10 30 15 20 15" fill="url(#grad1)"/>
            </svg>`;

// 新的logo文本
const newLogoText = `<span class="logo-text">skillwarz</span>`;

// 遍历目录中的所有HTML文件
function processDirectory(dir) {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
            // 递归处理子目录
            processDirectory(filePath);
        } else if (file.endsWith('.html')) {
            // 处理HTML文件
            processHtmlFile(filePath);
        }
    }
}

// 处理单个HTML文件
function processHtmlFile(filePath) {
    console.log(`Processing ${filePath}...`);
    
    let content = fs.readFileSync(filePath, 'utf8');
    
    // 替换品牌词
    for (const [oldBrand, newBrand] of Object.entries(brandReplacements)) {
        content = content.replace(new RegExp(oldBrand, 'g'), newBrand);
    }
    
    // 替换favicon
    const faviconRegex = /<link rel="icon" type="image\/svg\+xml" href=".*?">/;
    content = content.replace(faviconRegex, newFavicon);
    
    // 替换logo SVG
    const logoSvgRegex = /<svg class="logo-icon" viewBox="0 0 50 50" width="45" height="45">[\s\S]*?<\/svg>/;
    content = content.replace(logoSvgRegex, newLogoSvg);
    
    // 替换logo文本
    const logoTextRegex = /<span class="logo-text">.*?<\/span>/;
    content = content.replace(logoTextRegex, newLogoText);
    
    // 修复多余的结束标签
    content = content.replace(/<\/span><\/span>/g, '</span>');
    
    // 写回文件
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
}

// 开始处理
const rootDir = path.join(__dirname, '.');
processDirectory(rootDir);

console.log('All files updated successfully!');