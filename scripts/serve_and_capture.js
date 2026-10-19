const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

const PORT = 3456;
const PUBLIC_DIR = path.resolve(__dirname, '../target/classes/public');

function startServer() {
    return new Promise((resolve) => {
        const mimeTypes = {
            '.html': 'text/html; charset=utf-8',
            '.js': 'application/javascript; charset=utf-8',
            '.css': 'text/css; charset=utf-8',
            '.json': 'application/json; charset=utf-8',
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.gif': 'image/gif',
            '.svg': 'image/svg+xml',
            '.ico': 'image/x-icon',
        };

        const server = http.createServer((req, res) => {
            const url = new URL(req.url, `http://localhost:${PORT}`);
            let pathname = decodeURIComponent(url.pathname);

            // Proxy API or SVG/preview requests to official hits.sh
            if (pathname.startsWith('/api/') || pathname.endsWith('.svg') || pathname.endsWith('.preview')) {
                const proxyReq = https.request(
                    `https://hits.sh${url.pathname}${url.search}`,
                    {
                        method: req.method,
                        headers: {
                            ...req.headers,
                            host: 'hits.sh'
                        }
                    },
                    (proxyRes) => {
                        res.writeHead(proxyRes.statusCode, proxyRes.headers);
                        proxyRes.pipe(res);
                    }
                );
                proxyReq.on('error', (err) => {
                    console.error('Proxy error:', err);
                    res.writeHead(502);
                    res.end('Bad Gateway');
                });
                req.pipe(proxyReq);
                return;
            }

            // Static files
            let filePath = path.join(PUBLIC_DIR, pathname);
            if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
                const ext = path.extname(filePath).toLowerCase();
                res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
                fs.createReadStream(filePath).pipe(res);
                return;
            }

            // SPA Fallback to index.html
            const indexPath = path.join(PUBLIC_DIR, 'index.html');
            if (fs.existsSync(indexPath)) {
                res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                fs.createReadStream(indexPath).pipe(res);
            } else {
                res.writeHead(404);
                res.end('Not Found');
            }
        });

        server.listen(PORT, () => {
            console.log(`Server listening on http://localhost:${PORT}`);
            resolve(server);
        });
    });
}

async function runVerification() {
    const server = await startServer();

    const browser = await puppeteer.launch({
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    const outDir = path.resolve(__dirname, '../screenshots');
    if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir, { recursive: true });
    }

    const testUrl = `http://localhost:${PORT}/github.com/OrdoAbChao7/`;

    const viewports = [
        { name: 'desktop-1440', width: 1440, height: 900 },
        { name: 'tablet-768', width: 768, height: 1024 },
        { name: 'mobile-375', width: 375, height: 812 },
    ];

    for (const vp of viewports) {
        await page.setViewport({ width: vp.width, height: vp.height });

        // 1. Force dark mode in localStorage and load
        await page.evaluateOnNewDocument(() => {
            localStorage.setItem('hits_theme', 'dark');
        });
        await page.goto(testUrl, { waitUntil: 'domcontentloaded', timeout: 15000 });
        await new Promise(r => setTimeout(r, 2000));
        // Verify class 'dark' is present
        await page.evaluate(() => {
            document.documentElement.classList.add('dark');
        });
        const darkPath = path.join(outDir, `redesign-${vp.name}-dark.png`);
        await page.screenshot({ path: darkPath, fullPage: true });
        console.log(`Captured ${darkPath}`);

        // 2. Switch to light mode
        await page.evaluate(() => {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('hits_theme', 'light');
        });
        // Click theme toggle to trigger React state update if available
        const themeButton = await page.$('button[title*="mode"]');
        if (themeButton) {
            await themeButton.click();
            await new Promise(r => setTimeout(r, 500));
        }
        await page.evaluate(() => {
            document.documentElement.classList.remove('dark');
        });
        const lightPath = path.join(outDir, `redesign-${vp.name}-light.png`);
        await page.screenshot({ path: lightPath, fullPage: true });
        console.log(`Captured ${lightPath}`);
    }

    // Capture an empty/new urn state in dark mode
    await page.setViewport({ width: 1440, height: 900 });
    await page.evaluateOnNewDocument(() => {
        localStorage.setItem('hits_theme', 'dark');
    });
    await page.goto(`http://localhost:${PORT}/new-empty-repo.com/zero/`, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await new Promise(r => setTimeout(r, 2000));
    const emptyPath = path.join(outDir, `redesign-empty-state.png`);
    await page.screenshot({ path: emptyPath, fullPage: true });
    console.log(`Captured ${emptyPath}`);

    await browser.close();
    server.close();
    console.log('Verification completed successfully!');
}

runVerification().catch(err => {
    console.error('Error during verification:', err);
    process.exit(1);
});
