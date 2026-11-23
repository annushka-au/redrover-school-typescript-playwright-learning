/**
 * Same scenarios as tests/myTests.spec.ts, via Page Object Model (pages/),
 * fixtures (fixtures/pages.ts), and explicit parallel execution.
 */

import { test, expect } from "../fixtures/pages";

test.describe.configure({ mode: "parallel" });

test.describe("homepage and product details (POM)", () => {

    test("verify page title", async ({ homePage }) => {
        await homePage.goto();

        expect(await homePage.getTitle()).toEqual("Automation Exercise");
    });

    test("verify homepage nav highlight", async ({ homePage }) => {
        await homePage.goto();

        await expect(homePage.homeLink).toHaveCSS("color", "rgb(255, 165, 0)");
    });

    test("verify logo src", async ({ homePage }) => {
        await homePage.goto();

        expect(await homePage.getLogoSrc()).toBe("/static/images/home/logo.png");
    });

    test("verify product overlay", async ({ homePage }) => {
        await homePage.goto();
        await homePage.hoverFirstProduct();

        await expect(homePage.productOverlay).toHaveCSS("background-color", "rgb(254, 152, 15)");
    });

    test("verify correct category", async ({ homePage, productDetailsPage }) => {
        await homePage.goto();
        await homePage.openProductDetails(1);

        await expect(productDetailsPage.category).toHaveText("Category: Women > Tops");
    });

    test("verify logo consistent across pages", async ({ homePage, productDetailsPage }) => {
        await homePage.goto();
        const homeLogoSrc = await homePage.getLogoSrc();

        await homePage.openProductDetails(1);

        await expect(productDetailsPage.logo).toHaveAttribute("src", homeLogoSrc!);
    });

});
