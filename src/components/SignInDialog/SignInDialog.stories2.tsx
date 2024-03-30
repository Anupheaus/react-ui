// import { createStories } from '../../Storybook';
// import { useSignInDialog } from './useSignInDialog';
// import { Button } from '../Button';
// import { useBound } from '../../hooks';
// import { Flex } from '../Flex';
// import { SignInCredentials, SignInCredentialType } from './SignInDialogModels';

// const credentials: SignInCredentials[] = [
//   { email: 'email@tonyhales.co.uk', signInRequired: 'pin' },
//   { email: 'anupheaus@gmail.com', signInRequired: 'password' },
// ];

// createStories(() => ({
//   module,
//   name: 'Components/Sign In Dialog',
//   stories: {
//     'Sign In Dialog': {
//       width: 500,
//       height: 500,
//       component: () => {
//         const { SignInDialog, openSignInDialog } = useSignInDialog();

//         const handleSignIn = useBound(async (email: string, passwordOrPin: string, credentialType: SignInCredentialType) => {
//           if (passwordOrPin !== '1234') return `Invalid email or ${credentialType === 'pin' ? 'PIN' : 'password'}.`;
//           // eslint-disable-next-line no-console
//           console.log({ email, passwordOrPin, credentialType });
//         });

//         return (
//           <Flex isVertical>
//             <Flex fixedSize>
//               <Button onClick={openSignInDialog}>Open</Button>
//             </Flex>
//             <SignInDialog
//               title="Sign In Demo"
//               credentials={credentials}
//               allowNewCredentials
//               onSignIn={handleSignIn}
//             />
//           </Flex>
//         );
//       },
//     },
//   },
// }));
