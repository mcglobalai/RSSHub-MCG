const cheerio = require('cheerio');
const puppeteer = require('puppeteer');

module.exports = async (ctx) => {
    const tag = ctx.params.tag ?? '"Froth%20on%20the%20Daydream"';

    const baseUrl = 'https://www.turingpost.com';
    const currentUrl = `${baseUrl}/t/${tag}`;

    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.goto(currentUrl);
    const response = await page.content();
    await browser.close();
    // console.log(content);

    const items = [];
    const $ = cheerio.load(response);
    $('body main div.mx-auto div.mx-auto div.space-y-8 div.flex.flex-col div.grid a').each(function () {
        const item_path = $(this).attr('href');
        const item_title = $(this).find('div.z-10.col-span-1 h2').text();
        const item_content = $(this).find('a div.z-10.col-span-1 p.mb-2').text();
        const item_author = $(this).find('a div.z-10.col-span-1 p.mb-4 span:nth-child(1)').text();
        const item_date = $(this).find('a div.z-10.col-span-1 p.mb-4 time').attr('datetime');
        const item = {
            title: item_title,
            link: baseUrl + item_path,
            pubDate: item_date,
            category: tag,
            description: item_content,
            author: item_author,
        };
        items.push(item);
    });
    // console.log(items);

    ctx.state.data = {
        title: tag,
        link: currentUrl,
        item: items,
    };
};
