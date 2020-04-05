import { mount } from 'enzyme';
import { useInterval } from './useInterval';
import { anuxFC } from '../anuxComponents';
import { useFakeTimers, SinonFakeTimers } from 'sinon';

describe('useInterval', () => {

  interface Props {
    refreshCount: number;
    cancel: VoidFunction;
    intervalTriggerCount: number;
    clock: SinonFakeTimers;
    dispose: VoidFunction;
  }

  function test(description: string, interval: number, options: Parameters<typeof useInterval>[2], delegate: (props: Props) => Promise<void>): void {
    it(description, async () => {
      const props: Props = {
        refreshCount: 0,
        cancel: undefined as unknown as VoidFunction,
        intervalTriggerCount: 0,
        clock: useFakeTimers(),
        dispose: undefined as unknown as VoidFunction,
      };
      let hasUnmountBeenCalled = false;

      const Component = anuxFC('Component', () => {
        props.refreshCount++;
        props.cancel = useInterval(() => {
          props.intervalTriggerCount++;
        }, interval, options);
        return (<div></div>);
      });

      const component = mount(<Component />);

      props.dispose = () => {
        if (hasUnmountBeenCalled) { return; }
        hasUnmountBeenCalled = true;
        component.unmount();
      };

      await delegate(props);

      props.clock.restore();
      props.dispose();
    });
  }

  test('can create an interval', 5, {}, async props => {
    expect(props.intervalTriggerCount).to.eq(0);
    expect(props.refreshCount).to.eq(1);
    props.clock.tick(6);
    expect(props.intervalTriggerCount).to.eq(1);
    expect(props.refreshCount).to.eq(1);
    props.clock.tick(6);
    expect(props.intervalTriggerCount).to.eq(2);
    expect(props.refreshCount).to.eq(1);
  });

  test('interval is not called if component is disposed before being triggered', 5, {}, async props => {
    expect(props.intervalTriggerCount).to.eq(0);
    expect(props.refreshCount).to.eq(1);
    props.dispose();
    props.clock.tick(6);
    expect(props.intervalTriggerCount).to.eq(0);
    expect(props.refreshCount).to.eq(1);
  });

  test('can be triggered on unmount if required', 5, { triggerOnUnmount: true }, async props => {
    expect(props.intervalTriggerCount).to.eq(0);
    expect(props.refreshCount).to.eq(1);
    props.dispose();
    expect(props.intervalTriggerCount).to.eq(1);
    expect(props.refreshCount).to.eq(1);
    props.clock.tick(6);
    expect(props.intervalTriggerCount).to.eq(1);
    expect(props.refreshCount).to.eq(1);
  });

  test('can be manually cancelled', 5, { triggerOnUnmount: true }, async props => {
    expect(props.intervalTriggerCount).to.eq(0);
    expect(props.refreshCount).to.eq(1);
    props.cancel();
    expect(props.intervalTriggerCount).to.eq(0);
    expect(props.refreshCount).to.eq(1);
    props.clock.tick(6);
    expect(props.intervalTriggerCount).to.eq(0);
    expect(props.refreshCount).to.eq(1);
    props.dispose();
  });

});
