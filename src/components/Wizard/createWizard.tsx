import React, { useLayoutEffect, useState } from 'react';
import type { AnyObject } from '@anupheaus/common';
import { createComponent } from '../Component';
import { windowsDefinitionsManager } from '../Windows/WindowDefinitionsManager';
import { WindowsManager } from '../Windows/WindowsManager';
import type { ReactUIWindow, WindowDefinitionProps } from '../Windows/WindowsModels';
import type { WizardDefinition } from './WizardModels';
import { WizardRenderer } from './WizardRenderer';

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
  const component = createComponent(name, ({ doNotPersist = false, managerId: propsMgr, definitionId = name }: WindowDefinitionProps) => {
    const managerId = propsMgr ?? WindowsManager.getDefaultManagerId('windows');
    const [windows, setWindows] = useState<React.ReactNode[]>([]);

    useLayoutEffect(() => {
      windowsDefinitionsManager.register(
        { definitionId, managerId, doNotPersist },
        states => setWindows(
          states.map(state => (
            <WizardRenderer<Args, CloseResponseType>
              key={state.windowId}
              windowId={state.windowId}
              managerId={managerId}
              wizardDefinition={wizardDefinition}
            />
          ))
        ),
      );
      return () => windowsDefinitionsManager.unregister(definitionId, managerId);
    }, [definitionId, managerId, doNotPersist]); // eslint-disable-line react-hooks/exhaustive-deps

    return <>{windows}</>;
  }) as unknown as ReactUIWindow<Name, Args, CloseResponseType>;

  try {
    component.argsLength = getArgsLength(wizardDefinition);
  } catch {
    /* ignore */
  }
  Reflect.defineProperty(component, 'name', { get: () => name, enumerable: true, configurable: true });
  (component as AnyObject).definition = wizardDefinition;

  // Register globally so the definition can be looked up for restoration and isPersistable computation
  windowsDefinitionsManager.registerGlobal(name, (() => null) as any, false);

  return component;
}
