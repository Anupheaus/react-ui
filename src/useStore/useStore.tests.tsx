import { createStore } from './createStore';
import { FunctionComponent } from 'react';
import { useStore } from './useStore';
import { mount } from 'enzyme';
import { IMap } from 'anux-common';

describe('useStore', () => {

  interface IData {
    something: string;
    someCount: number;
  }

  function createTestComponent(selector?: (data: IData) => IMap, onChange?: (data: IData) => void) {
    const data: IData = {
      something: 'else',
      someCount: 1,
    };
    const testStore = createStore(data, update => ({
      changeSomethingTo: (something: string) => update({ something }),
    }));

    const result = {
      data: testStore.data,
      actions: testStore.actions,
      refreshCount: 0,
      Component: null as FunctionComponent,
    };

    const Component: FunctionComponent = () => {
      const [storeData] = useStore(testStore, selector, onChange);
      result.data = storeData as IData;
      result.refreshCount++;
      return null;
    };

    result.Component = Component;

    return result;
  }

  it('can be used within a component and it returns all the right data and actions', () => {
    const test = createTestComponent();
    const { Component } = test;
    const component = mount(<Component />);
    expect(test.refreshCount).to.eq(1);
    expect(test.data).to.be.a('object');
    expect(test.data.something).to.eq('else');
    expect(test.data.someCount).to.eq(1);
    expect(test.actions).to.be.a('object');
    expect(test.actions.changeSomethingTo).to.be.a('function');
    component.unmount();
  });

  it('updates to the store cause the component to refresh', () => {
    const test = createTestComponent();
    const { Component, actions: { changeSomethingTo } } = test;
    const component = mount(<Component />);
    expect(test.data.something).to.eq('else');
    expect(test.refreshCount).to.eq(1);
    changeSomethingTo('more');
    expect(test.data.something).to.eq('more');
    expect(test.refreshCount).to.eq(2);
    component.unmount();
  });

  it('updates to the store that do not actually cause differences will not cause the component to refresh', () => {
    const test = createTestComponent();
    const { Component, actions: { changeSomethingTo } } = test;
    const component = mount(<Component />);
    expect(test.data.something).to.eq('else');
    expect(test.refreshCount).to.eq(1);
    changeSomethingTo('else');
    expect(test.data.something).to.eq('else');
    expect(test.refreshCount).to.eq(1);
    component.unmount();
  });

  it('updates to the store that are excluded by the selector will not cause the component to refresh', () => {
    const test = createTestComponent(({ someCount }) => ({ someCount }));
    const { Component, actions: { changeSomethingTo } } = test;
    const component = mount(<Component />);
    expect(test.data.something).to.be.undefined;
    expect(test.data.someCount).to.eq(1);
    expect(test.refreshCount).to.eq(1);
    changeSomethingTo('more');
    expect(test.data.someCount).to.eq(1);
    expect(test.refreshCount).to.eq(1);
    component.unmount();
  });

  it('calls onChange when the store is updated', () => {
    let onChangeCallCount = 0;
    const test = createTestComponent(undefined, () => {
      onChangeCallCount++;
    });
    const { Component, actions: { changeSomethingTo } } = test;
    const component = mount(<Component />);
    expect(test.refreshCount).to.eq(1);
    expect(onChangeCallCount).to.eq(0);
    changeSomethingTo('more');
    expect(test.refreshCount).to.eq(2);
    expect(onChangeCallCount).to.eq(1);
    component.unmount();
  });

  it('unmounting the component will prevent the callback being called', () => {
    const test = createTestComponent();
    const { Component, actions: { changeSomethingTo } } = test;
    const component = mount(<Component />);
    expect(test.data.something).to.eq('else');
    expect(test.refreshCount).to.eq(1);
    component.unmount();
    changeSomethingTo('more');
    expect(test.data.something).to.eq('else');
    expect(test.refreshCount).to.eq(1);
  });

});
