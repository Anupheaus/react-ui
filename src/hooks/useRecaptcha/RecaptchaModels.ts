export interface ReCaptchaState {
  execute(): Promise<string>;
  reset(): void;
  getValue(): string | null;
  getWidgetId(): number | null;
  promise: Promise<string>;
  resolve(token: string): void;
  reject(error: Error): void;
  requiresExecution: boolean;
}
