const axios = require('axios');
const puppeteer = require('puppeteer');

async function fetchData(url) {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error(`Error fetching data: ${error}`);
        return null;
    }
}

async function scrapeDynamicContent(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });
    const content = await page.content();
    await browser.close();
    return content;
}

async function main() {
    const url = 'https://nip.kdca.go.kr/irhp/mngm/goMedicalCenterList.do';

    const staticContent = await fetchData(url);
    console.log(staticContent);

    const dynamicContent = await scrapeDynamicContent(url);
    console.log(dynamicContent);
}

main();
