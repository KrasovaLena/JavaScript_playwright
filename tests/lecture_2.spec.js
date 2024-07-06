import { test, expect } from "@playwright/test";

test.describe ('annotations and hooks', () => {
    test.beforeEach(async ({page}) => {
        await page.goto('https://www.saucedemo.com');
    })

    test('verify page title', async ({ page }) => {
            let title = await page.title();

            expect(title).toEqual('Swag Labs');
    })
        
    test('fill login/password', async ({page}) => {
            await page.locator('#user-name').fill('standard_user');
            await page.locator('#password').fill('secret_sauce');
            await page.locator('#login-button').click();

            expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
    })
})

test.describe ('locators and methods', () => {

    test('links and heading', async ({ page }) => {
        await page.goto('https://openweathermap.org/api');

        await page.getByRole('link', {name: 'Guide'}).click();

        await expect(page.getByRole('heading', {name: 'Guide'})).toBeVisible();
        await expect(page).toHaveURL('https://openweathermap.org/guide');
    })

    test('textbox, .getByText() and button', async ({ page }) => {
        //<input type="text"> - textbox
        await page.goto('https://the-internet.herokuapp.com/login');

        await page.getByRole('textbox', {name:'username'}).fill('tomsmith');
        await page.getByRole('textbox', {name:'password'}).fill('SuperSecretPassword!');
        await page.getByRole('button', {name:'login'}).click();

        await expect(page.getByText('You logged into a secure area!')).toBeVisible();
        await expect(page).toHaveURL('https://the-internet.herokuapp.com/secure');
        await expect(page.locator('#flash')).toContainText('You logged into a secure area!');
    })

    test('checkbox, .check() and button', async ({ page }) => {
        //<input type="checkbox"> - checkbox
        await page.goto('https://home.openweathermap.org/users/sign_in');

        await page.getByRole('checkbox', {name:'Remember me'}).check();

        await expect(page.getByRole('checkbox', {name:'Remember me'})).toBeChecked();
    })

    test('radio button, .getByLabel()', async ({ page }) => {
        //<input type="checkbox"> - checkbox
        await page.goto('https://home.openweathermap.org/questions');

        await page.getByLabel('Yes').check();

        await expect(page.getByLabel('Yes')).toBeChecked();
    })

    test('checkbox-2 and .textContent()/.innerText()', async ({ page }) => {
        await page.goto('https://demoqa.com/automation-practice-form');
        const text1 = await page.locator('h1.text-center').textContent();
        console.log(text1) // Используется для отладки тестов, затем убираем!
        const text2 = await page.locator('h1.text-center').innerText();
        console.log(text2) // Используется для отладки тестов, затем убираем!
        // await page.getByLabel('Sports').check();
        // await page.getByRole('checkbox', {name: 'Sports'}).check();
        // await page.getByText('Sports', {exact: true}).check(); 
        await page.locator('[for="hobbies-checkbox-1"]').check();
    })

    test('method .hover()', async ({ page }) => {
        await page.goto('https://the-internet.herokuapp.com/hovers');

        await page.getByAltText('User Avatar').first().hover();

        await expect(page.getByText('name: user1')).toBeVisible();
        await expect(page.getByRole('heading', {name:'name: user1'})).toBeVisible();
    })

    test('checkbox-3, first(), last(), and .nth(1)', async ({ page }) => {
        await page.goto('https://the-internet.herokuapp.com/checkboxes');

        // await page.getByRole('checkbox').first().check(); - идентичный запрос в этом контексте
        await page.getByRole('checkbox').nth(0).check();
        // await page.getByRole('checkbox').last().uncheck(); - идентичный запрос в этом контексте
        await page.getByRole('checkbox').nth(1).uncheck();

        await expect(page.getByRole('checkbox').first()).toBeChecked();
        await expect(page.getByRole('checkbox').last()).not.toBeChecked();

    })

    test('.getByRole("listitem") and methods .filter() and .all()', async ({ page }) => {
        // для <li></li>
        await page.goto('https://the-internet.herokuapp.com/disappearing_elements');

        const buttons = page.getByRole('listitem');
        console.log(await buttons.all()); // Массив элементов
        console.log(await buttons.allInnerTexts()); // Массив внутренних текстов элементов
        await buttons.filter({hasText: 'Home'}).click();

        await expect(page).toHaveURL('https://the-internet.herokuapp.com');
    })

    test('selectOption(), .toHaveValue', async ({ page }) => {
        // <select><option>1</option><option>2</option></select>
        await page.goto('https://the-internet.herokuapp.com/dropdown');
        const selectMenu =  page.locator('#dropdown');

        await selectMenu.selectOption('Option 1');
        
        // await expect(selectMenu).toHaveText('Option 1');   //не работает
        //Как проверить drop-down menu:
        await expect(selectMenu).toHaveValue('1'); // for 'value' attribute
        await expect(selectMenu.locator('option:checked')).toHaveText('Option 1');
        await expect(selectMenu.getByText('Option 1')).toHaveAttribute('selected', 'selected');
    })

    test('Multiselect drop down and setTimeout() in console', async ({ page }) => {
        await page.goto('https://demoqa.com/select-menu');
        //Для работы с react drop-down menu вводим в консоли "setTimeout(() => { debugger }, 3000)"
        await page.getByText('Select...').click();
        await page.locator('#react-select-4-option-0').click();
        await page.locator('#react-select-4-option-1').click();
        
        await expect(page.locator('.css-1rhbuit-multiValue')).toHaveText(['Green', 'Blue']);
    })

    test('handle with new tab', async ({ page }) => {
        await page.goto('https://openweathermap.org/');
        const pageMarketPlacePromise = page.waitForEvent('popup');

        await page.getByText('Marketplace').first().click();
        const pageMarketPlace = await pageMarketPlacePromise;
        //Эта переменная требуется для проверки страницы, открытой в новой вкладке, т.к. это уже другая { page }

        await expect(pageMarketPlace.getByRole('heading', {name: 'Custom Weather Products'})).toBeVisible();
        await expect(pageMarketPlace).toHaveURL('https://home.openweathermap.org/marketplace')
})

    test('using waitFor()', async ({ page }) => {
        // метод waitFor() применяется к элементам, проверяет состояния attached, detached, visible, hidden
        await page.goto('https://openweathermap.org/');

        await page.getByPlaceholder('Search city').fill('New York');
        await page.getByRole('button', {name: 'Search'}).click();
        const dropdownMenu = page.locator('ul.search-dropdown-menu');
        await dropdownMenu.waitFor({state: 'attached'});

        await expect(dropdownMenu.locator('li>span:nth-child(1)')).toHaveText(['New York City, US', 'New York, US']);
    })

    test('using alternative timeouts', async ({ page }) => {
        await page.goto('https://the-internet.herokuapp.com/dynamic_loading');

        await page.getByRole('link').filter({hasText: 'Example 1'}).click();
        await page.getByRole('button', {name: 'Start'}).click();
        await page.locator('#finish>h4').waitFor();

        await expect(page.getByText('Hello World!')).toBeVisible();
    })
})