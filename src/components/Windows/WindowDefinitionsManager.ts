import type { WindowDefinitionState } from './InternalWindowModels';

type DefinitionId = string;
type ManagerId = string;
type CombinedDefinitionAndManagerId = string;
type WindowId = string;

interface RegistrationProps {
  definitionId: DefinitionId;
  managerId: ManagerId;
  doNotPersist: boolean;
}

interface WindowDefinition {
  doNotPersist: boolean;
  renderer(definitionStates: WindowDefinitionState[]): void;
}

class WindowsDefinitionsManager {
  constructor() {
    this.#definitions = new Map();
    this.#instances = new Map();
    this.#windowIdToCombinedDefinitionId = new Map();
  }

  #definitions: Map<CombinedDefinitionAndManagerId, WindowDefinition>;
  #instances: Map<CombinedDefinitionAndManagerId, Map<string, WindowDefinitionState>>;
  #windowIdToCombinedDefinitionId: Map<WindowId, CombinedDefinitionAndManagerId>;

  public register({ definitionId, managerId, doNotPersist }: RegistrationProps, renderer: (definitionStates: WindowDefinitionState[]) => void): void {
    const combinedKey = this.#combine(definitionId, managerId);
    this.#definitions.getOrSet(combinedKey, () => ({ doNotPersist, renderer }));
    this.#updateRenderers(combinedKey);
  }

  public unregister(definitionId: DefinitionId, managerId: ManagerId) {
    const combinedKey = this.#combine(definitionId, managerId);
    this.#definitions.delete(combinedKey);
  }

  public addInstance(windowId: string, managerId: string, definitionId: string) {
    const combinedKey = this.#combine(definitionId, managerId);
    const instances = this.#instances.getOrSet(combinedKey, () => new Map());
    instances.set(windowId, { windowId, managerId });
    this.#windowIdToCombinedDefinitionId.set(windowId, combinedKey);
    this.#updateRenderers(combinedKey);
  }

  public getDefinition(definitionId: DefinitionId, managerId: ManagerId) {
    const combinedKey = this.#combine(definitionId, managerId);
    return this.#definitions.get(combinedKey);
  }

  public removeInstance(windowId: string) {
    const combinedKey = this.#windowIdToCombinedDefinitionId.get(windowId);
    if (combinedKey == null) return;
    const instances = this.#instances.get(combinedKey);
    if (instances == null) return;
    instances.delete(windowId);
    this.#windowIdToCombinedDefinitionId.delete(windowId);
    this.#updateRenderers(combinedKey);
  }

  #updateRenderers(combinedKey: CombinedDefinitionAndManagerId) {
    const definition = this.#definitions.get(combinedKey);
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