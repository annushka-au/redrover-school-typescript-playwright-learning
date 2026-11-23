import { Page, Locator } from "@playwright/test";

// Page Object for /product_details/{id}.
export class ProductDetailsPage {
    readonly page: Page;
    readonly category: Locator;
    readonly logo: Locator;

    constructor(page: Page) {
        this.page = page;
        this.category = page.locator(".product-information h2 + p");
        this.logo = page.locator(".logo img");
    }
}
