import { AnyObject } from '@anupheaus/common';
import { useContext } from 'react';
import { AnuxFC, anuxPureFC } from '../anuxComponents';
import { useId } from '../hooks/useId';
import { AnuxPlaceholderContext } from './context';

const PlaceholderComponentSymbol = Symbol('PlaceholderComponent');

export type AnuxPlaceholderComponent<Props = {}> = AnuxFC<Props> & { [PlaceholderComponentSymbol]: true; };

type AnuxPlaceholderComponentOf<T extends AnuxFC> = T extends AnuxFC<infer P> ? AnuxPlaceholderComponent<P> : never;

interface AnuxPlaceholderTagDefinitions {
  [key: string]: AnuxFC;
}

type AnuxPlaceholderComponents<T extends AnuxPlaceholderTagDefinitions> = {
  [K in keyof T]: AnuxPlaceholderComponentOf<T[K]>;
};

export function createPlaceholders<T extends AnuxPlaceholderTagDefinitions>(definitions: T): AnuxPlaceholderComponents<T> {
  const result: AnyObject = {};
  Object.entries(definitions).forEach(([key, definition]) => {
    result[key] = anuxPureFC('', props => {
      const placeholderId = useId();
      const { isValid, usePlaceholder } = useContext(AnuxPlaceholderContext);
      if (!isValid) throw new Error('This placeholder has been rendered in an area that cannot be extracted.');
      usePlaceholder(placeholderId, result[key], definition, props);
      return null;
    });
  });
  return result as AnuxPlaceholderComponents<T>;
}

// export default createPlaceholderTags({
//   PreExpansionContent: {},
//   ExpansionContent: { canContainContent: false },
//   PostExpansionContent: {},
// });