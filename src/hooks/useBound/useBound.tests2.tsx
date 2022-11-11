// import { mount } from 'enzyme';
// import { useBound } from './useBound';
// import { anuxFC } from '../../anuxComponents';

// interface Props {
//   value: number;
//   onGetValue(getValue: () => number): void;
//   onRendered(): void;
// }

// const TestComponent = anuxFC<Props>('TestComponent', ({
//   value,
//   onGetValue,
//   onRendered,
// }) => {
//   const getValue = useBound(() => value);
//   onGetValue(getValue);
//   onRendered();

//   return (
//     <div></div>
//   );
// });

// interface TestProps {
//   renderCount: number;
//   setValue(value: number): void;
//   getValue(): number;
//   unmount(): void;
// }

// function test(name: string, delegate: (props: TestProps) => void): void {
//   let hasUnmounted = false;
//   it(name, () => {
//     const props = { renderCount: 0 } as TestProps;
//     const component = mount<Props>(<TestComponent
//       value={0}
//       onGetValue={newGetValue => { props.getValue = newGetValue; }}
//       onRendered={() => props.renderCount++}
//     />);
//     props.setValue = value => component.setProps({ value });
//     props.unmount = () => {
//       hasUnmounted = true;
//       component.unmount();
//     };
//     delegate(props);
//     if (!hasUnmounted) { component.unmount(); }
//   });
// }

// describe('useBound', () => {

//   test('returns the same function every time', props => {
//     const firstGetFunc = props.getValue;
//     expect(props.getValue()).to.eq(0);
//     expect(props.renderCount).to.eq(1);
//     props.setValue(1);

//     const secondGetFunc = props.getValue;
//     expect(props.getValue()).to.eq(1);
//     expect(props.renderCount).to.eq(2);
//     expect(secondGetFunc).to.eq(firstGetFunc);
//   });

//   test('continues to work even after unmounted by default', props => {
//     props.setValue(100);
//     props.unmount();
//     expect(props.getValue()).to.eq(100);
//   });

// });
