
/**
 * eSchool Training Exercises — Playwright and TypeScript
 *
 * These automated tests were written manually as part of eSchool training.
 *
 * The purpose is to practise identifying web elements using CSS locators,
 * interacting with elements, navigating between pages, and verifying
 * application behaviour using Playwright assertions.
 *
 * Topics covered:
 * - CSS class, attribute, and descendant selectors
 * - Locating elements and selecting the first match
 * - Page navigation and title verification
 * - Checking CSS properties and HTML attributes
 * - Mouse hover interactions
 * - Verifying text content
 * - Handling advertisements that interfere with test execution
 * - Comparing elements across different pages
 */

import { test, expect, Page } from "@playwright/test";

test.describe("first test suite", () => {

    /**
     * Test 1: Verify the page title.
     *
     * page.goto("/") navigates to the application's base URL.
     * page.title() retrieves the HTML document title.
     * toEqual() compares the actual title with the expected value.
     */
    test("verify page title", async ( {page}: { page: Page} ) => {
        await page.goto("/");

        const title = await page.title();
        console.log(title);

        expect(title).toEqual("Automation Exercise");
    });

    /**
     * Test 2: Verify the homepage navigation link.
     *
     * CSS locator: .navbar-nav li a[href='/']
     *
     * .navbar-nav   - selects an element with this CSS class
     * li            - selects a list item inside the navigation
     * a[href='/']   - selects a link whose href attribute equals "/"
     *
     * toHaveCSS() checks the computed CSS property.
     * Here, the orange colour indicates the selected Home menu item.
     */
    test("verify homepage", async ( {page}: { page: Page} ) => {
        await page.goto("/");

        const homepageLink = page.locator(".navbar-nav li a[href='/']");

        await expect(homepageLink).toHaveCSS("color", "rgb(255, 165, 0)");
    });

    /**
     * Test 3: Verify the logo image source.
     *
     * CSS locator: .logo img
     *
     * .logo  - selects an element with class "logo"
     * img    - selects an image inside that element
     *
     * getAttribute("src") retrieves the image's source attribute.
     * toBe() checks that the returned string matches the expected path.
     *
     * Note: This verifies the src value, not whether the image loaded.
     */
    test("verify logo", async ( {page}: { page: Page} ) => {
        await page.goto("/");

        const imageUrl = await page.locator(".logo img").getAttribute("src");

        expect(imageUrl).toBe("/static/images/home/logo.png");
    });

    /**
     * Test 4: Verify the product overlay background colour.
     *
     * CSS locator: .features_items .col-sm-4
     *
     * .features_items - identifies the featured products section
     * .col-sm-4       - identifies product column elements
     * .first()        - selects the first matching product column
     * .locator()      - narrows the search to an element inside it
     *
     * hover() simulates moving the mouse pointer over a product.
     * This triggers the product overlay.
     *
     * The final assertion verifies its computed background colour.
     */
    test("verify product overlay", async({page}: { page: Page}) => {

        await page.goto("/");

        const productCard = page.locator('.features_items .col-sm-4').first().locator('.single-products');

        await productCard.hover();

        const overlayLink: Locator = page.locator('div.product-overlay').first();

        await expect(overlayLink).toHaveCSS("background-color","rgb(254, 152, 15)");

    });


    /**
     * Test 5: Verify the product category after clicking a product link.
     *
     * This test starts from the homepage and navigates
     * to the product details page by clicking a link.
     *
     * page.route() intercepts matching network requests.
     * route.abort() blocks requests to specified advertising services.
     *
     * page.addStyleTag() adds CSS rules intended to hide advertising
     * elements that may obstruct interaction with the page.
     *
     * CSS locator: a[href='/product_details/1']
     *
     * This is an attribute selector targeting a link with the
     * specified href value.
     *
     * Finally, toHaveText() verifies the product category.
     *
     * Note: The added styles are applied before page.goto().
     * Styles added this way may not persist after navigation;
     * page.addInitScript() or another approach may be needed if
     * advertisements still interfere with the test.
     */
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

    /**
     * Test 6: Verify logo consistency across two pages.
     *
     * This test compares the logo's src attribute on the homepage
     * and on the product details page.
     *
     * Steps:
     * 1. Open the homepage.
     * 2. Read the homepage logo's src attribute.
     * 3. Click the product details link.
     * 4. Locate the logo on the product details page.
     * 5. Compare the two src values.
     *
     * TypeScript:
     * string | null represents the possible return values
     * of getAttribute().
     *
     * The ! operator is a non-null assertion, telling TypeScript
     * to treat homePageImageUrl as non-null. It does not check
     * the value at runtime.
     *
     * toHaveAttribute() checks the logo element's src attribute.
     *
     * Note: Playwright locator assertions normally use
     * await expect(locator).toHaveAttribute(...).
     */
    test("verify logo at the second page", async ( {page}: { page: Page} ) => {
        await page.goto("/");

        const homePageImageUrl:string | null  = await page.locator(".logo img").getAttribute("src");
        
        await page.locator("a[href='/product_details/1']").click();

        const productPageImageUrl = page.locator(".logo img");
        
        expect(productPageImageUrl).toHaveAttribute("src", homePageImageUrl!);
    });

});

/**
 * Learning Summary
 *
 * These exercises demonstrate several Playwright techniques:
 *
 * 1. Locating web elements using CSS selectors.
 * 2. Using attribute selectors and CSS combinators.
 * 3. Selecting the first matching element and chaining locators.
 * 4. Simulating mouse hover behaviour.
 * 5. Verifying text, CSS properties, and HTML attributes.
 * 6. Intercepting network requests using page.route().
 * 7. Working with TypeScript types and nullable values.
 *
 * All tests were developed manually for training purposes.
 *
 * Technical reminders:
 * - Import Locator from @playwright/test when using it as a type.
 * - Await asynchronous Playwright locator assertions.
 * - Consider whether CSS injected before navigation remains active.
 */
