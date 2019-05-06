const fs = require('fs');
const path = require('path');
const express = require('express');
const favicon = require('serve-favicon');
const compression = require('compression');
const { createBundleRenderer } = require('vue-server-renderer');

const resolve = (file) => path.resolve(__dirname, file);
const isProd = process.env.NODE_ENV === 'production';

const app = express();

const createRenderer = (bundle, options) => {
  // https://github.com/vuejs/vue/blob/dev/packages/vue-server-renderer/README.md#why-use-bundlerenderer
  return createBundleRenderer(bundle, Object.assign(options, {
    // this is only needed when vue-server-renderer is npm-linked
    basedir: resolve('./dist'),
    // recommended for performance
    runInNewContext: false,
  }));
};

let renderer;
let readyPromise;
const templatePath = resolve('./src/index.template.html');
if (isProd) {
  // In production: create server renderer using template and built server
  // bundle. The server bundle is generated by vue-ssr-webpack-plugin.
  const template = fs.readFileSync(templatePath, 'utf-8');
  const bundle = require('./dist/vue-ssr-server-bundle.json');
  // The client manifests are optional, but it allows the renderer
  // to automatically infer preload/prefetch links and directly add <script>
  // tags for any async chunks used during render, avoiding waterfall requests.
  const clientManifest = require('./dist/vue-ssr-client-manifest.json');
  renderer = createRenderer(bundle, {
    template,
    clientManifest,
  });
} else {
  // In development: setup the dev server with watch and hot-reload,
  // and create a new renderer on bundle / index template update.
  readyPromise = require('./setup-dev-server')(
      app,
      templatePath,
      (bundle, options) => {
        renderer = createRenderer(bundle, options);
      }
  );
}

const serve = (path) => express.static(resolve(path), {
  maxAge: isProd ? 1000 * 60 * 60 * 24 * 30 : 0,
});

app.use(compression({ threshold: 0 }));
app.use(favicon('./public/logo-48.png'));
app.use('/dist', serve('./dist', true));
app.use('/public', serve('./public', true));
app.use('/manifest.json', serve('./manifest.json', true));
app.use('/service-worker.js', serve('./dist/service-worker.js'));

const serverInfo =
  `express/${require('express/package.json').version} ` +
  `vue-server-renderer/${require('vue-server-renderer/package.json').version}`;

const render = (req, res) => {
  const start = Date.now();
  res.setHeader('Context-Type', 'text/html');
  res.setHeader('Server', serverInfo);

  const onError = (error) => {
    if (error.url) {
      res.redirect(error.url);
    } else if (error.code === 404) {
      res.status(404).send('404 | Page Not Found');
    } else {
      res.status(500).send('500 | Internal Server Error');
      console.error(`error during render: ${req.url}`);
      console.error(error);
    }
  };

  const onSuccess = (html) => {
    res.send(html);
    if (!isProd) {
      console.log(`request took ${Date.now() - start}ms`);
    }
  };

  const context = {
    title: 'vue-ssr',
    url: req.url,
  };

  renderer.renderToString(context, (error, html) => {
    if (error) {
      onError(error);
    } else {
      onSuccess(html);
    }
  });
};

const resolveThenRender = (req, res) => {
  readyPromise.then(() => render(req, res));
};

app.get('*', isProd ? render : resolveThenRender);
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`server started at localhost:${port}`);
});
