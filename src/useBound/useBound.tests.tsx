import { FunctionComponent, useState } from 'react';
import { mount } from 'enzyme';
import { useBound } from './useBound';
import { UseBoundFunctionResult } from './models';

interface IProps {
  saveTest(test: UseBoundFunctionResult<() => number>): void;
  saveSetValue?(setValue: (value: number) => void): void;
}

const TestComponent: FunctionComponent<IProps> = ({ saveTest, saveSetValue }) => {
  const [value, setValue] = useState(0);
  const test = useBound(() => value);

  saveTest(test);
  if (saveSetValue) { saveSetValue(setValue); }

  return null;
};

describe('useBound', () => {

  it('returns the same function every time', () => {
    let test: () => void;
    let lastTest: () => void;
    let setValue: (value: number) => void;
    let callCount = 0;

    const component = mount((
      <TestComponent saveTest={testValue => { test = testValue; callCount++; }} saveSetValue={setValueValue => { setValue = setValueValue; }} />
    ));

    expect(test).to.be.a('function');
    expect(lastTest).to.be.undefined;
    expect(setValue).to.be.a('function');
    expect(callCount).to.eq(1);

    lastTest = test;
    setValue(1);
    expect(test).to.eq(lastTest);
    expect(callCount).to.eq(2);

    component.unmount();
  });

  it('uses the latest copy of the function every time', () => {
    let test: () => void;
    let lastTest: () => void;
    let setValue: (value: number) => void;
    let callCount = 0;
    const component = mount(<TestComponent saveTest={testValue => { test = testValue; callCount++; }} saveSetValue={setValueValue => { setValue = setValueValue; }} />);
    expect(test).to.be.a('function');
    expect(lastTest).to.be.undefined;
    expect(setValue).to.be.a('function');
    expect(test()).to.eq(0);
    expect(callCount).to.eq(1);
    lastTest = test;
    setValue(1);
    expect(test).to.eq(lastTest);
    expect(test()).to.eq(1);
    expect(callCount).to.eq(2);
    component.unmount();
  });

  it('continues to work even after unmounted', () => {
    let test: () => void;
    const component = mount(<TestComponent saveTest={testValue => { test = testValue; }} />);
    expect(test).to.be.a('function');
    expect(test()).to.eq(0);
    component.unmount();
    expect(test()).to.eq(0);
  });

  it('calls whenUnmounted delegate when called after unmounted', () => {
    let test: UseBoundFunctionResult<() => number>;
    let whenUnmountedCallCount = 0;
    const component = mount(<TestComponent saveTest={testValue => { test = testValue; }} />);
    expect(test).to.be.a('function');
    expect(test.whenUnmounted(() => { whenUnmountedCallCount++; return -1; }));
    expect(test()).to.eq(0);
    expect(whenUnmountedCallCount).to.eq(0);
    component.unmount();
    expect(test()).to.eq(-1);
    expect(whenUnmountedCallCount).to.eq(1);
  });

  it('can use the useBound.create method', () => {
    let test: UseBoundFunctionResult<() => number>;
    const LocalTestComponent: FunctionComponent = () => {
      const whileMounted = useBound.create({ whenUnmounted: () => -1 });
      test = whileMounted(() => 1);
      return null;
    };
    const component = mount(<LocalTestComponent />);
    expect(test).to.be.a('function');
    expect(test()).to.eq(1);
    component.unmount();
    expect(test()).to.eq(-1);
  });

  it('can use the useBound.dispose method', () => {
    let test: UseBoundFunctionResult<() => number>;
    const LocalTestComponent: FunctionComponent = () => {
      const whileMounted = useBound.create({ whenUnmounted: () => -1 });
      test = whileMounted(() => 1);
      return null;
    };
    const component = mount(<LocalTestComponent />);
    expect(test).to.be.a('function');
    expect(test()).to.eq(1);
    test.dispose();
    expect(() => {
      test();
    }).to.throw('This bound method has been called after being disposed.');
    component.unmount();
  });

});
