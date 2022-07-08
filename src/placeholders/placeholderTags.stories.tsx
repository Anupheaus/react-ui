// import { ReactNode } from 'react';
// import { storyUtils } from '../../storybook';
// import { anuxPureFC } from '../anuxComponents';
// import { createStyledTag } from '../Tag';
// import { createPlaceholders, usePlaceholders } from '.';

// const TestContainer = createStyledTag('TestContainer', {

// });

// interface FirstSectionProps {
//   title?: ReactNode;
// }

// const { FirstSection } = createPlaceholders({

//   FirstSection: anuxPureFC<FirstSectionProps>('FirstSection', ({
//     title,
//     children = null,
//   }) => {
//     return (
//       <div>
//         <span>{title}</span>
//         {children}
//       </div>
//     );
//   }),

// });


// const TestComponent = anuxPureFC('TestComponent', ({
//   children = null,
// }) => {
//   const { firstSections, ExtractPlaceholders } = usePlaceholders({
//     firstSections: FirstSection,
//   });
//   return (
//     <div>
//       <div data-id="data should be in here">
//         {firstSections.map(({ Component, props }, index) => <Component key={index} {...props} />)}
//       </div>
//       <ExtractPlaceholders>
//         {children}
//       </ExtractPlaceholders>
//     </div>
//   );
// });

// export default storyUtils.createMeta({
//   name: 'anux-react-utils/placeholderTags',
//   title: 'Placeholder Tags',
// });

// export const PlaceholderTags = storyUtils.createStory({
//   title: 'Placeholder Tags',
//   component: () => {
//     return (
//       <TestContainer>
//         <TestComponent>
//           <FirstSection title="hey">
//             <span>there!</span>
//           </FirstSection>
//         </TestComponent>
//       </TestContainer>
//     );
//   },
// });