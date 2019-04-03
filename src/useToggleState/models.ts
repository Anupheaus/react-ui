export interface IUseToggleStateResult {
  current: boolean;
  onChange(delegate: (value: boolean) => void | boolean): void;
  onEnable(delegate: () => void | boolean): void;
  onDisable(delegate: () => void | boolean): void;
  dispose(): void;
}
