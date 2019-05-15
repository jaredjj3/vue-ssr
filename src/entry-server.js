import Vue from 'vue';
import createStore from './store/createStore';
import getComponent from './components/getComponent';
import createApp from './app/createApp';

/**
 * Returns a promise that resolves to a Vue instance that matches
 * the context's surrogate's componentName.
 *
 * @param {object} context
 * @return {Promise<Vue>}
 */
const createComponentVueInstance = (context) => {
  return new Promise((resolve, reject) => {
    const { surrogate } = context;
    const store = context.getStore(createStore);
    const component = getComponent(surrogate.componentName);

    if (!component) {
      reject({ code: 404, componentName: context.componentName });
    }

    const attrs = {};
    if (surrogate.id) {
      attrs.id = surrogate.id;
    }

    const app = new Vue({
      store,
      render: (createElement) => createElement(component, {
        attrs,
        props: surrogate.props,
      }),
    });

    resolve(app);
  });
};

/**
 * Returns a promise that resolves to an App Vue instance. This
 * function will also take the context and invoke the router
 * to be on the page that corresponds to it. If a redirect is
 * detected, it will reject the promise with the url it should
 * be directed to.
 *
 * @param {object} context
 * @return {Promise<Vue>}
 */
const createAppVueInstance = (context) => {
  return new Promise((resolve, reject) => {
    const { app, router, store } = createApp();

    // handle redirects
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

      // Call each matchedComponent's asyncData() function if it exists
      const promises = [];
      for (const matchedComponent of matchedComponents) {
        if (typeof matchedComponent.asyncData === 'function') {
          const promise = matchedComponent.asyncData({
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
  });
};
/**
 * This exported function will be called by bundleRenderer.renderToString().
 * This is where we perform data-prefetching to determine the state of our
 * application before actually rendering it. Since data fetching is async,
 * this function is expected to return a Promise that resolves to a Vue
 * instance.
 *
 * @param {object} context
 * @return {Promise<Vue>}
 */
export default (context) => {
  if (context.shouldRenderApp) {
    return createAppVueInstance(context);
  } else {
    return createComponentVueInstance(context);
  }
};
