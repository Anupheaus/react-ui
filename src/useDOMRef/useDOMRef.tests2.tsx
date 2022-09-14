import { ReactElement, RefObject } from 'react';
import { mount, ReactWrapper } from 'enzyme';
import { useDOMRef, HTMLTargetDelegate } from './useDOMRef';
import { anuxFC } from '../anuxComponents';

interface TestPropsWithConfig {
  element?: HTMLElement;
  oldElement?: HTMLElement;
  connectedCallCount: number;
  disconnectedCallCount: number;
  innerRenderCount: number;
  renderCount: number;
  component: ReactWrapper;
}

interface TestPropsWithoutConfig {
  element?: RefObject<HTMLElement>;
  innerRenderCount: number;
  renderCount: number;
  component: ReactWrapper;
}

interface Props {
  something?: string;
  children?(testTarget: HTMLTargetDelegate): ReactElement;
}

// function testWithConfig(name: string, delegate: (testProps: TestPropsWithConfig) => void): void {
//   it(name, () => {
//     const testProps: TestPropsWithConfig = {
//       element: undefined,
//       oldElement: undefined,
//       connectedCallCount: 0,
//       disconnectedCallCount: 0,
//       component: undefined as unknown as ReactWrapper,
//       innerRenderCount: 0,
//       renderCount: 0,
//     };

//     const Component = anuxFC<Props>('Component', ({ children }) => {
//       testProps.renderCount++;
//       const testTarget = useDOMRef({
//         connected: element => { testProps.element = element; testProps.oldElement = undefined; testProps.connectedCallCount++; },
//         disconnected: oldElement => { testProps.element = undefined; testProps.oldElement = oldElement; testProps.disconnectedCallCount++; },
//       });
//       return children?.(testTarget) ?? (<div></div>);
//     });

//     const component = mount((
//       <Component>
//         {target => {
//           testProps.innerRenderCount++;
//           return (
//             <div ref={target}></div>
//           );
//         }}
//       </Component>
//     ));
//     testProps.component = component;
//     delegate(testProps as TestPropsWithConfig);
//     component.unmount();
//   });
// }

// function testWithoutConfig(name: string, delegate: (testProps: TestPropsWithoutConfig) => void): void {
//   it(name, () => {
//     const testProps: TestPropsWithoutConfig = {
//       element: undefined,
//       component: undefined as unknown as ReactWrapper,
//       innerRenderCount: 0,
//       renderCount: 0,
//     };

//     const Component = anuxFC<Props>('Component', ({ children }) => {
//       const [element, target] = useDOMRef();
//       testProps.renderCount++;
//       testProps.element = element;
//       return children?.(target) ?? (<div></div>);
//     });

//     const component = mount((
//       <Component>
//         {target => {
//           testProps.innerRenderCount++;
//           return (
//             <div ref={target}></div>
//           );
//         }}
//       </Component>
//     ));
//     testProps.component = component;
//     delegate(testProps);
//     component.unmount();
//   });
// }

// function test(name: string, withConfig: true, delegate: (testProps: TestPropsWithConfig) => void): void;
// function test(name: string, withConfig: false, delegate: (testProps: TestPropsWithoutConfig) => void): void;
// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// function test(name: string, withConfig: boolean, delegate: (testProps: any) => void): void {
//   if (withConfig) { testWithConfig(name, delegate); } else { testWithoutConfig(name, delegate); }
// }

describe('useDOMRef', () => {

  describe('with config', () => {

    // test('returns the expected values', true, state => {
    //   expect(state.element).not.to.be.undefined;
    //   expect(state.oldElement).to.be.undefined;
    //   expect(state.connectedCallCount).to.eq(1);
    //   expect(state.disconnectedCallCount).to.eq(0);
    //   expect(state.innerRenderCount).to.eq(1);
    //   expect(state.renderCount).to.eq(1);
    //   state.component.setProps({ children: null });
    //   expect(state.element).to.be.undefined;
    //   expect(state.oldElement).not.to.be.undefined;
    //   expect(state.connectedCallCount).to.eq(1);
    //   expect(state.disconnectedCallCount).to.eq(1);
    //   expect(state.innerRenderCount).to.eq(1);
    //   expect(state.renderCount).to.eq(2);
    // });

  });

  describe('without config', () => {

    // test('returns the expected values', false, state => {
    //   expect(state.element?.current).not.to.be.undefined;
    //   expect(state.innerRenderCount).to.eq(1);
    //   expect(state.renderCount).to.eq(1);
    //   state.component.setProps({ children: null });
    //   expect(state.element?.current).to.be.undefined;
    //   expect(state.innerRenderCount).to.eq(1);
    //   expect(state.renderCount).to.eq(2);
    // });

  });

  // it('doesn\'t disconnect and reconnect when a force update is used and always returns the same setElement function', () => {
  //   let setElementFunc: HTMLTargetDelegate;
  //   const state = createTest(setTarget => {
  //     setElementFunc = setTarget;
  //     return (
  //       <div ref={setTarget}></div>
  //     );
  //   });
  //   expect(setElementFunc).to.be.a('function');
  //   const prevSetElementFunc = setElementFunc;
  //   state.component.setProps({ something: 'else' });
  //   expect(prevSetElementFunc).to.eq(setElementFunc);
  //   expect(state).to.eql({
  //     ...state,
  //     connectedCallCount: 1, // should still be 1
  //     disconnectedCallCount: 0,
  //   });
  //   expect(state).to.have.property('element').and.not.to.be.undefined;
  //   state.dispose();
  // });

  // it('calls disconnect when the child is removed', () => {
  //   const state = createTest(setTarget => (<div ref={setTarget}></div>));
  //   state.component.setProps({ children: (() => null) });
  //   expect(state).to.eql({
  //     ...state,
  //     connectedCallCount: 1,
  //     disconnectedCallCount: 1,
  //   });
  //   state.dispose();
  // });

  // it('calls disconnect and re-connect when the child is changed', () => {
  //   const state = createTest(setTarget => (<div ref={setTarget}></div>));
  //   state.component.setProps({ children: (setTarget: HTMLTargetDelegate) => (<span ref={setTarget}></span>) });
  //   expect(state).to.eql({
  //     ...state,
  //     connectedCallCount: 2,
  //     disconnectedCallCount: 1,
  //   });
  //   state.dispose();
  // });

  // it('calls through, but gets immediately returned because the elements are the same', () => {
  //   const state = createTest(setTarget => (<div ref={setTarget} style={{ backgroundColor: 'blue' }}></div>));
  //   state.component.setProps({
  //     children: (setTarget: HTMLTargetDelegate) => (
  //       <div ref={setTarget} style={{ backgroundColor: 'red' }}></div>
  //     ),
  //   });
  //   expect(state).to.eql({
  //     ...state,
  //     connectedCallCount: 1,
  //     disconnectedCallCount: 0,
  //   });
  //   state.dispose();
  // });

  // it('can be used without config', () => {
  //   let elementRef: RefObject<HTMLElement>;
  //   let targetElement: HTMLTargetDelegate;
  //   const Component: FunctionComponent<{ assignTarget: boolean }> = ({ assignTarget }) => {
  //     const [innerElementRef, innerTargetElement] = useDOMRef();
  //     elementRef = innerElementRef;
  //     targetElement = innerTargetElement;
  //     return (<>{assignTarget ? <div ref={innerTargetElement}></div> : null}</>);
  //   };
  //   const component = mount(<Component assignTarget={false} />);
  //   expect(elementRef).to.be.an('object');
  //   expect(elementRef).to.have.property('current').and.be.undefined;
  //   expect(targetElement).to.be.a('function');
  //   component.setProps({ assignTarget: true });
  //   expect(elementRef.current.outerHTML).to.eq('<div></div>');
  //   component.unmount();
  // });

  // it('can nest the delegates', () => {
  //   let elementRef1: RefObject<HTMLElement>;
  //   let elementRef2: RefObject<HTMLElement>;
  //   const Component: FunctionComponent = () => {
  //     const [innerElementRef1, targetElement1] = useDOMRef();
  //     const [innerElementRef2, targetElement2] = useDOMRef();
  //     elementRef1 = innerElementRef1;
  //     elementRef2 = innerElementRef2;
  //     return (<div ref={targetElement1(targetElement2)}></div>);
  //   };
  //   const component = mount(<Component />);
  //   expect(elementRef1).to.be.an('object');
  //   expect(elementRef1).to.have.property('current');
  //   expect(elementRef1.current.outerHTML).to.eq('<div></div>');
  //   expect(elementRef2).to.be.an('object');
  //   expect(elementRef2).to.have.property('current');
  //   expect(elementRef2.current.outerHTML).to.eq('<div></div>');
  //   component.unmount();
  // });

});
