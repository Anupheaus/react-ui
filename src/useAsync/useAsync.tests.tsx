// import React, { ReactElement, memo } from 'react';
// import { mount } from 'enzyme';
// import { AnyObject } from 'anux-common';
// import { useAsync, UseAsyncOptions, UseAsyncResultType } from './useAsync';

// interface IProps {
//   data: any;
//   options: UseAsyncOptions;
//   children(state: UseAsyncResultType): ReactElement;
//   onCancelled?(): void;
// }

// const AsyncTestComponent = memo<IProps>(({ children, data, options, onCancelled }) => {
//   const state = useAsync(hasBeenCancelled => async () => {
//     await Promise.delay(1);
//     if (hasBeenCancelled()) { onCancelled?.(); }
//     return data;
//   }, options);

//   return children(state);
// });

// const SyncTestComponent = memo<IProps>(({ children, data, options }) => {
//   const state = useAsync(() => () => {
//     return data;
//   }, options);
//   return children(state);
// });

// function setupTest({ data, options, onCancelled, isAsync = true }: { data?: AnyObject; options?: UseAsyncOptions; onCancelled?: () => void; isAsync?: boolean } = {}) {
//   const state = {
//     renderCount: 0,
//     result: undefined as UseAsyncResultType,
//     dispose() {
//       // eslint-disable-next-line @typescript-eslint/no-use-before-define
//       component.unmount();
//     },
//   };

//   const TestComponent = isAsync ? AsyncTestComponent : SyncTestComponent;

//   const component = mount((
//     <TestComponent data={data} options={options} onCancelled={onCancelled}>
//       {result => {
//         state.renderCount++;
//         state.result = result;
//         return null;
//       }}
//     </TestComponent>
//   ));

//   return state;
// }

// describe.only('useAsync', () => {

//   it('returns everything it is supposed to do correctly', async () => {
//     const { renderCount, result: [trigger, isBusy, cancelAll], dispose } = setupTest();

//     expect(trigger).to.be('function');
//     expect(isBusy).to.eq(false);
//     expect(cancelAll).to.be('function');
//     expect(renderCount).to.eq(1);

//     dispose();
//   });

//   // it('can call an async function', async () => {
//   //   const test = setupTest({ test: 1 });
//   //   expect(test.renderCount).to.eq(1);

//   //   await Promise.delay(10);

//   //   expect(test.renderCount).to.eq(2);
//   //   expect(test.result).to.eql({ test: 1 });

//   //   test.dispose();
//   // });

//   // it('will not update if returned after unmounted', async () => {
//   //   const test = setupTest({ test: 1 });
//   //   expect(test.renderCount).to.eq(1);

//   //   test.dispose();

//   //   await Promise.delay(10);

//   //   expect(test.renderCount).to.eq(1);
//   //   expect(test.result).to.undefined;
//   // });

//   // it('works even when the return value is not a promise', async () => {
//   //   const test = setupTest({ test: 1 }, false);
//   //   expect(test.renderCount).to.eq(2); // the useEffect is synchronous so it actually happens before we get the component back
//   //   expect(test.result).to.eql({ test: 1 });
//   //   expect(test.isBusy).to.be.false;
//   // });

// });
