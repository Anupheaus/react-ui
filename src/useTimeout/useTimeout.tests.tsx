import { FunctionComponent } from 'react';
import { mount } from 'enzyme';
import { useTimeout } from './useTimeout';

describe('useTimeout', () => {

  function createComponent(timeout: number, options?: Parameters<typeof useTimeout>[2]) {
    const result = {
      refreshCount: 0,
      cancel: undefined as VoidFunction,
      timeoutTriggerCount: 0,
      dispose: undefined as VoidFunction,
    };

    const Component: FunctionComponent = () => {

      result.refreshCount++;

      result.cancel = useTimeout(() => {
        result.timeoutTriggerCount++;
      }, timeout, options);

      return null;
    };

    const component = mount(<Component />);

    result.dispose = () => {
      component.unmount();
    };

    return result;
  }

  it('can create a timeout', async () => {
    const result = createComponent(5);
    expect(result.timeoutTriggerCount).to.eq(0);
    expect(result.refreshCount).to.eq(1);
    await Promise.delay(6);
    expect(result.timeoutTriggerCount).to.eq(1);
    expect(result.refreshCount).to.eq(1);
    result.dispose();
  });

  it('timeout is not called if component is disposed before being triggered', async () => {
    const result = createComponent(5);
    expect(result.timeoutTriggerCount).to.eq(0);
    expect(result.refreshCount).to.eq(1);
    result.dispose();
    await Promise.delay(6);
    expect(result.timeoutTriggerCount).to.eq(0);
    expect(result.refreshCount).to.eq(1);
  });

  it('can be triggered on unmount if required', async () => {
    const result = createComponent(5, { triggerOnUnmount: true });
    expect(result.timeoutTriggerCount).to.eq(0);
    expect(result.refreshCount).to.eq(1);
    result.dispose();
    expect(result.timeoutTriggerCount).to.eq(1);
    expect(result.refreshCount).to.eq(1);
    await Promise.delay(6);
    expect(result.timeoutTriggerCount).to.eq(1);
    expect(result.refreshCount).to.eq(1);
  });

  it('can be manually cancelled', async () => {
    const result = createComponent(5, { triggerOnUnmount: true });
    expect(result.timeoutTriggerCount).to.eq(0);
    expect(result.refreshCount).to.eq(1);
    result.cancel();
    expect(result.timeoutTriggerCount).to.eq(0);
    expect(result.refreshCount).to.eq(1);
    await Promise.delay(6);
    expect(result.timeoutTriggerCount).to.eq(0);
    expect(result.refreshCount).to.eq(1);
    result.dispose();
  });

});
