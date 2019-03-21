import { FunctionComponent } from 'react';
import { useOnMount } from './useOnMount';
import { mount } from 'enzyme';

describe('useOnMount', () => {

  interface IProps {
    value?: any;
    onMounted(): void;
  }

  const TestComponent: FunctionComponent<IProps> = ({ onMounted }) => {

    useOnMount(onMounted);

    return null;
  };

  it('calls the method when mounted', async () => {
    let hasMountedBeenCalled = false;

    const handleMounted = () => {
      hasMountedBeenCalled = true;
    };

    const component = mount((
      <TestComponent onMounted={handleMounted} />
    ));

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

    expect(mountedCallCount).to.eq(1);
    component.setProps({ value: 'something' });
    await Promise.delay(0);
    expect(mountedCallCount).to.eq(1);
    component.unmount();
  });

});
