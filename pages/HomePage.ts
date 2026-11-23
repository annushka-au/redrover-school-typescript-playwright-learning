import { Page, Locator } from "@playwright/test";

// Page Object for the homepage: locators + actions used by the tests.
export class HomePage {
    readonly page: Page;
    readonly homeLink: Locator;
    readonly logo: Locator;
    readonly firstProductCard: Locator;
    readonly productOverlay: Locator;

    constructor(page: Page) {
        this.page = page;
        this.homeLink = page.locator(".navbar-nav li a[href='/']");
        this.logo = page.locator(".logo img");
        this.firstProductCard = page.locator(".features_items .col-sm-4").first().locator(".single-products");
        this.productOverlay = page.locator("div.product-overlay").first();
    }

    async goto(): Promise<void> {
        await this.page.goto("/");
    }

    async getTitle(): Promise<string> {
        return this.page.title();
    }

    async getLogoSrc(): Promise<string | null> {
        return this.logo.getAttribute("src");
    }

    async hoverFirstProduct(): Promise<void> {
        await this.firstProductCard.hover();
    }

    async openProductDetails(productId: number): Promise<void> {
        await this.page.locator(`a[href='/product_details/${productId}']`).click();
    }
}
