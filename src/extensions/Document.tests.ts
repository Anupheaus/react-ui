import './Document';

describe('Document.simulateEvent', () => {

  it('installs simulateEvent as a function on document after import', () => {
    expect(typeof document.simulateEvent).toBe('function');
  });

  describe('dispatching supported mouse events', () => {
    const supportedMouseEvents = [
      'mousedown',
      'mousemove',
      'mouseup',
      'mouseenter',
      'mouseleave',
      'mouseover',
      'mouseout',
    ];

    it.each(supportedMouseEvents)('dispatches a MouseEvent for "%s"', (eventName) => {
      const handler = vi.fn();
      document.addEventListener(eventName, handler);
      document.simulateEvent(eventName, { bubbles: true });
      expect(handler).toHaveBeenCalledTimes(1);
      document.removeEventListener(eventName, handler);
    });

    it.each(supportedMouseEvents)('event received by listener has the correct type property for "%s"', (eventName) => {
      const handler = vi.fn();
      document.addEventListener(eventName, handler);
      document.simulateEvent(eventName, { bubbles: true });
      expect(handler).toHaveBeenCalledWith(expect.objectContaining({ type: eventName }));
      document.removeEventListener(eventName, handler);
    });

    it.each(supportedMouseEvents)('event received is an instance of MouseEvent for "%s"', (eventName) => {
      let receivedEvent: Event | undefined;
      const handler = (e: Event) => { receivedEvent = e; };
      document.addEventListener(eventName, handler);
      document.simulateEvent(eventName, { bubbles: true });
      expect(receivedEvent).toBeInstanceOf(MouseEvent);
      document.removeEventListener(eventName, handler);
    });
  });

  describe('event data is forwarded to the event', () => {
    it('passes clientX and clientY to the dispatched mousemove event', () => {
      let received: MouseEvent | undefined;
      const handler = (e: Event) => { received = e as MouseEvent; };
      document.addEventListener('mousemove', handler);
      document.simulateEvent('mousemove', { bubbles: true, clientX: 42, clientY: 99 });
      expect(received?.clientX).toBe(42);
      expect(received?.clientY).toBe(99);
      document.removeEventListener('mousemove', handler);
    });

    it('passes bubbles:true so the event bubbles when requested', () => {
      let received: Event | undefined;
      const handler = (e: Event) => { received = e; };
      document.addEventListener('mousedown', handler);
      document.simulateEvent('mousedown', { bubbles: true });
      expect(received?.bubbles).toBe(true);
      document.removeEventListener('mousedown', handler);
    });
  });

  describe('unsupported event names are silently ignored', () => {
    const unsupportedEventNames = [
      'keydown',
      'click',
      'custom',
      '',
      'MOUSEMOVE',
      'touchstart',
      'pointerdown',
    ];

    it.each(unsupportedEventNames)('does not dispatch any event for unsupported name "%s"', (eventName) => {
      const handler = vi.fn();
      document.addEventListener(eventName, handler);
      document.simulateEvent(eventName, { bubbles: true });
      expect(handler).not.toHaveBeenCalled();
      document.removeEventListener(eventName, handler);
    });
  });

});
