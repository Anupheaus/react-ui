import { mount } from 'enzyme';
import { useOnUnmount } from './useOnUnmount';
import { anuxFC } from '../../anuxComponents';

describe('useOnUnmount', () => {

  interface IProps {
    value?: unknown;
    onUnmounted(): void;
    onAfterTimeout?(hasUnmounted: boolean): void;
  }

  const TestComponent = anuxFC<IProps>('TestComponent', ({ onUnmounted, onAfterTimeout }) => {

    const isUnmounted = useOnUnmount(onUnmounted);

    setTimeout(() => onAfterTimeout && onAfterTimeout(isUnmounted()), 5);

    return (<div></div>);
  });

  it('calls the method when unmounted', async () => {
    let hasUnmountedBeenCalled = false;
    let hasUnmounted = false;

    const handleUnmounted = () => {
      hasUnmountedBeenCalled = true;
    };
    const handleAfterTimeout = (hasUnmountedValue: boolean) => {
      hasUnmounted = hasUnmountedValue;
    };

    const component = mount((
      <TestComponent onUnmounted={handleUnmounted} onAfterTimeout={handleAfterTimeout} />
    ));

    expect(hasUnmountedBeenCalled).to.be.false;
    expect(hasUnmounted).to.be.false;
    component.unmount();
    expect(hasUnmountedBeenCalled).to.be.true;
    expect(hasUnmounted).to.be.false;
    await Promise.delay(10);
    expect(hasUnmounted).to.be.true;
  });

  it('does not call the method when props change', async () => {
    let hasUnmountedBeenCalled = false;

    const handleUnmounted = () => {
      hasUnmountedBeenCalled = true;
    };

    const component = mount((
      <TestComponent onUnmounted={handleUnmounted} />
    ));

    expect(hasUnmountedBeenCalled).to.be.false;
    component.setProps({ value: 'something' });
    await Promise.delay(0);
    expect(hasUnmountedBeenCalled).to.be.false;
    component.unmount();
    expect(hasUnmountedBeenCalled).to.be.true;
  });

});
