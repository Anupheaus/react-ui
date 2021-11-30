import { AnuxEvent } from './AnuxEvent';
import { OnEventType } from './models';

export interface ContextProps<T extends AnuxEvent = AnuxEvent> {
  isParentAvailable: boolean;
  trigger: OnEventType<T>;
  registerListener(onEvent: OnEventType<T>): () => void;
}

