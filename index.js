// const puppeteer = require('puppeteer');
const UserAgents = require('user-agents');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

class Scraper {
    constructor() {
        this.pages = {};
    }

    async lauchBrowser(headlessConfig) {
        this.browser = await puppeteer.launch(headlessConfig);
    }

    async closeBrowser() {
        await this.browser.close();
    }

    async newPage(options) {
        // const pageId = options.pageId;
        this.page = await this.browser.newPage();

        if (options.enableJavaScript) {
            await this.page.setJavaScriptEnabled(true);
        }

        if (options.randomAgent) {
            const agent = new UserAgents();
            console.log(`${agent}`);
            await this.page.setUserAgent(`${agent}`);
        }

        // await page.setViewport({
        //     width: 1920 + Math.floor(Math.random() * 100),
        //     height: 3000 + Math.floor(Math.random() * 100),
        //     deviceScaleFactor: 1,
        //     hasTouch: false,
        //     isLandscape: false,
        //     isMobile: false,
        // });

        // await page.setDefaultNavigationTimeout(0);

        await this.page.goto(options.sourceURL, { waitUntil: 'networkidle2' });
        await this.page.evaluate(() => true);
        this.pageContent = await this.page.content();
    }

    async closePage() {
        this.page.close();
    }
}

(async function () {
    const scraper = new Scraper();
    await scraper.lauchBrowser({ /* headless: false, */ ignoreHTTPSErrors: true });

    const source = 'https://www.immobilienscout24.de/Suche/de/bayern/muenchen/wohnung-kaufen?rented=false&numberofrooms=2.0-&price=-700000.0&enteredFrom=result_list';
    // const source = 'https://www.immobilienscout24.de/Suche/de/bayern/muenchen/wohnung-kaufen?rented=false&numberofrooms=2.0-&price=-700000.0&pagenumber=2';
    await scraper.newPage({ enableJavaScript: true, randomAgent: true, sourceURL: source, pageId: 1 });
    console.log(scraper.pageContent);

    await scraper.closeBrowser();
})();