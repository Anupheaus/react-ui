import { anuxPureFunctionComponent } from '../anuxComponents';
import { useBinder } from './useBinder';
import { mount } from 'enzyme';

describe('useBinder', () => {

  interface IProps {
    onBoundFuncsCreated(boundFuncA: () => number, boundFuncB: () => number): void;
  }

  const TestComponent = anuxPureFunctionComponent<IProps>('TestComponent', ({ onBoundFuncsCreated }) => {
    const bind = useBinder();

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

  it('works with an array', () => {
    let itemRenderCount = 0;
    const ItemComponent = anuxPureFunctionComponent<{ render(): string; }>('ItemComponent', ({
      render,
    }) => {
      itemRenderCount++;
      return (
        <div>{render()}</div>
      );
    });

    const Component = anuxPureFunctionComponent<{ something?: string; indexStart?: number; }>('Component', ({
      indexStart = 1,
    }) => {
      const items = ['one', 'two', 'three', 'four'];
      const bind = useBinder();

      return (
        <div>
          {bind.withinArray(items, (item, key, index) => (
            <ItemComponent key={key} render={bind(() => `${item} - ${index + indexStart}`, [indexStart])} />
          ))}
        </div>
      )
    });

    const component = mount(<Component />);
    expect(component.text()).to.eq('one - 1two - 2three - 3four - 4');
    expect(itemRenderCount).to.eq(4);
    component.setProps({ something: 'else' });
    expect(component.text()).to.eq('one - 1two - 2three - 3four - 4');
    expect(itemRenderCount).to.eq(4);
    component.setProps({ indexStart: 2 });
    expect(component.text()).to.eq('one - 2two - 3three - 4four - 5');
    expect(itemRenderCount).to.eq(8);
    component.unmount();
  });

});
