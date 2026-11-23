
/**
 * eSchool training exercises — CSS locators, navigation, hover interaction,
 * and assertions against automationexercise.com. Written manually for practice.
 */

import { test, expect, Page, Locator } from "@playwright/test";

test.describe("first test suite", () => {

    // Loads the homepage, checks the document title.
    test("verify page title", async ( {page}: { page: Page} ) => {
        await page.goto("/");

        const title = await page.title();
        console.log(title);

        expect(title).toEqual("Automation Exercise");
    });

    // Checks the Home nav link's highlighted color.
    test("verify homepage", async ( {page}: { page: Page} ) => {
        await page.goto("/");

        const homepageLink = page.locator(".navbar-nav li a[href='/']");

        await expect(homepageLink).toHaveCSS("color", "rgb(255, 165, 0)");
    });

    // Checks the homepage logo's src attribute.
    test("verify logo", async ( {page}: { page: Page} ) => {
        await page.goto("/");

        const imageUrl = await page.locator(".logo img").getAttribute("src");

        expect(imageUrl).toBe("/static/images/home/logo.png");
    });

    // Hovers the first product card, checks the overlay's background color.
    test("verify product overlay", async({page}: { page: Page}) => {

        await page.goto("/");

        const productCard = page.locator('.features_items .col-sm-4').first().locator('.single-products');

        await productCard.hover();

        const overlayLink: Locator = page.locator('div.product-overlay').first();

        await expect(overlayLink).toHaveCSS("background-color","rgb(254, 152, 15)");

    });


    // Blocks ad requests/styles so they can't intercept the click, then
    // opens a product page and checks its category text.
    test("verify correct category", async({page}: { page: Page}) => {
        await page.route(
            /(googleleads|doubleclick|googlesyndication|google-analytics|adservice|amazon-adsystem|adnxs|pagead2)/,
            (route) => route.abort()
        );
        await page.addStyleTag({
            content: `
                .adsbygoogle,
                ins.adsbygoogle,
                .ad-container,
                [id^="google_ads"],
                [id^="aswift"],
                [class^="aswift"],
                [class^="ad-"],
                #dismiss-button,
                .close-button,
                div[style*="z-index: 2147483647"] {
                    display: none !important;
                    visibility: hidden !important;
                    opacity: 0 !important;
                    pointer-events: none !important;
                }
            `
        });

        await page.goto("/");

        await page.locator("a[href='/product_details/1']").click();

        const category: Locator  = page.locator(".product-information h2 + p");

        await expect(category).toHaveText("Category: Women > Tops");

    });

    // Compares the logo src on the homepage vs. the product details page.
    test("verify logo at the second page", async ( {page}: { page: Page} ) => {
        await page.goto("/");

        const homePageImageUrl:string | null  = await page.locator(".logo img").getAttribute("src");

        await page.locator("a[href='/product_details/1']").click();

        const productPageImageUrl = page.locator(".logo img");

        await expect(productPageImageUrl).toHaveAttribute("src", homePageImageUrl!);
    });

});
