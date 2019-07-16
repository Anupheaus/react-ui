import { anuxPureFunctionComponent } from '../anuxComponents';
import { useInlineMemo } from './useInlineMemo';
import { mount } from 'enzyme';
import { useLooper } from '../useLooper';
import { useSharedHookState } from '../useSharedHookState';

describe('useInlineMemo', () => {

  interface IProps {
    dependencies: any[];
    calculation(): number;
    onRender(): void;
  }

  const TestComponent = anuxPureFunctionComponent<IProps>('TestComponent', ({ calculation, dependencies, onRender }) => {
    const sharedHookState = useSharedHookState();
    const memo = useInlineMemo(sharedHookState);

    onRender();

    return (
      <div>{memo(calculation, dependencies)}</div>
    );
  });

  it('returns the same value each time without any dependencies', () => {
    let calculationCount = 0;
    let returnValue = 10;
    let renderCount = 0;
    const component = mount(<TestComponent
      calculation={() => {
        calculationCount++;
        return returnValue;
      }}
      dependencies={Array.empty()}
      onRender={() => { renderCount++; }}
    />);

    expect(component.text()).to.eq('10');
    expect(calculationCount).to.eq(1);
    expect(renderCount).to.eq(1);
    returnValue = 20;
    component.setProps({ something: 'else' });
    expect(component.text()).to.eq('10');
    expect(calculationCount).to.eq(1);
    expect(renderCount).to.eq(2);
    component.unmount();
  });

  it('recalculates with new dependencies', () => {
    let calculationCount = 0;
    let returnValue = 10;
    let renderCount = 0;
    const component = mount(<TestComponent
      calculation={() => {
        calculationCount++;
        return returnValue;
      }}
      dependencies={Array.empty()}
      onRender={() => { renderCount++; }}
    />);

    expect(component.text()).to.eq('10');
    expect(calculationCount).to.eq(1);
    expect(renderCount).to.eq(1);
    returnValue = 20;
    component.setProps({ dependencies: [20] });
    expect(component.text()).to.eq('20');
    expect(calculationCount).to.eq(2);
    expect(renderCount).to.eq(2);
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
    let calculationCount = 0;

    const ItemComponent = anuxPureFunctionComponent<{ something: string; render: string; }>('ItemComponent', ({
      render,
    }) => {
      itemRenderCount++;
      return (
        <div>{render}</div>
      );
    });

    const Component = anuxPureFunctionComponent<{ something?: string; indexStart?: number; }>('Component', ({
      something,
      indexStart = 1,
    }) => {
      const items = ['one', 'two', 'three', 'four'];
      const sharedHookState = useSharedHookState();
      const loop = useLooper(sharedHookState);
      const memo = useInlineMemo(sharedHookState);


      return (
        <div>
          {loop(items, (item, key, index) => {
            return (
              <ItemComponent key={key} something={something} render={memo(() => {
                calculationCount++;
                return `${item} - ${index + indexStart}`;
              }, [indexStart])} />
            );
          })}
        </div>
      )
    });

    const component = mount(<Component />);
    expect(component.text()).to.eq('one - 1two - 2three - 3four - 4');
    expect(itemRenderCount).to.eq(4);
    expect(calculationCount).to.eq(4);
    component.setProps({ something: 'else' });
    expect(component.text()).to.eq('one - 1two - 2three - 3four - 4');
    expect(itemRenderCount).to.eq(8);
    expect(calculationCount).to.eq(4);
    component.setProps({ indexStart: 2 });
    expect(component.text()).to.eq('one - 2two - 3three - 4four - 5');
    expect(itemRenderCount).to.eq(12);
    expect(calculationCount).to.eq(8);
    component.unmount();
  });

});
