const puppeteer = require('puppeteer');

async function scrapeDynamicContent(url) {
    const browser = await puppeteer.launch({
        headless: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36');

    await page.goto(url, { waitUntil: 'networkidle2' });

    await page.waitForSelector('#sidoCd');
    await page.select('#sidoCd', '11');
    await page.waitForTimeout(1000); 

    await page.evaluate(() => sggList());

    await page.waitForSelector('#sggCd');
    await page.select('#sggCd', '성동구');
    await page.waitForTimeout(1000);

    await page.waitForSelector('input.sch-btn');
    await page.click('input.sch-btn');

    await page.waitForSelector('table.table05', { timeout: 60000 });

    const results = await page.evaluate(() => {
        const rows = Array.from(document.querySelectorAll('table.table05 tbody tr'));
        return rows.map(row => {
            const columns = row.querySelectorAll('td');
            return {
                병의원명: columns[0].innerText.trim(),
                전화번호: columns[1].innerText.trim(),
                주소: columns[2].innerText.trim()
            };
        });
    });

    await browser.close();
    return results;
}

async function main() {
    const url = 'https://nip.kdca.go.kr/irhp/mngm/goMedicalCenterList.do';
    const dynamicContent = await scrapeDynamicContent(url);
    console.log(dynamicContent);
}

main();
