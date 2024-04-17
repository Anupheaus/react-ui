import { AnyObject, DeferredPromise, PromiseState, Records, RecordsModifiedReason, Unsubscribe, bind, is } from '@anupheaus/common';
import { WindowEvents, WindowState } from './WindowsModels';

const windowManagers = new Map<string, WindowsManager>();

(window as AnyObject).windows = windowManagers;

export class WindowsManager {
  private constructor() {
    this.#windows = new Records();
    this.#events = new Records();
    this.#disabledNotifications = false;
  }

  #windows: Records<WindowState>;
  #events: Records<WindowEvents>;
  #disabledNotifications: boolean;

  public get entries() { return this.#windows.toArray(); }

  public static get(id: string) {
    const existingManager = windowManagers.get(id);
    if (existingManager) return existingManager;
    const newManager = new WindowsManager();
    windowManagers.set(id, newManager);
    return newManager;
  }

  @bind
  public async open(state: WindowState): Promise<void> {
    console.log('open', { state });
    if (this.#windows.get(state.id) != null) {
      console.log('already open');
      return this.focus(state.id);
    }
    console.log('opening');
    return this.#createEvent(state.id, 'opening', () => {
      console.log('added');
      this.#windows.add(state);
    });
  }

  public subscribeToStateChanges(callback: (states: WindowState[], reason: RecordsModifiedReason) => void): Unsubscribe;
  public subscribeToStateChanges(id: string, callback: (state: WindowState, reason: RecordsModifiedReason) => void): Unsubscribe;
  @bind
  public subscribeToStateChanges(...args: unknown[]): Unsubscribe {
    const callback = is.function(args[0]) ? args[0] : is.function(args[1]) ? args[1] : undefined;
    const id = is.string(args[0]) ? args[0] : undefined;
    if (callback == null) return () => void 0;
    return this.#windows.onModified((states, reason) => {
      if (id == null) {
        callback(this.#windows.toArray(), reason);
      } else {
        if (reason === 'reorder' || this.#disabledNotifications) return;
        const updatedState = states.findById(id);
        if (updatedState != null) callback(updatedState, reason);
      }
    });
  }

  public subscribeToEventChanges(id: string, callback: (events: WindowEvents) => void): Unsubscribe {
    return this.#events.onModified(events => {
      const matchingEvents = events.findById(id);
      if (matchingEvents != null) callback(matchingEvents);
    });
  }

  public updateStateWithoutNotifications(state: WindowState) {
    this.#disableNotifications(() => {
      this.#windows.update(state);
    });
  }

  public add(states: WindowState[]) {
    this.#windows.add(states);
  }

  public clear(): void {
    this.#windows.clear();
  }

  @bind
  public async focus(id: string): Promise<void> {
    this.#ensureGetId(id);
    const events = this.#events.get(id);
    if (events?.closing != null) return;
    if (events?.opening != null) return events.opening.then(() => this.focus(id));
    if (events?.focusing != null) return events.focusing;
    const ids = this.#windows.ids();
    if (ids.last() === id) return;
    return this.#createEvent(id, 'focusing', () => {
      const newIds = this.#windows.ids().remove(id).concat(id);
      this.#windows.reorder(newIds);
    });
  }

  @bind
  public async close(id: string): Promise<void> {
    this.#ensureGetId(id);
    try {
      await this.#createEvent(id, 'allowClosing');
    } catch {
      return;
    }
    await this.#createEvent(id, 'closing');
    this.#removeWindow(id);
  }

  @bind
  public async maximize(id: string): Promise<void> {
    const state = this.#ensureGetId(id);
    if (state.isMaximized === true) return;
    await Promise.whenAllSettled([this.focus(id), this.#createEvent(id, 'maximizing', () => {
      this.#windows.update({ ...state, isMaximized: true });
    })]);
  }

  @bind
  public async restore(id: string): Promise<void> {
    const state = this.#ensureGetId(id);
    if (state.isMaximized === false) return;
    await Promise.whenAllSettled([this.focus(id), this.#createEvent(id, 'restoring', () => {
      this.#windows.update({ ...state, isMaximized: false });
    })]);
  }

  public onFocused(id: string, callback: (isFocused: boolean) => void): Unsubscribe {
    return this.#windows.onModified((_, reason) => {
      if (reason === 'reorder') callback(this.#windows.ids().last() === id);
    });
  }

  public isFocused(id: string) {
    return this.#windows.ids().last() === id;
  }

  public get(id: string): WindowState {
    return this.#ensureGetId(id);
  }

  public endEvent(id: string, event: keyof Omit<WindowEvents, 'id'>): boolean {
    const events = this.#events.get(id);
    if (events == null) return false;
    const deferred = events[event];
    if (deferred == null) return false;
    deferred.resolve();
    delete events[event];
    return true;
  }

  #disableNotifications(callback: () => void) {
    try {
      this.#disabledNotifications = true;
      return callback();
    } finally {
      this.#disabledNotifications = false;
    }
  }

  async #createEvent(id: string, event: keyof Omit<WindowEvents, 'id'>, callback?: () => void) {
    const events = { ...(this.#events.get(id) ?? { id }) };
    const deferred = new DeferredPromise();
    events[event] = deferred;
    this.#events.upsert(events);
    if (event !== 'allowClosing') {
      setTimeout(() => {
        if (deferred.state !== PromiseState.Pending) return;
        // eslint-disable-next-line no-console
        console.warn(`Event ${event} for window ${id} took too long to resolve.`);
        deferred.resolve();
      }, 4000);
    }
    try {
      callback?.();
      await deferred;
    } finally {
      delete events[event];
    }
  }

  #ensureGetId(id: string): WindowState {
    const state = this.#windows.get(id);
    if (state == null) throw new Error(`Window with id ${id} not found.`);
    return state;
  }

  #removeWindow(id: string) {
    this.#windows.remove(id);
    const events = this.#events.get(id);
    this.#events.remove(id);
    if (events == null) return;
    events.closing?.resolve();
    events.focusing?.resolve();
    events.maximizing?.resolve();
    events.opening?.resolve();
    events.restoring?.resolve();
  }

}

