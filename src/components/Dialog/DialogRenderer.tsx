import { useMemo, useState } from 'react';
import { createComponent } from '../Component';
import { WindowState } from '../Windows';
import { DialogsManager } from './DialogsManager';

interface Props {
  managerId: string;
  state: WindowState;
}

export const DialogRenderer = createComponent('DialogRenderer', ({
  managerId,
  state,
}: Props) => {
  const manager = DialogsManager.get(managerId);
  const [content, setContent] = useState(useMemo(() => manager.get(state.id), []));

  manager.subscribeTo(state.id, newContent => setContent(newContent));

  return (<>
    {content}
  </>);
});