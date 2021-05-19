import { AnuxEvent } from './AnuxEvent';

export type OnEventType = <T extends AnuxEvent>(event: T) => void;