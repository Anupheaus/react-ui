import { mount } from 'enzyme';
import { FunctionComponent, useContext } from 'react';
import { defineStore } from './defineStore';
import { StoreTypeId } from './models';
import { StoreContext } from './context';

describe('useStore - defineStore', () => {

  // interface ITestStoreResult<TData extends IMap, TActions extends IMap> {
  //   data: TData;
  //   actions: TActions;
  //   callbackCount: number;
  //   dispose(): void;
  // }

  function createTestStore() {
    const TestStore = defineStore()
      .data({
        something: 'else',
      })
      .actions(base => class extends base {

        public changeSomethingTo(something: string): void {
          this.updateData({ something });
        }

        protected async load(): Promise<void> {
          result.loadCallCount++;
        }

      })
      .create();

    const result = {
      TestStore,
      storeData: null as typeof TestStore.dataType,
      actions: null as typeof TestStore.actionsType,
      loadCallCount: 0,
      refreshCallCount: 0,
      loadingCallCount: 0,
      onErrorCount: 0,
      context: null,
      dispose: undefined as () => void,
    };

    const Component: FunctionComponent = ({ }) => {
      result.context = useContext(StoreContext);
      result.refreshCallCount++;
      return null;
    };

    const handleLoading = () => {
      result.loadingCallCount++;
      return null;
    };

    const handleError = () => {
      result.onErrorCount++;
      return null;
    };

    const component = mount(<TestStore onLoading={handleLoading} onError={handleError}><Component /></TestStore>);

    result.dispose = () => {
      component.unmount();
    };

    return result;
  }

  it('a store component can be created and destroyed', () => {
    const { TestStore, dispose } = createTestStore();
    expect(TestStore).to.be.a('function');
    expect(TestStore[StoreTypeId]).to.be.a('string').with.lengthOf(36);
    dispose();
  });

  it('does call the load function in the store definition', () => {
    const { loadCallCount, dispose } = createTestStore();
    expect(loadCallCount).to.eq(1);
    dispose();
  });

  it('creates a context with the store type id and the store id', () => {
    const { context, TestStore, dispose } = createTestStore();
    const storeTypeId = TestStore[StoreTypeId];
    expect(context).to.have.property(storeTypeId).and.have.lengthOf(36);
    dispose();
  });

  // it('creates a context with the store type id and store id', () => {
  //   const Store = createTestStore();
  //   let context: IStoreContext;
  //   const Component: FunctionComponent = () => {
  //     context = useContext(StoreContext);
  //     return null;
  //   };
  //   const component = mount(<Store><Component /></Store>);
  //   expect(context).to.be.an('object');
  //   expect(context[Store[StoreTypeId]]).to.be.a('string').with.lengthOf(36);
  //   component.unmount();
  // });

  // it('creates a store and removes it on unmount too', () => {
  //   const Store = createTestStore();
  //   let context: IStoreContext;
  //   const Component: FunctionComponent = () => {
  //     context = useContext(StoreContext);
  //     return null;
  //   };
  //   const component = mount(<Store><Component /></Store>);
  //   const storeId = context[Store[StoreTypeId]];
  //   expect(stores[storeId]).to.be.an('object').and.an.instanceOf(StoreInstance);
  //   component.unmount();
  //   expect(stores[storeId]).to.be.undefined;
  // });

  // it('creates a store with different data', () => {
  //   const Store = createTestStore();
  //   let context: IStoreContext;
  //   const Component: FunctionComponent = () => {
  //     context = useContext(StoreContext);
  //     return null;
  //   };
  //   const component = mount(<Store initialData={{ something: 'blah' }}><Component /></Store>);
  //   const storeId = context[Store[StoreTypeId]];
  //   const store = stores[storeId];
  //   expect(store.data).to.eql({ something: 'blah' });
  //   component.unmount();
  // });

  // it('creates a store with modified data', () => {
  //   const Store = createTestStore();
  //   let context: IStoreContext;
  //   const Component: FunctionComponent = () => {
  //     context = useContext(StoreContext);
  //     return null;
  //   };
  //   const component = mount(<Store initialData={data => ({ something: `${data.something}blah` })}><Component /></Store>);
  //   const storeId = context[Store[StoreTypeId]];
  //   const store = stores[storeId];
  //   expect(store.data).to.eql({ something: 'elseblah' });
  //   component.unmount();
  // });

  // it('allows handling changes in the store', () => {
  //   const Store = createTestStore();
  //   let onChangedCallCount = 0;
  //   let newData;
  //   const Component: FunctionComponent = () => {
  //     const [, { changeSomethingTo }] = useStore(Store);
  //     changeSomethingTo('blah');
  //     return null;
  //   };
  //   const handleChanged = data => {
  //     onChangedCallCount++;
  //     newData = data;
  //   };
  //   const component = mount(<Store onChanged={handleChanged}><Component /></Store>);
  //   expect(onChangedCallCount).to.eq(1);
  //   expect(newData).to.eql({ something: 'blah' });
  //   component.unmount();
  // });

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
