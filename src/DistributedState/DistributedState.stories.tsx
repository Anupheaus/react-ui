// import { Button, TextField } from '@material-ui/core';
// import { ChangeEvent, useRef, useState } from 'react';
// import { storyUtils } from '../../storybook';
// import { anuxPureFC } from '../anuxComponents';
// import { styles } from '../theme';
// import { Tag } from '../Tag';
// import { useBound } from '../useBound';
// import { createDistributedState, useDistributedState } from './DistributedState';

// export default storyUtils.createMeta({
//   name: 'anux-react-utils/useDistributedState',
//   title: 'useDistributedState',
// });

// interface TestState {
//   test: string;
// }

// const TestDistributedState = createDistributedState<{ test: string; }>();

// const TestModifier = anuxPureFC('TestModifier', () => {
//   const classes = styles.usePreDefined();
//   const { get, set } = useDistributedState(TestDistributedState);

//   const [testValue, setTestValue] = useState(get().test);

//   const handleTestValueChanged = useBound((event: ChangeEvent<HTMLInputElement>) => setTestValue(event.target.value));

//   const handleSetTestValue = useBound(() => set(s => ({ ...s, test: testValue })));

//   return (
//     <div className={classes.join(classes.flexNone)}>
//       <TextField
//         label="Test Value"
//         value={testValue}
//         onChange={handleTestValueChanged}
//       />
//       <Button onClick={handleSetTestValue}>Set</Button>
//     </div>
//   );
// });

// const TestReporter = anuxPureFC('TestReporter', () => {
//   const { getAndObserve } = useDistributedState(TestDistributedState);
//   const renderCountRef = useRef(0);

//   renderCountRef.current += 1;

//   return (
//     <div>
//       {renderCountRef.current}&nbsp;
//       {getAndObserve().test}
//     </div>
//   );
// });

// const TestProvider = anuxPureFC('TestProvider', ({
//   children = null,
// }) => {
//   const [state, setState] = useState<TestState>({ test: 'hey' });

//   return (
//     <TestDistributedState value={state} onChange={setState}>
//       {children}
//     </TestDistributedState>
//   );
// });

// export const useDistributedStateProviderTest = storyUtils.createStory({
//   title: 'useDistributedState - Provider',
//   component: () => {
//     const classes = styles.usePreDefined();

//     return (
//       <Tag name="distributed-state-test-container" className={classes.join(classes.flexNone, classes.flexVertical)}>
//         <TestProvider>
//           <TestModifier />
//           <TestReporter />
//         </TestProvider>
//       </Tag>
//     );
//   },
// });

// export const useDistributedStateHookTest = storyUtils.createStory({
//   title: 'useDistributedState - Hook',
//   component: () => {
//     const classes = styles.usePreDefined();
//     const { State: TestStateProvider } = useDistributedState(TestDistributedState, () => ({ test: 'boo' }));

//     return (
//       <Tag name="distributed-state-test-container" className={classes.join(classes.flexNone, classes.flexVertical)}>
//         <TestStateProvider>
//           <TestModifier />
//           <TestReporter />
//         </TestStateProvider>
//       </Tag>
//     );
//   },
// });
