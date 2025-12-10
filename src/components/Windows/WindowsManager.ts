import type { AnyObject, RecordsModifiedReason, Unsubscribe } from '@anupheaus/common';
import { DeferredPromise, PromiseState, Records, bind } from '@anupheaus/common';
import type { WindowEvents, WindowState } from './WindowsModels';
import { windowsDefinitionsManager } from './WindowDefinitionsManager';
import type { ActiveWindowState } from './InternalWindowModels';

const windowManagers = new Map<string, WindowsManager>();

(window as AnyObject).windows = windowManagers;

export class WindowsManager {
  private constructor(id: string, instanceId: string) {
    this.#windows = new Records();
    this.#events = new Records();
    this.#disabledNotifications = false;
    this.#id = id;
    this.#instanceId = instanceId;
  }

  #windows: Records<WindowState>;
  #events: Records<WindowEvents>;
  #disabledNotifications: boolean;
  #id: string;
  #instanceId: string;

  public get entries() { return this.#windows.toArray(); }
  public get instanceId() { return this.#instanceId; }

  public static get(id: string) {
    const manager = windowManagers.get(id);
    if (manager == null) throw new Error(`Window manager with id "${id}" not found.`);
    return manager;
  }

  public static getOrCreate(id: string, instanceId: string) {
    const existingManager = windowManagers.get(id);
    if (existingManager != null) {
      if (existingManager.instanceId !== instanceId) throw new Error(`A Windows component with id "${id}" already exists.`);
      return existingManager;
    } else {
      const newManager = new WindowsManager(id, instanceId);
      windowManagers.set(id, newManager);
      return newManager;
    }
  }

  public static remove(id: string) {
    windowManagers.delete(id);
    windowsDefinitionsManager.removeInstance(id);
  }

  public getArgs<Args extends unknown[]>(id: string): Args {
    const state = this.#windows.get(id);
    if (state == null) throw new Error(`Window with id "${id}" not found when trying to retrieve the args.`);
    return state.args as Args;
  }

  @bind
  public async open(state: WindowState): Promise<void> {
    if (this.#windows.get(state.id) != null) return this.focus(state.id);
    windowsDefinitionsManager.addInstance(state.id, this.#id, state.definitionId);
    return this.#createEvent(state.id, 'opening', () => { this.#windows.add(state); });
  }

  public subscribeToStateChanges(id: string, callback: (state: ActiveWindowState, reason: RecordsModifiedReason, hasChanged: boolean) => void): Unsubscribe;
  public subscribeToStateChanges(callback: (states: ActiveWindowState[], reason: RecordsModifiedReason, hasChanged: boolean) => void): Unsubscribe;
  @bind
  public subscribeToStateChanges(...args: unknown[]): Unsubscribe {
    if (args.length === 1) {
      const callback = args[0] as (states: ActiveWindowState[], reason: RecordsModifiedReason, hasChanged: boolean) => void;
      return this.#windows.onModified((_, reason, allStates) => {
        // do not use disabled notifications here otherwise the state won't be saved in the windows component        
        callback(allStates.map(state => this.#ensureGetId(state.id)), reason, true);
      });
    } else if (args.length === 2) {
      const id = args[0] as string;
      const callback = args[1] as (state: ActiveWindowState, reason: RecordsModifiedReason, hasChanged: boolean) => void;
      const unsubscribe = this.#windows.onModified((states, reason, allStates) => {
        if (this.#disabledNotifications) return;
        const state = (allStates.findById(id) != null ? this.#ensureGetId(id) : states.findById(id)) as ActiveWindowState | WindowState | undefined;
        if (state == null) return;
        const hasChanged = states.findById(id) != null;
        callback({ isFocused: false, index: 0, ...state }, reason, hasChanged);
      });
      if (this.#windows.has(id)) callback(this.#ensureGetId(id), 'add', true);
      return unsubscribe;
    }
    throw new Error('Invalid arguments provided to subscribeToStateChanges.');
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
    states.forEach(state => {
      if (this.#windows.has(state.id)) return;
      this.open(state);
    });
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
  public async close(id: string, response?: unknown): Promise<void> {
    if (this.#isClosing(id)) return;
    this.#windows.update(id, state => ({ ...state, closingResponse: response }));
    try {
      await this.#createEvent(id, 'allowClosing');
    } catch {
      this.#windows.update(id, state => ({ ...state, closingResponse: undefined }));
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
      this.#windows.update(id, s => ({ ...s, isMaximized: true }));
    })]);
  }

  @bind
  public async restore(id: string): Promise<void> {
    const state = this.#ensureGetId(id);
    if (state.isMaximized === false) return;
    await Promise.whenAllSettled([this.focus(id), this.#createEvent(id, 'restoring', () => {
      this.#windows.update(id, s => ({ ...s, isMaximized: false }));
    })]);
  }

  public onFocused(id: string, callback: (isFocused: boolean) => void): Unsubscribe {
    return this.#windows.onModified((_, reason) => {
      if (reason === 'reorder') callback(this.isFocused(id));
    });
  }

  public isFocused(id: string) {
    return this.#windows.ids().last() === id;
  }

  public get(id: string): ActiveWindowState {
    return this.#ensureGetId(id);
  }

  public has(id: string): boolean {
    return this.#windows.has(id);
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

  #ensureGetId(id: string): ActiveWindowState {
    const state = this.#windows.get(id);
    if (state == null) throw new Error(`Window with id "${id}" not found.`);
    const definition = windowsDefinitionsManager.getDefinition(state.definitionId, this.#id);
    const ids = this.#windows.ids();
    const index = ids.indexOf(id);
    const isFocused = ids.last() === id;
    return {
      ...state,
      index,
      isFocused,
      isPersistable: definition?.doNotPersist !== true,
    };
  }

  #removeWindow(id: string) {
    windowsDefinitionsManager.removeInstance(id);
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

  #isClosing(id: string) {
    const state = this.#windows.get(id);
    if (state != null && state.closingResponse != null) return true;
    const events = this.#events.get(id);
    const allowClosing = events?.allowClosing;
    if (allowClosing != null && allowClosing.state === PromiseState.Pending) return true;
    const closing = events?.closing;
    if (closing != null && closing.state !== PromiseState.Rejected) return true;
    return false;
  }
}

