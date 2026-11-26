import type { MutableRefObject } from 'react';
import { useMemo, memo, useRef, useCallback, useEffect } from 'react';
import type { GReCaptcha, ReCaptchaState } from './RecaptchaModels';

export interface ReCaptchaProps {
  className?: string;
  sitekey: string;
  theme?: 'dark' | 'light';
  type?: 'image' | 'audio';
  tabindex?: number;
  size?: 'compact' | 'normal' | 'invisible';
  stoken?: string;
  hl?: string;
  badge?: 'bottomright' | 'bottomleft' | 'inline';
  isolated?: boolean;
  onChange?(token: string | undefined): void;
  onErrored?(): void;
  onExpired?(): void;
}

/** The props the script-loading wrapper accepts; it supplies `grecaptcha` itself. */
export interface ReCaptchaWrapperProps extends ReCaptchaProps {
  state: MutableRefObject<ReCaptchaState>;
}

interface Props extends ReCaptchaWrapperProps {
  grecaptcha: GReCaptcha;
}

export const ReCaptcha = memo(({
  className,
  sitekey,
  theme = 'light',
  type = 'image',
  tabindex = 0,
  size = 'normal',
  stoken,
  grecaptcha,
  badge = 'bottomright',
  hl,
  isolated,
  state,
  onChange,
  onExpired,
  onErrored,
}: Props) => {
  const renderCaptcha = useRef<(element: HTMLDivElement) => void>(() => void 0);
  const handleChange = useRef<(token: string) => void>(() => void 0);
  const handleExpired = useRef<() => void>(() => void 0);
  const handleErrored = useRef<() => void>(() => void 0);
  const widgetId = useRef<number | null>(null);

  useMemo(() => {
    state.current.execute = () => {
      if (grecaptcha == null) return Promise.reject(new Error('grecaptcha not loaded yet.'));
      if (widgetId.current == null) { state.current.requiresExecution = true; return state.current.promise; }
      grecaptcha.enterprise.execute(widgetId.current);
      return state.current.promise;
    };
    state.current.getValue = () => {
      if (grecaptcha == null) return null;
      if (widgetId.current == null) return null;
      return grecaptcha.enterprise.getResponse(widgetId.current);
    };
    state.current.getWidgetId = () => widgetId.current;
  }, [grecaptcha, state]);

  handleChange.current = (token: string) => {
    onChange?.(token);
    state.current.resolve(token);
  };
  handleExpired.current = () => {
    onExpired?.();
    onChange?.(undefined);
    state.current.reject(new Error('Token expired.'));
  };
  handleErrored.current = () => {
    onErrored?.();
    state.current.reject(new Error('Token errored.'));
  };

  renderCaptcha.current = (element: HTMLDivElement) => {
    if (element.children.length > 0) return;
    const wrapper = document.createElement('div');
    element.appendChild(wrapper);
    widgetId.current = grecaptcha.enterprise.render(wrapper, {
      sitekey,
      callback: (token: string) => handleChange.current(token),
      theme,
      type,
      tabindex,
      'expired-callback': () => handleExpired.current(),
      'error-callback': () => handleErrored.current(),
      size,
      stoken,
      hl,
      badge,
      isolated,
    });
  };

  const saveCaptchaElement = useCallback((element: HTMLDivElement | null) => {
    if (element == null) return;
    renderCaptcha.current(element);
  }, []);

  useEffect(() => {
    if (state.current.requiresExecution) state.current.execute();
  }, [state]);

  if (!grecaptcha) return null;

  return (
    <div ref={saveCaptchaElement} className={className} />
  );
});
