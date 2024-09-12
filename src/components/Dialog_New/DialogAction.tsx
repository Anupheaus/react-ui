import { ReactNode, useContext } from 'react';
import { createComponent } from '../Component';
import { Button } from '../Button';
import { PromiseMaybe } from '@anupheaus/common';
import { useBound } from '../../hooks';
import { DialogStateContext } from './dialogContexts';

interface Props {
  label?: ReactNode;
  value?: string;
  onClick?(): PromiseMaybe<void>;
}

export const DialogAction = createComponent('DialogAction', ({
  label = 'Okay',
  value = 'ok',
  onClick,
}: Props) => {
  const { closeWith } = useContext(DialogStateContext);

  const handleClick = useBound(async () => {
    if (onClick) await onClick();
    closeWith(value);
  });

  return (
    <Button onClick={handleClick}>{label}</Button>
  );
});
