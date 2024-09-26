import { createComponent } from '../Component';
import { WindowDefinitionRenderer } from './WindowDefinitionRenderer';
import type { ReactUIWindow, WindowDefinition, WindowDefinitionProps } from './WindowsModels';

export function createWindow<Name extends string, Args extends unknown[]>(name: Name, windowDefinition: WindowDefinition<Args>) {
  const definitionId = Math.uniqueId();
  const component = createComponent(name, ({ instanceId }: WindowDefinitionProps) => (
    <WindowDefinitionRenderer id={instanceId ?? 'default'} name={name} definitionId={definitionId} definition={windowDefinition} />
  )) as unknown as ReactUIWindow<Name, Args>;
  component.argsLength = windowDefinition({} as any).length;
  Reflect.defineProperty(component, 'name', { get: () => name, enumerable: true, configurable: true });
  Reflect.defineProperty(component, 'definitionId', { get: () => definitionId, enumerable: true, configurable: true });
  return component;
}