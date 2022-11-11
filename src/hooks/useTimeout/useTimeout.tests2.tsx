// import { mount } from 'enzyme';
// import { useTimeout } from './useTimeout';
// import { anuxFC } from '../../anuxComponents';
// import { useFakeTimers, SinonFakeTimers } from 'sinon';

// describe('useTimeout', () => {

//   interface Props {
//     refreshCount: number;
//     cancel: VoidFunction;
//     timeoutTriggerCount: number;
//     dispose: VoidFunction;
//     clock: SinonFakeTimers;
//   }

//   function test(description: string, timeout: number, options: Parameters<typeof useTimeout>[2], delegate: (props: Props) => Promise<void>): void {
//     it(description, async () => {
//       const props = {
//         refreshCount: 0,
//         cancel: undefined as unknown as VoidFunction,
//         timeoutTriggerCount: 0,
//         dispose: undefined as unknown as VoidFunction,
//         clock: useFakeTimers(),
//       };
//       let hasBeenUnmounted = false;

//       const Component = anuxFC('Component', () => {
//         props.refreshCount++;
//         props.cancel = useTimeout(() => {
//           props.timeoutTriggerCount++;
//         }, timeout, options);
//         return (<div></div>);
//       });

//       const component = mount(<Component />);

//       props.dispose = () => {
//         if (hasBeenUnmounted) return;
//         hasBeenUnmounted = true;
//         component.unmount();
//       };

//       await delegate(props);

//       props.clock.restore();

//       props.dispose();

//     });
//   }

//   test('can create a timeout', 5, {}, async props => {
//     expect(props.timeoutTriggerCount).to.eq(0);
//     expect(props.refreshCount).to.eq(1);
//     props.clock.tick(6);
//     expect(props.timeoutTriggerCount).to.eq(1);
//     expect(props.refreshCount).to.eq(1);
//   });

//   test('timeout is not called if component is disposed before being triggered', 5, {}, async props => {
//     expect(props.timeoutTriggerCount).to.eq(0);
//     expect(props.refreshCount).to.eq(1);
//     props.dispose();
//     props.clock.tick(6);
//     expect(props.timeoutTriggerCount).to.eq(0);
//     expect(props.refreshCount).to.eq(1);
//   });

//   test('can be triggered on unmount if required', 5, { triggerOnUnmount: true }, async props => {
//     expect(props.timeoutTriggerCount).to.eq(0);
//     expect(props.refreshCount).to.eq(1);
//     props.dispose();
//     expect(props.timeoutTriggerCount).to.eq(1);
//     expect(props.refreshCount).to.eq(1);
//     props.clock.tick(6);
//     expect(props.timeoutTriggerCount).to.eq(1);
//     expect(props.refreshCount).to.eq(1);
//   });

//   test('can be manually cancelled', 5, {}, async props => {
//     expect(props.timeoutTriggerCount).to.eq(0);
//     expect(props.refreshCount).to.eq(1);
//     props.cancel();
//     expect(props.timeoutTriggerCount).to.eq(0);
//     expect(props.refreshCount).to.eq(1);
//     props.clock.tick(6);
//     expect(props.timeoutTriggerCount).to.eq(0);
//     expect(props.refreshCount).to.eq(1);
//     props.dispose();
//   });

// });
