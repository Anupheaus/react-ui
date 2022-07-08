import { AnyObject } from 'anux-common';
import { useEffect, useMemo, useRef } from 'react';
import { AnuxFC, anuxPureFC } from '../anuxComponents';
import { AnuxPlaceholderContext, AnuxPlaceholderContextProps } from './context';
import { AnuxPlaceholderComponent } from './createPlaceholders';
import { useEnsureRefresh } from './useEnsureRefresh';

type ComponentPropsOf<T> = T extends AnuxFC<infer P> ? P : never;

interface ExtractPlaceholderDefinitions {
  [key: string]: AnuxPlaceholderComponent;
}

interface PlaceholdersFor<T extends AnuxFC> {
  Component: T;
  props: ComponentPropsOf<T>;
}

type UsePlaceholdersApi<T extends ExtractPlaceholderDefinitions> = {
  [K in keyof T]: PlaceholdersFor<T[K]>[];
} & { ExtractPlaceholders: AnuxFC; };

interface PlaceholderData {
  type: AnuxPlaceholderComponent;
  definition: AnuxFC;
  props: AnyObject;
}

export function usePlaceholders<T extends ExtractPlaceholderDefinitions>(definitions: T): UsePlaceholdersApi<T> {
  const refresh = useEnsureRefresh();
  const result: AnyObject = {};
  const registeredPlaceholders = useRef(new Map<string, PlaceholderData>()).current;

  result.ExtractPlaceholders = useMemo(() => anuxPureFC('ExtractPlaceholders', ({ children = null }) => {

    const context = useMemo<AnuxPlaceholderContextProps>(() => ({
      isValid: true,
      usePlaceholder: (id, type, definition, props) => {
        const existingData = registeredPlaceholders.get(id);
        useEffect(() => () => {
          registeredPlaceholders.delete(id);
          refresh();
        }, []);
        if (existingData && Reflect.areDeepEqual(existingData.props, props)) return;
        registeredPlaceholders.set(id, { type, definition, props });
        refresh();
      },
    }), []);

    return (
      <AnuxPlaceholderContext.Provider value={context}>
        {children}
      </AnuxPlaceholderContext.Provider>
    );
  }), []);
  Object.entries(definitions).forEach(([key, requiredType]) => {
    result[key] = registeredPlaceholders
      .toValuesArray()
      .filter(({ type }) => requiredType === type)
      .map(({ definition, props }) => ({ Component: definition, props }));
  });
  return result as UsePlaceholdersApi<T>;
}