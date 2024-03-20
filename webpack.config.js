const path = require('path');
const nodeExternals = require('webpack-node-externals');
// const TerserPlugin = require('terser-webpack-plugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');

const circularDeps = new Map();

module.exports = {
  entry: { index: './src/index.ts' },
  devtool: 'source-map',
  target: 'node',
  output: {
    path: path.resolve(__dirname, './dist'),
    libraryTarget: 'umd',
    library: 'react-ui',
  },
  module: {
    rules: [{
      test: /\.tsx?$/,
      loader: 'ts-loader',
      options: {
        onlyCompileBundledFiles: true,
        compilerOptions: {
          declaration: true,
          declarationDir: './dist',
          noEmit: false,
        },
      },
    }, {
      test: /\.js$/,
      use: ['source-map-loader'],
      enforce: 'pre'
    }],
  },
  // optimization: {
  //   minimize: true,
  //   minimizer: [
  //     new TerserPlugin(/*{
  //       parallel: true,
  //       terserOptions: {
  //         // keep_classnames: true,
  //         // keep_fnames: true,
  //         // sourceMap: true,
  //       },
  //     }*/),
  //   ],
  // },
  plugins: [
    new CircularDependencyPlugin({
      exclude: /node_modules/,
      failOnError: false,
      onDetected({ paths }) {
        paths.forEach((pathValue, index) => {
          if (pathValue.endsWith('index.ts') && index < paths.length - 1) {
            const nextPath = paths[index + 1];
            circularDeps.set(nextPath, (circularDeps.get(nextPath) ?? 0) + 1);
          }
        });
        // compilation.errors.push(new Error(paths.join('->')))
      },
      onEnd() {
        const entries = Array.from(circularDeps.entries());
        circularDeps.clear();
        entries.sort(([, count1], [, count2]) => count1 > count2 ? -1 : 1);
        // eslint-disable-next-line no-console
        console.log(entries.slice(0, 20).map(([pathValue, count]) => `${pathValue} ${count}`));
        // eslint-disable-next-line no-console
        console.log(`Found ${entries.length} circular dependencies`);
      },
    }),
  ],
  externals: [
    nodeExternals(),
  ],
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    alias: {
      '@anux/common': path.resolve(__dirname, '../common/src'),
    }
  },
  stats: {
    assets: false,
    cached: false,
    cachedAssets: false,
    children: false,
    chunks: false,
    chunkGroups: false,
    chunkModules: false,
    chunkOrigins: false,
    colors: true,
    depth: false,
    entrypoints: false,
    env: false,
    errors: true,
    errorDetails: true,
    hash: false,
    logging: 'error',
    modules: false,
    outputPath: false,
    performance: true,
    providedExports: false,
    publicPath: false,
    reasons: false,
    source: false,
    timings: true,
    usedExports: false,
    version: true,
    warnings: true,
  },
};

