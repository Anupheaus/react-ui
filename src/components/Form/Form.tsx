import { AnyObject, PromiseMaybe } from '@anupheaus/common';
import { ReactNode, useContext, useLayoutEffect } from 'react';
import { createLegacyStyles } from '../../theme';
import { createComponent } from '../Component';
import { Flex } from '../Flex';
import { FormContext } from './FormContext';

const useStyles = createLegacyStyles({
  form: {
    margin: 0,
    marginBlock: 0,
  },
});

export interface FormProps<T extends AnyObject> {
  children?: ReactNode;
  onBeforeSave?(data: T): PromiseMaybe<T>;
  onSave?(data: T): PromiseMaybe<T>;
}

interface Props<T extends AnyObject> extends FormProps<T> {
}

export const Form = createComponent('Form', function <T extends AnyObject>({
  children = null,
  onBeforeSave,
  onSave,
}: Props<T>) {
  const { css } = useStyles();
  const { onSave: contextOnSave, onBeforeSave: contextOnBeforeSave } = useContext(FormContext);

  useLayoutEffect(() => {
    if (onBeforeSave == null) return;
    return contextOnBeforeSave(onBeforeSave as Parameters<typeof contextOnBeforeSave>[0]);
  }, [onBeforeSave]);

  if (onSave) contextOnSave.current = onSave as typeof contextOnSave.current;

  return (
    <Flex tagName="form" isVertical gap={4} className={css.form}>
      {children}
    </Flex>
  );
});
