import Vue from 'vue';
import { createStore } from './store';
import getComponent from './components/getComponent';
import createApp from './app/createApp';

const renderComponent = (context) => (resolve, reject) => {
  const store = context.getStore(createStore);
  const component = getComponent(context.componentName);

  if (!component) {
    return resolve(
        new Vue({
          store,
          template: `<div></div>`,
        })
    );
  }

  const attrs = {};
  if (context.id) {
    attrs.id = context.id.toString();
  }

  const app = new Vue({
    store,
    render: (createElement) => createElement(component, {
      attrs,
      props: context.props,
    }),
  });

  resolve(app);
};

const renderPage = (context) => (resolve, reject) => {
  const { app, router, store } = createApp();

  const { url } = context;
  const { fullPath } = router.resolve(url).route;

  if (fullPath !== url) {
    return reject({ url: fullPath });
  }

  // set router's location
  router.push(url);

  router.onReady(() => {
    const matchedComponents = router.getMatchedComponents();

    // no matched routes
    if (matchedComponents.length === 0) {
      return reject({ code: 404 });
    }

    const promises = [];
    for (const matchedComponent of matchedComponents) {
      if (typeof matchedComponent.asyncData === 'function') {
        const promise = asyncData({
          store,
          route: router.currentRoute,
        });
        promises.push(promise);
      }
    }

    Promise.all(promises).then(() => {
      context.state = store.state;
      resolve(app);
    }).catch(reject);
  });
};

// This exported function will be called by `bundleRenderer`.
// This is where we perform data-prefetching to determine the
// state of our application before actually rendering it.
// Since data fetching is async, this function is expected to
// return a Promise that resolves to the app instance.
export default (context) => {
  const callback = context.isPage ? renderPage : renderComponent;
  return new Promise(callback(context));
};
