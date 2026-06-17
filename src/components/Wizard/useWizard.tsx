import type { ComponentType } from 'react';
import { useMemo } from 'react';
import { useWindow } from '../Windows/useWindow';
import type { ReactUIWindowOnly, UseWindowApiCommands, UseWindowApiCommandsWithId } from '../Windows/WindowsModels';
import type { InlineWizardProps } from './createInlineWizard';

type InlineCommand<Name extends string, Args extends unknown[], CloseResponseType> =
  { [K in `Inline${Name}`]: ComponentType<InlineWizardProps<Args, CloseResponseType>> };

export type UseWizardApiCommands<Name extends string, Args extends unknown[], CloseResponseType = string | undefined> =
  UseWindowApiCommands<Name, Args, CloseResponseType> & InlineCommand<Name, Args, CloseResponseType>;

export type UseWizardApiCommandsWithId<Name extends string, Args extends unknown[], CloseResponseType = string | undefined> =
  UseWindowApiCommandsWithId<Name, Args, CloseResponseType> & InlineCommand<Name, Args, CloseResponseType>;

export function useWizard<Name extends string, Args extends unknown[], CloseResponseType = string | undefined>(
  wizard: ReactUIWindowOnly<Name, Args, CloseResponseType>, id: string): UseWizardApiCommands<Name, Args, CloseResponseType>;
export function useWizard<Name extends string, Args extends unknown[], CloseResponseType = string | undefined>(
  wizard: ReactUIWindowOnly<Name, Args, CloseResponseType>): UseWizardApiCommandsWithId<Name, Args, CloseResponseType>;
export function useWizard<Name extends string, Args extends unknown[], CloseResponseType = string | undefined>(
  wizard: ReactUIWindowOnly<Name, Args, CloseResponseType>, id?: string,
): UseWizardApiCommands<Name, Args, CloseResponseType> | UseWizardApiCommandsWithId<Name, Args, CloseResponseType> {
  // Passing id (even undefined) is runtime-identical to omitting it in useWindow, so call it
  // unconditionally to satisfy the rules of hooks.
  const api = useWindow(wizard, id as string);
  const Inline = (wizard as { Inline?: ComponentType<InlineWizardProps<Args, CloseResponseType>> }).Inline;
  return useMemo(() => ({ ...api, [`Inline${wizard.name}`]: Inline }), [api, Inline, wizard.name]) as
    UseWizardApiCommands<Name, Args, CloseResponseType> | UseWizardApiCommandsWithId<Name, Args, CloseResponseType>;
}
