import { test as base, Page } from "@playwright/test";
import { HomePage } from "../pages/HomePage";
import { ProductDetailsPage } from "../pages/ProductDetailsPage";

type PageFixtures = {
    homePage: HomePage;
    productDetailsPage: ProductDetailsPage;
};

// Ad overlays can block clicks/hovers and make tests flaky; abort them here
// once instead of repeating page.route() in every test.
async function blockAds(page: Page): Promise<void> {
    await page.route(
        /(googleleads|doubleclick|googlesyndication|google-analytics|adservice|amazon-adsystem|adnxs|pagead2)/,
        (route) => route.abort()
    );
}

export const test = base.extend<PageFixtures>({
    homePage: async ({ page }, use) => {
        await blockAds(page);
        await use(new HomePage(page));
    },

    productDetailsPage: async ({ page }, use) => {
        await use(new ProductDetailsPage(page));
    },
});

export { expect } from "@playwright/test";
