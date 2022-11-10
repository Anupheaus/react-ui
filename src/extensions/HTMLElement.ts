import './Document';
import { ICoordinates, IDimensions, IGeometry } from '@anupheaus/common';

interface IDimensionOptions {
  excludingPadding?: boolean;
  excludingMargin?: boolean;
  excludingBorder?: boolean;
}

const windowObj = typeof (window) === 'undefined' ? undefined : window;

function getNumericDimensions(element: HTMLElement | null) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const style: CSSStyleDeclaration = element ? (windowObj && windowObj.getComputedStyle ? windowObj.getComputedStyle(element) : (element as any).currentStyle) : {};
  const getValue = (value: string): number => parseInt(value, 0) || 0;
  const { marginTop, marginLeft, marginRight, marginBottom, paddingTop, paddingLeft, paddingRight, paddingBottom, borderTopWidth, borderLeftWidth, borderRightWidth,
    borderBottomWidth } = style;
  return {
    marginTop: getValue(marginTop), marginLeft: getValue(marginLeft), marginRight: getValue(marginRight), marginBottom: getValue(marginBottom), paddingTop: getValue(paddingTop),
    paddingLeft: getValue(paddingLeft), paddingRight: getValue(paddingRight), paddingBottom: getValue(paddingBottom), borderTopWidth: getValue(borderTopWidth),
    borderLeftWidth: getValue(borderLeftWidth), borderRightWidth: getValue(borderRightWidth), borderBottomWidth: getValue(borderBottomWidth),
  };
}

class HTMLElementExtensions {

  public screenCoordinates(): ICoordinates;
  public screenCoordinates(this: HTMLElement): ICoordinates {
    const rect = this.getBoundingClientRect();
    const { marginTop, marginLeft, borderLeftWidth, borderTopWidth } = getNumericDimensions(this.parentElement);
    return {
      x: (rect.left - marginLeft - borderLeftWidth),
      y: (rect.top - marginTop - borderTopWidth),
    };
  }

  public parentElements(): HTMLElement[];
  public parentElements(untilElement: HTMLElement): HTMLElement[];
  public parentElements(this: HTMLElement, untilElement?: HTMLElement): HTMLElement[] {
    let element = this.parentElement;
    const elements: HTMLElement[] = [];
    while (element != null && element !== untilElement) {
      elements.push(element);
      element = element.parentElement instanceof HTMLElement ? element.parentElement : null;
    }
    return elements;
  }

  public parentNodes(): Node[];
  public parentNodes(untilNode: Node): Node[];
  public parentNodes(this: Node, untilNode?: Node): Node[] {
    let node = this.parentNode;
    const nodes: Node[] = [];
    while (node != null && node !== untilNode) {
      nodes.push(node);
      node = node.parentNode;
    }
    return nodes;
  }

  public pageCoordinates(): ICoordinates;
  public pageCoordinates(relativeTo: HTMLElement): ICoordinates;
  public pageCoordinates(this: HTMLElement, relativeTo?: HTMLElement): ICoordinates {
    return [this].concat(relativeTo ? this.parentElements(relativeTo) : this.parentElements())
      .reduce(({ x, y }, { clientLeft, scrollLeft, offsetLeft, clientTop, scrollTop, offsetTop }) =>
        ({ x: x + clientLeft + offsetLeft - scrollLeft, y: y + clientTop + offsetTop - scrollTop }), { x: 0, y: 0 });
  }

  public coordinates(): ICoordinates;
  public coordinates(this: HTMLElement): ICoordinates {
    return { x: this.clientLeft, y: this.clientTop };
  }

  public centreCoordinates(): ICoordinates;
  public centreCoordinates(this: HTMLElement): ICoordinates {
    const dimensions = this.dimensions({ excludingMargin: true });
    return {
      x: dimensions.left + (dimensions.width / 2),
      y: dimensions.top + (dimensions.height / 2),
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
    const { marginTop, marginLeft, marginRight, marginBottom, paddingTop, paddingLeft, paddingRight, paddingBottom, borderTopWidth,
      borderLeftWidth, borderRightWidth, borderBottomWidth } = getNumericDimensions(this);
    let top = -marginTop;
    let left = -marginLeft;
    width += marginLeft + marginRight;
    height += marginTop + marginBottom;

    if (options.excludingMargin) {
      top += marginTop;
      left += marginLeft;
      width -= (marginLeft + marginRight);
      height -= (marginTop + marginBottom);
    }
    if (options.excludingPadding) {
      top += paddingTop;
      left += paddingLeft;
      width -= (paddingLeft + paddingRight);
      height -= (paddingBottom + paddingTop);
    }
    if (options.excludingBorder) {
      top += borderTopWidth;
      left += borderLeftWidth;
      width -= borderRightWidth;
      height -= borderBottomWidth;
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
    const { width, height } = this.dimensions({ excludingMargin: true });
    return {
      ...this.pageCoordinates(),
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

if (windowObj) { Object.extendPrototype(windowObj['HTMLElement'].prototype, HTMLElementExtensions.prototype); }

declare global { interface HTMLElement extends HTMLElementExtensions { } }
