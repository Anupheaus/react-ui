import { act, render } from '@testing-library/react';
import { useCallbacks } from './useCallbacks';
import type { UseCallbacks } from './useCallbacks';

function setup() {
  let sharedCallbacks: UseCallbacks<(val: number) => void>;

  function Producer() {
    sharedCallbacks = useCallbacks<(val: number) => void>();
    return null;
  }

  function Consumer({ onValue }: { onValue: (v: number) => void }) {
    const { register } = sharedCallbacks;
    register(function (val) { onValue(val); });
    return null;
  }

  return { Producer, Consumer, getCallbacks: () => sharedCallbacks };
}

describe('useCallbacks', () => {
  it('invoke() calls all registered callbacks with arguments', async () => {
    const { Producer, Consumer, getCallbacks } = setup();
    const received: number[] = [];
    const { unmount: unmountConsumer } = render(
      <>
        <Producer />
        <Consumer onValue={v => received.push(v)} />
      </>
    );
    await act(async () => { await getCallbacks().invoke(42); });
    expect(received).toEqual([42]);
    unmountConsumer();
  });

  it('after a consumer unmounts, its callback is no longer invoked', async () => {
    const { Producer, Consumer, getCallbacks } = setup();
    const received: number[] = [];

    const { rerender } = render(
      <>
        <Producer />
        <Consumer onValue={v => received.push(v)} />
      </>
    );

    rerender(<Producer />);
    received.length = 0;
    await act(async () => { await getCallbacks().invoke(99); });
    expect(received).toHaveLength(0);
  });
});
