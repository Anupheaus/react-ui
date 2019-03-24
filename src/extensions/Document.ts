// tslint:disable: interface-name

class DocumentExtensions {

  public simulateEvent(eventName: string, eventData: Object): void;
  public simulateEvent(this: Document, eventName: string, eventData: Object): void {
    const eventType = (() => {
      if (['mousedown', 'mousemove', 'mouseup'].includes(eventName)) { return 'MouseEvent'; }
    })();
    const event = new window[eventType](eventName, eventData);
    this.dispatchEvent(event);
  }

}

const windowObj: Window = typeof (window) === 'undefined' ? undefined : global['window'];
if (windowObj) { Object.extendPrototype(windowObj['document'], DocumentExtensions.prototype); }

declare global { interface Document extends DocumentExtensions { } }

export { };
