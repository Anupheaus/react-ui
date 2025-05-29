import type { AnyObject } from '@anupheaus/common';
import { createComponent } from '../Component';
import { WindowDefinitionRenderer } from './WindowDefinitionRenderer';
import type { ReactUIWindow, WindowDefinition, WindowDefinitionProps } from './WindowsModels';

export function createWindow<Name extends string, Args extends unknown[], CloseResponseType = string | undefined>(name: Name, windowDefinition: WindowDefinition<Args, CloseResponseType>) {
  const component = createComponent(name, ({ doNotPersist, ...props }: WindowDefinitionProps) => (
    <WindowDefinitionRenderer {...props} name={name} doNotPersist={doNotPersist} definition={windowDefinition} definitionId={(props as AnyObject).definitionId} />
  )) as unknown as ReactUIWindow<Name, Args>;
  try { component.argsLength = windowDefinition({} as any).length; } catch (error) {    /* completely ignore errors here, we know they happen but we don't care at the moment.*/ }
  Reflect.defineProperty(component, 'name', { get: () => name, enumerable: true, configurable: true });
  return component;
}