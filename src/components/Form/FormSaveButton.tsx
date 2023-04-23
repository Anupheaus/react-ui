import { ComponentProps } from 'react';
import { Button } from '../Button';
import { createComponent } from '../Component';
import { useFormState } from './useFormState';

interface Props extends ComponentProps<typeof Button> {

}

export const FormSaveButton = createComponent('FormSaveButton', ({
  children = 'Save',
  ...props
}: Props) => {
  const { save } = useFormState();

  return (
    <Button {...props} onSelect={save}>{children}</Button>
  );
});
