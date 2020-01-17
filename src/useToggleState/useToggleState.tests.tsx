import { FunctionComponent } from 'react';
import { mount, ReactWrapper } from 'enzyme';
import { useOnUnmount } from '../useOnUnmount';
import { useToggleState } from './useToggleState';
import { IUseToggleStateResult } from './models';

describe('useToggleState', () => {

  interface IProps {
    value: boolean;
  }

  function createTest(initialValue = true, overrideCallbacks = true, allowPropsToChangeValue = false) {
    const state = {
      toggle: undefined as IUseToggleStateResult,
      renderCount: 0,
      component: undefined as ReactWrapper<any, Readonly<{}>, React.Component<{}, {}, any>>,
      changeCount: 0,
      enableCount: 0,
      disableCount: 0,
    };
    const Component: FunctionComponent<IProps> = ({ value }) => {
      const toggle = useToggleState(value);
      if (allowPropsToChangeValue) { toggle.current = value; }
      state.toggle = toggle;
      state.renderCount++;
      useOnUnmount(() => toggle.dispose());
      return null;
    };
    state.component = mount((
      <Component value={initialValue} />
    ));
    if (overrideCallbacks) {
      state.toggle.onChange(value => { state.changeCount++; return value; });
      state.toggle.onEnable(() => { state.enableCount++; });
      state.toggle.onDisable(() => { state.disableCount++; });
    }
    return state;
  }

  it('can be disabled', () => {
    const test = createTest();
    expect(test.toggle.current).to.be.true;
    expect(test.renderCount).to.eq(1);
    expect(test.changeCount).to.eq(0);
    expect(test.enableCount).to.eq(0);
    expect(test.disableCount).to.eq(0);
    test.toggle.current = false;
    expect(test.toggle.current).to.be.false;
    expect(test.renderCount).to.eq(1);
    expect(test.changeCount).to.eq(1);
    expect(test.enableCount).to.eq(0);
    expect(test.disableCount).to.eq(1);
    test.component.unmount();
  });

  it('is ignored if already set to the value', () => {
    const test = createTest();
    expect(test.toggle.current).to.be.true;
    expect(test.renderCount).to.eq(1);
    expect(test.changeCount).to.eq(0);
    expect(test.enableCount).to.eq(0);
    expect(test.disableCount).to.eq(0);
    test.toggle.current = true;
    expect(test.toggle.current).to.be.true;
    expect(test.renderCount).to.eq(1);
    expect(test.changeCount).to.eq(0);
    expect(test.enableCount).to.eq(0);
    expect(test.disableCount).to.eq(0);
    test.component.unmount();
  });

  it('can be overridden in the onChange', () => {
    const test = createTest();
    expect(test.toggle.current).to.be.true;
    expect(test.renderCount).to.eq(1);
    expect(test.changeCount).to.eq(0);
    expect(test.enableCount).to.eq(0);
    expect(test.disableCount).to.eq(0);
    test.toggle.onChange(() => true);
    test.toggle.current = false;
    expect(test.toggle.current).to.be.true;
    expect(test.renderCount).to.eq(1);
    expect(test.changeCount).to.eq(0);
    expect(test.enableCount).to.eq(0);
    expect(test.disableCount).to.eq(0);
    test.component.unmount();
  });

  it('can be overridden in the onDisable', () => {
    const test = createTest();
    expect(test.toggle.current).to.be.true;
    expect(test.renderCount).to.eq(1);
    expect(test.changeCount).to.eq(0);
    expect(test.enableCount).to.eq(0);
    expect(test.disableCount).to.eq(0);
    test.toggle.onDisable(() => false);
    test.toggle.current = false;
    expect(test.toggle.current).to.be.true;
    expect(test.renderCount).to.eq(1);
    expect(test.changeCount).to.eq(1);
    expect(test.enableCount).to.eq(0);
    expect(test.disableCount).to.eq(0);
    test.component.unmount();
  });

  it('works without any overrides', () => {
    const test = createTest(true, false);
    expect(test.toggle.current).to.be.true;
    expect(test.renderCount).to.eq(1);
    test.toggle.current = false;
    expect(test.toggle.current).to.be.false;
    expect(test.renderCount).to.eq(1);
    test.toggle.current = true;
    expect(test.toggle.current).to.be.true;
    expect(test.renderCount).to.eq(1);
    test.component.unmount();
  });

  it('does not change if the props change', () => {
    const test = createTest();
    expect(test.toggle.current).to.be.true;
    expect(test.renderCount).to.eq(1);
    test.component.setProps({ value: false });
    expect(test.toggle.current).to.be.true;
    expect(test.renderCount).to.eq(2);
    expect(test.changeCount).to.eq(0);
    expect(test.enableCount).to.eq(0);
    expect(test.disableCount).to.eq(0);
    test.component.unmount();
  });

  it('changes if the props change if made to allow that', () => {
    const test = createTest(true, true, true);
    expect(test.toggle.current).to.be.true;
    expect(test.renderCount).to.eq(1);
    test.component.setProps({ value: false });
    expect(test.toggle.current).to.be.false;
    expect(test.renderCount).to.eq(2);
    expect(test.changeCount).to.eq(1);
    expect(test.enableCount).to.eq(0);
    expect(test.disableCount).to.eq(1);
    test.component.unmount();
  });

  it('continues to work after being unmounted', () => {
    const test = createTest(true, true, true);
    expect(test.toggle.current).to.be.true;
    expect(test.renderCount).to.eq(1);
    test.component.setProps({ value: false });
    expect(test.toggle.current).to.be.false;
    expect(test.renderCount).to.eq(2);
    expect(test.changeCount).to.eq(1);
    expect(test.enableCount).to.eq(0);
    expect(test.disableCount).to.eq(1);
    test.component.unmount();
  });

});
