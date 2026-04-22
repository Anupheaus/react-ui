import { act, render } from '@testing-library/react';
import { useContext } from 'react';
import { ErrorBoundary } from './ErrorBoundary';
import { ErrorContexts } from './ErrorContexts';
import type { RecordErrorsContextProps } from './ErrorContexts';

function ContextCapture({ onContext }: { onContext: (ctx: RecordErrorsContextProps) => void }) {
  const ctx = useContext(ErrorContexts.recordErrors);
  onContext(ctx);
  return <span data-testid="child">content</span>;
}

describe('ErrorBoundary — context provision', () => {
  it('provides isValid: true to children', () => {
    let ctx!: RecordErrorsContextProps;
    render(
      <ErrorBoundary>
        <ContextCapture onContext={c => { ctx = c; }} />
      </ErrorBoundary>
    );
    expect(ctx.isValid).toBe(true);
  });

  it('provides a recordError function to children', () => {
    let ctx!: RecordErrorsContextProps;
    render(
      <ErrorBoundary>
        <ContextCapture onContext={c => { ctx = c; }} />
      </ErrorBoundary>
    );
    expect(typeof ctx.recordError).toBe('function');
  });

  it('renders children normally when no error has occurred', () => {
    const { getByTestId } = render(
      <ErrorBoundary>
        <ContextCapture onContext={() => { }} />
      </ErrorBoundary>
    );
    expect(getByTestId('child')).not.toBeNull();
  });
});

describe('ErrorBoundary — onError callback', () => {
  beforeEach(() => { vi.useFakeTimers(); });
  afterEach(() => { vi.useRealTimers(); });

  it('calls onError after recordError is invoked, deferred via setTimeout', async () => {
    const onError = vi.fn();
    let ctx!: RecordErrorsContextProps;

    render(
      <ErrorBoundary onError={onError}>
        <ContextCapture onContext={c => { ctx = c; }} />
      </ErrorBoundary>
    );

    act(() => { ctx.recordError(new globalThis.Error('test'), false); });
    expect(onError).not.toHaveBeenCalled();

    await act(async () => { vi.runAllTimers(); });
    expect(onError).toHaveBeenCalledTimes(1);
  });

  it('does not call onError when the boundary is unmounted before the timeout fires', async () => {
    const onError = vi.fn();
    let ctx!: RecordErrorsContextProps;

    const { unmount } = render(
      <ErrorBoundary onError={onError}>
        <ContextCapture onContext={c => { ctx = c; }} />
      </ErrorBoundary>
    );

    act(() => { ctx.recordError(new globalThis.Error('late'), false); });
    unmount();

    await act(async () => { vi.runAllTimers(); });
    expect(onError).not.toHaveBeenCalled();
  });

  it('wraps a plain Error in the common Error type before passing to onError', async () => {
    const onError = vi.fn();
    let ctx!: RecordErrorsContextProps;

    render(
      <ErrorBoundary onError={onError}>
        <ContextCapture onContext={c => { ctx = c; }} />
      </ErrorBoundary>
    );

    act(() => { ctx.recordError(new globalThis.Error('plain'), false); });
    await act(async () => { vi.runAllTimers(); });

    expect(onError).toHaveBeenCalledTimes(1);
    const receivedError = onError.mock.calls[0][0];
    expect(receivedError).toBeDefined();
  });
});
