import type { AnyFunction, AnyObject } from '@anupheaus/common';
import { createComponent } from '../Component';
import { WindowDefinitionRenderer } from './WindowDefinitionRenderer';
import { windowsDefinitionsManager } from './WindowDefinitionsManager';
import type { ReactUIDialogOnlyWindow, ReactUIWindow, WindowDefinition, WindowDefinitionProps } from './WindowsModels';

/**
 * Parses a function's toString() and returns the parameter count of the last (innermost) function.
 * Handles nested arrow functions and function declarations, e.g. (utils) => (...args) => ...
 */
function getArgsLengthFromDefinitionString(fn: AnyFunction): number {
  const str = fn.toString();
  const arrow = str.lastIndexOf(') =>');
  const block = str.lastIndexOf(') {');
  const end = arrow > block ? arrow : block;
  if (end === -1) return 0;
  let depth = 1;
  let i = end - 1;
  while (i >= 0 && depth > 0) {
    const c = str[i];
    if (c === ')') depth++;
    else if (c === '(') depth--;
    i--;
  }
  const paramsStart = i + 1;
  const paramsStr = str.slice(paramsStart + 1, end).trim();
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
}

export interface CreateWindowOptions {
  doNotPersist?: boolean;
  /** When true, the definition can only be used with useDialog, never useWindow (e.g. confirmation dialogs). */
  dialogOnly?: boolean;
}

export function createWindow<Name extends string, Args extends unknown[], CloseResponseType = string | undefined>(
  name: Name,
  windowDefinition: WindowDefinition<Args, CloseResponseType>,
  options: CreateWindowOptions & { dialogOnly: true },
): ReactUIDialogOnlyWindow<Name, Args, CloseResponseType>;
export function createWindow<Name extends string, Args extends unknown[], CloseResponseType = string | undefined>(
  name: Name,
  windowDefinition: WindowDefinition<Args, CloseResponseType>,
  options?: CreateWindowOptions & { dialogOnly?: false },
): ReactUIWindow<Name, Args, CloseResponseType>;
export function createWindow<Name extends string, Args extends unknown[], CloseResponseType = string | undefined>(
  name: Name,
  windowDefinition: WindowDefinition<Args, CloseResponseType>,
  options: CreateWindowOptions = {},
): ReactUIWindow<Name, Args, CloseResponseType> {
  const { doNotPersist = false, dialogOnly = false } = options;
  const component = createComponent(name, ({ doNotPersist: propDoNotPersist, windowComponent, ...props }: WindowDefinitionProps) => (
    <WindowDefinitionRenderer {...props} name={name} doNotPersist={propDoNotPersist ?? doNotPersist} definition={windowDefinition}
      definitionId={(props as AnyObject).definitionId} managerId={(props as AnyObject).managerId} windowComponent={windowComponent} />
  )) as unknown as ReactUIWindow<Name, Args, CloseResponseType>;
  try {
    component.argsLength = getArgsLengthFromDefinitionString(windowDefinition);
  } catch {
    /* completely ignore errors here, we know they happen but we don't care at the moment.*/
  }
  Reflect.defineProperty(component, 'name', { get: () => name, enumerable: true, configurable: true });
  (component as AnyObject).definition = windowDefinition;
  if (dialogOnly) (component as AnyObject).dialogOnly = true;
  windowsDefinitionsManager.registerGlobal(name, windowDefinition, doNotPersist);
  return component as ReactUIWindow<Name, Args, CloseResponseType>;
}