import { OnEventType } from './models';

export interface ContextProps {
  isParentAvailable: boolean;
  trigger: OnEventType;
  registerListener(onEvent: OnEventType): () => void;
}

