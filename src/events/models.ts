import { PromiseMaybe } from 'anux-common';
import { AnuxEvent } from './AnuxEvent';

export type OnEventType<T extends AnuxEvent = AnuxEvent> = (event: T) => PromiseMaybe<void>;