import { AnyObject } from 'anux-common';
import { ReactNode } from 'react';

interface Props {
  error?: unknown;
  message?: ReactNode;
  title?: ReactNode;
  meta?: AnyObject;
  isAsync?: boolean;
}

export class AnuxError extends Error {
  constructor({ error, message, title, meta, isAsync }: Props) {
    super('');
    Object.setPrototypeOf(this, new.target.prototype);
    if (error != null) {
      if (error instanceof Error) {
        message = error.message;
        title = error.name;
        this.stack = error.stack;
      }
    }
    this.name = new.target.name;
    this.#message = message ?? null;
    Reflect.defineProperty(this, 'message', { get: () => this.#message, configurable: true, enumerable: true });
    this.#title = title ?? null;
    this.#hasBeenHandled = false;
    this.#meta = meta;
    this.#isAsync = isAsync === true;
  }

  #message: ReactNode;
  #title: ReactNode;
  #hasBeenHandled: boolean;
  #meta: AnyObject | undefined;
  #isAsync: boolean;

  public get title() { return this.#title; }
  public get hasBeenHandled() { return this.#hasBeenHandled; }
  public get meta() { return this.#meta; }
  public get isAsync() { return this.#isAsync; }

  public markAsHandled(): void {
    this.#hasBeenHandled = true;
  }

  public toJSON() {
    return {
      ...(this.#meta ?? {}),
      name: this.name,
      title: this.#title,
      message: this.#message,
      hasBeenHandled: this.#hasBeenHandled,
      isAsync: this.#isAsync,
      stack: this.stack,
    };
  }
}
