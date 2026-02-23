import type { WindowDefinitionState } from './InternalWindowModels';
import type { WindowDefinition } from './WindowsModels';

type DefinitionId = string;
type ManagerId = string;
type CombinedDefinitionAndManagerId = string;
type WindowId = string;

interface GlobalDefinition {
  definition: WindowDefinition<unknown[], unknown>;
  doNotPersist: boolean;
}

interface LocalDefinition {
  doNotPersist: boolean;
  renderer(definitionStates: WindowDefinitionState[]): void;
}

class WindowsDefinitionsManager {
  constructor() {
    this.#globalDefinitions = new Map();
    this.#localDefinitions = new Map();
    this.#instances = new Map();
    this.#windowIdToCombinedDefinitionId = new Map();
  }

  #globalDefinitions: Map<DefinitionId, GlobalDefinition>;
  #localDefinitions: Map<CombinedDefinitionAndManagerId, LocalDefinition>;
  #instances: Map<CombinedDefinitionAndManagerId, Map<string, WindowDefinitionState>>;
  #windowIdToCombinedDefinitionId: Map<WindowId, CombinedDefinitionAndManagerId>;

  /**
   * Register a window definition globally at createWindow time.
   * No need to render the window component as a child of Windows.
   */
  public registerGlobal<Args extends unknown[], CloseResponseType = unknown>(
    definitionId: DefinitionId,
    definition: WindowDefinition<Args, CloseResponseType>,
    doNotPersist: boolean,
  ): void {
    this.#globalDefinitions.set(definitionId, { definition: definition as WindowDefinition<unknown[], unknown>, doNotPersist });
  }

  public getGlobalDefinitionIds(): DefinitionId[] {
    return Array.from(this.#globalDefinitions.keys());
  }

  public getGlobalDefinition(definitionId: DefinitionId): GlobalDefinition | undefined {
    return this.#globalDefinitions.get(definitionId);
  }

  /**
   * Register a manager's ability to render a definition. Called when Windows mounts.
   */
  public registerManager(definitionId: DefinitionId, managerId: ManagerId, doNotPersist: boolean, renderer: (definitionStates: WindowDefinitionState[]) => void): void {
    const combinedKey = this.#combine(definitionId, managerId);
    this.#localDefinitions.set(combinedKey, { doNotPersist, renderer });
    this.#updateRenderers(combinedKey);
  }

  /**
   * Unregister a manager. Called when Windows unmounts.
   */
  public unregisterManager(definitionId: DefinitionId, managerId: ManagerId): void {
    const combinedKey = this.#combine(definitionId, managerId);
    this.#localDefinitions.delete(combinedKey);
  }

  /**
   * Unregister all managers for a given managerId. Called when Windows unmounts.
   */
  public unregisterAllManagers(managerId: ManagerId): void {
    for (const key of this.#localDefinitions.keys()) {
      if (key.endsWith(`:${managerId}`)) {
        this.#localDefinitions.delete(key);
      }
    }
  }

  /** @deprecated Use registerManager for new flow. Kept for backward compatibility with WindowDefinitionRenderer. */
  public register(props: { definitionId: DefinitionId; managerId: ManagerId; doNotPersist: boolean }, renderer: (definitionStates: WindowDefinitionState[]) => void): void {
    this.registerManager(props.definitionId, props.managerId, props.doNotPersist, renderer);
  }

  /** @deprecated Use unregisterManager. Kept for backward compatibility. */
  public unregister(definitionId: DefinitionId, managerId: ManagerId): void {
    this.unregisterManager(definitionId, managerId);
  }

  #instanceChangeCallbacks = new Map<ManagerId, Set<() => void>>();

  public addInstance(windowId: string, managerId: string, definitionId: string, windowTypeName?: string): void {
    const combinedKey = this.#combine(definitionId, managerId);
    const instances = this.#instances.getOrSet(combinedKey, () => new Map());
    instances.set(windowId, { windowId, managerId, windowTypeName });
    this.#windowIdToCombinedDefinitionId.set(windowId, combinedKey);
    this.#updateRenderers(combinedKey);
    this.#instanceChangeCallbacks.get(managerId)?.forEach(cb => cb());
  }

  public subscribeToInstanceChanges(managerId: ManagerId, callback: () => void): () => void {
    const callbacks = this.#instanceChangeCallbacks.getOrSet(managerId, () => new Set());
    callbacks.add(callback);
    return () => {
      callbacks.delete(callback);
      if (callbacks.size === 0) this.#instanceChangeCallbacks.delete(managerId);
    };
  }

  public getInstancesForManager(managerId: ManagerId): Array<{ definitionId: string; windowTypeName?: string; instances: WindowDefinitionState[] }> {
    const result: Array<{ definitionId: string; windowTypeName?: string; instances: WindowDefinitionState[] }> = [];
    for (const [combinedKey, instancesMap] of this.#instances) {
      const lastColon = combinedKey.lastIndexOf(':');
      const mid = combinedKey.slice(lastColon + 1);
      if (mid !== managerId) continue;
      const definitionId = combinedKey.slice(0, lastColon);
      const instances = Array.from(instancesMap.values());
      const windowTypeName = instances[0]?.windowTypeName;
      result.push({ definitionId, windowTypeName, instances });
    }
    return result;
  }

  public getDefinition(definitionId: DefinitionId, managerId: ManagerId): LocalDefinition | undefined {
    const combinedKey = this.#combine(definitionId, managerId);
    return this.#localDefinitions.get(combinedKey);
  }

  public removeInstance(windowId: string): void {
    const combinedKey = this.#windowIdToCombinedDefinitionId.get(windowId);
    if (combinedKey == null) return;
    const instances = this.#instances.get(combinedKey);
    if (instances == null) return;
    const lastColon = combinedKey.lastIndexOf(':');
    const managerId = combinedKey.slice(lastColon + 1);
    instances.delete(windowId);
    this.#windowIdToCombinedDefinitionId.delete(windowId);
    this.#updateRenderers(combinedKey);
    this.#instanceChangeCallbacks.get(managerId)?.forEach(cb => cb());
  }

  public removeAllInstancesForManager(managerId: ManagerId): void {
    const toRemove: string[] = [];
    for (const [windowId, combinedKey] of this.#windowIdToCombinedDefinitionId) {
      const lastColon = combinedKey.lastIndexOf(':');
      const mid = combinedKey.slice(lastColon + 1);
      if (mid === managerId) toRemove.push(windowId);
    }
    toRemove.forEach(windowId => this.removeInstance(windowId));
    this.#instanceChangeCallbacks.delete(managerId);
    this.unregisterAllManagers(managerId);
  }

  #updateRenderers(combinedKey: CombinedDefinitionAndManagerId): void {
    const definition = this.#localDefinitions.get(combinedKey);
    if (definition == null) return;
    const instances = this.#instances.get(combinedKey);
    if (instances == null) return;
    definition.renderer(Array.from(instances.values()));
  }

  #combine(definitionId: string, managerId: string): CombinedDefinitionAndManagerId {
    return `${definitionId}:${managerId}`;
  }
}

export const windowsDefinitionsManager = new WindowsDefinitionsManager();
