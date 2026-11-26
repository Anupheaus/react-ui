/** The subset of the global `grecaptcha` (enterprise) API that the ReCaptcha component uses. */
export interface GReCaptcha {
  enterprise: {
    execute(widgetId: number): void;
    getResponse(widgetId: number): string | null;
    render(container: HTMLElement, options: object): number;
  };
}

/** Recaptcha's own config, read from `window.recaptchaOptions` before the script is loaded. */
export interface WindowWithRecaptchaOptions {
  recaptchaOptions?: {
    useRecaptchaNet?: boolean;
  };
}

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
