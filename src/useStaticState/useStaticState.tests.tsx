import { FunctionComponent } from 'react';
import { mount, ReactWrapper } from 'enzyme';
import { useStaticState, SetStaticState } from './useStaticState';

interface IStaticState {
  something: string;
  boo: boolean;
  myVal: number;
}

function createTest() {
  const testState = {
    state: undefined as IStaticState,
    setState: undefined as SetStaticState<IStaticState>,
    component: undefined as ReactWrapper<any, Readonly<{}>, React.Component<{}, {}, any>>,
    renderCount: 0,
  };
  const Component: FunctionComponent = () => {
    const [state, setState] = useStaticState<IStaticState>({
      something: 'else',
      boo: true,
      myVal: 5,
    });
    testState.state = state;
    testState.setState = setState;
    testState.renderCount++;
    return null;
  };

  testState.component = mount((
    <Component />
  ));

  return testState;
}

describe('useStaticState', () => {

  it('returns the initial state correctly', () => {
    const test = createTest();
    expect(test.renderCount).to.eq(1);
    expect(test.state).to.eql({ something: 'else', boo: true, myVal: 5 });
    expect(test.setState).to.be.a('function');
    test.component.unmount();
  });

  it('cannot be set directly on the state', () => {
    const test = createTest();
    expect(() => {
      test.state.something = 'hey';
    }).to.throw('Cannot set property something of #<Object> which has only a getter');
  });

  it('can be changed via setState by partial object', () => {
    const test = createTest();
    expect(test.state.myVal).to.eq(5);
    test.setState({ myVal: 10 });
    expect(test.state.myVal).to.eq(10);
    expect(test.renderCount).to.eq(1);
  });

  it('can be changed via setState by delegate', () => {
    const test = createTest();
    expect(test.state.myVal).to.eq(5);
    test.setState(s => ({ ...s, myVal: 10 }));
    expect(test.state.myVal).to.eq(10);
    expect(test.renderCount).to.eq(1);
  });

  it('proxy object instance does not change when using setState', () => {
    const test = createTest();
    const proxy = test.state;
    test.setState({ myVal: 10 });
    expect(test.state).to.eq(proxy);
  });

  it('can remove a property from the state', () => {
    const test = createTest();
    test.setState(({ myVal, ...rest }) => rest as any);
    expect(test.state).to.eql({ something: 'else', boo: true });
  });

});
