const fs = require('fs');
const path = require('path');
const MFS = require('memory-fs');
const webpack = require('webpack');
const chokidar = require('chokidar');
const clientConfig = require('./webpack.client.config');
const serverConfig = require('./webpack.server.config');

const readFile = (fs, file) => {
  try {
    return fs.readFileSync(path.join(clientConfig.output.path, file), 'utf-8');
  } catch (e) {
    console.error(e);
  }
};

module.exports = function setupDevServer(app, templatePath, callback) {
  let bundle;
  let template;
  let clientManifest;
  let ready;

  const readyPromise = new Promise((resolve, _reject) => ready = resolve);

  const update = () => {
    if (bundle && clientManifest) {
      ready();
      callback(bundle, {
        template,
        clientManifest,
      });
    }
  };

  // read template from disk and watch
  template = fs.readFileSync(templatePath, 'utf-8');
  chokidar.watch(templatePath).on('change', () => {
    template = fs.readFileSync(templatePath, 'utf-8');
    console.log('index.html template updated.');
    update();
  });

  // modify client config to work with hot middleware
  clientConfig.entry.app = [
    'webpack-hot-middleware/client',
    clientConfig.entry.app,
  ];
  clientConfig.output.filename = '[name].js';
  clientConfig.plugins.push(
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoEmitOnErrorsPlugin(),
  );

  // dev middleware
  const clientCompiler = webpack(clientConfig);
  const devMiddleware = require('webpack-dev-middleware')(clientCompiler, {
    publicPath: clientConfig.output.publicPath,
    noInfo: true,
  });
  app.use(devMiddleware);
  clientCompiler.plugin('done', (stats) => {
    stats = stats.toJson();
    stats.errors.forEach(console.error);
    stats.warnings.forEach(console.warn);
    if (stats.errors.length === 0) {
      clientManifest = JSON.parse(readFile(
          devMiddleware.fileSystem,
          'vue-ssr-client-manifest.json',
      ));
      update();
    }
  });

  // hot middleware
  app.use(require('webpack-hot-middleware')(clientCompiler, {heartbeat: 5000}));

  // watch and update server renderer
  const serverCompiler = webpack(serverConfig);
  const mfs = new MFS();
  serverCompiler.outputFileSystem = mfs;
  serverCompiler.watch({}, (error, stats) => {
    if (error) {
      throw error;
    }

    stats = stats.toJson();

    if (stats.errors.length === 0) {
      bundle = JSON.parse(readFile(mfs, 'vue-ssr-server-bundle.json'));
      update();
    }
  });

  return readyPromise;
};
