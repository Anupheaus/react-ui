import { mount } from 'enzyme';
import { FunctionComponent, useContext } from 'react';
import { StoreTypeId } from './models';
import { StoreContext } from './context';
import { createProvider } from './provider';
import { Store } from './store';

describe('useStore - provider', () => {

  function createTestProvider(withOnLoading = true, withError = false, withChild = true) {
    const data = {
      something: 'else',
    };
    const TestProvider = createProvider(data, class extends Store<typeof data> {

      protected async load(): Promise<void> {
        if (withError) { throw new Error('something'); }
        result.loadCallCount++;
      }

    });

    const result = {
      TestProvider,
      storeData: null as typeof TestProvider.dataType,
      actions: null as typeof TestProvider.actionsType,
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

    let props: typeof TestProvider['defaultProps'] = {};

    if (withOnLoading) {
      props = { ...props, onLoading: handleLoading };
    }
    if (withError) {
      props = { ...props, onError: handleError };
    }
    const component = mount(<TestProvider {...props}>{withChild ? <Component /> : null}</TestProvider>);

    result.dispose = () => {
      component.unmount();
    };

    return result;
  }

  it('a store component can be created and destroyed', () => {
    const { TestProvider, dispose } = createTestProvider();
    expect(TestProvider).to.be.a('function');
    expect(TestProvider[StoreTypeId]).to.be.a('string').with.lengthOf(36);
    dispose();
  });

  it('does call the load function in the store definition', () => {
    const { loadCallCount, dispose } = createTestProvider();
    expect(loadCallCount).to.eq(1);
    dispose();
  });

  it('calls the handle error function if the load has an error', async () => {
    const result = createTestProvider(true, true);
    await Promise.delay(0); // wait for everything to be completed
    expect(result.onErrorCount).to.eq(1);
    result.dispose();
  });

  it('handles no children', async () => {
    const result = createTestProvider(true, false, false);
    expect(result.refreshCallCount).to.eq(0);
    result.dispose();
  });

  // it('creates a context with the store type id and the store id', () => {
  //   const { context, TestStore, dispose } = createTestStore();
  //   const storeTypeId = TestStore[StoreTypeId];
  //   expect(context).to.have.property(storeTypeId).and.have.lengthOf(36);
  //   dispose();
  // });

});
