import { render } from '@testing-library/react';
import { createComponent } from '../../components';
import { useOnUnmount } from './useOnUnmount';

describe('useOnUnmount', () => {

  interface Props {
    value?: unknown;
    onUnmounted(): void;
    onAfterTimeout?(hasUnmounted: boolean): void;
  }

  const TestComponent = createComponent('TestComponent', ({ onUnmounted, onAfterTimeout }: Props) => {
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

    const component = render((
      <TestComponent onUnmounted={handleUnmounted} onAfterTimeout={handleAfterTimeout} />
    ));

    expect(hasUnmountedBeenCalled).toBeFalsy();
    expect(hasUnmounted).toBeFalsy();
    component.unmount();
    expect(hasUnmountedBeenCalled).toBeTruthy();
    expect(hasUnmounted).toBeFalsy();
    await Promise.delay(10);
    expect(hasUnmounted).toBeTruthy();
  });

  it('does not call the method when props change', async () => {
    let hasUnmountedBeenCalled = false;

    const handleUnmounted = () => {
      hasUnmountedBeenCalled = true;
    };

    const { rerender, unmount } = render((
      <TestComponent onUnmounted={handleUnmounted} />
    ));

    expect(hasUnmountedBeenCalled).toBeFalsy();
    rerender(<TestComponent onUnmounted={handleUnmounted} value={'something'} />);
    await Promise.delay(0);
    expect(hasUnmountedBeenCalled).toBeFalsy();
    unmount();
    expect(hasUnmountedBeenCalled).toBeTruthy();
  });

});
