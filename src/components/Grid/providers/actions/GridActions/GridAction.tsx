import { ReactNode, useContext, useLayoutEffect } from 'react';
import { createComponent } from '../../../../Component';
import { GridActionsContext } from './GridActionsContext';

interface Props {
  id: string;
  ordinal?: number;
  children: ReactNode;
}

export const GridAction = createComponent({
  id: 'GridAction',

  render({
    id,
    ordinal,
    children,
  }: Props) {
    const { actions } = useContext(GridActionsContext);

    useLayoutEffect(() => {
      actions.upsert({ id, text: id, label: children, ordinal });
      return () => actions.remove(id);
    }, [id, children]);

    return null;
  },

});
