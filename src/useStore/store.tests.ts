import { Store } from './store';

describe('useStore - store', () => {

  it('can be created', () => {
    const store = new Store({ something: 'else' });
    expect(store['storeId']).to.be.a('string').with.lengthOf(36);
    expect(store['getData']()).to.eql({ something: 'else' });
    store['updateData']({ something: 'more' });
    expect(store['getData']()).to.eql({ something: 'more' });
    store['dispose']();
  });

  it('can register a callback and have it invoked when the data is changed', () => {
    const store = new Store({ something: 'else' });
    let callbackInvocationCalls = 0;
    const unsubscribe = store['registerOnUpdateCallback'](data => {
      expect(data).to.eql({ something: 'more' });
      callbackInvocationCalls++;
    });
    expect(callbackInvocationCalls).to.eq(0);
    store['updateData']({ something: 'more' });
    expect(callbackInvocationCalls).to.eq(1);
    unsubscribe();
    store['dispose']();
  });

  it('does not call callback if the data is not changed', () => {
    const store = new Store({ something: 'else' });
    let callbackInvocationCalls = 0;
    const unsubscribe = store['registerOnUpdateCallback'](() => {
      callbackInvocationCalls++;
    });
    store['updateData']({ something: 'more' }); // calls the callback
    expect(callbackInvocationCalls).to.eq(1);
    store['updateData']({ something: 'more' }); // does not call the callback
    expect(callbackInvocationCalls).to.eq(1);
    unsubscribe();
    store['dispose']();
  });

  it('handles changes within the callbacks and does not loop', () => {
    const store = new Store({ something: 'else' });
    let callbackInvocationCalls1 = 0;
    let callbackInvocationCalls2 = 0;
    let callbackInvocationCalls3 = 0;
    store['registerOnUpdateCallback'](() => {
      callbackInvocationCalls1++;
    });
    store['registerOnUpdateCallback'](() => {
      callbackInvocationCalls2++;
      store['updateData']({ something: 'blah' }); // overrides the update
    });
    store['registerOnUpdateCallback'](() => {
      callbackInvocationCalls3++;
    });
    store['updateData']({ something: 'more' });
    expect(store['getData']()).to.eql({ something: 'blah' });
    expect(callbackInvocationCalls1).to.eq(2); // will be done twice because it was done before an update occurred, so it will be done again after the update
    expect(callbackInvocationCalls2).to.eq(1);
    expect(callbackInvocationCalls3).to.eq(1);
    store['dispose']();
  });

  it('can unsubscribe from a callback', () => {
    const store = new Store({ something: 'else' });
    let callbackInvocationCalls = 0;
    const unsubscribe = store['registerOnUpdateCallback'](() => {
      callbackInvocationCalls++;
    });
    store['updateData']({ something: 'more' }); // calls the callback
    expect(callbackInvocationCalls).to.eq(1);
    unsubscribe();
    store['updateData']({ something: 'blah' }); // does not call the callback because the callback has been unsubscribed
    expect(callbackInvocationCalls).to.eq(1);
    store['dispose']();
  });

  it('handles being unsubscribed from within a callback', () => {
    const store = new Store({ something: 'else' });
    let callbackInvocationCalls1 = 0;
    let callbackInvocationCalls2 = 0;
    store['registerOnUpdateCallback'](() => {
      callbackInvocationCalls1++;
      unsubscribe2();
    });
    const unsubscribe2 = store['registerOnUpdateCallback'](() => {
      callbackInvocationCalls2++;
    });
    store['updateData']({ something: 'more' });
    expect(callbackInvocationCalls1).to.eq(1);
    expect(callbackInvocationCalls2).to.eq(0); // is never called
    store['dispose']();
  });

  it('can be disposed', () => {
    const store = new Store({ something: 'else' });
    store['dispose']();
    expect(() => { store['updateData']({ something: 'more' }); }).to.throw();
    expect(() => { store['getData'](); }).to.throw();
    expect(() => { store['dispose'](); }).to.throw();
    expect(() => { store['registerOnUpdateCallback'](() => void 0); }).to.throw();
  });

  it('handles subscribers that unsubscribe after dispose', () => {
    const store = new Store({ something: 'else' });
    const unsubscribe = store['registerOnUpdateCallback'](() => void 0);
    store['dispose']();
    expect(() => unsubscribe()).not.to.throw();
  });

});
