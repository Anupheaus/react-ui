import { act, render, renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { createElement, useEffect } from 'react';
import { createSubscription } from './createSubscription';
import { subscriptionInternal } from './subscriptionInternals';
import { useSubscription } from './useSubscription';
import { useSubscriptionProvider } from './useSubscriptionProvider';
import { LoggerProvider } from '../LoggerProvider/LoggerProvider';

// ---------------------------------------------------------------------------
// Shared test wrapper — LoggerProvider is required by useSubscription internally
// ---------------------------------------------------------------------------
function makeLoggerWrapper(children: ReactNode) {
  return createElement(LoggerProvider, { loggerName: 'test', logger: undefined }, children);
}

function LoggerWrapper({ children }: { children: ReactNode }) {
  return makeLoggerWrapper(children);
}

// ---------------------------------------------------------------------------
// Harness components
// ---------------------------------------------------------------------------

interface SubscriberProps<InvokePayload> {
  subscription: ReturnType<typeof createSubscription<any, InvokePayload>>;
  onReceive: (payload: InvokePayload) => void;
  subscribeKey?: string;
}

function SubscriberComponent<InvokePayload>({
  subscription,
  onReceive,
  subscribeKey = 'default',
}: SubscriberProps<InvokePayload>) {
  const { subscribe } = useSubscription(subscription, onReceive);
  useEffect(() => {
    subscribe(undefined as any);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subscribeKey]);
  return null;
}

interface ProviderWrapperProps<InvokePayload> {
  subscription: ReturnType<typeof createSubscription<any, InvokePayload>>;
  children: ReactNode;
  invokeRef: { current: ((payload: InvokePayload, groupId?: string) => Promise<void>) | null };
}

function ProviderWrapper<InvokePayload>({
  subscription,
  children,
  invokeRef,
}: ProviderWrapperProps<InvokePayload>) {
  const { invoke, Provider } = useSubscriptionProvider(subscription);
  useEffect(() => {
    invokeRef.current = invoke;
  }, [invoke, invokeRef]);
  return createElement(Provider, null, children);
}

// ---------------------------------------------------------------------------
// Group 1: createSubscription
// ---------------------------------------------------------------------------

describe('createSubscription', () => {
  it('returns an object with the subscriptionInternal symbol property', () => {
    const sub = createSubscription();
    expect((sub as any)[subscriptionInternal]).toBeDefined();
  });

  it('stores the provided config on the subscriptionInternal property', () => {
    const config = { onSubscribingCallbackAction: 'callWithLastPayload' as const };
    const sub = createSubscription(config);
    expect((sub as any)[subscriptionInternal].config).toBe(config);
  });

  it('defaults to an empty config when none is provided', () => {
    const sub = createSubscription();
    expect((sub as any)[subscriptionInternal].config).toEqual({});
  });

  it('two separate calls return different subscription objects', () => {
    const sub1 = createSubscription();
    const sub2 = createSubscription();
    expect(sub1).not.toBe(sub2);
  });

  it('subscription object created outside a component can be used inside useSubscription', () => {
    const mySub = createSubscription<undefined, number>();
    // If the context lookup fails it throws 'SubscriptionProvider not found'
    // A successful render means the context was found and the provider was valid
    const invokeRef: { current: ((n: number) => Promise<void>) | null } = { current: null };

    expect(() =>
      render(
        createElement(LoggerWrapper, null,
          createElement(ProviderWrapper, { subscription: mySub, invokeRef },
            createElement(SubscriberComponent, { subscription: mySub, onReceive: () => undefined })
          )
        )
      )
    ).not.toThrow();
  });
});

// ---------------------------------------------------------------------------
// Group 2: useSubscriptionProvider + useSubscription integration
// ---------------------------------------------------------------------------

describe('useSubscriptionProvider + useSubscription', () => {
  it('subscriber receives the invoked payload', async () => {
    const mySub = createSubscription<undefined, number>();
    const received: number[] = [];
    const invokeRef: { current: ((n: number) => Promise<void>) | null } = { current: null };

    render(
      createElement(LoggerWrapper, null,
        createElement(ProviderWrapper, { subscription: mySub, invokeRef },
          createElement(SubscriberComponent, { subscription: mySub, onReceive: (n: number) => { received.push(n); } })
        )
      )
    );

    await act(async () => {
      await invokeRef.current!(42);
    });

    expect(received).toEqual([42]);
  });

  it('multiple subscribers all receive the payload when invoked', async () => {
    const mySub = createSubscription<undefined, number>();
    const received1: number[] = [];
    const received2: number[] = [];
    const received3: number[] = [];
    const invokeRef: { current: ((n: number) => Promise<void>) | null } = { current: null };

    render(
      createElement(LoggerWrapper, null,
        createElement(ProviderWrapper, { subscription: mySub, invokeRef },
          createElement(SubscriberComponent, { subscription: mySub, onReceive: (n: number) => { received1.push(n); } }),
          createElement(SubscriberComponent, { subscription: mySub, onReceive: (n: number) => { received2.push(n); } }),
          createElement(SubscriberComponent, { subscription: mySub, onReceive: (n: number) => { received3.push(n); } })
        )
      )
    );

    await act(async () => {
      await invokeRef.current!(7);
    });

    expect(received1).toEqual([7]);
    expect(received2).toEqual([7]);
    expect(received3).toEqual([7]);
  });

  it('subscriber is unsubscribed when the component unmounts and invoke after unmount does not call callback', async () => {
    const mySub = createSubscription<undefined, number>();
    const received: number[] = [];
    const invokeRef: { current: ((n: number) => Promise<void>) | null } = { current: null };

    const { rerender } = render(
      createElement(LoggerWrapper, null,
        createElement(ProviderWrapper, { subscription: mySub, invokeRef },
          createElement(SubscriberComponent, { subscription: mySub, onReceive: (n: number) => { received.push(n); } })
        )
      )
    );

    // Verify it receives before unmount
    await act(async () => {
      await invokeRef.current!(1);
    });
    expect(received).toEqual([1]);

    // Unmount the subscriber by re-rendering without it
    rerender(
      createElement(LoggerWrapper, null,
        createElement(ProviderWrapper, { subscription: mySub, invokeRef }, null)
      )
    );

    // Invoke after unmount — should not reach the old callback
    await act(async () => {
      await invokeRef.current!(2);
    });

    expect(received).toEqual([1]);
  });

  it('onCallback lets you change the callback after initial mount', async () => {
    const mySub = createSubscription<undefined, number>();
    const firstReceived: number[] = [];
    const secondReceived: number[] = [];
    const invokeRef: { current: ((n: number) => Promise<void>) | null } = { current: null };
    let capturedOnCallback: ((fn: (n: number) => void) => void) | null = null;

    function SubscriberWithOnCallback() {
      const { subscribe, onCallback } = useSubscription<undefined, number>(mySub);
      useEffect(() => {
        subscribe(undefined as any);
        capturedOnCallback = onCallback;
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);
      return null;
    }

    render(
      createElement(LoggerWrapper, null,
        createElement(ProviderWrapper, { subscription: mySub, invokeRef },
          createElement(SubscriberWithOnCallback)
        )
      )
    );

    // Set first callback and invoke
    act(() => {
      capturedOnCallback!((n) => { firstReceived.push(n); });
    });

    await act(async () => {
      await invokeRef.current!(10);
    });

    expect(firstReceived).toEqual([10]);
    expect(secondReceived).toEqual([]);

    // Switch callback and invoke again
    act(() => {
      capturedOnCallback!((n) => { secondReceived.push(n); });
    });

    await act(async () => {
      await invokeRef.current!(20);
    });

    // Second callback should receive, first should not get new values
    expect(firstReceived).toEqual([10]);
    expect(secondReceived).toEqual([20]);
  });

  it('with callWithLastPayload config — a new subscriber receives the last payload immediately on subscribe', async () => {
    const mySub = createSubscription<undefined, number>({ onSubscribingCallbackAction: 'callWithLastPayload' });
    const earlyReceived: number[] = [];
    const lateReceived: number[] = [];
    const invokeRef: { current: ((n: number) => Promise<void>) | null } = { current: null };

    const { rerender } = render(
      createElement(LoggerWrapper, null,
        createElement(ProviderWrapper, { subscription: mySub, invokeRef },
          createElement(SubscriberComponent, { subscription: mySub, onReceive: (n: number) => { earlyReceived.push(n); } })
        )
      )
    );

    // Invoke before the late subscriber mounts
    await act(async () => {
      await invokeRef.current!(99);
    });

    expect(earlyReceived).toEqual([99]);

    // Now mount a new subscriber — it should immediately receive the last payload
    rerender(
      createElement(LoggerWrapper, null,
        createElement(ProviderWrapper, { subscription: mySub, invokeRef },
          createElement(SubscriberComponent, { subscription: mySub, onReceive: (n: number) => { earlyReceived.push(n); } }),
          createElement(SubscriberComponent, { subscription: mySub, onReceive: (n: number) => { lateReceived.push(n); } })
        )
      )
    );

    // Wait for any async subscription processing
    await act(async () => { });

    expect(lateReceived).toEqual([99]);
  });

  it('useSubscription throws when called without a SubscriptionProvider wrapping it', () => {
    const mySub = createSubscription<undefined, number>();
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

    expect(() =>
      renderHook(
        () => useSubscription(mySub, () => undefined),
        { wrapper: LoggerWrapper }
      )
    ).toThrow('SubscriptionProvider not found');

    consoleSpy.mockRestore();
  });
});
