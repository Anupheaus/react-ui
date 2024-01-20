import { ReactNode, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useBound } from '../../hooks';
import { ReactListItem } from '../../models';
import { createLegacyStyles } from '../../theme';
import { AssistiveLabel } from '../AssistiveLabel';
import { Button } from '../Button';
import { createComponent } from '../Component';
import { DialogsManager, useDialog } from '../Dialog';
import { DropDown } from '../DropDown';
import { Flex } from '../Flex';
import { Icon } from '../Icon';
import { useInputStyles } from '../InternalText/InputStyles';
import { Password } from '../Password';
import { PIN } from '../PIN';
import { SignInCredentials, SignInCredentialType } from './SignInDialogModels';

const useStyles = createLegacyStyles({
  errorLabel: {
    textAlign: 'center',
  },
});

const newCredentialsId = Math.uniqueId();

const newCredentialsItem = {
  id: newCredentialsId,
  text: 'New Credentials',
  signInRequired: 'password',
} as const;

interface Props {
  title: ReactNode;
  credentials?: SignInCredentials[];
  allowNewCredentials?: boolean;
  icon?: ReactNode;
  onSignIn(email: string, passwordOrPin: string, credentialType: SignInCredentialType): Promise<ReactNode | void | boolean>;
}

export function useSignInDialog() {
  const { Dialog, DialogActions, DialogContent, openDialog: openSignInDialog, closeDialog: closeSignInDialog } = useDialog();

  const SignInDialog = useMemo(() => createComponent('SignInDialog', ({
    title,
    credentials,
    icon,
    allowNewCredentials = false,
    onSignIn,
  }: Props) => {
    const { css: inputCss } = useInputStyles();
    const { css } = useStyles();
    const listItems = useMemo(() => (credentials ?? []).map(({ email, signInRequired }) => ({
      id: email,
      text: email,
      signInRequired,
    })).concat(...(allowNewCredentials ? [newCredentialsItem] : [])), [credentials]);
    const passwordOrPinRef = useRef<HTMLInputElement | null>(null);
    const [newCredentialsInputElement, saveNewCredentialsInputElement] = useState<HTMLInputElement | null>(null);

    const [email, setEmail] = useState(listItems[0]?.id ?? '');
    const [passwordOrPin, setPasswordOrPin] = useState('');

    const [emailError, setEmailError] = useState<ReactNode>();
    const [passwordOrPinError, setPasswordOrPinError] = useState<ReactNode>();
    const [signInError, setSignInError] = useState<ReactNode>();

    const signInCredentialType = useMemo<SignInCredentialType>(() => listItems.findById(email)?.signInRequired ?? 'password', [email, listItems]);

    const clearErrors = () => {
      if (passwordOrPinError != null) setPasswordOrPinError(null);
      if (emailError != null) setEmailError(null);
      if (signInError != null) setSignInError(null);
      passwordOrPinRef.current?.focus();
    };

    const handleSignIn = useBound(async () => {
      const actualEmail = email === newCredentialsId ? newCredentialsInputElement?.value ?? '' : email;
      if (actualEmail.length === 0) { return setEmailError('Your email is required.'); }
      if (passwordOrPin.length === 0) { return setPasswordOrPinError(`Your ${signInCredentialType === 'pin' ? 'PIN' : 'password'} is required.`); }
      if (signInCredentialType === 'pin' && passwordOrPin.replace(/\s/g, '').length !== 4) { return setPasswordOrPinError('Your PIN must be 4 digits.'); }
      setPasswordOrPin('');
      clearErrors();
      const result = await onSignIn(actualEmail, passwordOrPin, signInCredentialType);
      if (result === true || result == null) return closeSignInDialog();
      setSignInError(result);
    });

    const renderEmail = useBound((item: ReactListItem | undefined) => {
      if (item == null || item.id !== newCredentialsId) return;
      return <input ref={saveNewCredentialsInputElement} type="email" className={inputCss.input} />;
    });

    useLayoutEffect(() => {
      setPasswordOrPin('');
      clearErrors();
    }, [signInCredentialType]);

    useLayoutEffect(() => {
      if (email === newCredentialsId) newCredentialsInputElement?.focus();
    }, [email, newCredentialsInputElement]);

    return (
      <DialogsManager>
        <Dialog title={title} minHeight={278}>
          <DialogContent gap={4}>
            <Flex gap={24}>
              {icon ? icon : <Icon name="sign-in-dialog" size={48} />}
              <Flex gap={4} isVertical>
                <DropDown label="Email" values={listItems} value={email} onChange={setEmail} width={250} error={emailError} renderSelectedValue={renderEmail} />
                {signInCredentialType === 'password' && <Password ref={passwordOrPinRef} label={'Password'} value={passwordOrPin} onChange={setPasswordOrPin} error={passwordOrPinError} initialFocus />}
                {signInCredentialType === 'pin' && (
                  <PIN ref={passwordOrPinRef} label={'PIN'} value={passwordOrPin} onChange={setPasswordOrPin} onSubmit={handleSignIn} error={passwordOrPinError} initialFocus />
                )}
              </Flex>
            </Flex>
            <AssistiveLabel error={signInError} className={css.errorLabel} />

          </DialogContent>
          <DialogActions>
            <Button onClick={handleSignIn}>Sign In</Button>
          </DialogActions>
        </Dialog>
      </DialogsManager>
    );
  }), []);

  return {
    openSignInDialog,
    closeSignInDialog,
    SignInDialog,
  };
}