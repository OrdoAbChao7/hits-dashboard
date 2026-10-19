const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

async function capture() {
    const browser = await puppeteer.launch({
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    const targetUrl = 'https://hits.sh/github.com/OrdoAbChao7/';
    
    const outDir = path.resolve(__dirname, '../screenshots');
    if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir, { recursive: true });
    }

    const viewports = [
        { name: 'original-desktop-1440', width: 1440, height: 900 },
        { name: 'original-tablet-768', width: 768, height: 1024 },
        { name: 'original-mobile-375', width: 375, height: 812 },
    ];

    for (const vp of viewports) {
        await page.setViewport({ width: vp.width, height: vp.height });
        await page.goto(targetUrl, { waitUntil: 'networkidle0', timeout: 30000 });
        await new Promise(r => setTimeout(r, 1000));
        const filePath = path.join(outDir, `${vp.name}.png`);
        await page.screenshot({ path: filePath, fullPage: true });
        console.log(`Saved ${filePath}`);
    }

    await browser.close();
}

capture().catch(err => {
    console.error(err);
    process.exit(1);
});
