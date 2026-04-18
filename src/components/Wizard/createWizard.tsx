import type { AnyObject } from '@anupheaus/common';
import { createComponent } from '../Component';
import { WindowDefinitionRenderer } from '../Windows/WindowDefinitionRenderer';
import { windowsDefinitionsManager } from '../Windows/WindowDefinitionsManager';
import type { ReactUIWindow, WindowDefinition, WindowDefinitionProps } from '../Windows/WindowsModels';
import type { WizardDefinition } from './WizardModels';
import { WizardContentComponent } from './WizardRenderer';

function getArgsLength(fn: (...args: any[]) => any): number {
  try {
    const str = fn.toString();
    const arrow = str.lastIndexOf(') =>');
    const block = str.lastIndexOf(') {');
    const end = arrow > block ? arrow : block;
    if (end === -1) return 0;
    let depth = 1;
    let i = end - 1;
    while (i >= 0 && depth > 0) {
      if (str[i] === ')') depth++;
      else if (str[i] === '(') depth--;
      i--;
    }
    const paramsStr = str.slice(i + 2, end).trim();
    if (paramsStr === '') return 0;
    let paramDepth = 0;
    let count = 1;
    for (let j = 0; j < paramsStr.length; j++) {
      const c = paramsStr[j];
      if (c === '(' || c === '[' || c === '{') paramDepth++;
      else if (c === ')' || c === ']' || c === '}') paramDepth--;
      else if (c === ',' && paramDepth === 0) count++;
    }
    return count;
  } catch {
    return 0;
  }
}

export function createWizard<Name extends string, Args extends unknown[], CloseResponseType = string | undefined>(
  name: Name,
  wizardDefinition: WizardDefinition<Args, CloseResponseType>,
): ReactUIWindow<Name, Args, CloseResponseType> {

  const windowDefinition: WindowDefinition<Args, CloseResponseType> = (_windowUtils) => (...args: Args) => (
    <WizardContentComponent args={args} wizardDefinition={wizardDefinition} />
  );

  const component = createComponent(name, ({ doNotPersist: propDoNotPersist = false, windowComponent, ...props }: WindowDefinitionProps) => (
    <WindowDefinitionRenderer
      {...props}
      name={name}
      doNotPersist={propDoNotPersist}
      definition={windowDefinition}
      definitionId={(props as AnyObject).definitionId}
      managerId={(props as AnyObject).managerId}
      windowComponent={windowComponent}
    />
  )) as unknown as ReactUIWindow<Name, Args, CloseResponseType>;

  try {
    component.argsLength = getArgsLength(wizardDefinition);
  } catch {
    /* ignore */
  }
  Reflect.defineProperty(component, 'name', { get: () => name, enumerable: true, configurable: true });
  (component as AnyObject).definition = wizardDefinition;

  windowsDefinitionsManager.registerGlobal(name, windowDefinition as WindowDefinition<unknown[], unknown>, false);

  return component;
}
