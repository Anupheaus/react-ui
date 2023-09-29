import { ReCaptcha } from './Recaptcha';
import makeAsyncScriptLoader from 'react-async-script';

const callbackName = 'onloadcallback';
const globalName = 'grecaptcha';

const getOptions = () => (window as any)?.recaptchaOptions ?? {};

function getURL() {
  const dynamicOptions = getOptions();
  const hostname = dynamicOptions.useRecaptchaNet ? 'recaptcha.net' : 'www.google.com';
  return `https://${hostname}/recaptcha/enterprise.js?onload=${callbackName}&render=explicit`;
}

export const ReCaptchaWrapper = makeAsyncScriptLoader(getURL(), {
  callbackName,
  globalName,
})(ReCaptcha);
