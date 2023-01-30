import * as ReactGlobal from 'react';
import * as ReactDOMGlobal from 'react-dom';

declare global {
  export const React: typeof ReactGlobal;
  export const ReactDOM: typeof ReactDOMGlobal;
}