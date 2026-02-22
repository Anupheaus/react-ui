const path = require('path');
const fs = require('fs');
const nodeExternals = require('webpack-node-externals');

const commonLocalPath = path.resolve(__dirname, '../common/src');
const useLocalCommon = fs.existsSync(commonLocalPath);
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
    clean: true,
  },
  module: {
    rules: [{
      test: /\.tsx?$/,
      loader: 'ts-loader',
      options: {
        ...(useLocalCommon ? {} : { configFile: 'tsconfig.prod.json' }),
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
        const cycle = paths.join(' -> ');
        circularDeps.set(cycle, (circularDeps.get(cycle) ?? 0) + 1);
      },
      onEnd() {
        const entries = Array.from(circularDeps.entries());
        circularDeps.clear();
        entries.sort(([, count1], [, count2]) => count1 > count2 ? -1 : 1);
        // eslint-disable-next-line no-console
        entries.forEach(([cycle]) => console.log('Cycle:', cycle));
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
    alias: useLocalCommon ? { '@anupheaus/common': commonLocalPath } : {},
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

