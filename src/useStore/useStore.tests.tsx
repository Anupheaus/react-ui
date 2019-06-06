import { createStore } from './createStore';
import { FunctionComponent } from 'react';
import { useStore } from './useStore';
import { mount, ReactWrapper } from 'enzyme';
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

    const Store = createStore(data, update => ({
      changeSomethingTo: (something: string) => update({ something }),
    }));

    const results = {
      data,
      actions: undefined as typeof Store['actionsType'],
      refreshCount: 0,
      component: undefined as ReactWrapper<any, any>,
    };

    const Component: FunctionComponent = () => {
      const [storeData, actions] = useStore(Store, selector, onChange);
      results.data = storeData as IData;
      results.refreshCount++;
      results.actions = actions;
      return null;
    };

    const component = mount(<Store><Component /></Store>);

    results.component = component;

    return results;
  }

  function createTestNestedComponent() {
    const data: IData = {
      something: 'else',
      someCount: 1,
    };

    const Store = createStore(data, update => ({
      changeSomethingTo: (something: string) => update({ something }),
    }));

    const results = {
      levels: [{
        data,
        actions: undefined as typeof Store['actionsType'],
        refreshCount: 0,
      }, {
        data,
        actions: undefined as typeof Store['actionsType'],
        refreshCount: 0,
      }],
      component: undefined as ReactWrapper<any, any>,
    };

    const Component: FunctionComponent<{ level: number; }> = ({ level }) => {
      const [storeData, actions] = useStore(Store);
      results.levels[level].data = storeData as IData;
      results.levels[level].refreshCount++;
      results.levels[level].actions = actions;
      return null;
    };

    const component = mount((
      <Store>
        <Component level={0} />
        <Store>
          <Component level={1} />
        </Store>
      </Store>
    ));

    results.component = component;

    return results;
  }

  it('can be used within a component and it returns all the right data and actions', () => {
    const test = createTestComponent();
    const { component } = test;
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
    const { component, actions: { changeSomethingTo } } = test;
    expect(test.data.something).to.eq('else');
    expect(test.refreshCount).to.eq(1);
    changeSomethingTo('more');
    expect(test.data.something).to.eq('more');
    expect(test.refreshCount).to.eq(2);
    component.unmount();
  });

  it('updates to the store that do not actually cause differences will not cause the component to refresh', () => {
    const test = createTestComponent();
    const { component, actions: { changeSomethingTo } } = test;
    expect(test.data.something).to.eq('else');
    expect(test.refreshCount).to.eq(1);
    changeSomethingTo('else');
    expect(test.data.something).to.eq('else');
    expect(test.refreshCount).to.eq(1);
    component.unmount();
  });

  it('updates to the store that are excluded by the selector will not cause the component to refresh', () => {
    const test = createTestComponent(({ someCount }) => ({ someCount }));
    const { component, actions: { changeSomethingTo } } = test;
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
    const { component, actions: { changeSomethingTo } } = test;
    expect(test.refreshCount).to.eq(1);
    expect(onChangeCallCount).to.eq(0);
    changeSomethingTo('more');
    expect(test.refreshCount).to.eq(2);
    expect(onChangeCallCount).to.eq(1);
    component.unmount();
  });

  it('works with different stores at different levels - including nested', () => {
    const test = createTestNestedComponent();
    const { component, levels } = test;
    expect(levels[0].refreshCount).to.eq(1);
    expect(levels[0].data).to.eql({ something: 'else', someCount: 1 });
    expect(levels[1].refreshCount).to.eq(1);
    expect(levels[1].data).to.eql({ something: 'else', someCount: 1 });
    levels[0].actions.changeSomethingTo('more');
    expect(levels[0].refreshCount).to.eq(2);
    expect(levels[0].data).to.eql({ something: 'more', someCount: 1 });
    expect(levels[1].refreshCount).to.eq(1);
    expect(levels[1].data).to.eql({ something: 'else', someCount: 1 });
    component.unmount();
  });

  it('unmounting the component will error when a change is requested and prevent the callback being called', () => {
    const test = createTestComponent();
    const { component, actions: { changeSomethingTo } } = test;
    expect(test.data.something).to.eq('else');
    expect(test.refreshCount).to.eq(1);
    component.unmount();
    expect(() => {
      changeSomethingTo('more');
    }).to.throw('An attempt was made to update a store that has been disposed.');
    expect(test.data.something).to.eq('else');
    expect(test.refreshCount).to.eq(1);
  });

});
