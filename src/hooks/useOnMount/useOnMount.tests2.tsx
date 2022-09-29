import { mount } from 'enzyme';
import { useOnMount } from './useOnMount';
import { anuxFC } from '../../anuxComponents';

describe.skip('useOnMount', () => {

  interface IProps {
    value?: unknown;
    onMounted(): void;
  }

  const TestComponent = anuxFC<IProps>('TestComponent', ({ onMounted }) => {
    useOnMount(onMounted);

    return (<div></div>);
  });

  it('calls the method when mounted', async () => {
    let hasMountedBeenCalled = false;

    const handleMounted = () => {
      hasMountedBeenCalled = true;
    };

    const component = mount((
      <TestComponent onMounted={handleMounted} />
    ));

    await Promise.delay(1);

    expect(hasMountedBeenCalled).to.be.true;

    component.unmount();
  });

  it('does not call the method again when props change', async () => {
    let mountedCallCount = 0;

    const handleMounted = () => {
      mountedCallCount++;
    };

    const component = mount((
      <TestComponent onMounted={handleMounted} />
    ));

    await Promise.delay(1);

    expect(mountedCallCount).to.eq(1);
    component.setProps({ value: 'something' });
    await Promise.delay(1);
    expect(mountedCallCount).to.eq(1);
    component.unmount();
  });

});
