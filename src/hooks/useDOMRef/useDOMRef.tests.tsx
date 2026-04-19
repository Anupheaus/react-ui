import { render } from '@testing-library/react';
import { useDOMRef } from './useDOMRef';

describe('useDOMRef', () => {
  it('connected callback fires when an element is attached', () => {
    const connected = vi.fn();
    function TestComponent() {
      const setTarget = useDOMRef({ connected });
      return <div ref={setTarget as any} />;
    }
    render(<TestComponent />);
    expect(connected).toHaveBeenCalledTimes(1);
    expect(connected.mock.calls[0][0]).toBeInstanceOf(HTMLElement);
  });

  it('disconnected callback fires when element is removed', () => {
    const disconnected = vi.fn();
    function TestComponent({ show }: { show: boolean }) {
      const setTarget = useDOMRef({ disconnected });
      return show ? <div ref={setTarget as any} /> : null;
    }
    const { rerender } = render(<TestComponent show />);
    rerender(<TestComponent show={false} />);
    expect(disconnected).toHaveBeenCalledTimes(1);
  });

  it('returns [ref, setTarget] when called with no config', () => {
    function TestComponent() {
      const result = useDOMRef();
      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(2);
      return null;
    }
    render(<TestComponent />);
  });
});
