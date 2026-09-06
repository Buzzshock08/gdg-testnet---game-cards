// Ensure window.fetch and globalThis.fetch are safe for polyfills in browser/iframe sandbox
try {
  const currentFetch = globalThis.fetch ? globalThis.fetch.bind(globalThis) : undefined;
  let activeFetch = currentFetch;
  Object.defineProperty(globalThis, 'fetch', {
    get: () => activeFetch || currentFetch,
    set: (fn) => {
      activeFetch = fn;
    },
    configurable: true,
    enumerable: true,
  });
} catch (_) {
  // Ignore if not reconfigurable
}

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
