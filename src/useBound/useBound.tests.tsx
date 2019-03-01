import { useBound } from './useBound';
import { FunctionComponent, useState } from 'react';
import { mount } from 'enzyme';

interface IProps {
  saveTest(test: () => void): void;
  saveSetValue(setValue: (value: number) => void): void;
}

const TestComponent: FunctionComponent<IProps> = ({ saveTest, saveSetValue }) => {
  const [value, setValue] = useState(0);
  const test = useBound(() => value);

  saveTest(test);
  saveSetValue(setValue);

  return null;
};

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

  const component = mount((
    <TestComponent saveTest={testValue => { test = testValue; callCount++; }} saveSetValue={setValueValue => { setValue = setValueValue; }} />
  ));

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
