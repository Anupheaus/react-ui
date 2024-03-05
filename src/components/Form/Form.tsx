import { AnyObject, PromiseMaybe } from '@anupheaus/common';
import { ComponentProps, ReactNode, useContext, useEffect, useLayoutEffect } from 'react';
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

export interface FormProps<T extends AnyObject> extends Omit<ComponentProps<typeof Flex>, 'onChange' | 'tagName'> {
  children?: ReactNode;
  onBeforeSave?(data: T): PromiseMaybe<T>;
  onSave?(data: T): PromiseMaybe<T>;
  onChange?(data: T): void;
}

interface Props<T extends AnyObject> extends FormProps<T> {
}

export const Form = createComponent('Form', function <T extends AnyObject>({
  children = null,
  onBeforeSave,
  onSave,
  onChange,
  ...props
}: Props<T>) {
  const { css, join } = useStyles();
  const { onSave: contextOnSave, onBeforeSave: contextOnBeforeSave, current } = useContext(FormContext);

  useLayoutEffect(() => {
    if (onBeforeSave == null) return;
    return contextOnBeforeSave(onBeforeSave as Parameters<typeof contextOnBeforeSave>[0]);
  }, [onBeforeSave]);

  useEffect(() => current.onSet(current.proxy, ({ newValue }) => onChange?.(newValue as T), { includeSubProperties: true }), []);

  if (onSave) contextOnSave.current = onSave as typeof contextOnSave.current;

  return (
    <Flex gap={4} isVertical {...props} tagName="form" className={join(css.form, props.className)}>
      {children}
    </Flex>
  );
});
