import { createStore } from './createStore2';
import { StoreTypeId } from './models';
import { mount } from 'enzyme';
import { FunctionComponent, useContext } from 'react';
import { StoreContext, IStoreContext } from './context';
import { stores } from './stores';
import { Store as StoreInstance } from './store';
import { useStore } from './useStore';

describe('useStore - createStore', () => {

  // interface ITestStoreResult<TData extends IMap, TActions extends IMap> {
  //   data: TData;
  //   actions: TActions;
  //   callbackCount: number;
  //   dispose(): void;
  // }

  // function createTestStore<TData extends IMap, TActions extends IMap>(data: TData, actions: (upsert: (data: DeepPartial<TData>) => void) => TActions,
  //   callback?: (data: TData) => void, reverseCallbackOrder: boolean = false): ITestStoreResult<TData, TActions> {
  //   const Store = createStore<TData, TActions>(data, actions);

  //   const Component: FunctionComponent = ({ }) => {
  //     const [storeData, storeActions] = useStore(Store);
  //     return null;
  //   };

  //   const component = mount(<Store><Component /></Store>);

  //   const result: ITestStoreResult<TData, TActions> = {
  //     data: store.data,
  //     actions: store.actions,
  //     callbackCount: 0,
  //     dispose: undefined,
  //   };

  //   let unregisterCallback1: () => void;
  //   let unregisterCallback2: () => void;

  //   const registerCallback1 = () => { unregisterCallback1 = internalStore.registerCallback(newData => { if (callback) { callback(newData); } }); };
  //   const registerCallback2 = () => { unregisterCallback2 = internalStore.registerCallback(newData => { result.callbackCount++; result.data = newData; }); };
  //   if (reverseCallbackOrder) {
  //     registerCallback2();
  //     registerCallback1();
  //   } else {
  //     registerCallback1();
  //     registerCallback2();
  //   }

  //   result.dispose = () => {
  //     unregisterCallback1();
  //     unregisterCallback2();
  //   };

  //   return result;
  // }

  function createTestStore() {
    return createStore({
      something: 'else',
    }, update => ({
      changeSomethingTo: (something: string) => update({ something }),
    }));
  }

  it('a store component can be created', () => {
    const Store = createTestStore();
    expect(Store).to.be.a('function');
    expect(Store[StoreTypeId]).to.be.a('string').with.lengthOf(36);
  });

  it('component can be instantiated', () => {
    const Store = createTestStore();
    const component = mount(<Store />);
    component.unmount();
  });

  it('creates a context with the store type id and store id', () => {
    const Store = createTestStore();
    let context: IStoreContext;
    const Component: FunctionComponent = () => {
      context = useContext(StoreContext);
      return null;
    };
    const component = mount(<Store><Component /></Store>);
    expect(context).to.be.an('object');
    expect(context[Store[StoreTypeId]]).to.be.a('string').with.lengthOf(36);
    component.unmount();
  });

  it('creates a store and removes it on unmount too', () => {
    const Store = createTestStore();
    let context: IStoreContext;
    const Component: FunctionComponent = () => {
      context = useContext(StoreContext);
      return null;
    };
    const component = mount(<Store><Component /></Store>);
    const storeId = context[Store[StoreTypeId]];
    expect(stores[storeId]).to.be.an('object').and.an.instanceOf(StoreInstance);
    component.unmount();
    expect(stores[storeId]).to.be.undefined;
  });

  it('creates a store with different data', () => {
    const Store = createTestStore();
    let context: IStoreContext;
    const Component: FunctionComponent = () => {
      context = useContext(StoreContext);
      return null;
    };
    const component = mount(<Store initialData={{ something: 'blah' }}><Component /></Store>);
    const storeId = context[Store[StoreTypeId]];
    const store = stores[storeId];
    expect(store.data).to.eql({ something: 'blah' });
    component.unmount();
  });

  it('creates a store with modified data', () => {
    const Store = createTestStore();
    let context: IStoreContext;
    const Component: FunctionComponent = () => {
      context = useContext(StoreContext);
      return null;
    };
    const component = mount(<Store initialData={data => ({ something: `${data.something}blah` })}><Component /></Store>);
    const storeId = context[Store[StoreTypeId]];
    const store = stores[storeId];
    expect(store.data).to.eql({ something: 'elseblah' });
    component.unmount();
  });

  it('allows handling changes in the store', () => {
    const Store = createTestStore();
    let onChangedCallCount = 0;
    let newData;
    const Component: FunctionComponent = () => {
      const [, { changeSomethingTo }] = useStore(Store);
      changeSomethingTo('blah');
      return null;
    };
    const handleChanged = data => {
      onChangedCallCount++;
      newData = data;
    };
    const component = mount(<Store onChanged={handleChanged}><Component /></Store>);
    expect(onChangedCallCount).to.eq(1);
    expect(newData).to.eql({ something: 'blah' });
    component.unmount();
  });

  // it('handles changes and they get updated correctly', () => {
  //   const testStore = createTestStore({
  //     something: 'else',
  //   }, update => ({
  //     changeSomethingTo: (something: string) => update({ something }),
  //   }));

  //   expect(testStore.data.something).to.eql('else');
  //   expect(testStore.callbackCount).to.eq(0);
  //   testStore.actions.changeSomethingTo('blah');
  //   expect(testStore.data.something).to.eq('blah');
  //   expect(testStore.callbackCount).to.eq(1);
  // });

  // it('handles updates that don\'t actually change the data', () => {
  //   const testStore = createTestStore({
  //     something: 'else',
  //   }, update => ({
  //     changeSomethingTo: (something: string) => update({ something }),
  //   }));

  //   expect(testStore.data.something).to.eql('else');
  //   expect(testStore.callbackCount).to.eq(0);
  //   testStore.actions.changeSomethingTo('else');
  //   expect(testStore.data.something).to.eq('else');
  //   expect(testStore.callbackCount).to.eq(0);
  // });

  // it('handles deeply nested data updates that don\'t actually change the data', () => {
  //   const testStore = createTestStore({
  //     something: {
  //       blah: {
  //         text: 'else',
  //       },
  //     },
  //   }, update => ({
  //     changeSomethingTo: (text: string) => update({ something: { blah: { text } } }),
  //   }));

  //   expect(testStore.data.something.blah.text).to.eql('else');
  //   expect(testStore.callbackCount).to.eq(0);
  //   testStore.actions.changeSomethingTo('else');
  //   expect(testStore.data.something.blah.text).to.eq('else');
  //   expect(testStore.callbackCount).to.eq(0);
  // });

  // it('can handle changing the data during a callback and only calls the callbacks once', () => {
  //   const testStore = createTestStore({
  //     something: {
  //       blah: {
  //         text: 'else',
  //       },
  //     },
  //   }, update => ({
  //     changeSomethingTo: (text: string) => update({ something: { blah: { text } } }),
  //   }), () => {
  //     testStore.actions.changeSomethingTo('more');
  //   });

  //   expect(testStore.data.something.blah.text).to.eql('else');
  //   expect(testStore.callbackCount).to.eq(0);
  //   testStore.actions.changeSomethingTo('blah');
  //   expect(testStore.data.something.blah.text).to.eq('more');
  //   expect(testStore.callbackCount).to.eq(1);
  // });

  // it('can handle changing the data during a callback and will call callbacks again if they have already been called before the change occurs', () => {
  //   const testStore = createTestStore({
  //     something: {
  //       blah: {
  //         text: 'else',
  //       },
  //     },
  //   }, update => ({
  //     changeSomethingTo: (text: string) => update({ something: { blah: { text } } }),
  //   }), () => {
  //     testStore.actions.changeSomethingTo('more');
  //   }, true);

  //   expect(testStore.data.something.blah.text).to.eql('else');
  //   expect(testStore.callbackCount).to.eq(0);
  //   testStore.actions.changeSomethingTo('blah');
  //   expect(testStore.data.something.blah.text).to.eq('more');
  //   expect(testStore.callbackCount).to.eq(2);
  // });

  // it('handles having callbacks removed when calling the callbacks', () => {
  //   const testStore = createTestStore({
  //     something: 'else',
  //   }, update => ({
  //     changeSomethingTo: (something: string) => update({ something }),
  //   }), () => {
  //     testStore.dispose();
  //   });

  //   expect(testStore.data.something).to.eql('else');
  //   expect(testStore.callbackCount).to.eq(0);
  //   testStore.actions.changeSomethingTo('blah');
  //   expect(testStore.data.something).to.eql('else');
  //   expect(testStore.callbackCount).to.eq(0);
  // });

});
