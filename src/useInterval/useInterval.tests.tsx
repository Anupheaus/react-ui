import { FC } from 'react';
import { mount } from 'enzyme';
import { useInterval } from './useInterval';

describe('useInterval', () => {

  function createComponent(interval: number, options?: Parameters<typeof useInterval>[2]) {
    const result = {
      refreshCount: 0,
      cancel: undefined as VoidFunction,
      intervalTriggerCount: 0,
      dispose: undefined as VoidFunction,
    };

    const Component: FC = () => {

      result.refreshCount++;

      result.cancel = useInterval(() => {
        result.intervalTriggerCount++;
      }, interval, options);

      return null;
    };

    const component = mount(<Component />);

    result.dispose = () => {
      component.unmount();
    };

    return result;
  }

  it('can create an interval', async () => {
    const result = createComponent(5);
    expect(result.intervalTriggerCount).to.eq(0);
    expect(result.refreshCount).to.eq(1);
    await Promise.delay(6);
    expect(result.intervalTriggerCount).to.eq(1);
    expect(result.refreshCount).to.eq(1);
    await Promise.delay(6);
    expect(result.intervalTriggerCount).to.eq(2);
    expect(result.refreshCount).to.eq(1);
    result.dispose();
  });

  it('interval is not called if component is disposed before being triggered', async () => {
    const result = createComponent(5);
    expect(result.intervalTriggerCount).to.eq(0);
    expect(result.refreshCount).to.eq(1);
    result.dispose();
    await Promise.delay(6);
    expect(result.intervalTriggerCount).to.eq(0);
    expect(result.refreshCount).to.eq(1);
  });

  it('can be triggered on unmount if required', async () => {
    const result = createComponent(5, { triggerOnUnmount: true });
    expect(result.intervalTriggerCount).to.eq(0);
    expect(result.refreshCount).to.eq(1);
    result.dispose();
    expect(result.intervalTriggerCount).to.eq(1);
    expect(result.refreshCount).to.eq(1);
    await Promise.delay(6);
    expect(result.intervalTriggerCount).to.eq(1);
    expect(result.refreshCount).to.eq(1);
  });

  it('can be manually cancelled', async () => {
    const result = createComponent(5, { triggerOnUnmount: true });
    expect(result.intervalTriggerCount).to.eq(0);
    expect(result.refreshCount).to.eq(1);
    result.cancel();
    expect(result.intervalTriggerCount).to.eq(0);
    expect(result.refreshCount).to.eq(1);
    await Promise.delay(6);
    expect(result.intervalTriggerCount).to.eq(0);
    expect(result.refreshCount).to.eq(1);
    result.dispose();
  });

});
