import { test, expect } from "@playwright/test";

test.describe('first sausedemo test', () => {
    test('verify page title', async ({ page }) => {
        await page.goto('https://www.saucedemo.com');
        let title = await page.title();
        expect(title).toEqual('Swag Labs');
    })
    
    test('fill login/password', async ({page}) => {
        await page.goto('https://www.saucedemo.com');
        await page.locator('#user-name').fill('standard_user');
        await page.locator('#password').fill('secret_sauce');
        await page.locator('#login-button').click();
        expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
    })
})
