import { test, expect } from '#framework/ui/fixtures/browser.fixture.js';
import MainPage from './pages/MainPage.js';
import LoginPage from './pages/LoginPage.js';
import SecureAreaPage from './pages/SecureAreaPage.js';
import AddRemovePage from './pages/AddRemovePage.js';
import SliderPage from './pages/SliderPage.js';
import MultipleWindowsPage from './pages/MultipleWindowsPage.js';
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

test('test for add/remove elements', async ({ customBrowser: browser }) => {
  const mainPage = new MainPage(browser.page);
  await mainPage.clickNavigationLink('Add/Remove Elements');

  const addRemovePage = new AddRemovePage(browser.page);
  await addRemovePage.waitForPageToLoad();
  expect(await addRemovePage.isPageOpened()).toBe(true);
  await addRemovePage.clickButton('Add Element');
  expect(await addRemovePage.isButtonDisplayed('Delete')).toBe(true);
  await addRemovePage.clickButton('Delete');
  expect(await addRemovePage.isButtonDisplayed('Delete')).toBe(false);
  await addRemovePage.insertHtmlById('#elements', '<button class="added-manually" onclick="deleteElement()">Delete</button>');
  expect(await addRemovePage.isButtonDisplayed('Delete')).toBe(true);
});

test('horizonal slider', async ({ customBrowser: browser }) => {
  const mainPage = new MainPage(browser.page);
  await mainPage.clickNavigationLink('Horizontal Slider');
  const sliderPage = new SliderPage(browser.page);
  await sliderPage.waitForPageToLoad();
  await sliderPage.setInitialSliderValue('max');
  let sliderValue = await sliderPage.getSliderValue();
  expect(sliderValue).toEqual(5);
  await sliderPage.setInitialSliderValue('middle');
  sliderValue = await sliderPage.getSliderValue();
  expect(sliderValue).toEqual(2.5);
  await sliderPage.setInitialSliderValue('min');
  sliderValue = await sliderPage.getSliderValue();
  expect(sliderValue).toEqual(0);
  await sliderPage.changeSliderValueByKeyboard('up');
  await sliderPage.changeSliderValueByKeyboard('up');
  sliderValue = await sliderPage.getSliderValue();
  expect(sliderValue).toEqual(1);
  await sliderPage.changeSliderValueByKeyboard('down');
  sliderValue = await sliderPage.getSliderValue();
  expect(sliderValue).toEqual(0.5);
  await sliderPage.changeSliderValueByDragAndDrop(120);
  sliderValue = await sliderPage.getSliderValue();
  expect(sliderValue).toEqual(5);
  await sliderPage.changeSliderValueByDragAndDrop(0);
  sliderValue = await sliderPage.getSliderValue();
  expect(sliderValue).toEqual(0);
  await sliderPage.changeSliderValueByMouse(2);
  sliderValue = await sliderPage.getSliderValue();
  expect(sliderValue).toEqual(2);
  await sliderPage.changeSliderValueByMouse(-2);
  sliderValue = await sliderPage.getSliderValue();
  expect(sliderValue).toEqual(0);
});

test('Popup window', async ({ customBrowser: browser }) => {
  const mainPage = new MainPage(browser.page);
  await mainPage.clickNavigationLink('Multiple Windows');
  const multipleWindowsPage = new MultipleWindowsPage(browser.page);
  await multipleWindowsPage.waitForPageToLoad();
  const popupText = await multipleWindowsPage.getPopupWindowText();
  expect(popupText).toEqual('New Window');
});
