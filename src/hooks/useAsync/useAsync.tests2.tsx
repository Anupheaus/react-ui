// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { ReactElement } from 'react';
// import { mount, ReactWrapper } from 'enzyme';
// import { PromiseMaybe } from '@anupheaus/common';
// import { useAsync, UseAsyncResult, AsyncDelegate } from './useAsync';
// import { anuxPureFC } from '../../anuxComponents';
// import { useFakeTimers, SinonFakeTimers } from 'sinon';

// interface State {
//   triggeredCount: number;
//   renderCount: number;
//   resultsUpdated: number;
//   isLoading: boolean;
//   component: ReactWrapper;
//   hasBeenCancelled: boolean;
//   clock: SinonFakeTimers;
//   response: string[] | undefined;
//   onCancelled(): void;
//   trigger(): Promise<string[]>;
//   dispose(): void;
// }

// interface Props {
//   children(state: UseAsyncResult<AsyncDelegate<string[]>>): ReactElement | null;
// }

// describe('useAsync', () => {

//   function using(delegate: (state: State) => PromiseMaybe<void>): () => Promise<void> {
//     return async () => {
//       let hasDisposed = false;
//       const state: State = {
//         triggeredCount: 0,
//         renderCount: 0,
//         resultsUpdated: 0,
//         isLoading: false,
//         component: undefined as unknown as ReactWrapper,
//         hasBeenCancelled: false,
//         clock: useFakeTimers(),
//         response: undefined,
//         onCancelled: () => void 0,
//         trigger: () => Promise.resolve([]),
//         dispose: () => void 0,
//       };
//       const TestComponent = anuxPureFC<Props>('AsyncTestComponent', ({ children }) => {
//         state.renderCount++;
//         const result = useAsync(async ({ hasBeenCancelled, onCancelled }) => {
//           state.triggeredCount++;
//           state.hasBeenCancelled = hasBeenCancelled();
//           onCancelled(state.onCancelled);
//           await Promise.delay(5);
//           return ['hey'];
//         });
//         return children(result);
//       });
//       state.component = mount(
//         <TestComponent>
//           {({ trigger, response, isBusy }) => {
//             state.resultsUpdated++;
//             state.trigger = trigger;
//             state.isLoading = isBusy;
//             state.response = response;
//             return null;
//           }}
//         </TestComponent>
//       );
//       state.dispose = () => {
//         if (hasDisposed) return;
//         hasDisposed = true;
//         state.component.unmount();
//       };
//       await delegate(state);
//       state.dispose();
//       state.clock.restore();
//     };
//   }

//   it('returns everything it is supposed to do correctly', using(state => {
//     expect(state.renderCount).to.eq(1);
//     expect(state.triggeredCount).to.eq(0);
//     expect(state.resultsUpdated).to.eq(1);
//     expect(state.trigger).to.be.a('function');
//     expect(state.isLoading).to.be.false;
//     expect(state.response).to.be.undefined;
//     expect(state.component).not.to.be.undefined;
//     expect(state.hasBeenCancelled).to.be.false;
//     expect(state.onCancelled).to.be.a('function');
//     expect(state.trigger).to.be.a('function');
//   }));

//   it('can call an async function', using(async state => {
//     expect(state.renderCount).to.eq(1);
//     expect(state.triggeredCount).to.eq(0);
//     const promise = state.trigger();
//     expect(state.triggeredCount).to.eq(1);
//     expect(state.hasBeenCancelled).to.be.false;
//     state.clock.tick(2);
//     expect(state.renderCount).to.eq(2);
//     expect(state.isLoading).to.be.true;
//     expect(state.response).to.be.undefined;
//     state.clock.tick(4);
//     const result = await promise;
//     expect(result).to.eql(['hey']);
//     expect(state.response).to.eql(['hey']);
//     state.clock.tick(1);
//     expect(state.renderCount).to.eq(3);
//     expect(state.isLoading).to.be.false;
//   }));

//   it('will not update if returned after unmounted', using(state => {
//     expect(state.renderCount).to.eq(1);
//     let onCancelledCalled = false;
//     state.onCancelled = () => { onCancelledCalled = true; };
//     state.trigger();
//     state.dispose();
//     expect(onCancelledCalled).to.be.true;
//     state.clock.tick(10);
//     expect(state.isLoading).to.be.true; // this will still be true because after disposing, the state does not get updated again
//     expect(state.response).to.be.undefined;
//   }));

// });
