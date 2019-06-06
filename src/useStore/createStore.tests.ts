import { createStore } from './createStore';
import { IInternalStore } from './models';
import { IMap, DeepPartial } from 'anux-common';

describe('useStore - createStore', () => {

  interface ITestStoreResult<TData extends IMap, TActions extends IMap> {
    data: TData;
    actions: TActions;
    callbackCount: number;
    dispose(): void;
  }

  function createTestStore<TData extends IMap, TActions extends IMap>(data: TData, actions: (upsert: (data: DeepPartial<TData>) => void) => TActions,
    callback?: (data: TData) => void, reverseCallbackOrder: boolean = false): ITestStoreResult<TData, TActions> {
    const store = createStore<TData, TActions>(data, actions);

    const internalStore = store as IInternalStore<TData, TActions>;

    const result: ITestStoreResult<TData, TActions> = {
      data: store.data,
      actions: store.actions,
      callbackCount: 0,
      dispose: undefined,
    };

    let unregisterCallback1: () => void;
    let unregisterCallback2: () => void;

    const registerCallback1 = () => { unregisterCallback1 = internalStore.registerCallback(newData => { if (callback) { callback(newData); } }); };
    const registerCallback2 = () => { unregisterCallback2 = internalStore.registerCallback(newData => { result.callbackCount++; result.data = newData; }); };
    if (reverseCallbackOrder) {
      registerCallback2();
      registerCallback1();
    } else {
      registerCallback1();
      registerCallback2();
    }

    result.dispose = () => {
      unregisterCallback1();
      unregisterCallback2();
    };

    return result;
  }

  it('a store can be created and contains all the right data and actions', () => {
    const testStore = createTestStore({
      something: 'else',
    }, update => ({
      changeSomethingTo: (something: string) => update({ something }),
    }));

    expect(testStore.data).to.be.an('object');
    expect(testStore.data.something).to.eql('else');
    expect(testStore.actions).to.be.an('object');
    expect(testStore.actions.changeSomethingTo).to.be.a('function');
    expect(testStore.callbackCount).to.eq(0);
    testStore.actions.changeSomethingTo('blah');
    expect(testStore.data.something).to.eq('blah');
    expect(testStore.callbackCount).to.eq(1);
    testStore.dispose();
  });

  it('handles changes and they get updated correctly', () => {
    const testStore = createTestStore({
      something: 'else',
    }, update => ({
      changeSomethingTo: (something: string) => update({ something }),
    }));

    expect(testStore.data.something).to.eql('else');
    expect(testStore.callbackCount).to.eq(0);
    testStore.actions.changeSomethingTo('blah');
    expect(testStore.data.something).to.eq('blah');
    expect(testStore.callbackCount).to.eq(1);
  });

  it('handles updates that don\'t actually change the data', () => {
    const testStore = createTestStore({
      something: 'else',
    }, update => ({
      changeSomethingTo: (something: string) => update({ something }),
    }));

    expect(testStore.data.something).to.eql('else');
    expect(testStore.callbackCount).to.eq(0);
    testStore.actions.changeSomethingTo('else');
    expect(testStore.data.something).to.eq('else');
    expect(testStore.callbackCount).to.eq(0);
  });

  it('handles deeply nested data updates that don\'t actually change the data', () => {
    const testStore = createTestStore({
      something: {
        blah: {
          text: 'else',
        },
      },
    }, update => ({
      changeSomethingTo: (text: string) => update({ something: { blah: { text } } }),
    }));

    expect(testStore.data.something.blah.text).to.eql('else');
    expect(testStore.callbackCount).to.eq(0);
    testStore.actions.changeSomethingTo('else');
    expect(testStore.data.something.blah.text).to.eq('else');
    expect(testStore.callbackCount).to.eq(0);
  });

  it('can handle changing the data during a callback and only calls the callbacks once', () => {
    const testStore = createTestStore({
      something: {
        blah: {
          text: 'else',
        },
      },
    }, update => ({
      changeSomethingTo: (text: string) => update({ something: { blah: { text } } }),
    }), () => {
      testStore.actions.changeSomethingTo('more');
    });

    expect(testStore.data.something.blah.text).to.eql('else');
    expect(testStore.callbackCount).to.eq(0);
    testStore.actions.changeSomethingTo('blah');
    expect(testStore.data.something.blah.text).to.eq('more');
    expect(testStore.callbackCount).to.eq(1);
  });

  it('can handle changing the data during a callback and will call callbacks again if they have already been called before the change occurs', () => {
    const testStore = createTestStore({
      something: {
        blah: {
          text: 'else',
        },
      },
    }, update => ({
      changeSomethingTo: (text: string) => update({ something: { blah: { text } } }),
    }), () => {
      testStore.actions.changeSomethingTo('more');
    }, true);

    expect(testStore.data.something.blah.text).to.eql('else');
    expect(testStore.callbackCount).to.eq(0);
    testStore.actions.changeSomethingTo('blah');
    expect(testStore.data.something.blah.text).to.eq('more');
    expect(testStore.callbackCount).to.eq(2);
  });

  it('handles having callbacks removed when calling the callbacks', () => {
    const testStore = createTestStore({
      something: 'else',
    }, update => ({
      changeSomethingTo: (something: string) => update({ something }),
    }), () => {
      testStore.dispose();
    });

    expect(testStore.data.something).to.eql('else');
    expect(testStore.callbackCount).to.eq(0);
    testStore.actions.changeSomethingTo('blah');
    expect(testStore.data.something).to.eql('else');
    expect(testStore.callbackCount).to.eq(0);
  });

});
