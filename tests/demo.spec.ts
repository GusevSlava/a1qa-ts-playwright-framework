import { test, expect } from '#framework/ui/fixtures/browser.fixture.js';
import MainPage from './pages/MainPage.js';
import LoginPage from './pages/LoginPage.js';
import SecureAreaPage from './pages/SecureAreaPage.js';
import ConfigReader from '#framework/utils/ConfigReader.js';
import EnvProvider from '#framework/utils/EnvProvider.js';

test('demo test for a successful login', async ({ customBrowser: browser }) => {
  const testData = ConfigReader.getTestData();
  const mainPage = new MainPage(browser.page);
  await mainPage.clickNavigationLink('Form Authentication');

  const loginPage = new LoginPage(browser.page);
  await loginPage.waitForPageToLoad();
  expect(await loginPage.isPageOpened()).toBe(true);
  await loginPage.typeUsername(EnvProvider.testUser);
  await loginPage.typePassword(EnvProvider.testPassword);
  await loginPage.clickLoginButton();

  const secureAreaPage = new SecureAreaPage(browser.page);
  await secureAreaPage.waitForPageToLoad();
  expect(await secureAreaPage.isPageOpened()).toBe(true);
  const message = await secureAreaPage.getMessageText();
  expect(message).toEqual(testData.loginSuccessMessage);

  await secureAreaPage.clickLogoutButton();
  await loginPage.waitForPageToLoad();
  expect(await loginPage.isPageOpened()).toBe(true);
});
