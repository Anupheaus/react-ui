import type { WindowDefinitionState } from './InternalWindowModels';

type DefinitionId = string;
type DefinitionInstanceId = string;
type CombinedDefinitionAndDefinitionInstanceId = string;
type WindowId = string;

interface WindowDefinition {
  renderer(definitionStates: WindowDefinitionState[]): void;
}

class WindowsDefinitionsManager {
  constructor() {
    this.#definitions = new Map();
    this.#instances = new Map();
    this.#windowIdToCombinedDefinitionId = new Map();
  }

  #definitions: Map<CombinedDefinitionAndDefinitionInstanceId, WindowDefinition>;
  #instances: Map<CombinedDefinitionAndDefinitionInstanceId, WindowDefinitionState[]>;
  #windowIdToCombinedDefinitionId: Map<WindowId, CombinedDefinitionAndDefinitionInstanceId>;

  public register(definitionId: DefinitionId, definitionInstanceId: DefinitionInstanceId, renderer: (definitionStates: WindowDefinitionState[]) => void): void {
    const combinedKey = this.#combine(definitionId, definitionInstanceId);
    this.#definitions.getOrSet(combinedKey, () => ({ renderer }));
    this.#updateRenderers(combinedKey);
  }

  public unregister(definitionId: DefinitionId, definitionInstanceId: DefinitionInstanceId) {
    const combinedKey = this.#combine(definitionId, definitionInstanceId);
    this.#definitions.delete(combinedKey);
  }

  public addInstance(windowId: string, managerId: string, definitionId: string, definitionInstanceId: string) {
    const combinedKey = this.#combine(definitionId, definitionInstanceId);
    let instances = this.#instances.get(combinedKey);
    if (instances == null) { instances = []; this.#instances.set(combinedKey, instances); }
    const indexOf = instances.findIndex(state => state.windowId === windowId);
    if (indexOf == -1) {
      instances.push({ windowId, managerId });
      this.#windowIdToCombinedDefinitionId.set(windowId, combinedKey);
    } else {
      if (instances[indexOf].managerId === managerId) return;
      instances[indexOf] = { windowId, managerId };
    }
    this.#updateRenderers(combinedKey);
  }

  public removeInstance(windowId: string) {
    const combinedKey = this.#windowIdToCombinedDefinitionId.get(windowId);
    if (combinedKey == null) return;
    const instances = this.#instances.get(combinedKey);
    if (instances == null) return;
    const newInstances = instances.removeByFilter(state => state.windowId === windowId);
    if (newInstances.length == instances.length) return;
    this.#instances.set(combinedKey, newInstances);
    this.#windowIdToCombinedDefinitionId.delete(windowId);
    this.#updateRenderers(combinedKey);
  }

  #updateRenderers(combinedKey: CombinedDefinitionAndDefinitionInstanceId) {
    const definition = this.#definitions.get(combinedKey);
    if (definition == null) return;
    const instances = this.#instances.get(combinedKey);
    if (instances == null) return;
    definition.renderer(instances);
  }

  #combine(definitionId: string, definitionInstanceId: string): CombinedDefinitionAndDefinitionInstanceId {
    return `${definitionId}:${definitionInstanceId}`;
  }
}

export const windowsDefinitionsManager = new WindowsDefinitionsManager();