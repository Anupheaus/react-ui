// tslint:disable: interface-name
import './Document';
import { ICoordinates, IDimensions, IGeometry } from 'anux-common';

interface IDimensionOptions {
  excludingPadding?: boolean;
  excludingMargin?: boolean;
  excludingBorder?: boolean;
}

class HTMLElementExtensions {

  public screenCoordinates(): ICoordinates;
  public screenCoordinates(this: HTMLElement): ICoordinates {
    const rect = this.getBoundingClientRect();
    return {
      x: rect.left,
      y: rect.top,
    };
  }

  public pageCoordinates(): ICoordinates;
  public pageCoordinates(this: HTMLElement): ICoordinates {
    const scrollLeft = windowObj.pageXOffset || document.documentElement.scrollLeft;
    const scrollTop = windowObj.pageYOffset || document.documentElement.scrollTop;
    const screenCoordinates = this.screenCoordinates();

    return {
      x: screenCoordinates.x + scrollLeft,
      y: screenCoordinates.y + scrollTop,
    };
  }

  public coordinates(): ICoordinates;
  public coordinates(this: HTMLElement): ICoordinates {
    return { x: this.clientLeft, y: this.clientTop };
  }

  public centreCoordinates(): ICoordinates;
  public centreCoordinates(this: HTMLElement): ICoordinates {
    const rect = this.getBoundingClientRect();
    return {
      x: rect.left + (rect.width / 2),
      y: rect.top + (rect.height / 2),
    };
  }

  public distanceTo(coordinates: ICoordinates): number;
  public distanceTo(this: HTMLElement, coordinates: ICoordinates): number {
    if (this.isUnderCoordinates(coordinates)) { return 0; }
    const geometry = this.geometry();
    const x = Math.min(Math.abs(coordinates.x - geometry.x), Math.abs(coordinates.x - (geometry.x + geometry.width)));
    const y = Math.min(Math.abs(coordinates.y - geometry.y), Math.abs(coordinates.y - (geometry.y + geometry.height)));
    return Math.sqrt((x * x) + (y * y));
  }

  /**
   * Dimensions of this element with respect to itself; i.e. the margins, borders and padding.
   */
  public dimensions(): IDimensions;
  public dimensions(options: IDimensionOptions): IDimensions;
  public dimensions(this: HTMLElement, options?: IDimensionOptions): IDimensions {
    options = {
      excludingBorder: false,
      excludingMargin: false,
      excludingPadding: false,
      ...options,
    };

    let { width, height } = this.getBoundingClientRect();
    let top = 0;
    let left = 0;
    let style: CSSStyleDeclaration = null;

    if (options.excludingBorder || options.excludingMargin || options.excludingPadding) {
      style = windowObj.getComputedStyle ? windowObj.getComputedStyle(this) : this['currentStyle'];
    }

    if (options.excludingMargin) {
      top += parseInt(style.marginTop, 0) || 0;
      left += parseInt(style.marginLeft, 0) || 0;
      width -= (parseInt(style.marginLeft, 0) || 0) + (parseInt(style.marginRight, 0) || 0);
      height -= (parseInt(style.marginTop, 0) || 0) + (parseInt(style.marginBottom, 0) || 0);
    }
    if (options.excludingPadding) {
      top += parseInt(style.paddingTop, 0) || 0;
      left += parseInt(style.paddingLeft, 0) || 0;
      width -= (parseInt(style.paddingLeft, 0) || 0) + (parseInt(style.paddingRight, 0) || 0);
      height -= (parseInt(style.paddingTop, 0) || 0) + (parseInt(style.paddingBottom, 0) || 0);
    }
    if (options.excludingBorder) {
      top += parseInt(style.borderTopWidth, 0) || 0;
      left += parseInt(style.borderLeftWidth, 0) || 0;
      width -= (parseInt(style.borderLeftWidth, 0) || 0) + (parseInt(style.borderRightWidth, 0) || 0);
      height -= (parseInt(style.borderTopWidth, 0) || 0) + (parseInt(style.borderBottomWidth, 0) || 0);
    }
    return {
      top,
      left,
      width,
      height,
    };
  }

  /**
   * Coordinates and dimensions of this element with respect to the page.
   */
  public geometry(): IGeometry;
  public geometry(this: HTMLElement): IGeometry {
    const { width, height } = this.dimensions();
    return {
      ...this.screenCoordinates(),
      width,
      height,
    };
  }

  public isUnderCoordinates(coordinates: ICoordinates): boolean;
  public isUnderCoordinates(this: HTMLElement, coordinates: ICoordinates): boolean {
    const location = this.geometry();
    return (coordinates.x >= location.x && coordinates.x <= location.x + location.width)
      && (coordinates.y >= location.y && coordinates.y <= location.y + location.height);
  }

  public simulateEvent(eventName: string, eventData: Object): void;
  public simulateEvent(this: HTMLElement, eventName: string, eventData: Object): void {
    window.document.simulateEvent.call(this, eventName, eventData);
  }

}

const windowObj = typeof (window) === 'undefined' ? undefined : global['window'];
if (windowObj) { Object.extendPrototype(windowObj['HTMLElement'].prototype, HTMLElementExtensions.prototype); }

declare global { interface HTMLElement extends HTMLElementExtensions { } }
