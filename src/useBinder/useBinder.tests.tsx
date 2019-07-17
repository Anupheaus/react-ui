import { anuxPureFunctionComponent, anuxFunctionComponent } from '../anuxComponents';
import { useBinder } from './useBinder';
import { mount } from 'enzyme';
import { useLooper } from '../useLooper';
import { useSharedHookState } from '../useSharedHookState';

describe('useBinder', () => {

  interface IProps {
    onBoundFuncsCreated(boundFuncA: () => number, boundFuncB: () => number): void;
  }

  const TestComponent = anuxPureFunctionComponent<IProps>('TestComponent', ({ onBoundFuncsCreated }) => {
    const sharedHookState = useSharedHookState();
    const bind = useBinder(sharedHookState);

    onBoundFuncsCreated(bind(() => 1), bind(() => 2));

    return null;
  });

  it('returns the same function each time', () => {
    let boundFuncA: () => number = () => null;
    let boundFuncB: () => number = () => null;
    let countOfSavingBoundFuncs = 0;
    const saveBoundFuncs = (innerBoundFuncA: typeof boundFuncA, innerBoundFuncB: typeof boundFuncB) => {
      countOfSavingBoundFuncs++;
      boundFuncA = innerBoundFuncA;
      boundFuncB = innerBoundFuncB;
    };
    const component = mount(<TestComponent
      onBoundFuncsCreated={saveBoundFuncs}
    />);

    expect(countOfSavingBoundFuncs).to.eq(1);
    expect(boundFuncA()).to.eq(1);
    expect(boundFuncB()).to.eq(2);
    const oldBoundFuncA = boundFuncA;
    const oldBoundFuncB = boundFuncB;
    component.setProps({ index: 0 });
    expect(countOfSavingBoundFuncs).to.eq(2);
    expect(boundFuncA()).to.eq(1);
    expect(boundFuncB()).to.eq(2);
    expect(boundFuncA).to.eq(oldBoundFuncA);
    expect(boundFuncB).to.eq(oldBoundFuncB);
    component.unmount();
  });

  // it('warns if the bind has been called more than once per render', () => {
  //   const SubComponent = anuxPureFunctionComponent<{
  //     doSomething(): void;
  //     doSomethingElse(): void;
  //   }>('SubComponent', () => {
  //     return null;
  //   });

  //   const WrapperComponent = anuxPureFunctionComponent<{
  //     children(): ReactElement;
  //   }>('WrapperComponent', ({
  //     children,
  //   }) => {
  //     // call twice
  //     children();
  //     return children();
  //   });

  //   const Component = anuxPureFunctionComponent('Component', () => {
  //     const bind = useBinder();

  //     return (
  //       <WrapperComponent>
  //         {bind(() => (
  //           <SubComponent
  //             doSomething={bind(() => void 0)}
  //             doSomethingElse={bind(() => void 0)}
  //           />
  //         ))}
  //       </WrapperComponent>
  //     );
  //   });

  //   expect(hasRaisedWarning).to.be.false;
  //   const component = mount(<Component />);
  //   expect(hasRaisedWarning).to.be.true;

  //   component.unmount();
  // });

  // it('does not warn if the bind has been called more than once per render if the allowMultipleCalls option is set', () => {
  //   const SubComponent = anuxPureFunctionComponent<{
  //     doSomething(): void;
  //     doSomethingElse(): void;
  //   }>('SubComponent', () => {
  //     return null;
  //   });

  //   const WrapperComponent = anuxPureFunctionComponent<{
  //     children(): ReactElement;
  //   }>('WrapperComponent', ({
  //     children,
  //   }) => {
  //     // call twice
  //     children();
  //     return children();
  //   });

  //   const Component = anuxPureFunctionComponent('Component', () => {
  //     const bind = useBinder();

  //     return (
  //       <WrapperComponent>
  //         {bind(() => (
  //           <SubComponent
  //             doSomething={bind(() => void 0, { allowMultipleCalls: 2 })}
  //             doSomethingElse={bind(() => void 0, { allowMultipleCalls: true })}
  //           />
  //         ))}
  //       </WrapperComponent>
  //     );
  //   });

  //   expect(hasRaisedWarning).to.be.false;
  //   const component = mount(<Component />);
  //   expect(hasRaisedWarning).to.be.false;

  //   component.unmount();
  // });

  it('works with multiple uses', () => {
    let invokeMethods: () => void = null;
    let methodACallCount = 0;
    let methodBCallCount = 0;

    const SubComponent = anuxPureFunctionComponent<{
      methodA(): void;
      methodB(): void;
    }>('ItemComponent', ({
      methodA,
      methodB,
    }) => {
      invokeMethods = () => {
        methodA();
        methodB();
      };
      return null;
    });

    const Component = anuxPureFunctionComponent('Component', () => {
      const bind = useBinder(useSharedHookState());

      return (
        <div>
          <SubComponent
            methodA={bind(() => { methodACallCount++; })}
            methodB={bind(() => { methodBCallCount++; })}
          />
        </div>
      )
    });

    const component = mount(<Component />);
    expect(methodACallCount).to.eq(0);
    expect(methodBCallCount).to.eq(0);
    invokeMethods();
    expect(methodACallCount).to.eq(1);
    expect(methodBCallCount).to.eq(1);
    invokeMethods();
    expect(methodACallCount).to.eq(2);
    expect(methodBCallCount).to.eq(2);
    component.unmount();
  });

  it('works with an array', () => {
    let itemRenderCount = 0;
    let renderInstances: (() => void)[] = [];
    const ItemComponent = anuxFunctionComponent<{ render(): void; }>('ItemComponent', ({ // deliberately used non-pure function here
      render,
    }) => {
      itemRenderCount++;
      renderInstances.push(render);
      return null;
    });

    const Component = anuxPureFunctionComponent<{ something?: string; }>('Component', () => {
      const items = ['one', 'two', 'three', 'four'];
      const sharedHookState = useSharedHookState();
      const loop = useLooper(sharedHookState);
      const bind = useBinder(sharedHookState);

      return (
        <div>
          {loop(items, (_ignore, key) => {
            return (
              <ItemComponent key={key} render={bind(() => void 0)} />
            );
          })}
        </div>
      )
    });

    const component = mount(<Component />);
    expect(itemRenderCount).to.eq(4);
    expect(renderInstances).to.be.an('array').with.lengthOf(4);
    component.setProps({ something: 'else' });
    expect(itemRenderCount).to.eq(8);
    expect(renderInstances).to.be.an('array').with.lengthOf(8);
    for (let index = 0; index < 4; index++) { expect(renderInstances[index]).to.eq(renderInstances[index + 4]); }
    component.unmount();
  });

});
