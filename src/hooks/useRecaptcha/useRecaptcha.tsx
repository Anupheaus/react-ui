import { useMemo, useRef } from 'react';
import { ReCaptchaWrapper } from './RecaptchaWrapper';
import { createComponent } from '../../components/Component';
import { useBound } from '../useBound';
import { ReCaptchaState } from './RecaptchaModels';
import type { ReCaptchaProps } from './Recaptcha';
import { RecaptchaNotice } from './RecaptchaNotice';

function createState(): ReCaptchaState {
  let resolve: (token: string) => void = () => void 0;
  let reject: (error: Error) => void = () => void 0;
  const promise = new Promise<string>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  const state: ReCaptchaState = {
    execute: () => {
      state.requiresExecution = true;
      return state.promise;
    },
    reset: () => {
      state.promise = new Promise<string>((res, rej) => {
        state.resolve = res;
        state.reject = rej;
      });
    },
    getValue: () => null,
    getWidgetId: () => null,
    promise,
    resolve,
    reject,
    requiresExecution: false,
  };
  return state;
}

export function useRecaptcha() {
  const state = useRef<ReCaptchaState>(useMemo(() => createState(), []));

  const execute = useBound(() => state.current.execute());
  const reset = useBound(() => state.current.reset());
  const getValue = useBound(() => state.current.getValue());
  const getWidgetId = useBound(() => state.current.getWidgetId());

  const ReCaptcha = useMemo(() => createComponent('ReCaptcha', (props: ReCaptchaProps) => <ReCaptchaWrapper {...props as any} state={state} />), []);

  return {
    execute,
    reset,
    getValue,
    getWidgetId,
    ReCaptcha,
    ReCaptchaNotice: RecaptchaNotice,
  };
}