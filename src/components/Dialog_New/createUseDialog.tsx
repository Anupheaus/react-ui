import { ComponentProps, useMemo, useState } from 'react';
import { DialogDefinition } from './dialogModels';
import { DialogStateContext, DialogStateContextProps } from './dialogContexts';
import { createComponent } from '../Component';
import { Dialog } from './Dialog';
import { DialogContent } from './DialogContent';
import { DialogActions } from './DialogActions';
import { DialogAction } from './DialogAction';
import { DeferredPromise } from '@anupheaus/common';
import { useBound, useDistributedState } from '../../hooks';

type Result<Name extends string, Args extends unknown[], Props extends {}> =
  { [key in `open${Name}`]: (...args: Args) => Promise<string | undefined>; } &
  { [key in `close${Name}`]: (value?: string) => void; } &
  { [key in Name]: (props: Props & ComponentProps<typeof Dialog>) => JSX.Element | null; };

interface DialogState<Args extends unknown[], Props extends {}> {
  isVisible: boolean;
  args: Args;
  props: Props;
  openPromise?: DeferredPromise<string | undefined>;
}

function createDialogAction(create: (props: ComponentProps<typeof DialogAction>) => JSX.Element | null) {
  return createComponent('DialogAction', create) as typeof DialogAction;
}

export function createUseDialog<Name extends string, Args extends unknown[], Props extends {}>(name: Name, dialogCreator: DialogDefinition<Name, Args, Props>): () => Result<Name, Args, Props> {
  return () => {
    const { state: globalState, modify } = useDistributedState<DialogState<Args, Props>>(() => ({ isVisible: false, args: [], props: {} }));

    const closeWith = useBound((value?: string) => {
      modify(s => {
        s.openPromise?.resolve(value);
        return {
          ...s,
          openPromise: undefined,
          isVisible: false,
        };
      });
    });

    return {
      [`open${name}`]: useBound((...args: Args) => {
        let openPromise = new DeferredPromise<string | undefined>();
        modify(s => {
          openPromise = s.openPromise ?? openPromise;
          return {
            ...s,
            openPromise,
            args,
            isVisible: true,
          };
        });
        return openPromise;
      }),
      [`close${name}`]: useBound((value?: string) => closeWith(value)),
      [name]: useMemo(() => createComponent('Dialog', (props: ComponentProps<typeof Dialog>) => {
        const { onChange, get } = useDistributedState(globalState);
        const [hashId, setHashId] = useState('');
        const [isVisible, setIsVisible] = useState(get().isVisible);
        onChange(s => {
          setHashId(Math.uniqueId());
          setIsVisible(s.isVisible);
        });

        const renderedDialog = useMemo(() => {
          const state = get();
          return dialogCreator({
            Dialog,
            Content: DialogContent,
            Actions: DialogActions,
            OkayButton: createDialogAction(p => <DialogAction {...p} value="ok" />),
          })(...state.args)({ ...state.props, ...props });
        }, [hashId]);

        const context = useMemo<DialogStateContextProps>(() => ({
          isVisible,
          closeWith,
        }), [isVisible]);

        return (
          <DialogStateContext.Provider value={context}>
            {renderedDialog}
          </DialogStateContext.Provider>
        );
      }), []),
    } as Result<Name, Args, Props>;
  };
}