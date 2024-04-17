import { test, expect } from "@playwright/test";

test.describe("Sign In", () => {

    test.beforeEach(async ({ page }) => {
        await page.goto("http://localhost:3000/signin");
    })

    test("should not sign in due to empty email and password", async ({ page }) => {
        // Fill in email and password
        await page.waitForTimeout(500);
        const $email = page.locator("input[name=email]");
        const $password = page.locator("input[name=password]");
        // Click on Sign In Button
        await page.getByTestId("signin-btn").click();
        const emailErrorMessageId = (await $email.getAttribute("id")) + "-message"
        const passwordErrorMessageId = (await $password.getAttribute("id")) + "-message"

        // Check if error message is displayed for email
        const $emailMessage = page.locator(`p[id="${emailErrorMessageId}"]`);
        await expect($emailMessage).toHaveText(/Invalid email/);

        // Check if error message is displayed for password
        const $passwordMessage = page.locator(`p[id="${passwordErrorMessageId}"]`);
        await expect($passwordMessage).toHaveText(/Password must be at least 8 characters/);
    })

    test("should not sign in due to invalid credentials", async ({ page }) => {
        // Fill in email and password
        await page.waitForTimeout(500);
        const $username = page.locator("input[name=email]");
        await $username.fill("example11111111@gmail.com");
        const $password = page.locator("input[name=password]");
        await $password.fill("Ab1@1234");
        // Click on Sign In Button
        await page.getByTestId("signin-btn").click();
        const passwordErrorMessageId = (await $password.getAttribute("id")) + "-message"
        const $passwordMessage = page.locator(`p[id="${passwordErrorMessageId}"]`);
        // Check if error message is displayed
        await expect($passwordMessage).toHaveText(/Invalid email or password/);
    })

    test("should sign in", async ({ page }) => {
        // Fill in email and password
        await page.waitForTimeout(500);
        await page.fill("input[name=email]", "user@example.com");
        await page.fill("input[name=password]", "Test@1234");
        // Click on Sign In Button
        await page.getByTestId("signin-btn").click();
        // Wait for URL to change to dashboard
        await page.waitForURL("http://localhost:3000/profile", { timeout: 5 * 1000 });
    })

    test("should logout after signing in", async ({ page }) => {
        // Fill in email and password
        await page.waitForTimeout(500);
        await page.fill("input[name=email]", "user@example.com");
        await page.fill("input[name=password]", "Test@1234");
        // Click on Sign In Button
        await page.getByTestId("signin-btn").click();
        // Wait for URL to change to dashboard
        await page.waitForURL("http://localhost:3000/profile", { timeout: 5 * 1000 });
        // Click on Logout Button
        await page.getByTestId("logout-btn").click();
    })
});