import { createElement, createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { createComponent } from './createComponent';

describe('createComponent', () => {

  describe('rendering', () => {
    it('renders output from the render function', () => {
      const TestComp = createComponent('TestComp', () => (
        <div data-testid="result">hello</div>
      ));

      render(<TestComp />);
      expect(screen.getByTestId('result')).toHaveTextContent('hello');
    });

    it('passes props to the render function', () => {
      const TestComp = createComponent('TestComp', ({ value }: { value: string }) => (
        <div data-testid="result">{value}</div>
      ));

      render(<TestComp value="from-prop" />);
      expect(screen.getByTestId('result')).toHaveTextContent('from-prop');
    });

    it('forwards a ref object to the render function as a prop', () => {
      let receivedRef: unknown;
      const TestComp = createComponent('TestComp', (props: any) => {
        receivedRef = props.ref;
        return <div />;
      });

      const ref = createRef<HTMLElement>();
      render(createElement(TestComp as any, { ref }));
      expect(receivedRef).toBe(ref);
    });

    it('forwards a callback ref to the render function as a prop', () => {
      let receivedRef: unknown;
      const TestComp = createComponent('TestComp', (props: any) => {
        receivedRef = props.ref;
        return <div />;
      });

      const callbackRef = vi.fn();
      render(createElement(TestComp as any, { ref: callbackRef }));
      expect(receivedRef).toBe(callbackRef);
    });
  });

  describe('display name', () => {
    it('sets displayName to "Name (memo)" when memoisation is enabled', () => {
      const TestComp = createComponent('MyWidget', () => <div />);
      expect(TestComp.displayName).toBe('MyWidget (memo)');
    });

    it('sets displayName to the bare name when memoisation is disabled', () => {
      const TestComp = createComponent('MyWidget', () => <div />, { disableMemoisation: true });
      expect(TestComp.displayName).toBe('MyWidget');
    });
  });

  describe('Overrides', () => {
    it('exposes an Overrides property on the component', () => {
      const TestComp = createComponent('TestComp', () => <div />);
      expect(TestComp.Overrides).toBeDefined();
    });

    it('injects override props into the component via Overrides', () => {
      const TestComp = createComponent('TestComp', ({ label }: { label: string }) => (
        <div data-testid="result">{label}</div>
      ));

      render(
        <TestComp.Overrides label="overridden">
          <TestComp label="original" />
        </TestComp.Overrides>
      );
      expect(screen.getByTestId('result')).toHaveTextContent('overridden');
    });

    it('does not apply Overrides to components outside the wrapper', () => {
      const TestComp = createComponent('TestComp', ({ label }: { label: string }) => (
        <div data-testid="result">{label}</div>
      ));

      render(
        <>
          <TestComp.Overrides label="overridden">
            <span />
          </TestComp.Overrides>
          <TestComp label="untouched" />
        </>
      );
      expect(screen.getByTestId('result')).toHaveTextContent('untouched');
    });
  });

  describe('memoisation', () => {
    it('does not re-render when memoised and props have not changed', () => {
      const renderFn = vi.fn((_props: Record<string, unknown>) => <div />);
      const TestComp = createComponent('TestComp', renderFn as any);

      const { rerender } = render(<TestComp />);
      rerender(<TestComp />);

      expect(renderFn).toHaveBeenCalledTimes(1);
    });

    it('re-renders when memoised and a primitive prop changes', () => {
      const renderFn = vi.fn((_props: Record<string, unknown>) => <div />);
      const TestComp = createComponent('TestComp', renderFn as any);

      const { rerender } = render(createElement(TestComp as any, { value: 1 }));
      rerender(createElement(TestComp as any, { value: 2 }));

      expect(renderFn).toHaveBeenCalledTimes(2);
    });

    it('always re-renders when disableMemoisation is true', () => {
      const renderFn = vi.fn((_props: Record<string, unknown>) => <div />);
      const TestComp = createComponent('TestComp', renderFn as any, { disableMemoisation: true });

      const { rerender } = render(<TestComp />);
      rerender(<TestComp />);

      expect(renderFn).toHaveBeenCalledTimes(2);
    });
  });

  describe('error handling', () => {
    it('renders the onError fallback when the render function throws', () => {
      const onError = vi.fn(() => <div data-testid="fallback">Error occurred</div>);
      const TestComp = createComponent('TestComp', () => {
        throw new Error('render error');
      }, { onError });

      render(<TestComp />);

      expect(screen.getByTestId('fallback')).toBeInTheDocument();
      expect(onError).toHaveBeenCalledTimes(1);
    });

    it('passes the thrown error to onError', () => {
      const onError = vi.fn(() => <div />);
      const thrownError = new Error('specific error');
      const TestComp = createComponent('TestComp', () => {
        throw thrownError;
      }, { onError });

      render(<TestComp />);

      const receivedError = onError.mock.calls[0][0];
      expect(receivedError.message ?? receivedError.innerError?.message).toContain('specific error');
    });
  });

  describe('onCompareProps', () => {
    it('uses onCompareProps instead of default comparison when provided', () => {
      const onCompareProps = vi.fn(() => true);
      const renderFn = vi.fn((_props: Record<string, unknown>) => <div />);
      const TestComp = createComponent('TestComp', renderFn as any, { onCompareProps });

      const { rerender } = render(createElement(TestComp as any, { value: 1 }));
      rerender(createElement(TestComp as any, { value: 2 }));

      expect(onCompareProps).toHaveBeenCalled();
      expect(renderFn).toHaveBeenCalledTimes(1); // returned true → no re-render
    });

    it('passes the whitelist to onCompareProps', () => {
      const onCompareProps = vi.fn(() => true);
      const TestComp = createComponent('TestComp', () => <div />, {
        onCompareProps,
        whitelistFunctions: ['onChange'],
      });

      const { rerender } = render(<TestComp />);
      rerender(<TestComp />);

      expect(onCompareProps).toHaveBeenCalledWith(
        expect.anything(),
        expect.anything(),
        'props',
        expect.arrayContaining(['onChange']),
      );
    });
  });

  describe('function whitelist', () => {
    let warnSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
      warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => { });
    });

    afterEach(() => {
      warnSpy.mockRestore();
    });

    it('suppresses function-change warnings for props listed in config whitelistFunctions', () => {
      const TestComp = createComponent('TestComp', (_props: any) => <div />, {
        whitelistFunctions: ['onChange'],
      });

      const { rerender } = render(createElement(TestComp as any, { onChange: () => { } }));
      rerender(createElement(TestComp as any, { onChange: () => { } }));

      expect(warnSpy).not.toHaveBeenCalled();
    });

    it('suppresses function-change warnings for props listed in data-whitelist-functions', () => {
      const TestComp = createComponent('TestComp', (_props: any) => <div />);

      const { rerender } = render(
        createElement(TestComp as any, { onChange: () => { }, 'data-whitelist-functions': ['onChange'] })
      );
      rerender(
        createElement(TestComp as any, { onChange: () => { }, 'data-whitelist-functions': ['onChange'] })
      );

      expect(warnSpy).not.toHaveBeenCalled();
    });

    it('warns for an unstable function prop not in the whitelist', () => {
      const TestComp = createComponent('TestComp', (_props: any) => <div />);

      const { rerender } = render(createElement(TestComp as any, { onChange: () => { } }));
      rerender(createElement(TestComp as any, { onChange: () => { } }));

      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('"onChange"'),
        expect.anything(),
      );
    });
  });

});
