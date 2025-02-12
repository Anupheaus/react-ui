// import { createStories, StoryConfig } from '../../Storybook';
// import { useForm } from './useForm_old';
// import { FormField } from './FormField';
// import { Text } from '../Text';
// import { UIState } from '../../providers';
// import { useBound } from '../../hooks';
// import { createComponent } from '../Component';
// import { useFormState } from './useFormState';

// const form = {
//   forename: 'John',
//   surname: ''
// };

// const FormStatus = createComponent('FormStatus', () => {
//   const { isDirty, isValid } = useFormState();

//   return (
//     <table>
//       <tr><td>Is Dirty</td><td>{isDirty ? 'Yes' : 'No'}</td></tr>
//       <tr><td>Is Valid</td><td>{isValid ? 'Yes' : 'No'}</td></tr>
//     </table>
//   );
// });

// interface SimpleFormProps {
//   isLoading?: boolean;
// }

// function generateSimpleForm({ isLoading = false }: SimpleFormProps = {}): StoryConfig {
//   return {
//     component: () => {
//       const { data, Form, Toolbar } = useForm({ data: form });

//       const handleSave = useBound((newData: typeof form) => {
//         // eslint-disable-next-line no-console
//         console.log(newData);
//         return newData;
//       });

//       return (
//         <UIState isLoading={isLoading}>
//           <Form onSave={handleSave}>
//             <FormField component={Text} field={data.forename} width={300} label="Forename" isOptional />
//             <FormField component={Text} field={data.surname} width={300} label="Surname" />
//             <Toolbar />
//             <FormStatus />
//           </Form>
//         </UIState>
//       );
//     },
//   };
// }

// interface Props {
//   children: string;
// }

// createStories<Props>(() => ({
//   module,
//   name: 'Components/Form',
//   props: {
//     children: { type: 'string', defaultValue: 'Test', name: 'Label' },
//   },
//   stories: {
//     'Loading': generateSimpleForm({ isLoading: true }),
//     'Simple': generateSimpleForm(),
//   },
// }));
