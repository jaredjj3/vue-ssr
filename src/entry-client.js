import 'es6-promise/auto';
import { createApp } from './app';

const app1 = createApp();
const app2 = createApp();

// prime the store with server-initialized state.
// the state is determined during SSR and inlined in the page markup.
if (window.__INITIAL_STATE__) {
  app1.store.replaceState(window.__INITIAL_STATE__);
  app2.store.replaceState(window.__INITIAL_STATE__);
}

// wait until router has resolved all async before hooks
// and async components...
app1.router.onReady(() => {
  app1.app.$mount('.foo', true);
});

app2.router.onReady(() => {
  app2.app.$mount('.bar', true);
});
