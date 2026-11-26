import type { ComponentType } from 'react';
import type { ReCaptchaWrapperProps } from './Recaptcha';
import { ReCaptcha } from './Recaptcha';
import type { WindowWithRecaptchaOptions } from './RecaptchaModels';
import makeAsyncScriptLoader from 'react-async-script';

const callbackName = 'onloadcallback';
const globalName = 'grecaptcha';

const getOptions = () => (window as WindowWithRecaptchaOptions | undefined)?.recaptchaOptions ?? {};

function getURL() {
  const dynamicOptions = getOptions();
  const hostname = dynamicOptions.useRecaptchaNet ? 'recaptcha.net' : 'www.google.com';
  return `https://${hostname}/recaptcha/enterprise.js?onload=${callbackName}&render=explicit`;
}

// The loader injects `grecaptcha` once the script has loaded, so callers only pass ReCaptchaWrapperProps.
export const ReCaptchaWrapper = makeAsyncScriptLoader(getURL(), {
  callbackName,
  globalName,
})(ReCaptcha) as unknown as ComponentType<ReCaptchaWrapperProps>;
