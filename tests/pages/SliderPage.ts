import { Label, Slider } from '#framework/ui/elements/index.js';
import BasePage from '#framework/ui/page/BasePage.js';
import { Page } from '@playwright/test';

export default class SliderPage extends BasePage {
  private slider: Slider;
  private mouse;

  constructor(page: Page) {
    super(
      new Label(page.getByRole('heading', { name: 'Horizontal Slider' }), 'Horizontal Slider page unique locator'),
      'Add/Remove Page'
    );
    this.slider = new Slider(page.getByRole('slider'), `Slider`);
    this.mouse = page.mouse;
  }

  async setInitialSliderValue(value: 'max' | 'min' | 'middle'): Promise<void> {
    switch (value) {
      case 'min':
        return this.slider.clickByPosition('left');
      case 'max':
        return this.slider.clickByPosition('right');
      case 'middle':
        return this.slider.clickByPosition('center');
      default:
        return this.slider.click();
    }
  }

  async getSliderValue(): Promise<number> {
    return Number(await this.slider.getValue());
  }

  async changeSliderValueByKeyboard(direction: 'up' | 'down'): Promise<void> {
    return this.slider.changeValueByKeyboard(direction);
  }

  async changeSliderValueByDragAndDrop(value: number): Promise<void> {
    return this.slider.changeValueByDragAndDrop(value);
  }

  async changeSliderValueByMouse(value: number): Promise<void> {
    const rect = await this.slider.getElementRect();
    const currentValue = await this.getSliderValue();
    const maxValue = await this.slider.getMaxValue();
    const oneValueInPx = rect.width / maxValue;
    const currentPosition = currentValue * oneValueInPx;
    await this.mouse.move(rect.left + currentPosition, rect.top + rect.height / 2);
    await this.mouse.down();
    await this.mouse.move(rect.left + currentPosition + oneValueInPx * value, rect.top + rect.height / 2);
    await this.mouse.up();
  }
}
